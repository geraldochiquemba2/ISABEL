// Cliente Neon via HTTP (o driver pg com TCP não corre no Workers).
// API compatível: db(env).query(text, params) -> linhas (array).
// NOTA: cada query HTTP é independente — NÃO usar BEGIN/COMMIT multi-query
// (não há sessão); para escritas atómicas usar uma só statement.
import { neon } from "@neondatabase/serverless";
import type { Env } from "./env";

export function db(env: Env) {
  // .query existe em runtime; o tipo público só expõe tagged-template.
  const sql = neon(env.DATABASE_URL) as unknown as {
    query: (text: string, params?: unknown[]) => Promise<any[]>;
  };
  return {
    query: (text: string, params: unknown[] = []) => sql.query(text, params),
  };
}
