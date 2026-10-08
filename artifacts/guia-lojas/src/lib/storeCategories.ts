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

/** Conta as fotos REAIS ÚNICAS da loja (capas + produtos), como os cards mostram.
 * Deduplica: a mesma URL gravada em cover_image + cover_images não conta 2x. */
export function countStorePhotos(store: PhotoStoreLike | null | undefined): number {
  if (!store) return 0;
  const seen = new Set<string>();
  const push = (u: unknown) => {
    if (typeof u !== "string") return;
    const v = u.trim();
    if (v) seen.add(v);
  };
  if (Array.isArray(store.coverImages)) {
    // imageUrls por vezes vem como string separada por espaços (legado)
    for (const u of store.coverImages) {
      if (typeof u === "string" && u.includes(" ") && !u.trim().startsWith("/")) {
        u.split(" ").filter(Boolean).forEach(push);
      } else push(u);
    }
  }
  push(store.coverImage);
  if (Array.isArray(store.products)) {
    for (const p of store.products) {
      if (!p) continue;
      if (typeof p.imageUrls === "string") p.imageUrls.split(" ").filter(Boolean).forEach(push);
      else if (Array.isArray(p.imageUrls)) p.imageUrls.forEach(push);
      else push(p.imageUrl);
    }
  }
  return seen.size;
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

export interface StoreGroupLike {
  category: string;
  title: string;
}

/**
 * Filtra os grupos da vertical aos da loja: o formulário de produto mostra
 * só as categorias da loja (e as suas subcategorias), não as de todas as
 * lojas. Se nenhuma categoria da loja casar (categorias antigas de texto
 * livre), devolve todos os grupos (fallback = comportamento atual).
 */
export function filterGroupsForStore<G extends StoreGroupLike>(
  groups: G[],
  store: StoreLike | null | undefined
): G[] {
  const cats = getStoreCategories(store).map(normCat).filter(Boolean);
  if (!cats.length) return groups;
  const matched = groups.filter((g) => {
    const slug = normCat(String((g as any).category || "")).replace(/-/g, " ");
    const title = normCat(String((g as any).title || ""));
    return cats.some((c) => {
      if (!c) return false;
      if (slug && (c.includes(slug) || slug.includes(c))) return true;
      if (title && (c.includes(title) || title.includes(c))) return true;
      return false;
    });
  });
  return matched.length > 0 ? matched : groups;
}
