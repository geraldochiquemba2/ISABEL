import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Search, Menu, X, HeartHandshake, Heart, Camera, Sparkles,
  MapPin, ArrowLeft,
} from "lucide-react";
import { fetchStores } from "@/lib/api";
import { thumbList, thumbUrl } from "@/lib/img";
import { useVerticalGroups } from "@/lib/useVerticalGroups";
import { getStoreCategories, sortStoresForCards } from "@/lib/storeCategories";
import { ANGOLA_PROVINCES } from "@/data/angolaData";
import { getMunicipalities, storeMatchesScope, scopeRank, type Scope } from "@/lib/locationIndex";
import WhereSearch from "@/components/WhereSearch";

const WEDDING_SERVICE_GROUPS_META = [
  { number: "01", title: "Planeamento & Organização de Casamentos", intro: "Do primeiro sim ao último brinde, guardamos o fio invisível de tudo.", category: "planeamento", icon: HeartHandshake, items: ["Wedding Planner & Assessoria", "Assistente Pessoal dos Noivos", "Mestre de Cerimónias", "Hostesses e Acolhimento VIP"] },
  { number: "02", title: "Pedidos de Casamento, Noivados & Momentos Românticos", intro: "Gestos íntimos, pensados para a vossa história.", category: "noivados", icon: Heart, items: ["Pedidos de Casamento", "Aniversários de Namoro/Casamento", "Jantares Íntimos", "Serenatas e Músicos"] },
  { number: "03", title: "Fotografia, Vídeo & Produção Audiovisual", intro: "A memória viva de cada detalhe.", category: "fotografia", icon: Camera, items: ["Fotógrafo de Casamento", "Videógrafo & Cinematografia", "Drone & Cobertura Aérea", "Álbuns & Livros de Fotos"] },
  { number: "04", title: "Beleza & Estilismo para Noivas e Noivos", intro: "A vossa melhor versão, sentida e vista.", category: "beleza", icon: Sparkles, items: ["Maquilhagem Profissional", "Penteado & Hair Styling", "Estilismo & Consultoria de Imagem", "Grooming & Barba para Noivos"] },
  { number: "05", title: "Decoração, Flores & Experiências", intro: "O cenário e o ritmo que dão alma à celebração.", category: "decoracao", icon: HeartHandshake, items: ["Espaços para Eventos", "Design Floral & Decoração", "Catering & Bolos de Noiva", "DJs, Bandas e Entretenimento"] },
];

