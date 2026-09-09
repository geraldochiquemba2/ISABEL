import pg from 'pg';
const pool = new pg.Pool({ 
  connectionString: 'postgresql://neondb_owner:npg_HCuLn0ekIAb7@ep-falling-sea-apm4c9ra-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require',
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
