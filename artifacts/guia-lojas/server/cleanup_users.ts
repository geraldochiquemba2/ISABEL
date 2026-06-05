import { pool } from "./db.js";

async function run() {
  const client = await pool.connect();
  try {
    const testPhones = [
      '914111111', '924222222', '934333333', '944444444', 
      '954555555', '964666666', '974777777', '984888888',
      '994999999', '915111111', '925222222', '935333333'
    ];

    const r = await client.query(
      `DELETE FROM users WHERE phone = ANY($1::text[])`,
      [testPhones]
    );
    console.log("Deleted", r.rowCount, "test accounts");
  } finally {
    client.release();
    pool.end();
    process.exit(0);
  }
}

run().catch(console.error);