function StoreCard({ store, productImages }: { store: any; productImages?: string[] }) {
  const fallbackImage = "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop&auto=format&q=75";
  const images = thumbList(productImages && productImages.length > 0 ? productImages : (store.coverImages && store.coverImages.length > 0 ? store.coverImages : [store.coverImage || fallbackImage]));
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
      className="flex-shrink-0 w-48 rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow border border-[#E9D9B6] cursor-pointer hover:-translate-y-1"
      onClick={() => window.location.href = `/loja/${store.id}?from=weddings`}
    >
      <div className="relative h-28 overflow-hidden">
        <img           src={images[currentIdx] || fallbackImage}
          alt={store.name}
          onError={(e) => { if (e.currentTarget.src !== fallbackImage) e.currentTarget.src = fallbackImage; }} className="w-full h-full object-cover object-top" loading="lazy" decoding="async" />
        {store.logoUrl && (
          <img src={thumbUrl(store.logoUrl)} alt="" className="absolute top-2 left-2 w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm z-20" loading="lazy" decoding="async" />
        )}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 z-20 flex gap-1">
            {images.map((_: string, i: number) => (
              <button key={i} onClick={(e) => { e.stopPropagation(); setCurrentIdx(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIdx ? "bg-white w-3" : "bg-white/50"}`} />
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
        <h4 className="text-sm font-semibold text-[#171717] truncate">{store.name}</h4>
        {store.description && <p className="text-[10px] text-[#77736D] mt-1 line-clamp-2">{store.description}</p>}
      </div>
    </div>
  );
}

export default function ExploreWeddings() {
  const WEDDING_SERVICE_GROUPS = useVerticalGroups(WEDDING_SERVICE_GROUPS_META, "weddings");
  const [activeFilter, setActiveFilter] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("categoria") || params.get("servico");
    if (cat) {
      const group = WEDDING_SERVICE_GROUPS.find((g) => g.title.toLowerCase().includes(cat.toLowerCase()) || g.category?.toLowerCase() === cat.toLowerCase());
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
    queryKey: ["stores", "weddings"],
    queryFn: () => fetchStores({ storeType: "weddings" }),
    staleTime: 60_000,
  });


  const provinces = ANGOLA_PROVINCES.map((p) => p.name);
  const municipalities = activeProvince ? getMunicipalities(activeProvince) : [];

  const normalizeCategory = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[&]/g, " ").replace(/\s+/g, " ").trim();

  const getStoresForGroup = (category: string) => {
    const group = WEDDING_SERVICE_GROUPS.find((g) => g.category === category);
    const normCategory = normalizeCategory(category);
    const normTitle = group ? normalizeCategory(group.title) : "";
    const matched = stores.filter((s: any) => {
      if (s.phone === "999999999") return false;
      const cats = getStoreCategories(s).map((c) => normalizeCategory(c));
      const matchesCategory = cats.some((cat) => (cat.includes(normCategory) || cat.includes(normTitle) || normCategory.split(" ").every((w) => w.length > 2 && cat.includes(w))));
      const matchesProvince = !activeProvince || s.province === activeProvince;
      const matchesMunicipality = !activeMunicipality || s.municipality === activeMunicipality;
      if (locationScope && !storeMatchesScope(s, locationScope)) return false;
      return matchesCategory && matchesProvince && matchesMunicipality;
    });
    const __mapped = matched.map((store: any) => {
      const productImages: string[] = [];
      (store.products || []).forEach((p: any) => {
        const urls = typeof p.imageUrls === "string"
          ? p.imageUrls.split(" ").filter(Boolean)
          : Array.isArray(p.imageUrls) ? p.imageUrls : [];
        if (urls.length > 0) productImages.push(...urls);
        else if (p.imageUrl) productImages.push(p.imageUrl);
      });
      return { store, productImages };
    });
    const scope = locationScope;
    if (scope && scope.kind === "nearby") {
      __mapped.sort((a: any, b: any) => scopeRank(a.store, scope) - scopeRank(b.store, scope));
      return __mapped;
    }
    // Ordenação dos cards: lojas com +1 foto primeiro, recentes primeiro.
    const rankedIds = new Map(
      sortStoresForCards(__mapped.map((m: any) => m.store)).map((s: any, i: number) => [s.id, i] as const)
    );
    __mapped.sort((a: any, b: any) => (rankedIds.get(a.store.id) ?? 0) - (rankedIds.get(b.store.id) ?? 0));
    return __mapped;
  };

  const filteredGroups = activeFilter
    ? WEDDING_SERVICE_GROUPS.filter((g) => g.category === activeFilter)
    : [...WEDDING_SERVICE_GROUPS].sort((a, b) => getStoresForGroup(b.category).length - getStoresForGroup(a.category).length);

  return (
    <main className="min-h-[100dvh] bg-[#FBF7EC] text-[#171717]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FBF7EC]/95 backdrop-blur-md border-b border-[#E9D9B6]/60">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between px-6 py-4 md:px-12">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm text-[#77736D] hover:text-[#171717] transition-colors">
            <ArrowLeft size={16} /> Voltar
          </button>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", letterSpacing: "-.02em", color: "#7A6410" }}>YESOLA<small style={{ display: "block", color: "#D8B532", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: ".23em", fontSize: "8px", marginTop: "2px" }}>Casamentos</small></span>
          <a href="/explorar-weddings" className="text-xs font-bold uppercase tracking-[0.14em] text-[#77736D] hover:text-[#D8B532] transition-colors hidden md:block">Explorar</a>
        </div>
      </header>

      <div className="mx-auto max-w-[1380px] px-6 pt-28 pb-12 md:px-12">

        <div className="mb-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#77736D]">Explorar serviços</p>
          <h1 className="mt-4 font-serif text-5xl tracking-[-0.03em] md:text-7xl">O nosso<br /><i>universo.</i></h1>
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
              activeFilter === null ? "bg-[#171717] text-white" : "bg-[#E9D9B6] text-[#77736D] hover:bg-[#E9D9B6]"
            }`}>Todos</button>
          {WEDDING_SERVICE_GROUPS.map((group) => (
            <button key={group.category} onClick={() => setActiveFilter(activeFilter === group.category ? null : group.category)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                activeFilter === group.category ? "bg-[#171717] text-white" : "bg-[#E9D9B6] text-[#77736D] hover:bg-[#E9D9B6]"
              }`}>{group.number} {group.title.split(",")[0].split(" e ")[0]}</button>
          ))}
        </div>

        {/* Filtro por província */}
        <div className="mb-6">
          <span className="text-xs uppercase tracking-[0.15em] text-[#77736D] mr-2">Onde procuras?</span>
          <div className="mt-2 max-w-md">
            <WhereSearch onScope={setLocationScope} onClear={() => setLocationScope(null)} accent="#171717" />
          </div>
          {locationScope && (
            <button
              onClick={() => setLocationScope(null)}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#171717" }}
            >
              <X size={14} /> Perto de {locationScope.locality} ({locationScope.kind})
            </button>
          )}
        </div>

        <div className="mb-6">
          <span className="text-xs uppercase tracking-[0.15em] text-[#77736D] mr-2">Província:</span>
          <select
            value={activeProvince || ""}
            onChange={(e) => { setActiveProvince(e.target.value || null); setActiveMunicipality(null); }}
            className="mt-2 md:hidden w-full px-4 py-3 rounded-xl text-sm border border-[#E9D9B6] bg-white text-[#171717] outline-none"
          >
            <option value="">Todas</option>
            {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <div className="hidden md:flex flex-wrap gap-3 mt-2">
            <button onClick={() => { setActiveProvince(null); setActiveMunicipality(null); }}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                activeProvince === null ? "bg-[#77736D] text-white" : "bg-[#E9D9B6] text-[#77736D] hover:bg-[#E9D9B6]"
              }`}>Todas</button>
            {provinces.map((province) => (
              <button key={province} onClick={() => { setActiveProvince(activeProvince === province ? null : province); setActiveMunicipality(null); }}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                  activeProvince === province ? "bg-[#77736D] text-white" : "bg-[#E9D9B6] text-[#77736D] hover:bg-[#E9D9B6]"
                }`}>{province}</button>
            ))}
          </div>
        </div>

        {/* Filtro por município */}
        {municipalities.length > 0 && (
          <div className="mb-12">
            <span className="text-xs uppercase tracking-[0.15em] text-[#77736D] mr-2">Município:</span>
            <select value={activeMunicipality || ""} onChange={(e) => setActiveMunicipality(e.target.value || null)}
              className="mt-2 md:hidden w-full px-4 py-3 rounded-xl text-sm border border-[#E9D9B6] bg-white text-[#171717] outline-none">
              <option value="">Todos</option>
              {municipalities.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <div className="hidden md:flex flex-wrap gap-3 mt-2">
              <button onClick={() => setActiveMunicipality(null)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                  activeMunicipality === null ? "bg-[#77736D] text-white" : "bg-[#E9D9B6] text-[#77736D] hover:bg-[#E9D9B6]"
                }`}>Todos</button>
              {municipalities.map((m) => (
                <button key={m} onClick={() => setActiveMunicipality(activeMunicipality === m ? null : m)}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                    activeMunicipality === m ? "bg-[#77736D] text-white" : "bg-[#E9D9B6] text-[#77736D] hover:bg-[#E9D9B6]"
                  }`}>{m}</button>
              ))}
            </div>
          </div>
        )}

        <div>
          {filteredGroups.map((group, i) => {
            const groupStores = getStoresForGroup(group.category);
            const allProducts: any[] = [];
            groupStores.forEach(({ store, productImages }: any) => {
              (store.products || []).forEach((p: any) => {
                allProducts.push({ ...p, storeName: store.name, storeId: store.id, productImages });
              });
            });
            return (
              <article key={group.number} className={`group border-t border-[#E9D9B6] py-8 md:py-12 ${i % 2 ? "md:ml-20" : ""}`}>
                <div className="grid gap-7 md:grid-cols-[100px_minmax(0,1fr)_minmax(260px,370px)] md:items-start">
                  <span className="font-mono text-xs tracking-[0.2em] text-[#77736D]">{group.number}</span>
                  <div className="min-w-0">
                    <h3 className="max-w-xl font-serif text-3xl leading-[1.08] text-[#171717] md:text-[2.8rem]">{group.title}</h3>
                    <p className="mt-4 max-w-md text-sm leading-7 text-[#77736D]">{group.intro}</p>
                    <ul className="mt-6 space-y-3 border-l border-[#E9D9B6] pl-5 text-sm leading-5 text-[#77736D]">
                      {group.items.map((item) => {
                        const itemProducts = allProducts.filter((p) => (p.subcategory || "").toLowerCase().includes(item.toLowerCase()));
                        return (
                          <li key={item}>
                            <div className="flex gap-3">
                              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#E9D9B6]" />
                              <div className="flex-1">
                                <span>{item}</span>
                                {itemProducts.length > 0 && (
                                  <div className="mt-1.5 ml-0 space-y-1">
                                    {itemProducts.map((p) => (
                                      <a key={p.id} href={`/loja/${p.storeId}?from=weddings`}
                                        className="flex items-center gap-2 text-[11px] text-[#77736D] hover:text-[#171717] transition-colors">
                                        <span className="h-0.5 w-0.5 rounded-full bg-[#D8B532] flex-shrink-0" />
                                        {p.name} {p.price ? <span className="text-[#E9D9B6]">· {p.currency === "USD" ? "$" : "Kz"} {p.price.toLocaleString("pt-AO")}</span> : null}
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    {groupStores.length > 0 && (
                      <button onClick={() => setActiveFilter(activeFilter === group.category ? null : group.category)}
                        className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#77736D] hover:text-[#171717] transition-colors">
                        Ver mais
                      </button>
                    )}
                  </div>
                  <div className="min-w-0 mt-4 md:mt-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#77736D] mb-3">Lojas/Serviços disponíveis</p>
                    {groupStores.length > 2 && activeFilter !== group.category && (<span className="swipe-hint mb-2">Desliza para ver mais →</span>)}
                    {groupStores.length > 0 ? (
                      <div className={activeFilter === group.category ? "store-grid" : "flex gap-3 overflow-x-auto scrollbar-hide pb-2"}>
                        {groupStores.map(({ store, productImages }: any) => (
                          <StoreCard key={store.id} store={store} productImages={productImages} />
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-[#E9D9B6] p-6 text-center">
                        <p className="text-xs text-[#77736D]">Em breve novas lojas</p>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <section className="relative overflow-hidden border-t border-[#E9D9B6] bg-[#171717] px-6 py-24 text-[#FBF7EC] md:px-12 md:py-32">
        <div className="relative mx-auto max-w-[1380px] md:flex md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#E9D9B6]">O primeiro passo</p>
            <h2 className="mt-5 max-w-2xl font-serif text-5xl leading-[1.02] md:text-7xl">O seu dia<br /><i>perfeito?</i></h2>
          </div>
          <div className="mt-10 md:mt-0 md:w-80">
            <p className="text-sm leading-6 text-[#E9D9B6]">Conte-nos o vosso sonho. A nossa equipa responde com tempo, atenção e cuidado.</p>
            <div className="mt-7">
              <a href="https://wa.me/244922001778?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20YESOLA%20Casamentos." target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#D8B532] text-white text-sm font-medium rounded-full hover:bg-[#D8B532] transition-colors">
                Falar connosco
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
