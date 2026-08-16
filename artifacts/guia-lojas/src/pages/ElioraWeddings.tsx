import { useState, useEffect } from "react";
import { ArrowDown, ArrowUpRight, ChevronRight, Menu, X, Instagram, Mail, Phone } from "lucide-react";
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

function ServiceBlock({ group, index, stores, storeProducts }: { group: ServiceGroup; index: number; stores: Store[]; storeProducts?: Record<string, string[]> }) {
  return (
    <article className={`group border-t border-[#d1d4d8] py-8 md:py-12 ${index % 2 ? "md:ml-20" : ""}`}>
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
                  className="flex gap-3 transition-transform duration-300 group-hover:translate-x-1 hover:text-[#30343a] cursor-pointer"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#aeb6bf]" />{item}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={`/explorar?categoria=${group.category}`}
            className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#68727c] hover:text-[#30343a] transition-colors"
          >
            Ver mais <ChevronRight size={14} />
          </a>
        </div>
        <div className="hidden md:block">
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
                <div className="flex flex-col gap-3">
                  {stores.slice(0, 2).map((store) => (
                    <StoreCard key={store.id} store={store} productImages={storeProducts?.[store.id]} />
                  ))}
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
        src="/logo-eliora-dark.svg" 
        alt="Eliora Weddings" 
        className="w-10 h-10"
      />
      <span className="font-serif text-xl tracking-[0.08em] text-[#2d2c2b]">Eliora <i className="font-normal">Weddings</i></span>
    </div>
  );
}

