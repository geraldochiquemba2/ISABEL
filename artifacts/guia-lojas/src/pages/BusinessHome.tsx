import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ArrowDown,
  Check,
  ChevronDown,
  CircleDollarSign,
  Compass,
  Landmark,
  Menu,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
  X as XIcon,
} from "lucide-react";

type ServiceCategory = {
  number: string;
  title: string;
  intro: string;
  icon: typeof Compass;
  accent: string;
  services: string[];
};

const categoryImages: Record<string, string> = {
  "01": "/business/strategy.jpg",
  "02": "/business/finance.jpg",
  "03": "/business/marketing.jpg",
  "04": "/business/legal.jpg",
  "05": "/business/team.jpg",
  "06": "/business/investment.jpg",
};

const categories: ServiceCategory[] = [
  {
    number: "01",
    title: "Consultoria, Estratégia e Gestão Empresarial",
    intro: "Decisões mais claras para negócios prontos para avançar.",
    icon: Compass,
    accent: "#b88a3b",
    services: [
      "Consultoria de Negócios e Gestão Estratégica",
      "Elaboração de Planos de Negócio e Viabilidade Económica",
      "Mapeamento, Reestruturação e Otimização de Processos",
      "Mentoria para Empreendedores, Startups e Founders",
    ],
  },
  {
    number: "02",
    title: "Gestão Financeira, Contabilidade e Fiscalidade",
    intro: "O rigor financeiro que transforma números em confiança.",
    icon: CircleDollarSign,
    accent: "#557c79",
    services: [
      "Contabilidade Certificada, Auditoria e Declarações",
      "Consultoria Fiscal, Planeamento Tributário e Impostos",
      "Gestão do Fluxo de Caixa e Finanças Empresariais",
      "Avaliação de Empresas (Valuation) e Análise de Risco",
    ],
  },
  {
    number: "03",
    title: "Marketing, Vendas e Posicionamento de Marca",
    intro: "Uma presença que diz o que vale, para quem importa.",
    icon: Target,
    accent: "#a66c5f",
    services: [
      "Gestão de Redes Sociais, Conteúdo e Tráfego Pago",
      "Criação de Identidade Visual, Branding e Design",
      "Estratégias de Vendas, Prospecção e Treino Comercial",
      "Assessoria de Imprensa, Relações Públicas e Comunicação",
    ],
  },
  {
    number: "04",
    title: "Soluções Legais, Jurídicas e Propriedade Intelectual",
    intro: "Estruturas sólidas para crescer com segurança.",
    icon: Scale,
    accent: "#6d7184",
    services: [
      "Apoio Jurídico para Abertura e Registo de Empresas",
      "Elaboração, Análise e Auditoria de Contratos",
      "Registo de Marcas, Patentes e Propriedade Intelectual",
      "Consultoria em Conformidade (Compliance) e Regulamentação",
    ],
  },
  {
    number: "05",
    title: "Recursos Humanos, Talentos e Operações",
    intro: "Pessoas alinhadas e operações que sustentam o ritmo.",
    icon: UsersRound,
    accent: "#7b6652",
    services: [
      "Recrutamento, Seleção e Acolhimento de Talentos (Onboarding)",
      "Consultoria de RH, Avaliação e Gestão de Desempenho",
      "Serviços de Tradução Profissional e Interpretação",
      "Gestão de Operações e Cadeia de Mantimentos (Logística)",
    ],
  },
  {
    number: "06",
    title: "Finanças Pessoais, Investimentos e Captação",
    intro: "Planeamento para proteger o que construiu e abrir possibilidades.",
    icon: Landmark,
    accent: "#8f6d35",
    services: [
      "Planeamento Financeiro Pessoal e Familiar",
      "Consultoria em Investimentos e Gestão de Património",
      "Preparação para Captação de Investimento, Crédito e Parcerias",
    ],
  },
];

