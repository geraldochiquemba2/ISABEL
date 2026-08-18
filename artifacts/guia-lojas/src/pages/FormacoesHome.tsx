import { useMemo, useState, useEffect } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  ChevronUp,
  Code2,
  Compass,
  Dumbbell,
  GraduationCap,
  Languages,
  Menu,
  Music2,
  Search,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

type Category = {
  title: string;
  eyebrow: string;
  description: string;
  icon: typeof Languages;
  tint: string;
  soft: string;
  items: string[];
};

const categories: Category[] = [
  {
    title: "Idiomas e Comunicação",
    eyebrow: "Fale com confiança",
    description: "Competências para se expressar melhor, em qualquer sala.",
    icon: Languages,
    tint: "#0f9e9a",
    soft: "#e2f5f2",
    items: [
      "Aulas de Inglês, Francês e Outros Idiomas (Geral e Negócios)",
      "Comunicação de Alto Impacto, Oratória e Expressão Pública",
      "Escrita Corporativa, Redação Académica e Preparação de Apresentações",
    ],
  },
  {
    title: "Tecnologia, Programação e Ferramentas Digitais",
    eyebrow: "Crie o que imagina",
    description: "Do primeiro clique ao produto digital que abre portas.",
    icon: Code2,
    tint: "#2164a5",
    soft: "#e8f1fb",
    items: [
      "Programação, Desenvolvimento Web e Criação de Apps",
      "Informática Básica/Avançada, Pacote Office e Excel",
      "Ferramentas de Design (Canva, Photoshop) e Edição de Vídeo",
      "Marketing Digital, Tráfego Pago e Gestão de Redes Sociais",
    ],
  },
  {
    title: "Desenvolvimento Pessoal, Carreira e Liderança",
    eyebrow: "Avance com intenção",
    description: "Clareza para escolher o próximo passo e coragem para o dar.",
    icon: BriefcaseBusiness,
    tint: "#c87542",
    soft: "#fbefe8",
    items: [
      "Coaching de Carreira, Orientação Profissional e Transição",
      "Preparação para Entrevistas de Emprego e Optimização de CV/LinkedIn",
      "Treinamento em Liderança, Gestão de Equipas e Resolução de Conflitos",
      "Gestão do Tempo, Produtividade Pessoal e Foco",
    ],
  },
  {
    title: "Apoio Académico, Reforço Escolar e Exames",
    eyebrow: "Aprenda no seu ritmo",
    description: "Acompanhamento próximo para estudar com mais tranquilidade.",
    icon: GraduationCap,
    tint: "#7b5eb0",
    soft: "#f0ebfa",
    items: [
      "Explicadores de Matemática, Física, Química e Biologia",
      "Apoio Escolar Geral e Métodos de Estudo para Crianças e Jovens",
      "Preparação para Exames de Admissão Universitária e Provas",
    ],
  },
  {
    title: "Aulas Práticas, Artes, Música e Hobbies",
    eyebrow: "Faça acontecer",
    description: "Tempo bem passado também pode tornar-se uma nova habilidade.",
    icon: Music2,
    tint: "#d06b83",
    soft: "#fbecef",
    items: [
      "Aulas de Culinária, Confeitaria e Gastronomia",
      "Canto, Piano, Violão, Guitarra e Outros Instrumentos",
      "Costura, Modelagem, Corte e Artesanato",
      "Fotografia Profissional e Produção de Vídeo com Telemóvel",
    ],
  },
  {
    title: "Saúde, Fitness e Treino Acompanhado",
    eyebrow: "Cuide do seu ritmo",
    description: "Orientação prática para sentir-se forte, presente e capaz.",
    icon: Dumbbell,
    tint: "#358a72",
    soft: "#e6f4ed",
    items: [
      "Personal Trainer (Presencial e Online)",
      "Aulas de Dança, Expressão Corporal e Postura",
      "Workshops de Nutrição, Reeducação Alimentar e Estilo de Vida",
      "Aulas de Yoga, Pilates e Treino Funcional",
    ],
  },
];

