import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import { StoreCard } from "@/components/StoreCard";
import { CategoryCard } from "@/components/CategoryCard";
import { PageTransition } from "@/components/PageTransition";
import { Link } from "wouter";

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

const POSITIONS = [
  { x: "0%",  y: "15%", rotate: -6, scale: 0.82, zIndex: 10 },
  { x: "15%", y: "8%",  rotate:  3, scale: 0.90, zIndex: 20 },
  { x: "8%",  y: "0%",  rotate: -1, scale: 1.00, zIndex: 30 },
];

async function fetchStats(): Promise<{ totalStores: number; totalCategories: number }> {
  const res = await fetch("/api/stats");
  if (!res.ok) throw new Error("Erro ao buscar stats");
  return res.json();
}

export default function Home() {
  const [, setLocation] = useLocation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [frontIdx, setFrontIdx] = useState(2);

  const { data: stores = [] } = useQuery({
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

  const heroItems: { id: string; name: string; image: string }[] = apiCategories.length > 0
    ? apiCategories
        .filter((cat: any) => cat.cover_image || cat.coverImage || FALLBACK_IMAGES[cat.id])
        .slice(0, 8)
        .map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          image: cat.cover_image || cat.coverImage || FALLBACK_IMAGES[cat.id] || FALLBACK_IMAGES["moda"],
        }))
    : [
        { id: "moda", name: "Moda", image: FALLBACK_IMAGES["moda"] },
        { id: "alimentacao", name: "Restaurantes", image: FALLBACK_IMAGES["alimentacao"] },
        { id: "saude-beleza", name: "Beleza", image: FALLBACK_IMAGES["saude-beleza"] },
        { id: "eletronicos", name: "Eletrônicos", image: FALLBACK_IMAGES["eletronicos"] },
      ];

  const heroN = heroItems.length || 1;

  useEffect(() => {
    if (heroN < 2) return;
    const t = setInterval(() => {
      setFrontIdx((prev) => (prev + 1) % heroN);
    }, 3500);
    return () => clearInterval(t);
  }, [heroN]);

  const visibleSlots = [
    { catIdx: (frontIdx - 2 + heroN) % heroN, rank: 0 },
    { catIdx: (frontIdx - 1 + heroN) % heroN, rank: 1 },
    { catIdx: frontIdx,                        rank: 2 },
  ];

  let featured = stores.filter((s) => s.isFeatured).slice(0, 4);
  if (featured.length === 0) featured = stores.slice(0, 4);

  const recent = stores.slice(0, 4);

  return (
    <PageTransition>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24">
          <div className="grid grid-cols-2 gap-4 sm:gap-10 items-center">
            {/* Left — text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-2xl sm:text-4xl lg:text-[3.5rem] font-light text-gray-900 leading-[1.1] tracking-tight mb-1 sm:mb-2">
                Apresenta-te com a dignidade
              </h1>
              <h1 className="text-2xl sm:text-4xl lg:text-[3.5rem] font-bold bg-gradient-to-r from-[#D4A843] to-[#B8860B] bg-clip-text text-transparent leading-[1.1] tracking-tight mb-4 sm:mb-8">
                de quem carrega<br />a luz de Deus
              </h1>

              <Link href="/busca">
                <span className="inline-flex items-center gap-2 px-5 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-[#D4A843] to-[#B8860B] text-white text-xs sm:text-sm font-semibold hover:from-[#C9963A] hover:to-[#A67C0A] transition-all rounded-2xl shadow-lg cursor-pointer">
                  <Search size={16} />
                  Buscar
                </span>
              </Link>

              <div className="flex items-center gap-4 sm:gap-6 mt-5 sm:mt-8 text-xs sm:text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  {totalStores.toLocaleString("pt-AO")} negócios
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                  {totalCategories} categorias
                </span>
              </div>
            </motion.div>

            {/* Right — animated image collage */}
            <div className="flex items-center justify-center relative h-[300px] sm:h-[450px] lg:h-[540px] mt-8 lg:mt-0">
              <AnimatePresence>
              {visibleSlots.map(({ catIdx, rank }) => {
                const img = heroItems[catIdx];
                if (!img) return null;
                const pos = POSITIONS[rank];
                return (
                  <motion.div
                    key={`${img.id}-${catIdx}`}
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                    animate={{
                      opacity: 1,
                      left: pos.x,
                      top: pos.y,
                      rotate: pos.rotate,
                      scale: pos.scale,
                      zIndex: pos.zIndex,
                      filter: "blur(0px)",
                    }}
                    exit={{ opacity: 0, scale: 0.85, filter: "blur(4px)" }}
                    transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                    onClick={() => setFrontIdx(catIdx)}
                    className="absolute cursor-pointer shadow-2xl shadow-yellow-900/20"
                    style={{ width: "min(60%, 240px)" }}
                  >
                    <div className="relative overflow-hidden rounded-3xl aspect-[3/4] ring-4 ring-white/50 transition-shadow duration-500 hover:shadow-3xl">
                      <img
                        src={img.image}
                        alt={img.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-5">
                        <span className="text-white text-sm font-semibold">{img.name}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="border-y border-yellow-100 bg-gradient-to-b from-white to-yellow-50/30 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-yellow-600 mb-4">Categorias</p>
          <div className="flex overflow-x-auto scrollbar-hide gap-3 -mx-4 px-4 sm:-mx-6 sm:px-6">
            {apiCategories
              .map((cat: any) => ({
                ...cat,
                count: stores.filter(s => s.category?.toLowerCase() === cat.name.toLowerCase()).length,
              }))
              .sort((a: any, b: any) => b.count - a.count)
              .map((cat: any, i: number) => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  index={i}
                  onClick={() => setLocation(`/busca?categoria=${cat.id}`)}
                />
              ))}
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
                loading="lazy"
              />
              <div>
                <span className="text-lg font-bold">Eliora<span className="font-light opacity-80">Collection</span></span>
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
