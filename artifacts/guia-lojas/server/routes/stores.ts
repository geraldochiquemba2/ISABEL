import { Router } from "express";
import { pool } from "../db";
import { normalizeCategory } from "./auth";

export const storesRouter = Router();

// ── Rotas FIXAS (antes de /:id para evitar conflito) ──

// GET /api/stores/admin/all — todas as lojas para painel admin
storesRouter.get("/admin/all", async (req, res) => {
  try {
    const { store_type } = req.query;
    let query = `
      SELECT s.*,
        json_agg(
          json_build_object(
            'id', p.id, 'name', p.name, 'price', p.price, 'currency', p.currency,
            'imageUrl', p.image_url, 'imageUrls', p.image_urls, 'imageColor', p.image_color,
            'category', p.category, 'subcategory', p.subcategory, 'isCarrinho', p.is_carrinho,
            'description', p.description
          )
        ) FILTER (WHERE p.id IS NOT NULL) AS products
      FROM stores s
      LEFT JOIN products p ON p.store_id = s.id`;
    const params: any[] = [];
    if (store_type) {
      params.push(store_type);
      query += ` WHERE s.store_type = $1`;
    }
    query += ` GROUP BY s.id ORDER BY s.created_at DESC`;
    const result = await pool.query(query, params);
    res.json(result.rows.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      categories: r.categories && r.categories.length ? r.categories : (r.category ? [r.category] : []),
      address: r.address,
      phone: r.phone,
      whatsapp: r.whatsapp,
      isOpen: r.is_open,
      isFeatured: r.is_featured,
      isTrending: r.is_trending,
      description: r.description,
      coverColor: r.cover_color,
      coverImage: r.cover_image,
      coverImages: r.cover_images || [],
      logoUrl: r.logo_url,
      province: r.province,
      municipality: r.municipality,
      locality: r.locality || "",
      carrinhoAccess: r.carrinho_access,
      products: r.products || [],
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar lojas (admin)" });
  }
});

// GET /api/stores/carrinho-access/pending — lojas com pedido de acesso pendente (admin)
storesRouter.get("/carrinho-access/pending", async (req, res) => {
  try {
    const { store_type } = req.query;
    let query = `
      SELECT s.*, u.name as owner_name, u.phone as owner_phone
      FROM stores s
      JOIN users u ON u.store_id = s.id
      WHERE s.carrinho_access = 'PENDENTE'`;
    const params: any[] = [];
    if (store_type) {
      params.push(store_type);
      query += ` AND s.store_type = $1`;
    }
    query += ` ORDER BY s.created_at DESC`;
    const result = await pool.query(query, params);
    res.json(result.rows.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      categories: r.categories && r.categories.length ? r.categories : (r.category ? [r.category] : []),
      locality: r.locality || "",
      ownerName: r.owner_name,
      ownerPhone: r.owner_phone,
      carrinhoAccess: r.carrinho_access,
      createdAt: r.created_at,
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar pedidos pendentes" });
  }
});

// ── Rotas com /:id ──

// GET /api/stores — listar todas as lojas
storesRouter.get("/", async (req, res) => {
  try {
    const { province, municipality, category, q, store_type } = req.query;
    let query = `
      SELECT s.*, 
        json_agg(
          json_build_object(
            'id', p.id, 'name', p.name, 'price', p.price, 'currency', p.currency,
            'imageUrl', p.image_url, 'imageUrls', p.image_urls, 'imageColor', p.image_color,
            'category', p.category, 'subcategory', p.subcategory, 'isCarrinho', p.is_carrinho,
            'description', p.description
          )
        ) FILTER (WHERE p.id IS NOT NULL) AS products
      FROM stores s
      JOIN users u ON u.store_id = s.id
      LEFT JOIN products p ON p.store_id = s.id
    `;
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (store_type) {
      params.push(store_type);
      conditions.push(`s.store_type = $${params.length}`);
    } else {
      conditions.push(`s.store_type = 'collection'`);
    }

    if (province) {
      params.push(province);
      conditions.push(`s.province = $${params.length}`);
    }
    if (municipality) {
      params.push(municipality);
      conditions.push(`s.municipality = $${params.length}`);
    }
    if (category) {
      params.push(category);
      conditions.push(`(s.category = $${params.length} OR $${params.length} = ANY(s.categories))`);
    }
    if (q) {
      params.push(`%${q}%`);
      conditions.push(`(s.name ILIKE $${params.length} OR s.description ILIKE $${params.length})`);
    }

    if (conditions.length) query += " WHERE " + conditions.join(" AND ");
    query += " GROUP BY s.id ORDER BY s.created_at DESC";

    const result = await pool.query(query, params);
    const rows = result.rows.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      categories: r.categories && r.categories.length ? r.categories : (r.category ? [r.category] : []),
      address: r.address,
      phone: r.phone,
      whatsapp: r.whatsapp,
      isOpen: r.is_open,
      description: r.description,
      coverColor: r.cover_color,
      coverImage: r.cover_image,
      coverImages: r.cover_images || [],
      logoUrl: r.logo_url,
      province: r.province,
      isFeatured: r.is_featured,
      isTrending: r.is_trending,
      municipality: r.municipality,
      locality: r.locality || "",
      carrinhoAccess: r.carrinho_access,
      products: r.products || [],
    }));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar lojas" });
  }
});