const categoryImages: Record<string, string> = {
  "Idiomas e Comunicação": "/formacoes/idiomas.jpg",
  "Tecnologia, Programação e Ferramentas Digitais": "/formacoes/tecnologia.jpg",
  "Desenvolvimento Pessoal, Carreira e Liderança": "/formacoes/carreira.jpg",
  "Apoio Académico, Reforço Escolar e Exames": "/formacoes/academico.jpg",
  "Aulas Práticas, Artes, Música e Hobbies": "/formacoes/artes.jpg",
  "Saúde, Fitness e Treino Acompanhado": "/formacoes/saude.jpg",
};

export function FormacoesHome({ onBackToSelector }: { onBackToSelector?: () => void }) {
  useThemeColor("#087a76");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    if (!term) return categories;
    return categories.filter((category) =>
      [category.title, category.description, ...category.items].some((text) =>
        text.toLocaleLowerCase().includes(term),
      ),
    );
  }, [query]);

  const toggleCategory = (title: string) => {
    setExpanded((current) =>
      current.includes(title)
        ? current.filter((item) => item !== title)
        : [...current, title],
    );
  };

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  };

  return (
    <main className="min-h-[100dvh] overflow-x-hidden bg-[#f7fbfb] text-[#123c4a] [font-family:'DM_Sans',sans-serif]">
      <div className="pointer-events-none fixed inset-0 opacity-[0.035]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.4'/%3E%3C/svg%3E\")" }} />
      <nav className="fixed top-0 left-0 right-0 z-50 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12 bg-[#f7fbfb]/95 backdrop-blur">
        <button className="flex items-center gap-2.5" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Voltar ao topo">
          <img
            src="/logo-eliora-dark.svg"
            alt="Eliora"
            style={{ width: "39px", height: "39px", filter: "brightness(0) saturate(100%) invert(50%) sepia(40%) saturate(600%) hue-rotate(120deg) brightness(90%) contrast(85%)" }}
          />
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", letterSpacing: "-.02em", color: "#123c4a" }}>Eliora<small style={{ display: "block", color: "#0c9894", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: ".23em", fontSize: "8px", marginTop: "2px" }}>Formações, Aulas e Treinamentos</small></span>
        </button>
        <div className="hidden items-center gap-8 text-[13px] font-semibold text-[#53727c] md:flex">
          <button className="text-[#123c4a] underline decoration-[#8bd8d1] decoration-2 underline-offset-8">Explorar formações</button>
          <button onClick={() => showNotice("Em breve poderá conhecer os formadores Eliora.")}>Para formadores</button>
          {onBackToSelector && (
            <button onClick={onBackToSelector} className="flex items-center gap-2 text-[#53727c] hover:text-[#123c4a] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Trocar loja
            </button>
          )}
          <button onClick={() => showNotice("A sua conta Eliora estará disponível em breve.")} className="flex items-center gap-2 rounded-full border border-[#cfe4e4] bg-white px-4 py-2.5 text-[#123c4a] transition hover:border-[#0c9894]"><UserRound size={15} /> Entrar</button>
        </div>
        <button className="rounded-lg p-2 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu">{menuOpen ? <X /> : <Menu />}</button>
      </nav>
      {menuOpen && <div className="relative z-20 mx-5 rounded-2xl border border-[#d6ebea] bg-white p-4 shadow-lg md:hidden"><button className="block w-full rounded-lg p-3 text-left text-sm font-semibold" onClick={() => setMenuOpen(false)}>Explorar formações</button><button className="block w-full rounded-lg p-3 text-left text-sm font-semibold" onClick={() => showNotice("Em breve poderá conhecer os formadores Eliora.")}>Para formadores</button>{onBackToSelector && <button className="block w-full rounded-lg p-3 text-left text-sm font-semibold" onClick={() => { setMenuOpen(false); onBackToSelector(); }}>Trocar loja</button>}<button className="block w-full rounded-lg p-3 text-left text-sm font-semibold" onClick={() => showNotice("A sua conta Eliora estará disponível em breve.")}>Entrar</button></div>}

      <section className="relative mx-auto max-w-7xl px-5 pb-14 pt-14 sm:px-8 lg:px-12 lg:pb-20 lg:pt-20">
        <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-[#d8f4f0] blur-3xl" />
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="relative max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#b9e5e1] bg-[#e8f8f6] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#087d7c]"><Compass size={14} /> Aprender muda o caminho</div>
            <h1 className="max-w-2xl text-[clamp(2rem,6vw,5.7rem)] font-bold leading-[.96] tracking-[-0.075em] text-[#103e4c] break-words">Encontre a formação que <span className="text-[#0c9894]">faz sentido</span> para si.</h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-[#5c7880] sm:text-lg">Na Eliora, competências ganham direcção. Explore aulas e treinamentos com pessoas que sabem ensinar — em Angola e onde estiver.</p>
          </div>
          <div className="relative mx-auto w-full max-w-[420px] aspect-[0.82]">
            <div className="absolute inset-0 rotate-[-4deg] rounded-[48%_48%_4%_4%] border border-[#0c9894]/25" />
            <div className="absolute inset-[6%] rotate-[3deg] overflow-hidden rounded-[48%_48%_4%_4%] bg-[#e2f5f2]">
              <img
                src="/formacoes/hero-formacoes.jpg"
                alt="Formações Eliora"
                className="h-full w-full object-cover object-center"
                style={{ filter: "grayscale(0.3) contrast(0.95) brightness(1.05)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c9894]/25 via-transparent to-white/10" />
              <div className="absolute left-[17%] top-[14%] h-20 w-12 rounded-full border border-white/70 opacity-70" />
            </div>
          </div>
        </div>
        <div className="relative mt-10 flex max-w-2xl flex-col gap-3 rounded-[22px] border border-[#cce8e6] bg-white p-2 shadow-[0_15px_45px_rgba(24,104,110,.09)] sm:flex-row sm:items-center">
          <Search className="ml-3 hidden text-[#0c9894] sm:block" size={21} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="O que quer aprender hoje?" className="min-w-0 flex-1 rounded-2xl bg-transparent px-4 py-3 text-[15px] outline-none placeholder:text-[#9ab1b3] focus-visible:ring-2 focus-visible:ring-[#9de0da] sm:px-1" aria-label="Pesquisar categorias e subcategorias" />
          <button onClick={() => document.getElementById("categorias")?.scrollIntoView({ behavior: "smooth" })} className="flex items-center justify-center gap-2 rounded-[16px] bg-[#0c9894] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#087c7c] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#b9e5e1]"><Search size={16} /> Pesquisar</button>
        </div>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-[#729096]"><span>Experimente:</span><button onClick={() => setQuery("Excel")} className="text-[#0c9894] underline underline-offset-4">Excel</button><button onClick={() => setQuery("Inglês")} className="text-[#0c9894] underline underline-offset-4">Inglês</button><button onClick={() => setQuery("Liderança")} className="text-[#0c9894] underline underline-offset-4">Liderança</button></div>
      </section>

      <section id="categorias" className="relative mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#0c9894]">Escolha a sua direcção</p>
            <h2 className="text-2xl font-bold tracking-[-0.04em] text-[#123c4a] sm:text-3xl">Seis caminhos para começar</h2>
          </div>
          <span className="hidden rounded-full bg-[#e8f5f3] px-3 py-1.5 text-xs font-bold text-[#3f7779] sm:block">{filtered.length} {filtered.length === 1 ? "categoria" : "categorias"}</span>
        </div>
        {filtered.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-[#b8dedd] bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#e5f5f2] text-[#0c9894]"><Search size={24} /></div>
            <h3 className="text-lg font-bold text-[#123c4a]">Não encontrámos esse caminho ainda.</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#718b90]">Tente outra palavra ou explore todas as categorias para descobrir uma nova possibilidade.</p>
            <button onClick={() => setQuery("")} className="mt-6 rounded-full bg-[#0c9894] px-5 py-2.5 text-sm font-bold text-white">Ver todas as categorias</button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((category, index) => {
              const Icon = category.icon;
              const isOpen = expanded.includes(category.title);
              const imgSrc = categoryImages[category.title];
              return (
                <article
                  key={category.title}
                  className="group relative overflow-hidden rounded-[25px] border border-[#d7e9e8] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#8bd8d1] hover:shadow-[0_16px_35px_rgba(22,110,116,.1)]"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {imgSrc && (
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={imgSrc}
                        alt={category.title}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        style={{ filter: "grayscale(0.3) contrast(0.95) brightness(1.05)" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <span className="grid h-10 w-10 place-items-center rounded-[14px] shadow-lg" style={{ backgroundColor: category.soft, color: category.tint }}>
                          <Icon size={20} />
                        </span>
                      </div>
                      <span className="absolute right-3 top-3 text-xs font-bold text-white/80">0{index + 1}</span>
                    </div>
                  )}
                  <div className="relative p-6 sm:p-7">
                    {!imgSrc && (
                      <div className="mb-5 flex items-start justify-between">
                        <span className="grid h-12 w-12 place-items-center rounded-[17px]" style={{ backgroundColor: category.soft, color: category.tint }}><Icon size={23} /></span>
                        <span className="text-xs font-bold text-[#9ab1b3]">0{index + 1}</span>
                      </div>
                    )}
                    <p className="text-[11px] font-bold uppercase tracking-[.14em]" style={{ color: category.tint }}>{category.eyebrow}</p>
                    <h3 className="mt-2 max-w-[380px] text-xl font-bold leading-tight tracking-[-.035em] text-[#123c4a]">{category.title}</h3>
                    <p className="mt-3 max-w-[390px] text-sm leading-6 text-[#6b858a]">{category.description}</p>
                    <button onClick={() => toggleCategory(category.title)} aria-expanded={isOpen} className="mt-4 flex items-center gap-2 rounded-full border border-[#d0e6e5] px-4 py-2 text-xs font-bold text-[#3f7779] transition hover:bg-[#e8f8f6]">
                      {isOpen ? "Fechar" : "Ver detalhes"} {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {isOpen && (
                      <div className="mt-5 space-y-2 border-t border-[#e4efee] pt-5">
                        {category.items.map((item) => (
                          <div key={item} className="flex items-start gap-2.5 text-sm leading-6 text-[#4a6e74]">
                            <Check size={15} className="mt-1 shrink-0" style={{ color: category.tint }} />
                            {item}
                          </div>
                        ))}
                        <a
                          href={`https://wa.me/244922001778?text=${encodeURIComponent(`Olá, vim pela Eliora Formações e gostaria de saber mais sobre: ${category.title}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
                          style={{ backgroundColor: category.tint }}
                        >
                          Falar com um formador <ArrowRight size={15} />
                        </a>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="mx-5 mb-12 overflow-hidden rounded-[30px] bg-[#123f4c] px-6 py-10 text-white sm:mx-8 sm:px-10 lg:mx-auto lg:max-w-7xl lg:px-14"><div className="flex flex-col justify-between gap-8 md:flex-row md:items-center"><div><p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#8be0d8]"><BookOpen size={15} /> Uma escolha de cada vez</p><h2 className="max-w-xl text-2xl font-bold leading-tight tracking-[-.045em] sm:text-3xl">A próxima competência pode começar numa conversa.</h2><p className="mt-3 max-w-lg text-sm leading-6 text-[#b5d1d1]">Explore com calma. Quando encontrar o caminho certo, a Eliora ajuda a aproximá-lo de quem pode ensinar.</p></div><button onClick={() => { setQuery(""); document.getElementById("categorias")?.scrollIntoView({ behavior: "smooth" }); }} className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#8ee0d8] px-5 py-3 text-sm font-bold text-[#123f4c] transition hover:bg-white">Explorar categorias <ArrowRight size={17} /></button></div></section>
      {notice && <div role="status" className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#123f4c] px-5 py-3 text-sm font-semibold text-white shadow-xl"><Check size={16} className="text-[#8ee0d8]" /> {notice}</div>}
      {onBackToSelector && (
        <button
          onClick={onBackToSelector}
          className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-full border border-[#0c9894]/20 bg-white px-4 py-2.5 text-xs font-bold text-[#123c4a] shadow-lg transition hover:bg-[#0c9894] hover:text-white"
        >
          Trocar loja
        </button>
      )}
      <footer className="mx-auto flex max-w-7xl flex-col gap-2 px-5 pb-8 text-xs text-[#8ca4a7] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12"><span>© Eliora Formações, Aulas e Treinamentos</span><span>Aprender. Praticar. Avançar.</span></footer>
    </main>
  );
}