import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Search, ArrowRight, MapPin } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import { StoreCard } from "@/components/StoreCard";
import { CategoryCard } from "@/components/CategoryCard";
import { PageTransition } from "@/components/PageTransition";
import { Link } from "wouter";

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

  let featured = stores.filter((s) => s.isFeatured).slice(0, 4);
  if (featured.length === 0) featured = stores.slice(0, 4);

  const recent = stores.slice(0, 4);

  return (
    <PageTransition>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
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
