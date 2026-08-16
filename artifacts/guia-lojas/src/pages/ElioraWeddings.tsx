import { useState } from "react";
import { ArrowDown, ArrowUpRight, ChevronRight, Menu, X, Sparkles, Instagram, Mail, Phone } from "lucide-react";

type ServiceGroup = {
  number: string;
  title: string;
  intro: string;
  items: string[];
};

interface ElioraWeddingsProps {
  onBackToSelector?: () => void;
}

const groups: ServiceGroup[] = [
  {
    number: "01",
    title: "Planeamento, Assessoria e Experiência do Casal",
    intro: "Do primeiro sim ao último brinde, guardamos o fio invisível de tudo.",
    items: ["Wedding Planner & Assessoria do Evento", "Assistente Pessoal dos Noivos", "Weddings & Mini-Weddings", "Mestre de Cerimónias", "Hostesses e Acolhimento VIP"],
  },
  {
    number: "02",
    title: "Pedidos de Casamento, Noivados e Momentos Românticos",
    intro: "Gestos íntimos, pensados para a vossa história e para aquele instante único.",
    items: ["Criador de Pedidos de Casamento", "Aniversários de Namoro/Casamento", "Chefs ao Domicílio para Jantares Íntimos", "Serenatas e Músicos para Pedidos"],
  },
  {
    number: "03",
    title: "Registo, Memória e Conteúdo Digital",
    intro: "A beleza do dia, preservada com verdade, intenção e um olhar atento.",
    items: ["Fotógrafos", "Videomakers e Criadores de Conteúdo"],
  },
  {
    number: "04",
    title: "Beleza, Estilo e Cuidados Pessoais dos Noivos",
    intro: "Tempo para respirar, cuidar e chegar ao altar inteiramente presentes.",
    items: ["Ateliê de Vestidos de Noiva", "Ateliê de Fatos de Noivos", "Make Up Artist & Hair Stylist (Dia da Noiva)", "Estética, SPA e Massagem para Noivos"],
  },
  {
    number: "05",
    title: "Espaço, Decoração, Gastronomia e Animação",
    intro: "O cenário, os sabores e o ritmo que fazem cada celebração ganhar alma.",
    items: ["Locais e Espaços para Eventos", "Design Floral & Decoração Temática", "Catering, Bolos de Noiva e Bar de Cocktails", "DJs, Bandas e Entretenimento"],
  },
];

function Monogram() {
  return (
    <div className="flex items-center gap-3">
      <img 
        src="/logo-eliora-dark.svg" 
        alt="Eliora Weddings" 
        className="w-10 h-10"
      />
      <span className="font-serif text-xl tracking-[0.08em] text-[#2d2c2b]">Eliora <i className="font-normal">Weddings</i></span>
    </div>
  );
}

