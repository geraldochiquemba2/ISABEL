import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Dumbbell, UserCheck, Trophy, Volleyball, Waves, Swords, Shirt, Music, X } from "lucide-react";
import { fetchStores } from "@/lib/api";
import { getStoreCategories } from "@/lib/storeCategories";
import { ANGOLA_PROVINCES } from "@/data/angolaData";
import { getMunicipalities, storeMatchesScope, scopeRank, type Scope } from "@/lib/locationIndex";
import WhereSearch from "@/components/WhereSearch";

interface Store {
  id: string;
  name: string;
  category: string;
  image?: string;
  coverImage?: string;
  logoUrl?: string;
  description?: string;
  isOpen?: boolean;
  province?: string;
  municipality?: string;
  locality?: string;
  products?: { imageUrl?: string; imageUrls?: string | string[] }[];
}

const DESPORTO_CATEGORIES = [
  { number: "01", title: "Ginásios & Academias", intro: "Musculação; cardio; fitness; aulas colectivas.", category: "ginasios", icon: Dumbbell, items: ["Musculação & Força", "Cardio & Resistência", "Aulas Colectivas & Fitness"] },
  { number: "02", title: "Personal Trainers", intro: "Treino individual; funcional; preparação física; acompanhamento.", category: "personal-trainers", icon: UserCheck, items: ["Treino Individual", "Treino Funcional", "Preparação Física & Acompanhamento"] },
  { number: "03", title: "Clubes & Escolas Desportivas", intro: "Clubes; academias; escolas de formação desportiva.", category: "clubes-escolas", icon: Trophy, items: ["Clubes Desportivos", "Academias de Formação", "Escolas Desportivas"] },
  { number: "04", title: "Futebol & Outras Modalidades", intro: "Futebol; basquetebol; voleibol; ténis; outras modalidades.", category: "futebol-modalidades", icon: Volleyball, items: ["Futebol & Futsal", "Basquetebol & Voleibol", "Ténis & Outras Modalidades"] },
  { number: "05", title: "Natação", intro: "Escolas de natação; aulas individuais; treino.", category: "natacao", icon: Waves, items: ["Escolas de Natação", "Aulas Individuais", "Treino & Competição"] },
  { number: "06", title: "Artes Marciais", intro: "Judo; karaté; taekwondo; boxe; outras modalidades.", category: "artes-marciais", icon: Swords, items: ["Judo & Karaté", "Taekwondo & Boxe", "Outras Modalidades de Combate"] },
  { number: "07", title: "Equipamentos & Artigos Desportivos", intro: "Roupa desportiva; calçado; equipamentos; acessórios.", category: "equipamentos-desportivos", icon: Shirt, items: ["Roupa Desportiva", "Calçado & Equipamentos", "Acessórios & Complementos"] },
  { number: "08", title: "Dança & Actividades Físicas", intro: "Dança; zumba; aeróbica; outras actividades.", category: "danca-actividades", icon: Music, items: ["Dança & Ballet", "Zumba & Aeróbica", "Outras Actividades Físicas"] },
];

function StoreCard({ store, productImages }: { store: any; productImages?: string[] }) {
  const fallbackImage = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop&auto=format&q=75";
  const images = productImages && productImages.length > 0 ? productImages : [store.coverImage || store.image || fallbackImage];
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div
      className="flex-shrink-0 w-48 rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow border border-[#FFCCBC] cursor-pointer hover:-translate-y-1"
      onClick={() => window.location.href = `/loja/${store.id}?from=desporto`}
    >
      <div className="relative h-28 overflow-hidden">
        <img
          src={images[currentIdx] || fallbackImage}
          alt={store.name}
          className="w-full h-full object-cover"
        />
        {store.logoUrl && (
          <img
            src={store.logoUrl}
            alt={`Logo ${store.name}`}
            className="absolute top-2 left-2 w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm z-20"
          />
        )}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 z-20 flex gap-1">
            {images.map((_: string, i: number) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrentIdx(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIdx ? "bg-white w-3" : "bg-white/50"}`}
              />
            ))}
          </div>
        )}
        {store.isOpen !== undefined && (
          <span className={`absolute top-2 right-2 text-[9px] font-semibold px-2 py-0.5 rounded-full z-20 ${store.isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
            {store.isOpen ? "Aberto" : "Fechado"}
          </span>
        )}
      </div>
      <div className="p-3">
        <h4 className="text-sm font-semibold text-[#1A0D00] truncate">{store.name}</h4>
        {store.description && (
          <p className="text-[10px] text-[#6D4C30] mt-1 line-clamp-2">{store.description}</p>
        )}
      </div>
    </div>
  );
}

