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
    theme: "Tecnologia & Electrónicos",
    route: "/explorar-tecnologia",
    keywords: ["tecnologia", "telemóvel", "iphone", "samsung", "computador", "tablet", "electrón", "electrod", "reparação", "internet", "software", "segurança"],
    categories: [
      { name: "Telemóveis & Tablets", subcategories: ["iPhone", "Samsung", "Xiaomi", "Tecno", "Infinix", "Huawei", "tablets", "acessórios"] },
      { name: "Computadores & Informática", subcategories: ["Portáteis", "computadores de mesa", "monitores", "impressoras", "teclados", "ratos", "armazenamento"] },
      { name: "Electrónica & Acessórios", subcategories: ["Televisores", "colunas", "auscultadores", "câmaras", "consolas", "acessórios electrónicos"] },
      { name: "Electrodomicílios", subcategories: ["Frigoríficos", "arcas", "fogões", "microondas", "máquinas de lavar", "climatização"] },
      { name: "Reparação & Assistência Técnica", subcategories: ["Telemóveis", "computadores", "televisores", "electrodomésticos"] },
      { name: "Internet & Telecomunicações", subcategories: ["Provedores de internet", "instalação", "routers", "redes"] },
      { name: "Software & Soluções Digitais", subcategories: ["Sites", "aplicativos", "sistemas empresariais", "software"] },
      { name: "Segurança Electrónica & Videovigilancia", subcategories: ["CCTV", "câmaras", "alarmes", "controlo de acesso"] },
    ],
  },
  {
    theme: "Alimentação & Restauração",
    route: "/explorar-alimentacao",
    keywords: ["restaurante", "comida", "pastelaria", "café", "fast food", "catering", "supermercado", "talho", "padaria", "bebida", "entrega"],
    categories: [
      { name: "Restaurantes", subcategories: ["Cozinha angolana", "africana", "internacional", "familiar", "especializada"] },
      { name: "Pastelarias & Cafés", subcategories: ["Cafés", "pastelarias", "casas de chá", "geladarias", "sobremesas"] },
      { name: "Fast Food & Take-away", subcategories: ["Hambúrgueres", "pizzas", "frango", "refeições rápidas", "take-away"] },
      { name: "Catering", subcategories: ["Festas", "casamentos", "empresas", "eventos", "buffet"] },
      { name: "Supermercados & Mercearias", subcategories: ["Supermercados", "minimercados", "mercearias", "lojas de conveniência"] },
      { name: "Talhos & Peixarias", subcategories: ["Carnes", "aves", "peixe", "marisco", "congelados"] },
      { name: "Padarias", subcategories: ["Pão", "produtos de padaria", "produção artesanal"] },
      { name: "Bebidas & Água", subcategories: ["Água mineral", "sumos", "refrigerantes", "distribuição de bebidas"] },
      { name: "Produtos Alimentares", subcategories: ["Produtos nacionais", "importados", "naturais", "congelados"] },
      { name: "Entregas de Comida", subcategories: ["Delivery de refeições", "entrega de compras", "entrega alimentar"] },
    ],
  },
  {
    theme: "Turismo & Lazer",
    route: "/explorar-turismo",
    keywords: ["turismo", "viagem", "passeio", "excursão", "parque", "lazer", "museu", "guia"],
    categories: [
      { name: "Agências de Viagens & Turismo", subcategories: ["Reservas", "viagens nacionais", "internacionais", "pacotes turísticos"] },
      { name: "Passeios & Excursões", subcategories: ["Excursões", "passeios de grupo", "visitas guiadas", "passeios privados"] },
      { name: "Experiências Turísticas", subcategories: ["Cultura", "gastronomia", "natureza", "aventura"] },
      { name: "Parques & Espaços de Lazer", subcategories: ["Parques", "espaços recreativos", "parques infantis", "centros de lazer"] },
      { name: "Actividades Recreativas", subcategories: ["Actividades ao ar livre", "aventura", "jogos", "entretenimento recreativo"] },
      { name: "Turismo Cultural", subcategories: ["Museus", "monumentos", "locais históricos", "cultura", "património"] },
      { name: "Guias Turísticos", subcategories: ["Guias locais", "culturais", "acompanhamento turístico"] },
    ],
  },
  {
    theme: "Desporto & Fitness",
    route: "/explorar-desporto",
    keywords: ["ginásio", "academia", "personal trainer", "futebol", "natação", "artes marciais", "desporto", "dança"],
    categories: [
      { name: "Ginásios & Academias", subcategories: ["Musculação", "cardio", "fitness", "aulas colectivas"] },
      { name: "Personal Trainers", subcategories: ["Treino individual", "funcional", "preparação física", "acompanhamento"] },
      { name: "Clubes & Escolas Desportivas", subcategories: ["Clubes", "academias", "escolas de formação desportiva"] },
      { name: "Futebol & Outras Modalidades", subcategories: ["Futebol", "basquetebol", "voleibol", "ténis", "outras modalidades"] },
      { name: "Natação", subcategories: ["Escolas de natação", "aulas individuais", "treino"] },
      { name: "Artes Marciais", subcategories: ["Judo", "karaté", "taekwondo", "boxe", "outras modalidades"] },
      { name: "Equipamentos & Artigos Desportivos", subcategories: ["Roupa desportiva", "calçado", "equipamentos", "acessórios"] },
      { name: "Dança & Actividades Físicas", subcategories: ["Dança", "zumba", "aeróbica", "outras actividades"] },
    ],
  },
  {
    theme: "Empregos & Oportunidades",
    route: "/explorar-empregos",
    keywords: ["emprego", "vaga", "estágio", "freelancer", "recrutamento"],
    categories: [
      { name: "Vagas de Emprego", subcategories: ["Tempo inteiro", "tempo parcial", "presencial", "remoto", "híbrido"] },
      { name: "Estágios Profissionais", subcategories: ["Estágio curricular", "estágio profissional", "programas para recém-formados"] },
      { name: "Primeiro Emprego", subcategories: ["Sem experiência", "programas para jovens", "vagas de entrada"] },
      { name: "Trabalho Temporário", subcategories: ["Eventos", "promoções", "trabalho sazonal", "substituições"] },
      { name: "Trabalho Freelancer", subcategories: ["Design", "fotografia", "vídeo", "tecnologia", "escrita", "marketing"] },
      { name: "Recrutamento & Seleção", subcategories: ["Empresas de recrutamento", "agências de emprego", "serviços de selecção"] },
    ],
  },
  {
    theme: "Agricultura & Agro-Negócio",
    route: "/explorar-agricultura",
    keywords: ["agricultura", "pecuária", "fazenda", "semente", "máquina agrícola", "aves", "pesca"],
    categories: [
      { name: "Agricultura & Produção Agrícola", subcategories: ["Cereais", "hortícolas", "frutas", "tubérculos", "outras culturas"] },
      { name: "Pecuária & Criação Animal", subcategories: ["Bovinos", "caprinos", "suínos", "outras criações"] },
      { name: "Produtores & Fazendas", subcategories: ["Fazendas", "cooperativas", "produtores individuais", "fornecedores agrícolas"] },
      { name: "Sementes, Fertilizantes & Insumos", subcategories: ["Sementes", "fertilizantes", "adubos", "materiais agrícolas"] },
      { name: "Máquinas & Equipamentos Agrícolas", subcategories: ["Tractores", "máquinas", "ferramentas", "irrigação"] },
      { name: "Avicultura", subcategories: ["Criação de aves", "produção de ovos", "pintos", "produtos avícolas"] },
      { name: "Pesca & Aquicultura", subcategories: ["Pesca", "piscicultura", "criação de peixe", "produção aquícola"] },
      { name: "Produtos Agrícolas", subcategories: ["Produtos frescos", "transformados", "produção local"] },
      { name: "Serviços & Consultoria Agrícola", subcategories: ["Assistência técnica", "consultoria", "formação agrícola"] },
    ],
  },
  {
    theme: "Influenciadores & Criadores",
    route: "/explorar-influenciadores",
    keywords: ["influenciador", "criador", "conteúdo", "ugc", "videomaker", "fotógrafo", "podcaster", "streamer", "modelo"],
    categories: [
      { name: "Influenciadores Digitais", subcategories: ["Moda", "Beleza", "Gastronomia", "Lifestyle", "Cristão", "Negócios", "Música"] },
      { name: "Criadores de Conteúdo", subcategories: ["Conteúdo para Redes Sociais", "Reels & Vídeos Curtos", "Conteúdo para Marcas"] },
      { name: "Criadores UGC", subcategories: ["Demonstração de Produtos", "Reviews", "Unboxing", "Testemunhos"] },
      { name: "Videomakers", subcategories: ["Vídeos Publicitários", "Reels", "Vídeos Institucionais", "Produção Audiovisual"] },
      { name: "Fotógrafos Comerciais", subcategories: ["Fotografia de Produtos", "Fotografia para Marcas", "Fotografia Corporativa"] },
      { name: "Apresentadores & Hosts", subcategories: ["Apresentadores para Marcas", "Apresentadores de Eventos", "Hosts Digitais"] },
      { name: "Podcasters", subcategories: ["Entrevistas", "Negócios", "Educação", "Entretenimento", "Cristão"] },
      { name: "Streamers", subcategories: ["Gaming", "Entretenimento", "Conversas & Lives", "Educação"] },
      { name: "Modelos para Marcas", subcategories: ["Moda", "Beleza", "Publicidade", "E-commerce"] },
    ],
  },
  {
    theme: "Transportes & Logística",
    route: "/explorar-transportes",
    keywords: ["transporte", "mudança", "entrega", "carga", "logística", "táxi", "interprovincial"],
    categories: [
      { name: "Transporte Interprovincial", subcategories: ["Passageiros", "Encomendas entre Províncias", "Mercadorias", "Cargas Interprovinciais"] },
      { name: "Mudanças & Transporte de Bens", subcategories: ["Mudanças Residenciais", "Mudanças de Escritórios", "Transporte de Móveis"] },
      { name: "Transporte de Passageiros", subcategories: ["Táxi", "Transporte Particular", "Transporte Executivo", "Transfers"] },
      { name: "Entregas & Estafetas", subcategories: ["Entrega de Encomendas", "Entrega de Documentos", "Entregas ao Domicílio"] },
      { name: "Cargas & Mercadorias", subcategories: ["Transporte de Mercadorias", "Cargas Ligeiras", "Cargas Pesadas", "Camiões"] },
      { name: "Logística Empresarial", subcategories: ["Distribuição de Mercadorias", "Logística para E-commerce", "Apoio Logístico"] },
      { name: "Aluguer de Viaturas de Carga", subcategories: ["Carrinhas de Carga", "Pickups", "Camiões", "Viaturas para Mudanças"] },
    ],
  },
  {
    theme: "Serviços Profissionais",
    route: "/explorar-servicos",
    keywords: ["documentação", "consultoria", "secretariado", "arquitectura", "tradução", "design", "cerimonial"],
    categories: [
      { name: "Documentação & Tramitação", subcategories: ["Documentação Empresarial", "Licenciamento", "Registos", "Despachante"] },
      { name: "Consultoria Especializada", subcategories: ["Consultoria de Imagem", "Consultoria de Carreira", "Consultoria Técnica"] },
      { name: "Secretariado & Assistência Profissional", subcategories: ["Assistentes Virtuais", "Secretariado Remoto", "Assistência Administrativa"] },
      { name: "Arquitectura & Engenharia", subcategories: ["Arquitectos", "Engenheiros Civis", "Desenho Técnico", "Fiscalização de Obras"] },
      { name: "Tradução & Interpretação", subcategories: ["Tradução de Documentos", "Tradução Técnica", "Intérpretes"] },
      { name: "Design & Serviços Criativos", subcategories: ["Design Gráfico", "Criação de Logótipos", "Identidade Visual", "Branding"] },
      { name: "Cerimonial & Protocolo", subcategories: ["Cerimonialistas", "Protocolo Empresarial", "Organização Protocolar"] },
    ],
  },
  {
    theme: "Saúde & Bem-Estar",
    route: "/explorar-saude",
    keywords: ["dentista", "médico", "clínica", "hospital", "psicólogo", "farmácia", "óptica", "nutrição", "fisioterapia"],
    categories: [
      { name: "Clínicas & Hospitais", subcategories: ["Clínica Geral", "Especialidades", "Laboratório", "Imagiologia"] },
      { name: "Médicos Particulares", subcategories: ["Clínica Geral", "Especialidades", "Consultas", "Domicílio"] },
      { name: "Medicina Dentária", subcategories: ["Dentista", "Ortodontia", "Implantes", "Clareamento"] },
      { name: "Saúde Mental & Psicologia", subcategories: ["Psicólogo", "Psiquiatria", "Terapia", "Aconselhamento"] },
      { name: "Farmácias", subcategories: ["Medicamentos", "Parafarmácia", "Entrega ao Domicílio"] },
      { name: "Ópticas & Saúde Visual", subcategories: ["Óculos", "Lentes de Contacto", "Exames Visuais"] },
      { name: "Nutrição & Dietética", subcategories: ["Nutricionista", "Dietas", "Acompanhamento"] },
      { name: "Fisioterapia & Reabilitação", subcategories: ["Fisioterapia", "Reabilitação", "Massagens"] },
    ],
  },
  {
    theme: "Beleza & Bem-Estar",
    route: "/explorar-beleza",
    keywords: ["cabelo", "unha", "maquiagem", "skincare", "barba", "salão", "beleza"],
    categories: [
      { name: "Cabelo", subcategories: ["Corte", "Tratamento", "Tintura", "Penteado"] },
      { name: "Unhas", subcategories: ["Manicure", "Pedicure", "Gel", "Acrylic"] },
      { name: "Maquiagem", subcategories: ["Maquiagem Profissional", "Maquiagem Diária", "Maquiagem para Eventos"] },
      { name: "Skincare", subcategories: ["Tratamentos Faciais", "Limpeza de Pele", "Produtos"] },
      { name: "Barba", subcategories: ["Barba", "Design de Sobrancelhas", "Aparência"] },
    ],
  },
  {
    theme: "Casa & Serviços",
    route: "/explorar-casa",
    keywords: ["casa", "limpeza", "canalização", "pintura", "jardim", "manutenção"],
    categories: [
      { name: "Limpeza", subcategories: ["Limpeza Residencial", "Limpeza Comercial", "Limpeza Pós-Obra"] },
      { name: "Canalização", subcategories: ["Reparações", "Instalações", "Desentupimentos"] },
      { name: "Pintura", subcategories: ["Pintura Residencial", "Pintura Comercial", "Decorativa"] },
      { name: "Jardinagem", subcategories: ["Paisagismo", "Manutenção", "Irrigação"] },
    ],
  },
  {
    theme: "Automóveis & Mobilidade",
    route: "/explorar-automoveis",
    keywords: ["carro", "viatura", "mecânico", "seguro", "automóvel", "veículo"],
    categories: [
      { name: "Vendas de Viaturas", subcategories: ["Novas", "Usadas", "Importação"] },
      { name: "Mecânica", subcategories: ["Reparações", "Manutenção", "Diagnóstico"] },
      { name: "Seguros", subcategories: ["Seguro Auto", "Seguro Obrigatório", "Seguro Facultativo"] },
    ],
  },
  {
    theme: "Casamentos",
    route: "/explorar",
    keywords: ["casamento", "noiva", "wedding", "celebração"],
    categories: [
      { name: "Planeamento", subcategories: ["Wedding Planner", "Organização", "Assessoria"] },
      { name: "Beleza", subcategories: ["Maquilhagem", "Cabelo", "Vestuário"] },
      { name: "Fotografia", subcategories: ["Fotógrafo", "Videógrafo", "Drone"] },
    ],
  },
  {
    theme: "Formações",
    route: "/explorar-formacoes",
    keywords: ["curso", "formação", "aula", "idioma", "treinamento"],
    categories: [
      { name: "Idiomas", subcategories: ["Inglês", "Francês", "Espanhol", "Mandarim"] },
      { name: "Tecnologia", subcategories: ["Programação", "Design", "Marketing Digital"] },
      { name: "Negócios", subcategories: ["Empreendedorismo", "Gestão", "Finanças"] },
    ],
  },
  {
    theme: "Infantil & Maternidade",
    route: "/explorar-infantil",
    keywords: ["bebê", "criança", "brinquedo", "maternidade", "enxoval"],
    categories: [
      { name: "Moda Infantil", subcategories: ["Roupas", "Calçado", "Acessórios"] },
      { name: "Brinquedos", subcategories: ["Educativos", "Eletrónicos", "Pelúcia"] },
      { name: "Enxoval", subcategories: ["Bebé", "Grávida", "Puericultura"] },
    ],
  },
  {
    theme: "Imóveis & Alojamento",
    route: "/explorar-imoveis",
    keywords: ["imóvel", "apartamento", "casa", "arrendamento", "hotel", "alojamento"],
    categories: [
      { name: "Arrendamento", subcategories: ["Apartamentos", "Casas", "Escritórios"] },
      { name: "Venda", subcategories: ["Terrenos", "Apartamentos", "Casas"] },
      { name: "Alojamento", subcategories: ["Hotéis", "Pensões", "Apartamentos"] },
    ],
  },
  {
    theme: "Eventos & Celebrações",
    route: "/explorar-eventos",
    keywords: ["evento", "festa", "aniversário", "conferência", "seminário"],
    categories: [
      { name: "Eventos Corporativos", subcategories: ["Conferências", "Seminários", "Workshops"] },
      { name: "Festas", subcategories: ["Aniversários", "Festas de Ano Novo", "Festas Temáticas"] },
      { name: "Decoração", subcategories: ["Flores", "Iluminação", "Mobiliário"] },
    ],
  },
  {
    theme: "Serviços de Amor",
    route: "/explorar-love",
    keywords: ["amor", "presente", "flores", "surpresa", "romântico"],
    categories: [
      { name: "Presentes", subcategories: ["Flores", "Cartões", "Presentes Personalizados"] },
      { name: "Surpresas", subcategories: ["Pedidos de Casamento", "Aniversários", "Romantismo"] },
    ],
  },
  {
    theme: "Negócios & Finanças",
    route: "/explorar-business",
    keywords: ["negócio", "finança", "investimento", "consultoria", "empresa"],
    categories: [
      { name: "Consultoria", subcategories: ["Estratégia", "Gestão", "Marketing"] },
      { name: "Finanças", subcategories: ["Investimento", "Crédito", "Seguros"] },
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

const GlobalSearch = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [location, navigate] = useLocation();

  const suggestions = useMemo(() => {
    if (query.length < 2) return [];

    const lowerQuery = query.toLowerCase();
    const results: SearchSuggestion[] = [];

    THEME_MAPPINGS.forEach((theme) => {
      const matchedKeyword = theme.keywords.find((kw) =>
        kw.toLowerCase().includes(lowerQuery)
      );

      if (matchedKeyword) {
        results.push({
          theme,
          category: null,
          subcategory: null,
          matchedKeyword,
        });

        theme.categories.forEach((cat) => {
          if (cat.name.toLowerCase().includes(lowerQuery)) {
            results.push({
              theme,
              category: cat.name,
              subcategory: null,
              matchedKeyword: cat.name,
            });
          }

          cat.subcategories.forEach((sub) => {
            if (sub.toLowerCase().includes(lowerQuery)) {
              results.push({
                theme,
                category: cat.name,
                subcategory: sub,
                matchedKeyword: sub,
              });
            }
          });
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

    return uniqueResults.slice(0, 8);
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
            <Search className="h-5 w-5 text-gray-400" />
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
            className="w-full pl-12 pr-10 py-4 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B89A78] focus:border-transparent shadow-sm transition-all duration-200"
          />

          {query && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
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
            className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="max-h-96 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={`${suggestion.theme.route}-${suggestion.category}-${suggestion.subcategory}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors duration-150 ${
                    highlightedIndex === index
                      ? "bg-[#B89A78]/10"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <span className="text-2xl flex-shrink-0">
                    {getThemeIcon(suggestion.theme.theme)}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 truncate">
                      {suggestion.theme.theme}
                    </div>

                    {suggestion.category && (
                      <div className="text-sm text-gray-500 truncate">
                        {suggestion.category}
                        {suggestion.subcategory && (
                          <span className="text-[#B89A78]">
                            {" "}
                            → {suggestion.subcategory}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="text-xs text-gray-400 mt-0.5">
                      {suggestion.matchedKeyword}
                    </div>
                  </div>

                  <svg
                    className="h-5 w-5 text-gray-300 flex-shrink-0"
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

            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                Pressione <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs">↑</kbd>{" "}
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs">↓</kbd> para navegar,{" "}
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs">Enter</kbd> para selecionar
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
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="px-4 py-8 text-center">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              Nenhum resultado encontrado para "{query}"
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Tente com outros termos ou navegue pelas categorias
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GlobalSearch;
