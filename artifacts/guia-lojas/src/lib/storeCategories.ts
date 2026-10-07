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

type PhotoStoreLike = {
  coverImage?: string | null;
  coverImages?: string[] | null;
  products?: Array<{ imageUrl?: string | null; imageUrls?: string | string[] | null }> | null;
};

/** Conta as fotos reais da loja (capas + produtos), como os cards mostram. */
export function countStorePhotos(store: PhotoStoreLike | null | undefined): number {
  if (!store) return 0;
  let n = 0;
  if (Array.isArray(store.coverImages)) {
    n += store.coverImages.filter((u) => typeof u === "string" && u.trim()).length;
  }
  if (typeof store.coverImage === "string" && store.coverImage.trim()) n += 1;
  if (Array.isArray(store.products)) {
    for (const p of store.products) {
      if (!p) continue;
      if (typeof p.imageUrls === "string") n += p.imageUrls.split(" ").filter(Boolean).length;
      else if (Array.isArray(p.imageUrls)) n += p.imageUrls.filter((u) => typeof u === "string" && u.trim()).length;
      else if (typeof p.imageUrl === "string" && p.imageUrl.trim()) n += 1;
    }
  }
  return n;
}

/**
 * Ordenação dos cards (Homes e Explorar): lojas com mais de 1 foto primeiro
 * e, dentro de cada grupo, as mais recentes primeiro.
 */
export function sortStoresForCards<T extends PhotoStoreLike & { createdAt?: string | null }>(stores: T[]): T[] {
  return [...stores].sort((a, b) => {
    const am = countStorePhotos(a) > 1 ? 0 : 1;
    const bm = countStorePhotos(b) > 1 ? 0 : 1;
    if (am !== bm) return am - bm;
    const ta = (a && a.createdAt && Date.parse(a.createdAt)) || 0;
    const tb = (b && b.createdAt && Date.parse(b.createdAt)) || 0;
    return tb - ta;
  });
}
