import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imgHeight = size === "lg" ? "h-72" : size === "sm" ? "h-44" : "h-56";

  const images = store.coverImages && store.coverImages.length > 0 
    ? store.coverImages 
    : (store.coverImage ? [store.coverImage] : []);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [images.length]);

  const currentImage = images[currentImageIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group cursor-pointer border border-black rounded-2xl overflow-hidden bg-card flex flex-col h-full shadow-sm hover:shadow-md transition-shadow"
      data-testid={`card-store-${store.id}`}
    >
      <Link href={`/loja/${store.id}`} className="block flex-1 flex flex-col">
        {/* Image */}
        <div className={`${imgHeight} w-full relative overflow-hidden bg-muted border-b border-black flex-shrink-0`}>
          {!imgError && currentImage ? (
            <>
              {/* Fundo borrado */}
              <div 
                key={`bg-${currentImageIndex}`}
                className="absolute inset-0 bg-cover bg-center blur-xl scale-110 opacity-70 transition-transform duration-500 group-hover:scale-125"
                style={{ backgroundImage: `url(${currentImage})` }} 
              />
              <motion.img
                key={`img-${currentImageIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={currentImage}
                alt={store.name}
                className="w-full h-full object-contain relative z-0 transition-transform duration-500 group-hover:scale-105"
                onError={() => setImgError(true)}
              />
            </>
          ) : (
            <div className="w-full h-full" style={{ backgroundColor: store.coverColor }} />
          )}

          {/* Gradient bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-10" />

          {/* Status pill */}
          <div className="absolute top-3 left-3">
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border border-black/10 ${
              store.isOpen
                ? "bg-white/90 text-emerald-700"
                : "bg-white/80 text-muted-foreground"
            }`}>
              {store.isOpen ? "Aberto" : "Fechado"}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 bg-white flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-2">
            {store.logoUrl && (
              <img
                src={store.logoUrl}
                alt={`${store.name} Logo`}
                className="w-6 h-6 rounded-md object-cover border border-black/10 flex-shrink-0"
              />
            )}
            <p className="text-sm font-medium text-foreground leading-tight truncate">{store.name}</p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-1 mt-1">
            <span className="text-xs text-muted-foreground">{store.category}</span>
            {store.province && store.municipality && (
              <span className="text-[9px] font-semibold text-foreground bg-muted px-1.5 py-0.5 rounded border border-black/10">
                {store.province}, {store.municipality}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
