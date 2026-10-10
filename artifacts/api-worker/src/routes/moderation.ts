import { Hono } from "hono";
import { db } from "../db";
import type { Env } from "../env";

export const moderationRouter = new Hono<{ Bindings: Env }>();

const DDL = [
  `CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    reporter_phone TEXT DEFAULT '',
    reporter_store_type TEXT DEFAULT '',
    target_type TEXT NOT NULL DEFAULT 'store',
    target_id TEXT NOT NULL DEFAULT '',
    reason TEXT NOT NULL DEFAULT '',
    status TEXT DEFAULT 'ABERTA',
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS blocks (
    id SERIAL PRIMARY KEY,
    phone TEXT NOT NULL,
    store_type TEXT NOT NULL DEFAULT 'collection',
    store_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(phone, store_type, store_id)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status)`,
  `CREATE INDEX IF NOT EXISTS idx_blocks_phone ON blocks(phone, store_type)`,
];

let ensured = false;
async function ensureTables(env: Env) {
  if (ensured) return;
  const d = db(env);
  for (const sql of DDL) await d.query(sql);
  ensured = true;
}

async function withTables<T>(env: Env, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e: any) {
    if (e?.code === "42P01" || String(e?.message || "").includes("does not exist")) {
      ensured = false;
      await ensureTables(env);
      return await fn();
    }
    throw e;
  }
}

// POST /api/moderation/reports — Denunciar loja ou produto.
moderationRouter.post("/reports", async (c) => {
  try {
    const { phone, storeType, targetType, targetId, reason } = await c.req.json();
    if (!targetId || !reason || String(reason).trim().length < 3) {
      return c.json({ error: "Indique o motivo da denúncia." }, 400);
    }
    const tt = targetType === "product" ? "product" : "store";
    await withTables(c.env, () =>
      db(c.env).query(
        `INSERT INTO reports (reporter_phone, reporter_store_type, target_type, target_id, reason)
         VALUES ($1, $2, $3, $4, $5)`,
        [String(phone || ""), String(storeType || "collection"), tt, String(targetId), String(reason).trim().slice(0, 500)]
      )
    );
    return c.json({ success: true });
  } catch (e) {
    console.error(e);
    return c.json({ error: "Erro ao registar denúncia." }, 500);
  }
});

// GET /api/moderation/blocks?phone=&store_type=
moderationRouter.get("/blocks", async (c) => {
  try {
    const phone = c.req.query("phone");
    const store_type = c.req.query("store_type") || "collection";
    if (!phone) return c.json([]);
    const rows = (await withTables(c.env, () =>
      db(c.env).query("SELECT store_id AS storeId FROM blocks WHERE phone=$1 AND store_type=$2", [phone, store_type])
    )) as any[];
    return c.json(rows.map((x) => x.storeId));
  } catch (e) {
    console.error(e);
    return c.json({ error: "Erro ao buscar bloqueios." }, 500);
  }
});

// POST /api/moderation/blocks — Bloquear loja
moderationRouter.post("/blocks", async (c) => {
  try {
    const { phone, storeType, storeId } = await c.req.json();
    if (!phone || !storeId) return c.json({ error: "Dados em falta." }, 400);
    await withTables(c.env, () =>
      db(c.env).query(
        `INSERT INTO blocks (phone, store_type, store_id) VALUES ($1, $2, $3)
         ON CONFLICT (phone, store_type, store_id) DO NOTHING`,
        [String(phone), String(storeType || "collection"), String(storeId)]
      )
    );
    return c.json({ success: true });
  } catch (e) {
    console.error(e);
    return c.json({ error: "Erro ao bloquear." }, 500);
  }
});

// DELETE /api/moderation/blocks — Desbloquear
moderationRouter.delete("/blocks", async (c) => {
  try {
    const { phone, storeType, storeId } = await c.req.json();
    await withTables(c.env, () =>
      db(c.env).query("DELETE FROM blocks WHERE phone=$1 AND store_type=$2 AND store_id=$3",
        [String(phone || ""), String(storeType || "collection"), String(storeId || "")])
    );
    return c.json({ success: true });
  } catch (e) {
    console.error(e);
    return c.json({ error: "Erro ao desbloquear." }, 500);
  }
});

// POST /api/moderation/imgfail — Telemetria de imagens que falham no cliente.
// Corpo: { url, stage } — guarda em reports para diagnóstico.
moderationRouter.post("/imgfail", async (c) => {
  try {
    const { url, stage } = await c.req.json();
    await withTables(c.env, () =>
      db(c.env).query(
        `INSERT INTO reports (reporter_phone, reporter_store_type, target_type, target_id, reason)
         VALUES ('', '', 'imgfail', $1, $2)`,
        [String(url || "").slice(0, 300), String(stage || "").slice(0, 50)]
      )
    );
    return c.json({ success: true });
  } catch (e) {
    console.error(e);
    return c.json({ error: "x" }, 500);
  }
});

// POST /api/moderation/admin/check-files — Diagnóstico: diz para cada fileId
// se o Telegram ainda o tem (getFile). Corpo: { ids: string[] } (máx 100).
moderationRouter.post("/admin/check-files", async (c) => {
  try {
    const { ids } = (await c.req.json()) as any;
    if (!Array.isArray(ids) || ids.length === 0 || ids.length > 100) {
      return c.json({ error: "Envie até 100 ids." }, 400);
    }
    const token = c.env.TELEGRAM_BOT_TOKEN;
    if (!token) return c.json({ error: "Sem token." }, 500);
    const out: Record<string, string> = {};
    for (const raw of ids) {
      const id = String(raw || "");
      if (!/^[\w-]{5,200}$/.test(id)) { out[id] = "invalid"; continue; }
      try {
        const r = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${id}`);
        const j = (await r.json()) as any;
        out[id] = j?.ok ? "alive" : "dead";
      } catch {
        out[id] = "error";
      }
    }
    return c.json(out);
  } catch (e) {
    console.error(e);
    return c.json({ error: "x" }, 500);
  }
});

// GET /api/moderation/admin/reports — Lista denúncias para o admin
moderationRouter.get("/admin/reports", async (c) => {
  try {
    const rows = (await withTables(c.env, () =>
      db(c.env).query("SELECT * FROM reports ORDER BY created_at DESC LIMIT 200")
    )) as any[];
    return c.json(rows);
  } catch (e) {
    console.error(e);
    return c.json({ error: "Erro ao buscar denúncias." }, 500);
  }
});

// PUT /api/moderation/admin/reports/:id — Resolver denúncia
moderationRouter.put("/admin/reports/:id", async (c) => {
  try {
    const { status } = await c.req.json();
    const st = status === "IGNORADA" ? "IGNORADA" : "RESOLVIDA";
    await withTables(c.env, () =>
      db(c.env).query("UPDATE reports SET status=$2 WHERE id=$1", [c.req.param("id"), st])
    );
    return c.json({ success: true });
  } catch (e) {
    console.error(e);
    return c.json({ error: "Erro ao resolver denúncia." }, 500);
  }
});
