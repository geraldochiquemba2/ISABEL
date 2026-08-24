import { useMemo, useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Code2,
  Compass,
  Dumbbell,
  GraduationCap,
  Instagram,
  Languages,
  Mail,
  Menu,
  Music2,
  Phone,
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

function StoreCard({ store, productImages }: { store: any; productImages?: string[] }) {
  const fallbackImage = "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop&auto=format&q=75";
  const images = productImages && productImages.length > 0 ? productImages : [store.coverImage || store.image || fallbackImage];
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div
      className="flex-shrink-0 w-48 rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow border border-[#e8eaed] cursor-pointer hover:-translate-y-1"
      onClick={() => navigate(`/loja/${store.id}?from=formacoes`)}
    >
      <div className="relative h-28 overflow-hidden">
        <img src={images[currentIdx] || fallbackImage} alt={store.name} className="w-full h-full object-cover" />
        {store.logoUrl && (
          <img src={store.logoUrl} alt={`Logo ${store.name}`} className="absolute top-2 left-2 w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm z-20" />
        )}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 z-20 flex gap-1">
            {images.map((_: string, i: number) => (
              <button key={i} onClick={(e) => { e.stopPropagation(); setCurrentIdx(i); }} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIdx ? "bg-white w-3" : "bg-white/50"}`} />
            ))}
          </div>
        )}
        {store.isOpen !== undefined && (
          <span className={`absolute top-2 right-2 text-[9px] font-semibold px-2 py-0.5 rounded-full z-20 ${store.isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
            {store.isOpen ? "Aberto" : "Fechado"}
          </span>
        )}
      </div>
      <div className="p-3">
        <h4 className="text-sm font-semibold text-[#30343a] truncate">{store.name}</h4>
        {store.description && <p className="text-[10px] text-[#89919a] mt-1 line-clamp-2">{store.description}</p>}
      </div>
    </div>
  );
}

function Monogram() {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/logo-eliora-dark.svg"
        alt="Eliora Formações"
        className="w-10 h-10"
      />
      <span className="font-serif text-xl tracking-[0.08em] text-[#2d2c2b]">Eliora <i className="font-normal">Formações</i></span>
    </div>
  );
}

