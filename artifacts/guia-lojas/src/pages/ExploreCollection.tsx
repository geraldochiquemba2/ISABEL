import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowUpRight, Mail, Phone, Instagram, X } from "lucide-react";
import { getStoreCategories } from "@/lib/storeCategories";
import { ANGOLA_PROVINCES } from "@/data/angolaData";
import { getMunicipalities, storeMatchesScope, scopeRank, type Scope } from "@/lib/locationIndex";
import WhereSearch from "@/components/WhereSearch";

type CollectionGroup = {
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
  image?: string;
  coverImage?: string;
  logoUrl?: string;
  description?: string;
  isOpen?: boolean;
  province?: string;
  municipality?: string;
  products?: { imageUrl?: string; imageUrls?: string | string[] }[];
}

const groups: CollectionGroup[] = [
  {
    number: "01",
    title: "Moda Feminina",
    intro: "Vestuário, acessórios e looks para todas as ocasiões.",
    items: ["Vestidos & Saias", "Blusas & Camisas", "Calças & Jeans", "Casacos & Jaquetas", "Acessórios Femininos"],
    category: "moda-feminina",
  },
  {
    number: "02",
    title: "Moda Masculina",
    intro: "Estilo e conforto para o homem moderno.",
    items: ["Camisas & Polos", "Calças & Berendas", "Casacos & Trajes", "Acessórios Masculinos"],
    category: "moda-masculina",
  },
  {
    number: "03",
    title: "Moda Infantil",
    intro: "Vestuário divertido e confortável para os pequenos.",
    items: ["Roupas para Bebés", "Vestuário Infantil (2-10 anos)", "Acessórios Infantis", "Kits de Enxoval"],
    category: "moda-infantil",
  },
  {
    number: "04",
    title: "Calçado",
    intro: "Sapatos e calçado para toda a família.",
    items: ["Sapatos Femininos", "Sapatos Masculinos", "Calçado Infantil", "Sapatilhas", "Sandálias", "Chinelos"],
    category: "calcado",
  },
  {
    number: "05",
    title: "Bolsas & Acessórios",
    intro: "Bolsas, carteiras e acessórios para completar o vosso look.",
    items: ["Bolsas Femininas", "Mochilas", "Carteiras", "Cintos", "Óculos", "Acessórios de Moda"],
    category: "bolsas-acessorios",
  },
  {
    number: "06",
    title: "Jóias & Bijutarias",
    intro: "Peças que realçam a vossa beleza com elegância.",
    items: ["Anéis", "Brincos", "Colares", "Pulseiras", "Jóias", "Bijutarias"],
    category: "joias-bijutarias",
  },
  {
    number: "07",
    title: "Beleza & Bem-Estar",
    intro: "Produtos, cuidados e perucas para realçar a vossa beleza natural.",
    items: ["Skincare & Tratamentos", "Maquilhagem", "Perfumes & Fragrâncias", "Cabelo & Penteados", "Perucas & Adições Capilares", "Produtos Capilares"],
    category: "beleza-bem-estar",
  },
  {
    number: "08",
    title: "Tecnologia & Electrónicos",
    intro: "Tecnologia e gadgets para o dia a dia.",
    items: ["Smartphones & Tablets", "Acessórios Tech", "Áudio & Fones", "Computadores", "Wearables & Gadgets"],
    category: "tecnologia-eletronicos",
  },
  {
    number: "09",
    title: "Casa & Serviços",
    intro: "Tudo para tornar a vossa casa mais acolhedora.",
    items: ["Mobiliário", "Decoração & Objetos", "Iluminação", "Têxteis & Roupa de Cama", "Utensílios de Cozinha"],
    category: "casa-servicos",
  },
  {
    number: "10",
    title: "Alimentação & Restauração",
    intro: "Sabores e productos para todos os gostos.",
    items: ["Restaurantes & Take-away", "Bolos & Pastelaria", "Bebidas & Distribuidoras", "Supermercados", "Orgânicos & Naturais"],
    category: "alimentacao-restauracao",
  },
];

function StoreCard({ store, productImages }: { store: Store; productImages?: string[] }) {
  const fallbackImage = "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop&auto=format&q=75";
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
      className="flex-shrink-0 w-48 rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow border border-[#E9D9B6] cursor-pointer hover:-translate-y-1"
      onClick={() => window.location.href = `/loja/${store.id}?from=collection`}
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
        <h4 className="text-sm font-semibold text-[#171717] truncate">{store.name}</h4>
        {store.description && (
          <p className="text-[10px] text-[#77736D] mt-1 line-clamp-2">{store.description}</p>
        )}
      </div>
    </div>
  );
}

