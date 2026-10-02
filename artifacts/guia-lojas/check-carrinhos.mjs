import pg from 'pg';
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL não definida. Exporte a variável de ambiente primeiro.');
  process.exit(1);
}
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const r = await pool.query("SELECT carrinho_access, COUNT(*) as cnt FROM stores GROUP BY carrinho_access");
console.log(JSON.stringify(r.rows, null, 2));
await pool.end();
