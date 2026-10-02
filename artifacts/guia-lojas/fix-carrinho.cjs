const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL não definida. Exporte a variável de ambiente primeiro.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function check() {
  try {
    const stores = await pool.query("SELECT id, name, carrinho_access FROM stores");
    console.log('Lojas:');
    stores.rows.forEach(r => console.log(`  ${r.id} | ${r.name} | carrinho_access=${r.carrinho_access}`));

    const products = await pool.query("SELECT id, name, store_id, is_carrinho FROM products");
    console.log('\nProdutos:');
    products.rows.forEach(r => console.log(`  ${r.id} | ${r.name} | store=${r.store_id} | is_carrinho=${r.is_carrinho}`));
  } catch (err) {
    console.error('Erro:', err.message);
  } finally {
    await pool.end();
  }
}

check();
