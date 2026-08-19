import { useState, useEffect, useRef } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocation } from "wouter";
import { ArrowDown, ArrowRight, ArrowUpRight, Mail, Phone, Instagram } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchStores, getCategories } from "@/lib/api";
import { Store } from "@/data/mock";

function SimpleStoreCard({ store }: { store: Store }) {
  const fallbackImage = "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop&auto=format&q=75";
  const images = store.coverImages && store.coverImages.length > 0
    ? store.coverImages
    : [store.coverImage || store.image || fallbackImage];
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
      className="flex-shrink-0 w-full rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow border border-[#e8eaed] cursor-pointer hover:-translate-y-1"
      onClick={() => window.location.href = `/loja/${store.id}`}
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={images[currentIdx] || fallbackImage}
          alt={store.name}
          className="w-full h-full object-cover"
        />
        {store.logoUrl && (
          <img
            src={store.logoUrl}
            alt={`Logo ${store.name}`}
            className="absolute top-2 left-2 w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm z-20"
          />
        )}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 z-20 flex gap-1">
            {images.slice(0, 5).map((_, i) => (
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
        <p className="text-[10px] text-[#87909a] mt-1">{store.category}</p>
        {store.province && store.municipality && (
          <p className="text-[10px] text-[#aeb6bf] mt-1">{store.municipality}, {store.province}</p>
        )}
      </div>
    </div>
  );
}

const FALLBACK_IMAGES: Record<string, string> = {
  moda: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=500&fit=crop&auto=format&q=75",
  eletronicos: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&h=500&fit=crop&auto=format&q=75",
  alimentacao: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=500&fit=crop&auto=format&q=75",
  "saude-beleza": "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=500&fit=crop&auto=format&q=75",
  "servicos-residenciais": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=500&fit=crop&auto=format&q=75",
  automotivo: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=500&fit=crop&auto=format&q=75",
  educacao: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=500&fit=crop&auto=format&q=75",
  pets: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=500&fit=crop&auto=format&q=75",
};

function Monogram() {
  return (
    <a className="flex items-center gap-3 no-underline" href="#top" aria-label="Eliora Collection">
      <img
        src="/logo-eliora-dark.svg"
        alt="Eliora"
        style={{ width: "39px", height: "39px", filter: "brightness(0) saturate(100%) invert(40%) sepia(40%) saturate(500%) hue-rotate(10deg) brightness(90%) contrast(85%)" }}
      />
      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", letterSpacing: "-.02em", color: "#2d2c2b" }}>Eliora<small style={{ display: "block", color: "#D4A843", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: ".23em", fontSize: "8px", marginTop: "2px" }}>Collection</small></span>
    </a>
  );
}

export default function Home({ onBackToSelector }: { onBackToSelector?: () => void } = {}) {
  useThemeColor("#2d2c2b");
  const [, setLocation] = useLocation();
  const [sent, setSent] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolledEnd, setScrolledEnd] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);

  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (el) {
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
      setScrolledEnd(atEnd);
    }
  };

  const { data: stores = [], isLoading: storesLoading } = useQuery({
    queryKey: ["stores"],
    queryFn: () => fetchStores(),
  });

  const { data: apiCategories = [], isLoading: catsLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const heroImages = apiCategories.length > 0
    ? apiCategories
        .filter((cat: any) => cat.cover_image || cat.coverImage || FALLBACK_IMAGES[cat.id])
        .slice(0, 8)
        .map((cat: any) => ({
          src: cat.cover_image || cat.coverImage || FALLBACK_IMAGES[cat.id] || FALLBACK_IMAGES["moda"],
          name: cat.name,
        }))
    : [
        { src: FALLBACK_IMAGES["moda"], name: "Moda" },
        { src: FALLBACK_IMAGES["alimentacao"], name: "Restaurantes" },
        { src: FALLBACK_IMAGES["saude-beleza"], name: "Beleza" },
        { src: FALLBACK_IMAGES["eletronicos"], name: "Eletrônicos" },
      ];

  useEffect(() => {
    if (heroImages.length < 2) return;
    const t = setInterval(() => setHeroIdx((p) => (p + 1) % heroImages.length), 3000);
    return () => clearInterval(t);
  }, [heroImages.length]);

  const hero = heroImages[heroIdx] || heroImages[0];

  const promoImage = "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop&auto=format&q=80";

  let featured = stores.filter((s) => s.isFeatured).slice(0, 4);
  if (featured.length === 0) featured = stores.slice(0, 4);
  const recent = stores.slice(0, 4);

  return (
    <main className="min-h-[100dvh] overflow-x-hidden bg-[#fafafa] text-[#30343a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap');
        .eliora-grain:after{content:"";position:fixed;inset:0;pointer-events:none;opacity:.035;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E")}
        @keyframes rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}} .rise{animation:rise .8s ease both}.delay-1{animation-delay:.14s}.delay-2{animation-delay:.26s}
        @keyframes heroFade{from{opacity:0;transform:scale(1.04)}to{opacity:1;transform:scale(1)}}
      `}</style>

      <div className="eliora-grain">
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#fafafa]/95 backdrop-blur-md border-b border-[#e8e8e8]/60">
          <div className="mx-auto flex max-w-[1380px] items-center justify-between px-6 py-5 md:px-12">
            <Monogram />
            <div className="hidden items-center gap-8 text-[13px] font-semibold text-[#68727c] md:flex">
              <button onClick={() => scrollTo("categorias")}>Explorar</button>
              {onBackToSelector && (
                <button onClick={onBackToSelector} className="flex items-center gap-2 text-[#68727c] hover:text-[#2d2c2b] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  Trocar loja
                </button>
              )}
            </div>
            <button className="rounded-lg p-2 md:hidden" onClick={() => {}} aria-label="Menu"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
          </div>
        </header>

        <div className="mx-auto max-w-[1380px] px-6 py-5 md:px-12">
          <div ref={scrollRef} onScroll={handleScroll} className="flex flex-row flex-nowrap overflow-x-auto gap-4 scrollbar-hide pb-4">
            {catsLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-full border border-[#d9dde1] bg-white animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                  <div className="w-16 h-3 rounded bg-gray-200" />
                </div>
              ))
            ) : apiCategories.slice(0, 10).map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => setLocation(`/busca?categoria=${cat.id}`)}
                className="flex-shrink-0 group flex items-center gap-3 px-5 py-3 rounded-full border border-[#d9dde1] bg-white hover:border-[#c9a84c] hover:bg-[#faf8f0] transition-all"
              >
                <img
                  src={cat.cover_image || cat.coverImage || FALLBACK_IMAGES[cat.id] || FALLBACK_IMAGES["moda"]}
                  alt={cat.name}
                  className="w-8 h-8 rounded-full object-cover"
                  style={{ filter: "grayscale(0.3) contrast(0.9) brightness(1.05)" }}
                />
                <span className="text-xs font-medium text-[#30343a] whitespace-nowrap">{cat.name}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-center items-center gap-2 mt-2 md:hidden">
            {scrolledEnd ? (
              <span className="text-xs text-[#87909a] font-medium">Fim</span>
            ) : (
              <>
                <span className="text-xs text-[#c9a84c] font-medium">Deslize para ver mais</span>
                <ArrowRight size={14} className="text-[#c9a84c] animate-pulse" />
              </>
            )}
          </div>
        </div>

        <section id="lojas" className="mx-auto max-w-[1380px] px-6 py-10 md:px-12 md:py-16">
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.25em] text-[#87909a]">O nosso universo</p>
              <h2 className="mt-4 font-serif text-5xl tracking-[-.03em] md:text-7xl">Tudo começa<br /><i>com o vosso estilo.</i></h2>
            </div>
            <a href="/busca" className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#68727c] hover:text-[#30343a] transition-colors">
              Ver todos <ArrowRight size={14} />
            </a>
          </div>

          {storesLoading ? (
            <div className="mb-8">
              <div className="w-40 h-3 rounded bg-gray-200 animate-pulse mb-5" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden bg-white border border-[#e8eaed] animate-pulse">
                    <div className="h-40 bg-gray-200" />
                    <div className="p-3 space-y-2">
                      <div className="w-3/4 h-3 rounded bg-gray-200" />
                      <div className="w-1/2 h-2 rounded bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : recent.length > 0 && (
            <div className="mb-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#87909a] mb-5">Adicionados recentemente</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                {recent.map((store, i) => (
                  <SimpleStoreCard key={store.id} store={store} />
                ))}
              </div>
            </div>
          )}

          <section className="mx-auto max-w-[1380px] py-5 grid md:grid-cols-[1fr_1fr] gap-10 items-center">
            <div>
              <p className="rise text-[10px] uppercase tracking-[0.28em] text-[#87909a]">Moda, acessórios e lifestyle · Luanda e além</p>
              <h1 className="rise delay-1 mt-8 max-w-3xl font-serif text-[clamp(2rem,7vw,4.3rem)] leading-[.94] tracking-normal text-[#252a2f] md:text-[5rem] md:tracking-[-.04em]">Estilo com<br /><i className="font-medium text-[#c9a84c]">dignidade.</i></h1>
              <p className="rise delay-2 mt-9 max-w-md text-base leading-7 text-[#6d737b]">Descubra peças, negócios e histórias de quem carrega a luz de Deus com elegância e propósito.</p>
              <button onClick={() => scrollTo("categorias")} className="rise delay-2 mt-9 flex items-center gap-4 border-b border-[#aeb6bf] pb-3 text-xs uppercase tracking-[0.2em] text-[#68727c] transition-all hover:gap-6">Explorar categorias <ArrowDown size={15} /></button>
            </div>
            <div className="group relative rounded-2xl overflow-hidden min-h-[300px]">
              <img
                src={promoImage}
                alt="Promoções"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                style={{ filter: "grayscale(0.3) contrast(0.9) brightness(1.05)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#252a2f]/80 via-[#252a2f]/30 to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-8">
                <p className="font-mono text-[10px] uppercase tracking-[.25em] text-white mb-3">Promoções</p>
                <div className="flex flex-col gap-3 max-w-sm">
                  <a href="/descobrir-estilo" className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/15 transition-all text-sm text-white">
                    <span>Quero descobrir o meu estilo</span>
                  </a>
                  <a href="/carrinhos" className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/15 transition-all text-sm text-white">
                    <span>Ver Carrinhos</span>
                  </a>
                  <a href="https://wa.me/244922001778?text=Ol%C3%A1!%20Gostaria%20de%20ajuda%20com%20dicas%20de%20estilo!" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/15 transition-all text-sm text-white">
                    <span>Conversar com um agente de envio</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {featured.length > 0 && (
            <div className="mt-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#87909a] mb-5">Em destaque</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                {featured.map((store, i) => (
                  <SimpleStoreCard key={store.id} store={store} />
                ))}
              </div>
            </div>
          )}
        </section>

        <section id="contacto" className="relative overflow-hidden border-t border-[#cbd0d5] bg-[#2c3035] px-6 py-24 text-[#fafafa] md:px-12 md:py-32">
          <div className="absolute -right-16 -top-24 h-96 w-96 rounded-full border border-[#e4e7ea]/20" /><div className="absolute -right-4 -top-12 h-72 w-72 rounded-full border border-[#e4e7ea]/15" />
          <div className="relative mx-auto max-w-[1380px] md:flex md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.25em] text-[#b9c1ca]">O primeiro passo</p>
              <h2 className="mt-5 max-w-2xl font-serif text-5xl leading-[1.02] md:text-7xl">Tem uma ideia<br /><i>em mente?</i></h2>
            </div>
            <div className="mt-10 md:mt-0 md:w-80">
              <p className="text-sm leading-6 text-[#cbd0d5]">Conte-nos o que estão a imaginar. A nossa equipa responde com tempo, atenção e uma primeira ideia.</p>
              <button onClick={() => { window.open("https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20Eliora%20Collection%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.", "_blank"); setSent(true); }} className="mt-7 flex items-center gap-4 border-b border-[#b9c1ca] pb-3 text-xs uppercase tracking-[.2em] text-[#e3e7eb]">{sent ? "Mensagem recebida" : "Falar com a equipa"} <ArrowRight size={15} /></button>
            </div>
          </div>
        </section>

        <footer className="mx-auto flex max-w-[1380px] flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-12">
          <Monogram />
          <p className="text-xs text-[#747b84]">Estilo e elegância, em Angola e além.</p>
          <div className="flex items-center gap-5 text-[#747b84]">
            <a href="https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20Eliora%20Collection%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><Mail size={16} /></a>
            <a href="https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20Eliora%20Collection%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><Phone size={16} /></a>
            <a href="#" aria-label="Instagram"><Instagram size={16} /></a>
            <span className="font-mono text-[10px] tracking-[.2em]">© 2024 ELIORA</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
