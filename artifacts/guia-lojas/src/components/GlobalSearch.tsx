import { useState, useMemo, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ThemeMapping {
  theme: string;
  route: string;
  keywords: string[];
  categories: { name: string; subcategories: string[] }[];
}

const THEME_MAPPINGS: ThemeMapping[] = [
  {
    theme: "Casamentos",
    route: "/explorar",
    keywords: [
      "casamento", "noiva", "noivo", "wedding", "celebração", "fotógrafo", "fotografia", "foto", 
      "videógrafo", "festa", "bolo", "vestido", "buffet", "decoração", "cerimonial", "música", "alianças", "convites"
    ],
    categories: [
      { name: "Planeamento & Organização", subcategories: ["Wedding Planner", "Organização", "Assessoria", "Cerimonial"] },
      { name: "Beleza & Noiva", subcategories: ["Maquilhagem", "Cabelo", "Vestido de Noiva", "Traje de Noivo"] },
      { name: "Fotografia & Vídeo", subcategories: ["Fotógrafo", "Fotografia", "Videógrafo", "Drone", "Ensaio Pré-Casamento", "Álbum de Casamento"] },
      { name: "Decoração & Espaço", subcategories: ["Decoração", "Flores", "Iluminação", "Espaço de Festas", "Catering", "Bolo de Noiva"] },
    ],
  },
  {
    theme: "Eventos & Celebrações",
    route: "/explorar-eventos",
    keywords: [
      "evento", "festa", "aniversário", "conferência", "seminário", "fotógrafo", "fotografia", "foto",
      "buffet", "catering", "decoração", "música", "dj", "animação", "espaço", "tendas", "gala"
    ],
    categories: [
      { name: "Eventos Corporativos", subcategories: ["Conferências", "Seminários", "Workshops", "Galas Empresariais"] },
      { name: "Festas & Celebrações", subcategories: ["Aniversários", "Festas de Ano Novo", "Festas Temáticas", "Batizados"] },
      { name: "Decoração & Ambientes", subcategories: ["Flores", "Iluminação", "Mobiliário para Festas", "Tendas"] },
      { name: "Fotografia & Audiovisual", subcategories: ["Fotógrafo de Eventos", "Fotografia", "Videomaker", "Som & Luz", "DJ & Música"] },
      { name: "Catering & Restauração", subcategories: ["Buffet", "Bolo de Festa", "Bebidas", "Garçons & Equipa"] },
    ],
  },
  {
    theme: "Serviços de Amor",
    route: "/explorar-love",
    keywords: [
      "amor", "presente", "flores", "surpresa", "romântico", "fotografia", "fotógrafo", "foto", "buquê", "ensaio"
    ],
    categories: [
      { name: "Presentes & Buquês", subcategories: ["Flores", "Cartões", "Presentes Personalizados", "Buquês de Rosas"] },
      { name: "Surpresas Românticas", subcategories: ["Pedidos de Casamento", "Aniversários de Namoro", "Jantares Românticos"] },
      { name: "Fotografia de Casais", subcategories: ["Fotógrafo de Casais", "Sessão Namorados", "Ensaio Romântico"] },
    ],
  },
  {
    theme: "Influenciadores & Criadores",
    route: "/explorar-influenciadores",
    keywords: [
      "influenciador", "criador", "conteúdo", "ugc", "videomaker", "fotógrafo", "fotografia", "foto", "podcaster", "streamer", "modelo"
    ],
    categories: [
      { name: "Fotógrafos Comerciais", subcategories: ["Fotógrafo de Produtos", "Fotógrafo para Marcas", "Fotografia Corporativa", "Ensaios"] },
      { name: "Videomakers", subcategories: ["Vídeos Publicitários", "Reels & TikTok", "Vídeos Institucionais", "Produção Audiovisual"] },
      { name: "Influenciadores Digitais", subcategories: ["Moda", "Beleza", "Gastronomia", "Lifestyle", "Cristão", "Negócios", "Música"] },
      { name: "Criadores UGC", subcategories: ["Demonstração de Produtos", "Reviews", "Unboxing", "Testemunhos"] },
      { name: "Apresentadores & Podcasters", subcategories: ["Hosts de Eventos", "Entrevistas", "Podcasts"] },
    ],
  },
  {
    theme: "Serviços Profissionais",
    route: "/explorar-servicos",
    keywords: [
      "documentação", "consultoria", "secretariado", "arquitectura", "tradução", "design", "cerimonial", "fotógrafo", "fotografia"
    ],
    categories: [
      { name: "Design & Fotografia", subcategories: ["Design Gráfico", "Fotógrafo Profissional", "Branding", "Criação de Logótipos"] },
      { name: "Documentação & Tramitação", subcategories: ["Documentação Empresarial", "Licenciamento", "Registos", "Despachante"] },
      { name: "Consultoria Especializada", subcategories: ["Consultoria de Imagem", "Consultoria de Carreira", "Consultoria Técnica"] },
      { name: "Arquitectura & Engenharia", subcategories: ["Arquitectos", "Engenheiros Civis", "Desenho Técnico", "Fiscalização de Obras"] },
      { name: "Tradução & Interpretação", subcategories: ["Tradução de Documentos", "Tradução Técnica", "Intérpretes"] },
      { name: "Cerimonial & Protocolo", subcategories: ["Cerimonialistas", "Protocolo Empresarial"] },
    ],
  },
  {
    theme: "Beleza & Bem-Estar",
    route: "/explorar-beleza",
    keywords: ["cabelo", "unha", "maquiagem", "skincare", "barba", "salão", "beleza", "estética", "massagem", "spa"],
    categories: [
      { name: "Cabelo", subcategories: ["Corte", "Tratamento", "Tintura", "Penteado", "Tranças"] },
      { name: "Unhas", subcategories: ["Manicure", "Pedicure", "Gel", "Acrílico", "Nail Art"] },
      { name: "Maquiagem", subcategories: ["Maquiagem Profissional", "Maquiagem de Noiva", "Maquiagem para Eventos"] },
      { name: "Skincare & Estética", subcategories: ["Tratamentos Faciais", "Limpeza de Pele", "Massagens", "Spa"] },
      { name: "Barba & Barbearia", subcategories: ["Barba", "Design de Sobrancelhas", "Barbearia"] },
    ],
  },
  {
    theme: "Formações",
    route: "/explorar-formacoes",
    keywords: ["curso", "formação", "aula", "idioma", "treinamento", "workshop", "certificado"],
    categories: [
      { name: "Idiomas", subcategories: ["Inglês", "Francês", "Espanhol", "Mandarim"] },
      { name: "Tecnologia & Programação", subcategories: ["Programação", "Design UI/UX", "Marketing Digital", "Sistemas"] },
      { name: "Negócios & Gestão", subcategories: ["Empreendedorismo", "Gestão de Empresas", "Finanças", "Liderança"] },
    ],
  },
  {
    theme: "Infantil & Maternidade",
    route: "/explorar-infantil",
    keywords: ["bebê", "criança", "brinquedo", "maternidade", "enxoval", "festa infantil", "fotógrafo infantil"],
    categories: [
      { name: "Moda Infantil", subcategories: ["Roupas de Bebé", "Calçado Infantil", "Acessórios"] },
      { name: "Brinquedos & Jogos", subcategories: ["Educativos", "Eletrónicos", "Pelúcia", "Jogos"] },
      { name: "Enxoval & Puericultura", subcategories: ["Enxoval de Bebé", "Carrinhos", "Quarto do Bebé"] },
      { name: "Fotografia Infantil", subcategories: ["Ensaio Newborn", "Fotógrafo Infantil", "Festa Infantil"] },
    ],
  },
  {
    theme: "Imóveis & Alojamento",
    route: "/explorar-imoveis",
    keywords: ["imóvel", "apartamento", "casa", "arrendamento", "hotel", "alojamento", "terreno", "estadia"],
    categories: [
      { name: "Arrendamento", subcategories: ["Apartamentos T1/T2/T3", "Casas", "Escritórios", "Lojas"] },
      { name: "Venda de Imóveis", subcategories: ["Terrenos", "Apartamentos", "Vivendas", "Espaços Comerciais"] },
      { name: "Alojamento & Hotéis", subcategories: ["Hotéis", "Pensões", "Guesthouses", "Apartamentos de Férias"] },
    ],
  },
  {
    theme: "Alimentação & Restauração",
    route: "/explorar-alimentacao",
    keywords: ["restaurante", "comida", "pastelaria", "café", "fast food", "catering", "supermercado", "talho", "padaria", "bebida", "entrega", "bolo"],
    categories: [
      { name: "Restaurantes", subcategories: ["Cozinha Angolana", "Africana", "Internacional", "Marisqueira"] },
      { name: "Pastelarias & Cafés", subcategories: ["Cafés", "Pastelarias", "Geladarias", "Bolos de Aniversário"] },
      { name: "Fast Food & Take-away", subcategories: ["Hambúrgueres", "Pizzas", "Frango Assado", "Take-away"] },
      { name: "Catering & Eventos", subcategories: ["Buffet de Festas", "Catering Empresarial", "Banquetes"] },
      { name: "Supermercados & Mercearias", subcategories: ["Supermercados", "Minimercados", "Talhos", "Peixarias"] },
    ],
  },
  {
    theme: "Tecnologia & Electrónicos",
    route: "/explorar-tecnologia",
    keywords: ["tecnologia", "telemóvel", "iphone", "samsung", "computador", "tablet", "electrón", "reparação", "internet", "software", "câmara"],
    categories: [
      { name: "Telemóveis & Tablets", subcategories: ["iPhone", "Samsung", "Xiaomi", "Tecno", "Tablets", "Acessórios"] },
      { name: "Computadores & Informática", subcategories: ["Portáteis", "Desktops", "Monitores", "Impressoras"] },
      { name: "Electrónica & Fotografia", subcategories: ["Televisores", "Colunas", "Auscultadores", "Câmaras Fotográficas", "Drones"] },
      { name: "Reparação & Assistência", subcategories: ["Reparação de Telemóveis", "Computadores", "Electrodomésticos"] },
    ],
  },
  {
    theme: "Negócios & Finanças",
    route: "/explorar-business",
    keywords: ["negócio", "finança", "investimento", "consultoria", "empresa", "crédito", "seguros", "contabilidade"],
    categories: [
      { name: "Consultoria Empresarial", subcategories: ["Estratégia", "Gestão", "Marketing", "Contabilidade"] },
      { name: "Finanças & Seguros", subcategories: ["Investimentos", "Crédito", "Seguros Empresariais", "Banca"] },
    ],
  },
  {
    theme: "Saúde & Bem-Estar",
    route: "/explorar-saude",
    keywords: ["dentista", "médico", "clínica", "hospital", "psicólogo", "farmácia", "óptica", "nutrição", "fisioterapia"],
    categories: [
      { name: "Clínicas & Hospitais", subcategories: ["Clínica Geral", "Especialidades Médicas", "Laboratórios"] },
      { name: "Medicina Dentária", subcategories: ["Dentista", "Ortodontia", "Implantes", "Branqueamento"] },
      { name: "Saúde Mental & Psicologia", subcategories: ["Psicólogo", "Psiquiatria", "Terapia de Casal"] },
      { name: "Farmácias & Ópticas", subcategories: ["Medicamentos", "Óculos", "Lentes de Contacto"] },
    ],
  },
  {
    theme: "Turismo & Lazer",
    route: "/explorar-turismo",
    keywords: ["turismo", "viagem", "passeio", "excursão", "parque", "lazer", "museu", "guia", "resort"],
    categories: [
      { name: "Agências de Viagens & Turismo", subcategories: ["Reservas", "Viagens Nacionais", "Pacotes Turísticos"] },
      { name: "Passeios & Excursões", subcategories: ["Excursões", "Visitas Guiadas", "Passeios de Barco"] },
      { name: "Parques & Lazer", subcategories: ["Parques Recreativos", "Resorts", "Espaços de Lazer"] },
    ],
  },
  {
    theme: "Desporto & Fitness",
    route: "/explorar-desporto",
    keywords: ["ginásio", "academia", "personal trainer", "futebol", "natação", "artes marciais", "desporto", "dança"],
    categories: [
      { name: "Ginásios & Academias", subcategories: ["Musculação", "Cardio", "Fitness", "Crossfit"] },
      { name: "Personal Trainers", subcategories: ["Treino Individual", "Preparação Física", "Nutrição Desportiva"] },
      { name: "Modalidades Desportivas", subcategories: ["Futebol", "Basquetebol", "Natação", "Artes Marciais", "Dança"] },
    ],
  },
  {
    theme: "Empregos & Oportunidades",
    route: "/explorar-empregos",
    keywords: ["emprego", "vaga", "estágio", "freelancer", "recrutamento", "fotógrafo", "designer"],
    categories: [
      { name: "Vagas de Emprego", subcategories: ["Tempo Inteiro", "Tempo Parcial", "Presencial", "Remoto"] },
      { name: "Trabalho Freelancer", subcategories: ["Design", "Fotografia", "Vídeo", "Programação", "Marketing"] },
      { name: "Estágios & Recrutamento", subcategories: ["Estágios Profissionais", "Empresas de Recrutamento"] },
    ],
  },
  {
    theme: "Agricultura & Agro-Negócio",
    route: "/explorar-agricultura",
    keywords: ["agricultura", "pecuária", "fazenda", "semente", "máquina agrícola", "aves", "pesca"],
    categories: [
      { name: "Produção Agrícola & Fazendas", subcategories: ["Cereais", "Hortícolas", "Frutas", "Fazendas"] },
      { name: "Pecuária & Avicultura", subcategories: ["Criação Animal", "Produção de Ovos", "Aves"] },
      { name: "Máquinas & Insumos", subcategories: ["Tractores", "Ferramentas", "Sementes", "Fertilizantes"] },
    ],
  },
  {
    theme: "Transportes & Logística",
    route: "/explorar-transportes",
    keywords: ["transporte", "mudança", "entrega", "carga", "logística", "táxi", "interprovincial"],
    categories: [
      { name: "Transporte Interprovincial", subcategories: ["Passageiros", "Encomendas entre Províncias", "Cargas"] },
      { name: "Mudanças & Entregas", subcategories: ["Mudanças Residenciais", "Entregas Rápidas", "Estafetas"] },
    ],
  },
  {
    theme: "Casa & Serviços",
    route: "/explorar-casa",
    keywords: ["casa", "limpeza", "canalização", "pintura", "jardim", "manutenção", "obra"],
    categories: [
      { name: "Limpeza & Manutenção", subcategories: ["Limpeza Residencial", "Limpeza Comercial", "Limpeza Pós-Obra"] },
      { name: "Reparações & Obras", subcategories: ["Canalização", "Pintura", "Electricidade", "Jardinagem"] },
    ],
  },
  {
    theme: "Automóveis & Mobilidade",
    route: "/explorar-automoveis",
    keywords: ["carro", "viatura", "mecânico", "seguro", "automóvel", "veículo", "peças"],
    categories: [
      { name: "Venda & Aluguer", subcategories: ["Viaturas Novas", "Usadas", "Aluguer de Carros"] },
      { name: "Mecânica & Reparação", subcategories: ["Mecânica Geral", "Diagnóstico", "Pneus", "Peças"] },
    ],
  },
];

interface SearchSuggestion {
  theme: ThemeMapping;
  category: string | null;
  subcategory: string | null;
  matchedKeyword: string;
}

const ROUTE_TO_STORE: Record<string, string> = {
  "/explorar-tecnologia": "tecnologia-electronicos",
  "/explorar-alimentacao": "alimentacao-restauracao",
  "/explorar-turismo": "turismo-lazer",
  "/explorar-desporto": "desporto-fitness",
  "/explorar-empregos": "empregos-oportunidades",
  "/explorar-agricultura": "agricultura-agronegocio",
  "/explorar-influenciadores": "influenciadores-criadores",
  "/explorar-transportes": "transportes-logistica",
  "/explorar-servicos": "servicos-profissionais",
  "/explorar-saude": "saude",
  "/explorar-beleza": "beleza",
  "/explorar-casa": "casa",
  "/explorar-automoveis": "automoveis",
  "/explorar": "weddings",
  "/explorar-formacoes": "formacoes",
  "/explorar-infantil": "infantil",
  "/explorar-imoveis": "imoveis",
  "/explorar-eventos": "eventos",
  "/explorar-love": "love-services",
  "/explorar-business": "business",
};

const normalize = (str: string) =>
  str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const GlobalSearch = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();

  const suggestions = useMemo(() => {
    if (query.trim().length < 2) return [];

    const normQuery = normalize(query.trim());
    const results: SearchSuggestion[] = [];

    THEME_MAPPINGS.forEach((theme) => {
      const normTheme = normalize(theme.theme);
      const isThemeMatch = normTheme.includes(normQuery);

      const matchedKeyword = theme.keywords.find((kw) =>
        normalize(kw).includes(normQuery)
      );

      // Check subcategories unconditionally
      theme.categories.forEach((cat) => {
        const normCat = normalize(cat.name);
        const isCatMatch = normCat.includes(normQuery);

        cat.subcategories.forEach((sub) => {
          const normSub = normalize(sub);
          if (normSub.includes(normQuery)) {
            results.push({
              theme,
              category: cat.name,
              subcategory: sub,
              matchedKeyword: sub,
            });
          }
        });

        if (isCatMatch) {
          results.push({
            theme,
            category: cat.name,
            subcategory: null,
            matchedKeyword: cat.name,
          });
        } else if ((isThemeMatch || matchedKeyword) && !results.some(r => r.theme.route === theme.route && r.category === cat.name)) {
          results.push({
            theme,
            category: cat.name,
            subcategory: null,
            matchedKeyword: matchedKeyword || theme.theme,
          });
        }
      });

      if ((isThemeMatch || matchedKeyword) && !results.some(r => r.theme.route === theme.route)) {
        results.push({
          theme,
          category: null,
          subcategory: null,
          matchedKeyword: matchedKeyword || theme.theme,
        });
      }
    });

    const uniqueResults = results.filter(
      (result, index, self) =>
        index ===
        self.findIndex(
          (r) =>
            r.theme.route === result.theme.route &&
            r.category === result.category &&
            r.subcategory === result.subcategory
        )
    );

    return uniqueResults.slice(0, 10);
  }, [query]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelectSuggestion(suggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    const { theme, category, subcategory } = suggestion;
    let route = theme.route;

    const currentStore = localStorage.getItem("eliora-selected-store");
    const storeId = ROUTE_TO_STORE[route];

    if (!currentStore && storeId) {
      localStorage.setItem("eliora-selected-store", storeId);
      window.location.href = route;
      return;
    }

    if (category) {
      route += `?category=${encodeURIComponent(category)}`;
      if (subcategory) {
        route += `&subcategory=${encodeURIComponent(subcategory)}`;
      }
    }

    navigate(route);
    setQuery("");
    setIsOpen(false);
  };

  const clearSearch = () => {
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const getThemeIcon = (theme: string) => {
    const icons: Record<string, string> = {
      "Tecnologia & Electrónicos": "💻",
      "Alimentação & Restauração": "🍽️",
      "Turismo & Lazer": "🌍",
      "Desporto & Fitness": "💪",
      "Empregos & Oportunidades": "💼",
      "Agricultura & Agro-Negócio": "🌾",
      "Influenciadores & Criadores": "📱",
      "Transportes & Logística": "🚚",
      "Serviços Profissionais": "👔",
      "Saúde & Bem-Estar": "🏥",
      "Beleza & Bem-Estar": "💇",
      "Casa & Serviços": "🏠",
      "Automóveis & Mobilidade": "🚗",
      Casamentos: "💒",
      Formações: "📚",
      "Infantil & Maternidade": "👶",
      "Imóveis & Alojamento": "🏘️",
      "Eventos & Celebrações": "🎉",
      "Serviços de Amor": "❤️",
      "Negócios & Finanças": "💰",
    };
    return icons[theme] || "🔍";
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#A96F12]" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(e.target.value.length >= 2);
            }}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="O que procuras?"
            className="w-full pl-12 pr-10 py-3.5 bg-[#FFFFFF] border border-[#E8CC91] rounded-2xl text-[#111111] placeholder-[#6F6F6F] focus:outline-none focus:ring-2 focus:ring-[#C99432] focus:border-transparent shadow-[0_2px_12px_rgba(201,148,50,0.06)] transition-all duration-200"
          />

          {query && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#6F6F6F] hover:text-[#111111] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white border border-[#E8CC91] rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="max-h-96 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={`${suggestion.theme.route}-${suggestion.category}-${suggestion.subcategory}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors duration-150 ${
                    highlightedIndex === index
                      ? "bg-[#C99432]/10"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <span className="text-2xl flex-shrink-0">
                    {getThemeIcon(suggestion.theme.theme)}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#111111] truncate">
                      {suggestion.theme.theme}
                    </div>

                    {suggestion.category && (
                      <div className="text-sm text-[#6F6F6F] truncate">
                        {suggestion.category}
                        {suggestion.subcategory && (
                          <span className="text-[#A96F12] font-medium">
                            {" "}
                            → {suggestion.subcategory}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="text-xs text-[#A96F12]/80 mt-0.5 font-medium">
                      {suggestion.matchedKeyword}
                    </div>
                  </div>

                  <svg
                    className="h-5 w-5 text-[#C99432] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.button>
              ))}
            </div>

            <div className="px-4 py-3 bg-[#FFFDF8] border-t border-[#E8CC91]/60">
              <p className="text-xs text-[#6F6F6F] text-center">
                Pressione <kbd className="px-1.5 py-0.5 bg-white border border-[#E8CC91] rounded text-xs">↑</kbd>{" "}
                <kbd className="px-1.5 py-0.5 bg-white border border-[#E8CC91] rounded text-xs">↓</kbd> para navegar,{" "}
                <kbd className="px-1.5 py-0.5 bg-white border border-[#E8CC91] rounded text-xs">Enter</kbd> para selecionar
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && query.length >= 2 && suggestions.length === 0 && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute z-50 w-full mt-2 bg-white border border-[#E8CC91] rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="px-4 py-8 text-center">
            <Search className="h-12 w-12 text-[#A96F12]/40 mx-auto mb-3" />
            <p className="text-[#111111] font-medium">
              Nenhum resultado encontrado para "{query}"
            </p>
            <p className="text-sm text-[#6F6F6F] mt-1">
              Tente com outros termos ou navegue pelas categorias
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GlobalSearch;