// GET /api/stores/:id — detalhes de uma loja
storesRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const storeRes = await pool.query("SELECT * FROM stores WHERE id=$1", [id]);
    if (!storeRes.rows.length) return res.status(404).json({ error: "Loja não encontrada" });

    const productsRes = await pool.query(
      "SELECT * FROM products WHERE store_id=$1 ORDER BY created_at DESC",
      [id]
    );
    const store = storeRes.rows[0];
    res.json({
      id: store.id,
      name: store.name,
      category: store.category,
      categories: store.categories && store.categories.length ? store.categories : (store.category ? [store.category] : []),
      address: store.address,
      phone: store.phone,
      whatsapp: store.whatsapp,
      isOpen: store.is_open,
      description: store.description,
      coverColor: store.cover_color,
      coverImage: store.cover_image,
      coverImages: store.cover_images || [],
      logoUrl: store.logo_url,
      province: store.province,
      municipality: store.municipality,
      locality: store.locality || "",
      carrinhoAccess: store.carrinho_access,
      schedule: store.schedule || null,
      latitude: store.latitude ? parseFloat(String(store.latitude)) || null : null,
      longitude: store.longitude ? parseFloat(String(store.longitude)) || null : null,
      products: productsRes.rows.map((p) => ({
        id: p.id,
        name: p.name,
        price: parseFloat(p.price),
        currency: p.currency,
        imageUrl: p.image_url,
        imageUrls: p.image_urls || [],
        imageColor: p.image_color,
        category: p.category,
        subcategory: p.subcategory,
        isCarrinho: p.is_carrinho,
        description: p.description || "",
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar loja" });
  }
});

// Normaliza até 4 categorias; a primeira é a principal (compat com `category`).
// Aplica o mesmo mapa de rótulos do registo (auth) para não divergir.
function normalizeStoreCategories(body: any): { primary: string; all: string[] } {
  const raw = Array.isArray(body?.categories) ? body.categories.filter((c: any) => typeof c === "string" && c.trim()) : [];
  const seen = new Set<string>();
  const all: string[] = [];
  for (const c of [...raw, body?.category].filter(Boolean)) {
    const v = normalizeCategory(String(c));
    if (v && !seen.has(v)) { seen.add(v); all.push(v); }
    if (all.length >= 4) break;
  }
  const primary = all[0] || normalizeCategory(typeof body?.category === "string" ? body.category : undefined);
  return { primary, all: all.length ? all : [primary] };
}

// POST /api/stores — criar loja
storesRouter.post("/", async (req, res) => {
  try {
    const { id, name, address, phone, whatsapp, description, coverColor, coverImage, coverImages, logoUrl, province, municipality, locality } = req.body;
    const { primary: category, all: categories } = normalizeStoreCategories(req.body);
    await pool.query(
      `INSERT INTO stores (id, name, category, categories, address, phone, whatsapp, description, cover_color, cover_image, cover_images, logo_url, province, municipality, locality)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       ON CONFLICT (id) DO UPDATE SET name=$2, category=$3, categories=$4, address=$5, phone=$6, whatsapp=$7, description=$8, cover_color=$9, cover_image=$10, cover_images=$11, logo_url=$12, province=$13, municipality=$14, locality=$15`,
      [id, name, category, categories, address, phone, whatsapp, description, coverColor, coverImage, coverImages || [], logoUrl || null, province, municipality, locality || ""]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao salvar loja" });
  }
});

// PUT /api/stores/:id — atualizar loja
storesRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, phone, whatsapp, description, coverColor, coverImage, coverImages, logoUrl, province, municipality, locality, isOpen, schedule, latitude, longitude } = req.body;
    // Guardas independentes: só escreve categorias/localidade se foram enviadas
    // (array vazio ou ausência = preserva o que está na BD, nunca apaga)
    const providedCats = Array.isArray(req.body.categories)
      ? req.body.categories.filter((c: any) => typeof c === "string" && c.trim())
      : undefined;
    const providedCat = typeof req.body.category === "string" && req.body.category.trim()
      ? req.body.category.trim()
      : undefined;
    const providedLocality = typeof locality === "string" ? locality : undefined;
    const catsGiven = !!(providedCats?.length || providedCat);
    let category: string;
    let categories: string[];
    let localityVal: string;
    if (!catsGiven || providedLocality === undefined) {
      const cur = await pool.query("SELECT category, categories, locality FROM stores WHERE id=$1", [id]);
      const row = cur.rows[0];
      if (!catsGiven && row) {
        category = row.category;
        categories = row.categories && row.categories.length ? row.categories : [row.category];
      } else {
        ({ primary: category, all: categories } = normalizeStoreCategories({ categories: providedCats, category: providedCat }));
      }
      localityVal = providedLocality !== undefined ? providedLocality : (row?.locality || "");
    } else {
      ({ primary: category, all: categories } = normalizeStoreCategories({ categories: providedCats, category: providedCat }));
      localityVal = providedLocality;
    }
    await pool.query(
      `UPDATE stores SET name=$2, category=$3, categories=$4, address=$5, phone=$6, whatsapp=$7,
       description=$8, cover_color=$9, cover_image=$10, cover_images=$11, logo_url=$12, province=$13, municipality=$14, locality=$15, is_open=$16, schedule=$17, latitude=$18, longitude=$19
       WHERE id=$1`,
      [id, name, category, categories, address, phone, whatsapp, description, coverColor, coverImage, coverImages || [], logoUrl || null, province, municipality, localityVal, isOpen, schedule ? JSON.stringify(schedule) : null, latitude || null, longitude || null]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar loja" });
  }
});

