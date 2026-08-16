import { Router } from "express";
import { pool } from "../db";

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
            'category', p.category, 'subcategory', p.subcategory, 'isCarrinho', p.is_carrinho
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
            'category', p.category, 'subcategory', p.subcategory, 'isCarrinho', p.is_carrinho
          )
        ) FILTER (WHERE p.id IS NOT NULL) AS products
      FROM stores s
      JOIN users u ON u.store_id = s.id AND u.status = 'APROVADO'
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
      conditions.push(`s.category = $${params.length}`);
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
      carrinhoAccess: store.carrinho_access,
      schedule: store.schedule || null,
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
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar loja" });
  }
});

// POST /api/stores — criar loja
storesRouter.post("/", async (req, res) => {
  try {
    const { id, name, category, address, phone, whatsapp, description, coverColor, coverImage, coverImages, logoUrl, province, municipality } = req.body;
    await pool.query(
      `INSERT INTO stores (id, name, category, address, phone, whatsapp, description, cover_color, cover_image, cover_images, logo_url, province, municipality)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       ON CONFLICT (id) DO UPDATE SET name=$2, category=$3, address=$4, phone=$5, whatsapp=$6, description=$7, cover_color=$8, cover_image=$9, cover_images=$10, logo_url=$11, province=$12, municipality=$13`,
      [id, name, category, address, phone, whatsapp, description, coverColor, coverImage, coverImages || [], logoUrl || null, province, municipality]
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
    const { name, category, address, phone, whatsapp, description, coverColor, coverImage, coverImages, logoUrl, province, municipality, isOpen, schedule } = req.body;
    await pool.query(
      `UPDATE stores SET name=$2, category=$3, address=$4, phone=$5, whatsapp=$6,
       description=$7, cover_color=$8, cover_image=$9, cover_images=$10, logo_url=$11, province=$12, municipality=$13, is_open=$14, schedule=$15
       WHERE id=$1`,
      [id, name, category, address, phone, whatsapp, description, coverColor, coverImage, coverImages || [], logoUrl || null, province, municipality, isOpen, schedule ? JSON.stringify(schedule) : null]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar loja" });
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
