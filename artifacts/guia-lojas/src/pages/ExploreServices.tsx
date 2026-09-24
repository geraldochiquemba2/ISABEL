import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowUpRight, X, Mail, Phone, Instagram } from "lucide-react";
import { getStoreCategories } from "@/lib/storeCategories";
import { ANGOLA_PROVINCES } from "@/data/angolaData";
import { getMunicipalities, storeMatchesScope, scopeRank, type Scope } from "@/lib/locationIndex";
import WhereSearch from "@/components/WhereSearch";

type ServiceGroup = {
  number: string;
  title: string;
  intro: string;
  items: string[];
  category: string;
};

interface Store {
  id: string;
  name: string;
  category: string;
  categories?: string[];
  image?: string;
  coverImage?: string;
  logoUrl?: string;
  description?: string;
  isOpen?: boolean;
  province?: string;
  municipality?: string;
  products?: { imageUrl?: string; imageUrls?: string | string[] }[];
}

const groups: ServiceGroup[] = [
  {
    number: "01",
    title: "Planeamento & Organização de Casamentos",
    intro: "Do primeiro sim ao último brinde, guardamos o fio invisível de tudo.",
    items: ["Wedding Planner & Assessoria do Evento", "Assistente Pessoal dos Noivos", "Weddings & Mini-Weddings", "Mestre de Cerimónias", "Hostesses e Acolhimento VIP"],
    category: "planeamento",
  },
  {
    number: "02",
    title: "Pedidos de Casamento, Noivados & Momentos Românticos",
    intro: "Gestos íntimos, pensados para a vossa história e para aquele instante único.",
    items: ["Criador de Pedidos de Casamento", "Aniversários de Namoro/Casamento", "Chefs ao Domicílio para Jantares Íntimos", "Serenatas e Músicos para Pedidos"],
    category: "noivados",
  },
  {
    number: "03",
    title: "Fotografia, Vídeo & Produção Audiovisual",
    intro: "A memória viva de cada detalhe, feita para durar gerações.",
    items: ["Fotógrafo de Casamento", "Videógrafo & Cinematografia", "Drone & Cobertura Aérea", "Aftermovie & Edição Cinematográfica", "Álbuns & Livros de Fotos"],
    category: "fotografia",
  },
  {
    number: "04",
    title: "Beleza & Estilismo para Noivas e Noivos",
    intro: "A vossa melhor versão, sentida e vista.",
    items: ["Maquilhagem Profissional para Noivas", "Penteado & Hair Styling", "Estilista Pessoal & Consultoria de Imagem", "Tratamentos de Pele e Corpo", "Grooming & Barba para Noivos"],
    category: "beleza",
  },
  {
    number: "05",
    title: "Decoração, Flores & Experiências",
    intro: "O cenário, os sabores e o ritmo que fazem cada celebração ganhar alma.",
    items: ["Locais e Espaços para Eventos", "Design Floral & Decoração Temática", "Catering, Bolos de Noiva e Bar de Cocktails", "DJs, Bandas e Entretenimento"],
    category: "decoracao",
  },
];

