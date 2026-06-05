import { pool } from "./db.js";

async function run() {
  const client = await pool.connect();
  try {
    const defaultSubs: Record<string, string[]> = {
      'moda': ['Roupa Masculina', 'Roupa Feminina', 'Calçados', 'Acessórios'],
      'eletronicos': ['Telemóveis', 'Computadores', 'Áudio', 'Electrodomésticos'],
      'alimentacao': ['Restaurante', 'Fast Food', 'Bebidas', 'Padaria', 'Mercado'],
      'saude-beleza': ['Farmácia', 'Salão de Beleza', 'Barbearia', 'Cosméticos'],
      'servicos-residenciais': ['Canalizador', 'Electricista', 'Limpeza', 'Construção'],
      'automotivo': ['Oficina', 'Stand', 'Peças Auto', 'Lavagem'],
      'educacao': ['Escola', 'Centro de Explicações', 'Cursos Profissionais', 'Línguas'],
      'pets': ['Clínica Veterinária', 'Ração', 'Acessórios', 'Banho e Tosa']
    };

    for (const [id, subs] of Object.entries(defaultSubs)) {
      // Postgres arrays in parameterized queries can be tricky, but node-postgres maps JS arrays to PG arrays for TEXT[]
      await client.query(`UPDATE categories SET subcategories = $1 WHERE id = $2 AND (subcategories IS NULL OR subcategories = '{}')`, [subs, id]);
    }
    console.log("Subcategorias padrão adicionadas!");
  } finally {
    client.release();
    pool.end();
    process.exit(0);
  }
}

run().catch(console.error);
