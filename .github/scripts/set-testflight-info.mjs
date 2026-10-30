import crypto from 'node:crypto';

const API = 'https://api.appstoreconnect.apple.com';
const BUNDLE_ID = process.env.BUNDLE_ID || 'pt.yesola.appstore';
const BUILD_NUMBER = String(process.env.BUILD_NUMBER || '140');

const FEEDBACK_EMAIL = process.env.BETA_FEEDBACK_EMAIL;
const REVIEW_FIRST = process.env.BETA_REVIEW_FIRST_NAME;
const REVIEW_LAST = process.env.BETA_REVIEW_LAST_NAME;
const REVIEW_PHONE = process.env.BETA_REVIEW_PHONE;
const REVIEW_EMAIL = process.env.BETA_REVIEW_EMAIL;

for (const [name, value] of Object.entries({
  ASC_ISSUER_ID: process.env.ASC_ISSUER_ID,
  ASC_KEY_ID: process.env.ASC_KEY_ID,
  ASC_PRIVATE_KEY: process.env.ASC_PRIVATE_KEY,
  BETA_FEEDBACK_EMAIL: FEEDBACK_EMAIL,
  BETA_REVIEW_FIRST_NAME: REVIEW_FIRST,
  BETA_REVIEW_LAST_NAME: REVIEW_LAST,
  BETA_REVIEW_PHONE: REVIEW_PHONE,
  BETA_REVIEW_EMAIL: REVIEW_EMAIL,
})) {
  if (!value) throw new Error(`Missing ${name}`);
}

const privateKeyPem = process.env.ASC_PRIVATE_KEY.replace(/\\n/g, '\n').trim() + '\n';
const privateKey = crypto.createPrivateKey(privateKeyPem);
const now = Math.floor(Date.now() / 1000);
const header = { alg: 'ES256', kid: process.env.ASC_KEY_ID, typ: 'JWT' };
const payload = { iss: process.env.ASC_ISSUER_ID, iat: now, exp: now + 900, aud: 'appstoreconnect-v1' };
const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
const signingInput = `${encode(header)}.${encode(payload)}`;
const signature = crypto.sign('sha256', Buffer.from(signingInput), {
  key: privateKey,
  dsaEncoding: 'ieee-p1363',
});
const jwt = `${signingInput}.${signature.toString('base64url')}`;

const redact = (value) => String(value)
  .replaceAll(FEEDBACK_EMAIL, '***')
  .replaceAll(REVIEW_EMAIL, '***')
  .replaceAll(REVIEW_PHONE, '***');

