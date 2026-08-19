import { useMemo, useState, useEffect } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
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

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => b.items.length - a.items.length);
  }, [filtered]);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  };

  return (
    <main className="min-h-[100dvh] overflow-x-hidden bg-[#f7fbfb] text-[#123c4a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap');
        .formacoes-grain:after{content:"";position:fixed;inset:0;pointer-events:none;opacity:.035;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E")}
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-12 bg-[#f7fbfb]/90 backdrop-blur-md">
        <a className="flex items-center gap-2.5 no-underline" href="#top" aria-label="Eliora Formações">
          <img
            src="/logo-eliora-dark.svg"
            alt="Eliora"
            style={{ width: "39px", height: "39px", filter: "brightness(0) saturate(100%) invert(50%) sepia(40%) saturate(600%) hue-rotate(120deg) brightness(90%) contrast(85%)" }}
          />
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", letterSpacing: "-.02em", color: "#123c4a" }}>Eliora<small style={{ display: "block", color: "#0c9894", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: ".23em", fontSize: "8px", marginTop: "2px" }}>Formações, Aulas e Treinamentos</small></span>
        </a>
        <nav className={`${menuOpen ? "absolute left-0 right-0 top-full flex bg-white px-6 pb-6 shadow-md flex-col gap-5" : "hidden"} md:static md:flex md:flex-row md:items-center md:gap-9 md:bg-transparent md:p-0 md:shadow-none`}>
          <button onClick={() => { document.getElementById("servicos")?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); }} className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-[#123c4a] hover:text-[#0c9894] transition-colors">Explorar</button>
          <button onClick={() => showNotice("Em breve poderá conhecer os formadores Eliora.")} className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-[#68727c] hover:text-[#0c9894] transition-colors">Para formadores</button>
          {onBackToSelector && (
            <button onClick={onBackToSelector} className="flex items-center gap-2 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[#68727c] hover:text-[#0c9894] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Trocar loja
            </button>
          )}
        </nav>
        <button aria-label="Abrir menu" onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg p-2 md:hidden">{menuOpen ? <X size={20} /> : <Menu size={21} />}</button>
      </header>

      <div className="formacoes-grain">
        <section className="mx-auto max-w-7xl px-4 pt-24 pb-4 md:px-12 md:pt-28 md:pb-4">
          <div className="relative flex max-w-2xl flex-col gap-3 rounded-[22px] border border-[#cce8e6] bg-white p-2 shadow-[0_15px_45px_rgba(24,104,110,.09)] sm:flex-row sm:items-center">
            <Search className="ml-3 hidden text-[#0c9894] sm:block" size={21} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="O que quer aprender hoje?" className="min-w-0 flex-1 rounded-2xl bg-transparent px-4 py-3 text-[15px] outline-none placeholder:text-[#9ab1b3] focus-visible:ring-2 focus-visible:ring-[#9de0da] sm:px-1" aria-label="Pesquisar categorias e subcategorias" />
            <button onClick={() => document.getElementById("servicos")?.scrollIntoView({ behavior: "smooth" })} className="flex items-center justify-center gap-2 rounded-[16px] bg-[#0c9894] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#087c7c] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#b9e5e1]"><Search size={16} /> Pesquisar</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-[#729096]"><span>Experimente:</span><button onClick={() => setQuery("Excel")} className="text-[#0c9894] underline underline-offset-4">Excel</button><button onClick={() => setQuery("Inglês")} className="text-[#0c9894] underline underline-offset-4">Inglês</button><button onClick={() => setQuery("Liderança")} className="text-[#0c9894] underline underline-offset-4">Liderança</button></div>
        </section>

        <div className="mx-auto max-w-7xl px-4 pt-1 pb-2 md:px-12 md:pt-2 md:pb-2">
          <div className="flex flex-row flex-nowrap overflow-x-auto gap-2 pb-1" style={{ scrollbarWidth: "none" }}>
            {sorted.map((cat, i) => (
              <a
                key={cat.title}
                href="#servicos"
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#cfe4e4] bg-white hover:border-[#0c9894] hover:bg-[#e8f8f6] transition-all text-[11px] font-semibold text-[#53727c]"
                onClick={(e) => { e.preventDefault(); document.getElementById("servicos")?.scrollIntoView({ behavior: "smooth" }); }}
              >
                <span className="font-mono text-[9px] text-[#0c9894]">0{i + 1}</span>
                {cat.title.split(",")[0].split(" e ")[0].trim()}
              </a>
            ))}
          </div>
          <div className="flex justify-center items-center gap-2 mt-1 md:hidden">
            <span className="text-[10px] text-[#0c9894] font-medium">Deslize para ver mais</span>
            <ArrowRight size={12} className="text-[#0c9894] animate-pulse" />
          </div>
        </div>

        <section id="servicos" className="mx-auto max-w-7xl px-6 pt-1 pb-4 md:px-12 md:pt-1 md:pb-4">
          <div>
            {sorted.map((category, index) => {
              const Icon = category.icon;
              const imgSrc = categoryImages[category.title];
              const number = String(index + 1).padStart(2, "0");
              return (
                <article key={category.title} className={`group border-t border-[#cfe4e4] py-6 md:py-8 ${index % 2 ? "md:ml-20" : ""}`}>
                  <div className="grid gap-7 md:grid-cols-[100px_minmax(0,1fr)_minmax(260px,370px)] md:items-start">
                    <span className="font-mono text-xs tracking-[0.2em] text-[#0c9894]">{number}</span>
                    <div>
                      <h3 className="max-w-xl font-serif text-3xl leading-[1.08] text-[#123c4a]" style={{ fontFamily: "'Playfair Display', serif" }}>{category.title}</h3>
                      <p className="mt-2 max-w-md text-[11px] font-bold uppercase tracking-[.14em] text-[#53727c]">{category.eyebrow}</p>
                      <p className="mt-2 max-w-md text-sm leading-7 text-[#6b858a]">{category.description}</p>
                      <ul className="mt-5 space-y-3 border-l border-[#cfe4e4] pl-5 text-sm leading-5 text-[#4a6e74]">
                        {category.items.map((item) => (
                          <li key={item}>
                            <div className="flex gap-3 items-start transition-transform duration-300 group-hover:translate-x-1">
                              <Check size={15} className="mt-0.5 shrink-0" style={{ color: category.tint }} />
                              <span>{item}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <a
                        href={`https://wa.me/244922001778?text=${encodeURIComponent(`Olá, vim pela Eliora Formações e gostaria de saber mais sobre: ${category.title}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
                        style={{ backgroundColor: category.tint }}
                      >
                        Falar com um formador <ArrowRight size={15} />
                      </a>
                    </div>
                    <div className="mt-4 md:mt-0">
                      {imgSrc && (
                        <div className="relative overflow-hidden rounded-2xl border border-[#d7e9e8]">
                          <img src={imgSrc} alt={category.title} className="w-full h-64 object-cover" style={{ filter: "grayscale(0.3) contrast(0.95) brightness(1.05)" }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />
                          <span className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-[14px] shadow-lg" style={{ backgroundColor: category.soft, color: category.tint }}>
                            <Icon size={20} />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="contacto" className="relative overflow-hidden border-t border-[#0c9894]/30 bg-[#123c4a] px-6 py-14 text-white md:px-12 md:py-20">
          <div className="relative mx-auto max-w-7xl md:flex md:items-end md:justify-between">
            <div>
              <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.25em] text-[#8be0d8]"><BookOpen size={14} /> Uma escolha de cada vez</p>
              <h2 className="max-w-xl font-serif text-4xl leading-[1.05] md:text-5xl" style={{ fontFamily: "'Playfair Display', serif" }}>A próxima competência pode começar<br />numa conversa.</h2>
            </div>
            <div className="mt-8 md:mt-0 md:w-80">
              <p className="text-sm leading-6 text-[#b5d1d1]">Explore com calma. Quando encontrar o caminho certo, a Eliora ajuda a aproximá-lo de quem pode ensinar.</p>
              <a
                href={`https://wa.me/244922001778?text=${encodeURIComponent("Olá, vim pela Eliora Formações e gostaria de saber mais.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center gap-4 border-b border-[#8be0d8] pb-3 text-xs uppercase tracking-[.2em] text-[#e3e7eb] hover:text-white transition-colors"
              >
                Falar com um formador <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </section>

        <footer className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-12">
          <span className="font-mono text-[10px] tracking-[.2em] text-[#8ca4a7]">© Eliora Formações, Aulas e Treinamentos</span>
          <span className="text-xs text-[#8ca4a7]">Aprender. Praticar. Avançar.</span>
        </footer>
      </div>

      {notice && <div role="status" className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#123c4a] px-5 py-3 text-sm font-semibold text-white shadow-xl"><Check size={16} className="text-[#8be0d8]" /> {notice}</div>}
      {onBackToSelector && (
        <button
          onClick={onBackToSelector}
          className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-full border border-[#0c9894]/20 bg-white px-4 py-2.5 text-xs font-bold text-[#123c4a] shadow-lg transition hover:bg-[#0c9894] hover:text-white"
        >
          Trocar loja
        </button>
      )}
    </main>
  );
}
