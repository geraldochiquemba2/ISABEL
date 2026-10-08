import { Hono } from "hono";
import { db } from "../db";
import type { Env } from "../env";

export const storesRouter = new Hono<{ Bindings: Env }>();

// ── Rotas FIXAS (antes de /:id para evitar conflito) ──

// GET /api/stores/admin/all — todas as lojas para painel admin
storesRouter.get("/admin/all", async (c) => {
  try {
    const store_type = c.req.query("store_type");
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
    const params: unknown[] = [];
    if (store_type) {
      params.push(store_type);
      query += ` WHERE s.store_type = $1`;
    }
    query += ` GROUP BY s.id ORDER BY s.created_at DESC`;
    const rows = (await db(c.env).query(query, params)) as any[];
    return c.json(
      rows.map((r) => ({
        id: r.id,
        name: r.name,
        category: r.category,
        categories: r.categories && r.categories.length ? r.categories : r.category ? [r.category] : [],
        address: r.address,
        phone: r.phone,
        whatsapp: r.whatsapp,
        whatsapp_clicks: r.whatsapp_clicks || 0,
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
        schedule: r.schedule || null,
        products: r.products || [],
      }))
    );
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao buscar lojas (admin)" }, 500);
  }
});

// GET /api/stores/carrinho-access/pending — lojas com pedido de acesso pendente (admin)
storesRouter.get("/carrinho-access/pending", async (c) => {
  try {
    const store_type = c.req.query("store_type");
    let query = `
      SELECT s.*, u.name as owner_name, u.phone as owner_phone
      FROM stores s
      JOIN users u ON u.store_id = s.id
      WHERE s.carrinho_access = 'PENDENTE'`;
    const params: unknown[] = [];
    if (store_type) {
      params.push(store_type);
      query += ` AND s.store_type = $1`;
    }
    query += ` ORDER BY s.created_at DESC`;
    const rows = (await db(c.env).query(query, params)) as any[];
    return c.json(
      rows.map((r) => ({
        id: r.id,
        name: r.name,
        category: r.category,
        categories: r.categories && r.categories.length ? r.categories : r.category ? [r.category] : [],
        locality: r.locality || "",
        ownerName: r.owner_name,
        ownerPhone: r.owner_phone,
        carrinhoAccess: r.carrinho_access,
        createdAt: r.created_at,
      }))
    );
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao buscar pedidos pendentes" }, 500);
  }
});

// GET /api/stores — listar todas as lojas
storesRouter.get("/", async (c) => {
  try {
    const province = c.req.query("province");
    const municipality = c.req.query("municipality");
    const category = c.req.query("category");
    const q = c.req.query("q");
    const store_type = c.req.query("store_type");
    // Paginação (corta-banda): default alto para não partir os filtros
    // client-side das páginas Explore; limita o crescimento futuro.
    const page = Math.max(1, parseInt(c.req.query("page") || "1", 10) || 1);
    const limit = Math.min(500, Math.max(1, parseInt(c.req.query("limit") || "200", 10) || 200));
    const offset = (page - 1) * limit;
    // Produtos embutidos limitados aos 8 mais recentes: os cards só usam as
    // fotos como fallback e o detalhe (/api/stores/:id) busca tudo à parte.
    // Sem limite, lojas com dezenas de produtos inchavam o JSON e atrasavam
    // a primeira pintura das grelhas.
    let query = `
      SELECT s.*,
        COALESCE((
          SELECT json_agg(t) FROM (
            SELECT p.id, p.name, p.price, p.currency,
              p.image_url AS "imageUrl", p.image_urls AS "imageUrls",
              p.image_color AS "imageColor", p.category, p.subcategory,
              p.is_carrinho AS "isCarrinho"
            FROM products p
            WHERE p.store_id = s.id
            ORDER BY p.created_at DESC
            LIMIT 8
          ) t
        ), '[]') AS products
      FROM stores s
      JOIN users u ON u.store_id = s.id AND u.status = 'APROVADO'
    `;
    const conditions: string[] = [];
    const params: unknown[] = [];

    // Montra pública: só lojas de contas aprovadas (pendentes/recusadas/suspensas ficam ocultas)

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
      conditions.push(
        `(s.name ILIKE $${params.length} OR s.description ILIKE $${params.length} OR s.category ILIKE $${params.length} OR EXISTS (SELECT 1 FROM unnest(COALESCE(s.categories, '{}')) AS c WHERE c ILIKE $${params.length}))`
      );
    }

    if (conditions.length) query += " WHERE " + conditions.join(" AND ");
    const countRows = (await db(c.env).query(
      `SELECT COUNT(*)::int AS total FROM stores s JOIN users u ON u.store_id = s.id AND u.status = 'APROVADO'${
        conditions.length ? " WHERE " + conditions.join(" AND ") : ""
      }`,
      params
    )) as any[];
    c.header("X-Total-Count", String(countRows[0]?.total ?? 0));
    c.header("X-Page", String(page));
    c.header("X-Limit", String(limit));
    query += " ORDER BY s.created_at DESC";
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

    const rows = (await db(c.env).query(query, [...params, limit, offset])) as any[];
    return c.json(
      rows.map((r) => ({
        id: r.id,
        name: r.name,
        category: r.category,
        categories: r.categories && r.categories.length ? r.categories : r.category ? [r.category] : [],
        address: r.address,
        phone: r.phone,
        whatsapp: r.whatsapp,
        whatsapp_clicks: r.whatsapp_clicks || 0,
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
        schedule: r.schedule || null,
        createdAt: r.created_at,
        products: r.products || [],
      }))
    );
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao buscar lojas" }, 500);
  }
});

