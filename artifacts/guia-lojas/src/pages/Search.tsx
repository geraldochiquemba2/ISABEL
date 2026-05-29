import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { STORES, CATEGORIES } from "@/data/mock";
import { useFavorites } from "@/lib/favorites";
import { StoreCard } from "@/components/StoreCard";
import { PageTransition } from "@/components/PageTransition";

function useSearchParams() {
  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  return params;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [, setLocation] = useLocation();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("categoria") || "");
  const [typeFilter, setTypeFilter] = useState<"all" | "loja" | "servico">("all");
  const [openOnly, setOpenOnly] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const { isFavorite, toggleFavorite } = useFavorites();

  const filtered = useMemo(() => {
    return STORES.filter((store) => {
      const matchQuery =
        !query ||
        store.name.toLowerCase().includes(query.toLowerCase()) ||
        store.category.toLowerCase().includes(query.toLowerCase()) ||
        store.description.toLowerCase().includes(query.toLowerCase());
      const matchCategory =
        !selectedCategory ||
        store.category.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").includes(selectedCategory.replace(/[^a-z0-9-]/g, ""));
      const matchOpen = !openOnly || store.isOpen;
      const isService = ["Serviços Residenciais", "Automotivo", "Saúde & Beleza", "Educação"].includes(store.category);
      const matchType =
        typeFilter === "all" ||
        (typeFilter === "servico" && isService) ||
        (typeFilter === "loja" && !isService);
      return matchQuery && matchCategory && matchOpen && matchType;
    });
  }, [query, selectedCategory, typeFilter, openOnly]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const url = new URLSearchParams();
    if (query) url.set("q", query);
    if (selectedCategory) url.set("categoria", selectedCategory);
    setLocation(`/busca?${url.toString()}`);
  }

  const activeFilters = [
    selectedCategory && { key: "categoria", label: CATEGORIES.find((c) => c.id === selectedCategory)?.name || selectedCategory },
    typeFilter !== "all" && { key: "type", label: typeFilter === "loja" ? "Lojas" : "Serviços" },
    openOnly && { key: "open", label: "Aberto agora" },
  ].filter(Boolean) as { key: string; label: string }[];

  function clearFilter(key: string) {
    if (key === "categoria") setSelectedCategory("");
    if (key === "type") setTypeFilter("all");
    if (key === "open") setOpenOnly(false);
  }

  return (
    <PageTransition>
      {/* Top search bar */}
      <div className="sticky top-14 z-30 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 border border-border rounded-full px-4 py-2 focus-within:border-foreground/40 transition-colors">
            <Search size={15} className="text-muted-foreground flex-shrink-0" />
            <input
              data-testid="input-search"
              placeholder="Buscar lojas e serviços..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent text-foreground placeholder:text-muted-foreground"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            )}
          </form>
          <button
            type="button"
            data-testid="button-toggle-filters"
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-1.5 text-sm px-4 py-2 border rounded-full transition-colors ${
              filterOpen || activeFilters.length > 0
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            }`}
          >
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">Filtros</span>
            {activeFilters.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-foreground text-[10px] font-bold flex items-center justify-center">
                {activeFilters.length}
              </span>
            )}
          </button>
        </div>

        {/* Active filters row */}
        {activeFilters.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-3 flex flex-wrap gap-2">
            {activeFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => clearFilter(f.key)}
                data-testid={`badge-filter-${f.key}`}
                className="flex items-center gap-1.5 text-xs px-3 py-1 bg-foreground text-background rounded-full hover:opacity-70 transition-opacity"
              >
                {f.label} <X size={11} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <FilterPanel
            selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
            typeFilter={typeFilter} setTypeFilter={setTypeFilter}
            openOnly={openOnly} setOpenOnly={setOpenOnly}
          />
        </aside>

        <main className="flex-1 min-w-0">
          {/* Mobile filter drawer */}
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden border border-border rounded-2xl p-5 mb-5 overflow-hidden"
              >
                <FilterPanel
                  selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
                  typeFilter={typeFilter} setTypeFilter={setTypeFilter}
                  openOnly={openOnly} setOpenOnly={setOpenOnly}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-sm text-muted-foreground mb-5">
            <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "resultado" : "resultados"}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <Search size={36} className="text-muted mx-auto mb-4 opacity-40" />
              <p className="text-muted-foreground text-sm">Nenhuma loja encontrada.</p>
              <button
                className="mt-4 text-sm font-medium text-foreground underline"
                onClick={() => {
                  setQuery(""); setSelectedCategory("");
                  setTypeFilter("all"); setOpenOnly(false);
                }}
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((store, i) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  isFavorite={isFavorite(store.id)}
                  onToggleFavorite={toggleFavorite}
                  index={i}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </PageTransition>
  );
}

interface FilterPanelProps {
  selectedCategory: string; setSelectedCategory: (v: string) => void;
  typeFilter: "all" | "loja" | "servico"; setTypeFilter: (v: "all" | "loja" | "servico") => void;
  openOnly: boolean; setOpenOnly: (v: boolean) => void;
}

function FilterPanel({ selectedCategory, setSelectedCategory, typeFilter, setTypeFilter, openOnly, setOpenOnly }: FilterPanelProps) {
  return (
    <div className="space-y-6 text-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Categoria</p>
        <div className="space-y-0.5">
          <FilterBtn active={!selectedCategory} onClick={() => setSelectedCategory("")}>Todas</FilterBtn>
          {CATEGORIES.map((cat) => (
            <FilterBtn key={cat.id} active={selectedCategory === cat.id} onClick={() => setSelectedCategory(cat.id === selectedCategory ? "" : cat.id)} testId={`filter-category-${cat.id}`}>
              {cat.name}
            </FilterBtn>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Tipo</p>
        <div className="space-y-0.5">
          {[
            { value: "all" as const, label: "Todos" },
            { value: "loja" as const, label: "Lojas" },
            { value: "servico" as const, label: "Serviços" },
          ].map((opt) => (
            <FilterBtn key={opt.value} active={typeFilter === opt.value} onClick={() => setTypeFilter(opt.value)} testId={`filter-type-${opt.value}`}>
              {opt.label}
            </FilterBtn>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-5">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            data-testid="filter-open-now"
            type="checkbox"
            checked={openOnly}
            onChange={(e) => setOpenOnly(e.target.checked)}
            className="accent-foreground"
          />
          <span className="text-sm text-foreground">Aberto agora</span>
        </label>
      </div>
    </div>
  );
}

function FilterBtn({ active, onClick, children, testId }: {
  active: boolean; onClick: () => void; children: React.ReactNode; testId?: string;
}) {
  return (
    <button
      onClick={onClick}
      data-testid={testId}
      className={`w-full text-left px-2 py-1.5 rounded-lg text-sm transition-colors ${
        active ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
