const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL não definida. Exporte a variável de ambiente primeiro.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function fix() {
  try {
    const products = await pool.query("SELECT id, name, store_id, is_carrinho FROM products");
    console.log('Todos os produtos:');
    products.rows.forEach(r => console.log(`  ${r.id} | ${r.name} | store=${r.store_id} | is_carrinho=${r.is_carrinho}`));

    const res = await pool.query(
      "UPDATE products SET is_carrinho = true WHERE is_carrinho = false OR is_carrinho IS NULL"
    );
    console.log('\nProdutos atualizados para is_carrinho=true:', res.rowCount);

    const after = await pool.query("SELECT id, name, is_carrinho FROM products");
    console.log('\nDepois da atualização:');
    after.rows.forEach(r => console.log(`  ${r.id} | ${r.name} | is_carrinho=${r.is_carrinho}`));
  } catch (err) {
    console.error('Erro:', err.message);
  } finally {
    await pool.end();
  }
}

fix();
