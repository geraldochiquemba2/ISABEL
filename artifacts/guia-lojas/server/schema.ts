import { pool } from "./db";

export async function initDB() {
  const client = await pool.connect();
  try {
    // Criar tabelas se não existirem
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id          TEXT PRIMARY KEY,
        name        TEXT NOT NULL,
        icon        TEXT,
        cover_image TEXT,
        subcategories TEXT[] DEFAULT '{}',
        created_at  TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS stores (
        id          TEXT PRIMARY KEY,
        name        TEXT NOT NULL,
        category    TEXT NOT NULL DEFAULT 'Geral',
        address     TEXT NOT NULL DEFAULT '',
        phone       TEXT NOT NULL DEFAULT '',
        whatsapp    TEXT NOT NULL DEFAULT '',
        is_open     BOOLEAN DEFAULT TRUE,
        is_featured BOOLEAN DEFAULT FALSE,
        is_trending BOOLEAN DEFAULT FALSE,
        carrinho_access TEXT DEFAULT 'PENDENTE',
        description TEXT,
        cover_color TEXT,
        cover_image TEXT,
        cover_images TEXT[],
        logo_url    TEXT,
        province    TEXT,
        municipality TEXT,
        created_at  TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS products (
        id            TEXT PRIMARY KEY,
        store_id      TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
        name          TEXT NOT NULL,
        price         NUMERIC(10,2) DEFAULT 0,
        currency      TEXT DEFAULT 'AOA',
        image_url     TEXT,
        image_urls    TEXT[],
        image_color   TEXT DEFAULT '#f0f0f0',
        category      TEXT,
        subcategory   TEXT,
        is_carrinho   BOOLEAN DEFAULT FALSE,
        created_at    TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS users (
        id            SERIAL PRIMARY KEY,
        name          TEXT NOT NULL,
        phone         TEXT UNIQUE NOT NULL,
        password      TEXT NOT NULL,
        province      TEXT,
        municipality  TEXT,
        address       TEXT,
        store_id      TEXT,
        status        TEXT DEFAULT 'PENDENTE',
        status_reason TEXT,
        created_at    TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS style_tips (
        id          SERIAL PRIMARY KEY,
        titulo      TEXT NOT NULL,
        descricao   TEXT NOT NULL,
        imagem      TEXT,
        dicas       TEXT[] DEFAULT '{}',
        ordem       INTEGER DEFAULT 0,
        created_at  TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Adicionar colunas em falta (caso as tabelas já existam sem essas colunas)
    const alterations = [
      `ALTER TABLE stores ADD COLUMN IF NOT EXISTS province TEXT`,
      `ALTER TABLE stores ADD COLUMN IF NOT EXISTS municipality TEXT`,
      `ALTER TABLE stores ADD COLUMN IF NOT EXISTS is_open BOOLEAN DEFAULT TRUE`,
      `ALTER TABLE stores ADD COLUMN IF NOT EXISTS description TEXT`,
      `ALTER TABLE stores ADD COLUMN IF NOT EXISTS cover_color TEXT`,
      `ALTER TABLE stores ADD COLUMN IF NOT EXISTS cover_image TEXT`,
      `ALTER TABLE stores ADD COLUMN IF NOT EXISTS cover_images TEXT[]`,
      `ALTER TABLE stores ADD COLUMN IF NOT EXISTS logo_url TEXT`,
      `ALTER TABLE stores ADD COLUMN IF NOT EXISTS whatsapp TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS province TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS municipality TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS store_id TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PENDENTE'`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS status_reason TEXT`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS image_color TEXT DEFAULT '#f0f0f0'`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS image_urls TEXT[]`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory TEXT`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'AOA'`,
      `ALTER TABLE stores ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0`,
      `ALTER TABLE stores ADD COLUMN IF NOT EXISTS whatsapp_contacts INTEGER DEFAULT 0`,
      `ALTER TABLE stores ADD COLUMN IF NOT EXISTS whatsapp_clicks INTEGER DEFAULT 0`,
      `ALTER TABLE stores ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE`,
      `ALTER TABLE stores ADD COLUMN IF NOT EXISTS is_trending BOOLEAN DEFAULT FALSE`,
      `ALTER TABLE categories ADD COLUMN IF NOT EXISTS subcategories TEXT[] DEFAULT '{}'`,
      `ALTER TABLE stores ADD COLUMN IF NOT EXISTS carrinho_access TEXT DEFAULT 'PENDENTE'`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS is_carrinho BOOLEAN DEFAULT FALSE`,
    ];

    for (const sql of alterations) {
      await client.query(sql);
    }

    // Inserir Admin se não existir
    await client.query(`
      INSERT INTO users (name, phone, password, province, municipality, address, status)
      VALUES ('Admin', '999999999', '1234567890', 'Luanda', 'Luanda', 'Endereço Admin', 'APROVADO')
      ON CONFLICT (phone) DO NOTHING;
    `);

    // Inserir Categorias predefinidas se a tabela estiver vazia
    const catCheck = await client.query("SELECT COUNT(*) FROM categories");
    if (parseInt(catCheck.rows[0].count) === 0) {
      const defaultCategories = [
        { id: "moda", name: "Moda", icon: "shirt", coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop&q=80" },
        { id: "eletronicos", name: "Eletrônicos", icon: "smartphone", coverImage: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop&q=80" },
        { id: "alimentacao", name: "Alimentação", icon: "utensils", coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop&q=80" },
        { id: "saude-beleza", name: "Saúde & Beleza", icon: "heart", coverImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop&q=80" },
        { id: "servicos-residenciais", name: "Serviços Residenciais", icon: "home", coverImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop&q=80" },
        { id: "automotivo", name: "Automotivo", icon: "car", coverImage: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop&q=80" },
        { id: "educacao", name: "Educação", icon: "book-open", coverImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop&q=80" },
        { id: "pets", name: "Pets", icon: "dog", coverImage: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&h=400&fit=crop&q=80" },
      ];
      for (const cat of defaultCategories) {
        await client.query(
          "INSERT INTO categories (id, name, icon, cover_image) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING",
          [cat.id, cat.name, cat.icon, cat.coverImage]
        );
      }
    }

    // Normalizar categorias antigas e erradas
    const categoryNormalizations = [
      ['automotivo', 'Automotivo'],
      ['motores', 'Automotivo'],
      ['auto motores', 'Automotivo'],
      ['auto-motores', 'Automotivo'],
      ['eletronicos', 'Eletrônicos'],
      ['saude', 'Saúde & Beleza'],
      ['saúde', 'Saúde & Beleza'],
      ['saude-beleza', 'Saúde & Beleza'],
      ['servicos', 'Serviços Residenciais'],
      ['serviços', 'Serviços Residenciais'],
      ['servicos-residenciais', 'Serviços Residenciais'],
      ['beleza', 'Saúde & Beleza'],
    ];
    for (const [oldCat, newCat] of categoryNormalizations) {
      await client.query(
        `UPDATE stores SET category=$2 WHERE lower(category)=lower($1)`,
        [oldCat, newCat]
      );
    }

    // As lojas de teste foram permanentemente removidas.

    // Inserir Dicas de Estilo predefinidas se a tabela estiver vazia
    const tipsCheck = await client.query("SELECT COUNT(*) FROM style_tips");
    if (parseInt(tipsCheck.rows[0].count) === 0) {
      const defaultTips = [
        {
          titulo: "Como escolher as cores certas para ti",
          descricao: "Descubre quais cores combinam com o teu tom de pele e personalidade.",
          imagem: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=500&fit=crop",
          dicas: ["Observa as veias no teu pulso — se parecerem azuis, tens tom frio", "Pessoas com tom quente ficam lindas em dourados e terracota", "Pessoas com tom frio ficam lindas em prateados e azuis"],
          ordem: 1
        },
        {
          titulo: "Peças essenciais que toda mulher deve ter",
          descricao: "Uma lista das peças básicas que nunca passam de moda.",
          imagem: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=500&fit=crop",
          dicas: ["Um blazer bem cortado", "Calça de ganga de boa qualidade", "Camisa branca impecável", "Vestido preto clássico"],
          ordem: 2
        },
        {
          titulo: "Como combinar estampas sem erro",
          descricao: "Dicas para misturar estampas com confiança e estilo.",
          imagem: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=500&fit=crop",
          dicas: ["Mantenha uma cor em comum entre as estampas", "Misture estampas de tamanhos diferentes", "Comece com preto e branco"],
          ordem: 3
        },
        {
          titulo: "Acessórios que fazem a diferença",
          descricao: "Como usar acessórios para elevar qualquer visual.",
          imagem: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=500&fit=crop",
          dicas: ["Um relógio elegante nunca sai de moda", "Colares em camadas estão em alta", "Óculos de sol são sempre um bom investimento"],
          ordem: 4
        }
      ];
      for (const tip of defaultTips) {
        await client.query(
          "INSERT INTO style_tips (titulo, descricao, imagem, dicas, ordem) VALUES ($1, $2, $3, $4, $5)",
          [tip.titulo, tip.descricao, tip.imagem, tip.dicas, tip.ordem]
        );
      }
    }


    console.log("✅ Tabelas criadas/actualizadas e admin semeado com sucesso.");
  } finally {
    client.release();
  }
}