export function ElioraWeddings({ onBackToSelector }: ElioraWeddingsProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

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

  const groups = dbGroups.length > 0 ? dbGroups : hardcodedGroups;

  const getStoresForGroup = (category: string) => {
    const categoryProducts = products.filter((p: any) => p.category?.toLowerCase().includes(category.toLowerCase()));
    const storeIdsWithProducts = new Set(categoryProducts.map((p: any) => p.storeId));
    const storesWithProducts = stores.filter((s: Store) => storeIdsWithProducts.has(s.id));
    const storeProductsMap: Record<string, string[]> = {};
    categoryProducts.forEach((p: any) => {
      const imgs = (p.imageUrls && p.imageUrls.length > 0) ? p.imageUrls : (p.imageUrl ? [p.imageUrl] : []);
      if (!storeProductsMap[p.storeId]) storeProductsMap[p.storeId] = [];
      storeProductsMap[p.storeId].push(...imgs);
    });
    return { stores: storesWithProducts, storeProducts: storeProductsMap };
  };

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-[#fafafa] text-[#30343a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap');
        .eliora-grain:after{content:"";position:fixed;inset:0;pointer-events:none;opacity:.035;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E")}
        @keyframes rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}} .rise{animation:rise .8s ease both}.delay-1{animation-delay:.14s}.delay-2{animation-delay:.26s}
      `}</style>
      
      {onBackToSelector && (
        <button
          onClick={onBackToSelector}
          className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-3 bg-[#2c3035] text-white text-sm font-medium rounded-full shadow-lg hover:bg-[#1a1d20] transition-all hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Trocar loja
        </button>
      )}

      <div className="eliora-grain">
        <header className="relative z-20 mx-auto flex max-w-[1380px] items-center justify-between px-6 py-6 md:px-12">
          <Monogram />
          <nav className={`${menuOpen ? "absolute left-0 right-0 top-full flex bg-[#fafafa] px-6 pb-7 shadow-sm" : "hidden"} flex-col gap-5 text-xs uppercase tracking-[0.18em] md:static md:flex md:flex-row md:items-center md:gap-9 md:bg-transparent md:p-0 md:shadow-none`}>
            <button onClick={() => scrollTo("servicos")} className="text-left transition-colors hover:text-[#77818c]">Serviços</button>
            <button onClick={() => scrollTo("essencia")} className="text-left transition-colors hover:text-[#77818c]">A nossa essência</button>
            <a href="/explorar" className="text-left transition-colors hover:text-[#77818c]">Explorar</a>
            {isLoggedIn ? (
              <a href="/dashboard-weddings" className="flex items-center gap-2 text-left text-[#2c3035] font-medium hover:text-[#30343a] transition-colors">Painel <ArrowUpRight size={14} /></a>
            ) : (
              <a href="/login-weddings" className="flex items-center gap-2 text-left text-[#68727c] hover:text-[#30343a] transition-colors">Entrar <ArrowUpRight size={14} /></a>
            )}
            <button onClick={() => scrollTo("contacto")} className="flex items-center gap-2 text-left text-[#68727c]">Falar com a Eliora <ArrowUpRight size={14} /></button>
            {onBackToSelector && (
              <button onClick={onBackToSelector} className="flex items-center gap-2 text-left text-[#68727c] hover:text-[#30343a] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Trocar loja
              </button>
            )}
          </nav>
          <button aria-label="Abrir menu" onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">{menuOpen ? <X size={20} /> : <Menu size={21} />}</button>
        </header>

        <section className="relative mx-auto grid max-w-[1380px] items-center gap-14 px-6 pb-24 pt-14 md:grid-cols-[1.1fr_.9fr] md:px-12 md:pb-36 md:pt-20">
          <div className="relative z-10">
            <p className="rise text-[10px] uppercase tracking-[0.28em] text-[#87909a]">Concierge de celebrações · Luanda e além</p>
            <h1 className="rise delay-1 mt-8 max-w-3xl font-serif text-[4.3rem] leading-[.94] tracking-[-.04em] text-[#252a2f] md:text-[7.6rem]">O amor,<br /><i className="font-medium text-[#9aa2ab]">bem celebrado.</i></h1>
            <p className="rise delay-2 mt-9 max-w-md text-base leading-7 text-[#6d737b]">Bem-vindos à Eliora Weddings — onde cada promessa encontra o cuidado, a beleza e a calma para se tornar memória.</p>
            <button onClick={() => scrollTo("servicos")} className="rise delay-2 mt-9 flex items-center gap-4 border-b border-[#aeb6bf] pb-3 text-xs uppercase tracking-[0.2em] text-[#68727c] transition-all hover:gap-6">Descobrir os serviços <ArrowDown size={15} /></button>
          </div>
          <div className="relative mx-auto aspect-[.82] w-full max-w-[450px]">
            <div className="absolute inset-0 rotate-[-5deg] rounded-[48%_48%_4%_4%] border border-[#cbd0d5]" />
            <div className="absolute inset-[8%] rotate-[4deg] overflow-hidden rounded-[48%_48%_4%_4%] bg-[#e5e7e9]">
              <img
                src="/weddings/eliora-hero-couple.jpg"
                alt="Casal a celebrar uma ocasião especial"
                className="h-full w-full object-cover object-center"
                style={{ filter: "grayscale(0.78) contrast(0.88) brightness(1.08)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#56616b]/35 via-transparent to-white/20" />
              <div className="absolute left-[17%] top-[14%] h-20 w-12 rounded-full border border-white/70 opacity-70" />
            </div>
            <span className="absolute -bottom-4 -left-7 font-mono text-[10px] uppercase tracking-[.25em] text-[#858e98] md:-left-12">01 — Intenção & presença</span>
          </div>
        </section>

        <section id="essencia" className="border-y border-[#d9dde1] bg-[#eef0f2]">
          <div className="mx-auto grid max-w-[1380px] gap-10 px-6 py-16 md:grid-cols-[.75fr_1.25fr] md:px-12 md:py-24">
            <p className="font-mono text-[10px] uppercase tracking-[.25em] text-[#858e98]">A nossa essência</p>
            <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_220px] md:items-end">
              <div>
                <p className="max-w-3xl font-serif text-3xl leading-[1.2] text-[#34383d] md:text-5xl">Há uma diferença entre organizar um evento e <i>orquestrar uma experiência.</i></p>
                <p className="mt-8 max-w-xl text-sm leading-7 text-[#6c7279]">Na Eliora, cuidamos do que se vê e do que se sente. Reunimos pessoas, talentos e detalhes com discrição, para que possam viver o que realmente importa: estar juntos.</p>
              </div>
              <figure className="relative aspect-[.78] overflow-hidden border border-[#cbd0d5] bg-[#e6e8ea]">
                <img
                  src="/weddings/eliora-bridal-portrait.jpg"
                  alt="Retrato editorial de uma noiva"
                  className="h-full w-full object-cover object-center"
                  style={{ filter: "grayscale(0.64) contrast(0.9) brightness(1.06)" }}
                />
                <figcaption className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[.2em] text-white drop-shadow">02 — Beleza & presença</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section id="servicos" className="mx-auto max-w-[1380px] px-6 py-20 md:px-12 md:py-32">
          <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[.25em] text-[#87909a]">O nosso universo</p><h2 className="mt-4 font-serif text-5xl tracking-[-.03em] md:text-7xl">Tudo começa<br /><i>com vocês.</i></h2></div><p className="max-w-xs text-sm leading-6 text-[#747b84]">Uma rede de especialistas e experiências para os momentos que merecem mais.</p></div>
          <div className="mb-20 grid gap-4 md:grid-cols-[1.35fr_.65fr]">
            <figure className="group relative min-h-[280px] overflow-hidden bg-[#e4e7e9] md:min-h-[360px]">
              <img
                src="/weddings/eliora-reception.jpg"
                alt="Mesa de receção de casamento em branco e prata"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                style={{ filter: "grayscale(0.5) contrast(0.92) brightness(1.06)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#252a2f]/55 via-transparent to-transparent" />
              <figcaption className="absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-[.2em] text-white">03 — Espaço & celebração</figcaption>
            </figure>
            <figure className="group relative min-h-[280px] overflow-hidden bg-[#e4e7e9] md:min-h-[360px]">
              <img
                src="/weddings/eliora-florals.jpg"
                alt="Flores brancas numa mesa de casamento"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                style={{ filter: "grayscale(0.34) contrast(0.9) brightness(1.1)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#252a2f]/45 via-transparent to-transparent" />
              <figcaption className="absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-[.2em] text-white">04 — Detalhe & intenção</figcaption>
            </figure>
          </div>
          <div>{groups.map((group, i) => {
            const { stores: groupStores, storeProducts } = getStoresForGroup(group.category);
            return <ServiceBlock key={group.id || group.number} group={group} index={i} stores={groupStores} storeProducts={storeProducts} />;
          })}</div>
        </section>

        <section id="contacto" className="relative overflow-hidden border-t border-[#cbd0d5] bg-[#2c3035] px-6 py-24 text-[#fafafa] md:px-12 md:py-32">
          <div className="absolute -right-16 -top-24 h-96 w-96 rounded-full border border-[#e4e7ea]/20" /><div className="absolute -right-4 -top-12 h-72 w-72 rounded-full border border-[#e4e7ea]/15" />
          <div className="relative mx-auto max-w-[1380px] md:flex md:items-end md:justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.25em] text-[#b9c1ca]">O primeiro passo</p><h2 className="mt-5 max-w-2xl font-serif text-5xl leading-[1.02] md:text-7xl">Vamos criar espaço<br /><i>para a vossa história?</i></h2></div><div className="mt-10 md:mt-0 md:w-80"><p className="text-sm leading-6 text-[#cbd0d5]">Contem-nos o que estão a imaginar. A nossa equipa responde com tempo, atenção e uma primeira ideia.</p><button onClick={() => { window.open("https://wa.me/244922001778", "_blank"); setSent(true); }} className="mt-7 flex items-center gap-4 border-b border-[#b9c1ca] pb-3 text-xs uppercase tracking-[.2em] text-[#e3e7eb]">{sent ? "Mensagem recebida" : "Falar com a equipa"} <ChevronRight size={15} /></button></div></div>
        </section>

        <footer className="mx-auto flex max-w-[1380px] flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-12"><Monogram /><p className="text-xs text-[#747b84]">Celebrações com intenção, em Angola e além.</p><div className="flex items-center gap-5 text-[#747b84]"><a href="mailto:ola@elioraweddings.com" aria-label="Email"><Mail size={16} /></a><a href="tel:+244922001778" aria-label="Telefone"><Phone size={16} /></a><a href="#" aria-label="Instagram"><Instagram size={16} /></a><span className="font-mono text-[10px] tracking-[.2em]">© 2024 ELIORA</span></div></footer>
      </div>
    </main>
  );
}

export default ElioraWeddings;