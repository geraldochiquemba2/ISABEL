import { Router } from "express";
import { randomUUID } from "crypto";
import { pool } from "../db";

export const productsRouter = Router();

// Garantir que a coluna description existe
(async () => {
  try {
    await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT DEFAULT ''`);
  } catch (e) { /* ignore */ }
})();

// GET /api/products?store_id=xxx&is_carrinho=true&store_type=weddings — listar produtos
productsRouter.get("/", async (req, res) => {
  try {
    const { store_id, is_carrinho, store_type } = req.query;
    // Paginação (corta-banda): a montra pública puxava o catálogo inteiro de
    // cada vez. Default generoso para não partir as páginas Explore actuais.
    const page = Math.max(1, parseInt(String(req.query.page || "1"), 10) || 1);
    const limit = Math.min(200, Math.max(1, parseInt(String(req.query.limit || "100"), 10) || 100));
    const offset = (page - 1) * limit;
    let query = `
      SELECT p.*, s.name as store_name, s.logo_url as store_logo
      FROM products p
      LEFT JOIN stores s ON s.id = p.store_id
    `;
    const conditions: string[] = [];
    const params: unknown[] = [];
    if (store_id) {
      params.push(store_id);
      conditions.push(`p.store_id=$${params.length}`);
    }
    if (store_type) {
      params.push(store_type);
      conditions.push(`s.store_type=$${params.length}`);
    }
    if (is_carrinho === "true") {
      conditions.push(`p.is_carrinho = TRUE`);
    } else if (is_carrinho === "false") {
      conditions.push(`p.is_carrinho = FALSE`);
    }
    // Montra pública: esconde produtos de lojas com conta pendente/recusada/suspensa
    conditions.push(`NOT EXISTS (SELECT 1 FROM users u WHERE u.store_id = p.store_id AND u.status <> 'APROVADO')`);
    if (conditions.length) query += " WHERE " + conditions.join(" AND ");
    // Total para o cliente saber se há mais páginas (header, sem mudar o corpo array)
    const countRes = await pool.query(
      `SELECT COUNT(*)::int AS total FROM products p LEFT JOIN stores s ON s.id = p.store_id${conditions.length ? " WHERE " + conditions.join(" AND ") : ""}`,
      params
    );
    res.setHeader("X-Total-Count", String(countRes.rows[0]?.total ?? 0));
    res.setHeader("X-Page", String(page));
    res.setHeader("X-Limit", String(limit));
    query += " ORDER BY p.created_at DESC";
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    const result = await pool.query(query, [...params, limit, offset]);
    res.json(result.rows.map((p) => ({
      id: p.id,
      storeId: p.store_id,
      storeName: p.store_name,
      storeLogo: p.store_logo,
      name: p.name,
      price: parseFloat(p.price),
      currency: p.currency,
      imageUrl: p.image_url,
      imageColor: p.image_color,
      // image_urls chega como TEXT[] mas há linhas antigas com string;
      // normalizar para array para os cards não partirem (ver StoreCategorySection).
      imageUrls: Array.isArray(p.image_urls)
        ? p.image_urls
        : (typeof p.image_urls === "string" && p.image_urls
          ? p.image_urls.split(/\s+/).filter(Boolean)
          : []),
      category: p.category,
      subcategory: p.subcategory,
      isCarrinho: p.is_carrinho,
      description: p.description || "",
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

// POST /api/products — criar produto
productsRouter.post("/", async (req, res) => {
  try {
    const { id, storeId, name, price, currency, imageUrl, imageUrls, imageColor, category, subcategory, isCarrinho, description } = req.body;
    // Alguns dashboards não enviam id (ver api-output.log: "null value in
    // column id") — gerar server-side em vez de 500.
    const finalId = id || randomUUID();
    const result = await pool.query(
      `INSERT INTO products (id, store_id, name, price, currency, image_url, image_urls, image_color, category, subcategory, is_carrinho, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [finalId, storeId, name, price || 0, currency || 'AOA', imageUrl || null, imageUrls || [], imageColor || "#f0f0f0", category || null, subcategory || null, isCarrinho || false, description || ""]
    );
    const p = result.rows[0];
    res.json({
      id: p.id, storeId: p.store_id, name: p.name,
      price: parseFloat(p.price), currency: p.currency, imageUrl: p.image_url, imageUrls: p.image_urls || [],
      imageColor: p.image_color, category: p.category, subcategory: p.subcategory, isCarrinho: p.is_carrinho,
      description: p.description,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar produto" });
  }
});

// PUT /api/products/:id — atualizar produto (merge: ausente/null = preserva;
// antes, `|| []`/`|| null` apagava fotos em updates parciais)
productsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const has = (k: string) => Object.prototype.hasOwnProperty.call(body, k) && body[k] !== null;
    const curAll = await pool.query("SELECT * FROM products WHERE id=$1", [id]);
    const cur = curAll.rows[0];
    if (!cur) return res.status(404).json({ error: "Produto não encontrado" });
    console.log(`[PUT /api/products/${id}] description=`, body.description);
    await pool.query(
      `UPDATE products SET name=$2, price=$3, currency=$4, image_url=$5, image_urls=$6, image_color=$7, category=$8, subcategory=$9, is_carrinho=$10, description=$11
       WHERE id=$1`,
      [id, has("name") ? body.name : cur.name, has("price") ? body.price : cur.price,
       has("currency") ? body.currency : cur.currency, has("imageUrl") ? body.imageUrl : cur.image_url,
       has("imageUrls") ? body.imageUrls : cur.image_urls, has("imageColor") ? body.imageColor : cur.image_color,
       has("category") ? body.category : cur.category, has("subcategory") ? body.subcategory : cur.subcategory,
       has("isCarrinho") ? body.isCarrinho : cur.is_carrinho, has("description") ? body.description : cur.description]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

// DELETE /api/products/:id — eliminar produto
productsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM products WHERE id=$1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao eliminar produto" });
  }
});

// PATCH /api/products/:id/toggle-carrinho — alternar is_carrinho
productsRouter.patch("/:id/toggle-carrinho", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE products SET is_carrinho = NOT is_carrinho WHERE id=$1 RETURNING id, is_carrinho`,
      [id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "Produto não encontrado" });
    res.json({ success: true, isCarrinho: result.rows[0].is_carrinho });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao alternar carrinho" });
  }
});
