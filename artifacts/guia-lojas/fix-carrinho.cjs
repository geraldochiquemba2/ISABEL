const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_HCuLn0ekIAb7@ep-falling-sea-apm4c9ra-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require'
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
