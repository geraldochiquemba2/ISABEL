import { Pool } from "pg";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL não definida. Configure a variável de ambiente DATABASE_URL (Render) ou o ficheiro .env local (não versionado)."
  );
}

export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  // Plano free (Render + Neon): poucas ligações e tolerância ao cold start.
  // O Neon hiberna aos ~5 min e acordar leva 5-10s — com connectionTimeout de
  // 5s os primeiros pedidos após idle falhavam sempre (ver api-output.log:
  // "Connection terminated due to connection timeout"). O keepAlive TCP evita
  // que o Neon feche ligações idle sem o pool saber.
  max: 5,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 15000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});
