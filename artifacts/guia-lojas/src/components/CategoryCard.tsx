import { motion } from "framer-motion";
import { Category } from "@/data/mock";

const CATEGORY_IMAGES: Record<string, string> = {
  moda: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=300&h=300&fit=crop&auto=format&q=80",
  eletronicos: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=300&h=300&fit=crop&auto=format&q=80",
  alimentacao: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=300&fit=crop&auto=format&q=80",
  "saude-beleza": "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=300&fit=crop&auto=format&q=80",
  "servicos-residenciais": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=300&fit=crop&auto=format&q=80",
  automotivo: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=300&fit=crop&auto=format&q=80",
  educacao: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=300&fit=crop&auto=format&q=80",
  pets: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop&auto=format&q=80",
};

interface CategoryCardProps {
  category: Category;
  index?: number;
  onClick?: () => void;
  active?: boolean;
}

export function CategoryCard({ category, index = 0, onClick, active }: CategoryCardProps) {
  const imageUrl = CATEGORY_IMAGES[category.id];

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      onClick={onClick}
      data-testid={`button-category-${category.id}`}
      className="flex-shrink-0 group relative overflow-hidden rounded-2xl w-28 h-28 cursor-pointer focus:outline-none"
    >
      {/* Background image */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      )}
      {/* Gradient overlay */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${
        active
          ? "bg-black/60"
          : "bg-gradient-to-t from-black/70 via-black/20 to-black/10 group-hover:from-black/75"
      }`} />
      {/* Active ring */}
      {active && (
        <div className="absolute inset-0 rounded-2xl ring-2 ring-white ring-inset" />
      )}
      {/* Count badge */}
      <div className="absolute top-2 right-2">
        <span className="text-[9px] font-semibold text-white/80 bg-black/30 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
          {category.count}
        </span>
      </div>
      {/* Name */}
      <div className="absolute bottom-0 left-0 right-0 p-2.5">
        <p className="text-white text-[11px] font-semibold leading-tight text-left">{category.name}</p>
      </div>
    </motion.button>
  );
}