export default function ExploreCollection() {
  const [activeFilter, setActiveFilter] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("categoria");
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("categoria");
    if (cat) setActiveFilter(cat);
  }, []);

  const { data: stores = [] } = useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      const res = await fetch("/api/stores");
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60_000,
  });

  const provinces = ANGOLA_PROVINCES.map((p) => p.name);
  const municipalities = activeProvince ? getMunicipalities(activeProvince) : [];

  const normalizeCategory = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[&]/g, " ").replace(/\s+/g, " ").trim();

  const getStoresForGroup = (category: string) => {
    const normCategory = normalizeCategory(category);
    const matched = stores.filter((s: Store) => {
      const cats = getStoreCategories(s).map((c) => normalizeCategory(c));
      const group = groups.find((g) => g.category === category);
      const normTitle = group ? normalizeCategory(group.title) : "";
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
    }
    return __mapped;
  };

  const filteredGroups = activeFilter
    ? groups.filter((g) => g.category === activeFilter)
    : [...groups].sort((a, b) => getStoresForGroup(b.category).length - getStoresForGroup(a.category).length);

  return (
    <main className="min-h-[100dvh] bg-[#FBF7EC] text-[#171717]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap');
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FBF7EC]/95 backdrop-blur-md border-b border-[#E9D9B6]/60">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between px-6 py-4 md:px-12">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm text-[#77736D] hover:text-[#171717] transition-colors">
            <ArrowLeft size={16} /> Voltar
          </button>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", letterSpacing: "-.02em", color: "#171717" }}>YESOLA<small style={{ display: "block", color: "#D8B532", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: ".23em", fontSize: "8px", marginTop: "2px" }}>Collection</small></span>
          <a href="/explorar" className="text-xs font-bold uppercase tracking-[0.14em] text-[#77736D] hover:text-[#D8B532] transition-colors hidden md:block">Explorar</a>
        </div>
      </header>

      <div className="mx-auto max-w-[1380px] px-6 pt-28 pb-12 md:px-12">

        <div className="mb-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#77736D]">Explorar lojas</p>
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
          <button
            onClick={() => setActiveFilter(null)}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
              activeFilter === null
                ? "bg-[#171717] text-white"
                : "bg-[#E9D9B6] text-[#77736D] hover:bg-[#E9D9B6]"
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
                  ? "bg-[#171717] text-white"
                  : "bg-[#E9D9B6] text-[#77736D] hover:bg-[#E9D9B6]"
              }`}
            >
              {group.number} {group.title.split(",")[0].split(" e ")[0]}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <span className="text-xs uppercase tracking-[0.15em] text-[#77736D] mr-2">Onde procuras?</span>
          <div className="mt-2 max-w-md">
            <WhereSearch onScope={setLocationScope} onClear={() => setLocationScope(null)} accent="#D8B532" />
          </div>
          {locationScope && (
            <button
              onClick={() => setLocationScope(null)}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#D8B532" }}
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
            <button
              onClick={() => { setActiveProvince(null); setActiveMunicipality(null); }}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                activeProvince === null
                  ? "bg-[#D8B532] text-white"
                  : "bg-[#E9D9B6] text-[#77736D] hover:bg-[#E9D9B6]"
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
                    ? "bg-[#D8B532] text-white"
                    : "bg-[#E9D9B6] text-[#77736D] hover:bg-[#E9D9B6]"
                }`}
              >
                {province}
              </button>
            ))}
          </div>
        </div>

        {municipalities.length > 0 && (
          <div className="mb-12">
            <span className="text-xs uppercase tracking-[0.15em] text-[#77736D] mr-2">Município:</span>
            <select
              value={activeMunicipality || ""}
              onChange={(e) => setActiveMunicipality(e.target.value || null)}
              className="mt-2 md:hidden w-full px-4 py-3 rounded-xl text-sm border border-[#E9D9B6] bg-white text-[#171717] outline-none"
            >
              <option value="">Todos</option>
              {municipalities.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <div className="hidden md:flex flex-wrap gap-3 mt-2">
              <button
                onClick={() => setActiveMunicipality(null)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                  activeMunicipality === null
                    ? "bg-[#D8B532] text-white"
                    : "bg-[#E9D9B6] text-[#77736D] hover:bg-[#E9D9B6]"
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
                      ? "bg-[#D8B532] text-white"
                      : "bg-[#E9D9B6] text-[#77736D] hover:bg-[#E9D9B6]"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          {filteredGroups.map((group, i) => (
            <article key={group.number} className={`group border-t border-[#E9D9B6] py-8 md:py-12 ${i % 2 ? "md:ml-20" : ""}`}>
              <div className="grid gap-7 md:grid-cols-[100px_minmax(0,1fr)_minmax(260px,370px)] md:items-start">
                <span className="font-mono text-xs tracking-[0.2em] text-[#77736D]">{group.number}</span>
                <div>
                  <h3 className="max-w-xl font-serif text-3xl leading-[1.08] text-[#171717] md:text-[2.8rem]">{group.title}</h3>
                  <p className="mt-4 max-w-md text-sm leading-7 text-[#77736D]">{group.intro}</p>
                   <ul className="mt-6 space-y-3 border-l border-[#E9D9B6] pl-5 text-sm leading-5 text-[#77736D]">
                     {group.items.map((item) => (
                       <li key={item}>
                         <a
                           href={`/explorar?categoria=${group.category}`}
                           className={`flex gap-3 transition-transform duration-300 group-hover:translate-x-1 cursor-pointer ${
                             activeFilter === group.category ? "text-[#171717] font-medium" : "hover:text-[#171717]"
                           }`}
                         >
                           <span className={`mt-2 h-1 w-1 shrink-0 rounded-full ${activeFilter === group.category ? "bg-[#D8B532]" : "bg-[#77736D]"}`} />{item}
                         </a>
                       </li>
                     ))}
                   </ul>
                  {getStoresForGroup(group.category).length > 0 && (
                    <button
                      onClick={() => setActiveFilter(activeFilter === group.category ? null : group.category)}
                      className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#77736D] hover:text-[#171717] transition-colors"
                    >
                      Ver mais <ArrowUpRight size={14} />
                    </button>
                  )}
                </div>
                <div className="mt-4 md:mt-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#77736D] mb-3">Lojas/Serviços disponíveis</p>
                  {getStoresForGroup(group.category).length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {getStoresForGroup(group.category).slice(0, 2).map(({ store, productImages }: any) => (
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
          ))}
        </div>
      </div>

      <section className="relative overflow-hidden border-t border-[#E9D9B6] bg-[#171717] px-6 py-24 text-[#FBF7EC] md:px-12 md:py-32">
        <div className="absolute -right-16 -top-24 h-96 w-96 rounded-full border border-[#E9D9B6]/20" />
        <div className="absolute -right-4 -top-12 h-72 w-72 rounded-full border border-[#E9D9B6]/15" />
        <div className="relative mx-auto max-w-[1380px] md:flex md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#E9D9B6]">O primeiro passo</p>
            <h2 className="mt-5 max-w-2xl font-serif text-5xl leading-[1.02] md:text-7xl">Encontre o que<br /><i>procurais.</i></h2>
          </div>
          <div className="mt-10 md:mt-0 md:w-80">
            <p className="text-sm leading-6 text-[#E9D9B6]">Contem-nos o que procuram. A nossa equipa responde com tempo, atenção e as melhores opções.</p>
            <div className="mt-7 flex items-center gap-4">
              <a href="https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20YESOLA%20Collection%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#e3e7eb] hover:text-white transition-colors">
                <Phone size={14} /> Ligar
              </a>
              <a href="https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20YESOLA%20Collection%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#e3e7eb] hover:text-white transition-colors">
                <Mail size={14} /> Email
              </a>
              <a href="https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20YESOLA%20Collection%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#e3e7eb] hover:text-white transition-colors">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1380px] flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-12 bg-[#FBF7EC]">
        <div className="flex items-center gap-3">
          <img src="/logo-yesola-icon-dark.png" alt="YESOLA Collection" className="w-8 h-8" />
          <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg tracking-[0.08em] text-[#171717]">YESOLA <i className="font-normal" style={{ fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: ".15em", fontSize: "9px" }}>COLLECTION</i></span>
        </div>
        <p className="text-xs text-[#77736D]">Tudo o que procurais, encontrais aqui.</p>
        <div className="flex items-center gap-5 text-[#77736D]">
          <a href="https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20YESOLA%20Collection%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><Mail size={16} /></a>
          <a href="https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20YESOLA%20Collection%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><Phone size={16} /></a>

          <span className="font-mono text-[10px] tracking-[0.2em]">© 2024 YESOLA</span>
        </div>
      </footer>
    </main>
  );
}