// GET /api/stores/:id — detalhes de uma loja (montra pública: só contas aprovadas)
storesRouter.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const storeRows = (await db(c.env).query(
      `SELECT s.* FROM stores s
       JOIN users u ON u.store_id = s.id AND u.status = 'APROVADO'
       WHERE s.id = $1 LIMIT 1`,
      [id]
    )) as any[];
    if (!storeRows.length) return c.json({ error: "Loja não encontrada" }, 404);

    const productRows = (await db(c.env).query("SELECT * FROM products WHERE store_id=$1 ORDER BY created_at DESC", [
      id,
    ])) as any[];
    const store = storeRows[0];
    return c.json({
      id: store.id,
      name: store.name,
      category: store.category,
      categories:
        store.categories && store.categories.length ? store.categories : store.category ? [store.category] : [],
      address: store.address,
      phone: store.phone,
      whatsapp: store.whatsapp,
      whatsapp_clicks: store.whatsapp_clicks || 0,
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
      products: productRows.map((p) => ({
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
    return c.json({ error: "Erro ao buscar loja" }, 500);
  }
});

// Normaliza até 4 categorias; a primeira é a principal.
// Guarda o texto COMO FOI ESCRITO (só trim) — sem mapa de rótulos.
function normalizeStoreCategories(body: any): { primary: string; all: string[] } {
  const raw = Array.isArray(body?.categories)
    ? body.categories.filter((c: any) => typeof c === "string" && c.trim())
    : [];
  const seen = new Set<string>();
  const all: string[] = [];
  for (const c of [...raw, body?.category].filter(Boolean)) {
    const v = String(c).trim();
    if (v && !seen.has(v)) {
      seen.add(v);
      all.push(v);
    }
    if (all.length >= 4) break;
  }
  const primary = all[0] || (typeof body?.category === "string" && body.category.trim() ? body.category.trim() : "Geral");
  return { primary, all: all.length ? all : [primary] };
}

// POST /api/stores — criar loja
storesRouter.post("/", async (c) => {
  try {
    const body = (await c.req.json()) as any;
    const { id, name, address, phone, whatsapp, description, coverColor, coverImage, coverImages, logoUrl, province, municipality, locality } = body;
    const { primary: category, all: categories } = normalizeStoreCategories(body);
    await db(c.env).query(
      `INSERT INTO stores (id, name, category, categories, address, phone, whatsapp, description, cover_color, cover_image, cover_images, logo_url, province, municipality, locality)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       ON CONFLICT (id) DO UPDATE SET name=$2, category=$3, categories=$4, address=$5, phone=$6, whatsapp=$7, description=$8, cover_color=$9, cover_image=$10, cover_images=$11, logo_url=$12, province=$13, municipality=$14, locality=$15`,
      [id, name, category, categories, address, phone, whatsapp, description, coverColor, coverImage, coverImages || [], logoUrl || null, province, municipality, locality || ""]
    );
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao salvar loja" }, 500);
  }
});

// PUT /api/stores/:id — atualizar loja (merge: ausente/null = preserva a BD;
// "" limpa de propósito. Antes, updates parciais apagavam fotos e nomes.)
storesRouter.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = ((await c.req.json()) as any) || {};
    const has = (k: string) => Object.prototype.hasOwnProperty.call(body, k) && body[k] !== null;
    const curAll = (await db(c.env).query("SELECT * FROM stores WHERE id=$1", [id])) as any[];
    const cur = curAll[0];
    if (!cur) return c.json({ error: "Loja não encontrada" }, 404);
    // NUNCA persistir is_open vindo do cliente (status calculado). Preserva BD.
    const effectiveIsOpen = cur.is_open ?? true;
    // Guardas independentes: só escreve categorias/localidade se foram enviadas
    // (array vazio ou ausência = preserva o que está na BD, nunca apaga)
    const providedCats = Array.isArray(body.categories)
      ? body.categories.filter((x: any) => typeof x === "string" && x.trim())
      : undefined;
    const providedCat =
      typeof body.category === "string" && body.category.trim() ? body.category.trim() : undefined;
    const providedLocality = typeof body.locality === "string" ? body.locality : undefined;
    const catsGiven = !!(providedCats?.length || providedCat);
    let category: string;
    let categories: string[];
    let localityVal: string;
    if (!catsGiven) {
      category = cur.category;
      categories = cur.categories && cur.categories.length ? cur.categories : [cur.category];
    } else {
      ({ primary: category, all: categories } = normalizeStoreCategories({ categories: providedCats, category: providedCat }));
    }
    localityVal = providedLocality !== undefined ? providedLocality : cur.locality || "";
    await db(c.env).query(
      `UPDATE stores SET name=$2, category=$3, categories=$4, address=$5, phone=$6, whatsapp=$7,
       description=$8, cover_color=$9, cover_image=$10, cover_images=$11, logo_url=$12, province=$13, municipality=$14, locality=$15, is_open=$16, schedule=$17, latitude=$18, longitude=$19
       WHERE id=$1`,
      [id, has("name") ? body.name : cur.name, category, categories, has("address") ? body.address : cur.address,
       has("phone") ? body.phone : cur.phone, has("whatsapp") ? body.whatsapp : cur.whatsapp,
       has("description") ? body.description : cur.description, has("coverColor") ? body.coverColor : cur.cover_color,
       has("coverImage") ? body.coverImage : cur.cover_image, has("coverImages") ? body.coverImages : cur.cover_images,
       has("logoUrl") ? body.logoUrl : cur.logo_url, has("province") ? body.province : cur.province,
       has("municipality") ? body.municipality : cur.municipality, localityVal, effectiveIsOpen,
       has("schedule") ? (body.schedule ? JSON.stringify(body.schedule) : null) : cur.schedule,
       has("latitude") ? body.latitude || null : cur.latitude, has("longitude") ? body.longitude || null : cur.longitude]
    );
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao atualizar loja" }, 500);
  }
});

