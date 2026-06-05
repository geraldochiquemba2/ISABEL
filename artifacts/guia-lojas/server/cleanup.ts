import { pool } from "./db.js";

async function run() {
  const client = await pool.connect();
  try {
    // Delete all stores EXCEPT the real one
    const r = await client.query(
      `DELETE FROM stores WHERE id LIKE 'loja-test-%'`
    );
    console.log("Deleted", r.rowCount, "fake stores");

    // Delete all users except admin (999999999) and the real user (943412688)
    const u = await client.query(
      `DELETE FROM users WHERE phone NOT IN ('999999999', '943412688')`
    );
    console.log("Deleted", u.rowCount, "fake users");

    // Verify remaining
    const stores = await client.query(`SELECT id, name FROM stores`);
    console.log("Remaining stores:", stores.rows);

    const users = await client.query(`SELECT phone, name FROM users`);
    console.log("Remaining users:", users.rows);

    console.log("Done!");
  } finally {
    client.release();
    pool.end();
    process.exit(0);
  }
}
run().catch((e) => { console.error(e); process.exit(1); });
