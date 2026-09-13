import pg from 'pg';
const pool = new pg.Pool({ connectionString: 'postgresql://neondb_owner:npg_HCuLn0ekIAb7@ep-falling-sea-apm4c9ra-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require' });
const r = await pool.query("SELECT carrinho_access, COUNT(*) as cnt FROM stores GROUP BY carrinho_access");
console.log(JSON.stringify(r.rows, null, 2));
await pool.end();
