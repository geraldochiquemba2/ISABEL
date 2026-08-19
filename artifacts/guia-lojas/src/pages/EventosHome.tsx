import { useMemo, useState, useEffect, type FormEvent } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  ArrowRight, Camera, Check, ChevronDown, Menu, Music2,
  Send, ShieldCheck, Sparkles, TentTree, Utensils,
} from "lucide-react";
import "./EventosHome.css";

type Category = { title: string; icon: typeof Sparkles; items: string[] };

const categories: Category[] = [
  { title: "Planeamento, Design e Assessoria de Eventos", icon: Sparkles, items: ["Decoração Temática", "Organização e Assessoria de Festas Infantis e Batizados", "Planeamento de Aniversários, Chás de Bebé e Chás de Panela", "Organização de Eventos Corporativos, Jantares e Galas"] },
  { title: "Estrutura, Mobilia e Aluguer de Equipamentos", icon: TentTree, items: ["Aluguer de Som", "Iluminação Profissional", "Palcos", "Aluguer de Tendas", "Mesas e Cadeiras", "Louça para Festas", "Aluguer de Geradores e Equipamentos Elétricos de Apoio", "Telões de LED, Projetores e Fotomatões (360º / Photobooth)"] },
  { title: "Gastronomia, Bar e Restauração para Eventos", icon: Utensils, items: ["Serviços de Catering e Buffets Temáticos", "Bolos Artísticos, Doces Finos e Salgados", "Bar de Cócteis e Baristas"] },
  { title: "Animação, Entretenimento e Atração de Pistas", icon: Music2, items: ["DJs, Bandas Musicais e Grupos Acústicos", "Animadores Infantis, Palhaços e Pinturas Faciais", "Aluguer de Insufláveis, Brinquedos e Trampolins"] },
  { title: "Staff Profissional e Segurança", icon: ShieldCheck, items: ["Garçons, Barman, Copeiros e Cozinheiros para Festas", "Hostesses, Rececionistas e Promotores de Eventos", "Equipas de Segurança Privada e Controlo de Acessos", "Limpeza Antes, Durante e Pós-Evento"] },
  { title: "Registo, Memória e Fotografia", icon: Camera, items: ["Fotógrafos de Festas e Eventos Sociais", "Fotógrafos Corporativos e de Galas", "Videomakers", "Cabines Fotográficas (Photobooth / 360º)"] },
];

const categoryImages: Record<string, string> = {
  "Planeamento, Design e Assessoria de Eventos": "/eventos/decoracao.jpg",
  "Estrutura, Mobilia e Aluguer de Equipamentos": "/eventos/equipamentos.jpg",
  "Gastronomia, Bar e Restauração para Eventos": "/eventos/gastronomia.jpg",
  "Animação, Entretenimento e Atração de Pistas": "/eventos/animacao.jpg",
  "Staff Profissional e Segurança": "/eventos/staff.jpg",
  "Registo, Memória e Fotografia": "/eventos/fotografia.jpg",
};

