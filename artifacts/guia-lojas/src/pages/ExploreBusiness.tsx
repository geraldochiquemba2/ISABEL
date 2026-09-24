import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Compass, CircleDollarSign, Target, Scale, UsersRound, Landmark, X } from "lucide-react";
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

const BUSINESS_CATEGORIES = [
  { number: "01", title: "Consultoria, Estratégia e Gestão Empresarial", intro: "Decisões mais claras para negócios prontos para avançar.", category: "consultoria", icon: Compass, items: ["Consultoria de Negócios e Gestão Estratégica", "Elaboração de Planos de Negócio e Viabilidade Económica", "Mapeamento, Reestruturação e Otimização de Processos", "Mentoria para Empreendedores, Startups e Founders"] },
  { number: "02", title: "Gestão Financeira, Contabilidade e Fiscalidade", intro: "O rigor financeiro que transforma números em confiança.", category: "financas", icon: CircleDollarSign, items: ["Contabilidade Certificada, Auditoria e Declarações", "Consultoria Fiscal, Planeamento Tributário e Impostos", "Gestão do Fluxo de Caixa e Finanças Empresariais", "Avaliação de Empresas (Valuation) e Análise de Risco"] },
  { number: "03", title: "Marketing, Vendas e Posicionamento de Marca", intro: "Uma presença que diz o que vale, para quem importa.", category: "marketing", icon: Target, items: ["Gestão de Redes Sociais, Conteúdo e Tráfego Pago", "Criação de Identidade Visual, Branding e Design", "Estratégias de Vendas, Prospecção e Treino Comercial", "Assessoria de Imprensa, Relações Públicas e Comunicação"] },
  { number: "04", title: "Soluções Legais, Jurídicas e Propriedade Intelectual", intro: "Estruturas sólidas para crescer com segurança.", category: "juridico", icon: Scale, items: ["Apoio Jurídico para Abertura e Registo de Empresas", "Elaboração, Análise e Auditoria de Contratos", "Registo de Marcas, Patentes e Propriedade Intelectual", "Consultoria em Conformidade (Compliance) e Regulamentação"] },
  { number: "05", title: "Recursos Humanos, Talentos e Operações", intro: "Pessoas alinhadas e operações que sustentam o ritmo.", category: "rh", icon: UsersRound, items: ["Recrutamento, Seleção e Acolhimento de Talentos (Onboarding)", "Consultoria de RH, Avaliação e Gestão de Desempenho", "Serviços de Tradução Profissional e Interpretação", "Gestão de Operações e Cadeia de Mantimentos (Logística)"] },
  { number: "06", title: "Finanças Pessoais, Investimentos e Captação", intro: "Planeamento para proteger o que construiu e abrir possibilidades.", category: "investimento", icon: Landmark, items: ["Planeamento Financeiro Pessoal e Familiar", "Consultoria em Investimentos e Gestão de Património", "Preparação para Captação de Investimento, Crédito e Parcerias"] },
];

function StoreCard({ store, productImages }: { store: any; productImages?: string[] }) {
  const fallbackImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format&q=75";
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
      className="flex-shrink-0 w-48 rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow border border-[#E8F2EE] cursor-pointer hover:-translate-y-1"
      onClick={() => window.location.href = `/loja/${store.id}?from=business`}
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
        <h4 className="text-sm font-semibold text-[#171717] truncate">{store.name}</h4>
        {store.description && (
          <p className="text-[10px] text-[#6F7780] mt-1 line-clamp-2">{store.description}</p>
        )}
      </div>
    </div>
  );
}

