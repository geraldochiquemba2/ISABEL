import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { STORES } from "@/data/mock";
import { useFavorites } from "@/lib/favorites";
import { StoreCard } from "@/components/StoreCard";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";

export default function Favorites() {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const favoriteStores = STORES.filter((s) => favorites.includes(s.id));

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Heart size={22} className="text-rose-500 fill-rose-500" />
            Meus Favoritos
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {favoriteStores.length === 0
              ? "Você ainda não favoritou nenhuma loja."
              : `${favoriteStores.length} ${favoriteStores.length === 1 ? "loja salva" : "lojas salvas"}`}
          </p>
        </div>

        {favoriteStores.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mb-5">
              <Heart size={36} className="text-rose-300" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Nada por aqui ainda</h2>
            <p className="text-muted-foreground text-sm max-w-xs mb-6">
              Explore lojas e serviços e clique no icone de coração para salvar seus favoritos.
            </p>
            <Link href="/busca">
              <Button data-testid="button-explore" className="flex items-center gap-2">
                Explorar lojas <ArrowRight size={16} />
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
