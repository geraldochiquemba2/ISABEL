import { Hono } from "hono";
import { db } from "../db";
import type { Env } from "../env";

export const statsRouter = new Hono<{ Bindings: Env }>();

// GET /api/stats — contadores reais
statsRouter.get("/", async (c) => {
  try {
    const [storesRows, categoriesRows] = await Promise.all([
      db(c.env).query(`
        SELECT COUNT(DISTINCT s.id) AS total
        FROM stores s
        JOIN users u ON u.store_id = s.id AND u.status = 'APROVADO'
      `) as Promise<any[]>,
      db(c.env).query(`SELECT COUNT(*) AS total FROM categories`) as Promise<any[]>,
    ]);

    return c.json({
      totalStores: parseInt(storesRows[0].total),
      totalCategories: parseInt(categoriesRows[0].total),
    });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao buscar estatísticas" }, 500);
  }
});
