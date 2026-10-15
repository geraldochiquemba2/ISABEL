import { normCat } from "@/lib/storeCategories";

export type ProductGroup = { title: string; category: string };
export type ProductLike = { category?: string | null; subcategory?: string | null };

/** Normaliza para comparar: minúsculas, sem acentos, sem hífens/&, espaços colapsados. */
const norm = (s?: string | null): string => normCat(s ?? "").replace(/-/g, " ");

/**
 * Casa um produto com o grupo em que deve aparecer.
 * O produto guarda o TÍTULO da categoria ("Rosto & Pele"), mas a lista de grupos
 * usa a chave curta ("rosto-pele") — por isso comparamos com ambos, já normalizados.
 * Só a subcategoria conta quando a categoria está vazia (não classificar produtos
 * para o lado errado por causa de uma subcategoria genérica como "Acessórios").
 */
export function groupMatchesProduct(group: ProductGroup, p: ProductLike): boolean {
  const values = p.category ? [p.category] : [p.subcategory || ""];
  const title = norm(group.title);
  const key = norm(group.category);
  return values.some((raw) => {
    const value = norm(raw);
    if (!value) return false;
    if (title && value.includes(title)) return true;
    if (title && value.length >= 3 && title.includes(value)) return true;
    if (key && value.includes(key)) return true;
    if (key && value.length >= 3 && key.includes(value)) return true;
    return false;
  });
}

/** Produtos de uma categoria da lista de grupos. */
export function filterGroupProducts<T extends ProductLike>(
  products: T[],
  groups: ProductGroup[],
  category: string
): T[] {
  const group = groups.find((g) => g.category === category);
  if (!group) return [];
  return products.filter((p) => groupMatchesProduct(group, p));
}

/** Produtos sem grupo correspondente — sempre visíveis para editar/eliminar. */
export function filterOrphanProducts<T extends ProductLike>(
  products: T[],
  groups: ProductGroup[]
): T[] {
  return products.filter((p) => !groups.some((g) => groupMatchesProduct(g, p)));
}
