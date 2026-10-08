// Cliente Neon via HTTP (o driver pg com TCP não corre no Workers).
// API compatível: db(env).query(text, params) -> linhas (array).
// NOTA 1: na v0.10.4 o neon() NÃO tem .query — usa-se chamada direta
// sql(text, params). (A v2 tem .query mas muda o lockfile; ficar na v0.)
// NOTA 2: cada query HTTP é independente — NÃO usar BEGIN/COMMIT multi-query
// (não há sessão); para escritas atómicas usar uma só statement.
import { neon } from "@neondatabase/serverless";
import type { Env } from "./env";

export function db(env: Env) {
  const sql = neon(env.DATABASE_URL);
  return {
    query: (text: string, params: unknown[] = []) => sql(text, params) as Promise<any[]>,
  };
}
