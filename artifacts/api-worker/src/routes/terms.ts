import { Hono } from "hono";
import { db } from "../db";
import type { Env } from "../env";

export const termsRouter = new Hono<{ Bindings: Env }>();

let tableReady = false;

async function ensureTable(env: Env) {
  if (tableReady) return;
  await db(env).query(
    `CREATE TABLE IF NOT EXISTS terms_acceptances (
      id            SERIAL PRIMARY KEY,
      phone         TEXT NOT NULL,
      store_type    TEXT NOT NULL DEFAULT 'collection',
      version       TEXT NOT NULL,
      accepted_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(phone, store_type, version)
    )`
  );
  await db(env).query(
    `CREATE INDEX IF NOT EXISTS idx_terms_acceptances_lookup ON terms_acceptances(phone, store_type, version)`
  );
  tableReady = true;
}

function cleanText(value: unknown, max = 120): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

// GET /api/terms/acceptance?phone=&store_type=&version=
termsRouter.get("/acceptance", async (c) => {
  try {
    const phone = cleanText(c.req.query("phone"), 40);
    const storeType = cleanText(c.req.query("store_type"), 40) || "collection";
    const version = cleanText(c.req.query("version"), 40);
    if (!phone || !version) return c.json({ error: "Dados em falta" }, 400);

    await ensureTable(c.env);
    const rows = (await db(c.env).query(
      `SELECT accepted_at FROM terms_acceptances
       WHERE phone=$1 AND store_type=$2 AND version=$3 LIMIT 1`,
      [phone, storeType, version]
    )) as any[];
    const row = rows[0];
    return c.json({
      accepted: !!row,
      acceptedAt: row?.accepted_at ? new Date(row.accepted_at).toISOString() : null,
      version,
    });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao consultar aceitação dos termos" }, 500);
  }
});

// POST /api/terms/accept { phone, storeType, version, acceptedAt }
termsRouter.post("/accept", async (c) => {
  try {
    const body = (await c.req.json()) as any;
    const phone = cleanText(body?.phone, 40);
    const storeType = cleanText(body?.storeType, 40) || "collection";
    const version = cleanText(body?.version, 40);
    if (!phone || !version) return c.json({ error: "Dados em falta" }, 400);

    const parsedDate = body?.acceptedAt ? new Date(body.acceptedAt) : new Date();
    const acceptedAt = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

    await ensureTable(c.env);
    await db(c.env).query(
      `INSERT INTO terms_acceptances (phone, store_type, version, accepted_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (phone, store_type, version)
       DO UPDATE SET accepted_at = EXCLUDED.accepted_at`,
      [phone, storeType, version, acceptedAt.toISOString()]
    );
    try {
      await db(c.env).query(
        `UPDATE users SET terms_accepted_at = $3 WHERE phone = $1 AND store_type = $2`,
        [phone, storeType, acceptedAt.toISOString()]
      );
    } catch {
      /* registo auxiliar opcional */
    }

    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao guardar aceitação dos termos" }, 500);
  }
});
