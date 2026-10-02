import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search, X, Church, Landmark } from "lucide-react";
import { fetchPlaces, type Place } from "@/lib/api";
import { ANGOLA_PROVINCES } from "@/data/angolaData";
import { PageTransition } from "@/components/PageTransition";
import { PlaceCard } from "@/pages/LugaresHome";

const KINDS = [
  { id: "", name: "Todos" },
  { id: "igreja", name: "Igrejas" },
  { id: "servico-publico", name: "Serviços Públicos" },
];

export default function ExploreLugares() {
  const [kind, setKind] = useState<string | null>(() => {
    const c = new URLSearchParams(window.location.search).get("categoria");
    if (!c) return null;
    const cl = c.toLowerCase();
    if (cl.includes("igreja")) return "igreja";
    return "servico-publico";
  });
  const [activeCategory, setActiveCategory] = useState<string | null>(() => {
    const c = new URLSearchParams(window.location.search).get("categoria");
    return c && !c.toLowerCase().includes("igreja") ? c : null;
  });
  const [activeProvince, setActiveProvince] = useState<string | null>(() => {
    return new URLSearchParams(window.location.search).get("provincia");
  });
  const [activeMunicipality, setActiveMunicipality] = useState<string | null>(() => {
    return new URLSearchParams(window.location.search).get("municipio");
  });
  const [q, setQ] = useState("");

  const { data: places = [], isLoading } = useQuery({
    queryKey: ["placesExplore", q, kind, activeCategory, activeProvince, activeMunicipality],
    queryFn: () => fetchPlaces({
      q: q.trim() || undefined,
      kind: kind || undefined,
      province: activeProvince || undefined,
      municipality: activeMunicipality || undefined,
    }),
    staleTime: 60_000,
  });

  const catOf = (p: Place) => (p.kind === "igreja" ? "Igrejas" : p.category || "Serviços Públicos");
  const cats = [...new Set(places.map(catOf))];
  const inCat = (p: Place) => !activeCategory || catOf(p) === activeCategory;

  const hasFilters = q.trim() || kind || activeCategory || activeProvince || activeMunicipality;
  const clearAll = () => {
    setQ(""); setKind(""); setActiveCategory(null);
    setActiveProvince(null); setActiveMunicipality(null);
    window.history.replaceState({}, "", "/explorar-lugares");
  };

  return (
    <PageTransition>
      <div className="min-h-[100dvh] bg-[#FFFDF8] text-[#111111] pb-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <header className="sticky top-0 z-50 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#E8CC91]/60">
          <div className="flex items-center gap-3 px-5 py-4">
            <button onClick={() => (window.location.href = "/lugares")} className="p-1" aria-label="Voltar">
              <ArrowLeft size={22} />
            </button>
            <div>
              <h1 className="text-[18px] font-bold leading-tight">Explorar lugares</h1>
              <p className="text-[11px] text-[#6F6F6F]">Igrejas e serviços públicos no mapa.</p>
            </div>
          </div>
        </header>

        <section className="px-5 pt-4 space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A96F12]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Pesquisar..."
              className="w-full bg-white border border-[#E8CC91] rounded-2xl pl-9 pr-8 py-3 text-sm outline-none focus:border-[#C99432]"
            />
            {q && (
              <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F6F6F]" aria-label="Limpar">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {KINDS.map((k) => (
              <button
                key={k.id}
                onClick={() => { setKind(k.id); setActiveCategory(null); }}
                className={`px-4 py-2 rounded-full text-xs font-semibold ${kind === k.id ? "bg-[#111111] text-white" : "bg-white border border-[#E8CC91] text-[#6F6F6F]"}`}
              >
                {k.name}
              </button>
            ))}
          </div>

          {cats.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border ${!activeCategory ? "bg-[#A96F12] text-white border-[#A96F12]" : "bg-white text-[#6F6F6F] border-[#E8CC91]"}`}
              >
                Todas
              </button>
              {cats.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(activeCategory === c ? null : c)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border ${activeCategory === c ? "bg-[#A96F12] text-white border-[#A96F12]" : "bg-white text-[#6F6F6F] border-[#E8CC91]"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <select
              value={activeProvince || ""}
              onChange={(e) => { setActiveProvince(e.target.value || null); setActiveMunicipality(null); }}
              className="bg-white border border-[#E8CC91] rounded-2xl px-3 py-2.5 text-xs outline-none"
            >
              <option value="">Província: todas</option>
              {ANGOLA_PROVINCES.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
            </select>
            <select
              value={activeMunicipality || ""}
              onChange={(e) => setActiveMunicipality(e.target.value || null)}
              disabled={!activeProvince}
              className="bg-white border border-[#E8CC91] rounded-2xl px-3 py-2.5 text-xs outline-none disabled:opacity-50"
            >
              <option value="">Município: todos</option>
              {(ANGOLA_PROVINCES.find((p) => p.name === activeProvince)?.municipalities || []).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <button onClick={clearAll} className="text-xs font-semibold text-[#A96F12]">
              Limpar filtros
            </button>
          )}
        </section>

        <div className="px-5 py-4 space-y-6">
          <p className="text-xs text-[#6F6F6F]">{isLoading ? "A carregar..." : `${places.filter(inCat).length} resultado(s)`}</p>
          {cats.filter((c) => !activeCategory || c === activeCategory).map((c) => {
            const list = places.filter((p: Place) => catOf(p) === c && inCat(p));
            if (list.length === 0) return null;
            return (
              <div key={c}>
                <div className="flex items-center gap-2 mb-3">
                  {c === "Igrejas" ? <Church size={16} className="text-[#A96F12]" /> : <Landmark size={16} className="text-[#A96F12]" />}
                  <h3 className="text-[14px] font-semibold text-[#2D2C2B]">{c}</h3>
                </div>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                  {list.map((p: Place) => (
                    <PlaceCard key={p.id} p={p} />
                  ))}
                </div>
              </div>
            );
          })}
          {!isLoading && places.filter(inCat).length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#EDE8DE] p-8 text-center bg-white">
              <p className="text-sm text-[#6F6F6F]">Nenhum lugar encontrado. Tente outros filtros.</p>
            </div>
          )}
        </div>

        <div className="text-center py-6 px-5">
          <p className="text-[11px] text-[#9CA3AF]">YESOLA LUGARES · PERTO DE SI.</p>
        </div>
      </div>
    </PageTransition>
  );
}
