import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchStores } from "@/lib/api";
import {
  HeartHandshake, Landmark, GraduationCap,
  Building2, Baby, Car, ChevronRight, ChevronDown, Search,
  ShieldCheck, BadgeCheck, CreditCard, HeadphonesIcon,
  UtensilsCrossed, Plane, Dumbbell, Briefcase,
  Truck, Church, HeartPulse, Shirt, PartyPopper, Gem, Clapperboard,
  Wrench, TrendingUp, Cpu, Sofa, Tractor, Camera, Umbrella, Scissors,
} from "lucide-react";
import GlobalSearch from "@/components/GlobalSearch";

// Hierarquia YESOLA: Área → Categoria → Subcategoria → Loja/Profissional
// Aqui cada item é uma ÁREA (ex: Casamentos, Moda & Acessórios, Negócios)
const areas = [
  {
    id: "lugares",
    name: "Serviços Públicos & Igrejas",
    subtitle: "Perto de si",
    description: "Encontre igrejas e serviços públicos no mapa — sem conta, sem pagamento.",
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-[#A96F12]/80 to-[#6F4E0B]/80",
    icon: <Church size={24} className="text-white" />,
    accent: "#A96F12",
  },
  {
    id: "saude",
    name: "Saúde & Bem-Estar",
    subtitle: "Cuidamos de si",
    description: "Encontre profissionais, clínicas e serviços que cuidam de si e da sua família com excelência, atenção e amor.",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-[#2E7D32]/80 to-[#1B5E20]/80",
    icon: <HeartPulse size={24} className="text-white" />,
    accent: "#2E7D32",
  },
  {
    id: "beleza",
    name: "Beleza & Bem-Estar",
    subtitle: "Cuide de si",
    description: "Cabelo, unhas, maquiagem, skincare e muito mais. Encontre os melhores profissionais de beleza em Angola.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-[#9A7D60]/80 to-[#9A7209]/80",
    icon: <Scissors size={24} className="text-white" />,
    accent: "#9A7D60",
  },
  {
    id: "collection",
    name: "Moda & Acessórios",
    subtitle: "Estilo e elegância",
    description: "Moda, acessórios e lifestyle para quem carrega a luz de Deus. Descubra o vosso estilo com dignidade.",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-amber-500/80 to-yellow-600/80",
    icon: <Shirt size={24} className="text-white" />,
    accent: "#B89A78",
  },
  {
    id: "eventos",
    name: "Eventos & Celebrações",
    subtitle: "Momentos que ficam",
    description: "Planeamento, assessoria e tudo para o seu evento em Luanda e além. Decoração, catering, entretenimento e mais.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-[#ad696b]/80 to-[#3c2731]/80",
    icon: <PartyPopper size={24} className="text-white" />,
    accent: "#ad696b",
  },
  {
    id: "weddings",
    name: "Casamentos",
    subtitle: "Celebrações com intenção",
    description: "Concierge de celebrações em Luanda e além. Planeamento, decoração, beleza e memória para o vosso dia especial.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-rose-500/80 to-pink-600/80",
    icon: <Gem size={24} className="text-white" />,
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
    id: "entretenimento",
    name: "Entretenimento",
    subtitle: "Diversão para todos",
    description: "Cinema, música, teatro, gaming e espetáculos em Angola e além. A diversão começa aqui.",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-[#7C3AED]/80 to-[#4C1D95]/80",
    icon: <Clapperboard size={24} className="text-white" />,
    accent: "#7C3AED",
  },
  {
    id: "servicos-profissionais",
    name: "Serviços Profissionais",
    subtitle: "Excelência em cada serviço",
    description: "Documentação, consultoria, design, tradução, arquitectura e muito mais. Profissionais qualificados para si.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-[#1A237E]/80 to-[#0D47A1]/80",
    icon: <Wrench size={24} className="text-white" />,
    accent: "#1A237E",
  },
  {
    id: "business",
    name: "Negócios & Finanças",
    subtitle: "Clareza para crescer bem",
    description: "Consultoria, finanças e estratégia para empreendedores, empresas e famílias em Angola e além.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-[#112844]/80 to-[#b88a3b]/80",
    icon: <TrendingUp size={24} className="text-white" />,
    accent: "#b88a3b",
  },
  {
    id: "alimentacao-restauracao",
    name: "Alimentação & Restauração",
    subtitle: "Sabores que unem",
    description: "Restaurantes, pastelarias, fast food, supermercados e entregas de comida. Tudo para o seu dia a dia em Angola.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-[#D84315]/80 to-[#BF360C]/80",
    icon: <UtensilsCrossed size={24} className="text-white" />,
    accent: "#D84315",
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
    id: "turismo-lazer",
    name: "Turismo & Lazer",
    subtitle: "Descubra Angola",
    description: "Agências de viagens, passeios, experiências turísticas, parques e muito mais. Explore Angola com a YESOLA.",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-[#00796B]/80 to-[#004D40]/80",
    icon: <Plane size={24} className="text-white" />,
    accent: "#00796B",
  },
  {
    id: "automoveis",
    name: "Automóveis & Mobilidade",
    subtitle: "O caminho certo",
    description: "Encontre carros, serviços e profissionais que garantem segurança, qualidade e tranquilidade para si e para a sua família.",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-[#0f1d32]/80 to-[#c9913a]/80",
    icon: <Car size={24} className="text-white" />,
    accent: "#0f1d32",
  },
  {
    id: "transportes-logistica",
    name: "Transportes & Logística",
    subtitle: "Movemos Angola",
    description: "Transporte interprovincial, mudanças, entregas, cargas e logística empresarial. Conectamos províncias e pessoas.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-[#F57F17]/80 to-[#E65100]/80",
    icon: <Truck size={24} className="text-white" />,
    accent: "#F57F17",
  },
  {
    id: "tecnologia-electronicos",
    name: "Tecnologia & Electrónicos",
    subtitle: "O futuro nas suas mãos",
    description: "Smartphones, computadores, electrodomicílios, reparação e muito mais. Tecnologia acessível para todos em Angola.",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-[#1565C0]/80 to-[#0D47A1]/80",
    icon: <Cpu size={24} className="text-white" />,
    accent: "#1565C0",
  },
  {
    id: "casa",
    name: "Casa & Serviços",
    subtitle: "O cuidado que a sua casa merece",
    description: "Profissionais qualificados para limpeza, canalização, pintura, jardinagem e muito mais. Encontre o profissional ideal para o seu lar.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-[#8B4513]/80 to-[#6B3410]/80",
    icon: <Sofa size={24} className="text-white" />,
    accent: "#8B4513",
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
    id: "infantil",
    name: "Infantil & Maternidade",
    subtitle: "Cuidar com amor",
    description: "Moda, brinquedos, cuidados e tudo para os pequenos. Enxoval, saúde e bem-estar para bebés e crianças em Angola.",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-[#8e44ad]/80 to-[#e74c8c]/80",
    icon: <Baby size={24} className="text-white" />,
    accent: "#8e44ad",
  },
  {
    id: "desporto-fitness",
    name: "Desporto & Fitness",
    subtitle: "Mova-se com estilo",
    description: "Ginásios, personal trainers, clubes desportivos, equipamentos e muito mais. Cuide do seu corpo em Angola.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-[#E65100]/80 to-[#BF360C]/80",
    icon: <Dumbbell size={24} className="text-white" />,
    accent: "#E65100",
  },
  {
    id: "agricultura-agronegocio",
    name: "Agricultura & Agro-Negócio",
    subtitle: "Do campo à mesa",
    description: "Agricultura, pecuária, máquinas agrícolas, produtos frescos e muito mais. O futuro de Angola começa no campo.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-[#2E7D32]/80 to-[#1B5E20]/80",
    icon: <Tractor size={24} className="text-white" />,
    accent: "#2E7D32",
  },
  {
    id: "influenciadores-criadores",
    name: "Influenciadores & Criadores",
    subtitle: "Vozes que inspiram",
    description: "Influenciadores digitais, criadores de conteúdo, fotógrafos, videomakers e muito mais. Conecte-se com os melhores profissionais.",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-[#C2185B]/80 to-[#880E4F]/80",
    icon: <Camera size={24} className="text-white" />,
    accent: "#C2185B",
  },
  {
    id: "bancos",
    name: "Bancos",
    subtitle: "O seu dinheiro seguro",
    description: "Contas, crédito e investimentos nos melhores bancos em Angola.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-[#1E40AF]/80 to-[#1E3A8A]/80",
    icon: <Landmark size={24} className="text-white" />,
    accent: "#1E40AF",
  },
  {
    id: "seguradoras",
    name: "Seguradoras",
    subtitle: "Proteção total",
    description: "Seguros auto, saúde, vida e património nas melhores seguradoras em Angola.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&auto=format&q=80",
    gradient: "from-[#0F766E]/80 to-[#115E59]/80",
    icon: <Umbrella size={24} className="text-white" />,
    accent: "#0F766E",
  },
];



// Ícones modernos das áreas (Lucide, dourado #A96F12, 36px como os anteriores).
// Cada chave é um id de `areas` — todas as 25 áreas têm ícone.
const categoryIcons: Record<string, React.ReactNode> = {
  lugares: <Church size={36} className="text-[#A96F12]" strokeWidth={1.5} />,
  saude: <HeartPulse size={36} className="text-[#A96F12]" strokeWidth={1.5} />,
  beleza: <Scissors size={36} className="text-[#A96F12]" strokeWidth={1.5} />,
  collection: <Shirt size={36} className="text-[#A96F12]" strokeWidth={1.5} />,
  eventos: <PartyPopper size={36} className="text-[#A96F12]" strokeWidth={1.5} />,
  weddings: <Gem size={36} className="text-[#A96F12]" strokeWidth={1.5} />,
  "love-services": <HeartHandshake size={36} className="text-[#A96F12]" strokeWidth={1.5} />,
  entretenimento: <Clapperboard size={36} className="text-[#A96F12]" strokeWidth={1.5} />,
  "servicos-profissionais": <Wrench size={36} className="text-[#A96F12]" strokeWidth={1.5} />,
  business: <TrendingUp size={36} className="text-[#A96F12]" strokeWidth={1.5} />,
  "alimentacao-restauracao": <UtensilsCrossed size={36} className="text-[#A96F12]" strokeWidth={1.5} />,
  imoveis: <Building2 size={36} className="text-[#A96F12]" strokeWidth={1.5} />,
  "turismo-lazer": <Plane size={36} className="text-[#A96F12]" strokeWidth={1.5} />,
  automoveis: <Car size={36} className="text-[#A96F12]" strokeWidth={1.5} />,
  "transportes-logistica": <Truck size={36} className="text-[#A96F12]" strokeWidth={1.5} />,
  "tecnologia-electronicos": <Cpu size={36} className="text-[#A96F12]" strokeWidth={1.5} />,
  casa: <Sofa size={36} className="text-[#A96F12]" strokeWidth={1.5} />,
  formacoes: <GraduationCap size={36} className="text-[#A96F12]" strokeWidth={1.5} />,
  infantil: <Baby size={36} className="text-[#A96F12]" strokeWidth={1.5} />,
  "desporto-fitness": <Dumbbell size={36} className="text-[#A96F12]" strokeWidth={1.5} />,
  "empregos-oportunidades": <Briefcase size={36} className="text-[#A96F12]" strokeWidth={1.5} />,
  "agricultura-agronegocio": <Tractor size={36} className="text-[#A96F12]" strokeWidth={1.5} />,
  "influenciadores-criadores": <Camera size={36} className="text-[#A96F12]" strokeWidth={1.5} />,
  bancos: <Landmark size={36} className="text-[#A96F12]" strokeWidth={1.5} />,
  seguradoras: <Umbrella size={36} className="text-[#A96F12]" strokeWidth={1.5} />,
};



const PURPOSE_SLIDES = [

  {

    title: "YESOLA com propósito",

    subtitle: "porque Jesus te ama.",

    description: "Ao escolher a YESOLA, ajudas a transformar vidas e fazer alguém feliz.",

    image: "/proposito-jesus.jpg",

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

  const [, setLoc] = useLocation();
  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setLoc(href);
    window.scrollTo(0, 0);
  };

  const [showAllStores, setShowAllStores] = useState(false);

  const [storeSearch, setStoreSearch] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);



  // Barra de estado do telemóvel (hora, bateria, rede) no creme da página.
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    const prev = meta?.getAttribute("content");
    meta?.setAttribute("content", "#FFFDF8");
    return () => {
      if (prev) meta?.setAttribute("content", prev);
    };
  }, []);

  useEffect(() => {

    if (!showAllStores) return;

    const close = (e: MouseEvent) => {

      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowAllStores(false);

    };

    document.addEventListener("mousedown", close);

    return () => document.removeEventListener("mousedown", close);

  }, [showAllStores]);



  const { data: allStores = [], isLoading: loadingStores } = useQuery({

    queryKey: ["allStoresSelector"],

    queryFn: async () => {

      const results = await Promise.all(

        areas.map(async (a) => {

          try {

            const list = await fetchStores({ storeType: a.id });

            return list.map((s: any) => ({ ...s, _areaId: a.id, _areaName: a.name }));

          } catch {

            return [];

          }

        })

      );

      const seen = new Map<string, any>();

      results.flat().forEach((s: any) => {

        if (s && s.id && s.phone !== "999999999" && !seen.has(s.id)) seen.set(s.id, s);

      });

      return [...seen.values()].sort((x: any, y: any) =>

        String(x.name || "").localeCompare(String(y.name || ""), "pt")

      );

    },

    enabled: showAllStores,

    staleTime: 5 * 60_000,

  });



  const visibleStores = useMemo(() => {

    const q = storeSearch.trim().toLowerCase();

    if (!q) return allStores;

    return (allStores as any[]).filter((s: any) => String(s.name || "").toLowerCase().includes(q));

  }, [allStores, storeSearch]);



  return (

    <div className="min-h-[100dvh] bg-[#FFFDF8] text-[#111111]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`

        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');

        .category-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }

        @media (max-width: 400px) { .category-grid { grid-template-columns: repeat(2, 1fr); } }

        /* Cards de área no mesmo estilo dos cards de categoria
           das Homes de cada vertical (cat-item). */
        .area-item { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 10px; background: white; border-radius: 14px; border: 1px solid #E8CC91; cursor: pointer; transition: all 0.2s; }

        .area-item:hover { border-color: #C99432; background: #FFF8EC; }

        .slide-dot { width: 8px; height: 8px; border-radius: 50%; background: #C99432; transition: all 0.3s; }

        .slide-dot-inactive { width: 8px; height: 8px; border-radius: 50%; background: #E5DDD0; }

        .trust-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }

        .trust-scroll::-webkit-scrollbar { display: none; }

        .trust-item { flex-shrink: 0; display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: white; border-radius: 12px; border: 1px solid #E8CC91; }

      `}</style>



      {/* Header */}

      <header className="sticky top-0 z-50 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#E8CC91]/60">

        <div className="flex items-center justify-between px-5 py-2.5">

          <a href="/sobre" onClick={(e) => go(e, "/sobre")} className="w-[86px] text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#A96F12] hover:text-[#C99432] transition-colors leading-tight">
            Sobre<br />nós
          </a>

          <a href="/" onClick={(e) => { if (window.location.pathname === "/") { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); } }} className="flex items-center justify-center">

            <img

              src="/logo-yesola-star-gold.png"

              alt="YESOLA"

              className="h-12 sm:h-14 w-auto object-contain drop-shadow-[0_2px_8px_rgba(201,148,50,0.2)]"

            loading="lazy" decoding="async" />

          </a>

          <a href="/contacto" onClick={(e) => go(e, "/contacto")} className="w-[86px] text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[#A96F12] hover:text-[#C99432] transition-colors leading-tight">
            Fale<br />connosco
          </a>

        </div>

      </header>



      {/* Global Search */}

      <section className="px-5 py-3">

        <GlobalSearch />

      </section>



      {/* Hero Section */}

      <section className="relative px-5 pt-6 pb-4 overflow-hidden" style={{ minHeight: "220px" }}>

        <div className="relative z-10 max-w-[280px]">

          <h1 className="text-[32px] leading-[1.1] font-semibold text-[#111111]" style={{ fontFamily: "'Playfair Display', serif" }}>

            Tudo o que<br />

            procuras,<br />

            encontras<br />

            <span className="text-[#C99432]">aqui.</span>

          </h1>

          <p className="text-[13px] text-[#6F6F6F] mt-4 leading-relaxed">

            Soluções completas<br />

            para o seu dia a dia,<br />

            negócios, formações,<br />

            casa e muito mais,{" "}

            <span className="text-[#A96F12] font-semibold">na sua província.</span>

          </p>

        </div>

        <div className="absolute right-0 top-0 w-[55%] h-full">

          <img

            src="/tudo-que-procura.jpg"

            alt="Tudo o que procuras, encontras aqui"

            className="w-full h-full object-cover object-top"

            style={{ maskImage: "linear-gradient(to left, black 60%, transparent 100%)", WebkitMaskImage: "linear-gradient(to left, black 60%, transparent 100%)" }}

          loading="lazy" decoding="async" />

        </div>

      </section>



      {/* Purpose Banner */}

      <section className="px-5 py-3">

        <div className="relative rounded-2xl overflow-hidden bg-white border border-[#E8CC91]" style={{ minHeight: "200px" }}>

          <div className="absolute right-0 top-0 w-[50%] h-full">

            <img src={PURPOSE_SLIDES[0].image} alt={PURPOSE_SLIDES[0].title} className="w-full h-full object-cover" loading="lazy" decoding="async" />

            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent" />

          </div>

          <div className="relative z-10 p-5 max-w-[60%]">

            <h3 className="text-[16px] font-semibold text-[#C99432]">{PURPOSE_SLIDES[0].title} ♥</h3>

            <p className="text-[13px] text-[#C99432]/80 italic mt-0.5">{PURPOSE_SLIDES[0].subtitle}</p>

            <p className="text-[12px] text-[#6F6F6F] mt-3 leading-relaxed">{PURPOSE_SLIDES[0].description}</p>

            <button onClick={() => window.location.href = "/proposito"} className="mt-4 flex items-center gap-2 bg-gradient-to-r from-[#C99432] to-[#A96F12] hover:from-[#A96F12] hover:to-[#8C590E] text-white text-[12px] font-semibold px-5 py-2.5 rounded-full shadow-md transition-all transition-colors">

              Ver

            </button>

          </div>

        </div>

      </section>



      {/* Áreas - Seletor por área */}

      <section className="px-5 py-5">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-[18px] font-bold text-[#111111]">Escolha por área</h2>

          <div className="relative" ref={dropdownRef}>

            <button onClick={() => setShowAllStores((v) => !v)} className="text-xs font-semibold text-[#A96F12] hover:text-[#C99432] transition-colors flex items-center gap-1">

              Ver todas <ChevronDown size={14} className={`transition-transform ${showAllStores ? "rotate-180" : ""}`} />

            </button>

            {showAllStores && (

              <div className="absolute right-0 mt-2 w-72 max-w-[80vw] bg-white border border-[#E8CC91] rounded-2xl shadow-xl z-50 overflow-hidden">

                <div className="p-2 border-b border-[#E8CC91]/60 flex items-center gap-2">

                  <Search size={14} className="text-[#A96F12] shrink-0 ml-1" />

                  <input

                    value={storeSearch}

                    onChange={(e) => setStoreSearch(e.target.value)}

                    placeholder="Pesquisar loja..."

                    className="w-full text-xs py-1.5 outline-none placeholder:text-[#9CA3AF]"

                  />

                </div>

                <div className="max-h-72 overflow-y-auto py-1">

                  {loadingStores ? (

                    <p className="text-xs text-[#6F6F6F] text-center py-6">A carregar lojas...</p>

                  ) : visibleStores.length === 0 ? (

                    <p className="text-xs text-[#6F6F6F] text-center py-6">Nenhuma loja encontrada.</p>

                  ) : (

                    (visibleStores as any[]).map((s: any) => (

                      <button

                        key={s.id}

                        onClick={() => { setShowAllStores(false); window.location.href = `/loja/${s.id}?from=${s._areaId}`; }}

                        className="w-full text-left px-4 py-2.5 hover:bg-[#FFF8EC] transition-colors"

                      >

                        <span className="block text-[13px] font-medium text-[#111111] truncate">{s.name}</span>

                        <span className="block text-[10px] text-[#A96F12]">{s._areaName}</span>

                      </button>

                    ))

                  )}

                </div>

              </div>

            )}

          </div>

        </div>

        <div className="category-grid">

          {areas.map((area) => (

            <motion.button

              key={area.id}

              whileHover={{ scale: 1.03 }}

              whileTap={{ scale: 0.97 }}

              onClick={() => area.id === "lugares" ? (setLoc("/lugares"), window.scrollTo(0, 0)) : onSelect(area.id)}

              className="area-item"

            >

              <div className="flex items-center justify-center w-12 h-12">{categoryIcons[area.id]}</div>

              <span className="text-[10px] font-medium text-[#111111] text-center leading-tight">{area.name}</span>

            </motion.button>

          ))}

        </div>

      </section>



      {/* Trust Badges */}

      <section className="px-5 py-3">

        <div className="trust-scroll">

          {TRUST_BADGES.map((badge, i) => (

            <div key={i} className="trust-item">

              <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#C994321A" }}>
                <span className="text-[#C99432]">{badge.icon}</span>
              </span>

              <span className="text-[11px] font-medium text-[#111111] leading-tight whitespace-pre-line">{badge.label}</span>

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
