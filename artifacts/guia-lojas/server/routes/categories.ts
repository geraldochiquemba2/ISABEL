import { Router } from "express";
import { pool } from "../db";

export const categoriesRouter = Router();

// GET /api/categories — listar todas (?store_type= filtra por vertical)
categoriesRouter.get("/", async (req, res) => {
  try {
    const { store_type } = req.query;
    const params: unknown[] = [];
    let where = "";
    if (store_type) {
      params.push(store_type);
      where = `WHERE c.store_type = $1`;
    }
    const result = await pool.query(
      `
      SELECT c.*,
        EXISTS(SELECT 1 FROM stores s WHERE s.category = c.name OR c.name = ANY(s.categories)) as is_used,
        ARRAY(
          SELECT DISTINCT p.subcategory
          FROM products p
          JOIN stores s ON p.store_id = s.id
          WHERE (s.category = c.name OR c.name = ANY(s.categories)) AND p.subcategory IS NOT NULL
        ) as used_subcategories
      FROM categories c
      ${where}
      ORDER BY c.created_at ASC
    `,
      params
    );
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

// Contagem de uso de uma categoria (lojas por nome + produtos por nome).
// Regra do negócio: categoria em uso não se apaga, só se edita.
async function countCategoryUsage(name: string): Promise<{ stores: number; products: number }> {
  const s = await pool.query(
    `SELECT COUNT(*)::int AS n FROM stores WHERE category = $1 OR $1 = ANY(categories)`,
    [name]
  );
  const p = await pool.query(
    `SELECT COUNT(*)::int AS n FROM products WHERE category = $1`,
    [name]
  );
  return { stores: Number(s.rows[0]?.n || 0), products: Number(p.rows[0]?.n || 0) };
}

// POST /api/categories — criar (gera id se não vier; antes o id NULL
// rebentava o INSERT e nada se conseguia criar)
categoriesRouter.post("/", async (req, res) => {
  try {
    const { id, name, icon, coverImage, subcategories, store_type, intro } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: "Nome é obrigatório" });
    }
    const subs = Array.isArray(subcategories) ? subcategories : [];
    const newId = (id && String(id).trim()) || String(name).toLowerCase().trim()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
      .slice(0, 60) + "-" + Math.random().toString(36).slice(2, 7);
    const result = await pool.query(
      `INSERT INTO categories (id, name, icon, cover_image, subcategories, store_type, intro)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [newId, String(name).trim(), icon || null, coverImage || null, subs, store_type || null, intro || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar categoria" });
  }
});

// PUT /api/categories/:id — atualizar (merge: só toca nos campos enviados;
// antes, editar limpava subcategorias/capa/ícone por os pôr a vazio).
// Renomear propaga para lojas e produtos da mesma vertical — senão as lojas
// ficavam com o nome antigo e caíam em "Outras lojas".
categoriesRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const current = await pool.query("SELECT * FROM categories WHERE id=$1", [id]);
    if (!current.rows.length) return res.status(404).json({ error: "Categoria não encontrada" });
    const old = current.rows[0];
    const has = (k: string) => Object.prototype.hasOwnProperty.call(req.body, k);
    const name = has("name") ? String(req.body.name || "").trim() || old.name : old.name;
    const icon = has("icon") ? (req.body.icon || null) : old.icon;
    const coverImage = has("coverImage") ? (req.body.coverImage || null) : old.cover_image;
    const subs = Array.isArray(req.body.subcategories) ? req.body.subcategories : old.subcategories;
    const storeType = has("store_type") ? (req.body.store_type || null) : old.store_type;
    const intro = has("intro") ? (req.body.intro || null) : old.intro;
    await pool.query(
      `UPDATE categories SET name=$2, icon=$3, cover_image=$4, subcategories=$5, store_type=$6, intro=$7 WHERE id=$1`,
      [id, name, icon, coverImage, subs, storeType, intro]
    );
    if (name !== old.name) {
      // Âmbito = vertical ANTIGA (é onde estão as lojas/produtos com o nome atual).
      const scope = `store_type IS NOT DISTINCT FROM $2`;
      await pool.query(
        `UPDATE stores SET category = $1 WHERE category = $3 AND ${scope}`,
        [name, old.store_type, old.name]
      );
      await pool.query(
        `UPDATE stores SET categories = array_replace(categories, $3, $1) WHERE $3 = ANY(categories) AND ${scope}`,
        [name, old.store_type, old.name]
      );
      await pool.query(
        `UPDATE products SET category = $1 WHERE category = $3 AND store_id IN (SELECT id FROM stores WHERE ${scope})`,
        [name, old.store_type, old.name]
      );
    }
    res.json({ success: true, renamed: name !== old.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar categoria" });
  }
});

// DELETE /api/categories/:id — remover. BLOQUEADO quando há lojas ou
// produtos a usar a categoria (regra do negócio: em uso só se edita).
categoriesRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const current = await pool.query("SELECT * FROM categories WHERE id=$1", [id]);
    if (!current.rows.length) return res.status(404).json({ error: "Categoria não encontrada" });
    const usage = await countCategoryUsage(current.rows[0].name);
    if (usage.stores > 0 || usage.products > 0) {
      return res.status(409).json({
        error: `Categoria em uso (${usage.stores} loja(s), ${usage.products} produto(s)). Não pode ser apagada — só editada.`,
        usage,
      });
    }
    await pool.query("DELETE FROM categories WHERE id=$1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao remover categoria" });
  }
});
