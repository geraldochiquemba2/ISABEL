import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { ArrowRight, ArrowLeft, Check, MessageCircle, Sparkles, Palette, Shirt, Star, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const WHATSAPP_NUMBER = "922001778";
const WHATSAPP_LINK = `https://wa.me/244${WHATSAPP_NUMBER}?text=Olá! Gostaria de ajuda para descobrir o meu estilo!`;

interface Pergunta {
  id: number;
  texto: string;
  opcoes: { id: string; texto: string; pontos: Record<string, number>; icone: string }[];
}

const PERGUNTAS: Pergunta[] = [
  {
    id: 1,
    texto: "Que tipo de roupa escolhes para um passeio no fim de semana?",
    opcoes: [
      { id: "a", texto: "Vestido floral leve e sandálias", pontos: { boho: 3, romantico: 2 }, icone: "👗" },
      { id: "b", texto: "Ténis, jeans e cropped", pontos: { urbano: 3, casual: 2 }, icone: "👟" },
      { id: "c", texto: "Calça de ganga e blusa branca", pontos: { casual: 3, minimalista: 1 }, icone: "👕" },
      { id: "d", texto: "Conjunto elegante com acessórios", pontos: { classico: 3, glam: 2 }, icone: "✨" },
    ],
  },
  {
    id: 2,
    texto: "Que cores mais te atraem?",
    opcoes: [
      { id: "a", texto: "Tons neutros (bege, branco, cáqui)", pontos: { minimalista: 3, classico: 2 }, icone: "🤍" },
      { id: "b", texto: "Cores vibrantes (vermelho, amarelo, rosa)", pontos: { tropical: 3, glam: 2 }, icone: "🌈" },
      { id: "c", texto: "Preto e tons escuros", pontos: { rock: 3, urbano: 2 }, icone: "🖤" },
      { id: "d", texto: "Pastéis (rosa claro, azul bebê)", pontos: { romantico: 3, boho: 1 }, icone: "💕" },
    ],
  },
  {
    id: 3,
    texto: "Que acessório não pode faltar?",
    opcoes: [
      { id: "a", texto: "Relógio clássico ou bijuteria", pontos: { classico: 3, glam: 2 }, icone: "⌚" },
      { id: "b", texto: "Óculos de sol grandes", pontos: { glam: 3, urbano: 1 }, icone: "🕶️" },
      { id: "c", texto: "Colares camadas ou brincos pendentes", pontos: { boho: 3, romantico: 2 }, icone: "📿" },
      { id: "d", texto: "Boné ou bucket hat", pontos: { urbano: 3, sport: 2 }, icone: "🧢" },
    ],
  },
  {
    id: 4,
    texto: "Que tipo de estampas preferes?",
    opcoes: [
      { id: "a", texto: "Florais e naturais", pontos: { boho: 3, romantico: 2 }, icone: "🌸" },
      { id: "b", texto: "Listras ou xadrez", pontos: { classico: 3, preppy: 2 }, icone: "📐" },
      { id: "c", texto: "Geométricas ou abstratas", pontos: { minimalista: 3, urbano: 1 }, icone: "◼️" },
      { id: "d", texto: "Estampas animais ou étnicas", pontos: { tropical: 3, rock: 1 }, icone: "🐆" },
    ],
  },
  {
    id: 5,
    texto: "Como descreverias o teu estilo?",
    opcoes: [
      { id: "a", texto: "Confortável e despretensioso", pontos: { casual: 3, sport: 2 }, icone: "😌" },
      { id: "b", texto: "Elegante e sempre arrumado", pontos: { classico: 3, glam: 2 }, icone: "💁‍♀️" },
      { id: "c", texto: "Criativo e fora do comum", pontos: { artístico: 3, rock: 2 }, icone: "🎨" },
      { id: "d", texto: "Romântico e delicado", pontos: { romantico: 3, boho: 1 }, icone: "💗" },
    ],
  },
  {
    id: 6,
    texto: "Que sapatos escolhes no dia a dia?",
    opcoes: [
      { id: "a", texto: "Ténis brancos ou chunky", pontos: { urbano: 3, sport: 2 }, icone: "👟" },
      { id: "b", texto: "Scarpin ou sapatilhas de salto", pontos: { classico: 3, glam: 1 }, icone: "👠" },
      { id: "c", texto: "Sandálias de couro ou alpargatas", pontos: { boho: 3, casual: 2 }, icone: "👡" },
      { id: "d", texto: "Botas ou coturnos", pontos: { rock: 3, urbano: 1 }, icone: "👢" },
    ],
  },
  {
    id: 7,
    texto: "Que roupa escolhes para um jantar especial?",
    opcoes: [
      { id: "a", texto: "Vestido midi ou camisa social", pontos: { classico: 3, minimalista: 2 }, icone: "👔" },
      { id: "b", texto: "Conjunto colorido ou estampado", pontos: { tropical: 3, glam: 2 }, icone: "🌴" },
      { id: "c", texto: "Calça alfaiataria com blusa elegante", pontos: { minimalista: 3, urbano: 1 }, icone: "💫" },
      { id: "d", texto: "Vestido com detalhes (renda, babados)", pontos: { romantico: 3, boho: 1 }, icone: "🎀" },
    ],
  },
  {
    id: 8,
    texto: "Que inspiração mais te identifica?",
    opcoes: [
      { id: "a", texto: "Influenciadores de moda", pontos: { tropical: 3, glam: 2 }, icone: "📱" },
      { id: "b", texto: "Celebridades clássicas", pontos: { classico: 3, glam: 2 }, icone: "🌟" },
      { id: "c", texto: "Artistas e criativos", pontos: { artístico: 3, urbano: 1 }, icone: "🎭" },
      { id: "d", texto: "Moda de rua", pontos: { urbano: 3, rock: 2 }, icone: "🔥" },
    ],
  },
];

const ESTILOS: Record<string, { 
  nome: string; 
  descricao: string; 
  dicas: string[];
  pecas: string[];
  cores: string; 
  icone: string;
  paleta: string[];
  imagem: string;
  galeria: string[];
}> = {
  boho: { 
    nome: "Boho Chic", 
    descricao: "Livre, natural e cheia de personalidade. Gostas de peças fluidas, estampas florais e acessórios artesanais.", 
    dicas: ["Aposte em tecidos leves como linho e algodão", "Misture estampas florais com listras finas", "Use acessórios de madeira e pedras naturais"],
    pecas: ["Vestidos midi florais", "Saia godê", "Blusa de gola alta bordada", "Sandálias de couro"],
    cores: "from-amber-100 to-orange-200", 
    icone: "🌿",
    paleta: ["#D4A574", "#E8D5B7", "#8B7355", "#F5E6D3"],
    imagem: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop",
    galeria: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop",
    ]
  },
  classico: { 
    nome: "Clássico Elegante", 
    descricao: "Atemporal e sofisticado. Apostas em peças de qualidade, corte impecável e cores neutras.", 
    dicas: ["Invista em peças atemporais de qualidade", "Mantenha uma paleta de cores neutras", "Detalhes fazem toda a diferença"],
    pecas: ["Blazer de ganga", "Camisa branca impecável", "Calça de alfaiataria", "Sapatos de couro"],
    cores: "from-gray-100 to-slate-200", 
    icone: "👔",
    paleta: ["#2C3E50", "#ECF0F1", "#95A5A6", "#34495E"],
    imagem: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop",
    galeria: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    ]
  },
  glam: { 
    nome: "Glamour", 
    descricao: "Brilhante e chamativo. Adoras dourados, brilhos e peças que destacam a tua silhueta.", 
    dicas: ["Não tenhas medo de brilhar", "Use acessórios dourados como destaque", "Vestidos com caimento são a tua arma"],
    pecas: ["Vestido de festa", "Blusa com lantejoulas", "Saia de couro", "Salto alto"],
    cores: "from-yellow-100 to-amber-200", 
    icone: "✨",
    paleta: ["#FFD700", "#FFC0CB", "#FF69B4", "#FFB6C1"],
    imagem: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=800&fit=crop",
    galeria: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop",
    ]
  },
  urbano: { 
    nome: "Urbano Street", 
    descricao: "Descontraído e com atitude. Ténis, jeans, oversized e peças que marcam presença.", 
    dicas: ["Oversized é sempre uma boa opção", "Misture peças casuais com urbanas", "Ténis brancos são a base perfeita"],
    pecas: ["Jeans oversized", "Cropped preto", "Moletom", "Ténis chunky"],
    cores: "from-gray-200 to-gray-300", 
    icone: "🏙️",
    paleta: ["#1C1C1C", "#4A4A4A", "#7C7C7C", "#E0E0E0"],
    imagem: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=800&fit=crop",
    galeria: [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop",
    ]
  },
  romantico: { 
    nome: "Romântico", 
    descricao: "Delicado e feminino. Babados, rendas, cores suaves e detalhes que contam histórias.", 
    dicas: ["Renda e babados são os teus melhores amigos", "Cores pastel ficam lindas em ti", "Detalhes delicados fazem a diferença"],
    pecas: ["Vestido de renda", "Blusa com babados", "Saia midi", "Scarpin nude"],
    cores: "from-pink-100 to-rose-200", 
    icone: "💕",
    paleta: ["#FFB6C1", "#FFC0CB", "#FF69B4", "#FFD1DC"],
    imagem: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop",
    galeria: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop",
    ]
  },
  casual: { 
    nome: "Casual Confort", 
    descricao: "Prático e versátil. O importante é sentires-te bem e estares pronta para qualquer ocasião.", 
    dicas: ["Conforto não significa descuidado", "Uma boa calça de ganga é essencial", "Acessórios simples completam o visual"],
    pecas: ["Jeans retos", "Camiseta branca", "Ténis confortáveis", "Mochila ou bag"],
    cores: "from-blue-100 to-sky-200", 
    icone: "👕",
    paleta: ["#4A90D9", "#87CEEB", "#B0C4DE", "#E6F3FF"],
    imagem: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
    galeria: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop",
    ]
  },
  tropical: { 
    nome: "Tropical Vibes", 
    descricao: "Colorido e vibrante. Estampas ousadas, cores que celebram a vida e energia pura.", 
    dicas: ["Não tenhas medo de cores fortes", "Misture estampas com criatividade", "Acessórios coloridos são fundamentais"],
    pecas: ["Vestido estampado", "Short de ganga", "Blusa colorida", "Sandálias rasteiras"],
    cores: "from-green-100 to-emerald-200", 
    icone: "🌴",
    paleta: ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF"],
    imagem: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop",
    galeria: [
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop",
    ]
  },
  minimalista: { 
    nome: "Minimalista", 
    descricao: "Simplicidade sofisticada. Menos é mais — peças atemporais e combinações perfeitas.", 
    dicas: ["Mantenha a paleta de cores neutra", "Invista em peças de qualidade", "Evite excesso de acessórios"],
    pecas: ["Camisa branca", "Calça preta", "Blazer neutro", "Sapatos lisos"],
    cores: "from-stone-100 to-stone-200", 
    icone: "◽",
    paleta: ["#F5F5F5", "#E0E0E0", "#BDBDBD", "#9E9E9E"],
    imagem: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&h=800&fit=crop",
    galeria: [
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    ]
  },
  rock: { 
    nome: "Rock Style", 
    descricao: "Atitude e rebeldia. Couro, tachas, preto e peças que definem quem és.", 
    dicas: ["O preto é a tua cor base", "Detalhes em couro e tachas são essenciais", "Misture peças duras com suaves"],
    pecas: ["Jaqueta de couro", "Calça preta", "Camiseta estampada", "Botas"],
    cores: "from-gray-300 to-gray-400", 
    icone: "🎸",
    paleta: ["#1C1C1C", "#333333", "#666666", "#999999"],
    imagem: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=800&fit=crop",
    galeria: [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop",
    ]
  },
  artístico: { 
    nome: "Artístico", 
    descricao: "Criativo e único. Misturas ousadas, texturas e peças que são verdadeiras obras de arte.", 
    dicas: ["Experimente texturas diferentes", "Misture estilos sem medo", "Use roupa como forma de expressão"],
    pecas: ["Peças de design", "Estampas únicas", "Acessórios artesanais", "Roupa vintage"],
    cores: "from-purple-100 to-violet-200", 
    icone: "🎨",
    paleta: ["#9B59B6", "#8E44AD", "#BB8FCE", "#D2B4DE"],
    imagem: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=800&fit=crop",
    galeria: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop",
    ]
  },
  sport: { 
    nome: "Sporty", 
    descricao: "Ativo e energético. Conforto em primeiro lugar, mas sempre com estilo.", 
    dicas: ["Linha de qualidade é investimento", "Cores neutras funcionam sempre", "Acessórios funcionais são bonus"],
    pecas: ["Leggings", "Camiseta técnica", "Ténis de running", "Mochila deportiva"],
    cores: "from-cyan-100 to-blue-200", 
    icone: "⚡",
    paleta: ["#3498DB", "#2ECC71", "#1ABC9C", "#16A085"],
    imagem: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
    galeria: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop",
    ]
  },
  preppy: { 
    nome: "Preppy", 
    descricao: "Refinado e jovem. Listras, argolas, paletas discretas e elegância estudantil.", 
    dicas: ["Listras são a tua marca registada", "Mantenha o visual arrumado", "Detalhes clássicos fazem a diferença"],
    pecas: ["Camisa de listras", "Polo", "Calça reta", "Sapatos de vela"],
    cores: "from-indigo-100 to-blue-200", 
    icone: "📚",
    paleta: ["#2C3E50", "#3498DB", "#ECF0F1", "#F39C12"],
    imagem: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop",
    galeria: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop",
    ]
  },
};

