import { TERMS_META } from "@/data/termsContent";

// Versão dos Termos e Condições (documento em src/data/termsContent.ts).
// Sempre que houver uma alteração importante, incrementar TERMS_META.version:
// quem aceitou a versão anterior volta a ver o pedido de aceitação.
export const TERMS_VERSION = TERMS_META.version;

const BROWSER_KEY = "yesola_terms_browser";

export interface TermsAcceptance {
  version: string;
  acceptedAt: string;
}

export interface TermsViewer {
  phone?: string;
  storeType?: string;
  storeId?: string;
}

function readViewer(): TermsViewer | null {
  try {
    const raw = localStorage.getItem("guialocal_user");
    if (!raw) return null;
    const v = JSON.parse(raw);
    if (v && typeof v === "object") return v as TermsViewer;
  } catch {
    /* sem sessão */
  }
  return null;
}

function accountKey(): string | null {
  const v = readViewer();
  if (!v?.phone) return null;
  return `yesola_terms:${v.phone}:${v.storeType || "collection"}`;
}

function readAcceptance(key: string): TermsAcceptance | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.version === "string" && typeof parsed.acceptedAt === "string") {
      return parsed;
    }
  } catch {
    /* ignora */
  }
  return null;
}

function writeAcceptance(key: string, record: TermsAcceptance) {
  try {
    localStorage.setItem(key, JSON.stringify(record));
  } catch {
    /* armazenamento indisponível */
  }
}

export function getTermsAcceptance(): TermsAcceptance | null {
  const key = accountKey();
  const fromAccount = key ? readAcceptance(key) : null;
  if (fromAccount) return fromAccount;
  return readAcceptance(BROWSER_KEY);
}

export function hasAcceptedTerms(version = TERMS_VERSION): boolean {
  const key = accountKey();
  if (key && readAcceptance(key)?.version === version) return true;
  return readAcceptance(BROWSER_KEY)?.version === version;
}

export function saveTermsAcceptanceLocal(acceptedAt: string, version = TERMS_VERSION) {
  const record: TermsAcceptance = { version, acceptedAt };
  writeAcceptance(BROWSER_KEY, record);
  const key = accountKey();
  if (key) writeAcceptance(key, record);
}

export async function persistTermsAcceptance(acceptedAt: string, version = TERMS_VERSION): Promise<void> {
  saveTermsAcceptanceLocal(acceptedAt, version);
  const viewer = readViewer();
  if (!viewer?.phone) return;
  try {
    await fetch("/api/terms/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: viewer.phone,
        storeType: viewer.storeType || "collection",
        version,
        acceptedAt,
      }),
    });
  } catch {
    /* aceitação local fica guardada mesmo sem rede */
  }
}

export async function syncTermsAcceptanceFromAccount(): Promise<boolean> {
  if (hasAcceptedTerms()) return true;
  const viewer = readViewer();
  if (!viewer?.phone) return false;
  try {
    const qs = new URLSearchParams({
      phone: viewer.phone,
      store_type: viewer.storeType || "collection",
      version: TERMS_VERSION,
    });
    const res = await fetch(`/api/terms/acceptance?${qs.toString()}`);
    if (!res.ok) return false;
    const data = await res.json();
    if (data?.accepted && typeof data.acceptedAt === "string") {
      saveTermsAcceptanceLocal(data.acceptedAt, TERMS_VERSION);
      return true;
    }
  } catch {
    /* offline: mantém o estado local */
  }
  return false;
}
