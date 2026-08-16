import { motion } from "framer-motion";
import { Heart, ShoppingBag, ArrowRight, HeartHandshake } from "lucide-react";

const stores = [
  {
    id: "weddings",
    name: "Eliora Weddings",
    subtitle: "Celebrações com intenção",
    description: "Concierge de celebrações em Luanda e além. Planeamento, decoração, beleza e memória para o vosso dia especial.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-rose-500/80 to-pink-600/80",
    icon: <Heart size={24} className="text-white" />,
    accent: "#E8A0BF",
  },
  {
    id: "love-services",
    name: "Eliora Love Services",
    subtitle: "Cuidar é estar perto",
    description: "Pessoas de confiança para transformar a sua intenção em cuidado — presentes, buquês, fotografia e muito mais.",
    image: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-teal-500/80 to-emerald-600/80",
    icon: <HeartHandshake size={24} className="text-white" />,
    accent: "#68AAA0",
  },
  {
    id: "collection",
    name: "Eliora Collection",
    subtitle: "Estilo e elegância",
    description: "Moda, acessórios e lifestyle para quem carrega a luz de Deus. Descubra o vosso estilo com dignidade.",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-amber-500/80 to-yellow-600/80",
    icon: <ShoppingBag size={24} className="text-white" />,
    accent: "#D4A843",
  },
];

interface StoreSelectorProps {
  onSelect: (storeId: string) => void;
}

export default function StoreSelector({ onSelect }: StoreSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <img 
            src="/logo-eliora-dark.svg" 
            alt="Eliora" 
            className="w-12 h-12"
          />
        </div>
        <h1 className="text-3xl sm:text-4xl font-light text-gray-900 tracking-tight">
          Bem-vindos à <span className="font-serif italic">Eliora</span>
        </h1>
        <p className="mt-3 text-gray-500 text-sm sm:text-base max-w-md mx-auto">
          Escolham a experiência que desejam viver
        </p>
      </motion.div>

      {/* Store Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-8 max-w-5xl w-full">
        {stores.map((store, index) => (
          <motion.div
            key={store.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={() => onSelect(store.id)}
            className="group relative rounded-3xl overflow-hidden shadow-xl cursor-pointer transition-shadow duration-500 hover:shadow-2xl"
            style={{ minHeight: "280px" }}
          >
            {/* Background Image */}
            <img
              src={store.image}
              alt={store.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />

            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${store.gradient} via-black/30 to-transparent`} />

            {/* Content */}
            <div className="relative h-full flex flex-col justify-end p-4 sm:p-7">
              <div
                className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-3 sm:mb-5 shadow-lg"
                style={{ backgroundColor: store.accent }}
              >
                {store.icon}
              </div>

              <h2 className="text-lg sm:text-2xl font-bold text-white mb-1 drop-shadow-lg">
                {store.name}
              </h2>
              <p className="text-white/80 text-xs sm:text-sm font-medium mb-2 sm:mb-3">
                {store.subtitle}
              </p>
              <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-5 max-w-xs hidden sm:block">
                {store.description}
              </p>

              <div className="flex items-center gap-2 text-white text-xs sm:text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                Entrar
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* Border Glow */}
            <div
              className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-white/30 transition-colors duration-500"
            />
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-xs text-gray-400"
      >
        © 2024 Eliora. Todos os direitos reservados.
      </motion.p>
    </div>
  );
}
