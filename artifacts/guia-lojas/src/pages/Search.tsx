import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import { StoreCard } from "@/components/StoreCard";
import { PageTransition } from "@/components/PageTransition";
import { ANGOLA_PROVINCES } from "@/data/angolaData";

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
  const [selectedSubcategory, setSelectedSubcategory] = useState(searchParams.get("subcategoria") || "");
  const [selectedBairro, setSelectedBairro] = useState(searchParams.get("bairro") || "");
  const [selectedProvince, setSelectedProvince] = useState(searchParams.get("provincia") || "");
  const [selectedMunicipality, setSelectedMunicipality] = useState(searchParams.get("municipio") || "");
  const [typeFilter, setTypeFilter] = useState<"all" | "loja" | "servico">("all");
  const [openOnly, setOpenOnly] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // Temporary states for the filters drawer/panel
  const [tempCategory, setTempCategory] = useState(selectedCategory);
  const [tempSubcategory, setTempSubcategory] = useState(selectedSubcategory);
  const [tempBairro, setTempBairro] = useState(selectedBairro);
  const [tempProvince, setTempProvince] = useState(selectedProvince);
  const [tempMunicipality, setTempMunicipality] = useState(selectedMunicipality);
  const [tempType, setTempType] = useState(typeFilter);
  const [tempOpenOnly, setTempOpenOnly] = useState(openOnly);

  const { isFavorite, toggleFavorite } = useFavorites();

  const { data: dbCategories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const CATEGORIES = dbCategories.map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    subcategories: cat.subcategories || [],
  }));

  const apiCategory = useMemo(() => {
    return CATEGORIES.find((c: any) => c.id === selectedCategory)?.name || selectedCategory;
  }, [selectedCategory, CATEGORIES]);

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ["stores", query, selectedCategory],
    queryFn: () => fetchStores({ q: query, category: apiCategory }),
  });

  // Extract unique neighborhoods from stores
  const bairros = useMemo(() => {
    const bairrosSet = new Set<string>();
    stores.forEach((store: any) => {
      if (store.address) {
        const parts = store.address.split(',');
        if (parts.length >= 2) {
          bairrosSet.add(parts[1]?.trim() || '');
        }
      }
      if (store.bairro) {
        bairrosSet.add(store.bairro);
      }
    });
    return Array.from(bairrosSet).filter(Boolean).sort();
  }, [stores]);

  // Get subcategories for selected category
  const subcategories = useMemo(() => {
    if (!selectedCategory) return [];
    const cat = CATEGORIES.find((c: any) => c.id === selectedCategory);
    return cat?.subcategories || [];
  }, [selectedCategory, CATEGORIES]);

  // Get municipalities for selected province
  const municipalities = useMemo(() => {
    const provinceName = tempProvince || selectedProvince;
    if (!provinceName) return [];
    const province = ANGOLA_PROVINCES.find((p) => p.name === provinceName);
    return province?.municipalities || [];
  }, [tempProvince, selectedProvince]);

  const filtered = useMemo(() => {
    return stores.filter((store) => {
      const matchOpen = !openOnly || store.isOpen;
      const isService = ["Serviços Residenciais", "Automotivo", "Saúde & Beleza", "Educação"].includes(store.category);
      const matchType =
        typeFilter === "all" ||
        (typeFilter === "servico" && isService) ||
        (typeFilter === "loja" && !isService);
      
      const matchSubcategory = !selectedSubcategory || 
        store.subcategory?.toLowerCase() === selectedSubcategory.toLowerCase() ||
        store.products?.some((p: any) => p.subcategory?.toLowerCase() === selectedSubcategory.toLowerCase());
      
      const matchBairro = !selectedBairro ||
        store.address?.toLowerCase().includes(selectedBairro.toLowerCase()) ||
        store.bairro?.toLowerCase() === selectedBairro.toLowerCase();

      const matchProvince = !selectedProvince ||
        store.province?.toLowerCase() === selectedProvince.toLowerCase();

      const matchMunicipality = !selectedMunicipality ||
        store.municipality?.toLowerCase() === selectedMunicipality.toLowerCase();
      
      return matchOpen && matchType && matchSubcategory && matchBairro && matchProvince && matchMunicipality;
    });
  }, [stores, openOnly, typeFilter, selectedSubcategory, selectedBairro, selectedProvince, selectedMunicipality]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const url = new URLSearchParams();
    if (query) url.set("q", query);
    if (selectedCategory) url.set("categoria", selectedCategory);
    if (selectedSubcategory) url.set("subcategoria", selectedSubcategory);
    if (selectedBairro) url.set("bairro", selectedBairro);
    if (selectedProvince) url.set("provincia", selectedProvince);
    if (selectedMunicipality) url.set("municipio", selectedMunicipality);
    setLocation(`/busca?${url.toString()}`);
  }

  const activeFilters = [
    selectedCategory && { key: "categoria", label: CATEGORIES.find((c) => c.id === selectedCategory)?.name || selectedCategory },
    selectedSubcategory && { key: "subcategoria", label: selectedSubcategory },
    selectedBairro && { key: "bairro", label: selectedBairro },
    selectedProvince && { key: "provincia", label: selectedProvince },
    selectedMunicipality && { key: "municipio", label: selectedMunicipality },
    typeFilter !== "all" && { key: "type", label: typeFilter === "loja" ? "Lojas" : "Serviços" },
    openOnly && { key: "open", label: "Aberto agora" },
  ].filter(Boolean) as { key: string; label: string }[];

  function clearFilter(key: string) {
    if (key === "categoria") {
      setSelectedCategory("");
      setTempCategory("");
      setSelectedSubcategory("");
      setTempSubcategory("");
    }
    if (key === "subcategoria") {
      setSelectedSubcategory("");
      setTempSubcategory("");
    }
    if (key === "bairro") {
      setSelectedBairro("");
      setTempBairro("");
    }
    if (key === "provincia") {
      setSelectedProvince("");
      setTempProvince("");
      setSelectedMunicipality("");
      setTempMunicipality("");
    }
    if (key === "municipio") {
      setSelectedMunicipality("");
      setTempMunicipality("");
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
    setSelectedSubcategory(tempSubcategory);
    setSelectedBairro(tempBairro);
    setSelectedProvince(tempProvince);
    setSelectedMunicipality(tempMunicipality);
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
                setSelectedSubcategory("");
                setTempSubcategory("");
                setSelectedBairro("");
                setTempBairro("");
                setSelectedProvince("");
                setTempProvince("");
                setSelectedMunicipality("");
                setTempMunicipality("");
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
            selectedSubcategory={tempSubcategory} setSelectedSubcategory={setTempSubcategory}
            selectedBairro={tempBairro} setSelectedBairro={setTempBairro}
            selectedProvince={tempProvince} setSelectedProvince={setTempProvince}
            selectedMunicipality={tempMunicipality} setSelectedMunicipality={setTempMunicipality}
            typeFilter={tempType} setTypeFilter={setTempType}
            openOnly={tempOpenOnly} setOpenOnly={setTempOpenOnly}
            categories={CATEGORIES}
            subcategories={subcategories}
            bairros={bairros}
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
                  selectedSubcategory={tempSubcategory} setSelectedSubcategory={setTempSubcategory}
                  selectedBairro={tempBairro} setSelectedBairro={setTempBairro}
                  selectedProvince={tempProvince} setSelectedProvince={setTempProvince}
                  selectedMunicipality={tempMunicipality} setSelectedMunicipality={setTempMunicipality}
                  typeFilter={tempType} setTypeFilter={setTempType}
                  openOnly={tempOpenOnly} setOpenOnly={setTempOpenOnly}
                  categories={CATEGORIES}
                  subcategories={subcategories}
                  bairros={bairros}
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
                  setSelectedSubcategory("");
                  setTempSubcategory("");
                  setSelectedBairro("");
                  setTempBairro("");
                  setSelectedProvince("");
                  setTempProvince("");
                  setSelectedMunicipality("");
                  setTempMunicipality("");
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
  selectedSubcategory: string; setSelectedSubcategory: (v: string) => void;
  selectedBairro: string; setSelectedBairro: (v: string) => void;
  selectedProvince: string; setSelectedProvince: (v: string) => void;
  selectedMunicipality: string; setSelectedMunicipality: (v: string) => void;
  typeFilter: "all" | "loja" | "servico"; setTypeFilter: (v: "all" | "loja" | "servico") => void;
  openOnly: boolean; setOpenOnly: (v: boolean) => void;
  categories: any[];
  subcategories: any[];
  bairros: string[];
  onApply?: () => void;
}

function FilterPanel({ 
  selectedCategory, setSelectedCategory,
  selectedSubcategory, setSelectedSubcategory,
  selectedBairro, setSelectedBairro,
  selectedProvince, setSelectedProvince,
  selectedMunicipality, setSelectedMunicipality,
  typeFilter, setTypeFilter,
  openOnly, setOpenOnly,
  categories, subcategories, bairros,
  onApply 
}: FilterPanelProps) {
  const municipalities = useMemo(() => {
    if (!selectedProvince) return [];
    const province = ANGOLA_PROVINCES.find((p) => p.name === selectedProvince);
    return province?.municipalities || [];
  }, [selectedProvince]);
  return (
    <div className="space-y-5 text-sm">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Categoria</p>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => {
              setSelectedCategory("");
              setSelectedSubcategory("");
            }}
            className={`px-2.5 py-1 rounded-full text-xs transition-colors border ${
              !selectedCategory
                ? "bg-foreground text-background border-black"
                : "border-border text-muted-foreground hover:border-black hover:text-foreground"
            }`}
          >
            Todas
          </button>
          {categories.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id === selectedCategory ? "" : cat.id);
                setSelectedSubcategory("");
              }}
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

      {/* Subcategorias */}
      {selectedCategory && subcategories.length > 0 && (
        <div className="border-t border-border pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Subcategorias</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedSubcategory("")}
              className={`px-2.5 py-1 rounded-full text-xs transition-colors border ${
                !selectedSubcategory
                  ? "bg-foreground text-background border-black"
                  : "border-border text-muted-foreground hover:border-black hover:text-foreground"
              }`}
            >
              Todas
            </button>
            {subcategories.map((sub: any, idx: number) => {
              const subName = typeof sub === 'string' ? sub : sub.name;
              const subId = typeof sub === 'string' ? sub.toLowerCase().replace(/\s+/g, '-') : sub.id || `sub-${idx}`;
              return (
                <button
                  key={subId}
                  onClick={() => setSelectedSubcategory(subName === selectedSubcategory ? "" : subName)}
                  data-testid={`filter-subcategory-${subId}`}
                  className={`px-2.5 py-1 rounded-full text-xs transition-colors border ${
                    selectedSubcategory === subName
                      ? "bg-foreground text-background border-black"
                      : "border-border text-muted-foreground hover:border-black hover:text-foreground"
                  }`}
                >
                  {subName}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Bairro/Zona */}
      {bairros.length > 0 && (
        <div className="border-t border-border pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Bairro/Zona</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedBairro("")}
              className={`px-2.5 py-1 rounded-full text-xs transition-colors border ${
                !selectedBairro
                  ? "bg-foreground text-background border-black"
                  : "border-border text-muted-foreground hover:border-black hover:text-foreground"
              }`}
            >
              Todos
            </button>
            {bairros.map((bairro) => (
              <button
                key={bairro}
                onClick={() => setSelectedBairro(bairro === selectedBairro ? "" : bairro)}
                className={`px-2.5 py-1 rounded-full text-xs transition-colors border ${
                  selectedBairro === bairro
                    ? "bg-foreground text-background border-black"
                    : "border-border text-muted-foreground hover:border-black hover:text-foreground"
                }`}
              >
                {bairro}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Província */}
      <div className="border-t border-border pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Província</p>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => {
              setSelectedProvince("");
              setSelectedMunicipality("");
            }}
            className={`px-2.5 py-1 rounded-full text-xs transition-colors border ${
              !selectedProvince
                ? "bg-foreground text-background border-black"
                : "border-border text-muted-foreground hover:border-black hover:text-foreground"
            }`}
          >
            Todas
          </button>
          {ANGOLA_PROVINCES.map((prov) => (
            <button
              key={prov.name}
              onClick={() => {
                setSelectedProvince(prov.name === selectedProvince ? "" : prov.name);
                setSelectedMunicipality("");
              }}
              className={`px-2.5 py-1 rounded-full text-xs transition-colors border ${
                selectedProvince === prov.name
                  ? "bg-foreground text-background border-black"
                  : "border-border text-muted-foreground hover:border-black hover:text-foreground"
              }`}
            >
              {prov.name}
            </button>
          ))}
        </div>
      </div>

      {/* Município */}
      {selectedProvince && municipalities.length > 0 && (
        <div className="border-t border-border pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Município</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedMunicipality("")}
              className={`px-2.5 py-1 rounded-full text-xs transition-colors border ${
                !selectedMunicipality
                  ? "bg-foreground text-background border-black"
                  : "border-border text-muted-foreground hover:border-black hover:text-foreground"
              }`}
            >
              Todos
            </button>
            {municipalities.map((municipio) => (
              <button
                key={municipio}
                onClick={() => setSelectedMunicipality(municipio === selectedMunicipality ? "" : municipio)}
                className={`px-2.5 py-1 rounded-full text-xs transition-colors border ${
                  selectedMunicipality === municipio
                    ? "bg-foreground text-background border-black"
                    : "border-border text-muted-foreground hover:border-black hover:text-foreground"
                }`}
              >
                {municipio}
              </button>
            ))}
          </div>
        </div>
      )}

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
              setSelectedSubcategory("");
              setSelectedBairro("");
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