function ServiceBlock({ group, index }: { group: ServiceGroup; index: number }) {
  return (
    <article className={`group border-t border-[#d1d4d8] py-8 md:py-12 ${index % 2 ? "md:ml-20" : ""}`}>
      <div className="grid gap-7 md:grid-cols-[100px_minmax(0,1fr)_minmax(260px,370px)] md:items-start">
        <span className="font-mono text-xs tracking-[0.2em] text-[#89919a]">{group.number}</span>
        <div>
          <h3 className="max-w-xl font-serif text-3xl leading-[1.08] text-[#30343a] md:text-[2.8rem]">{group.title}</h3>
          <p className="mt-4 max-w-md text-sm leading-7 text-[#686e76]">{group.intro}</p>
        </div>
        <ul className="space-y-3 border-l border-[#d7dade] pl-5 text-sm leading-5 text-[#565d66]">
          {group.items.map((item) => <li key={item} className="flex gap-3 transition-transform duration-300 group-hover:translate-x-1"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#aeb6bf]" />{item}</li>)}
        </ul>
      </div>
    </article>
  );
}

export function ElioraWeddings({ onBackToSelector }: ElioraWeddingsProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-[#fafafa] text-[#30343a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap');
        .eliora-grain:after{content:"";position:fixed;inset:0;pointer-events:none;opacity:.035;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E")}
        @keyframes rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}} .rise{animation:rise .8s ease both}.delay-1{animation-delay:.14s}.delay-2{animation-delay:.26s}
      `}</style>
      
      {onBackToSelector && (
        <button
          onClick={onBackToSelector}
          className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-3 bg-[#2c3035] text-white text-sm font-medium rounded-full shadow-lg hover:bg-[#1a1d20] transition-all hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Trocar loja
        </button>
      )}

      <div className="eliora-grain">
        <header className="relative z-20 mx-auto flex max-w-[1380px] items-center justify-between px-6 py-6 md:px-12">
          <Monogram />
          <nav className={`${menuOpen ? "absolute left-0 right-0 top-full flex bg-[#fafafa] px-6 pb-7 shadow-sm" : "hidden"} flex-col gap-5 text-xs uppercase tracking-[0.18em] md:static md:flex md:flex-row md:items-center md:gap-9 md:bg-transparent md:p-0 md:shadow-none`}>
            <button onClick={() => scrollTo("servicos")} className="text-left transition-colors hover:text-[#77818c]">Serviços</button>
            <button onClick={() => scrollTo("essencia")} className="text-left transition-colors hover:text-[#77818c]">A nossa essência</button>
            <button onClick={() => scrollTo("contacto")} className="flex items-center gap-2 text-left text-[#68727c]">Falar com a Eliora <ArrowUpRight size={14} /></button>
            {onBackToSelector && (
              <button onClick={onBackToSelector} className="flex items-center gap-2 text-left text-[#68727c] hover:text-[#30343a] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Trocar loja
              </button>
            )}
          </nav>
          <button aria-label="Abrir menu" onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">{menuOpen ? <X size={20} /> : <Menu size={21} />}</button>
        </header>

        <section className="relative mx-auto grid max-w-[1380px] items-center gap-14 px-6 pb-24 pt-14 md:grid-cols-[1.1fr_.9fr] md:px-12 md:pb-36 md:pt-20">
          <div className="relative z-10">
            <p className="rise flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-[#87909a]"><Sparkles size={13} /> Concierge de celebrações · Luanda e além</p>
            <h1 className="rise delay-1 mt-8 max-w-3xl font-serif text-[4.3rem] leading-[.94] tracking-[-.04em] text-[#252a2f] md:text-[7.6rem]">O amor,<br /><i className="font-medium text-[#9aa2ab]">bem celebrado.</i></h1>
            <p className="rise delay-2 mt-9 max-w-md text-base leading-7 text-[#6d737b]">Bem-vindos à Eliora Weddings — onde cada promessa encontra o cuidado, a beleza e a calma para se tornar memória.</p>
            <button onClick={() => scrollTo("servicos")} className="rise delay-2 mt-9 flex items-center gap-4 border-b border-[#aeb6bf] pb-3 text-xs uppercase tracking-[0.2em] text-[#68727c] transition-all hover:gap-6">Descobrir os serviços <ArrowDown size={15} /></button>
          </div>
          <div className="relative mx-auto aspect-[.82] w-full max-w-[450px]">
            <div className="absolute inset-0 rotate-[-5deg] rounded-[48%_48%_4%_4%] border border-[#cbd0d5]" />
            <div className="absolute inset-[8%] rotate-[4deg] overflow-hidden rounded-[48%_48%_4%_4%] bg-[#e5e7e9]">
              <img
                src="/weddings/eliora-hero-couple.jpg"
                alt="Casal a celebrar uma ocasião especial"
                className="h-full w-full object-cover object-center"
                style={{ filter: "grayscale(0.78) contrast(0.88) brightness(1.08)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#56616b]/35 via-transparent to-white/20" />
              <div className="absolute left-[17%] top-[14%] h-20 w-12 rounded-full border border-white/70 opacity-70" />
            </div>
            <span className="absolute -bottom-4 -left-7 font-mono text-[10px] uppercase tracking-[.25em] text-[#858e98] md:-left-12">01 — Intenção & presença</span>
          </div>
        </section>

        <section id="essencia" className="border-y border-[#d9dde1] bg-[#eef0f2]">
          <div className="mx-auto grid max-w-[1380px] gap-10 px-6 py-16 md:grid-cols-[.75fr_1.25fr] md:px-12 md:py-24">
            <p className="font-mono text-[10px] uppercase tracking-[.25em] text-[#858e98]">A nossa essência</p>
            <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_220px] md:items-end">
              <div>
                <p className="max-w-3xl font-serif text-3xl leading-[1.2] text-[#34383d] md:text-5xl">Há uma diferença entre organizar um evento e <i>orquestrar uma experiência.</i></p>
                <p className="mt-8 max-w-xl text-sm leading-7 text-[#6c7279]">Na Eliora, cuidamos do que se vê e do que se sente. Reunimos pessoas, talentos e detalhes com discrição, para que possam viver o que realmente importa: estar juntos.</p>
              </div>
              <figure className="relative aspect-[.78] overflow-hidden border border-[#cbd0d5] bg-[#e6e8ea]">
                <img
                  src="/weddings/eliora-bridal-portrait.jpg"
                  alt="Retrato editorial de uma noiva"
                  className="h-full w-full object-cover object-center"
                  style={{ filter: "grayscale(0.64) contrast(0.9) brightness(1.06)" }}
                />
                <figcaption className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[.2em] text-white drop-shadow">02 — Beleza & presença</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section id="servicos" className="mx-auto max-w-[1380px] px-6 py-20 md:px-12 md:py-32">
          <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[.25em] text-[#87909a]">O nosso universo</p><h2 className="mt-4 font-serif text-5xl tracking-[-.03em] md:text-7xl">Tudo começa<br /><i>com vocês.</i></h2></div><p className="max-w-xs text-sm leading-6 text-[#747b84]">Uma rede de especialistas e experiências para os momentos que merecem mais.</p></div>
          <div className="mb-20 grid gap-4 md:grid-cols-[1.35fr_.65fr]">
            <figure className="group relative min-h-[280px] overflow-hidden bg-[#e4e7e9] md:min-h-[360px]">
              <img
                src="/weddings/eliora-reception.jpg"
                alt="Mesa de receção de casamento em branco e prata"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                style={{ filter: "grayscale(0.5) contrast(0.92) brightness(1.06)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#252a2f]/55 via-transparent to-transparent" />
              <figcaption className="absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-[.2em] text-white">03 — Espaço & celebração</figcaption>
            </figure>
            <figure className="group relative min-h-[280px] overflow-hidden bg-[#e4e7e9] md:min-h-[360px]">
              <img
                src="/weddings/eliora-florals.jpg"
                alt="Flores brancas numa mesa de casamento"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                style={{ filter: "grayscale(0.34) contrast(0.9) brightness(1.1)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#252a2f]/45 via-transparent to-transparent" />
              <figcaption className="absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-[.2em] text-white">04 — Detalhe & intenção</figcaption>
            </figure>
          </div>
          <div>{groups.map((group, i) => <ServiceBlock key={group.number} group={group} index={i} />)}</div>
        </section>

        <section id="contacto" className="relative overflow-hidden border-t border-[#cbd0d5] bg-[#2c3035] px-6 py-24 text-[#fafafa] md:px-12 md:py-32">
          <div className="absolute -right-16 -top-24 h-96 w-96 rounded-full border border-[#e4e7ea]/20" /><div className="absolute -right-4 -top-12 h-72 w-72 rounded-full border border-[#e4e7ea]/15" />
          <div className="relative mx-auto max-w-[1380px] md:flex md:items-end md:justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.25em] text-[#b9c1ca]">O primeiro passo</p><h2 className="mt-5 max-w-2xl font-serif text-5xl leading-[1.02] md:text-7xl">Vamos criar espaço<br /><i>para a vossa história?</i></h2></div><div className="mt-10 md:mt-0 md:w-80"><p className="text-sm leading-6 text-[#cbd0d5]">Contem-nos o que estão a imaginar. A nossa equipa responde com tempo, atenção e uma primeira ideia.</p><button onClick={() => setSent(true)} className="mt-7 flex items-center gap-4 border-b border-[#b9c1ca] pb-3 text-xs uppercase tracking-[.2em] text-[#e3e7eb]">{sent ? "Mensagem recebida" : "Falar com a equipa"} <ChevronRight size={15} /></button></div></div>
        </section>

        <footer className="mx-auto flex max-w-[1380px] flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-12"><Monogram /><p className="text-xs text-[#747b84]">Celebrações com intenção, em Angola e além.</p><div className="flex items-center gap-5 text-[#747b84]"><a href="mailto:ola@elioraweddings.com" aria-label="Email"><Mail size={16} /></a><a href="tel:+244900000000" aria-label="Telefone"><Phone size={16} /></a><a href="#" aria-label="Instagram"><Instagram size={16} /></a><span className="font-mono text-[10px] tracking-[.2em]">© 2024 ELIORA</span></div></footer>
      </div>
    </main>
  );
}

export default ElioraWeddings;