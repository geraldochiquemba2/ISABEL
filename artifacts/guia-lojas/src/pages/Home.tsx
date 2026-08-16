import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowDown, ArrowRight, Mail, Phone, Instagram } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import { StoreCard } from "@/components/StoreCard";
import { useQuery } from "@tanstack/react-query";
import { fetchStores, getCategories } from "@/lib/api";

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
    <div className="flex items-center gap-3">
      <img src="/logo-eliora-dark.svg" alt="Eliora Collection" className="w-10 h-10" />
      <span className="font-serif text-xl tracking-[0.08em] text-[#2d2c2b]">Eliora <i className="font-normal">Collection</i></span>
    </div>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [sent, setSent] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);

  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  const { data: stores = [] } = useQuery({
    queryKey: ["stores"],
    queryFn: () => fetchStores(),
  });

  const { data: apiCategories = [] } = useQuery({
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
    const t = setInterval(() => setHeroIdx((p) => (p + 1) % heroImages.length), 3500);
    return () => clearInterval(t);
  }, [heroImages.length]);

  const hero = heroImages[heroIdx] || heroImages[0];

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
        <section className="relative mx-auto grid max-w-[1380px] items-center gap-14 px-6 pb-24 pt-14 md:grid-cols-[1.1fr_.9fr] md:px-12 md:pb-36 md:pt-20">
          <div className="relative z-10">
            <p className="rise text-[10px] uppercase tracking-[0.28em] text-[#87909a]">Moda, acessórios e lifestyle · Luanda e além</p>
            <h1 className="rise delay-1 mt-8 max-w-3xl font-serif text-[4.3rem] leading-[.94] tracking-[-.04em] text-[#252a2f] md:text-[7.6rem]">Estilo com<br /><i className="font-medium text-[#c9a84c]">dignidade.</i></h1>
            <p className="rise delay-2 mt-9 max-w-md text-base leading-7 text-[#6d737b]">Descubra peças, negócios e histórias de quem carrega a luz de Deus com elegância e propósito.</p>
            <button onClick={() => scrollTo("categorias")} className="rise delay-2 mt-9 flex items-center gap-4 border-b border-[#aeb6bf] pb-3 text-xs uppercase tracking-[0.2em] text-[#68727c] transition-all hover:gap-6">Explorar categorias <ArrowDown size={15} /></button>
          </div>
          <div className="relative mx-auto aspect-[.82] w-full max-w-[450px]">
            <div className="absolute inset-0 rotate-[-5deg] rounded-[48%_48%_4%_4%] border border-[#cbd0d5]" />
            <div className="absolute inset-[8%] rotate-[4deg] overflow-hidden rounded-[48%_48%_4%_4%] bg-[#e5e7e9]">
              <img
                key={heroIdx}
                src={hero.src}
                alt={hero.name}
                className="h-full w-full object-cover object-center"
                style={{ filter: "grayscale(0.4) contrast(0.9) brightness(1.05)", animation: "heroFade 0.8s ease both" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#252a2f]/50 via-transparent to-white/10" />
              <span className="absolute bottom-5 left-5 font-serif text-xl text-white drop-shadow-lg" style={{ animation: "heroFade 0.8s ease both" }}>{hero.name}</span>
            </div>
            <span className="absolute -bottom-4 -left-7 font-mono text-[10px] uppercase tracking-[.25em] text-[#858e98] md:-left-12">01 — {hero.name}</span>
          </div>
        </section>

        <section className="mx-auto max-w-[1380px] px-6 py-10 md:px-12">
          <div className="group relative rounded-2xl overflow-hidden min-h-[300px]">
            <img
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop&auto=format&q=80"
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

        <div className="mx-auto max-w-[1380px] px-6 py-10 md:px-12">
          <div className="flex flex-row flex-nowrap overflow-x-auto gap-4 scrollbar-hide pb-4">
            {apiCategories.slice(0, 10).map((cat: any) => (
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
        </div>

        <section id="lojas" className="mx-auto max-w-[1380px] px-6 py-20 md:px-12 md:py-32">
          <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.25em] text-[#87909a]">O nosso universo</p>
              <h2 className="mt-4 font-serif text-5xl tracking-[-.03em] md:text-7xl">Tudo começa<br /><i>com o vosso estilo.</i></h2>
            </div>
            <a href="/busca" className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#68727c] hover:text-[#30343a] transition-colors">
              Ver todos <ArrowRight size={14} />
            </a>
          </div>

          {featured.length > 0 && (
            <div className="mb-16">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#87909a] mb-5">Em destaque</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                {featured.map((store, i) => (
                  <StoreCard key={store.id} store={store} isFavorite={isFavorite(store.id)} onToggleFavorite={toggleFavorite} index={i} />
                ))}
              </div>
            </div>
          )}

          {recent.length > 0 && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#87909a] mb-5">Recentes</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                {recent.map((store, i) => (
                  <StoreCard key={store.id} store={store} isFavorite={isFavorite(store.id)} onToggleFavorite={toggleFavorite} index={i} />
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
              <button onClick={() => { window.open("https://wa.me/244922001778", "_blank"); setSent(true); }} className="mt-7 flex items-center gap-4 border-b border-[#b9c1ca] pb-3 text-xs uppercase tracking-[.2em] text-[#e3e7eb]">{sent ? "Mensagem recebida" : "Falar com a equipa"} <ArrowRight size={15} /></button>
            </div>
          </div>
        </section>

        <footer className="mx-auto flex max-w-[1380px] flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-12">
          <Monogram />
          <p className="text-xs text-[#747b84]">Estilo e elegância, em Angola e além.</p>
          <div className="flex items-center gap-5 text-[#747b84]">
            <a href="mailto:ola@elioracollection.com" aria-label="Email"><Mail size={16} /></a>
            <a href="tel:+244922001778" aria-label="Telefone"><Phone size={16} /></a>
            <a href="#" aria-label="Instagram"><Instagram size={16} /></a>
            <span className="font-mono text-[10px] tracking-[.2em]">© 2024 ELIORA</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
