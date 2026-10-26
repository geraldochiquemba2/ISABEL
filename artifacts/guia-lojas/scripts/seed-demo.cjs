const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const STORE_ID = "loja-1791580069333";
const img = (id) => `https://images.unsplash.com/${id}?w=900&h=900&fit=crop&auto=format&q=80`;

const coverImages = [
  img("photo-1441986300917-64674bd600d8"),
  img("photo-1567401893414-76b7b1e5a7a5"),
  img("photo-1558769132-cb1aea458c5e"),
];

const schedule = [
  { label: "Segunda a Sexta", closed: false, open: "08:00", close: "18:00" },
  { label: "Sábado", closed: false, open: "09:00", close: "14:00" },
  { label: "Domingo", closed: true, open: "08:00", close: "18:00" },
];

const products = [
  {
    id: "demo-prod-vestido-midi",
    name: "Vestido Midi Elegante",
    price: 28500,
    category: "Moda Feminina",
    subcategory: "Vestidos",
    isCarrinho: false,
    image: img("photo-1595777457583-95e059d581b8"),
    description: "Vestido midi com corte fluido, ideal para eventos e ocasiões especiais.",
  },
  {
    id: "demo-prod-blazer",
    name: "Conjunto Blazer & Calça",
    price: 42000,
    category: "Moda Feminina",
    subcategory: "Conjuntos",
    isCarrinho: false,
    image: img("photo-1591047139829-d91aecb6caea"),
    description: "Conjunto estruturado em tom neutro, perfeito para um look profissional.",
  },
  {
    id: "demo-prod-bolsa",
    name: "Bolsa de Couro Premium",
    price: 35000,
    category: "Bolsas & Acessórios",
    subcategory: "Bolsas",
    isCarrinho: false,
    image: img("photo-1584917865442-de89df76afd3"),
    description: "Bolsa compacta em couro sintético de alta qualidade, com alça ajustável.",
  },
  {
    id: "demo-prod-sandalias",
    name: "Sandálias de Salto",
    price: 24500,
    category: "Calçado",
    subcategory: "Sandálias",
    isCarrinho: false,
    image: img("photo-1543163521-1bf539c55dd2"),
    description: "Sandálias elegantes com salto confortável para o dia a dia ou festa.",
  },
  {
    id: "demo-prod-relogio",
    name: "Relógio Minimalista",
    price: 18900,
    category: "Acessórios",
    subcategory: "Relógios",
    isCarrinho: false,
    image: img("photo-1523275335684-37898b6baf30"),
    description: "Relógio de mostrador limpo com bracelete em aço, para todos os estilos.",
  },
  {
    id: "demo-prod-brincos",
    name: "Brincos Dourados",
    price: 12500,
    category: "Joias & Bijutarias",
    subcategory: "Brincos",
    isCarrinho: false,
    image: img("photo-1535632066927-ab7c9ab60908"),
    description: "Brincos dourados leves, ideais para completar qualquer produção.",
  },
  {
    id: "demo-carrinho-kit-presente",
    name: "Kit Presente YESOLA",
    price: 45000,
    category: "Bolsas & Acessórios",
    subcategory: "Kits",
    isCarrinho: true,
    image: img("photo-1513885535751-8b9238bd345a"),
    description: "Kit com bolsa, lenço e brincos, embalado para presente.",
  },
  {
    id: "demo-carrinho-essentials",
    name: "Carrinho Essentials (3 peças)",
    price: 62000,
    category: "Moda Feminina",
    subcategory: "Carrinhos",
    isCarrinho: true,
    image: img("photo-1483985988355-763728e1935b"),
    description: "Seleção de três peças essenciais para renovar o guarda-roupa.",
  },
];

(async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `UPDATE stores SET
        name = $2,
        category = $3,
        categories = $4,
        address = $5,
        phone = $6,
        whatsapp = $7,
        description = $8,
        cover_color = $9,
        cover_image = $10,
        cover_images = $11,
        logo_url = $12,
        province = $13,
        municipality = $14,
        locality = $15,
        is_open = $16,
        is_featured = $17,
        is_trending = $18,
        carrinho_access = $19,
        views = $20,
        whatsapp_contacts = $21,
        whatsapp_clicks = $22,
        latitude = $23,
        longitude = $24,
        schedule = $25::jsonb
      WHERE id = $1`,
      [
        STORE_ID,
        "Atelier YESOLA (Demonstração)",
        "Moda Feminina",
        ["Moda Feminina", "Bolsas & Acessórios", "Calçado", "Joias & Bijutarias"],
        "Rua da Liberdade, 42, Ingombota",
        "999000111",
        "999000111",
        "Loja de demonstração da YESOLA. Moda feminina, acessórios e calçado com curadoria, pronta a explorar no painel do lojista.",
        "#F4E7C5",
        coverImages[0],
        coverImages,
        img("photo-1441986300917-64674bd600d8"),
        "Luanda",
        "Luanda",
        "Ingombota",
        true,
        true,
        true,
        "APROVADO",
        1842,
        126,
        318,
        -8.8383,
        13.2344,
        JSON.stringify(schedule),
      ]
    );

    for (const p of products) {
      await client.query(
        `INSERT INTO products (id, store_id, name, price, currency, image_url, image_urls, image_color, category, subcategory, is_carrinho, description)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         ON CONFLICT (id) DO UPDATE SET
           store_id = EXCLUDED.store_id,
           name = EXCLUDED.name,
           price = EXCLUDED.price,
           currency = EXCLUDED.currency,
           image_url = EXCLUDED.image_url,
           image_urls = EXCLUDED.image_urls,
           image_color = EXCLUDED.image_color,
           category = EXCLUDED.category,
           subcategory = EXCLUDED.subcategory,
           is_carrinho = EXCLUDED.is_carrinho,
           description = EXCLUDED.description`,
        [
          p.id,
          STORE_ID,
          p.name,
          p.price,
          "AOA",
          p.image,
          [p.image],
          "#F4E7C5",
          p.category,
          p.subcategory,
          p.isCarrinho,
          p.description,
        ]
      );
    }

    await client.query("COMMIT");

    const check = await pool.query(
      `SELECT COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE is_carrinho)::int AS carrinhos
       FROM products WHERE store_id = $1`,
      [STORE_ID]
    );
    const store = await pool.query(
      `SELECT name, store_type, carrinho_access, views, whatsapp_contacts, whatsapp_clicks,
        cardinality(cover_images) AS cover_count, jsonb_array_length(schedule) AS schedule_days
       FROM stores WHERE id = $1`,
      [STORE_ID]
    );
    console.log(JSON.stringify({ storeId: STORE_ID, products: check.rows[0], store: store.rows[0] }, null, 2));
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
    await pool.end();
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
