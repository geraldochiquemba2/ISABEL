import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const WHATSAPP_NUMBER = "922001778";
const WHATSAPP_LINK = `https://wa.me/244${WHATSAPP_NUMBER}?text=Olá! Gostaria de ajuda com dicas de estilo!`;

interface DicaEstilo {
  id: number;
  titulo: string;
  descricao: string;
  imagem: string;
  dicas: string[];
}

const DICAS_DEFAULT: DicaEstilo[] = [
  {
    id: 1,
    titulo: "Como escolher as cores certas para ti",
    descricao: "Descubre quais cores combinam com o teu tom de pele e personalidade.",
    imagem: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=500&fit=crop",
    dicas: ["Observa as veias no teu pulso — se parecerem azuis, tens tom frio", "Pessoas com tom quente ficam lindas em dourados e terracota", "Pessoas com tom frio ficam lindas em prateados e azuis"]
  },
  {
    id: 2,
    titulo: "Peças essenciais que toda mulher deve ter",
    descricao: "Uma lista das peças básicas que nunca passam de moda.",
    imagem: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=500&fit=crop",
    dicas: ["Um blazer bem cortado", "Calça de ganga de boa qualidade", "Camisa branca impecável", "Vestido preto clássico"]
  },
  {
    id: 3,
    titulo: "Como combinar estampas sem erro",
    descricao: "Dicas para misturar estampas com confiança e estilo.",
    imagem: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=500&fit=crop",
    dicas: ["Mantenha uma cor em comum entre as estampas", "Misture estampas de tamanhos diferentes", "Comece com preto e branco"]
  },
  {
    id: 4,
    titulo: "Acessórios que fazem a diferença",
    descricao: "Como usar acessórios para elevar qualquer visual.",
    imagem: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=500&fit=crop",
    dicas: ["Um relógio elegante nunca sai de moda", "Colares em camadas estão em alta", "Óculos de sol são sempre um bom investimento"]
  }
];

export default function DescobrirEstilo() {
  const { data: dicas = DICAS_DEFAULT } = useQuery({
    queryKey: ["style-tips"],
    queryFn: async () => {
      const res = await fetch("/api/style-tips");
      if (!res.ok) return DICAS_DEFAULT;
      return res.json();
    },
  });

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-stone-50 to-stone-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Dicas de Estilo</h1>
            <p className="text-white/90 text-lg">Descubra como expressar a sua personalidade através da moda</p>
          </div>
        </div>

        {/* Dicas */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="space-y-8">
            {dicas.map((dica, index) => (
              <motion.article
                key={dica.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-lg overflow-hidden"
              >
                <div className="md:flex">
                  <div className="md:w-2/5">
                    <img
                      src={dica.imagem}
                      alt={dica.titulo}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-3/5 p-6 md:p-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{dica.titulo}</h2>
                    <p className="text-gray-600 mb-5">{dica.descricao}</p>
                    <ul className="space-y-3">
                      {dica.dicas.map((dicaItem, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-6 h-6 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-gray-700">{dicaItem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 rounded-3xl p-8 text-center text-white"
          >
            <h3 className="text-2xl font-bold mb-3">Precisa de ajuda personalizada?</h3>
            <p className="text-white/90 mb-6">Fale com a nossa equipa de especialistas e descubra o estilo perfeito para si.</p>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-yellow-600 px-8 py-4 rounded-full font-bold hover:bg-white/90 transition-colors shadow-lg"
            >
              <MessageCircle size={20} />
              <span>Falar no WhatsApp</span>
            </a>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