// PATCH /api/stores/:id/location — atualizar apenas localização
storesRouter.patch("/:id/location", async (c) => {
  try {
    const id = c.req.param("id");
    const { latitude, longitude } = await c.req.json();
    await db(c.env).query(`UPDATE stores SET latitude=$2, longitude=$3 WHERE id=$1`, [id, latitude || null, longitude || null]);
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao atualizar localização" }, 500);
  }
});

// PATCH /api/stores/:id/featured — destacar/remover destaque da loja
storesRouter.patch("/:id/featured", async (c) => {
  try {
    const id = c.req.param("id");
    const { isFeatured } = await c.req.json();
    await db(c.env).query(`UPDATE stores SET is_featured=$2 WHERE id=$1`, [id, isFeatured]);
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao atualizar destaque da loja" }, 500);
  }
});

// PATCH /api/stores/:id/trending — marcar/desmarcar como mais buscada
storesRouter.patch("/:id/trending", async (c) => {
  try {
    const id = c.req.param("id");
    const { isTrending } = await c.req.json();
    await db(c.env).query(`UPDATE stores SET is_trending=$2 WHERE id=$1`, [id, isTrending]);
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao actualizar tendência da loja" }, 500);
  }
});

// POST /api/stores/:id/carrinho-access — loja solicita acesso ao carrinho
storesRouter.post("/:id/carrinho-access", async (c) => {
  try {
    const id = c.req.param("id");
    await db(c.env).query(`UPDATE stores SET carrinho_access='PENDENTE' WHERE id=$1`, [id]);
    return c.json({ success: true, message: "Solicitação enviada. Aguarde aprovação do admin." });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao solicitar acesso ao carrinho" }, 500);
  }
});

// PATCH /api/stores/:id/whatsapp-click — registar clique no WhatsApp
storesRouter.patch("/:id/whatsapp-click", async (c) => {
  try {
    const id = c.req.param("id");
    await db(c.env).query(`UPDATE stores SET whatsapp_clicks = COALESCE(whatsapp_clicks, 0) + 1 WHERE id=$1`, [id]);
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao registar clique" }, 500);
  }
});

// PUT /api/stores/:id/carrinho-access — admin aprova/recusa acesso ao carrinho
storesRouter.put("/:id/carrinho-access", async (c) => {
  try {
    const id = c.req.param("id");
    const { status } = await c.req.json();
    if (!["APROVADO", "RECUSADO", "NAO_SOLICITADO"].includes(status)) {
      return c.json({ error: "Status inválido" }, 400);
    }
    await db(c.env).query(`UPDATE stores SET carrinho_access=$2 WHERE id=$1`, [id, status]);
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Erro ao atualizar acesso ao carrinho" }, 500);
  }
});
