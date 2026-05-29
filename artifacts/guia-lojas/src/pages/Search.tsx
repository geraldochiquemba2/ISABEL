import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { STORES, CATEGORIES } from "@/data/mock";
import { useFavorites } from "@/lib/favorites";
import { StoreCard } from "@/components/StoreCard";
import { PageTransition } from "@/components/PageTransition";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function useSearchParams() {
  const [location] = useLocation();
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
  const [minRating, setMinRating] = useState(0);
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
      const matchRating = store.rating >= minRating;
      const matchOpen = !openOnly || store.isOpen;
      const isService = ["Serviços Residenciais", "Automotivo", "Saúde & Beleza", "Educação"].includes(store.category);
      const matchType =
        typeFilter === "all" ||
        (typeFilter === "servico" && isService) ||
        (typeFilter === "loja" && !isService);

      return matchQuery && matchCategory && matchRating && matchOpen && matchType;
    });
  }, [query, selectedCategory, minRating, typeFilter, openOnly]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const url = new URLSearchParams();
    if (query) url.set("q", query);
    if (selectedCategory) url.set("categoria", selectedCategory);
    setLocation(`/busca?${url.toString()}`);
  }

  function clearFilter(key: string) {
    if (key === "categoria") setSelectedCategory("");
    if (key === "rating") setMinRating(0);
    if (key === "type") setTypeFilter("all");
    if (key === "open") setOpenOnly(false);
  }

  const activeFilters = [
    selectedCategory && { key: "categoria", label: CATEGORIES.find((c) => c.id === selectedCategory)?.name || selectedCategory },
    minRating > 0 && { key: "rating", label: `Acima de ${minRating} estrelas` },
    typeFilter !== "all" && { key: "type", label: typeFilter === "loja" ? "Lojas" : "Serviços" },
    openOnly && { key: "open", label: "Aberto agora" },
  ].filter(Boolean) as { key: string; label: string }[];

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              data-testid="input-search"
              placeholder="Buscar lojas e serviços..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-11 bg-background"
            />
          </div>
          <Button type="submit" data-testid="button-search-submit" className="h-11 px-5">
            Buscar
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            data-testid="button-toggle-filters"
            className="h-11 w-11"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <SlidersHorizontal size={16} />
          </Button>
        </form>

        <div className="flex gap-6">
          {/* Sidebar filters — desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0 space-y-6">
            <FilterPanel
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              minRating={minRating}
              setMinRating={setMinRating}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              openOnly={openOnly}
              setOpenOnly={setOpenOnly}
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
                  className="lg:hidden bg-card border border-card-border rounded-xl p-5 mb-5 overflow-hidden"
                >
                  <FilterPanel
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    minRating={minRating}
                    setMinRating={setMinRating}
                    typeFilter={typeFilter}
                    setTypeFilter={setTypeFilter}
                    openOnly={openOnly}
                    setOpenOnly={setOpenOnly}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active filter chips */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {activeFilters.map((f) => (
                  <Badge
                    key={f.key}
                    variant="secondary"
                    className="flex items-center gap-1 cursor-pointer pr-1.5"
                    onClick={() => clearFilter(f.key)}
                    data-testid={`badge-filter-${f.key}`}
                  >
                    {f.label}
                    <X size={12} />
                  </Badge>
                ))}
              </div>
            )}

            {/* Result count */}
            <p className="text-sm text-muted-foreground mb-4">
              <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "resultado encontrado" : "resultados encontrados"}
            </p>

            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <Search size={40} className="text-muted mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma loja encontrada com esses filtros.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setQuery("");
                    setSelectedCategory("");
                    setMinRating(0);
                    setTypeFilter("all");
                    setOpenOnly(false);
                  }}
                >
                  Limpar filtros
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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
      </div>
    </PageTransition>
  );
}

interface FilterPanelProps {
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  minRating: number;
  setMinRating: (v: number) => void;
  typeFilter: "all" | "loja" | "servico";
  setTypeFilter: (v: "all" | "loja" | "servico") => void;
  openOnly: boolean;
  setOpenOnly: (v: boolean) => void;
}

function FilterPanel({
  selectedCategory, setSelectedCategory,
  minRating, setMinRating,
  typeFilter, setTypeFilter,
  openOnly, setOpenOnly,
}: FilterPanelProps) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">Categoria</p>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory("")}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${!selectedCategory ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
          >
            Todas
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              data-testid={`filter-category-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id === selectedCategory ? "" : cat.id)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedCategory === cat.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">Avaliação mínima</p>
        <div className="flex flex-wrap gap-1.5">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              data-testid={`filter-rating-${r}`}
              onClick={() => setMinRating(r === minRating ? 0 : r)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${minRating === r && r > 0 ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:border-primary/50"}`}
            >
              {r === 0 ? "Qualquer" : `${r}+`}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">Tipo</p>
        <div className="space-y-1">
          {[
            { value: "all" as const, label: "Todos" },
            { value: "loja" as const, label: "Lojas" },
            { value: "servico" as const, label: "Serviços" },
          ].map((opt) => (
            <button
              key={opt.value}
              data-testid={`filter-type-${opt.value}`}
              onClick={() => setTypeFilter(opt.value)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${typeFilter === opt.value ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            data-testid="filter-open-now"
            type="checkbox"
            checked={openOnly}
            onChange={(e) => setOpenOnly(e.target.checked)}
            className="accent-primary"
          />
          <span className="text-sm text-foreground">Aberto agora</span>
        </label>
      </div>
    </div>
  );
}
