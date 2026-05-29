import { motion } from "framer-motion";
import { Heart, MapPin } from "lucide-react";
import { Link } from "wouter";
import { Store } from "@/data/mock";
import { StarRating } from "./StarRating";
import { Badge } from "@/components/ui/badge";

interface StoreCardProps {
  store: Store;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  index?: number;
}

export function StoreCard({ store, isFavorite, onToggleFavorite, index = 0 }: StoreCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: "easeOut" }}
      whileHover={{ y: -4, boxShadow: "0 12px 32px -8px rgba(0,0,0,0.12)" }}
      className="bg-card border border-card-border rounded-xl overflow-hidden cursor-pointer group"
      data-testid={`card-store-${store.id}`}
    >
      <Link href={`/loja/${store.id}`} className="block">
        <div
          className="h-40 w-full relative"
          style={{ backgroundColor: store.coverColor }}
        >
          <div className="absolute inset-0 flex items-end p-3">
            <Badge
              className={`text-xs font-medium ${
                store.isOpen
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-gray-100 text-gray-500 border-gray-200"
              }`}
              variant="outline"
            >
              {store.isOpen ? "Aberto agora" : "Fechado"}
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm leading-tight truncate group-hover:text-primary transition-colors">
                {store.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">{store.category}</p>
            </div>
            <button
              data-testid={`button-favorite-${store.id}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(store.id);
              }}
              className="flex-shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <Heart
                size={16}
                className={isFavorite ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}
              />
            </button>
          </div>
          <div className="mt-2.5">
            <StarRating rating={store.rating} reviewCount={store.reviewCount} />
          </div>
          <div className="flex items-center gap-1 mt-2">
            <MapPin size={11} className="text-muted-foreground flex-shrink-0" />
            <p className="text-xs text-muted-foreground truncate">{store.address}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