export default function ExploreDesporto() {
  const [activeFilter, setActiveFilter] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("categoria");
    if (cat) {
      const group = DESPORTO_CATEGORIES.find((g) => g.title.toLowerCase().includes(cat.toLowerCase()) || g.category.toLowerCase() === cat.toLowerCase());
      return group ? group.category : null;
    }
    return null;
  });
  const [activeProvince, setActiveProvince] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("provincia") || null;
  });
  const [activeMunicipality, setActiveMunicipality] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("municipio") || null;
  });
  const [locationScope, setLocationScope] = useState<Scope | null>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const kind = params.get("scope") as Scope["kind"] | null;
      const province = params.get("provincia");
      const municipality = params.get("municipio");
      const locality = params.get("localidade");
      if (kind && province && municipality && (kind === "nearby" || kind === "municipality" || kind === "province")) {
        return { kind, province, municipality, locality: locality || municipality };
      }
      // Fallback: scope guardado pela Home quando a Explore abre sem params de scope
      if (!params.get("provincia") && !params.get("municipio")) {
        const raw = localStorage.getItem("eliora-location-scope");
        if (raw) {
          const s = JSON.parse(raw) as Scope;
          if (s && s.province && s.municipality && (s.kind === "nearby" || s.kind === "municipality" || s.kind === "province")) return s;
        }
      }
    } catch {
      /* ignora scope inválido */
    }
    return null;
  });

  const hasActiveFilters = activeFilter !== null || activeProvince !== null || activeMunicipality !== null || locationScope !== null;

  const clearAllFilters = () => {
    setActiveFilter(null);
    
    setActiveProvince(null);
    setActiveMunicipality(null);
    setLocationScope(null);
    const url = new URL(window.location.href);
    url.search = "";
    try { localStorage.removeItem("eliora-location-scope"); } catch { /* ignora */ }
    window.history.replaceState({}, "", url.toString());
  };

  const { data: stores = [] } = useQuery({
    queryKey: ["stores", "desporto-fitness"],
    queryFn: () => fetchStores({ storeType: "desporto-fitness" }),
    staleTime: 60_000,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products", "desporto-fitness"],
    queryFn: async () => {
      const res = await fetch("/api/products?store_type=desporto-fitness");
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60_000,
  });

  const getProductsForStore = (storeId: string) => {
    return products.filter((p: any) => p.storeId === storeId).flatMap((p: any) =>
      (p.imageUrls && p.imageUrls.length > 0) ? p.imageUrls : (p.imageUrl ? [p.imageUrl] : [])
    );
  };

  const provinces = ANGOLA_PROVINCES.map((p) => p.name);
  const municipalities = activeProvince ? getMunicipalities(activeProvince) : [];

  const getStoresForGroup = (category: string) => {
    const group = DESPORTO_CATEGORIES.find((g) => g.category === category);
    const filtered = stores.filter((s: any) => {
      if (s.phone === "999999999") return false;
      const cats = getStoreCategories(s).map((c) => c.toLowerCase());
      const matchesCategory = cats.some((cat) => ((group && cat.includes(group.title.toLowerCase())) || cat.includes(category.replace(/-/g, " "))));
      const matchesProvince = !activeProvince || s.province === activeProvince;
      const matchesMunicipality = !activeMunicipality || s.municipality === activeMunicipality;
      if (locationScope && !storeMatchesScope(s, locationScope)) return false;
      return matchesCategory && matchesProvince && matchesMunicipality;
    });
    const scope = locationScope;
    if (scope && scope.kind === "nearby") {
      filtered.sort((a: any, b: any) => scopeRank(a, scope) - scopeRank(b, scope));
    }
    return filtered;
  };

  const filteredGroups = activeFilter
    ? DESPORTO_CATEGORIES.filter((g) => g.title.toLowerCase().includes(activeFilter.toLowerCase()) || g.category === activeFilter)
    : DESPORTO_CATEGORIES;

  return (
    <main className="min-h-[100dvh] bg-[#FFF8F0] text-[#1A0D00]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFF8F0]/95 backdrop-blur-md border-b border-[#E65100]/10">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between px-6 py-4 md:px-12">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm text-[#6D4C30] hover:text-[#E65100] transition-colors">
            <ArrowLeft size={16} /> Voltar
          </button>
          <span className="font-['Playfair_Display'] text-[19px] tracking-[-.02em] text-[#E65100]">YESOLA<small className="block font-['DM_Sans'] text-[8px] uppercase tracking-[.23em] text-[#BF360C] mt-0.5">Desporto & Fitness</small></span>
          <a href="/explorar-desporto" className="text-xs font-bold uppercase tracking-[0.14em] text-[#6D4C30] hover:text-[#E65100] transition-colors hidden md:block">Explorar</a>
        </div>
      </header>

      <div className="mx-auto max-w-[1380px] px-6 pt-28 pb-12 md:px-12">

        <div className="mb-16">
          <p className="font-['DM_Sans'] text-[10px] uppercase tracking-[0.25em] text-[#E65100]">Explorar desporto</p>
          <h1 className="mt-4 font-['Playfair_Display'] text-5xl tracking-[-0.03em] md:text-7xl">O nosso<br /><i>desporto.</i></h1>
        </div>

        <div className="flex flex-wrap gap-3 mb-12">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] bg-red-100 text-red-700 hover:bg-red-200 transition-all font-semibold border border-red-200"
            >
              <X size={14} /> Limpar Filtros
            </button>
          )}
          <button onClick={() => setActiveFilter(null)}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
              activeFilter === null ? "bg-[#E65100] text-white" : "bg-[#FFF3E0] text-[#6D4C30] hover:bg-[#FFCCBC]"
            }`}>Todos</button>
          {DESPORTO_CATEGORIES.map((group) => (
            <button key={group.category} onClick={() => setActiveFilter(activeFilter === group.category ? null : group.category)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                activeFilter === group.category ? "bg-[#E65100] text-white" : "bg-[#FFF3E0] text-[#6D4C30] hover:bg-[#FFCCBC]"
              }`}>{group.number} {group.title.split(",")[0].split(" e ")[0]}</button>
          ))}
        </div>

        <div className="mb-6">
          <span className="text-xs uppercase tracking-[0.15em] text-[#6D4C30] mr-2">Onde procuras?</span>
          <div className="mt-2 max-w-md">
            <WhereSearch onScope={setLocationScope} onClear={() => setLocationScope(null)} accent="#E65100" />
          </div>
          {locationScope && (
            <button
              onClick={() => setLocationScope(null)}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#E65100" }}
            >
              <X size={14} /> Perto de {locationScope.locality} ({locationScope.kind})
            </button>
          )}
        </div>

        <div className="mb-6">
          <span className="text-xs uppercase tracking-[0.15em] text-[#6D4C30] mr-2">Província:</span>
          <select
            value={activeProvince || ""}
            onChange={(e) => { setActiveProvince(e.target.value || null); setActiveMunicipality(null); }}
            className="mt-2 md:hidden w-full px-4 py-3 rounded-xl text-sm border border-[#FFCCBC] bg-white text-[#1A0D00] outline-none"
          >
            <option value="">Todas</option>
            {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <div className="hidden md:flex flex-wrap gap-3 mt-2">
            <button
              onClick={() => { setActiveProvince(null); setActiveMunicipality(null); }}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                activeProvince === null ? "bg-[#BF360C] text-white" : "bg-[#FFF3E0] text-[#6D4C30] hover:bg-[#FFCCBC]"
              }`}>Todas</button>
            {provinces.map((province) => (
              <button
                key={province}
                onClick={() => { setActiveProvince(activeProvince === province ? null : province); setActiveMunicipality(null); }}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                  activeProvince === province ? "bg-[#BF360C] text-white" : "bg-[#FFF3E0] text-[#6D4C30] hover:bg-[#FFCCBC]"
                }`}>{province}</button>
            ))}
          </div>
        </div>

        {municipalities.length > 0 && (
          <div className="mb-12">
            <span className="text-xs uppercase tracking-[0.15em] text-[#6D4C30] mr-2">Município:</span>
            <select
              value={activeMunicipality || ""}
              onChange={(e) => setActiveMunicipality(e.target.value || null)}
              className="mt-2 md:hidden w-full px-4 py-3 rounded-xl text-sm border border-[#FFCCBC] bg-white text-[#1A0D00] outline-none"
            >
              <option value="">Todos</option>
              {municipalities.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <div className="hidden md:flex flex-wrap gap-3 mt-2">
              <button
                onClick={() => setActiveMunicipality(null)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                  activeMunicipality === null ? "bg-[#6D4C30] text-white" : "bg-[#FFF3E0] text-[#6D4C30] hover:bg-[#FFCCBC]"
                }`}>Todos</button>
              {municipalities.map((m) => (
                <button
                  key={m}
                  onClick={() => setActiveMunicipality(activeMunicipality === m ? null : m)}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                    activeMunicipality === m ? "bg-[#6D4C30] text-white" : "bg-[#FFF3E0] text-[#6D4C30] hover:bg-[#FFCCBC]"
                  }`}>{m}</button>
              ))}
            </div>
          </div>
        )}

        <div>
          {filteredGroups.map((group, i) => {
            const groupStores = getStoresForGroup(group.category);
            return (
              <article key={group.number} className={`group border-t border-[#E65100]/20 py-8 md:py-12 ${i % 2 ? "md:ml-20" : ""}`}>
                <div className="grid gap-7 md:grid-cols-[100px_minmax(0,1fr)_minmax(260px,370px)] md:items-start">
                  <span className="font-['DM_Sans'] text-xs font-bold tracking-[0.2em] text-[#BF360C]">{group.number}</span>
                  <div>
                    <h3 className="max-w-xl font-['Playfair_Display'] text-3xl leading-[1.08] text-[#E65100] md:text-[2.8rem]">{group.title}</h3>
                    <p className="mt-4 max-w-md text-sm leading-7 text-[#E65100]/60">{group.intro}</p>
                    <ul className="mt-6 space-y-3 border-l border-[#BF360C]/30 pl-5 text-sm leading-5 text-[#E65100]/70">
                      {group.items.map((item) => (
                        <li key={item}>
                          <div className="flex gap-3">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#BF360C]" />
                            <span>{item}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {groupStores.length > 0 && (
                      <button onClick={() => setActiveFilter(activeFilter === group.category ? null : group.category)}
                        className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#6D4C30] hover:text-[#E65100] transition-colors">
                        Ver mais
                      </button>
                    )}
                  </div>
                  <div className="mt-4 md:mt-0">
                    <p className="font-['DM_Sans'] text-[10px] uppercase tracking-[0.2em] text-[#6D4C30] mb-3">Lojas/Serviços disponíveis</p>
                    {groupStores.length > 0 ? (
                      <div className="flex flex-col gap-3">
                        {groupStores.slice(0, 2).map((store: any) => (
                          <StoreCard key={store.id} store={store} productImages={getProductsForStore(store.id)} />
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-[#E65100]/25 p-6 text-center">
                        <p className="text-xs text-[#6D4C30]">Em breve novas lojas</p>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <section className="relative overflow-hidden border-t border-[#BF360C]/20 bg-[#E65100] px-6 py-24 text-[#FFF8F0] md:px-12 md:py-32">
        <div className="relative mx-auto max-w-[1380px] md:flex md:items-end md:justify-between">
          <div>
            <p className="font-['DM_Sans'] text-[10px] uppercase tracking-[0.25em] text-[#FFCCBC]">O primeiro passo</p>
            <h2 className="mt-5 max-w-2xl font-['Playfair_Display'] text-5xl leading-[1.02] md:text-7xl">Precisa de ajuda<br /><i>com algo especial?</i></h2>
          </div>
          <div className="mt-10 md:mt-0 md:w-80">
            <p className="text-sm leading-6 text-[#FFF8F0]/60">Conte-nos o que procura. A nossa equipa responde com tempo, atenção e cuidado.</p>
            <div className="mt-7">
              <a href="https://wa.me/244922001778?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20YESOLA%20Desporto%20%26%20Fitness." target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#BF360C] text-white text-sm font-medium rounded-full hover:bg-[#8B2500] transition-colors">
                Falar connosco
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
