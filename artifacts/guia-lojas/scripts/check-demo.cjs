const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
(async () => {
  const r = await pool.query(
    `SELECT id, name, phone, store_id, store_type, status, status_reason, subscription_status, subscription_expires_at
     FROM users WHERE phone IN ('999000111','999999999') ORDER BY phone, store_type`
  );
  console.log(JSON.stringify(r.rows, null, 2));
  const stores = await pool.query(
    `SELECT id, name, store_type, phone FROM stores WHERE phone IN ('999000111','999999999') ORDER BY store_type`
  );
  console.log(JSON.stringify(stores.rows, null, 2));
  await pool.end();
})().catch((e) => { console.error(e.message); process.exit(1); });
