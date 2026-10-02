import pg from 'pg';
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL não definida. Exporte a variável de ambiente primeiro.');
  process.exit(1);
}
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Fix: swap name and phone, set proper password
await pool.query(
  "UPDATE users SET name = 'Lojista', phone = '944456284', password = '123456789' WHERE id = 779"
);

// Verify
const r = await pool.query("SELECT id, name, phone, status, store_type FROM users WHERE id = 779");
console.log("FIXED:", JSON.stringify(r.rows, null, 2));

await pool.end();
