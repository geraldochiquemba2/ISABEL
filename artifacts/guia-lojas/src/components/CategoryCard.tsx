import { motion } from "framer-motion";
import {
  Shirt, Smartphone, Utensils, Heart, Home, Car,
  BookOpen, Dog,
} from "lucide-react";
import { Category } from "@/data/mock";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  shirt: Shirt,
  smartphone: Smartphone,
  utensils: Utensils,
  heart: Heart,
  home: Home,
  car: Car,
  "book-open": BookOpen,
  dog: Dog,
};

interface CategoryCardProps {
  category: Category;
  index?: number;
  onClick?: () => void;
}

export function CategoryCard({ category, index = 0, onClick }: CategoryCardProps) {
  const Icon = ICON_MAP[category.icon] || Home;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, delay: index * 0.04, ease: "easeOut" }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      data-testid={`button-category-${category.id}`}
      className="flex flex-col items-center gap-3 p-5 bg-card border border-card-border rounded-2xl hover:border-primary/40 hover:bg-accent/30 transition-all text-center w-full group"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <Icon size={22} className="text-primary" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground leading-tight">{category.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{category.count} lugares</p>
      </div>
    </motion.button>
  );
}
