import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Search, ArrowRight, TrendingUp } from "lucide-react";
import { CATEGORIES, STORES } from "@/data/mock";
import { useFavorites } from "@/lib/favorites";
import { StoreCard } from "@/components/StoreCard";
import { CategoryCard } from "@/components/CategoryCard";
import { PageTransition } from "@/components/PageTransition";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Home() {
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();
  const { isFavorite, toggleFavorite } = useFavorites();

  const featuredStores = STORES.slice(0, 6);
  const recentStores = STORES.slice(6, 10);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setLocation(`/busca?q=${encodeURIComponent(query.trim())}`);
    } else {
      setLocation("/busca");
    }
  }

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-primary/8 to-background pt-16 pb-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
              Encontre o melhor perto de você
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight mb-4">
              O guia completo de<br />
              <span className="text-primary">lojas e serviços</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-10">
              Descubra comércios locais, compare avaliações e entre em contato direto com quem você precisa.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex gap-2 max-w-xl mx-auto"
          >
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                data-testid="input-search-hero"
                placeholder="Buscar lojas, serviços, produtos..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-12 text-base bg-background shadow-md border-border/60 focus:border-primary/60"
              />
            </div>
            <Button
              type="submit"
              data-testid="button-search-hero"
              className="h-12 px-6 bg-primary text-primary-foreground text-base font-semibold"
            >
              Buscar
            </Button>
          </motion.form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Categorias</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Explore por segmento</p>
            </div>
            <Link href="/busca">
              <span className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Ver todas <ArrowRight size={14} />
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.map((cat, i) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                index={i}
                onClick={() => setLocation(`/busca?categoria=${cat.id}`)}
              />
            ))}
          </div>
        </section>

        {/* Featured Stores */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" />
                Lojas em Destaque
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">As mais bem avaliadas da semana</p>
            </div>
            <Link href="/busca">
              <span className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Ver todas <ArrowRight size={14} />
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredStores.map((store, i) => (
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

        {/* Recently Reviewed */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Avaliados Recentemente</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Comentários fresquinhos da comunidade</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recentStores.map((store, i) => (
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

        {/* CTA Banner */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-primary rounded-2xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-primary-foreground">Tem um negócio?</h2>
              <p className="text-primary-foreground/80 mt-1 text-sm">
                Cadastre sua loja gratuitamente e alcance mais clientes.
              </p>
            </div>
            <Link href="/dashboard">
              <Button
                data-testid="button-cta-register"
                className="bg-white text-primary hover:bg-white/90 font-semibold px-8 flex-shrink-0"
              >
                Cadastrar minha loja
              </Button>
            </Link>
          </motion.div>
        </section>
      </div>
    </PageTransition>
  );
}
