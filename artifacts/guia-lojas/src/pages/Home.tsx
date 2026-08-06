import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, MapPin } from "lucide-react";
import { STORES } from "@/data/mock";
import { useFavorites } from "@/lib/favorites";
import { StoreCard } from "@/components/StoreCard";
import { CategoryCard } from "@/components/CategoryCard";
import { PageTransition } from "@/components/PageTransition";
import { Link } from "wouter";

const FALLBACK_HERO = [
  { src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=700&fit=crop&auto=format&q=85", label: "Moda" },
  { src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=700&fit=crop&auto=format&q=85", label: "Restaurantes" },
  { src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=700&fit=crop&auto=format&q=85", label: "Beleza" },
  { src: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=700&fit=crop&auto=format&q=85", label: "Eletrônicos" },
  { src: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=700&fit=crop&auto=format&q=85", label: "Automotivo" },
  { src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=700&fit=crop&auto=format&q=85", label: "Educação" },
];

import { useQuery } from "@tanstack/react-query";
import { fetchStores, getCategories } from "@/lib/api";

async function fetchStats(): Promise<{ totalStores: number; totalCategories: number }> {
  const res = await fetch("/api/stats");
  if (!res.ok) throw new Error("Erro ao buscar stats");
  return res.json();
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Hero cards cycling through all categories
  const [frontIdx, setFrontIdx] = useState(2);

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ["stores"],
    queryFn: () => fetchStores(),
  });

  const { data: apiCategories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
    staleTime: 60_000,
  });

  const totalStores = stats?.totalStores ?? stores.length;
  const totalCategories = stats?.totalCategories ?? apiCategories.length;

  // Build hero items from all API categories (with fallback)
  const heroItems: { src: string; label: string }[] = apiCategories.length >= 2
    ? apiCategories
        .filter((cat: any) => cat.cover_image || cat.coverImage)
        .map((cat: any) => ({ src: cat.cover_image || cat.coverImage, label: cat.name }))
    : FALLBACK_HERO;
  const heroN = heroItems.length || 1;

  // Auto-cycle through all heroItems
  useEffect(() => {
    if (heroN < 2) return;
    const t = setInterval(() => {
      setFrontIdx((prev) => (prev + 1) % heroN);
    }, 2800);
    return () => clearInterval(t);
  }, [heroN]);

  // Derive the 3 visible slots: back, mid, front
  const POSITIONS = [
    { x: "8%",  y: "10%", rotate: -6, scale: 0.82, zIndex: 10 },
    { x: "22%", y: "4%",  rotate:  3, scale: 0.90, zIndex: 20 },
    { x: "14%", y: "0%",  rotate: -1, scale: 1.00, zIndex: 30 },
  ];
  const visibleSlots = [
    { catIdx: (frontIdx - 2 + heroN) % heroN, rank: 0 },
    { catIdx: (frontIdx - 1 + heroN) % heroN, rank: 1 },
    { catIdx: frontIdx,                        rank: 2 },
  ];

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setLocation(`/busca?q=${encodeURIComponent(query.trim())}`);
    } else {
      setLocation("/busca");
    }
  }

  let featured = stores.filter((s) => s.isFeatured).slice(0, 4);
  if (featured.length === 0) featured = stores.slice(0, 4);

  let trending = stores.filter((s) => s.isTrending).slice(0, 4);
  if (trending.length === 0 && stores.length > 4) trending = stores.slice(4, 8);

  const recent = stores.slice(0, 4);

  return (
    <PageTransition>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-amber-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRkY4ODAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0zMHY2aDZ2LTZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="grid grid-cols-[1.2fr_1fr] lg:grid-cols-2 gap-0 min-h-[400px] lg:min-h-[540px] items-center">

            {/* Left — text + search */}
            <div className="py-16 lg:py-24 pr-0 lg:pr-12 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 bg-yellow-100/80 text-yellow-700 text-xs font-semibold px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
                  <MapPin size={13} />
                  Lojas e serviços perto de você
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-light text-gray-900 leading-[1.1] tracking-tight mb-2">
                  Apresenta-te com a dignidade
                </h1>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold bg-gradient-to-r from-[#D4A843] to-[#B8860B] bg-clip-text text-transparent leading-[1.1] tracking-tight mb-8">
                  de quem carrega<br />a luz de Deus
                </h1>

                <form
                  onSubmit={handleSearch}
                  className="flex gap-0 max-w-md bg-white rounded-2xl overflow-hidden shadow-lg shadow-yellow-100/50 focus-within:shadow-xl focus-within:shadow-yellow-200/50 transition-all border border-yellow-100"
                >
                  <div className="flex-1 relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400" />
                    <input
                      data-testid="input-search-hero"
                      placeholder="Lojas, serviços, produtos..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 text-sm bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <button
                    type="submit"
                    data-testid="button-search-hero"
                    className="px-7 py-4 bg-gradient-to-r from-[#D4A843] to-[#B8860B] text-white text-sm font-semibold hover:from-[#C9963A] hover:to-[#A67C0A] transition-all"
                  >
                    Buscar
                  </button>
                </form>

                <div className="flex flex-wrap items-center gap-2 mt-5">
                  {apiCategories.slice(0, 4).map((cat: any) => (
                    <button
                      key={cat.id}
                      onClick={() => setLocation(`/busca?q=${encodeURIComponent(cat.name)}`)}
                      className="text-xs text-gray-600 border border-gray-200 rounded-full px-4 py-2 hover:border-yellow-300 hover:text-yellow-700 hover:bg-yellow-50 transition-all bg-white"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right — image collage */}
            <div className="flex items-center justify-center relative h-[380px] sm:h-[450px] lg:h-[540px] mt-0">
              <AnimatePresence>
              {visibleSlots.map(({ catIdx, rank }) => {
                const img = heroItems[catIdx];
                const pos = POSITIONS[rank];
                return (
                  <motion.div
                    key={catIdx}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{
                      opacity: 1,
                      left: pos.x,
                      top: pos.y,
                      rotate: pos.rotate,
                      scale: pos.scale,
                      zIndex: pos.zIndex,
                    }}
                    exit={{ opacity: 0, scale: 0.75 }}
                    transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                    onClick={() => setFrontIdx(catIdx)}
                    className="absolute cursor-pointer shadow-2xl shadow-yellow-900/20"
                    style={{ width: "min(70%, 320px)" }}
                  >
                    <div className="relative overflow-hidden rounded-3xl aspect-[3/4] ring-4 ring-white/50">
                      <img
                        src={img.src}
                        alt={img.label}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-5">
                        <span className="text-white text-sm font-semibold">{img.label}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="absolute bottom-6 lg:bottom-16 left-0 lg:left-4 z-40 bg-white rounded-2xl shadow-xl px-3 lg:px-5 py-3 lg:py-4 flex items-center gap-3 scale-75 lg:scale-100 origin-bottom-left"
              >
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center text-white text-sm lg:text-base font-bold shadow-lg shadow-emerald-200">
                  +
                </div>
                <div>
                  <p className="text-sm lg:text-base font-bold text-gray-900">{totalStores.toLocaleString("pt-AO")} negócios</p>
                  <p className="text-[10px] lg:text-xs text-gray-500">cadastrados</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.75, duration: 0.4 }}
                className="absolute top-6 lg:top-12 right-0 lg:right-2 z-40 bg-white rounded-2xl shadow-xl px-3 lg:px-5 py-3 lg:py-4 scale-75 lg:scale-100 origin-top-right"
              >
                <p className="text-sm lg:text-base font-bold text-gray-900">{totalCategories} categorias</p>
                <p className="text-[10px] lg:text-xs text-gray-500">para explorar</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="border-y border-yellow-100 bg-gradient-to-b from-white to-yellow-50/30 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-yellow-600 mb-4">Categorias</p>
          <div className="flex overflow-x-auto scrollbar-hide gap-3 -mx-4 px-4 sm:-mx-6 sm:px-6">
            {apiCategories.map((cat: any, i: number) => {
              const count = stores.filter(s => s.category?.toLowerCase() === cat.name.toLowerCase()).length;
              return (
                <CategoryCard
                  key={cat.id}
                  category={{ ...cat, count }}
                  index={i}
                  onClick={() => setLocation(`/busca?categoria=${cat.id}`)}
                />
              );
            })}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── FEATURED ── */}
        <section className="py-14">
          <SectionHeader title="Em destaque" href="/busca" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-6">
            {featured.map((store, i) => (
              <StoreCard
                key={store.id}
                store={store}
                isFavorite={isFavorite(store.id)}
                onToggleFavorite={toggleFavorite}
                index={i}
              />
            ))}
          </div>
        </section>

        {/* ── BANNER CTA ── */}
        <section className="py-10">
          <div className="grid sm:grid-cols-2 gap-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl min-h-[240px] group"
            >
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop&auto=format&q=80"
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 to-gray-900/50" />
              <div className="relative z-10 p-8 flex flex-col justify-between h-full min-h-[240px]">
                <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">Para lojistas</span>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                    Cadastre sua<br />loja grátis
                  </h3>
                  <Link href="/dashboard">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/15 hover:bg-white/25 px-5 py-2.5 rounded-full backdrop-blur-sm transition-all" data-testid="button-cta-register">
                      Começar agora <ArrowRight size={14} />
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl min-h-[240px] group"
            >
              <img
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=400&fit=crop&auto=format&q=80"
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 to-pink-600/80" />
              <div className="relative z-10 p-8 flex flex-col justify-between h-full min-h-[240px]">
                <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">Descubra o teu estilo</span>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                    Quero descobrir<br />o meu estilo
                  </h3>
                  <Link href="/descobrir-estilo">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/15 hover:bg-white/25 px-5 py-2.5 rounded-full backdrop-blur-sm transition-all">
                      Fazer quiz <ArrowRight size={14} />
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── TRENDING ── */}
        <section className="py-10">
          <SectionHeader title="Mais buscados" href="/busca" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-6">
            {trending.map((store, i) => (
              <StoreCard
                key={store.id}
                store={store}
                isFavorite={isFavorite(store.id)}
                onToggleFavorite={toggleFavorite}
                index={i}
              />
            ))}
          </div>
        </section>

        {/* ── EM PROMOÇÃO ── */}
        <section className="py-10">
          <SectionHeader title="Em promoção" href="/busca" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-6">
            {stores.filter(s => s.isFeatured || s.isTrending).slice(0, 4).map((store, i) => (
              <StoreCard
                key={store.id}
                store={store}
                isFavorite={isFavorite(store.id)}
                onToggleFavorite={toggleFavorite}
                index={i}
              />
            ))}
            {stores.filter(s => s.isFeatured || s.isTrending).length === 0 && (
              <p className="col-span-full text-sm text-gray-400 py-12 text-center">
                Nenhuma promoção disponível no momento.
              </p>
            )}
          </div>
        </section>

        {/* ── RECENT ── */}
        <section className="py-10">
          <SectionHeader title="Adicionados recentemente" href="/busca" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-6">
            {recent.map((store, i) => (
              <StoreCard
                key={store.id}
                store={store}
                isFavorite={isFavorite(store.id)}
                onToggleFavorite={toggleFavorite}
                index={i}
                size="sm"
              />
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img 
                src="/logo-eliora.svg" 
                alt="Eliora Collection" 
                className="w-10 h-10"
              />
              <div>
                <span className="text-lg font-bold">Eliora<span className="font-light opacity-80">Collection</span></span>
                <p className="text-gray-400 text-xs mt-0.5">Lojas e serviços perto de você</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm">© 2024 Eliora Collection. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </PageTransition>
  );
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <Link href={href}>
        <span className="text-sm text-yellow-600 hover:text-yellow-700 font-medium transition-colors flex items-center gap-1">
          Ver todos <ArrowRight size={14} />
        </span>
      </Link>
    </div>
  );
}
