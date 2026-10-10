import { Router } from "express";
import { pool } from "../db";

export const moderationRouter = Router();

// POST /api/moderation/reports — Denunciar loja ou produto.
// Corpo: { phone?, storeType?, targetType: 'store'|'product', targetId, reason }
moderationRouter.post("/reports", async (req, res) => {
  try {
    const { phone, storeType, targetType, targetId, reason } = req.body || {};
    if (!targetId || !reason || String(reason).trim().length < 3) {
      return res.status(400).json({ error: "Indique o motivo da denúncia." });
    }
    const tt = targetType === "product" ? "product" : "store";
    await pool.query(
      `INSERT INTO reports (reporter_phone, reporter_store_type, target_type, target_id, reason)
       VALUES ($1, $2, $3, $4, $5)`,
      [String(phone || ""), String(storeType || "collection"), tt, String(targetId), String(reason).trim().slice(0, 500)]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao registar denúncia." });
  }
});

// GET /api/moderation/blocks?phone=&store_type= — Lojas bloqueadas pelo utilizador
moderationRouter.get("/blocks", async (req, res) => {
  try {
    const { phone, store_type } = req.query as any;
    if (!phone) return res.json([]);
    const r = await pool.query(
      "SELECT store_id AS storeId FROM blocks WHERE phone=$1 AND store_type=$2",
      [String(phone), String(store_type || "collection")]
    );
    res.json(r.rows.map((x: any) => x.storeId));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar bloqueios." });
  }
});

// POST /api/moderation/blocks — Bloquear loja { phone, storeType, storeId }
moderationRouter.post("/blocks", async (req, res) => {
  try {
    const { phone, storeType, storeId } = req.body || {};
    if (!phone || !storeId) return res.status(400).json({ error: "Dados em falta." });
    await pool.query(
      `INSERT INTO blocks (phone, store_type, store_id) VALUES ($1, $2, $3)
       ON CONFLICT (phone, store_type, store_id) DO NOTHING`,
      [String(phone), String(storeType || "collection"), String(storeId)]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao bloquear." });
  }
});

// DELETE /api/moderation/blocks — Desbloquear { phone, storeType, storeId }
moderationRouter.delete("/blocks", async (req, res) => {
  try {
    const { phone, storeType, storeId } = req.body || {};
    await pool.query("DELETE FROM blocks WHERE phone=$1 AND store_type=$2 AND store_id=$3",
      [String(phone || ""), String(storeType || "collection"), String(storeId || "")]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao desbloquear." });
  }
});

// GET /api/moderation/admin/reports — Lista denúncias para o admin
moderationRouter.get("/admin/reports", async (req, res) => {
  try {
    const r = await pool.query("SELECT * FROM reports ORDER BY created_at DESC LIMIT 200");
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar denúncias." });
  }
});

// PUT /api/moderation/admin/reports/:id — Resolver denúncia { status: 'RESOLVIDA'|'IGNORADA' }
moderationRouter.put("/admin/reports/:id", async (req, res) => {
  try {
    const { status } = req.body || {};
    const st = status === "IGNORADA" ? "IGNORADA" : "RESOLVIDA";
    await pool.query("UPDATE reports SET status=$2 WHERE id=$1", [req.params.id, st]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao resolver denúncia." });
  }
});
