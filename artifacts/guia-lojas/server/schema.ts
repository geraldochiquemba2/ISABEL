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
        carrinho_access TEXT DEFAULT 'NAO_SOLICITADO',
        description TEXT,
        cover_color TEXT,
        cover_image TEXT,
        cover_images TEXT[],
        logo_url    TEXT,
        province    TEXT,
        municipality TEXT,
        store_type  TEXT DEFAULT 'collection',
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
        description   TEXT DEFAULT '',
        created_at    TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS users (
        id            SERIAL PRIMARY KEY,
        name          TEXT NOT NULL,
        phone         TEXT NOT NULL,
        password      TEXT NOT NULL,
        province      TEXT,
        municipality  TEXT,
        address       TEXT,
        store_id      TEXT,
        store_type    TEXT DEFAULT 'collection',
        status        TEXT DEFAULT 'PENDENTE',
        status_reason TEXT,
        created_at    TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(phone, store_type)
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

      CREATE TABLE IF NOT EXISTS wedding_groups (
        id          TEXT PRIMARY KEY,
        number      TEXT NOT NULL,
        title       TEXT NOT NULL,
        intro       TEXT,
        items       TEXT[] DEFAULT '{}',
        category    TEXT NOT NULL,
        image       TEXT,
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
      `ALTER TABLE stores ADD COLUMN IF NOT EXISTS carrinho_access TEXT DEFAULT 'NAO_SOLICITADO'`,
      `UPDATE stores SET carrinho_access = 'NAO_SOLICITADO' WHERE carrinho_access IS NULL OR carrinho_access = 'PENDENTE'`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS is_carrinho BOOLEAN DEFAULT FALSE`,
      `ALTER TABLE stores ADD COLUMN IF NOT EXISTS store_type TEXT DEFAULT 'collection'`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS store_type TEXT DEFAULT 'collection'`,
      `UPDATE users SET store_type = 'collection' WHERE store_type IS NULL`,
      `UPDATE wedding_groups SET title = 'Pedidos de Casamento, Noivados & Momentos Românticos' WHERE id = 'wg-02'`,
      `UPDATE wedding_groups SET image = NULL WHERE id = 'wg-01'`,
      `DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_phone_key') THEN ALTER TABLE users DROP CONSTRAINT users_phone_key; END IF; END $$`,
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_phone_store_type_unique') THEN ALTER TABLE users ADD CONSTRAINT users_phone_store_type_unique UNIQUE (phone, store_type); END IF; END $$`,
      `UPDATE stores SET store_type = 'weddings' WHERE name ILIKE '%weddings%' OR category ILIKE '%weddings%'`,
      `ALTER TABLE stores ADD COLUMN IF NOT EXISTS schedule JSONB DEFAULT NULL`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT DEFAULT ''`,
      `CREATE TABLE IF NOT EXISTS weddings_page_content (
        id TEXT PRIMARY KEY DEFAULT 'main',
        content JSONB NOT NULL DEFAULT '{}',
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )`,
    ];

    for (const sql of alterations) {
      await client.query(sql);
    }

    // Inserir Admin se não existir
    await client.query(`
      INSERT INTO users (name, phone, password, province, municipality, address, status, store_type)
      VALUES ('Admin', '999999999', '1234567890', 'Luanda', 'Luanda', 'Endereço Admin', 'APROVADO', 'collection')
      ON CONFLICT (phone, store_type) DO NOTHING;
      INSERT INTO users (name, phone, password, province, municipality, address, status, store_type)
      VALUES ('Admin', '999999999', '1234567890', 'Luanda', 'Luanda', 'Endereço Admin', 'APROVADO', 'weddings')
      ON CONFLICT (phone, store_type) DO NOTHING;
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

    // Inserir Wedding Groups predefinidos se a tabela estiver vazia
    const wgCheck = await client.query("SELECT COUNT(*) FROM wedding_groups");
    if (parseInt(wgCheck.rows[0].count) === 0) {
      const defaultGroups = [
        { id: "wg-01", number: "01", title: "Planeamento & Organização de Casamentos", intro: "Do primeiro sim ao último brinde, guardamos o fio invisível de tudo.", items: ["Wedding Planner & Assessoria do Evento", "Assistente Pessoal dos Noivos", "Weddings & Mini-Weddings", "Mestre de Cerimónias", "Hostesses e Acolhimento VIP"], category: "planeamento", image: null },
        { id: "wg-02", number: "02", title: "Pedidos de Casamento, Noivados & Momentos Românticos", intro: "Gestos íntimos, pensados para a vossa história e para aquele instante único.", items: ["Criador de Pedidos de Casamento", "Aniversários de Namoro/Casamento", "Chefs ao Domicílio para Jantares Íntimos", "Serenatas e Músicos para Pedidos"], category: "noivados", image: null },
        { id: "wg-03", number: "03", title: "Fotografia, Vídeo & Produção Audiovisual", intro: "A memória viva de cada detalhe, feita para durar gerações.", items: ["Fotógrafo de Casamento", "Videógrafo & Cinematografia", "Drone & Cobertura Aérea", "Aftermovie & Edição Cinematográfica", "Álbuns & Livros de Fotos"], category: "fotografia", image: null },
        { id: "wg-04", number: "04", title: "Beleza & Estilismo para Noivas e Noivos", intro: "A vossa melhor versão, sentida e vista.", items: ["Maquilhagem Profissional para Noivas", "Penteado & Hair Styling", "Estilista Pessoal & Consultoria de Imagem", "Tratamentos de Pele e Corpo", "Grooming & Barba para Noivos"], category: "beleza", image: null },
        { id: "wg-05", number: "05", title: "Decoração, Flores & Experiências", intro: "O cenário, os sabores e o ritmo que fazem cada celebração ganhar alma.", items: ["Locais e Espaços para Eventos", "Design Floral & Decoração Temática", "Catering, Bolos de Noiva e Bar de Cocktails", "DJs, Bandas e Entretenimento"], category: "decoracao", image: null },
      ];
      for (const g of defaultGroups) {
        await client.query(
          "INSERT INTO wedding_groups (id, number, title, intro, items, category, image) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING",
          [g.id, g.number, g.title, g.intro, g.items, g.category, g.image]
        );
      }
    }


    console.log("✅ Tabelas criadas/actualizadas e admin semeado com sucesso.");

    // Índices para optimizar queries frequentes
    const indexes = [
      `CREATE INDEX IF NOT EXISTS idx_stores_store_type ON stores(store_type)`,
      `CREATE INDEX IF NOT EXISTS idx_stores_phone ON stores(phone)`,
      `CREATE INDEX IF NOT EXISTS idx_stores_province ON stores(province)`,
      `CREATE INDEX IF NOT EXISTS idx_stores_municipality ON stores(municipality)`,
      `CREATE INDEX IF NOT EXISTS idx_stores_category ON stores(category)`,
      `CREATE INDEX IF NOT EXISTS idx_stores_is_open ON stores(is_open)`,
      `CREATE INDEX IF NOT EXISTS idx_stores_created_at ON stores(created_at DESC)`,
      `CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id)`,
      `CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`,
      `CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory)`,
      `CREATE INDEX IF NOT EXISTS idx_products_is_carrinho ON products(is_carrinho)`,
      `CREATE INDEX IF NOT EXISTS idx_products_store_category ON products(store_id, category)`,
      `CREATE INDEX IF NOT EXISTS idx_users_phone_store_type ON users(phone, store_type)`,
      `CREATE INDEX IF NOT EXISTS idx_users_store_id ON users(store_id)`,
      `CREATE INDEX IF NOT EXISTS idx_users_status ON users(status)`,
      `CREATE INDEX IF NOT EXISTS idx_users_store_type ON users(store_type)`,
      `CREATE INDEX IF NOT EXISTS idx_style_tips_ordem ON style_tips(ordem)`,
      `CREATE INDEX IF NOT EXISTS idx_wedding_groups_category ON wedding_groups(category)`,
    ];
    for (const idx of indexes) {
      await client.query(idx);
    }

    console.log("✅ Índices criados com sucesso.");
  } finally {
    client.release();
  }
}
