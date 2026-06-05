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

import { useQuery } from "@tanstack/react-query";
import { fetchStores } from "@/lib/api";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [, setLocation] = useLocation();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("categoria") || "");
  const [typeFilter, setTypeFilter] = useState<"all" | "loja" | "servico">("all");
  const [openOnly, setOpenOnly] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // Temporary states for the filters drawer/panel
  const [tempCategory, setTempCategory] = useState(selectedCategory);
  const [tempType, setTempType] = useState(typeFilter);
  const [tempOpenOnly, setTempOpenOnly] = useState(openOnly);

  const { isFavorite, toggleFavorite } = useFavorites();

  const apiCategory = useMemo(() => {
    return CATEGORIES.find(c => c.id === selectedCategory)?.name || selectedCategory;
  }, [selectedCategory]);

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ["stores", query, selectedCategory],
    queryFn: () => fetchStores({ q: query, category: apiCategory }),
  });

  const filtered = useMemo(() => {
    return stores.filter((store) => {
      const matchOpen = !openOnly || store.isOpen;
      const isService = ["Serviços Residenciais", "Automotivo", "Saúde & Beleza", "Educação"].includes(store.category);
      const matchType =
        typeFilter === "all" ||
        (typeFilter === "servico" && isService) ||
        (typeFilter === "loja" && !isService);
      return matchOpen && matchType;
    });
  }, [stores, openOnly, typeFilter]);

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
    if (key === "categoria") {
      setSelectedCategory("");
      setTempCategory("");
    }
    if (key === "type") {
      setTypeFilter("all");
      setTempType("all");
    }
    if (key === "open") {
      setOpenOnly(false);
      setTempOpenOnly(false);
    }
  }

  const handleApply = () => {
    setSelectedCategory(tempCategory);
    setTypeFilter(tempType);
    setOpenOnly(tempOpenOnly);
    setFilterOpen(false);
  };

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
            onClick={() => {
              // Reset temp to active filters when opening/closing
              setTempCategory(selectedCategory);
              setTempType(typeFilter);
              setTempOpenOnly(openOnly);
              setFilterOpen(!filterOpen);
            }}
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-3 flex flex-wrap gap-2 items-center">
            {activeFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => clearFilter(f.key)}
                data-testid={`badge-filter-${f.key}`}
                className="flex items-center gap-1.5 text-xs px-3 py-1 bg-foreground text-background rounded-full hover:opacity-70 transition-opacity border border-black"
              >
                {f.label} <X size={11} />
              </button>
            ))}
            <button
              onClick={() => {
                setSelectedCategory("");
                setTempCategory("");
                setTypeFilter("all");
                setTempType("all");
                setOpenOnly(false);
                setTempOpenOnly(false);
              }}
              className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline transition-colors px-2 py-1"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterPanel
            selectedCategory={tempCategory} setSelectedCategory={setTempCategory}
            typeFilter={tempType} setTypeFilter={setTempType}
            openOnly={tempOpenOnly} setOpenOnly={setTempOpenOnly}
            onApply={handleApply}
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
                className="lg:hidden border border-black rounded-2xl p-5 mb-5 overflow-hidden bg-white"
              >
                <FilterPanel
                  selectedCategory={tempCategory} setSelectedCategory={setTempCategory}
                  typeFilter={tempType} setTypeFilter={setTempType}
                  openOnly={tempOpenOnly} setOpenOnly={setTempOpenOnly}
                  onApply={handleApply}
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
                  setQuery("");
                  setSelectedCategory("");
                  setTempCategory("");
                  setTypeFilter("all");
                  setTempType("all");
                  setOpenOnly(false);
                  setTempOpenOnly(false);
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
  onApply?: () => void;
}

function FilterPanel({ selectedCategory, setSelectedCategory, typeFilter, setTypeFilter, openOnly, setOpenOnly, onApply }: FilterPanelProps) {
  return (
    <div className="space-y-5 text-sm">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Categoria</p>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-2.5 py-1 rounded-full text-xs transition-colors border ${
              !selectedCategory
                ? "bg-foreground text-background border-black"
                : "border-border text-muted-foreground hover:border-black hover:text-foreground"
            }`}
          >
            Todas
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id === selectedCategory ? "" : cat.id)}
              data-testid={`filter-category-${cat.id}`}
              className={`px-2.5 py-1 rounded-full text-xs transition-colors border ${
                selectedCategory === cat.id
                  ? "bg-foreground text-background border-black"
                  : "border-border text-muted-foreground hover:border-black hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Tipo</p>
        <div className="flex flex-wrap gap-1.5">
          {[
            { value: "all" as const, label: "Todos" },
            { value: "loja" as const, label: "Lojas" },
            { value: "servico" as const, label: "Serviços" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTypeFilter(opt.value)}
              data-testid={`filter-type-${opt.value}`}
              className={`px-2.5 py-1 rounded-full text-xs transition-colors border ${
                typeFilter === opt.value
                  ? "bg-foreground text-background border-black"
                  : "border-border text-muted-foreground hover:border-black hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <label className="flex items-center gap-2 cursor-pointer py-1">
          <input
            data-testid="filter-open-now"
            type="checkbox"
            checked={openOnly}
            onChange={(e) => setOpenOnly(e.target.checked)}
            className="accent-foreground w-4 h-4 rounded border-gray-300"
          />
          <span className="text-sm font-medium text-foreground">Aberto agora</span>
        </label>
      </div>

      {onApply && (
        <div className="border-t border-border pt-4 flex gap-2">
          <button
            onClick={() => {
              setSelectedCategory("");
              setTypeFilter("all");
              setOpenOnly(false);
            }}
            className="flex-1 border border-black text-foreground font-medium py-2 rounded-full hover:bg-muted transition-colors text-sm"
          >
            Limpar
          </button>
          <button
            onClick={onApply}
            className="flex-1 bg-foreground text-background font-medium py-2 rounded-full hover:opacity-80 transition-opacity text-sm border border-black"
          >
            Aplicar
          </button>
        </div>
      )}
    </div>
  );
}
