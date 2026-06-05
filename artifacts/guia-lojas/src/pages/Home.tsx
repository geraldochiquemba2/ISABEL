import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Search, ArrowRight, MapPin } from "lucide-react";
import { STORES } from "@/data/mock";
import { useFavorites } from "@/lib/favorites";
import { StoreCard } from "@/components/StoreCard";
import { CategoryCard } from "@/components/CategoryCard";
import { PageTransition } from "@/components/PageTransition";
import { Link } from "wouter";

const HERO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=700&fit=crop&auto=format&q=85",
    label: "Moda",
    rotate: "rotate-2",
  },
  {
    src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=700&fit=crop&auto=format&q=85",
    label: "Restaurantes",
    rotate: "-rotate-1",
  },
  {
    src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=700&fit=crop&auto=format&q=85",
    label: "Beleza",
    rotate: "rotate-1",
  },
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
  const [activeHero, setActiveHero] = useState(0);

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
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-[1.2fr_1fr] lg:grid-cols-2 gap-0 min-h-[380px] lg:min-h-[520px] items-center relative">

            {/* Left — text + search */}
            <div className="py-14 lg:py-20 pr-0 lg:pr-12 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-1.5 bg-muted text-muted-foreground text-xs font-medium px-3 py-1.5 rounded-full mb-6">
                  <MapPin size={11} />
                  Lojas e serviços perto de você
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-foreground leading-[1.1] tracking-tight mb-1 sm:mb-2">
                  Descubra o
                </h1>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-[1.1] tracking-tight mb-6 sm:mb-8">
                  melhor da<br />sua zona
                </h1>

                <form
                  onSubmit={handleSearch}
                  className="flex gap-0 max-w-md border border-border rounded-full overflow-hidden shadow-sm focus-within:shadow-md focus-within:border-foreground/30 transition-all bg-white"
                >
                  <div className="flex-1 relative">
                    <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      data-testid="input-search-hero"
                      placeholder="Lojas, serviços, produtos..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3.5 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <button
                    type="submit"
                    data-testid="button-search-hero"
                    className="px-6 py-3.5 bg-foreground text-background text-sm font-medium hover:opacity-80 transition-opacity"
                  >
                    Buscar
                  </button>
                </form>

                <div className="flex flex-wrap items-center gap-2 mt-4">
                  {["Salão de beleza", "Encanador", "Eletrônicos", "Restaurante"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setLocation(`/busca?q=${encodeURIComponent(s)}`)}
                      className="text-xs text-muted-foreground border border-border rounded-full px-3 py-1.5 hover:border-foreground hover:text-foreground transition-colors bg-white"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right — image collage */}
            <div className="flex items-center justify-center relative h-[300px] sm:h-[450px] lg:h-[520px] mt-0">
              {HERO_IMAGES.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.12 }}
                  onClick={() => setActiveHero(i)}
                  className={`absolute cursor-pointer transition-all duration-300 ${img.rotate} ${
                    activeHero === i
                      ? "z-30 scale-105 shadow-2xl"
                      : "z-10 hover:z-20 hover:scale-[1.02] shadow-lg"
                  }`}
                  style={{
                    left: `${10 + i * 22}%`,
                    top: `${6 + (i % 2) * 8}%`,
                    width: "52%",
                  }}
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-[3/4]">
                    <img
                      src={img.src}
                      alt={img.label}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <span className="text-white text-xs font-semibold">{img.label}</span>
                    </div>
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="absolute bottom-4 lg:bottom-16 left-0 lg:left-4 z-40 bg-white rounded-xl lg:rounded-2xl shadow-lg px-2 lg:px-4 py-2 lg:py-3 flex items-center gap-2 lg:gap-3 scale-75 lg:scale-100 origin-bottom-left"
              >
                <div className="w-6 h-6 lg:w-9 lg:h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-[10px] lg:text-xs font-bold">+</div>
                <div>
                  <p className="text-xs lg:text-sm font-semibold text-foreground">{totalStores.toLocaleString("pt-AO")} negócios</p>
                  <p className="text-[10px] lg:text-xs text-muted-foreground">cadastrados</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.75, duration: 0.4 }}
                className="absolute top-4 lg:top-12 right-0 lg:right-2 z-40 bg-white rounded-xl lg:rounded-2xl shadow-lg px-2 lg:px-4 py-2 lg:py-3 scale-75 lg:scale-100 origin-top-right"
              >
                <p className="text-xs lg:text-sm font-semibold text-foreground">{totalCategories} categorias</p>
                <p className="text-[10px] lg:text-xs text-muted-foreground">para explorar</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="border-y border-border bg-white py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">Categorias</p>
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
        <section className="py-12">
          <SectionHeader title="Em destaque" href="/busca" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
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

        <div className="border-t border-border" />

        {/* ── BANNER CTA ── */}
        <section className="py-10">
          <div className="grid sm:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-2xl min-h-[200px]"
            >
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop&auto=format&q=80"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/55" />
              <div className="relative z-10 p-8 flex flex-col justify-between h-full min-h-[200px]">
                <p className="text-white/60 text-xs font-medium uppercase tracking-widest">Para lojistas</p>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4 leading-snug">
                    Cadastre sua<br />loja grátis
                  </h3>
                  <Link href="/dashboard">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white hover:opacity-70 transition-opacity" data-testid="button-cta-register">
                      Começar agora <ArrowRight size={14} />
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-2xl min-h-[200px]"
            >
              <img
                src="https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800&h=400&fit=crop&auto=format&q=80"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/45" />
              <div className="relative z-10 p-8 flex flex-col justify-between h-full min-h-[200px]">
                <p className="text-white/60 text-xs font-medium uppercase tracking-widest">Comunidade</p>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4 leading-snug">
                    +{totalStores.toLocaleString("pt-AO")} negócios<br />cadastrados
                  </h3>
                  <Link href="/busca">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white hover:opacity-70 transition-opacity">
                      Explorar todos <ArrowRight size={14} />
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* ── TRENDING ── */}
        <section className="py-12">
          <SectionHeader title="Mais buscados" href="/busca" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
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

        <div className="border-t border-border" />

        {/* ── RECENT ── */}
        <section className="py-12">
          <SectionHeader title="Adicionados recentemente" href="/busca" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
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

      {/* Footer strip */}
      <div className="border-t border-border py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-medium text-foreground">Guia<span className="font-light">Local</span></span>
          <p className="text-xs text-muted-foreground">© 2024 GuiaLocal. Todos os direitos reservados.</p>
        </div>
      </div>
    </PageTransition>
  );
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <Link href={href}>
        <span className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          Ver todos <ArrowRight size={12} />
        </span>
      </Link>
    </div>
  );
}