export default function ExploreBusiness() {
  const [activeFilter, setActiveFilter] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("categoria");
    if (cat) {
      const group = BUSINESS_CATEGORIES.find((g) => g.title.toLowerCase().includes(cat.toLowerCase()) || g.category.toLowerCase() === cat.toLowerCase());
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
    queryKey: ["stores", "business"],
    queryFn: () => fetchStores({ storeType: "business" }),
    staleTime: 60_000,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products", "business"],
    queryFn: async () => {
      const res = await fetch("/api/products?store_type=business");
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
    const group = BUSINESS_CATEGORIES.find((g) => g.category === category);
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
    ? BUSINESS_CATEGORIES.filter((g) => g.title.toLowerCase().includes(activeFilter.toLowerCase()) || g.category === activeFilter)
    : BUSINESS_CATEGORIES;

  return (
    <main className="min-h-[100dvh] bg-[#E8F2EE] text-[#075342]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#E8F2EE]/95 backdrop-blur-md border-b border-[#C69A3A]/10">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between px-6 py-4 md:px-12">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm text-[#6F7780] hover:text-[#075342] transition-colors">
            <ArrowLeft size={16} /> Voltar
          </button>
          <span className="font-['Playfair_Display'] text-[19px] tracking-[-.02em] text-[#075342]">YESOLA<small className="block font-['DM_Sans'] text-[8px] uppercase tracking-[.23em] text-[#C69A3A] mt-0.5">Negócios & Finanças</small></span>
          <a href="/explorar-business" className="text-xs font-bold uppercase tracking-[0.14em] text-[#6F7780] hover:text-[#C69A3A] transition-colors hidden md:block">Explorar</a>
        </div>
      </header>

      <div className="mx-auto max-w-[1380px] px-6 pt-28 pb-12 md:px-12">

        <div className="mb-16">
          <p className="font-['DM_Sans'] text-[10px] uppercase tracking-[0.25em] text-[#C69A3A]">Explorar serviços</p>
          <h1 className="mt-4 font-['Playfair_Display'] text-5xl tracking-[-0.03em] md:text-7xl">O nosso<br /><i>universo.</i></h1>
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
              activeFilter === null ? "bg-[#075342] text-white" : "bg-[#E8F2EE] text-[#6F7780] hover:bg-[#E8F2EE]"
            }`}>Todos</button>
          {BUSINESS_CATEGORIES.map((group) => (
            <button key={group.category} onClick={() => setActiveFilter(activeFilter === group.category ? null : group.category)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                activeFilter === group.category ? "bg-[#075342] text-white" : "bg-[#E8F2EE] text-[#6F7780] hover:bg-[#E8F2EE]"
              }`}>{group.number} {group.title.split(",")[0].split(" e ")[0]}</button>
          ))}
        </div>

        <div className="mb-6">
          <span className="text-xs uppercase tracking-[0.15em] text-[#6F7780] mr-2">Onde procuras?</span>
          <div className="mt-2 max-w-md">
            <WhereSearch onScope={setLocationScope} onClear={() => setLocationScope(null)} accent="#075342" />
          </div>
          {locationScope && (
            <button
              onClick={() => setLocationScope(null)}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#075342" }}
            >
              <X size={14} /> Perto de {locationScope.locality} ({locationScope.kind})
            </button>
          )}
        </div>

        <div className="mb-6">
          <span className="text-xs uppercase tracking-[0.15em] text-[#6F7780] mr-2">Província:</span>
          <select
            value={activeProvince || ""}
            onChange={(e) => { setActiveProvince(e.target.value || null); setActiveMunicipality(null); }}
            className="mt-2 md:hidden w-full px-4 py-3 rounded-xl text-sm border border-[#E8F2EE] bg-white text-[#171717] outline-none"
          >
            <option value="">Todas</option>
            {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <div className="hidden md:flex flex-wrap gap-3 mt-2">
            <button
              onClick={() => { setActiveProvince(null); setActiveMunicipality(null); }}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                activeProvince === null
                  ? "bg-[#6F7780] text-white"
                  : "bg-[#E8F2EE] text-[#6F7780] hover:bg-[#E8F2EE]"
              }`}
            >
              Todas
            </button>
            {provinces.map((province) => (
              <button
                key={province}
                onClick={() => { setActiveProvince(activeProvince === province ? null : province); setActiveMunicipality(null); }}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                  activeProvince === province
                    ? "bg-[#6F7780] text-white"
                    : "bg-[#E8F2EE] text-[#6F7780] hover:bg-[#E8F2EE]"
                }`}
              >
                {province}
              </button>
            ))}
          </div>
        </div>

        {municipalities.length > 0 && (
          <div className="mb-12">
            <span className="text-xs uppercase tracking-[0.15em] text-[#6F7780] mr-2">Município:</span>
            <select
              value={activeMunicipality || ""}
              onChange={(e) => setActiveMunicipality(e.target.value || null)}
              className="mt-2 md:hidden w-full px-4 py-3 rounded-xl text-sm border border-[#E8F2EE] bg-white text-[#171717] outline-none"
            >
              <option value="">Todos</option>
              {municipalities.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <div className="hidden md:flex flex-wrap gap-3 mt-2">
              <button
                onClick={() => setActiveMunicipality(null)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                  activeMunicipality === null
                    ? "bg-[#6F7780] text-white"
                    : "bg-[#E8F2EE] text-[#6F7780] hover:bg-[#E8F2EE]"
                }`}
              >
                Todos
              </button>
              {municipalities.map((m) => (
                <button
                  key={m}
                  onClick={() => setActiveMunicipality(activeMunicipality === m ? null : m)}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                    activeMunicipality === m
                      ? "bg-[#6F7780] text-white"
                      : "bg-[#E8F2EE] text-[#6F7780] hover:bg-[#E8F2EE]"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          {filteredGroups.map((group, i) => {
            const groupStores = getStoresForGroup(group.category);
            return (
              <article key={group.number} className={`group border-t border-[#C69A3A]/20 py-8 md:py-12 ${i % 2 ? "md:ml-20" : ""}`}>
                <div className="grid gap-7 md:grid-cols-[100px_minmax(0,1fr)_minmax(260px,370px)] md:items-start">
                  <span className="font-['DM_Sans'] text-xs font-bold tracking-[0.2em] text-[#C69A3A]">{group.number}</span>
                  <div>
                    <h3 className="max-w-xl font-['Playfair_Display'] text-3xl leading-[1.08] text-[#075342] md:text-[2.8rem]">{group.title}</h3>
                    <p className="mt-4 max-w-md text-sm leading-7 text-[#075342]/60">{group.intro}</p>
                    <ul className="mt-6 space-y-3 border-l border-[#C69A3A]/30 pl-5 text-sm leading-5 text-[#075342]/70">
                      {group.items.map((item) => (
                        <li key={item}>
                          <div className="flex gap-3">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#C69A3A]" />
                            <span>{item}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {groupStores.length > 0 && (
                      <button onClick={() => setActiveFilter(activeFilter === group.category ? null : group.category)}
                        className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#6F7780] hover:text-[#075342] transition-colors">
                        Ver mais
                      </button>
                    )}
                  </div>
                  <div className="mt-4 md:mt-0">
                    <p className="font-['DM_Sans'] text-[10px] uppercase tracking-[0.2em] text-[#6F7780] mb-3">Lojas/Serviços disponíveis</p>
                    {groupStores.length > 0 ? (
                      <div className="flex flex-col gap-3">
                        {groupStores.slice(0, 2).map((store: any) => (
                          <StoreCard key={store.id} store={store} productImages={getProductsForStore(store.id)} />
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-[#C69A3A]/25 p-6 text-center">
                        <p className="text-xs text-[#6F7780]">Em breve novas lojas</p>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <section className="relative overflow-hidden border-t border-[#C69A3A]/20 bg-[#075342] px-6 py-24 text-[#E8F2EE] md:px-12 md:py-32">
        <div className="relative mx-auto max-w-[1380px] md:flex md:items-end md:justify-between">
          <div>
            <p className="font-['DM_Sans'] text-[10px] uppercase tracking-[0.25em] text-[#C69A3A]">O primeiro passo</p>
            <h2 className="mt-5 max-w-2xl font-['Playfair_Display'] text-5xl leading-[1.02] md:text-7xl">Precisa de ajuda<br /><i>com algo especial?</i></h2>
          </div>
          <div className="mt-10 md:mt-0 md:w-80">
            <p className="text-sm leading-6 text-[#A7B3C5]">Conte-nos o que precisa. A nossa equipa responde com tempo, atenção e cuidado.</p>
            <div className="mt-7">
              <a href="https://wa.me/244922001778?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20YESOLA%20Neg%C3%B3cios%20%26%20Finan%C3%A7as." target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C69A3A] text-white text-sm font-medium rounded-full hover:bg-[#C69A3A] transition-colors">
                Falar connosco
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
