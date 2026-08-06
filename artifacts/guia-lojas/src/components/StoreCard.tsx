import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Store } from "@/data/mock";
import { MapPin } from "lucide-react";

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
  const imgHeight = size === "lg" ? "h-72" : size === "sm" ? "h-48" : "h-56";

  const images = store.coverImages && store.coverImages.length > 0 
    ? store.coverImages 
    : (store.coverImage ? [store.coverImage] : []);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const currentImage = images[currentImageIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group cursor-pointer rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
      data-testid={`card-store-${store.id}`}
    >
      <Link href={`/loja/${store.id}`} className="block flex-1 flex flex-col">
        {/* Image */}
        <div className={`${imgHeight} w-full relative overflow-hidden bg-gray-100 flex-shrink-0`}>
          {!imgError && currentImage ? (
            <>
              <div 
                key={`bg-${currentImageIndex}`}
                className="absolute inset-0 bg-cover bg-center blur-2xl scale-125 opacity-60 transition-all duration-700 group-hover:scale-150"
                style={{ backgroundImage: `url(${currentImage})` }} 
              />
              <motion.img
                key={`img-${currentImageIndex}`}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                src={currentImage}
                alt={store.name}
                className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-110"
                onError={() => setImgError(true)}
              />
            </>
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center text-4xl font-bold text-white/30"
              style={{ backgroundColor: store.coverColor || '#e5e7eb' }}
            >
              {store.name.charAt(0)}
            </div>
          )}

          {/* Image dots indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
              {images.slice(0, 5).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i === currentImageIndex ? "bg-white w-4" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Status badge */}
        <div className="px-4 pt-3">
          <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${
            store.isOpen
              ? "bg-emerald-100 text-emerald-700"
              : "bg-gray-100 text-gray-600"
          }`}>
            {store.isOpen ? "Aberto" : "Fechado"}
          </span>
        </div>

        {/* Info */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start gap-3">
            {store.logoUrl ? (
              <img
                src={store.logoUrl}
                alt={`${store.name} Logo`}
                className="w-10 h-10 rounded-xl object-cover border border-gray-100 shadow-sm flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center text-yellow-700 font-bold text-sm flex-shrink-0">
                {store.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 leading-tight truncate group-hover:text-yellow-600 transition-colors">
                {store.name}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">{store.category}</p>
            </div>
          </div>
          
          {store.province && store.municipality && (
            <div className="flex items-center gap-1 mt-3 text-gray-400">
              <MapPin size={12} />
              <span className="text-[11px]">{store.municipality}, {store.province}</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}