export function FormacoesHome({ onBackToSelector }: { onBackToSelector?: () => void }) {
  useThemeColor("#087a76");
  const [, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolledEnd, setScrolledEnd] = useState(false);
  const [sent, setSent] = useState(false);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (el) {
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
      setScrolledEnd(atEnd);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const localUserStr = typeof window !== "undefined" ? localStorage.getItem("guialocal_user") : null;
  const isLoggedIn = !!localUserStr;

  const { data: stores = [] } = useQuery({
    queryKey: ["stores", "formacoes"],
    queryFn: async () => {
      const res = await fetch("/api/stores?store_type=formacoes");
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60_000,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products", "formacoes"],
    queryFn: async () => {
      const res = await fetch("/api/products?store_type=formacoes");
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60_000,
  });

  const getStoresForGroup = (title: string) => {
    const catKey = title.split(",")[0].trim().toLowerCase();
    const matched = stores.filter((s: any) => {
      return !["999999999"].includes(s.phone) && (
        s.category?.toLowerCase().includes(catKey) ||
        (s.products || []).some((p: any) => p.category?.toLowerCase().includes(catKey))
      );
    });
    const storeProductsMap: Record<string, string[]> = {};
    matched.forEach((s: any) => {
      const imgs: string[] = [];
      (s.products || []).forEach((p: any) => {
        const urls = Array.isArray(p.imageUrls) ? p.imageUrls : (typeof p.imageUrls === "string" ? p.imageUrls.split(" ").filter(Boolean) : []);
        if (urls.length > 0) imgs.push(...urls);
        else if (p.imageUrl) imgs.push(p.imageUrl);
      });
      storeProductsMap[s.id] = imgs;
    });
    return { stores: matched, storeProducts: storeProductsMap };
  };

  const sorted = useMemo(() => {
    return [...categories].sort((a, b) => {
      const storesA = getStoresForGroup(a.title).stores.length;
      const storesB = getStoresForGroup(b.title).stores.length;
      return storesB - storesA;
    });
  }, [stores, products]);

  return (
    <main className="min-h-[100dvh] overflow-x-hidden bg-white text-[#30343a]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap');
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 mx-auto max-w-[1380px] flex items-center justify-between px-6 py-5 md:px-12 bg-white/90 backdrop-blur-md">
        <a className="flex items-center gap-2.5 no-underline" href="#top" aria-label="Eliora Formações">
          <img src="/logo-eliora-dark.svg" alt="Eliora" className="w-[39px] h-[39px]" />
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", letterSpacing: "-.02em", color: "#2d2c2b" }}>Eliora <i className="font-normal">Formações</i></span>
        </a>
        <nav className={`${menuOpen ? "absolute left-0 right-0 top-full flex bg-white px-6 pb-6 shadow-md flex-col gap-5" : "hidden"} md:static md:flex md:flex-row md:items-center md:gap-9 md:bg-transparent md:p-0 md:shadow-none`}>
          <button onClick={() => scrollTo("servicos")} className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-[#68727c] hover:text-[#30343a] transition-colors">Serviços</button>
          <a href="/explorar-formacoes" className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-[#68727c] hover:text-[#30343a] transition-colors">Explorar</a>
          {isLoggedIn ? (
            <button onClick={() => { window.location.href = "/dashboard-formacoes"; setMenuOpen(false); }} className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-[#68727c] hover:text-[#30343a] transition-colors">Entrar</button>
          ) : (
            <a href="/login-formacoes" className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-[#68727c] hover:text-[#30343a] transition-colors">Entrar</a>
          )}
          <a
            href="https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20Eliora%20Forma%C3%A7%C3%B5es%20e%20gostaria%20de%20saber%20mais."
            target="_blank"
            rel="noopener noreferrer"
            className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-[#68727c] hover:text-[#30343a] transition-colors"
          >Falar com a Eliora</a>
          {onBackToSelector && (
            <button onClick={onBackToSelector} className="flex items-center gap-2 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[#68727c] hover:text-[#30343a] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Trocar loja
            </button>
          )}
        </nav>
        <button aria-label="Abrir menu" onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg p-2 md:hidden">{menuOpen ? <X size={20} /> : <Menu size={21} />}</button>
      </header>

      <div className="pt-[5.3rem] md:pt-24">
        <div className="mx-auto max-w-[1380px] px-4 pb-2 md:px-12 md:pb-2">
          <div ref={scrollRef} onScroll={handleScroll} className="flex flex-row flex-nowrap overflow-x-auto gap-2 pb-1" style={{ scrollbarWidth: "none" }}>
            {sorted.map((cat, i) => (
              <a
                key={cat.title}
                href={`/explorar-formacoes?categoria=${cat.title}`}
                onClick={(e) => { e.preventDefault(); navigate(`/explorar-formacoes?categoria=${cat.title}`); }}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 md:py-2.5 rounded-full border border-[#d1d4d8] bg-white hover:border-[#89919a] hover:bg-[#f0f1f3] transition-all text-[11px] font-semibold text-[#565d66]"
              >
                <span className="font-mono text-[9px] text-[#89919a]">0{i + 1}</span>
                {cat.title.split(",")[0].split(" e ")[0].trim()}
              </a>
            ))}
          </div>
          <div className="flex justify-center items-center gap-2 mt-1 md:hidden">
            {scrolledEnd ? (
              <span className="text-[10px] text-[#89919a] font-medium">Fim</span>
            ) : (
              <>
                <span className="text-[10px] text-[#89919a] font-medium">Deslize para ver mais</span>
                <ArrowRight size={12} className="text-[#89919a] animate-pulse" />
              </>
            )}
          </div>
        </div>

        <section id="servicos" className="mx-auto max-w-[1380px] px-6 pt-1 pb-4 md:px-12 md:pt-1 md:pb-4">
          <div>
            {sorted.map((category, index) => {
              const Icon = category.icon;
              const imgSrc = categoryImages[category.title];
              const number = String(index + 1).padStart(2, "0");
              return (
                <article key={category.title} className={`group border-t border-[#d1d4d8] py-4 md:py-8 ${index % 2 ? "md:ml-20" : ""}`}>
                  <div className="grid gap-7 md:grid-cols-[100px_minmax(0,1fr)_minmax(260px,370px)] md:items-start">
                    <span className="font-mono text-xs tracking-[0.2em] text-[#89919a]">{number}</span>
                    <div>
                      <h3 className="max-w-xl font-serif text-3xl leading-[1.08] text-[#30343a] md:text-[2.8rem]" style={{ fontFamily: "'Playfair Display', serif" }}>{category.title}</h3>
                      <p className="mt-4 max-w-md text-sm leading-7 text-[#686e76]">{category.description}</p>
                      <ul className="mt-6 space-y-3 border-l border-[#d7dade] pl-5 text-sm leading-5 text-[#565d66]">
                        {category.items.map((item) => (
                          <li key={item}>
                            <a
                              href={`/explorar-formacoes?categoria=${category.title}`}
                              className="flex gap-3 transition-transform duration-300 group-hover:translate-x-1 hover:text-[#30343a] cursor-pointer"
                            >
                              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#aeb6bf]" />
                              {item}
                            </a>
                          </li>
                        ))}
                      </ul>
                      <a
                        href={`/explorar-formacoes?categoria=${category.title}`}
                        className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#68727c] hover:text-[#30343a] transition-colors"
                      >
                        Ver mais <ChevronRight size={14} />
                      </a>
                    </div>
                    <div className="mt-4 md:mt-0">
                      {(() => {
                        const { stores: groupStores, storeProducts } = getStoresForGroup(category.title);
                        if (groupStores.length === 0) {
                          return (
                            <div className="rounded-2xl border border-dashed border-[#d1d4d8] p-6 text-center">
                              <p className="text-xs text-[#89919a]">Em breve novas lojas</p>
                            </div>
                          );
                        }
                        return (
                          <>
                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#89919a] mb-3">Lojas recentes</p>
                            <div>
                              <div className="flex flex-row flex-nowrap overflow-x-auto gap-3 scrollbar-hide">
                                {groupStores.slice(0, 4).map((store: any) => (
                                  <StoreCard key={store.id} store={store} productImages={storeProducts[store.id]} />
                                ))}
                              </div>
                              {groupStores.length > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-2 md:hidden">
                                  <span className="text-[10px] text-[#087a76] font-medium">Deslize para ver mais</span>
                                  <ArrowRight size={12} className="text-[#087a76] animate-pulse" />
                                </div>
                              )}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="essencia" className="border-y border-[#d9dde1] bg-[#eef0f2]">
          <div className="mx-auto grid max-w-[1380px] gap-10 px-6 py-10 md:grid-cols-[.75fr_1.25fr] md:px-12 md:py-14">
            <p className="font-mono text-[10px] uppercase tracking-[.25em] text-[#858e98]">A nossa essência</p>
            <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_220px] md:items-end">
              <div>
                <p className="max-w-3xl font-serif text-3xl leading-[1.2] text-[#34383d] md:text-5xl" style={{ fontFamily: "'Playfair Display', serif" }}>Há uma diferença entre aprender algo novo e <i>descobrir o que pode tornar-se.</i></p>
                <p className="mt-8 max-w-xl text-sm leading-7 text-[#6c7279]">Na Eliora, conectamos quem quer crescer com quem sabe ensinar. Cuidamos do percurso, do ritmo e da confiança — para que o aprendizado seja tão meaningful quanto o resultado.</p>
              </div>
              <figure className="relative aspect-[.78] overflow-hidden border border-[#cbd0d5] bg-[#e6e8ea]">
                <img
                  src="/formacoes/hero-formacoes.jpg"
                  alt="Aula de formação presencial"
                  className="h-full w-full object-cover object-center"
                  style={{ filter: "grayscale(0.64) contrast(0.9) brightness(1.06)" }}
                />
                <figcaption className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[.2em] text-white drop-shadow">02 — Aprender & crescer</figcaption>
              </figure>
            </div>
          </div>
          <div className="flex justify-center items-center gap-2 mt-1 md:hidden">
            <span className="text-[10px] text-[#89919a] font-medium">Deslize para ver mais</span>
            <ArrowRight size={12} className="text-[#89919a] animate-pulse" />
          </div>
        </section>

        <div className="mx-auto max-w-[1380px] px-6 py-10 md:px-12">
          <div className="grid gap-4 md:grid-cols-[1.35fr_.65fr]">
            <figure className="group relative min-h-[280px] overflow-hidden bg-[#e4e7e9] md:min-h-[360px]">
              <img
                src="/formacoes/tecnologia.jpg"
                alt="Formação em tecnologia e programação"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                style={{ filter: "grayscale(0.5) contrast(0.92) brightness(1.06)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#252a2f]/55 via-transparent to-transparent" />
              <figcaption className="absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-[.2em] text-white">03 — Tecnologia & inovação</figcaption>
            </figure>
            <figure className="group relative min-h-[280px] overflow-hidden bg-[#e4e7e9] md:min-h-[360px]">
              <img
                src="/formacoes/artes.jpg"
                alt="Aulas práticas de artes e hobbies"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                style={{ filter: "grayscale(0.34) contrast(0.9) brightness(1.1)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#252a2f]/45 via-transparent to-transparent" />
              <figcaption className="absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-[.2em] text-white">04 — Prática & criatividade</figcaption>
            </figure>
          </div>
        </div>

        <section id="contacto" className="relative overflow-hidden border-t border-[#cbd0d5] bg-[#2c3035] px-6 py-14 text-[#fafafa] md:px-12 md:py-20">
          <div className="absolute -right-16 -top-24 h-96 w-96 rounded-full border border-[#e4e7ea]/20" /><div className="absolute -right-4 -top-12 h-72 w-72 rounded-full border border-[#e4e7ea]/15" />
          <div className="relative mx-auto max-w-[1380px] md:flex md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.25em] text-[#b9c1ca]">O primeiro passo</p>
              <h2 className="mt-5 max-w-2xl font-serif text-5xl leading-[1.02] md:text-7xl" style={{ fontFamily: "'Playfair Display', serif" }}>A próxima competência pode começar<br /><i>numa conversa.</i></h2>
            </div>
            <div className="mt-10 md:mt-0 md:w-80">
              <p className="text-sm leading-6 text-[#cbd0d5]">Explore com calma. Quando encontrar o caminho certo, a Eliora ajuda a aproximá-lo de quem pode ensinar.</p>
              <button
                onClick={() => { window.open("https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20Eliora%20Forma%C3%A7%C3%B5es%20e%20gostaria%20de%20saber%20mais.", "_blank"); setSent(true); }}
                className="mt-7 flex items-center gap-4 border-b border-[#b9c1ca] pb-3 text-xs uppercase tracking-[.2em] text-[#e3e7eb]"
              >
                {sent ? "Mensagem recebida" : "Falar com a equipa"} <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>

        <footer className="mx-auto flex max-w-[1380px] flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-12">
          <Monogram />
          <p className="text-xs text-[#747b84]">Aprender. Praticar. Avançar.</p>
          <div className="flex items-center gap-5 text-[#747b84]">
            <a href="https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20Eliora%20Forma%C3%A7%C3%B5es%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><Mail size={16} /></a>
            <a href="https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20Eliora%20Forma%C3%A7%C3%B5es%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><Phone size={16} /></a>
            <a href="#" aria-label="Instagram"><Instagram size={16} /></a>
            <span className="font-mono text-[10px] tracking-[.2em]">© 2024 ELIORA</span>
          </div>
        </footer>
      </div>

      {onBackToSelector && (
        <button
          onClick={onBackToSelector}
          className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-full border border-[#d1d4d8] bg-white px-4 py-2.5 text-xs font-bold text-[#30343a] shadow-lg transition hover:bg-[#f0f1f3]"
        >
          Trocar loja
        </button>
      )}
    </main>
  );
}

export default FormacoesHome;
