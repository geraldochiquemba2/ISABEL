import { Router } from "express";
import { pool } from "../db";

export const pushRouter = Router();

// POST /api/push/register — guarda o token do dispositivo (iPhone).
// O envio é ativado quando houver chave APNs configurada (APNS_KEY_P8).
pushRouter.post("/register", async (req, res) => {
  try {
    const { token, platform } = req.body;
    if (!token || typeof token !== "string" || token.length < 10 || token.length > 500) {
      return res.status(400).json({ error: "Token inválido" });
    }
    await pool.query(
      `INSERT INTO push_tokens (token, platform) VALUES ($1, $2)
       ON CONFLICT (token) DO UPDATE SET platform = EXCLUDED.platform, created_at = NOW()`,
      [token, platform || "ios"]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao registar push" });
  }
});

// POST /api/push/send — envia notificação (precisa de APNS_KEY_P8 + APNS_KEY_ID + APNS_TEAM_ID).
// Sem chave, responde 501 honesto em vez de falhar em silêncio.
pushRouter.post("/send", async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!process.env.APNS_KEY_P8 || !process.env.APNS_KEY_ID || !process.env.APNS_TEAM_ID) {
      return res.status(501).json({ error: "Push ainda não configurado (falta chave APNs)" });
    }
    const { count } = (await pool.query("SELECT COUNT(*)::int AS count FROM push_tokens")).rows[0];
    // TODO: picks — enviar via APNs HTTP/2 com a chave quando existir volume real.
    res.status(501).json({ error: "Envio APNs por implementar", devices: count ?? 0, title, body });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no push" });
  }
});