function StoreCard({ store, productImages }: { store: Store; productImages?: string[] }) {
  const fallbackImage = "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop&auto=format&q=75";
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
      className="flex-shrink-0 w-48 rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow border border-[#e8eaed] cursor-pointer hover:-translate-y-1"
      onClick={() => window.location.href = `/loja/${store.id}?from=weddings`}
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
            {images.map((_, i) => (
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
        <h4 className="text-sm font-semibold text-[#30343a] truncate">{store.name}</h4>
        {store.description && (
          <p className="text-[10px] text-[#87909a] mt-1 line-clamp-2">{store.description}</p>
        )}
      </div>
    </div>
  );
}

export default function ExploreServices() {
  const [activeFilter, setActiveFilter] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("categoria");
  });
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("subcategoria");
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

  const hasActiveFilters = activeFilter !== null || activeProvince !== null || activeMunicipality !== null || locationScope !== null || activeSubcategory !== null;

  const clearAllFilters = () => {
    setActiveFilter(null);
    setActiveSubcategory(null);
    setActiveProvince(null);
    setActiveMunicipality(null);
    setLocationScope(null);
    const url = new URL(window.location.href);
    url.search = "";
    try { localStorage.removeItem("eliora-location-scope"); } catch { /* ignora */ }
    window.history.replaceState({}, "", url.toString());
  };

  const localUserStr = typeof window !== "undefined" ? localStorage.getItem("guialocal_user") : null;
  const localUser = localUserStr ? JSON.parse(localUserStr) : null;
  const currentStoreId = localUser?.storeId || localUser?.store_id;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("categoria");
    const sub = params.get("subcategoria");
    if (cat) setActiveFilter(cat);
    if (sub) setActiveSubcategory(sub);
  }, []);

  const { data: stores = [] } = useQuery({
    queryKey: ["stores", "weddings"],
    queryFn: async () => {
      const res = await fetch("/api/stores?store_type=weddings");
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60_000,
  });


  const provinces = ANGOLA_PROVINCES.map((p) => p.name);
  const municipalities = activeProvince ? getMunicipalities(activeProvince) : [];

  const getStoresForGroup = (category: string) => {
    const matched = stores.filter((s: Store) => {
      const matchesCategory = getStoreCategories(s).some((c) => c.toLowerCase().includes(category.toLowerCase()));
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
    }
    return __mapped;
  };

  const filteredGroups = activeFilter
    ? groups.filter((g) => g.category === activeFilter)
    : groups;

  return (
    <main className="min-h-[100dvh] bg-[#fafafa] text-[#30343a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap');
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 bg-[#fafafa]/95 backdrop-blur-md border-b border-[#d9dde1]/60">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between px-6 py-4 md:px-12">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm text-[#68727c] hover:text-[#30343a] transition-colors">
            <ArrowLeft size={16} /> Voltar
          </button>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", letterSpacing: "-.02em", color: "#173a42" }}>YESOLA<small style={{ display: "block", color: "#c47a9b", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: ".23em", fontSize: "8px", marginTop: "2px" }}>Casamentos</small></span>
          <a href="/explorar" className="text-xs font-bold uppercase tracking-[0.14em] text-[#68727c] hover:text-[#c47a9b] transition-colors hidden md:block">Explorar</a>
        </div>
      </header>

      <div className="mx-auto max-w-[1380px] px-6 pt-28 pb-12 md:px-12">

        <div className="mb-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#87909a]">Explorar serviços</p>
          <h1 className="mt-4 font-serif text-5xl tracking-[-0.03em] md:text-7xl">O nosso<br /><i>universo.</i></h1>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-12">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] bg-red-100 text-red-700 hover:bg-red-200 transition-all font-semibold border border-red-200"
            >
              <X size={14} /> Limpar Filtros
            </button>
          )}
          <button
            onClick={() => setActiveFilter(null)}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
              activeFilter === null
                ? "bg-[#2c3035] text-white"
                : "bg-[#e8eaed] text-[#68727c] hover:bg-[#d1d4d8]"
            }`}
          >
            Todos
          </button>
          {groups.map((group) => (
            <button
              key={group.category}
              onClick={() => setActiveFilter(activeFilter === group.category ? null : group.category)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                activeFilter === group.category
                  ? "bg-[#2c3035] text-white"
                  : "bg-[#e8eaed] text-[#68727c] hover:bg-[#d1d4d8]"
              }`}
            >
              {group.number} {group.title.split(",")[0].split(" e ")[0]}
            </button>
          ))}
        </div>

        {/* Filtro por província */}
        <div className="mb-6">
          <span className="text-xs uppercase tracking-[0.15em] text-[#87909a] mr-2">Onde procuras?</span>
          <div className="mt-2 max-w-md">
            <WhereSearch onScope={setLocationScope} onClear={() => setLocationScope(null)} accent="#2c3035" />
          </div>
          {locationScope && (
            <button
              onClick={() => setLocationScope(null)}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#2c3035" }}
            >
              <X size={14} /> Perto de {locationScope.locality} ({locationScope.kind})
            </button>
          )}
        </div>

        <div className="mb-6">
          <span className="text-xs uppercase tracking-[0.15em] text-[#87909a] mr-2">Província:</span>
          <select
            value={activeProvince || ""}
            onChange={(e) => { setActiveProvince(e.target.value || null); setActiveMunicipality(null); }}
            className="mt-2 md:hidden w-full px-4 py-3 rounded-xl text-sm border border-[#d1d4d8] bg-white text-[#30343a] outline-none"
          >
            <option value="">Todas</option>
            {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <div className="hidden md:flex flex-wrap gap-3 mt-2">
            <button
              onClick={() => { setActiveProvince(null); setActiveMunicipality(null); }}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                activeProvince === null
                  ? "bg-[#68727c] text-white"
                  : "bg-[#e8eaed] text-[#68727c] hover:bg-[#d1d4d8]"
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
                    ? "bg-[#68727c] text-white"
                    : "bg-[#e8eaed] text-[#68727c] hover:bg-[#d1d4d8]"
                }`}
              >
                {province}
              </button>
            ))}
          </div>
        </div>

        {/* Filtro por município */}
        {municipalities.length > 0 && (
          <div className="mb-12">
            <span className="text-xs uppercase tracking-[0.15em] text-[#87909a] mr-2">Município:</span>
            <select
              value={activeMunicipality || ""}
              onChange={(e) => setActiveMunicipality(e.target.value || null)}
              className="mt-2 md:hidden w-full px-4 py-3 rounded-xl text-sm border border-[#d1d4d8] bg-white text-[#30343a] outline-none"
            >
              <option value="">Todos</option>
              {municipalities.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <div className="hidden md:flex flex-wrap gap-3 mt-2">
              <button
                onClick={() => setActiveMunicipality(null)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                  activeMunicipality === null
                    ? "bg-[#87909a] text-white"
                    : "bg-[#e8eaed] text-[#68727c] hover:bg-[#d1d4d8]"
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
                      ? "bg-[#87909a] text-white"
                      : "bg-[#e8eaed] text-[#68727c] hover:bg-[#d1d4d8]"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Lista */}
        <div>
          {filteredGroups.map((group, i) => (
            <article key={group.number} className={`group border-t border-[#d1d4d8] py-8 md:py-12 ${i % 2 ? "md:ml-20" : ""}`}>
              <div className="grid gap-7 md:grid-cols-[100px_minmax(0,1fr)_minmax(260px,370px)] md:items-start">
                <span className="font-mono text-xs tracking-[0.2em] text-[#89919a]">{group.number}</span>
                <div>
                  <h3 className="max-w-xl font-serif text-3xl leading-[1.08] text-[#30343a] md:text-[2.8rem]">{group.title}</h3>
                  <p className="mt-4 max-w-md text-sm leading-7 text-[#686e76]">{group.intro}</p>
                   <ul className="mt-6 space-y-3 border-l border-[#d7dade] pl-5 text-sm leading-5 text-[#565d66]">
                     {group.items.map((item) => (
                       <li key={item}>
                         <a
                           href={`/explorar?categoria=${group.category}&subcategoria=${encodeURIComponent(item)}`}
                           className={`flex gap-3 transition-transform duration-300 group-hover:translate-x-1 cursor-pointer ${
                             activeSubcategory === item ? "text-[#30343a] font-medium" : "hover:text-[#30343a]"
                           }`}
                         >
                           <span className={`mt-2 h-1 w-1 shrink-0 rounded-full ${activeSubcategory === item ? "bg-[#30343a]" : "bg-[#aeb6bf]"}`} />{item}
                         </a>
                       </li>
                     ))}
                   </ul>
                  {getStoresForGroup(group.category).length > 0 && (
                    <button
                      onClick={() => setActiveFilter(activeFilter === group.category ? null : group.category)}
                      className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#68727c] hover:text-[#30343a] transition-colors"
                    >
                      Ver mais <ArrowUpRight size={14} />
                    </button>
                  )}
                </div>
                <div className="mt-4 md:mt-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#87909a] mb-3">Lojas/Serviços disponíveis</p>
                  {getStoresForGroup(group.category).length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {getStoresForGroup(group.category).slice(0, 2).map(({ store, productImages }: any) => (
                        <StoreCard key={store.id} store={store} productImages={productImages} />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[#d1d4d8] p-6 text-center">
                      <p className="text-xs text-[#87909a]">Em breve novas lojas</p>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Contacto */}
      <section className="relative overflow-hidden border-t border-[#cbd0d5] bg-[#2c3035] px-6 py-24 text-[#fafafa] md:px-12 md:py-32">
        <div className="absolute -right-16 -top-24 h-96 w-96 rounded-full border border-[#e4e7ea]/20" />
        <div className="absolute -right-4 -top-12 h-72 w-72 rounded-full border border-[#e4e7ea]/15" />
        <div className="relative mx-auto max-w-[1380px] md:flex md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#b9c1ca]">O primeiro passo</p>
            <h2 className="mt-5 max-w-2xl font-serif text-5xl leading-[1.02] md:text-7xl">Vamos criar espaço<br /><i>para a vossa história?</i></h2>
          </div>
          <div className="mt-10 md:mt-0 md:w-80">
            <p className="text-sm leading-6 text-[#cbd0d5]">Contem-nos o que estão a imaginar. A nossa equipa responde com tempo, atenção e uma primeira ideia.</p>
            <div className="mt-7 flex items-center gap-4">
              <a href="https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20YESOLA%20Casamentos%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#e3e7eb] hover:text-white transition-colors">
                <Phone size={14} /> Ligar
              </a>
              <a href="https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20YESOLA%20Casamentos%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#e3e7eb] hover:text-white transition-colors">
                <Mail size={14} /> Email
              </a>
              <a href="https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20YESOLA%20Casamentos%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#e3e7eb] hover:text-white transition-colors">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto flex max-w-[1380px] flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-12 bg-[#fafafa]">
        <div className="flex items-center gap-3">
          <img src="/logo-yesola-icon-dark.png" alt="YESOLA Casamentos" className="w-8 h-8" />
          <span className="font-serif text-lg tracking-[0.08em] text-[#2d2c2b]">YESOLA <i className="font-normal">Casamentos</i></span>
        </div>
        <p className="text-xs text-[#747b84]">Celebrações com intenção, em Angola e além.</p>
        <div className="flex items-center gap-5 text-[#747b84]">
          <a href="https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20YESOLA%20Casamentos%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><Mail size={16} /></a>
          <a href="https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20YESOLA%20Casamentos%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><Phone size={16} /></a>

          <span className="font-mono text-[10px] tracking-[0.2em]">© 2024 YESOLA</span>
        </div>
      </footer>
    </main>
  );
}