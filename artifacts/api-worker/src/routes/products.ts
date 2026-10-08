import { Hono } from "hono";
import { db } from "../db";
import type { Env } from "../env";

export const productsRouter = new Hono<{ Bindings: Env }>();

// GET /api/products?store_id=xxx&is_carrinho=true&store_type=weddings — listar produtos
productsRouter.get("/", async (c) => {
  try {
    const store_id = c.req.query("store_id");
    const is_carrinho = c.req.query("is_carrinho");
    const store_type = c.req.query("store_type");
    // Paginação (corta-banda): a montra pública puxava o catálogo inteiro de
    // cada vez. Default generoso para não partir as páginas Explore actuais.
    const page = Math.max(1, parseInt(c.req.query("page") || "1", 10) || 1);
    const limit = Math.min(200, Math.max(1, parseInt(c.req.query("limit") || "100", 10) || 100));
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
    const countRows = (await db(c.env).query(
      `SELECT COUNT(*)::int AS total FROM products p LEFT JOIN stores s ON s.id = p.store_id${conditions.length ? " WHERE " + conditions.join(" AND ") : ""}`,
      params
    )) as any[];
    c.header("X-Total-Count", String(countRows[0]?.total ?? 0));
    c.header("X-Page", String(page));
    c.header("X-Limit", String(limit));
    query += " ORDER BY p.created_at DESC";
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    const rows = (await db(c.env).query(query, [...params, limit, offset])) as any[];
    return c.json(
      rows.map((p) => ({
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
          : typeof p.image_urls === "string" && p.image_urls
            ? p.image_urls.split(/\s+/).filter(Boolean)
            : [],
        category: p.category,
        subcategory: p.subcategory,
        isCarrinho: p.is_carrinho,
        description: p.description || "",
      }))
    );
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao buscar produtos" }, 500);
  }
});

// POST /api/products — criar produto
productsRouter.post("/", async (c) => {
  try {
    const { id, storeId, name, price, currency, imageUrl, imageUrls, imageColor, category, subcategory, isCarrinho, description } =
      await c.req.json();
    // Alguns dashboards não enviam id — gerar server-side em vez de 500.
    const finalId = id || crypto.randomUUID();
    const rows = (await db(c.env).query(
      `INSERT INTO products (id, store_id, name, price, currency, image_url, image_urls, image_color, category, subcategory, is_carrinho, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [finalId, storeId, name, price || 0, currency || "AOA", imageUrl || null, imageUrls || [], imageColor || "#f0f0f0", category || null, subcategory || null, isCarrinho || false, description || ""]
    )) as any[];
    const p = rows[0];
    return c.json({
      id: p.id,
      storeId: p.store_id,
      name: p.name,
      price: parseFloat(p.price),
      currency: p.currency,
      imageUrl: p.image_url,
      imageUrls: p.image_urls || [],
      imageColor: p.image_color,
      category: p.category,
      subcategory: p.subcategory,
      isCarrinho: p.is_carrinho,
      description: p.description,
    });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao criar produto" }, 500);
  }
});

// PUT /api/products/:id — atualizar produto (merge: ausente/null = preserva)
productsRouter.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = ((await c.req.json()) as any) || {};
    const has = (k: string) => Object.prototype.hasOwnProperty.call(body, k) && body[k] !== null;
    const curAll = (await db(c.env).query("SELECT * FROM products WHERE id=$1", [id])) as any[];
    const cur = curAll[0];
    if (!cur) return c.json({ error: "Produto não encontrado" }, 404);
    console.log(`[PUT /api/products/${id}] description=`, body.description);
    await db(c.env).query(
      `UPDATE products SET name=$2, price=$3, currency=$4, image_url=$5, image_urls=$6, image_color=$7, category=$8, subcategory=$9, is_carrinho=$10, description=$11
       WHERE id=$1`,
      [id, has("name") ? body.name : cur.name, has("price") ? body.price : cur.price,
       has("currency") ? body.currency : cur.currency, has("imageUrl") ? body.imageUrl : cur.image_url,
       has("imageUrls") ? body.imageUrls : cur.image_urls, has("imageColor") ? body.imageColor : cur.image_color,
       has("category") ? body.category : cur.category, has("subcategory") ? body.subcategory : cur.subcategory,
       has("isCarrinho") ? body.isCarrinho : cur.is_carrinho, has("description") ? body.description : cur.description]
    );
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao atualizar produto" }, 500);
  }
});

// DELETE /api/products/:id — eliminar produto
productsRouter.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await db(c.env).query("DELETE FROM products WHERE id=$1", [id]);
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao eliminar produto" }, 500);
  }
});

// PATCH /api/products/:id/toggle-carrinho — alternar is_carrinho
productsRouter.patch("/:id/toggle-carrinho", async (c) => {
  try {
    const id = c.req.param("id");
    const rows = (await db(c.env).query(
      `UPDATE products SET is_carrinho = NOT is_carrinho WHERE id=$1 RETURNING id, is_carrinho`,
      [id]
    )) as any[];
    if (!rows.length) return c.json({ error: "Produto não encontrado" }, 404);
    return c.json({ success: true, isCarrinho: rows[0].is_carrinho });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao alternar carrinho" }, 500);
  }
});