export default function DescobrirEstilo() {
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [pontuacoes, setPontuacoes] = useState<Record<string, number>>({});
  const [resultado, setResultado] = useState<string | null>(null);
  const [galeriaExpandida, setGaleriaExpandida] = useState(false);
  const [, setLocation] = useLocation();

  const { data: apiCategories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const handleResposta = (opcaoId: string, pontos: Record<string, number>) => {
    setRespostas({ ...respostas, [perguntaAtual]: opcaoId });

    const novasPontuacoes = { ...pontuacoes };
    Object.entries(pontos).forEach(([estilo, pontosGanhos]) => {
      novasPontuacoes[estilo] = (novasPontuacoes[estilo] || 0) + pontosGanhos;
    });
    setPontuacoes(novasPontuacoes);
  };

  const handleProxima = () => {
    if (perguntaAtual < PERGUNTAS.length - 1) {
      setPerguntaAtual(perguntaAtual + 1);
    } else {
      const estiloMaisPontos = Object.entries(pontuacoes).sort(([, a], [, b]) => b - a)[0];
      setResultado(estiloMaisPontos ? estiloMaisPontos[0] : "casual");
    }
  };

  const handleAnterior = () => {
    if (perguntaAtual > 0) {
      setPerguntaAtual(perguntaAtual - 1);
    }
  };

  const handleReiniciar = () => {
    setPerguntaAtual(0);
    setRespostas({});
    setPontuacoes({});
    setResultado(null);
    setGaleriaExpandida(false);
  };

  const estilo = resultado ? ESTILOS[resultado] : null;

  if (resultado && estilo) {
    return (
      <PageTransition>
        <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-stone-50 to-stone-100">
          <div className="max-w-2xl mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden"
            >
              {/* Header com imagem principal */}
              <div className="relative h-80">
                <img
                  src={estilo.imagem}
                  alt={estilo.nome}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="text-5xl mb-3"
                  >
                    {estilo.icone}
                  </motion.div>
                  <h1 className="text-3xl font-bold text-white mb-2">{estilo.nome}</h1>
                  <p className="text-white/90 text-sm leading-relaxed">{estilo.descricao}</p>
                </div>
              </div>

              {/* Galeria de imagens */}
              <div className="p-6 border-b border-gray-100">
                <button
                  onClick={() => setGaleriaExpandida(!galeriaExpandida)}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <div className="flex items-center gap-2">
                    <Shirt size={16} className="text-gray-500" />
                    <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Galeria de looks</h2>
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-400 transition-transform ${galeriaExpandida ? 'rotate-180' : ''}`} 
                  />
                </button>
                <AnimatePresence>
                  {galeriaExpandida && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-3 gap-2">
                        {estilo.galeria.map((img, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="aspect-[3/4] rounded-xl overflow-hidden"
                          >
                            <img
                              src={img}
                              alt={`Look ${i + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Paleta de Cores */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Palette size={16} className="text-gray-500" />
                  <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">A tua paleta de cores</h2>
                </div>
                <div className="flex gap-2">
                  {estilo.paleta.map((cor, i) => (
                    <div key={i} className="flex-1 h-12 rounded-xl shadow-inner" style={{ backgroundColor: cor }} />
                  ))}
                </div>
              </div>

              {/* Peças Essenciais */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Shirt size={16} className="text-gray-500" />
                  <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Peças essenciais</h2>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {estilo.pecas.map((peca, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-sm text-gray-700">{peca}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dicas de Estilo */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Star size={16} className="text-gray-500" />
                  <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Dicas de estilo</h2>
                </div>
                <div className="space-y-2">
                  {estilo.dicas.map((dica, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600">{dica}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp Button */}
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 bg-green-500 text-white rounded-2xl font-semibold hover:bg-green-600 transition-colors shadow-lg"
                >
                  <MessageCircle size={20} />
                  <span>Falar com especialista no WhatsApp</span>
                </a>
                <p className="text-xs text-gray-500 text-center mt-2">Tira as tuas dúvidas com a nossa equipa</p>
              </div>

              {/* Ações */}
              <div className="p-6">
                <div className="flex gap-3">
                  <button
                    onClick={handleReiniciar}
                    className="flex-1 py-3 px-4 border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Refazer quiz
                  </button>
                  <button
                    onClick={() => setLocation("/busca")}
                    className="flex-1 py-3 px-4 bg-foreground text-background rounded-full text-sm font-medium hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
                  >
                    Explorar lojas <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-stone-50 to-stone-100">
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-4"
            >
              <Sparkles size={28} className="text-purple-600" />
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Escola do Vestir</h1>
            <p className="text-sm text-muted-foreground">Descobre o teu estilo pessoal em 8 perguntas rápidas</p>
          </div>

          {/* Progresso */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-muted-foreground">Pergunta {perguntaAtual + 1} de {PERGUNTAS.length}</span>
              <span className="text-xs font-medium text-foreground">{Math.round(((perguntaAtual + 1) / PERGUNTAS.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((perguntaAtual + 1) / PERGUNTAS.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Pergunta */}
          <AnimatePresence mode="wait">
            <motion.div
              key={perguntaAtual}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-lg p-6 mb-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-6 leading-relaxed">
                {PERGUNTAS[perguntaAtual].texto}
              </h2>

              <div className="space-y-3">
                {PERGUNTAS[perguntaAtual].opcoes.map((opcao) => (
                  <button
                    key={opcao.id}
                    onClick={() => handleResposta(opcao.id, opcao.pontos)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                      respostas[perguntaAtual] === opcao.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{opcao.icone}</span>
                      <span className="text-sm text-foreground">{opcao.texto}</span>
                      {respostas[perguntaAtual] === opcao.id && (
                        <div className="ml-auto w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navegação */}
          <div className="flex gap-3">
            <button
              onClick={handleAnterior}
              disabled={perguntaAtual === 0}
              className="py-3 px-6 border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ArrowLeft size={14} /> Anterior
            </button>
            <button
              onClick={handleProxima}
              disabled={!respostas[perguntaAtual]}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {perguntaAtual === PERGUNTAS.length - 1 ? "Ver resultado" : "Próxima"} <ArrowRight size={14} />
            </button>
          </div>

          {/* WhatsApp Button */}
          <div className="mt-8">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors shadow-lg"
            >
              <MessageCircle size={16} />
              <span>Precisa de ajuda? Fale connosco</span>
            </a>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}