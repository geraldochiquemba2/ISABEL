import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import { CATEGORIES, STORES } from "@/data/mock";
import { useFavorites } from "@/lib/favorites";
import { StoreCard } from "@/components/StoreCard";
import { CategoryCard } from "@/components/CategoryCard";
import { PageTransition } from "@/components/PageTransition";
import { Link } from "wouter";

export default function Home() {
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();
  const { isFavorite, toggleFavorite } = useFavorites();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setLocation(`/busca?q=${encodeURIComponent(query.trim())}`);
    } else {
      setLocation("/busca");
    }
  }

  const featured = STORES.slice(0, 4);
  const trending = STORES.slice(4, 8);
  const recent = STORES.slice(8, 12);

  return (
    <PageTransition>
      {/* Hero */}
      <section className="bg-white border-b border-border py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-4xl sm:text-5xl font-light text-foreground leading-tight tracking-tight mb-2">
              Descubra o melhor
            </h1>
            <h1 className="text-4xl sm:text-5xl font-semibold text-foreground leading-tight tracking-tight mb-8">
              do seu bairro
            </h1>
          </motion.div>

          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="flex gap-0 max-w-lg mx-auto border border-border rounded-full overflow-hidden shadow-sm focus-within:shadow-md focus-within:border-foreground/30 transition-all"
          >
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                data-testid="input-search-hero"
                placeholder="Lojas, serviços, produtos..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <button
              type="submit"
              data-testid="button-search-hero"
              className="px-6 py-3 bg-foreground text-background text-sm font-medium hover:opacity-80 transition-opacity"
            >
              Buscar
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-2 mt-5"
          >
            {["Salão de beleza", "Encanador", "Eletrônicos", "Restaurante"].map((s) => (
              <button
                key={s}
                onClick={() => setLocation(`/busca?q=${encodeURIComponent(s)}`)}
                className="text-xs text-muted-foreground border border-border rounded-full px-3 py-1 hover:border-foreground hover:text-foreground transition-colors"
              >
                {s}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories horizontal scroll */}
      <section className="border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6">
            {CATEGORIES.map((cat, i) => (
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
        {/* Featured */}
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

        {/* Promo banner */}
        <section className="py-10">
          <div className="grid sm:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-foreground rounded-2xl p-8 flex flex-col justify-between min-h-[180px]"
            >
              <p className="text-background/60 text-xs font-medium uppercase tracking-widest">Para lojistas</p>
              <div>
                <h3 className="text-2xl font-semibold text-background mb-4 leading-snug">
                  Cadastre sua<br />loja grátis
                </h3>
                <Link href="/dashboard">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-background hover:opacity-70 transition-opacity" data-testid="button-cta-register">
                    Começar agora <ArrowRight size={14} />
                  </span>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-muted rounded-2xl p-8 flex flex-col justify-between min-h-[180px]"
            >
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest">Comunidade</p>
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-4 leading-snug">
                  +1.100 negócios<br />cadastrados
                </h3>
                <Link href="/busca">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:opacity-60 transition-opacity">
                    Explorar todos <ArrowRight size={14} />
                  </span>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Trending */}
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

        {/* Recent */}
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
