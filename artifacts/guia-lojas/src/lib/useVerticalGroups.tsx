import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CategoryIcon } from "@/components/CategoryIconPicker";

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
  const { data } = useQuery({
    queryKey: ["db-groups", vertical],
    queryFn: async () => {
      try {
        const r = await fetch(`/api/categories?store_type=${encodeURIComponent(vertical)}`);
        if (!r.ok) return undefined;
        const j = await r.json();
        return Array.isArray(j) ? j : undefined;
      } catch {
        return undefined;
      }
    },
    staleTime: 60000,
  });
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
