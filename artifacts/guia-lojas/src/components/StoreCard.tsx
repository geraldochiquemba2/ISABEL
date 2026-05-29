import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Link } from "wouter";
import { Store } from "@/data/mock";

interface StoreCardProps {
  store: Store;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  index?: number;
  size?: "sm" | "md" | "lg";
}

export function StoreCard({ store, isFavorite, onToggleFavorite, index = 0, size = "md" }: StoreCardProps) {
  const [imgError, setImgError] = useState(false);
  const imgHeight = size === "lg" ? "h-72" : size === "sm" ? "h-44" : "h-56";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group cursor-pointer"
      data-testid={`card-store-${store.id}`}
    >
      <Link href={`/loja/${store.id}`} className="block">
        {/* Image */}
        <div className={`${imgHeight} w-full relative overflow-hidden bg-muted`}>
          {!imgError ? (
            <img
              src={store.coverImage}
              alt={store.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full" style={{ backgroundColor: store.coverColor }} />
          )}

          {/* Gradient bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {/* Status pill */}
          <div className="absolute top-3 left-3">
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
              store.isOpen
                ? "bg-white/90 text-emerald-700"
                : "bg-white/80 text-muted-foreground"
            }`}>
              {store.isOpen ? "Aberto" : "Fechado"}
            </span>
          </div>

          {/* Favorite button */}
          <button
            data-testid={`button-favorite-${store.id}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(store.id);
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-sm"
          >
            <Heart
              size={14}
              className={isFavorite ? "fill-rose-500 text-rose-500" : "text-foreground"}
            />
          </button>
        </div>

        {/* Info */}
        <div className="pt-3">
          <p className="text-sm font-medium text-foreground leading-tight">{store.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{store.category}</p>
        </div>
      </Link>
    </motion.div>
  );
}
