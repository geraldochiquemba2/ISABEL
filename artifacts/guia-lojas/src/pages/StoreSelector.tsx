import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Heart, ShoppingBag, HeartHandshake, Landmark, GraduationCap,
  Crown, Building2, Baby, Menu, X, Search, ChevronRight,
  ShieldCheck, BadgeCheck, CreditCard, HeadphonesIcon,
} from "lucide-react";

const stores = [
  {
    id: "weddings",
    name: "Casamentos",
    subtitle: "Celebrações com intenção",
    description: "Concierge de celebrações em Luanda e além. Planeamento, decoração, beleza e memória para o vosso dia especial.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-rose-500/80 to-pink-600/80",
    icon: <Heart size={24} className="text-white" />,
    accent: "#E8A0BF",
  },
  {
    id: "love-services",
    name: "Serviços de Amor",
    subtitle: "Cuidar é estar perto",
    description: "Pessoas de confiança para transformar a sua intenção em cuidado — presentes, buquês, fotografia e muito mais.",
    image: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-teal-500/80 to-emerald-600/80",
    icon: <HeartHandshake size={24} className="text-white" />,
    accent: "#68AAA0",
  },
  {
    id: "collection",
    name: "Coleção",
    subtitle: "Estilo e elegância",
    description: "Moda, acessórios e lifestyle para quem carrega a luz de Deus. Descubra o vosso estilo com dignidade.",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-amber-500/80 to-yellow-600/80",
    icon: <ShoppingBag size={24} className="text-white" />,
    accent: "#D4A843",
  },
  {
    id: "business",
    name: "Negócios & Finanças",
    subtitle: "Clareza para crescer bem",
    description: "Consultoria, finanças e estratégia para empreendedores, empresas e famílias em Angola e além.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-[#112844]/80 to-[#b88a3b]/80",
    icon: <Landmark size={24} className="text-white" />,
    accent: "#b88a3b",
  },
  {
    id: "formacoes",
    name: "Formações",
    subtitle: "Aprender muda o caminho",
    description: "Aulas, treinamentos e formações em Angola e além. Idiomas, tecnologia, carreira, artes e muito mais.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-[#0c9894]/80 to-[#123f4c]/80",
    icon: <GraduationCap size={24} className="text-white" />,
    accent: "#0c9894",
  },
  {
    id: "eventos",
    name: "Eventos & Celebrações",
    subtitle: "Momentos que ficam",
    description: "Planeamento, assessoria e tudo para o seu evento em Luanda e além. Decoração, catering, entretenimento e mais.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-[#ad696b]/80 to-[#3c2731]/80",
    icon: <Crown size={24} className="text-white" />,
    accent: "#ad696b",
  },
  {
    id: "imoveis",
    name: "Imóveis & Alojamento",
    subtitle: "Conforto e confiança",
    description: "Gestão imobiliária, arrendamento, estadias e hospitalidade. Hotéis, alojamento e imobiliária em Angola e além.",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-[#1a5276]/80 to-[#c9913a]/80",
    icon: <Building2 size={24} className="text-white" />,
    accent: "#1a5276",
  },
  {
    id: "infantil",
    name: "Infantil & Maternidade",
    subtitle: "Cuidar com amor",
    description: "Moda, brinquedos, cuidados e tudo para os pequenos. Enxoval, saúde e bem-estar para bebés e crianças em Angola.",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-[#8e44ad]/80 to-[#e74c8c]/80",
    icon: <Baby size={24} className="text-white" />,
    accent: "#8e44ad",
  },
];

const categoryIcons: Record<string, React.ReactNode> = {
  weddings: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#D4A843" strokeWidth="1.5">
      <circle cx="12" cy="22" r="7" />
      <circle cx="24" cy="22" r="7" />
      <path d="M19 22c-1-3 0-7 3-8" strokeLinecap="round" />
    </svg>
  ),
  formacoes: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#D4A843" strokeWidth="1.5">
      <path d="M18 8L4 14l14 6 14-6L18 8z" />
      <path d="M8 16v8c0 2 4 4 10 4s10-2 10-4v-8" />
      <line x1="30" y1="14" x2="30" y2="26" />
    </svg>
  ),
  imoveis: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#D4A843" strokeWidth="1.5">
      <rect x="6" y="12" width="24" height="18" rx="2" />
      <rect x="10" y="16" width="5" height="5" rx="1" />
      <rect x="21" y="16" width="5" height="5" rx="1" />
      <rect x="10" y="25" width="5" height="5" rx="1" />
      <rect x="21" y="25" width="5" height="5" rx="1" />
      <path d="M4 12h28" />
      <path d="M14 12V8a4 4 0 0 1 8 0v4" />
    </svg>
  ),
  collection: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#D4A843" strokeWidth="1.5">
      <path d="M12 6c-2 0-4 2-4 4v2l6-2 4 2 4-2 6 2v-2c0-2-2-4-4-4-2 0-3 1-4 2h-4c-1-1-2-2-4-2z" />
      <path d="M10 12l-2 16h20l-2-16" />
      <path d="M14 12v4" />
      <path d="M22 12v4" />
    </svg>
  ),
  eventos: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#D4A843" strokeWidth="1.5">
      <rect x="8" y="10" width="20" height="18" rx="2" />
      <path d="M8 16h20" />
      <path d="M14 10V8" />
      <path d="M22 10V8" />
      <circle cx="18" cy="23" r="3" />
    </svg>
  ),
  "love-services": (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#D4A843" strokeWidth="1.5">
      <path d="M18 30s-10-6-10-14c0-4 3-6 6-6 2 0 3 1 4 3 1-2 2-3 4-3 3 0 6 2 6 6 0 8-10 14-10 14z" />
      <path d="M18 18c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z" />
    </svg>
  ),
  business: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#D4A843" strokeWidth="1.5">
      <circle cx="18" cy="18" r="10" />
      <path d="M18 10v16" />
      <path d="M14 14c0-2 2-3 4-3s4 1 4 3-2 2-4 3-4 1-4 3 2 3 4 3 4-1 4-3" />
    </svg>
  ),
  infantil: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#D4A843" strokeWidth="1.5">
      <circle cx="18" cy="14" r="6" />
      <path d="M12 20c-2 2-3 5-3 8h24c0-3-1-6-3-8" />
      <circle cx="15" cy="13" r="1" fill="#D4A843" />
      <circle cx="21" cy="13" r="1" fill="#D4A843" />
      <path d="M16 16c1 1 3 1 4 0" strokeLinecap="round" />
    </svg>
  ),
};

