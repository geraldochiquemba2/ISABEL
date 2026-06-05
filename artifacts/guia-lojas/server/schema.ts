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

    // Inserir lojas de teste se a tabela estiver vazia
    const storesCount = await client.query("SELECT COUNT(*) FROM stores");
    if (parseInt(storesCount.rows[0].count) < 12) {
      const testStores = [
        { id: 'loja-test-2', name: 'Telefones Digital', category: 'Eletrônicos', province: 'Luanda', municipality: 'Talatona', address: 'Av. Agostinho Neto', phone: '914111111', whatsapp: '914111111' },
        { id: 'loja-test-3', name: 'Restaurante O Sabor', category: 'Alimentação', province: 'Luanda', municipality: 'Benfica', address: 'Rua 17 de Setembro', phone: '924222222', whatsapp: '924222222' },
        { id: 'loja-test-4', name: 'Salão de Beleza Encanto', category: 'Beleza', province: 'Luanda', municipality: 'Maianga', address: 'Av. Deolinda Rodrigues', phone: '934333333', whatsapp: '934333333' },
        { id: 'loja-test-5', name: 'Padaria Pão Quente', category: 'Alimentação', province: 'Luanda', municipality: 'Samba', address: 'Rua de Portugal', phone: '944444444', whatsapp: '944444444' },
        { id: 'loja-test-6', name: 'Loja de Roupas Estilo', category: 'Moda', province: 'Luanda', municipality: 'Rangel', address: 'Av. Zaire', phone: '954555555', whatsapp: '954555555' },
        { id: 'loja-test-7', name: 'Farmácia Saúde Plus', category: 'Saúde', province: 'Luanda', municipality: 'Vila Alice', address: 'Rua Cmd Nzuji', phone: '964666666', whatsapp: '964666666' },
        { id: 'loja-test-8', name: 'Oficina Auto Premium', category: 'Automotivo', province: 'Huambo', municipality: 'Huambo', address: 'Estrada da Belém', phone: '974777777', whatsapp: '974777777' },
        { id: 'loja-test-9', name: 'Pet Shop Feliz', category: 'Pets', province: 'Luanda', municipality: 'Cazenga', address: 'Rua Dos Irmãos', phone: '984888888', whatsapp: '984888888' },
        { id: 'loja-test-10', name: 'Instituto de Inglês', category: 'Educação', province: 'Luanda', municipality: 'Kilamba', address: 'Av. da Universidade', phone: '914999999', whatsapp: '914999999' },
        { id: 'loja-test-11', name: 'Supermercado Nacional', category: 'Alimentação', province: 'Huambo', municipality: 'Bailundo', address: 'Av. Principal', phone: '925000000', whatsapp: '925000000' },
        { id: 'loja-test-12', name: 'Studio Fotográfico Arte', category: 'Serviços', province: 'Luanda', municipality: 'Praia do Bispo', address: 'Rua da Praia', phone: '935111111', whatsapp: '935111111' },
      ];

      for (const store of testStores) {
        await client.query(`
          INSERT INTO stores (id, name, category, province, municipality, address, phone, whatsapp, is_open)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)
          ON CONFLICT (id) DO NOTHING;
        `, [store.id, store.name, store.category, store.province, store.municipality, store.address, store.phone, store.whatsapp]);
      }

      // Criar usuários aprovados para as lojas de teste
      for (let i = 2; i <= 12; i++) {
        const phone = `91${i}111111`;
        await client.query(`
          INSERT INTO users (name, phone, password, province, municipality, address, store_id, status)
          VALUES ($1, $2, '1234567890', $3, $4, $5, $6, 'APROVADO')
          ON CONFLICT (phone) DO NOTHING;
        `, [
          `Loja Teste ${i}`,
          phone,
          'Luanda',
          'Luanda',
          `Endereço Teste ${i}`,
          `loja-test-${i}`
        ]);
      }
    }

    console.log("✅ Tabelas criadas/actualizadas e admin semeado com sucesso.");
  } finally {
    client.release();
  }
}