function ServiceDetail({ category, SelectedIcon }: { category: ServiceCategory; SelectedIcon: typeof Compass }) {
  return (
    <article
      className="relative overflow-hidden rounded-[2px] bg-[#e9e2d6] p-7 text-[#112844] sm:p-10"
      style={{ borderTop: `4px solid ${category.accent}` }}
    >
      <div className="absolute -right-8 -top-8 h-44 w-44 rounded-full border border-[#112844]/10" />
      <div className="relative">
        <div className="mb-6 flex items-center justify-between">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-[#112844] text-[#c7a15a]">
            <SelectedIcon size={24} strokeWidth={1.4} />
          </span>
          <span className="font-['DM_Sans'] text-xs font-bold tracking-[0.2em] text-[#112844]/40">
            ÁREA {category.number}
          </span>
        </div>
        <div className="mb-6 overflow-hidden rounded-[2px]">
          <img
            src={categoryImages[category.number]}
            alt={category.title}
            className="h-48 w-full object-cover object-center sm:h-56"
            style={{ filter: "grayscale(0.45) contrast(0.95) brightness(1.05)" }}
          />
        </div>
        <h3 className="max-w-lg font-['Playfair_Display'] text-3xl leading-[0.98] tracking-[-0.035em] sm:text-5xl">
          {category.title}
        </h3>
        <p className="mt-5 max-w-md font-['DM_Sans'] text-sm leading-6 text-[#112844]/65">
          {category.intro}
        </p>
        <div className="mt-9 grid gap-3 sm:grid-cols-2">
          {category.services.map((service) => (
            <div key={service} className="flex gap-3 border-t border-[#112844]/15 pt-3 font-['DM_Sans'] text-[13px] leading-5">
              <Check size={15} className="mt-0.5 shrink-0 text-[#b88a3b]" />
              {service}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function BusinessHome({ onBackToSelector }: { onBackToSelector?: () => void }) {
  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  }, []);

  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroImage, setHeroImage] = useState(0);
  const selected = categories[active];
  const SelectedIcon = selected.icon;

  const heroImages = [
    "/business/hero-business.jpg",
    "/business/strategy.jpg",
    "/business/finance.jpg",
    "/business/marketing.jpg",
    "/business/legal.jpg",
    "/business/team.jpg",
    "/business/investment.jpg",
    "/business/approach.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToServices = () => {
    document.getElementById("servicos")?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navClass = `${menuOpen ? "flex" : "hidden"} absolute left-5 right-5 top-[76px] flex-col gap-5 rounded-2xl border border-[#112844]/10 bg-[#f4f1eb] p-6 shadow-xl md:static md:flex md:flex-row md:items-center md:gap-8 md:border-0 md:bg-transparent md:p-0 md:shadow-none`;

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f1eb] text-[#112844] selection:bg-[#c7a15a] selection:text-[#112844]">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#112844]/10 bg-[#f4f1eb]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-3 text-left"
            aria-label="Voltar ao topo"
          >
            <img
              src="/logo-eliora-dark.svg"
              alt="Eliora"
              className="h-10 w-10"
              style={{ filter: "brightness(0) saturate(100%) invert(58%) sepia(50%) saturate(600%) hue-rotate(2deg) brightness(95%) contrast(85%)" }}
            />
            <span>
              <span className="block font-['DM_Sans'] text-[11px] font-bold uppercase tracking-[0.22em] text-[#112844]/60">Eliora</span>
              <span className="block font-['DM_Sans'] text-[10px] uppercase tracking-[0.13em] text-[#112844]">Business & Finances</span>
            </span>
          </button>
          <nav className={navClass} aria-label="Navegação principal">
            <button onClick={scrollToServices} className="text-left font-['DM_Sans'] text-xs font-bold uppercase tracking-[0.16em] text-[#112844]/65 transition hover:text-[#b88a3b]">
              Serviços
            </button>
            <a href="#abordagem" className="font-['DM_Sans'] text-xs font-bold uppercase tracking-[0.16em] text-[#112844]/65 transition hover:text-[#b88a3b]">
              A nossa abordagem
            </a>
            <a href="#contacto" className="font-['DM_Sans'] text-xs font-bold uppercase tracking-[0.16em] text-[#112844]/65 transition hover:text-[#b88a3b]">
              Contacto
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-full p-2 md:hidden"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {menuOpen ? <XIcon size={22} /> : <Menu size={22} />}
            </button>
            <a
              href="https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20Eliora%20Business%20%26%20Finances%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full bg-[#112844] px-5 py-3 font-['DM_Sans'] text-xs font-bold uppercase tracking-[0.14em] text-[#f4f1eb] transition hover:bg-[#b88a3b] hover:text-[#112844] focus:outline-none focus:ring-2 focus:ring-[#b88a3b] sm:flex"
            >
              Fale connosco
              <ArrowRight size={15} />
            </a>
            {onBackToSelector && (
              <button
                onClick={onBackToSelector}
                className="rounded-full border border-[#112844]/20 px-4 py-2.5 font-['DM_Sans'] text-xs font-bold uppercase tracking-[0.14em] text-[#112844] transition hover:bg-[#112844] hover:text-[#f4f1eb]"
              >
                Trocar loja
              </button>
            )}
          </div>
        </div>
      </header>

      <section className="relative mx-auto max-w-[1280px] px-5 pb-24 pt-16 sm:px-8 sm:pt-24 lg:px-12 lg:pb-32">
        <div className="absolute -right-24 top-4 hidden h-72 w-72 rounded-full border border-[#b88a3b]/25 lg:block" />
        <div className="absolute -right-8 top-20 hidden h-56 w-56 rounded-full border border-[#b88a3b]/20 lg:block" />
        <div className="grid gap-12 md:grid-cols-[1fr_0.6fr] md:items-center lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-4xl">
            <div className="mb-8 flex items-center gap-3 font-['DM_Sans'] text-[11px] font-bold uppercase tracking-[0.23em] text-[#b88a3b]">
              <span className="h-px w-10 bg-[#b88a3b]" />
              Angola · Mercados Lusófonos
            </div>
            <h1 className="max-w-4xl font-['Playfair_Display'] text-[clamp(3.4rem,8vw,7.6rem)] font-medium leading-[0.9] tracking-[-0.055em] text-[#112844]">
              Clareza para
              <br />
              <em className="text-[#b88a3b]">crescer bem.</em>
            </h1>
            <div className="mt-10 grid max-w-3xl gap-8 md:grid-cols-[1fr_220px] md:items-end">
              <p className="font-['DM_Sans'] text-lg leading-8 text-[#112844]/70">
                A Eliora é o parceiro de confiança para transformar decisões complexas em próximos passos seguros — para empreendedores, empresas e famílias.
              </p>
              <button onClick={scrollToServices} className="group flex items-center gap-3 font-['DM_Sans'] text-xs font-bold uppercase tracking-[0.14em] text-[#112844]">
                Explorar serviços
                <span className="grid h-10 w-10 place-items-center rounded-full border border-[#112844]/25 transition group-hover:border-[#b88a3b] group-hover:bg-[#b88a3b]">
                  <ArrowDown size={16} />
                </span>
              </button>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[420px] aspect-[0.82]">
            <div className="absolute inset-0 rotate-[-4deg] rounded-[48%_48%_4%_4%] border border-[#b88a3b]/25" />
            <div className="absolute inset-[6%] rotate-[3deg] overflow-hidden rounded-[48%_48%_4%_4%] bg-[#e9e2d6]">
              <img
                src={heroImages[heroImage]}
                alt="Escritório profissional"
                className="h-full w-full object-cover object-center transition-opacity duration-700"
                style={{ filter: "grayscale(0.55) contrast(0.92) brightness(1.05)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#112844]/25 via-transparent to-white/10" />
              <div className="absolute left-[17%] top-[14%] h-20 w-12 rounded-full border border-white/70 opacity-70" />
            </div>
          </div>
        </div>
        <div className="mt-20 grid grid-cols-2 gap-8 border-t border-[#112844]/15 pt-6 font-['DM_Sans'] sm:grid-cols-4">
          {[
            ["01", "Visão integrada", "Estratégia, finanças e pessoas na mesma mesa."],
            ["02", "Conhecimento local", "Experiência ancorada em Angola e além."],
            ["03", "Relações duradouras", "Acompanhamento que não termina no diagnóstico."],
            ["04", "Decisões sólidas", "Rigor para avançar com confiança."],
          ].map(([n, title, body]) => (
            <div key={n}>
              <span className="text-xs font-bold text-[#b88a3b]">{n}</span>
              <h2 className="mt-4 text-sm font-bold">{title}</h2>
              <p className="mt-2 text-xs leading-5 text-[#112844]/55">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="servicos" className="bg-[#112844] px-5 py-20 text-[#f4f1eb] sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-5 font-['DM_Sans'] text-[11px] font-bold uppercase tracking-[0.23em] text-[#c7a15a]">
                O que fazemos
              </p>
              <h2 className="max-w-2xl font-['Playfair_Display'] text-5xl leading-[0.95] tracking-[-0.04em] sm:text-6xl">
                Uma visão completa
                <br />
                <em className="text-[#c7a15a]">do seu próximo capítulo.</em>
              </h2>
            </div>
            <p className="max-w-xs font-['DM_Sans'] text-sm leading-6 text-[#f4f1eb]/60">
              Escolha uma área para conhecer como podemos tornar a sua ambição mais simples de executar.
            </p>
          </div>

          {/* Desktop: side by side */}
          <div className="hidden lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
            <div className="space-y-1 border-t border-[#f4f1eb]/20">
              {categories.map((category, index) => {
                const Icon = category.icon;
                const isActive = active === index;
                return (
                  <button
                    key={category.number}
                    onClick={() => setActive(index)}
                    aria-expanded={isActive}
                    className={`group flex w-full items-start gap-4 border-b border-[#f4f1eb]/15 py-5 text-left transition ${
                      isActive ? "text-[#c7a15a]" : "text-[#f4f1eb]/65 hover:text-[#f4f1eb]"
                    }`}
                  >
                    <span className="w-8 pt-1 font-['DM_Sans'] text-[11px]">{category.number}</span>
                    <Icon size={19} strokeWidth={1.5} className="mt-0.5 shrink-0" />
                    <span className="flex-1 font-['Playfair_Display'] text-xl leading-tight sm:text-2xl">
                      {category.title}
                    </span>
                    <ChevronDown
                      size={17}
                      className={`mt-1 shrink-0 transition-transform ${isActive ? "rotate-180" : "-rotate-90"}`}
                    />
                  </button>
                );
              })}
            </div>
            <ServiceDetail category={selected} SelectedIcon={SelectedIcon} />
          </div>

          {/* Mobile: accordion */}
          <div className="lg:hidden space-y-1 border-t border-[#f4f1eb]/20">
            {categories.map((category, index) => {
              const Icon = category.icon;
              const isActive = active === index;
              const CatIcon = category.icon;
              return (
                <div key={category.number}>
                  <button
                    onClick={() => {
                      if (!isActive) {
                        setActive(index);
                        setTimeout(() => {
                          const el = document.getElementById(`detail-${category.number}`);
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }, 50);
                      } else {
                        setActive(-1);
                      }
                    }}
                    aria-expanded={isActive}
                    className={`group flex w-full items-start gap-4 border-b border-[#f4f1eb]/15 py-5 text-left transition ${
                      isActive ? "text-[#c7a15a]" : "text-[#f4f1eb]/65 hover:text-[#f4f1eb]"
                    }`}
                  >
                    <span className="w-8 pt-1 font-['DM_Sans'] text-[11px]">{category.number}</span>
                    <Icon size={19} strokeWidth={1.5} className="mt-0.5 shrink-0" />
                    <span className="flex-1 font-['Playfair_Display'] text-xl leading-tight">
                      {category.title}
                    </span>
                    <ChevronDown
                      size={17}
                      className={`mt-1 shrink-0 transition-transform duration-300 ${isActive ? "rotate-180" : "-rotate-90"}`}
                    />
                  </button>
                  {isActive && (
                    <div id={`detail-${category.number}`} className="overflow-hidden pb-4">
                      <ServiceDetail category={category} SelectedIcon={CatIcon} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="abordagem" className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-5 font-['DM_Sans'] text-[11px] font-bold uppercase tracking-[0.23em] text-[#b88a3b]">
              A nossa abordagem
            </p>
            <h2 className="font-['Playfair_Display'] text-5xl leading-[0.95] tracking-[-0.04em] sm:text-6xl">
              Pensar com rigor.
              <br />
              <em className="text-[#b88a3b]">Agir com proximidade.</em>
            </h2>
            <div className="relative mt-10 overflow-hidden rounded-[2px]">
              <img
                src="/business/approach.jpg"
                alt="Equipa Eliora em reunião de trabalho"
                className="h-64 w-full object-cover object-center sm:h-80"
                style={{ filter: "grayscale(0.5) contrast(0.93) brightness(1.06)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#112844]/25 via-transparent to-white/10" />
            </div>
          </div>
          <div className="grid gap-8 border-t border-[#112844]/15 pt-6 sm:grid-cols-3">
            {[
              ["01", "Ouvir primeiro", "Começamos por compreender o contexto, a ambição e o que realmente está em jogo."],
              ["02", "Traçar o essencial", "Organizamos a complexidade numa estratégia prática, com prioridades que fazem sentido."],
              ["03", "Caminhar consigo", "Ficamos ao seu lado para medir, ajustar e transformar planos em progresso real."],
            ].map(([n, title, body]) => (
              <div key={n}>
                <span className="font-['DM_Sans'] text-xs font-bold text-[#b88a3b]">{n}</span>
                <h3 className="mt-5 font-['Playfair_Display'] text-2xl">{title}</h3>
                <p className="mt-3 font-['DM_Sans'] text-sm leading-6 text-[#112844]/60">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="mx-5 mb-5 overflow-hidden bg-[#c7a15a] px-6 py-16 sm:mx-8 sm:px-12 lg:mx-12 lg:px-20 lg:py-20">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <p className="mb-5 font-['DM_Sans'] text-[11px] font-bold uppercase tracking-[0.23em] text-[#112844]/60">
              Vamos conversar
            </p>
            <h2 className="max-w-3xl font-['Playfair_Display'] text-5xl leading-[0.95] tracking-[-0.04em] sm:text-7xl">
              O seu próximo passo
              <br />
              <em>começa aqui.</em>
            </h2>
          </div>
          <a
            href="https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20Eliora%20Business%20%26%20Finances%20e%20gostaria%20de%20marcar%20uma%20consulta."
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex shrink-0 items-center gap-3 border-b border-[#112844] pb-3 font-['DM_Sans'] text-sm font-bold uppercase tracking-[0.13em] transition hover:gap-5"
          >
            Marcar uma consulta
            <ArrowRight size={18} />
          </a>
        </div>
        <div className="mt-16 flex flex-col justify-between gap-5 border-t border-[#112844]/20 pt-5 font-['DM_Sans'] text-xs text-[#112844]/65 sm:flex-row">
          <span>Luanda · Angola</span>
          <span>hello@eliora.co.ao</span>
          <span>© {new Date().getFullYear()} Eliora Business & Finances</span>
        </div>
      </section>
      <div className="fixed bottom-5 right-5 z-10 hidden items-center gap-2 rounded-full border border-[#112844]/10 bg-[#f4f1eb]/90 px-3 py-2 font-['DM_Sans'] text-[10px] uppercase tracking-[0.15em] text-[#112844]/60 shadow-lg backdrop-blur sm:flex">
        <ShieldCheck size={13} className="text-[#b88a3b]" />
        Confiança para decidir
      </div>
    </main>
  );
}
