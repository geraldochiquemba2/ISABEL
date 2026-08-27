import { useState, useMemo, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ArrowDown, ArrowRight, ArrowUpRight, ChevronRight, Menu, X, Instagram, Mail, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

type ServiceGroup = {
  id?: string;
  number: string;
  title: string;
  intro: string;
  items: string[];
  category: string;
  image?: string | null;
};

interface Store {
  id: string;
  name: string;
  category: string;
  image?: string;
  coverImage?: string;
  coverImages?: string[];
  logoUrl?: string;
  description?: string;
  isOpen?: boolean;
  products?: any[];
}

interface ElioraWeddingsProps {
  onBackToSelector?: () => void;
}

const hardcodedGroups: ServiceGroup[] = [
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
  const [, navigate] = useLocation();
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
      onClick={() => navigate(`/loja/${store.id}?from=weddings`)}
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

function ServiceBlock({ group, index, stores, storeProducts, serviceStoreMap }: { group: ServiceGroup; index: number; stores: Store[]; storeProducts?: Record<string, string[]>; serviceStoreMap?: Map<string, string> }) {
  const [, navigate] = useLocation();
  return (
    <article className={`group border-t border-[#d1d4d8] py-4 md:py-8 ${index % 2 ? "md:ml-20" : ""}`}>
      <div className="grid gap-7 md:grid-cols-[100px_minmax(0,1fr)_minmax(260px,370px)] md:items-start">
        <span className="font-mono text-xs tracking-[0.2em] text-[#89919a]">{group.number}</span>
        <div>
          <h3 className="max-w-xl font-serif text-3xl leading-[1.08] text-[#30343a] md:text-[2.8rem]">{group.title}</h3>
          <p className="mt-4 max-w-md text-sm leading-7 text-[#686e76]">{group.intro}</p>
          <ul className="mt-6 space-y-3 border-l border-[#d7dade] pl-5 text-sm leading-5 text-[#565d66]">
            {group.items.map((item) => {
              const storeId = serviceStoreMap?.get(item);
              return (
                <li key={item}>
                  {storeId ? (
                    <a
                      href={`/loja/${storeId}?from=weddings&servico=${encodeURIComponent(item)}`}
                      onClick={(e) => { e.preventDefault(); navigate(`/loja/${storeId}?from=weddings&servico=${encodeURIComponent(item)}`); }}
                      className="flex gap-3 transition-transform duration-300 group-hover:translate-x-1 hover:text-[#30343a] cursor-pointer"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#aeb6bf]" />{item}
                    </a>
                  ) : (
                    <a
                      href={`/explorar?categoria=${group.category}&subcategoria=${encodeURIComponent(item)}`}
                      onClick={(e) => { e.preventDefault(); navigate(`/explorar?categoria=${group.category}&subcategoria=${encodeURIComponent(item)}`); }}
                      className="flex gap-3 transition-transform duration-300 group-hover:translate-x-1 hover:text-[#30343a] cursor-pointer"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#aeb6bf]" />{item}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
          <a
            href={`/explorar?categoria=${group.category}`}
            className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#68727c] hover:text-[#30343a] transition-colors"
          >
            Ver mais <ChevronRight size={14} />
          </a>
        </div>
        <div className="mt-4 md:mt-0">
          {group.image ? (
            <div className="relative overflow-hidden rounded-2xl border border-[#d1d4d8]">
              <img src={group.image} alt={group.title} className="w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#252a2f]/40 via-transparent to-transparent" />
              <p className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white drop-shadow">#{group.number}</p>
            </div>
          ) : (
            <>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#87909a] mb-3">Lojas recentes</p>
              {stores.length > 0 ? (
                <div>
                  <div className="flex flex-row flex-nowrap overflow-x-auto gap-3 scrollbar-hide">
                    {stores.slice(0, 4).map((store) => (
                      <StoreCard key={store.id} store={store} productImages={storeProducts?.[store.id]} />
                    ))}
                  </div>
                  {stores.length > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-2 md:hidden">
            <span className="text-[10px] text-[#c47a9b] font-medium">Deslize para ver mais</span>
            <ArrowRight size={12} className="text-[#c47a9b] animate-pulse" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#d1d4d8] p-6 text-center">
                  <p className="text-xs text-[#87909a]">Em breve novas lojas</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
}

function Monogram() {
  return (
    <div className="flex items-center gap-3">
      <img 
        src="/logo-yesola-icon-dark.png" className="w-20 h-20"
      />
      <span className="font-serif text-xl tracking-[0.08em] text-[#2d2c2b]">YESOLA <i className="font-normal">Casamentos</i></span>
    </div>
  );
}

export function ElioraWeddings({ onBackToSelector }: ElioraWeddingsProps) {
  useThemeColor("#c47a9b");
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
  const isLoggedIn = !!localUserStr;

  const { data: stores = [] } = useQuery({
    queryKey: ["stores", "weddings"],
    queryFn: async () => {
      const res = await fetch("/api/stores?store_type=weddings");
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60_000,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products", "weddings"],
    queryFn: async () => {
      const res = await fetch("/api/products?store_type=weddings");
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60_000,
  });

  const { data: dbGroups = [] } = useQuery({
    queryKey: ["wedding-groups"],
    queryFn: async () => {
      const res = await fetch("/api/wedding-groups");
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
    const storesWithProducts = stores.filter((s: Store) => allStoreIds.has(s.id));
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
    const allGroups = dbGroups.length > 0 ? dbGroups : hardcodedGroups;
    for (const group of allGroups) {
      const { stores: catStores } = getStoresForGroup(group.category);
      const catStoreIds = new Set(catStores.map((s: any) => s.id));
      for (const item of group.items) {
        if (!map.has(item)) {
          for (const p of products) {
            if (catStoreIds.has(p.storeId) && p.name.toLowerCase().includes(item.toLowerCase())) {
              map.set(item, p.storeId);
              break;
            }
          }
          if (!map.has(item) && catStores.length > 0) {
            map.set(item, catStores[0].id);
          }
        }
      }
    }
    return map;
  }, [dbGroups, stores, products]);

  const sortedGroups = (dbGroups.length > 0 ? dbGroups : [...hardcodedGroups]).sort((a: any, b: any) => {
    const storesA = getStoresForGroup(a.category).stores.length;
    const storesB = getStoresForGroup(b.category).stores.length;
    return storesB - storesA;
  });
  const groups = sortedGroups.map((g: any, i: number) => ({ ...g, number: String(i + 1).padStart(2, "0") }));

  return (
    <main className="min-h-[100dvh] overflow-x-hidden bg-[#fafafa] text-[#30343a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap');
        @keyframes rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}} .rise{animation:rise .8s ease both}.delay-1{animation-delay:.14s}.delay-2{animation-delay:.26s}
      `}</style>
      
      <header className="fixed top-0 left-0 right-0 z-50 mx-auto flex max-w-[1380px] items-center justify-between px-6 py-6 md:px-12 bg-[#fafafa]/90 backdrop-blur-md">
        <a className="flex items-center gap-3 no-underline" href="#top" aria-label="YESOLA Casamentos">
          <img
            src="/logo-yesola-icon-dark.png"
            alt="YESOLA"
            style={{ width: "39px", height: "39px", filter: "brightness(0) saturate(100%) invert(30%) sepia(20%) saturate(300%) hue-rotate(320deg) brightness(90%) contrast(85%)" }}
          />
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", letterSpacing: "-.02em", color: "#30343a" }}>YESOLA<small style={{ display: "block", color: "#E8A0BF", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: ".23em", fontSize: "8px", marginTop: "2px" }}>Casamentos</small></span>
        </a>
        <nav className={`${menuOpen ? "absolute left-0 right-0 top-full flex bg-[#fafafa] px-6 pb-7 shadow-sm" : "hidden"} flex-col gap-5 text-xs uppercase tracking-[0.18em] md:static md:flex md:flex-row md:items-center md:gap-9 md:bg-transparent md:p-0 md:shadow-none`}>
          <button onClick={() => scrollTo("servicos")} className="text-left transition-colors hover:text-[#77818c]">Serviços</button>
          <button onClick={() => scrollTo("essencia")} className="text-left transition-colors hover:text-[#77818c]">A nossa essência</button>
          <a href="/explorar" className="text-left transition-colors hover:text-[#77818c]">Explorar</a>
          {isLoggedIn ? (
            <>
              <a href="/dashboard-weddings" className="flex items-center gap-2 text-left text-[#2c3035] font-medium hover:text-[#30343a] transition-colors">Painel <ArrowUpRight size={14} /></a>
              <button onClick={() => { localStorage.removeItem("guialocal_user"); window.location.reload(); }} className="flex items-center gap-2 text-left text-[#68727c] hover:text-[#30343a] transition-colors">Sair</button>
            </>
          ) : (
            <a href="/login-weddings" className="flex items-center gap-2 text-left text-[#68727c] hover:text-[#30343a] transition-colors">Entrar <ArrowUpRight size={14} /></a>
          )}
          <a href="https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20YESOLA%20Casamentos%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-left text-[#68727c]">Falar com a YESOLA <ArrowUpRight size={14} /></a>
          {onBackToSelector && (
            <button onClick={onBackToSelector} className="flex items-center gap-2 text-left text-[#68727c] hover:text-[#30343a] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Trocar loja
            </button>
          )}
        </nav>
        <button aria-label="Abrir menu" onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">{menuOpen ? <X size={20} /> : <Menu size={21} />}</button>
      </header>

      <div>
        <div className="mx-auto max-w-[1380px] px-4 pt-[6.3rem] pb-1 md:px-12 md:pt-24 md:pb-2">
          <div ref={scrollRef} onScroll={handleScroll} className="flex flex-row flex-nowrap overflow-x-auto gap-2 scrollbar-hide pb-1">
            {groups.map((group) => (
              <a
                key={group.category}
                href={`/explorar?categoria=${group.category}`}
                onClick={(e) => { e.preventDefault(); navigate(`/explorar?categoria=${group.category}`); }}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-3 md:py-2 rounded-full border border-[#d1d4d8] bg-white hover:border-[#c9a84c] hover:bg-[#faf8f0] transition-all text-[11px] font-semibold text-[#68727c]"
              >
                <span className="font-mono text-[9px] text-[#aeb6bf]">{group.number}</span>
                {group.title.split("&")[0].trim()}
              </a>
            ))}
          </div>
          <div className="flex justify-center items-center gap-2 mt-1 md:hidden">
            {scrolledEnd ? (
              <span className="text-[10px] text-[#c9a84c] font-medium">Fim</span>
            ) : (
              <>
                <span className="text-[10px] text-[#c9a84c] font-medium">Deslize para ver mais</span>
                <ArrowRight size={12} className="text-[#c9a84c] animate-pulse" />
              </>
            )}
          </div>
        </div>

        <section id="servicos" className="mx-auto max-w-[1380px] px-6 pt-1 pb-4 md:px-12 md:pt-1 md:pb-4">
          <div>{groups.map((group, i) => {
            const { stores: groupStores, storeProducts } = getStoresForGroup(group.category);
            return <ServiceBlock key={group.id || group.number} group={group} index={i} stores={groupStores} storeProducts={storeProducts} serviceStoreMap={serviceStoreMap} />;
          })}</div>
        </section>

        <section id="contacto" className="relative overflow-hidden border-t border-[#cbd0d5] bg-[#2c3035] px-6 py-14 text-[#fafafa] md:px-12 md:py-20">
          <div className="absolute -right-16 -top-24 h-96 w-96 rounded-full border border-[#e4e7ea]/20" /><div className="absolute -right-4 -top-12 h-72 w-72 rounded-full border border-[#e4e7ea]/15" />
          <div className="relative mx-auto max-w-[1380px] md:flex md:items-end md:justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.25em] text-[#b9c1ca]">O primeiro passo</p><h2 className="mt-5 max-w-2xl font-serif text-5xl leading-[1.02] md:text-7xl">Vamos criar espaço<br /><i>para a vossa história?</i></h2></div><div className="mt-10 md:mt-0 md:w-80"><p className="text-sm leading-6 text-[#cbd0d5]">Contem-nos o que estão a imaginar. A nossa equipa responde com tempo, atenção e uma primeira ideia.</p><button onClick={() => { window.open("https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20YESOLA%20Casamentos%20e%20gostaria%20de%20marcar%20uma%20consulta.", "_blank"); setSent(true); }} className="mt-7 flex items-center gap-4 border-b border-[#b9c1ca] pb-3 text-xs uppercase tracking-[.2em] text-[#e3e7eb]">{sent ? "Mensagem recebida" : "Falar com a equipa"} <ChevronRight size={15} /></button></div></div>
        </section>

        <footer className="mx-auto flex max-w-[1380px] flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-12"><Monogram /><p className="text-xs text-[#747b84]">Celebrações com intenção, em Angola e além.</p><div className="flex items-center gap-5 text-[#747b84]"><a href="https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20YESOLA%20Casamentos%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><Mail size={16} /></a><a href="https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20YESOLA%20Casamentos%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><Phone size={16} /></a><span className="font-mono text-[10px] tracking-[.2em]">© YESOLA</span></div></footer>
      </div>
    </main>
  );
}

export default ElioraWeddings;