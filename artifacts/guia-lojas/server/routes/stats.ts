import { Router } from "express";
import { pool } from "../db";

export const statsRouter = Router();

// GET /api/stats — contadores reais
statsRouter.get("/", async (_req, res) => {
  try {
    const [storesResult, categoriesResult] = await Promise.all([
      pool.query(`
        SELECT COUNT(DISTINCT s.id) AS total
        FROM stores s
        JOIN users u ON u.store_id = s.id AND u.status = 'APROVADO'
      `),
      pool.query(`SELECT COUNT(*) AS total FROM categories`),
    ]);

    res.json({
      totalStores: parseInt(storesResult.rows[0].total),
      totalCategories: parseInt(categoriesResult.rows[0].total),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar estatísticas" });
  }
});
