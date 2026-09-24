/** Máximo de categorias por loja (principal + extras). */
export const MAX_STORE_CATEGORIES = 4;

type StoreLike = {
  category?: string | null;
  categories?: string[] | null;
};

/**
 * Devolve TODAS as categorias da loja (principal primeiro, sem duplicados,
 * no máximo MAX_STORE_CATEGORIES). Compatível com lojas antigas que só têm `category`.
 */
export function getStoreCategories(store: StoreLike | null | undefined): string[] {
  if (!store) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  const push = (c: unknown) => {
    if (typeof c !== "string") return;
    const v = c.trim();
    if (v && !seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  };
  if (Array.isArray(store.categories)) store.categories.forEach(push);
  push(store.category);
  return out.slice(0, MAX_STORE_CATEGORIES);
}

/** Normalização simples para comparar categorias (acentos/maiúsculas). */
export function normCat(s: string): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Testa se ALGUMA categoria da loja satisfaz `test` (recebe a categoria
 * normalizada). Para usar nos filtros/pesquisas das páginas Explorar.
 */
export function storeMatchesCategory(
  store: StoreLike | null | undefined,
  test: (normalized: string, raw: string) => boolean
): boolean {
  return getStoreCategories(store).some((c) => test(normCat(c), c));
}
