import { Hono } from "hono";
import { db } from "../db";
import type { Env } from "../env";

export const categoriesRouter = new Hono<{ Bindings: Env }>();

// GET /api/categories — listar todas (?store_type= filtra por vertical)
categoriesRouter.get("/", async (c) => {
  try {
    const store_type = c.req.query("store_type");
    const params: unknown[] = [];
    let where = "";
    if (store_type) {
      params.push(store_type);
      where = `WHERE c.store_type = $1`;
    }
    const rows = (await db(c.env).query(
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
    )) as any[];
    return c.json(
      rows.map((r) => ({
        ...r,
        isUsed: r.is_used,
        usedSubcategories: r.used_subcategories || [],
        subcategories: Array.isArray(r.subcategories)
          ? r.subcategories
          : typeof r.subcategories === "string" && r.subcategories === "{}"
            ? []
            : [],
      }))
    );
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao buscar categorias" }, 500);
  }
});

// Contagem de uso de uma categoria (lojas por nome + produtos por nome).
// Regra do negócio: categoria em uso não se apaga, só se edita.
async function countCategoryUsage(env: Env, name: string): Promise<{ stores: number; products: number }> {
  const s = (await db(env).query(
    `SELECT COUNT(*)::int AS n FROM stores WHERE category = $1 OR $1 = ANY(categories)`,
    [name]
  )) as any[];
  const p = (await db(env).query(`SELECT COUNT(*)::int AS n FROM products WHERE category = $1`, [name])) as any[];
  return { stores: Number(s[0]?.n || 0), products: Number(p[0]?.n || 0) };
}

// POST /api/categories — criar (gera id se não vier)
categoriesRouter.post("/", async (c) => {
  try {
    const { id, name, icon, coverImage, subcategories, store_type, intro } = await c.req.json();
    if (!name || !String(name).trim()) {
      return c.json({ error: "Nome é obrigatório" }, 400);
    }
    const subs = Array.isArray(subcategories) ? subcategories : [];
    const newId =
      (id && String(id).trim()) ||
      String(name)
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60) +
        "-" +
        Math.random().toString(36).slice(2, 7);
    const rows = (await db(c.env).query(
      `INSERT INTO categories (id, name, icon, cover_image, subcategories, store_type, intro)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [newId, String(name).trim(), icon || null, coverImage || null, subs, store_type || null, intro || null]
    )) as any[];
    return c.json(rows[0]);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao criar categoria" }, 500);
  }
});

// PUT /api/categories/:id — atualizar (merge).
// Renomear propaga para lojas e produtos da mesma vertical — senão as lojas
// ficavam com o nome antigo e caíam em "Outras lojas".
categoriesRouter.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const current = (await db(c.env).query("SELECT * FROM categories WHERE id=$1", [id])) as any[];
    if (!current.length) return c.json({ error: "Categoria não encontrada" }, 404);
    const old = current[0];
    const body = (await c.req.json()) as any;
    const has = (k: string) => Object.prototype.hasOwnProperty.call(body, k);
    const name = has("name") ? String(body.name || "").trim() || old.name : old.name;
    const icon = has("icon") ? body.icon || null : old.icon;
    const coverImage = has("coverImage") ? body.coverImage || null : old.cover_image;
    const subs = Array.isArray(body.subcategories) ? body.subcategories : old.subcategories;
    const storeType = has("store_type") ? body.store_type || null : old.store_type;
    const intro = has("intro") ? body.intro || null : old.intro;
    await db(c.env).query(
      `UPDATE categories SET name=$2, icon=$3, cover_image=$4, subcategories=$5, store_type=$6, intro=$7 WHERE id=$1`,
      [id, name, icon, coverImage, subs, storeType, intro]
    );
    if (name !== old.name) {
      // Âmbito = vertical ANTIGA (é onde estão as lojas/produtos com o nome atual).
      const scope = `store_type IS NOT DISTINCT FROM $2`;
      await db(c.env).query(`UPDATE stores SET category = $1 WHERE category = $3 AND ${scope}`, [
        name,
        old.store_type,
        old.name,
      ]);
      await db(c.env).query(
        `UPDATE stores SET categories = array_replace(categories, $3, $1) WHERE $3 = ANY(categories) AND ${scope}`,
        [name, old.store_type, old.name]
      );
      await db(c.env).query(
        `UPDATE products SET category = $1 WHERE category = $3 AND store_id IN (SELECT id FROM stores WHERE ${scope})`,
        [name, old.store_type, old.name]
      );
    }
    return c.json({ success: true, renamed: name !== old.name });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao atualizar categoria" }, 500);
  }
});

// DELETE /api/categories/:id — remover. BLOQUEADO quando há lojas ou
// produtos a usar a categoria (regra do negócio: em uso só se edita).
categoriesRouter.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const current = (await db(c.env).query("SELECT * FROM categories WHERE id=$1", [id])) as any[];
    if (!current.length) return c.json({ error: "Categoria não encontrada" }, 404);
    const usage = await countCategoryUsage(c.env, current[0].name);
    if (usage.stores > 0 || usage.products > 0) {
      return c.json(
        {
          error: `Categoria em uso (${usage.stores} loja(s), ${usage.products} produto(s)). Não pode ser apagada — só editada.`,
          usage,
        },
        409
      );
    }
    await db(c.env).query("DELETE FROM categories WHERE id=$1", [id]);
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao remover categoria" }, 500);
  }
});