async function api(path, method = 'GET', body) {
  const response = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  if (!response.ok) {
    const detail = data?.errors?.map((error) => `${error.status} ${error.code || ''} ${error.title || ''} ${error.detail || ''}`).join(' | ') || data || text;
    const error = new Error(`${method} ${path} -> HTTP ${response.status}: ${redact(detail)}`);
    error.status = response.status;
    throw error;
  }
  return data;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  let app;
  const list = await api(`/v1/apps?filter[bundleId]=${encodeURIComponent(BUNDLE_ID)}&fields[apps]=name,bundleId,primaryLocale`);
  app = (list?.data || []).find((item) => item.attributes?.bundleId === BUNDLE_ID);
  if (!app) throw new Error(`App ${BUNDLE_ID} not found`);
  console.log(`App: ${app.attributes.name} (${app.attributes.bundleId}), id=${app.id}, primaryLocale=${app.attributes.primaryLocale}`);

  const localizations = (await api(`/v1/apps/${app.id}/betaAppLocalizations?fields[betaAppLocalizations]=locale,description,feedbackEmail&limit=200`))?.data || [];
  const defaultDescription = 'YESOLA - guia de lojas e servicos de Angola.';
  if (localizations.length === 0) {
    const locale = app.attributes.primaryLocale || 'pt-PT';
    await api('/v1/betaAppLocalizations', 'POST', {
      data: {
        type: 'betaAppLocalizations',
        attributes: { locale, description: defaultDescription, feedbackEmail: FEEDBACK_EMAIL },
        relationships: { app: { data: { type: 'apps', id: app.id } } },
      },
    });
    console.log(`beta app localization created: ${locale}`);
  } else {
    for (const localization of localizations) {
      const attributes = { feedbackEmail: FEEDBACK_EMAIL };
      if (!localization.attributes.description) attributes.description = defaultDescription;
      await api(`/v1/betaAppLocalizations/${localization.id}`, 'PATCH', {
        data: { type: 'betaAppLocalizations', id: localization.id, attributes },
      });
    }
    console.log(`feedback email set on ${localizations.length} beta app localization(s)`);
  }

  let reviewDetail = null;
  try {
    reviewDetail = (await api(`/v1/apps/${app.id}/betaAppReviewDetail?fields[betaAppReviewDetails]=contactFirstName,contactLastName,contactPhone,contactEmail,demoAccountRequired`))?.data;
  } catch (error) {
    if (error.status !== 404) throw error;
  }
  const reviewAttributes = {
    contactFirstName: REVIEW_FIRST,
    contactLastName: REVIEW_LAST,
    contactPhone: REVIEW_PHONE,
    contactEmail: REVIEW_EMAIL,
  };
  if (reviewDetail) {
    await api(`/v1/betaAppReviewDetails/${reviewDetail.id}`, 'PATCH', {
      data: { type: 'betaAppReviewDetails', id: reviewDetail.id, attributes: reviewAttributes },
    });
  } else {
    await api('/v1/betaAppReviewDetails', 'POST', {
      data: {
        type: 'betaAppReviewDetails',
        attributes: reviewAttributes,
        relationships: { app: { data: { type: 'apps', id: app.id } } },
      },
    });
  }
  console.log('beta app review info set');

  let build = null;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const builds = (await api(`/v1/builds?filter[app]=${app.id}&fields[builds]=version,processingState,expired,uploadedDate&limit=50&sort=-uploadedDate`))?.data || [];
    build = builds.find((item) => String(item.attributes.version) === BUILD_NUMBER) || null;
    if (build) {
      const state = build.attributes.processingState;
      console.log(`build ${BUILD_NUMBER}: ${state}`);
      if (state === 'VALID') break;
      if (state === 'FAILED' || state === 'INVALID') throw new Error(`Build ${BUILD_NUMBER} processing state is ${state}`);
    } else {
      console.log(`build ${BUILD_NUMBER} not visible yet (attempt ${attempt + 1}/40)`);
    }
    await sleep(15000);
  }
  if (!build || build.attributes.processingState !== 'VALID') throw new Error(`Build ${BUILD_NUMBER} did not become VALID`);
  if (build.attributes.expired) throw new Error(`Build ${BUILD_NUMBER} is expired`);

  const groups = (await api(`/v1/apps/${app.id}/betaGroups?fields[betaGroups]=name,isInternalGroup,createdDate&limit=200`))?.data || [];
  const internalGroups = groups.filter((group) => group.attributes?.isInternalGroup === true);
  if (internalGroups.length === 0) {
    console.log('no internal beta group found; build not assigned');
  } else {
    const group = internalGroups[0];
    try {
      await api(`/v1/betaGroups/${group.id}/relationships/builds`, 'POST', {
        data: [{ type: 'builds', id: build.id }],
      });
      console.log(`build ${BUILD_NUMBER} added to internal beta group "${group.attributes.name}"`);
    } catch (error) {
      if (error.status === 409) {
        console.log(`build ${BUILD_NUMBER} already in internal beta group "${group.attributes.name}"`);
      } else if (error.status === 422) {
        console.log(`internal group cannot be assigned via API (HTTP 422); internal testers receive builds automatically`);
      } else {
        throw error;
      }
    }
    const groupBuilds = (await api(`/v1/betaGroups/${group.id}/builds?fields[builds]=version,processingState&limit=50`))?.data || [];
    const inGroup = groupBuilds.some((item) => item.id === build.id);
    console.log(`build ${BUILD_NUMBER} listed in internal group "${group.attributes.name}": ${inGroup}`);
  }

  try {
    const buildLocalizations = (await api(`/v1/builds/${build.id}/betaBuildLocalizations?fields[betaBuildLocalizations]=locale,whatsNew&limit=50`))?.data || [];
    if (!buildLocalizations.some((item) => item.attributes?.locale === 'pt-PT')) {
      await api('/v1/betaBuildLocalizations', 'POST', {
        data: {
          type: 'betaBuildLocalizations',
          attributes: { locale: 'pt-PT', whatsNew: 'Primeira versao TestFlight.' },
          relationships: { build: { data: { type: 'builds', id: build.id } } },
        },
      });
      console.log('what to test set (pt-PT)');
    }
  } catch (error) {
    console.log(`what to test not set: ${error.message}`);
  }

  const finalLocalizations = (await api(`/v1/apps/${app.id}/betaAppLocalizations?fields[betaAppLocalizations]=locale,feedbackEmail&limit=200`))?.data || [];
  const finalReviewDetail = (await api(`/v1/apps/${app.id}/betaAppReviewDetail?fields[betaAppReviewDetails]=contactFirstName,contactLastName,contactPhone,contactEmail`))?.data;
  const feedbackOk = finalLocalizations.length > 0 && finalLocalizations.every((item) => Boolean(item.attributes.feedbackEmail));
  const reviewOk = Boolean(finalReviewDetail
    && finalReviewDetail.attributes.contactFirstName
    && finalReviewDetail.attributes.contactLastName
    && finalReviewDetail.attributes.contactPhone
    && finalReviewDetail.attributes.contactEmail);
  console.log(`VERIFY feedbackEmail=${feedbackOk} reviewInfo=${reviewOk}`);
  if (!feedbackOk || !reviewOk) throw new Error('Verification failed');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
