import { ANGOLA_PROVINCES } from "@/data/angolaData";

/**
 * Índice de localidades para pesquisa por proximidade.
 * Padrão adaptado do Aproveita-já (entries tipadas + ranking por prefixo),
 * mas alimentado pela base YESOLA (ANGOLA_PROVINCES.localities).
 * Sem coordenadas: "próximas" = mesma localidade primeiro, resto do município a seguir.
 */

export interface LocalityEntry {
  locality: string;
  municipality: string;
  province: string;
  /** Rótulo desambiguado: "Benfica — Belas, Luanda" */
  label: string;
}

export function norm(s: string): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

let cache: LocalityEntry[] | null = null;

/**
 * Todas as localidades (bairros) da base.
 * Inclui entradas sintéticas "Município / Centro" para municípios
 * que ainda não têm bairros cadastrados em ANGOLA_PROVINCES.localities,
 * para o autocomplete nunca devolver zero resultados por falta de dados.
 */
export function getAllLocalities(): LocalityEntry[] {
  if (cache) return cache;
  const out: LocalityEntry[] = [];
  for (const p of ANGOLA_PROVINCES) {
    const locs = p.localities || {};
    for (const [mun, arr] of Object.entries(locs)) {
      for (const loc of arr || []) {
        out.push({
          locality: loc,
          municipality: mun,
          province: p.name,
          label: `${loc} — ${mun}, ${p.name}`,
        });
      }
    }
    // Fallback: municípios sem bairros ganham entrada "Município / Centro"
    for (const mun of p.municipalities || []) {
      const has = (locs[mun] || []).length > 0;
      if (!has) {
        const sede = `${mun} / Centro`;
        out.push({
          locality: sede,
          municipality: mun,
          province: p.name,
          label: `${sede} — ${mun}, ${p.name}`,
        });
      }
    }
  }
  cache = out;
  return out;
}

/**
 * Pesquisa localidades (estilo Aproveita-já: exato → prefixo → contém).
 * Só devolve resultados a partir da 1ª letra. Máx `limit` (padrão 5).
 */
export function searchLocalities(query: string, limit = 5): LocalityEntry[] {
  const q = norm(query);
  if (!q) return [];
  const all = getAllLocalities();
  const scored = all
    .map((e) => {
      const n = norm(e.locality);
      let score = -1;
      if (n === q) score = 0;
      else if (n.startsWith(q)) score = 1;
      else if (n.includes(q)) score = 2;
      else {
        // Também casa por município/província (ex. "bel" → Belas)
        const ctx = norm(`${e.municipality} ${e.province}`);
        if (ctx.split(" ").some((w) => w.startsWith(q))) score = 3;
        else if (norm(e.label).includes(q)) score = 4;
      }
      return { e, score };
    })
    .filter((r) => r.score >= 0)
    .sort((a, b) => a.score - b.score || a.e.label.localeCompare(b.e.label));
  return scored.slice(0, limit).map((r) => r.e);
}

export function getProvinces(): string[] {
  return ANGOLA_PROVINCES.map((p) => p.name);
}

export function getMunicipalities(province: string): string[] {
  return ANGOLA_PROVINCES.find((p) => p.name === province)?.municipalities || [];
}

export function getLocalities(province: string, municipality: string): string[] {
  if (!province || !municipality) return [];
  const p = ANGOLA_PROVINCES.find((pr) => pr.name === province);
  if (!p) return [];
  const real = p.localities?.[municipality] || [];
  if (real.length > 0) return real;
  // Fallback: município existe mas ainda sem bairros cadastrados.
  // Devolve a sede para o cadastro não ficar bloqueado ("Sem correspondências").
  if ((p.municipalities || []).includes(municipality)) {
    return [`${municipality} / Centro`];
  }
  return [];
}

export type ScopeKind = "nearby" | "municipality" | "province";

export interface Scope {
  kind: ScopeKind;
  locality: string;
  municipality: string;
  province: string;
}

type StoreLike = {
  province?: string | null;
  municipality?: string | null;
  locality?: string | null;
};

/** Loja pertence ao âmbito? nearby = localidade exata OU mesmo município. */
export function storeMatchesScope(store: StoreLike, scope: Scope): boolean {
  if (!store) return false;
  if (scope.kind === "province") return store.province === scope.province;
  if (scope.kind === "municipality") return store.municipality === scope.municipality;
  // nearby
  if (store.locality && norm(store.locality) === norm(scope.locality)) return true;
  return store.municipality === scope.municipality;
}

/** Ranking dentro do âmbito nearby: localidade exata primeiro. */
export function scopeRank(store: StoreLike, scope: Scope): number {
  if (scope.kind !== "nearby") return 0;
  return store.locality && norm(store.locality) === norm(scope.locality) ? 0 : 1;
}