export function EventosHome({ onBackToSelector }: { onBackToSelector?: () => void }) {
  useThemeColor("#8e5557");
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const localUserStr = typeof window !== "undefined" ? localStorage.getItem("guialocal_user") : null;
  const localUser = localUserStr ? JSON.parse(localUserStr) : null;
  const isLoggedIn = !!localUser && localUser.storeType === "eventos";

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const sortedCategories = useMemo(() =>
    [...categories]
      .sort((a, b) => b.items.length - a.items.length)
      .map((cat, i) => ({ ...cat, number: String(i + 1).padStart(2, "0") })),
    []
  );

  const filtered = useMemo(() =>
    sortedCategories.filter((cat) =>
      !query ||
      cat.title.toLowerCase().includes(query.toLowerCase()) ||
      cat.items.some((item) => item.toLowerCase().includes(query.toLowerCase()))
    ),
    [query, sortedCategories]
  );

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <main className="min-h-[100dvh] overflow-x-hidden text-[#3c2731]" style={{ fontFamily: "'DM Sans', sans-serif", background: "#fffcf9" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap');
        .eliora-grain:after{content:"";position:fixed;inset:0;pointer-events:none;opacity:.035;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E")}
        @keyframes rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}} .rise{animation:rise .8s ease both}.delay-1{animation-delay:.14s}.delay-2{animation-delay:.26s}
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 mx-auto flex max-w-[1380px] items-center justify-between px-6 py-6 md:px-12 bg-[#fffcf9]/90 backdrop-blur-md">
        <a className="flex items-center gap-3 no-underline" href="#top" aria-label="Eliora Eventos & Celebrações">
          <img
            src="/logo-eliora-dark.svg"
            alt="Eliora"
            style={{ width: "39px", height: "39px", filter: "brightness(0) saturate(100%) invert(35%) sepia(40%) saturate(400%) hue-rotate(320deg) brightness(85%) contrast(85%)" }}
          />
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", letterSpacing: "-.02em", color: "#3c2731" }}>Eliora<small style={{ display: "block", color: "#8e5557", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: ".23em", fontSize: "8px", marginTop: "2px" }}>Eventos & Celebrações</small></span>
        </a>
        <nav className={`${menuOpen ? "absolute left-0 right-0 top-full flex bg-white px-6 pb-7 shadow-sm" : "hidden"} flex-col gap-5 text-xs uppercase tracking-[0.18em] md:static md:flex md:flex-row md:items-center md:gap-9 md:bg-transparent md:p-0 md:shadow-none`}>
          <button onClick={() => scrollTo("servicos")} className="text-left transition-colors hover:text-[#8e5557]">Serviços</button>
          <a href="/explorar-eventos" className="text-left transition-colors hover:text-[#8e5557]">Explorar</a>
          <button onClick={() => scrollTo("processo")} className="text-left transition-colors hover:text-[#8e5557]">Processo</button>
          {isLoggedIn ? (
            <>
              <a href="/dashboard-eventos" className="flex items-center gap-2 text-left text-[#3c2731] font-medium hover:text-[#8e5557] transition-colors">Painel</a>
              <button onClick={() => { localStorage.removeItem("guialocal_user"); window.location.reload(); }} className="flex items-center gap-2 text-left text-[#3c2731]/65 hover:text-[#3c2731] transition-colors">Sair</button>
            </>
          ) : (
            <a href="/login-eventos" className="flex items-center gap-2 text-left text-[#3c2731]/65 hover:text-[#3c2731] transition-colors">Entrar</a>
          )}
          {onBackToSelector && (
            <button onClick={onBackToSelector} className="flex items-center gap-2 text-left text-[#68727c] hover:text-[#3c2731] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Trocar loja
            </button>
          )}
        </nav>
        <button aria-label="Abrir menu" onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">{menuOpen ? "✕" : <Menu size={21} />}</button>
      </header>
      {menuOpen && (
        <div className="md:hidden absolute left-0 right-0 top-[72px] z-40 bg-white px-6 pb-7 shadow-lg flex flex-col gap-5 text-xs uppercase tracking-[0.18em]">
          <button onClick={() => scrollTo("servicos")} className="text-left py-2">Serviços</button>
          <a href="/explorar-eventos" className="text-left py-2">Explorar</a>
          <button onClick={() => scrollTo("processo")} className="text-left py-2">Processo</button>
          {isLoggedIn ? (
            <>
              <a href="/dashboard-eventos" className="text-left py-2 font-medium">Painel</a>
              <button onClick={() => { localStorage.removeItem("guialocal_user"); window.location.reload(); }} className="text-left py-2">Sair</button>
            </>
          ) : (
            <a href="/login-eventos" className="text-left py-2">Entrar</a>
          )}
          {onBackToSelector && (
            <button onClick={() => { setMenuOpen(false); onBackToSelector(); }} className="text-left py-2">Trocar loja</button>
          )}
        </div>
      )}

      <div className="eliora-grain">
        <div className="mx-auto max-w-[1380px] px-4 pt-20 pb-1 md:px-12 md:pt-24 md:pb-2">
          <div className="flex flex-row flex-nowrap overflow-x-auto gap-2 scrollbar-hide pb-1">
            {filtered.map((cat) => (
              <a
                key={cat.title}
                href="#servicos"
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#d1d4d8] bg-white hover:border-[#8e5557] hover:bg-[#fff5f6] transition-all text-[11px] font-semibold text-[#68727c]"
                onClick={(e) => { e.preventDefault(); scrollTo("servicos"); }}
              >
                <span className="font-mono text-[9px] text-[#8e5557]">{cat.number}</span>
                {cat.title.split(",")[0].trim()}
              </a>
            ))}
          </div>
          <div className="flex justify-center items-center gap-2 mt-1 md:hidden">
            <span className="text-[10px] text-[#8e5557] font-medium">Deslize para ver mais</span>
            <ArrowRight size={12} className="text-[#8e5557] animate-pulse" />
          </div>
        </div>

        <section id="servicos" className="mx-auto max-w-[1380px] px-6 pt-1 pb-4 md:px-12 md:pt-1 md:pb-4">
          <div>
            {filtered.map((cat, i) => {
              const Icon = cat.icon;
              const imgSrc = categoryImages[cat.title];
              return (
                <article key={cat.title} className={`border-t border-[#d1d4d8] py-4 md:py-8 ${i % 2 ? "md:ml-20" : ""}`}>
                  <div className="grid gap-7 md:grid-cols-[100px_minmax(0,1fr)_minmax(260px,370px)] md:items-start">
                    <span className="font-mono text-xs tracking-[0.2em] text-[#8e5557]">{cat.number}</span>
                    <div>
                      <h3 className="max-w-xl font-serif text-3xl leading-[1.08] text-[#3c2731] md:text-[2.8rem]">{cat.title}</h3>
                      <ul className="mt-6 space-y-3 border-l border-[#d7dade] pl-5 text-sm leading-5 text-[#565d66]">
                        {cat.items.map((item) => (
                          <li key={item} className="flex gap-3 items-start">
                            <Check size={14} className="mt-0.5 shrink-0 text-[#8e5557]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4 md:mt-0">
                      {imgSrc ? (
                        <div className="relative overflow-hidden rounded-2xl border border-[#d1d4d8]">
                          <img src={imgSrc} alt={cat.title} className="w-full h-64 object-cover" style={{ filter: "grayscale(0.3) contrast(0.95) brightness(1.05)" }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#3c2731]/40 via-transparent to-transparent" />
                          <p className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white drop-shadow">#{cat.number}</p>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-[#d1d4d8] p-6 text-center">
                          <Icon size={20} className="mx-auto mb-2 text-[#8e5557]" />
                          <p className="text-xs text-[#87909a]">Imagem em breve</p>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-[1380px] px-6 py-4 md:px-12">
          <div className="flex items-center gap-3">
            <input
              className="flex-1 rounded-full border border-[#d1d4d8] bg-white px-4 py-2 text-sm text-[#3c2731] outline-none focus:border-[#8e5557] transition-colors"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Procurar um serviço..."
              aria-label="Procurar um serviço"
            />
            <span className="font-mono text-[10px] text-[#87909a]">{filtered.length} categorias</span>
          </div>
        </section>

        <section id="contacto" className="relative overflow-hidden border-t border-[#d4b0a8] px-6 py-14 md:px-12 md:py-20" style={{ background: "#f0d5cc" }}>
          <div className="absolute -right-16 -top-24 h-96 w-96 rounded-full border border-[#8e5557]/10" />
          <div className="absolute -right-4 -top-12 h-72 w-72 rounded-full border border-[#8e5557]/8" />
          <div className="relative mx-auto max-w-[1380px] md:flex md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.25em] text-[#8e5557]">Vamos conversar</p>
              <h2 className="mt-5 max-w-2xl font-serif text-5xl leading-[1.02] text-[#3c2731] md:text-7xl">Já imaginou o<br /><i>momento?</i></h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-[#6b4a4c]">Conte-nos o que tem em mente. Respondemos com uma proposta pensada para si, sem compromissos.</p>
            </div>
            <div className="mt-10 md:mt-0 md:w-80">
              <form className="flex flex-col gap-3" onSubmit={submit}>
                <input type="text" placeholder="O seu nome" required className="rounded-full border border-[#d1d4d8] bg-white px-4 py-2 text-sm text-[#3c2731] outline-none focus:border-[#8e5557] transition-colors" />
                <input type="email" placeholder="O seu e-mail" required className="rounded-full border border-[#d1d4d8] bg-white px-4 py-2 text-sm text-[#3c2731] outline-none focus:border-[#8e5557] transition-colors" />
                <button type="submit" className="flex items-center justify-center gap-2 rounded-full bg-[#8e5557] px-5 py-2.5 text-xs uppercase tracking-[.15em] text-white hover:bg-[#7a4849] transition-colors">
                  <Send size={14} /> Enviar pedido
                </button>
              </form>
              {sent && <p className="mt-3 flex items-center gap-2 text-sm text-[#8e5557]"><Check size={14} /> Pedido recebido. Falamos consigo em breve.</p>}
              <a
                href="https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20Eliora%20Eventos%20%26%20Celebra%C3%A7%C3%B5es%20e%20gostaria%20de%20pedir%20um%20or%C3%A7amento."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 flex items-center gap-4 border-b border-[#8e5557] pb-3 text-xs uppercase tracking-[.2em] text-[#3c2731] hover:text-[#8e5557] transition-colors"
              >
                {formOpen ? "Preencha os seus dados" : "Pedir orçamento"} <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </section>

        <footer className="mx-auto flex max-w-[1380px] flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-12">
          <div className="flex items-center gap-3">
            <img src="/logo-eliora-dark.svg" alt="Eliora" className="w-8 h-8" style={{ filter: "brightness(0) saturate(100%) invert(35%) sepia(40%) saturate(400%) hue-rotate(320deg) brightness(85%) contrast(85%)" }} />
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", letterSpacing: "-.02em", color: "#3c2731" }}>Eliora</span>
          </div>
          <p className="text-xs text-[#747b84]">© Eliora Eventos & Celebrações · Luanda, Angola</p>
          <p className="text-xs text-[#747b84]">Celebrar com intenção</p>
        </footer>
      </div>
    </main>
  );
}

export default EventosHome;