const PURPOSE_SLIDES = [
  {
    title: "YESOLA com propósito",
    subtitle: "porque Jesus é amor.",
    description: "Ao escolher a YESOLA, ajudas a transformar vidas e fazer alguém feliz.",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop&auto=format&q=80",
  },
  {
    title: "Moda com significado",
    subtitle: "estilo que inspira.",
    description: "Cada peça conta uma história de amor, fé e propósito.",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=400&fit=crop&auto=format&q=80",
  },
  {
    title: "Formando o futuro",
    subtitle: "investindo em você.",
    description: "Cursos e formações para impulsionar a sua carreira.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&auto=format&q=80",
  },
];

const TRUST_BADGES = [
  { icon: <ShieldCheck size={20} />, label: "Segurança\ngarantida" },
  { icon: <BadgeCheck size={20} />, label: "Profissionais\nverificados" },
  { icon: <CreditCard size={20} />, label: "Pagamentos\nseguros" },
  { icon: <HeadphonesIcon size={20} />, label: "Apoio ao cliente\ndedicado" },
];

interface StoreSelectorProps {
  onSelect: (storeId: string) => void;
}

export default function StoreSelector({ onSelect }: StoreSelectorProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlideIdx((p) => (p + 1) % PURPOSE_SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const slide = PURPOSE_SLIDES[slideIdx];

  return (
    <div className="min-h-[100dvh] bg-[#FAF8F5] text-[#2D2C2B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .category-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        @media (max-width: 400px) { .category-grid { grid-template-columns: repeat(2, 1fr); } }
        .slide-dot { width: 8px; height: 8px; border-radius: 50%; background: #D4A843; transition: all 0.3s; }
        .slide-dot-inactive { width: 8px; height: 8px; border-radius: 50%; background: #E5DDD0; }
        .trust-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
        .trust-scroll::-webkit-scrollbar { display: none; }
        .trust-item { flex-shrink: 0; display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: white; border-radius: 12px; border: 1px solid #EDE8DE; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EDE8DE]/60">
        <div className="flex items-center justify-between px-5 py-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-1" aria-label="Menu">
            {menuOpen ? <X size={22} color="#2D2C2B" /> : <Menu size={22} color="#2D2C2B" />}
          </button>
          <div className="flex flex-col items-center">
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: 600, color: "#2d2c2b", letterSpacing: "-.02em" }}>
              YESOLA
            </span>
            <svg width="30" height="8" viewBox="0 0 30 8" fill="none" className="mt-0.5">
              <path d="M0 4C5 1 10 0 15 2C20 4 25 3 30 1" stroke="#D4A843" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
          <div className="w-[44px]" />
        </div>
        {menuOpen && (
          <div className="bg-[#FAF8F5] border-t border-[#EDE8DE]/60 px-5 py-4 flex flex-col gap-3 text-sm font-medium text-[#2D2C2B]">
            <a href="/login" className="py-2">Entrar</a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative px-5 pt-6 pb-4 overflow-hidden" style={{ minHeight: "220px" }}>
        <div className="relative z-10 max-w-[280px]">
          <h1 className="text-[32px] leading-[1.1] font-semibold text-[#2D2C2B]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Tudo o que<br />
            procuras,<br />
            <span className="text-[#D4A843]">encontras aqui.</span>
          </h1>
          <p className="text-[13px] text-[#6B7280] mt-4 leading-relaxed">
            Soluções completas para o seu dia a dia, negócios, formações, casa e muito mais,{" "}
            <span className="text-[#D4A843] font-medium">na sua província.</span>
          </p>
        </div>
        <div className="absolute right-0 top-0 w-[55%] h-full">
          <img
            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&h=400&fit=crop&auto=format&q=80"
            alt="Mulher feliz"
            className="w-full h-full object-cover object-top"
            style={{ maskImage: "linear-gradient(to left, black 60%, transparent 100%)", WebkitMaskImage: "linear-gradient(to left, black 60%, transparent 100%)" }}
          />
        </div>
      </section>

      {/* Search Bar */}
      <section className="px-5 py-3">
        <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 border border-[#EDE8DE] shadow-sm">
          <Search size={20} color="#D4A843" />
          <span className="text-[14px] text-[#9CA3AF]">O que procura hoje?</span>
        </div>
      </section>

      {/* Purpose Banner */}
      <section className="px-5 py-3">
        <div className="relative rounded-2xl overflow-hidden bg-white border border-[#EDE8DE]" style={{ minHeight: "200px" }}>
          <div className="absolute right-0 top-0 w-[50%] h-full">
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent" />
          </div>
          <div className="relative z-10 p-5 max-w-[60%]">
            <h3 className="text-[16px] font-semibold text-[#D4A843]">{slide.title} ♥</h3>
            <p className="text-[13px] text-[#D4A843]/80 italic mt-0.5">{slide.subtitle}</p>
            <p className="text-[12px] text-[#6B7280] mt-3 leading-relaxed">{slide.description}</p>
          </div>
        </div>
        <div className="flex justify-center gap-2 mt-3">
          {PURPOSE_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlideIdx(i)} className={i === slideIdx ? "slide-dot" : "slide-dot-inactive"} />
          ))}
        </div>
      </section>

      {/* Categories - Store Selector */}
      <section className="px-5 py-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[17px] font-semibold text-[#2D2C2B]">Escolher loja</h2>
        </div>
        <div className="category-grid">
          {stores.map((store) => (
            <motion.button
              key={store.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(store.id)}
              className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl border bg-white border-[#EDE8DE] hover:border-[#D4A843]/30 hover:bg-[#FBF7ED] transition-all cursor-pointer"
            >
              <div className="flex items-center justify-center w-12 h-12">{categoryIcons[store.id]}</div>
              <span className="text-[11px] font-medium text-[#2D2C2B] text-center leading-tight">{store.name}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="px-5 py-3">
        <div className="trust-scroll">
          {TRUST_BADGES.map((badge, i) => (
            <div key={i} className="trust-item">
              <span className="text-[#D4A843]">{badge.icon}</span>
              <span className="text-[11px] font-medium text-[#2D2C2B] leading-tight whitespace-pre-line">{badge.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div className="text-center py-8">
        <p className="text-xs text-[#9CA3AF]">© 2024 YESOLA. Todos os direitos reservados.</p>
      </div>
    </div>
  );
}
