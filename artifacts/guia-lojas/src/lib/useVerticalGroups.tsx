import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CategoryIcon } from "@/components/CategoryIconPicker";

async function fetchDbGroups(vertical: string): Promise<any[] | undefined> {
  try {
    const r = await fetch(`/api/categories?store_type=${encodeURIComponent(vertical)}`);
    if (!r.ok) return undefined;
    const j = await r.json();
    return Array.isArray(j) ? j : undefined;
  } catch {
    return undefined;
  }
}

function useDbGroups(vertical: string) {
  const { data } = useQuery({
    queryKey: ["db-groups", vertical],
    queryFn: () => fetchDbGroups(vertical),
    staleTime: 60000,
  });
  return data;
}

export interface ExploreGroup {
  number: string;
  title: string;
  intro: string;
  category: string;
  icon?: any;
  items: string[];
}

// O Explorar lê os grupos da BD (o Admin manda). O que não existe na BD
// não aparece — sem fallback para o fixo, por decisão do negócio.
// Só enquanto carrega (ou se a API falhar) mostra a base recebida.
export function useVerticalGroups(meta: ExploreGroup[], vertical: string): ExploreGroup[] {
  const data = useDbGroups(vertical);
  return useMemo(() => {
    if (!Array.isArray(data)) return meta;
    const out: ExploreGroup[] = [];
    for (const g of meta) {
      const db = data.find((c: any) => c.id === vertical + "--" + g.category);
      if (!db) continue; // removido/inexistente no admin → fora do explorar
      out.push({
        number: g.number,
        title: db.name || g.title,
        intro: db.intro ?? g.intro,
        category: g.category,
        icon: db.icon ? <CategoryIcon name={db.icon} size={20} /> : g.icon,
        items: Array.isArray(db.subcategories) ? db.subcategories : g.items,
      });
    }
    // Grupos criados no admin sem par no código entram no fim.
    for (const c of data) {
      if ((c.subcategories || []).length === 0 && !c.name) continue;
      const known = meta.some((g) => vertical + "--" + g.category === c.id);
      if (known) continue;
      out.push({
        number: String(out.length + 1).padStart(2, "0"),
        title: c.name,
        intro: c.intro || "",
        category: String(c.id).includes("--") ? String(c.id).split("--").slice(1).join("--") : c.id,
        icon: <CategoryIcon name={c.icon} size={20} />,
        items: Array.isArray(c.subcategories) ? c.subcategories : [],
      });
    }
    return out;
  }, [data, meta, vertical]);
}

// Títulos das categorias vindos do Admin (cadastro da loja, selects).
// Sem linha na BD, o título sai da lista.
export function useGroupTitles(meta: string[], vertical: string): string[] {
  const data = useDbGroups(vertical);
  return useMemo(() => {
    if (!Array.isArray(data)) return meta;
    const titles = data.map((c: any) => c.name).filter(Boolean);
    return titles.length ? titles : meta;
  }, [data, meta]);
}

export interface HomeCategory {
  id: string;
  name: string;
  icon: any;
}

// Cartões da Home vindos do Admin (mesmo slug para navegar ao Explorar).
// Sem linha na BD, o cartão sai da Home.
export function useHomeCategories(meta: HomeCategory[], vertical: string): HomeCategory[] {
  const data = useDbGroups(vertical);
  return useMemo(() => {
    if (!Array.isArray(data)) return meta;
    const out: HomeCategory[] = [];
    for (const m of meta) {
      const db = data.find((c: any) => c.id === vertical + "--" + m.id);
      if (!db) continue;
      out.push({
        id: m.id,
        name: db.name || m.name,
        icon: db.icon ? <CategoryIcon name={db.icon} size={32} /> : m.icon,
      });
    }
    for (const c of data) {
      if (meta.some((m) => vertical + "--" + m.id === c.id)) continue;
      const slug = String(c.id).includes("--") ? String(c.id).split("--").slice(1).join("--") : c.id;
      out.push({ id: slug, name: c.name, icon: <CategoryIcon name={c.icon} size={32} /> });
    }
    return out;
  }, [data, meta, vertical]);
}
