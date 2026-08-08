import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import { StoreCard } from "@/components/StoreCard";
import { CategoryCard } from "@/components/CategoryCard";
import { PageTransition } from "@/components/PageTransition";
import { Link } from "wouter";

import { useQuery } from "@tanstack/react-query";
import { fetchStores, getCategories } from "@/lib/api";

const HERO_CATEGORIES = [
  { id: "moda", name: "Moda", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop&auto=format&q=75" },
  { id: "alimentacao", name: "Restaurantes", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=500&fit=crop&auto=format&q=75" },
  { id: "saude-beleza", name: "Beleza", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=500&fit=crop&auto=format&q=75" },
  { id: "eletronicos", name: "Eletrônicos", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=500&fit=crop&auto=format&q=75" },
];

const SLOT_POSITIONS = [
  { left: "0%",  bottom: "0%",  rotate: -8, scale: 0.85, zIndex: 10 },
  { left: "15%", bottom: "5%",  rotate: -3, scale: 0.92, zIndex: 20 },
  { left: "8%",  bottom: "10%", rotate: 3,  scale: 0.96, zIndex: 30 },
  { left: "12%", bottom: "15%", rotate: -1, scale: 1,    zIndex: 40 },
];

async function fetchStats(): Promise<{ totalStores: number; totalCategories: number }> {
  const res = await fetch("/api/stats");
  if (!res.ok) throw new Error("Erro ao buscar stats");
  return res.json();
}

export default function Home() {
  const [, setLocation] = useLocation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [frontIdx, setFrontIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setFrontIdx((prev) => (prev + 1) % HERO_CATEGORIES.length);
    }, 3000);
    return () => clearInterval(t);
  }, []);

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

  let featured = stores.filter((s) => s.isFeatured).slice(0, 4);
  if (featured.length === 0) featured = stores.slice(0, 4);

  const recent = stores.slice(0, 4);

  return (
    <PageTransition>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left — text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-light text-gray-900 leading-[1.1] tracking-tight mb-2">
                Apresenta-te com a dignidade
              </h1>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold bg-gradient-to-r from-[#D4A843] to-[#B8860B] bg-clip-text text-transparent leading-[1.1] tracking-tight mb-8">
                de quem carrega<br />a luz de Deus
              </h1>

              <Link href="/busca">
                <span className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 bg-gradient-to-r from-[#D4A843] to-[#B8860B] text-white text-sm font-semibold hover:from-[#C9963A] hover:to-[#A67C0A] transition-all rounded-2xl shadow-lg cursor-pointer">
                  <Search size={18} />
                  Buscar
                </span>
              </Link>

              <div className="flex items-center gap-6 mt-8 text-sm text-gray-500">
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

            {/* Right — stacked cards (auto-cycling) */}
            <div className="relative h-[400px] sm:h-[450px] lg:h-[500px] hidden sm:block">
              {[0, 1, 2].map((rank) => {
                const catIdx = (frontIdx + rank) % HERO_CATEGORIES.length;
                const cat = HERO_CATEGORIES[catIdx];
                const pos = SLOT_POSITIONS[rank];
                return (
                  <div
                    key={`${cat.id}-${rank}`}
                    onClick={() => setLocation(`/busca?categoria=${cat.id}`)}
                    className="absolute cursor-pointer shadow-2xl shadow-yellow-900/20 rounded-2xl overflow-hidden ring-2 ring-white/50 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
                    style={{
                      left: pos.left,
                      bottom: pos.bottom,
                      rotate: `${pos.rotate}deg`,
                      scale: `${pos.scale}`,
                      zIndex: pos.zIndex,
                      width: "min(65%, 280px)",
                    }}
                  >
                    <div className="relative aspect-[3/4]">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-5">
                        <span className="text-white text-sm font-semibold">{cat.name}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile — single auto-cycling image */}
            <div className="sm:hidden relative h-[250px]">
              <div
                key={HERO_CATEGORIES[frontIdx].id}
                onClick={() => setLocation(`/busca?categoria=${HERO_CATEGORIES[frontIdx].id}`)}
                className="relative rounded-2xl overflow-hidden shadow-xl cursor-pointer h-full transition-all duration-500"
              >
                <img
                  src={HERO_CATEGORIES[frontIdx].image}
                  alt={HERO_CATEGORIES[frontIdx].name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-5">
                  <span className="text-white text-sm font-semibold">{HERO_CATEGORIES[frontIdx].name}</span>
                </div>
              </div>
              {/* Dots indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-50">
                {HERO_CATEGORIES.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      i === frontIdx ? "bg-white w-4" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
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
