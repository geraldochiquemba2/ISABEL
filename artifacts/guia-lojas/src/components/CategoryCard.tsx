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
  active?: boolean;
}

export function CategoryCard({ category, index = 0, onClick, active }: CategoryCardProps) {
  const Icon = ICON_MAP[category.icon] || Home;

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      onClick={onClick}
      data-testid={`button-category-${category.id}`}
      className={`flex flex-col items-center gap-2.5 px-4 py-4 transition-all text-center flex-shrink-0 ${
        active ? "opacity-100" : "opacity-80 hover:opacity-100"
      }`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
        active ? "bg-foreground" : "bg-muted hover:bg-foreground/8"
      }`}>
        <Icon size={22} className={active ? "text-background" : "text-foreground"} />
      </div>
      <p className={`text-xs font-medium leading-tight whitespace-nowrap ${
        active ? "text-foreground" : "text-muted-foreground"
      }`}>
        {category.name}
      </p>
    </motion.button>
  );
}