// PATCH /api/stores/:id/location — atualizar apenas localização
storesRouter.patch("/:id/location", async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude } = req.body;
    await pool.query(
      `UPDATE stores SET latitude=$2, longitude=$3 WHERE id=$1`,
      [id, latitude || null, longitude || null]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar localização" });
  }
});

// PATCH /api/stores/:id/featured — destacar/remover destaque da loja
storesRouter.patch("/:id/featured", async (req, res) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;
    await pool.query(
      `UPDATE stores SET is_featured=$2 WHERE id=$1`,
      [id, isFeatured]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar destaque da loja" });
  }
});

// PATCH /api/stores/:id/trending — marcar/desmarcar como mais buscada
storesRouter.patch("/:id/trending", async (req, res) => {
  try {
    const { id } = req.params;
    const { isTrending } = req.body;
    await pool.query(
      `UPDATE stores SET is_trending=$2 WHERE id=$1`,
      [id, isTrending]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao actualizar tendência da loja" });
  }
});

// POST /api/stores/:id/carrinho-access — loja solicita acesso ao carrinho
storesRouter.post("/:id/carrinho-access", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      `UPDATE stores SET carrinho_access='PENDENTE' WHERE id=$1`,
      [id]
    );
    res.json({ success: true, message: "Solicitação enviada. Aguarde aprovação do admin." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao solicitar acesso ao carrinho" });
  }
});

// PATCH /api/stores/:id/whatsapp-click — registar clique no WhatsApp
storesRouter.patch("/:id/whatsapp-click", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      `UPDATE stores SET whatsapp_clicks = COALESCE(whatsapp_clicks, 0) + 1 WHERE id=$1`,
      [id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao registar clique" });
  }
});

// PUT /api/stores/:id/carrinho-access — admin aprova/recusa acesso ao carrinho
storesRouter.put("/:id/carrinho-access", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["APROVADO", "RECUSADO", "NAO_SOLICITADO"].includes(status)) {
      return res.status(400).json({ error: "Status inválido" });
    }
    await pool.query(
      `UPDATE stores SET carrinho_access=$2 WHERE id=$1`,
      [id, status]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar acesso ao carrinho" });
  }
});
