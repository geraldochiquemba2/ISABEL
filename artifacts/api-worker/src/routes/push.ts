import { Hono } from "hono";
import { db } from "../db";
import type { Env } from "../env";

export const pushRouter = new Hono<{ Bindings: Env }>();

// POST /api/push/register — guarda o token do dispositivo (iPhone).
// O envio é ativado quando houver chave APNs configurada (APNS_KEY_P8).
pushRouter.post("/register", async (c) => {
  try {
    const { token, platform } = await c.req.json();
    if (!token || typeof token !== "string" || token.length < 10 || token.length > 500) {
      return c.json({ error: "Token inválido" }, 400);
    }
    await db(c.env).query(
      `INSERT INTO push_tokens (token, platform) VALUES ($1, $2)
       ON CONFLICT (token) DO UPDATE SET platform = EXCLUDED.platform, created_at = NOW()`,
      [token, platform || "ios"]
    );
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao registar push" }, 500);
  }
});

// POST /api/push/send — envia notificação (precisa de APNS_KEY_P8 + APNS_KEY_ID + APNS_TEAM_ID).
// Sem chave, responde 501 honesto em vez de falhar em silêncio.
pushRouter.post("/send", async (c) => {
  try {
    // Segredos opcionais: via vars do wrangler quando existirem.
    const secrets = c.env as Env & { APNS_KEY_P8?: string; APNS_KEY_ID?: string; APNS_TEAM_ID?: string };
    const { title, body } = await c.req.json();
    if (!secrets.APNS_KEY_P8 || !secrets.APNS_KEY_ID || !secrets.APNS_TEAM_ID) {
      return c.json({ error: "Push ainda não configurado (falta chave APNs)" }, 501);
    }
    const rows = (await db(c.env).query("SELECT COUNT(*)::int AS count FROM push_tokens")) as any[];
    const count = rows[0]?.count ?? 0;
    // TODO: picks — enviar via APNs HTTP/2 com a chave quando existir volume real.
    return c.json({ error: "Envio APNs por implementar", devices: count, title, body }, 501);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro no push" }, 500);
  }
});
