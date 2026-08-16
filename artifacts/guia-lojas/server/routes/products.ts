import { Router } from "express";
import { pool } from "../db";

export const productsRouter = Router();

// GET /api/products?store_id=xxx&is_carrinho=true&store_type=weddings — listar produtos
productsRouter.get("/", async (req, res) => {
  try {
    const { store_id, is_carrinho, store_type } = req.query;
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
    if (conditions.length) query += " WHERE " + conditions.join(" AND ");
    query += " ORDER BY p.created_at DESC";
    const result = await pool.query(query, params);
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
      imageUrls: p.image_urls || [],
      category: p.category,
      subcategory: p.subcategory,
      isCarrinho: p.is_carrinho,
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
    const result = await pool.query(
      `INSERT INTO products (id, store_id, name, price, currency, image_url, image_urls, image_color, category, subcategory, is_carrinho, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [id, storeId, name, price || 0, currency || 'AOA', imageUrl || null, imageUrls || [], imageColor || "#f0f0f0", category || null, subcategory || null, isCarrinho || false, description || ""]
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

// PUT /api/products/:id — atualizar produto
productsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, currency, imageUrl, imageUrls, imageColor, category, subcategory, isCarrinho, description } = req.body;
    await pool.query(
      `UPDATE products SET name=$2, price=$3, currency=$4, image_url=$5, image_urls=$6, image_color=$7, category=$8, subcategory=$9, is_carrinho=$10, description=$11
       WHERE id=$1`,
      [id, name, price || 0, currency || 'AOA', imageUrl || null, imageUrls || [], imageColor || "#f0f0f0", category || null, subcategory || null, isCarrinho || false, description || ""]
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
