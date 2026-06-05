import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 20000,
});

async function removeTests() {
  const client = await pool.connect();
  try {
    console.log("A remover utilizadores de teste...");
    const resUsers = await client.query("DELETE FROM users WHERE store_id LIKE 'loja-test-%'");
    console.log(`Foram removidos ${resUsers.rowCount} utilizadores de teste.`);

    console.log("A remover lojas de teste...");
    const resStores = await client.query("DELETE FROM stores WHERE id LIKE 'loja-test-%'");
    console.log(`Foram removidas ${resStores.rowCount} lojas de teste.`);

    console.log("Limpeza concluída com sucesso!");
  } catch (err) {
    console.error("Erro durante a limpeza:", err);
  } finally {
    client.release();
    process.exit(0);
  }
}

removeTests();
