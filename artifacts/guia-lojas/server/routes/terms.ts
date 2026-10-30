import { Router } from "express";
import { pool } from "../db";

export const termsRouter = Router();

function cleanText(value: unknown, max = 120): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

// GET /api/terms/acceptance?phone=&store_type=&version=
termsRouter.get("/acceptance", async (req, res) => {
  try {
    const phone = cleanText(req.query.phone, 40);
    const storeType = cleanText(req.query.store_type, 40) || "collection";
    const version = cleanText(req.query.version, 40);
    if (!phone || !version) return res.status(400).json({ error: "Dados em falta" });

    const result = await pool.query(
      `SELECT accepted_at FROM terms_acceptances
       WHERE phone=$1 AND store_type=$2 AND version=$3 LIMIT 1`,
      [phone, storeType, version]
    );
    const row = result.rows[0];
    res.json({
      accepted: !!row,
      acceptedAt: row?.accepted_at ? new Date(row.accepted_at).toISOString() : null,
      version,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao consultar aceitação dos termos" });
  }
});

// POST /api/terms/accept { phone, storeType, version, acceptedAt }
termsRouter.post("/accept", async (req, res) => {
  try {
    const phone = cleanText(req.body?.phone, 40);
    const storeType = cleanText(req.body?.storeType, 40) || "collection";
    const version = cleanText(req.body?.version, 40);
    if (!phone || !version) return res.status(400).json({ error: "Dados em falta" });

    const parsedDate = req.body?.acceptedAt ? new Date(req.body.acceptedAt) : new Date();
    const acceptedAt = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

    await pool.query(
      `INSERT INTO terms_acceptances (phone, store_type, version, accepted_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (phone, store_type, version)
       DO UPDATE SET accepted_at = EXCLUDED.accepted_at`,
      [phone, storeType, version, acceptedAt.toISOString()]
    );
    // Registo auxiliar na conta (quando existir).
    await pool.query(
      `UPDATE users SET terms_accepted_at = $3 WHERE phone = $1 AND store_type = $2`,
      [phone, storeType, acceptedAt.toISOString()]
    ).catch(() => {});

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao guardar aceitação dos termos" });
  }
});
