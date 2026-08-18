import { useMemo, useState, useEffect, type FormEvent } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  ArrowDown, ArrowRight, Camera, Check, ChevronDown, Crown, Menu, Music2,
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
  const [open, setOpen] = useState<number | null>(0);
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const filtered = useMemo(() => categories.map((cat, index) => ({ ...cat, index, items: cat.items.filter((item) => item.toLowerCase().includes(query.toLowerCase())) })).filter((cat) => !query || cat.title.toLowerCase().includes(query.toLowerCase()) || cat.items.length), [query]);
  const scrollToCatalog = () => document.getElementById("servicos")?.scrollIntoView({ behavior: "smooth" });
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); };
  return (
    <main className="eliora-page">
      <nav className="eliora-nav">
        <a className="eliora-mark" href="#top" aria-label="Eliora Eventos & Celebrações">
          <img
            src="/logo-eliora-dark.svg"
            alt="Eliora"
            style={{ width: "39px", height: "39px", filter: "brightness(0) saturate(100%) invert(35%) sepia(40%) saturate(400%) hue-rotate(320deg) brightness(85%) contrast(85%)" }}
          />
          <span className="eliora-mark-name">Eliora<small>Eventos & Celebrações</small></span>
        </a>
        <div className="eliora-navlinks"><a href="#servicos">Serviços</a><a href="#processo">Como ajudamos</a>{onBackToSelector && <button onClick={onBackToSelector} style={{ fontSize: "12px", color: "var(--muted)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "color .25s" }}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>Trocar loja</button>}<button className="eliora-nav-cta" onClick={() => { setFormOpen(true); document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" }); }}>Pedir orçamento</button></div>
        <div className="eliora-mobile-menu">
          {menuOpen && (
            <div className="eliora-mobile-dropdown">
              <a href="#servicos" onClick={() => setMenuOpen(false)}>Serviços</a>
              <a href="#processo" onClick={() => setMenuOpen(false)}>Como ajudamos</a>
              {onBackToSelector && <button onClick={() => { setMenuOpen(false); onBackToSelector(); }}>Trocar loja</button>}
              <button onClick={() => { setMenuOpen(false); setFormOpen(true); document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" }); }}>Pedir orçamento</button>
            </div>
          )}
        </div>
        <button className="eliora-nav-cta" aria-label="Abrir menu" onClick={() => setMenuOpen(!menuOpen)}><Menu size={17} /></button>
      </nav>
      <section className="eliora-hero" id="top">
        <div>
          <div className="eliora-kicker">Momentos que ficam</div>
          <h1>O seu dia merece <em>brilho.</em></h1>
          <p className="eliora-hero-copy">Em Luanda e onde a sua celebração nos levar, reunimos pessoas, ideias e fornecedores para transformar planos bonitos em memórias inesquecíveis.</p>
          <div className="eliora-hero-actions"><button className="eliora-primary" onClick={scrollToCatalog}>Explorar serviços <ArrowDown size={15} /></button><a href="#contacto" className="eliora-text-link">Fale connosco</a></div>
        </div>
        <div style={{ position: "relative", width: "100%", maxWidth: "420px", aspectRatio: "0.82", margin: "0 auto" }}>
          <div style={{ position: "absolute", inset: 0, rotate: "-4deg", borderRadius: "48% 48% 4% 4%", border: "1px solid rgba(173,105,107,0.3)" }} />
          <div style={{ position: "absolute", inset: "6%", rotate: "3deg", borderRadius: "48% 48% 4% 4%", overflow: "hidden", background: "#f0dfc4" }}>
            <img
              src="/eventos/hero-eventos.jpg"
              alt="Eventos Eliora"
              style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.3) contrast(0.95) brightness(1.05)" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(173,105,107,0.25), transparent, rgba(255,253,250,0.1))" }} />
            <div style={{ position: "absolute", left: "17%", top: "14%", width: "48px", height: "72px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.7)", opacity: 0.7 }} />
          </div>
        </div>
      </section>
      <section className="eliora-intro" id="processo"><h2>Encontre a peça<br /><em>que faltava.</em></h2><p>Escolha uma categoria para descobrir os detalhes. A nossa equipa ajuda a compor cada parte com cuidado, bom gosto e parceiros de confiança.</p></section>
      <section className="eliora-catalog" id="servicos">
        <div className="eliora-tools"><span className="eliora-count">{filtered.length.toString().padStart(2, "0")} categorias disponíveis</span><input className="eliora-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Procurar um serviço..." aria-label="Procurar um serviço" /></div>
        <div className="eliora-grid">
          {filtered.map((category) => { const Icon = category.icon; const isOpen = open === category.index; const imgSrc = categoryImages[category.title]; return <article className={`eliora-card ${isOpen ? "open" : ""}`} key={category.title}>
            {imgSrc && (
              <div style={{ position: "relative", height: "160px", overflow: "hidden" }}>
                <img src={imgSrc} alt={category.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s", filter: "grayscale(0.3) contrast(0.95) brightness(1.05)" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(255,253,250,1), rgba(255,253,250,0.2), transparent)" }} />
                <div style={{ position: "absolute", bottom: "12px", left: "12px" }}>
                  <span className="eliora-card-icon"><Icon size={17} strokeWidth={1.6} /></span>
                </div>
              </div>
            )}
            <button className="eliora-card-head" onClick={() => setOpen(isOpen ? null : category.index)} aria-expanded={isOpen}><span className="eliora-card-number">0{category.index + 1}</span>{!imgSrc && <span className="eliora-card-icon"><Icon size={17} strokeWidth={1.6} /></span>}<span className="eliora-card-title">{category.title}</span><ChevronDown className="eliora-chevron" size={18} /></button>
            <ul className="eliora-items">{category.items.map((item) => <li key={item}><Check size={13} />{item}</li>)}</ul>
          </article>; })}
        </div>
      </section>
      <section className="eliora-contact" id="contacto"><div className="eliora-contact-box"><div><div className="eliora-kicker">Vamos conversar</div><h2>Já imaginou o momento?</h2><p>Conte-nos o que tem em mente. Respondemos com uma proposta pensada para si, sem compromissos.</p>
        <form className={`eliora-form ${formOpen ? "show" : ""}`} onSubmit={submit}><input type="text" placeholder="O seu nome" required /><input type="email" placeholder="O seu e-mail" required /><button className="eliora-primary" type="submit"><Send size={14} /> Enviar pedido</button></form>{sent && <div className="eliora-success show"><Check size={14} /> Pedido recebido. Falamos consigo em breve.</div>}</div><a href="https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20Eliora%20Eventos%20%26%20Celebra%C3%A7%C3%B5es%20e%20gostaria%20de%20pedir%20um%20or%C3%A7amento." target="_blank" rel="noopener noreferrer" className="eliora-primary" style={{ textDecoration: "none" }}>{formOpen ? "Preencha os seus dados" : "Pedir orçamento"} <ArrowRight size={15} /></a></div>      </section>
      {onBackToSelector && (
        <button
          onClick={onBackToSelector}
          style={{ position: "fixed", bottom: "20px", left: "20px", zIndex: 50, padding: "10px 18px", borderRadius: "30px", border: "1px solid #eadfd7", background: "#fffdfa", color: "#3c2731", fontSize: "11px", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
        >
          Trocar loja
        </button>
      )}
      <footer className="eliora-footer"><span>© Eliora Eventos & Celebrações</span><span>Luanda · Angola &nbsp;|&nbsp; Celebrar com intenção</span></footer>
    </main>
  );
}

export default EventosHome;