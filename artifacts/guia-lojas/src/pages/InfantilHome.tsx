import { useMemo, useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowDown,
  Baby,
  Blocks,
  Check,
  ChevronDown,
  Compass,
  Heart,
  Home,
  Hotel,
  Key,
  MapPin,
  Menu,
  ShieldCheck,
  Sparkles,
  TreePalm,
  X as XIcon,
} from "lucide-react";

type ServiceCategory = {
  number: string;
  title: string;
  intro: string;
  icon: typeof Compass;
  accent: string;
  services: string[];
};

function StoreCard({ store, productImages }: { store: any; productImages?: string[] }) {
  const [, navigate] = useLocation();
  const fallbackImage = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop&auto=format&q=75";
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
      onClick={() => navigate(`/loja/${store.id}?from=infantil`)}
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
        <h4 className="text-sm font-semibold text-[#30343a] truncate">{store.name}</h4>
        {store.description && (
          <p className="text-[10px] text-[#87909a] mt-1 line-clamp-2">{store.description}</p>
        )}
      </div>
    </div>
  );
}

const categories: ServiceCategory[] = [
  {
    number: "01",
    title: "Moda & Enxoval Infantil",
    intro: "Vestuário e enxoval com carinho para os pequenos.",
    icon: Baby,
    accent: "#e74c8c",
    services: [
      "Roupas para Bebés & Recém-Nascidos",
      "Vestuário Infantil (Calçado, Acessórios e Fardas)",
      "Kits de Enxoval & Maternidade",
    ],
  },
  {
    number: "02",
    title: "Brinquedos & Aprendizagem",
    intro: "Diversão e aprendizagem para todas as idades.",
    icon: Blocks,
    accent: "#8e44ad",
    services: [
      "Brinquedos Educativos & Didáticos",
      "Jogos, Livros & Material Escolar",
      "Mobília & Decoração de Quartos Infantis",
    ],
  },
  {
    number: "03",
    title: "Cuidados, Saúde & Bem-Estar",
    intro: "Tudo para a saúde e bem-estar do bebé e da mãe.",
    icon: Heart,
    accent: "#e74c8c",
    services: [
      "Produtos de Higiene & Maternidade",
      "Creches, Jardim de Infância & Explicações",
      "Festas Infantis & Animação",
    ],
  },
];

function Monogram() {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/logo-eliora-dark.svg"
        alt="Eliora Infantil & Maternidade"
        className="w-10 h-10"
        style={{ filter: "brightness(0) saturate(100%) invert(55%) sepia(40%) saturate(600%) hue-rotate(270deg) brightness(85%) contrast(85%)" }}
      />
      <span className="font-['Playfair_Display'] text-xl tracking-[0.08em] text-[#8e44ad]">Eliora <i className="font-normal">Infantil & Maternidade</i></span>
    </div>
  );
}

