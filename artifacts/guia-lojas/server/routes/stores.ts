import { Router } from "express";
import { pool } from "../db";

export const storesRouter = Router();

// GET /api/stores — listar todas as lojas
storesRouter.get("/", async (req, res) => {
  try {
    const { province, municipality, category, q } = req.query;
    let query = `
      SELECT s.*, 
        json_agg(
          json_build_object(
            'id', p.id, 'name', p.name, 'price', p.price, 'currency', p.currency,
            'imageUrl', p.image_url, 'imageUrls', p.image_urls, 'imageColor', p.image_color,
            'category', p.category, 'subcategory', p.subcategory
          )
        ) FILTER (WHERE p.id IS NOT NULL) AS products
      FROM stores s
      JOIN users u ON u.store_id = s.id AND u.status = 'APROVADO'
      LEFT JOIN products p ON p.store_id = s.id
    `;
    const conditions: string[] = [];
    const params: unknown[] = [];

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
    const { name, category, address, phone, whatsapp, description, coverColor, coverImage, coverImages, logoUrl, province, municipality, isOpen } = req.body;
    await pool.query(
      `UPDATE stores SET name=$2, category=$3, address=$4, phone=$5, whatsapp=$6,
       description=$7, cover_color=$8, cover_image=$9, cover_images=$10, logo_url=$11, province=$12, municipality=$13, is_open=$14
       WHERE id=$1`,
      [id, name, category, address, phone, whatsapp, description, coverColor, coverImage, coverImages || [], logoUrl || null, province, municipality, isOpen]
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

// GET /api/stores/admin/all — todas as lojas para painel admin
storesRouter.get("/admin/all", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*,
        json_agg(
          json_build_object(
            'id', p.id, 'name', p.name, 'price', p.price, 'currency', p.currency,
            'imageUrl', p.image_url, 'imageUrls', p.image_urls, 'imageColor', p.image_color,
            'category', p.category, 'subcategory', p.subcategory
          )
        ) FILTER (WHERE p.id IS NOT NULL) AS products
      FROM stores s
      LEFT JOIN products p ON p.store_id = s.id
      GROUP BY s.id
      ORDER BY s.created_at DESC
    `);
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
      products: r.products || [],
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar lojas (admin)" });
  }
});
