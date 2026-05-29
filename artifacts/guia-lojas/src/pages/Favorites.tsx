import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { STORES } from "@/data/mock";
import { useFavorites } from "@/lib/favorites";
import { StoreCard } from "@/components/StoreCard";
import { PageTransition } from "@/components/PageTransition";

export default function Favorites() {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const favoriteStores = STORES.filter((s) => favorites.includes(s.id));

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Favoritos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {favoriteStores.length === 0
              ? "Nenhuma loja salva ainda."
              : `${favoriteStores.length} ${favoriteStores.length === 1 ? "loja salva" : "lojas salvas"}`}
          </p>
        </div>

        {favoriteStores.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-5">
              <Heart size={28} className="text-muted-foreground opacity-40" />
            </div>
            <p className="text-muted-foreground text-sm mb-1">Explore lojas e salve suas favoritas</p>
            <p className="text-muted-foreground text-xs mb-7">Clique no coração de qualquer loja para salvar</p>
            <Link href="/busca">
              <span
                data-testid="button-explore"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground border border-foreground rounded-full px-5 py-2 hover:bg-foreground hover:text-background transition-colors"
              >
                Explorar lojas <ArrowRight size={14} />
              </span>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {favoriteStores.map((store, i) => (
              <StoreCard
                key={store.id}
                store={store}
                isFavorite={isFavorite(store.id)}
                onToggleFavorite={toggleFavorite}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