export default function InfantilHome({ onBackToSelector }: { onBackToSelector?: () => void }) {
  useThemeColor("#8e44ad");
  const [, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolledEnd, setScrolledEnd] = useState(false);
  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (el) {
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
      setScrolledEnd(atEnd);
    }
  };

  const localUserStr = typeof window !== "undefined" ? localStorage.getItem("guialocal_user") : null;
  const localUser = localUserStr ? JSON.parse(localUserStr) : null;
  const isLoggedIn = !!localUser && localUser.storeType === "infantil";

  const { data: stores = [] } = useQuery({
    queryKey: ["stores", "infantil"],
    queryFn: async () => {
      const res = await fetch("/api/stores?store_type=infantil");
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60_000,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products", "infantil"],
    queryFn: async () => {
      const res = await fetch("/api/products?store_type=infantil");
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60_000,
  });

  const getStoresForGroup = (category: string) => {
    const catKey = category.toLowerCase();
    const categoryProducts = products.filter((p: any) => p.category?.toLowerCase().includes(catKey));
    const storeIdsWithProducts = new Set(categoryProducts.map((p: any) => p.storeId));
    const storesWithCategory = stores.filter((s: any) => s.category?.toLowerCase().includes(catKey));
    const allStoreIds = new Set([...storeIdsWithProducts, ...storesWithCategory.map((s: any) => s.id)]);
    const storesWithProducts = stores.filter((s: any) => !["999999999"].includes(s.phone) && allStoreIds.has(s.id));
    const storeProductsMap: Record<string, string[]> = {};
    categoryProducts.forEach((p: any) => {
      const imgs = (p.imageUrls && p.imageUrls.length > 0) ? p.imageUrls : (p.imageUrl ? [p.imageUrl] : []);
      if (!storeProductsMap[p.storeId]) storeProductsMap[p.storeId] = [];
      storeProductsMap[p.storeId].push(...imgs);
    });
    return { stores: storesWithProducts, storeProducts: storeProductsMap };
  };

  const serviceStoreMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const cat of categories) {
      const { stores: catStores } = getStoresForGroup(cat.title);
      const catStoreIds = new Set(catStores.map((s: any) => s.id));
      for (const service of cat.services) {
        if (!map.has(service)) {
          for (const p of products) {
            if (catStoreIds.has(p.storeId) && p.name.toLowerCase().includes(service.toLowerCase())) {
              map.set(service, p.storeId);
              break;
            }
          }
          if (!map.has(service) && catStores.length > 0) {
            map.set(service, catStores[0].id);
          }
        }
      }
    }
    return map;
  }, [categories, stores, products]);

  const sortedCategories = useMemo(() => {
    return [...categories]
      .sort((a, b) => {
        const storesA = getStoresForGroup(a.title).stores.length;
        const storesB = getStoresForGroup(b.title).stores.length;
        return storesB - storesA;
      })
      .map((c, i) => ({ ...c, number: String(i + 1).padStart(2, "0") }));
  }, [stores, products]);

  return (
    <main className="min-h-[100dvh] overflow-x-hidden bg-[#fdf8f5] text-[#8e44ad]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap');
        .eliora-grain:after{content:"";position:fixed;inset:0;pointer-events:none;opacity:.035;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E")}
        @keyframes rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}} .rise{animation:rise .8s ease both}.delay-1{animation-delay:.14s}.delay-2{animation-delay:.26s}
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 mx-auto flex max-w-[1380px] items-center justify-between px-6 py-6 md:px-12 bg-[#fdf8f5]/90 backdrop-blur-md">
        <a className="flex items-center gap-3 no-underline" href="#top" aria-label="Eliora Infantil & Maternidade">
          <img
            src="/logo-eliora-dark.svg"
            alt="Eliora"
            style={{ width: "39px", height: "39px", filter: "brightness(0) saturate(100%) invert(55%) sepia(40%) saturate(600%) hue-rotate(270deg) brightness(85%) contrast(85%)" }}
          />
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", letterSpacing: "-.02em", color: "#8e44ad" }}>Eliora<small style={{ display: "block", color: "#e74c8c", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: ".23em", fontSize: "8px", marginTop: "2px" }}>Infantil & Maternidade</small></span>
        </a>
        <nav className={`${menuOpen ? "absolute left-0 right-0 top-full flex bg-white px-6 pb-7 shadow-lg" : "hidden"} flex-col gap-5 text-xs uppercase tracking-[0.18em] md:static md:flex md:flex-row md:items-center md:gap-9 md:bg-transparent md:p-0 md:shadow-none`}>
          <button onClick={() => scrollTo("servicos")} className="text-left transition-colors hover:text-[#e74c8c]">Serviços</button>
          <a href="/explorar-infantil" className="text-left transition-colors hover:text-[#e74c8c]">Explorar</a>
          <button onClick={() => scrollTo("abordagem")} className="text-left transition-colors hover:text-[#e74c8c]">A nossa abordagem</button>
          <button onClick={() => scrollTo("contacto")} className="text-left transition-colors hover:text-[#e74c8c]">Contacto</button>
          {isLoggedIn ? (
            <>
              <a href="/dashboard-infantil" className="flex items-center gap-2 text-left text-[#8e44ad] font-medium hover:text-[#e74c8c] transition-colors">Painel</a>
              <button onClick={() => { localStorage.removeItem("guialocal_user"); window.location.reload(); }} className="flex items-center gap-2 text-left text-[#8e44ad]/65 hover:text-[#8e44ad] transition-colors">Sair</button>
            </>
          ) : (
            <a href="/login-infantil" className="flex items-center gap-2 text-left text-[#8e44ad]/65 hover:text-[#8e44ad] transition-colors">Entrar</a>
          )}
          {onBackToSelector && (
            <button onClick={onBackToSelector} className="flex items-center gap-2 text-left text-[#8e44ad]/65 hover:text-[#8e44ad] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Trocar loja
            </button>
          )}
        </nav>
        <button aria-label="Abrir menu" onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">{menuOpen ? <XIcon size={20} /> : <Menu size={21} />}</button>
      </header>

      <div className="eliora-grain">
        <div className="mx-auto max-w-[1380px] px-4 pt-[6.3rem] pb-1 md:px-12 md:pt-24 md:pb-2">
          <div ref={scrollRef} onScroll={handleScroll} className="flex flex-row flex-nowrap overflow-x-auto gap-2 scrollbar-hide pb-1">
            {sortedCategories.map((cat) => (
              <a
                key={cat.number}
                href={`/explorar-infantil?categoria=${cat.title.split(",")[0].trim()}`}
                onClick={(e) => { e.preventDefault(); navigate(`/explorar-infantil?categoria=${cat.title.split(",")[0].trim()}`); }}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-3 md:py-2 rounded-full border border-[#8e44ad]/20 bg-white hover:border-[#8e44ad] hover:bg-[#f3e8f8] transition-all text-[11px] font-semibold text-[#8e44ad]/70"
              >
                <span className="font-mono text-[9px] text-[#e74c8c]">{cat.number}</span>
                {cat.title.split(",")[0].trim()}
              </a>
            ))}
          </div>
          <div className="flex justify-center items-center gap-2 mt-1 md:hidden">
            {scrolledEnd ? (
              <span className="text-[10px] text-[#8e44ad] font-medium">Fim</span>
            ) : (
              <>
                <span className="text-[10px] text-[#8e44ad] font-medium">Deslize para ver mais</span>
                <ArrowRight size={12} className="text-[#8e44ad] animate-pulse" />
              </>
            )}
          </div>
        </div>

        <section id="servicos" className="mx-auto max-w-[1380px] px-6 pt-1 pb-4 md:px-12 md:pt-1 md:pb-4">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-5 font-['DM_Sans'] text-[11px] font-bold uppercase tracking-[0.23em] text-[#e74c8c]">
                O que fazemos
              </p>
              <h2 className="max-w-2xl font-['Playfair_Display'] text-5xl leading-[0.95] tracking-[-0.04em] sm:text-6xl">
                Cuidar com amor.
                <br />
                <em className="text-[#8e44ad]">Crescer com carinho.</em>
              </h2>
            </div>
            <p className="max-w-xs font-['DM_Sans'] text-sm leading-6 text-[#8e44ad]/60">
              Cada detalhe pensado para o vosso pequeno.
            </p>
          </div>
          {sortedCategories.map((cat, i) => {
            const CatIcon = cat.icon;
            return (
              <article className={`group border-t border-[#8e44ad]/15 py-4 md:py-8 ${i % 2 ? "md:ml-20" : ""}`}>
                <div className="grid gap-7 md:grid-cols-[100px_minmax(0,1fr)_minmax(260px,370px)] md:items-start">
                  <span className="font-mono text-xs tracking-[0.2em] text-[#e74c8c]">{cat.number}</span>
                  <div>
                    <h3 className="max-w-xl font-['Playfair_Display'] text-3xl leading-[1.08] text-[#8e44ad] md:text-[2.8rem]">{cat.title}</h3>
                    <p className="mt-4 max-w-md text-sm leading-7 text-[#8e44ad]/65">{cat.intro}</p>
                    <ul className="mt-6 space-y-3 border-l border-[#8e44ad]/15 pl-5 text-sm leading-5 text-[#8e44ad]/80">
                      {cat.services.map((service) => {
                        const storeId = serviceStoreMap.get(service);
                        return (
                          <li key={service}>
                            {storeId ? (
                              <a
                                href={`/loja/${storeId}?from=infantil&servico=${encodeURIComponent(service)}`}
                                onClick={(e) => { e.preventDefault(); navigate(`/loja/${storeId}?from=infantil&servico=${encodeURIComponent(service)}`); }}
                                className="flex gap-3 transition-transform duration-300 group-hover:translate-x-1 hover:text-[#8e44ad] cursor-pointer"
                              >
                                <Check size={15} className="mt-0.5 shrink-0 text-[#8e44ad]" />
                                {service}
                              </a>
                            ) : (
                              <a
                                href={`/explorar-infantil?categoria=${cat.title.split(",")[0].trim()}`}
                                onClick={(e) => { e.preventDefault(); navigate(`/explorar-infantil?categoria=${cat.title.split(",")[0].trim()}`); }}
                                className="flex gap-3 transition-transform duration-300 group-hover:translate-x-1 hover:text-[#8e44ad] cursor-pointer"
                              >
                                <Check size={15} className="mt-0.5 shrink-0 text-[#8e44ad]" />
                                {service}
                              </a>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                    <a
                      href={`/explorar-infantil?categoria=${cat.title.split(",")[0].trim()}`}
                      className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#8e44ad]/60 hover:text-[#8e44ad] transition-colors"
                    >
                      Ver mais
                    </a>
                  </div>
                  <div className="mt-4 md:mt-0">
                    {(() => {
                      const { stores: groupStores, storeProducts } = getStoresForGroup(cat.title.split(",")[0].trim());
                      if (groupStores.length === 0) {
                        return (
                          <div className="rounded-2xl border border-dashed border-[#8e44ad]/15 p-6 text-center">
                            <p className="text-xs text-[#8e44ad]/50">Em breve novas lojas</p>
                          </div>
                        );
                      }
                      return (
                        <>
                          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#87909a] mb-3">Lojas recentes</p>
                          <div>
                            <div className="flex flex-row flex-nowrap overflow-x-auto gap-3 scrollbar-hide">
                              {groupStores.slice(0, 4).map((store: any) => (
                                <StoreCard key={store.id} store={store} productImages={storeProducts[store.id]} />
                              ))}
                            </div>
                            {groupStores.length > 1 && (
                              <div className="flex justify-center items-center gap-2 mt-2 md:hidden">
                                <span className="text-[10px] text-[#8e44ad] font-medium">Deslize para ver mais</span>
                                <ArrowRight size={12} className="text-[#8e44ad] animate-pulse" />
                              </div>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section id="abordagem" className="border-y border-[#8e44ad]/10 bg-[#8e44ad] text-[#fdf8f5]">
          <div className="mx-auto grid max-w-[1380px] gap-10 px-6 py-10 md:grid-cols-[.75fr_1.25fr] md:px-12 md:py-14">
            <p className="font-mono text-[10px] uppercase tracking-[.25em] text-[#e74c8c]">A nossa abordagem</p>
            <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_220px] md:items-end">
              <div>
                <p className="max-w-3xl font-['Playfair_Display'] text-3xl leading-[1.2] text-[#fdf8f5] md:text-5xl">Cuidar é um ato de amor. <i>Que começa antes do primeiro sorriso.</i></p>
                <p className="mt-8 max-w-xl text-sm leading-7 text-[#fdf8f5]/60">Na Eliora, tratamos cada peça, cada brinquedo e cada serviço com o mesmo cuidado que dedicamos aos nossos filhos. Porque cada detalhe importa na vida dos pequenos.</p>
              </div>
              <figure className="relative aspect-[.78] overflow-hidden border border-[#fdf8f5]/10 bg-[#8e44ad]">
                <img
                  src="/business/approach.jpg"
                  alt="Eliora Infantil"
                  className="h-full w-full object-cover object-center"
                  style={{ filter: "grayscale(0.3) contrast(0.95) brightness(1.05)" }}
                />
                <figcaption className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[.2em] text-white drop-shadow">02 — Cuidado & Amor</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section id="abordagem-details" className="mx-auto max-w-[1380px] px-6 py-10 md:px-12 md:py-16">
          <div className="grid gap-8 border-t border-[#8e44ad]/15 pt-8 sm:grid-cols-3">
            {[
              ["01", "Compreender", "Analisamos as suas necessidades e aspirations para encontrar a opção ideal para o seu pequeno."],
              ["02", "Aconselhar", "Orientamos com base em experiência, dados e conhecimento profundo do mercado infantil."],
              ["03", "Concretizar", "Acompanhamos cada etapa até encontrar a solução perfeita para a sua família."],
            ].map(([n, title, body]) => (
              <div key={n}>
                <span className="font-['DM_Sans'] text-xs font-bold text-[#e74c8c]">{n}</span>
                <h3 className="mt-5 font-['Playfair_Display'] text-2xl text-[#8e44ad]">{title}</h3>
                <p className="mt-3 font-['DM_Sans'] text-sm leading-6 text-[#8e44ad]/60">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="contacto" className="relative overflow-hidden border-t border-[#e74c8c]/20 bg-[#8e44ad] px-6 py-14 text-[#fdf8f5] md:px-12 md:py-20">
          <div className="absolute -right-16 -top-24 h-96 w-96 rounded-full border border-[#e74c8c]/15" /><div className="absolute -right-4 -top-12 h-72 w-72 rounded-full border border-[#e74c8c]/10" />
          <div className="relative mx-auto max-w-[1380px] md:flex md:items-end md:justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.25em] text-[#e74c8c]">O primeiro passo</p><h2 className="mt-5 max-w-2xl font-['Playfair_Display'] text-5xl leading-[1.02] md:text-7xl">Vamos encontrar<br /><i>o melhor para o seu pequeno?</i></h2></div><div className="mt-10 md:mt-0 md:w-80"><p className="text-sm leading-6 text-[#fdf8f5]/60">Conte-nos o que procura. A nossa equipa responde com tempo, atenção e as melhores opções.</p><button onClick={() => { window.open("https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20Eliora%20Infantil%20%26%20Maternidade%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.", "_blank"); setSent(true); }} className="mt-7 flex items-center gap-4 border-b border-[#e74c8c] pb-3 text-xs uppercase tracking-[.2em] text-[#fdf8f5]">{sent ? "Mensagem recebida" : "Falar com a equipa"} <ArrowRight size={15} /></button></div></div>
        </section>

        <footer className="mx-auto flex max-w-[1380px] flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-12"><Monogram /><p className="text-xs text-[#8e44ad]/60">Amor e carinho, em Angola e além.</p><div className="flex items-center gap-5 text-[#8e44ad]/60"><a href="https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20Eliora%20Infantil%20%26%20Maternidade%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">WhatsApp</a><span className="font-mono text-[10px] tracking-[.2em]">© {new Date().getFullYear()} ELIORA</span></div></footer>
      </div>
    </main>
  );
}
