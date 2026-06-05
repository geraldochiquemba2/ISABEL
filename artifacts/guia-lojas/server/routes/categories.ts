import { Router } from "express";
import { pool } from "../db";

export const categoriesRouter = Router();

// GET /api/categories — listar todas
categoriesRouter.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, 
        EXISTS(SELECT 1 FROM stores s WHERE s.category = c.name) as is_used,
        ARRAY(
          SELECT DISTINCT p.subcategory 
          FROM products p 
          JOIN stores s ON p.store_id = s.id 
          WHERE s.category = c.name AND p.subcategory IS NOT NULL
        ) as used_subcategories
      FROM categories c 
      ORDER BY c.name ASC
    `);
    res.json(result.rows.map(r => ({
      ...r,
      isUsed: r.is_used,
      usedSubcategories: r.used_subcategories || [],
      subcategories: Array.isArray(r.subcategories) ? r.subcategories : (typeof r.subcategories === 'string' && r.subcategories === '{}' ? [] : [])
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar categorias" });
  }
});

// POST /api/categories — criar
categoriesRouter.post("/", async (req, res) => {
  try {
    const { id, name, icon, coverImage, subcategories } = req.body;
    const subs = Array.isArray(subcategories) ? subcategories : [];
    const result = await pool.query(
      `INSERT INTO categories (id, name, icon, cover_image, subcategories) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id, name, icon, coverImage, subs]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar categoria" });
  }
});

// PUT /api/categories/:id — atualizar
categoriesRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, coverImage, subcategories } = req.body;
    const subs = Array.isArray(subcategories) ? subcategories : [];
    await pool.query(
      `UPDATE categories SET name=$2, icon=$3, cover_image=$4, subcategories=$5 WHERE id=$1`,
      [id, name, icon, coverImage, subs]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar categoria" });
  }
});

// DELETE /api/categories/:id — remover
categoriesRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM categories WHERE id=$1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao remover categoria" });
  }
});
