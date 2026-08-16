import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  Camera,
  Check,
  ChevronDown,
  Clock3,
  Gift,
  HeartHandshake,
  Home,
  MapPin,
  Menu,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  X,
} from "lucide-react";

type Service = {
  title: string;
  description: string;
  icon: typeof Gift;
  tone: string;
  items: string[];
};

const services: Service[] = [
  {
    title: "Actos de Amor, Homenagens e Experiências",
    description: "Faça-se presente nos dias que mais importam.",
    icon: HeartHandshake,
    tone: "coral",
    items: ["Presentes e buquês", "Cartas escritas à mão", "Serenatas e músicos", "Festas íntimas"],
  },
  {
    title: "Fotografia e Videomakers",
    description: "Guarde o instante. Conte a história inteira.",
    icon: Camera,
    tone: "saffron",
    items: ["Fotógrafos", "Videomakers"],
  },
  {
    title: "Saúde, Cuidado e Bem-Estar ao Domicílio",
    description: "Cuidado especializado, no conforto de casa.",
    icon: Stethoscope,
    tone: "teal",
    items: ["Enfermagem e médicos", "Fisioterapia e massagens", "Apoio psicológico", "Personal trainers"],
  },
  {
    title: "Gestão do Lar e Refeições",
    description: "Mais tempo para si. Uma casa que respira.",
    icon: Home,
    tone: "plum",
    items: ["Cozinheiras e meal prep", "Personal organizers", "Limpeza profunda", "Assistente de compras"],
  },
  {
    title: "Burocracias",
    description: "Nós tratamos do que não pode esperar.",
    icon: Clock3,
    tone: "navy",
    items: ["Pendências diárias", "Filas", "Entregas urgentes"],
  },
];

function ServiceCard({ service, onRequest }: { service: Service; onRequest: (title: string) => void }) {
  const [saved, setSaved] = useState(false);
  const Icon = service.icon;
  return (
    <article className={`mimo-service mimo-${service.tone}`}>
      <div className="mimo-card-top">
        <span className="mimo-icon"><Icon size={21} strokeWidth={1.8} /></span>
        <button className={`mimo-save ${saved ? "saved" : ""}`} onClick={() => setSaved(!saved)} aria-label="Guardar serviço">
          <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      <ul>{service.items.map((item) => <li key={item}><Check size={13} />{item}</li>)}</ul>
      <button className="mimo-card-link" onClick={() => onRequest(service.title)}>Explorar serviços <ArrowRight size={16} /></button>
    </article>
  );
}

export function MimoHome({ onBackToSelector }: { onBackToSelector?: () => void }) {
  const [query, setQuery] = useState("");
  const [menu, setMenu] = useState(false);
  const [request, setRequest] = useState(false);
  const [selected, setSelected] = useState("");
  const [nome, setNome] = useState("");
  const [contacto, setContacto] = useState("");
  const [mensagem, setMensagem] = useState("");

  const visibleServices = useMemo(() => {
    const term = query.toLowerCase().trim();
    if (!term) return services;
    return services.filter((s) => `${s.title} ${s.items.join(" ")}`.toLowerCase().includes(term));
  }, [query]);

  const openRequest = (title = "") => { setSelected(title); setRequest(true); setNome(""); setContacto(""); setMensagem(""); };

  const sendToWhatsApp = () => {
    const text = `Olá! Gostaria de pedir um serviço.\n\nServiço: ${selected || "Geral"}\nNome: ${nome}\nContacto: ${contacto}\nMensagem: ${mensagem}`;
    window.open(`https://wa.me/244922001778?text=${encodeURIComponent(text)}`, "_blank");
    setRequest(false);
  };

  return (
    <div className="mimo-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap');
        .mimo-page { --ink:#203b43; --deep:#173a42; --cream:#f8f1e7; --coral:#d96f5c; --saffron:#e5a546; --teal:#68aaa0; --plum:#8d6e78; background:var(--cream); color:var(--ink); font-family:'DM Sans',sans-serif; min-height:100vh; overflow-x:hidden; }
        .mimo-page * { box-sizing:border-box; } .mimo-page button { font:inherit; cursor:pointer; }
        .mimo-nav { display:flex; align-items:center; justify-content:space-between; max-width:1240px; margin:auto; padding:24px 30px; position:relative; z-index:2; }
        .mimo-logo { display:flex; align-items:center; gap:9px; color:var(--deep); font-size:23px; font-weight:700; letter-spacing:-1px; }
        .mimo-logo-mark { background:var(--coral); color:var(--cream); width:31px; height:31px; border-radius:10px 10px 10px 3px; display:grid; place-items:center; transform:rotate(-8deg); }
        .mimo-nav-links { display:flex; gap:32px; align-items:center; font-size:13px; color:#527078; } .mimo-nav-links button,.mimo-nav-links a { background:none;border:0;color:inherit;text-decoration:none; }
        .mimo-nav-cta { border:1px solid #b9a99b; border-radius:99px; padding:11px 18px; color:var(--deep)!important; font-weight:600; }
        .mimo-menu { display:none;background:none;border:0;color:var(--deep); }
        .mimo-hero { max-width:1240px; margin:auto; padding:44px 30px 92px; display:grid; grid-template-columns:1.05fr .95fr; gap:70px; align-items:center; }
        .mimo-kicker { display:flex; align-items:center; gap:10px; text-transform:uppercase; letter-spacing:2.1px; color:var(--coral); font-size:11px; font-weight:700; margin-bottom:24px; } .mimo-kicker span { width:35px;height:1px;background:var(--coral); }
        .mimo-hero h1 { font-family:'Fraunces',serif; font-weight:500; font-size:clamp(48px,6vw,82px); letter-spacing:-3px; line-height:.99; color:var(--deep); margin:0 0 24px; max-width:620px; }
        .mimo-hero h1 em { color:var(--coral); font-style:normal; } .mimo-hero-copy { color:#587077; font-size:17px; line-height:1.65; max-width:500px; margin-bottom:30px; }
        .mimo-search { max-width:520px; display:flex; background:#fffaf4; border:1px solid #ded2c3; border-radius:16px; padding:7px 8px 7px 17px; box-shadow:0 10px 30px #967e6220; }
        .mimo-search svg { margin-top:9px;color:#a89480; } .mimo-search input { flex:1; border:0; outline:0;background:transparent;padding:9px 12px;font-size:14px;color:var(--ink); }
        .mimo-search button { border:0;background:var(--deep); color:#f8f1e7;border-radius:11px;padding:0 18px;font-weight:600; }
        .mimo-hero-art { position:relative; min-height:455px; } .mimo-photo { position:absolute; inset:0 45px 25px 0; border-radius:120px 22px 22px 22px; background:url('https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=900&fit=crop') center/cover; box-shadow:22px 24px 0 #e5a546; }
        .mimo-note { position:absolute; bottom:0; right:0; background:#fffaf4; padding:17px 19px; border-radius:15px; width:205px; box-shadow:0 12px 35px #36515a25; font-size:13px; line-height:1.45; } .mimo-note strong{display:block;color:var(--deep);font-size:16px;margin-bottom:4px;} .mimo-note small{color:#6d8180;}
        .mimo-float { position:absolute; top:34px; right:0; width:104px;height:104px;border-radius:50%;background:var(--coral);color:#fff2e7;display:grid;place-items:center;text-align:center;font-size:11px;line-height:1.25;transform:rotate(8deg); }
        .mimo-section { background:#fffaf4; padding:80px 30px 96px; } .mimo-inner { max-width:1240px;margin:auto; }
        .mimo-section-head { display:flex; justify-content:space-between; align-items:end; margin-bottom:36px; } .mimo-section h2 { font-family:'Fraunces',serif;font-weight:500;color:var(--deep);font-size:42px;letter-spacing:-1.4px;line-height:1.05;margin:0;max-width:520px; } .mimo-section-head p{color:#698080;max-width:290px;line-height:1.5;font-size:14px;}
        .mimo-grid { display:grid;grid-template-columns:repeat(12,1fr);gap:14px; } .mimo-service { padding:25px 24px 23px; border-radius:18px; min-height:304px; grid-column:span 4; transition:transform .25s,box-shadow .25s; } .mimo-service:hover{transform:translateY(-5px);box-shadow:0 16px 30px #49605718;} .mimo-service:nth-child(3){grid-column:span 4;} .mimo-service:nth-child(4),.mimo-service:nth-child(5){grid-column:span 6;min-height:275px;}
        .mimo-coral{background:#f2c6b6}.mimo-saffron{background:#f3d99e}.mimo-teal{background:#c0ded5}.mimo-plum{background:#d9c7c2}.mimo-navy{background:#d2dfe0}
        .mimo-card-top{display:flex;justify-content:space-between;margin-bottom:27px}.mimo-icon{width:42px;height:42px;border-radius:13px;background:#fffaf466;display:grid;place-items:center;color:var(--deep)} .mimo-save{background:none;border:0;color:#527078;padding:5px}.mimo-save.saved{color:var(--coral)}
        .mimo-service h3{font-size:20px;line-height:1.16;letter-spacing:-.5px;margin:0 0 8px;max-width:280px;color:var(--deep)} .mimo-service p{font-size:13px;color:#547077;margin:0 0 17px}.mimo-service ul{list-style:none;padding:0;margin:0;display:flex;gap:8px;flex-wrap:wrap}.mimo-service li{font-size:11px;color:#48636a;background:#fffaf45e;padding:6px 8px;border-radius:99px;display:flex;align-items:center;gap:4px}.mimo-card-link{display:flex;align-items:center;gap:7px;background:none;border:0;padding:18px 0 0;color:var(--deep);font-weight:700;font-size:12px}
        .mimo-trust { background:var(--deep); color:#f7ecdd; padding:68px 30px; } .mimo-trust-inner{max-width:1240px;margin:auto;display:grid;grid-template-columns:1.1fr 1fr;gap:80px;align-items:center}.mimo-trust h2{font:500 43px/1.08 'Fraunces',serif;letter-spacing:-1px;margin:0 0 17px}.mimo-trust p{color:#b4c8c5;line-height:1.6;max-width:440px;font-size:14px}.mimo-points{display:grid;grid-template-columns:1fr 1fr;gap:23px}.mimo-point{border-top:1px solid #63807866;padding-top:15px}.mimo-point svg{color:#e5a546;margin-bottom:10px}.mimo-point strong{display:block;font-size:14px;margin-bottom:5px}.mimo-point span{font-size:12px;color:#aec2bf;line-height:1.4;display:block}
        .mimo-bottom { padding:86px 30px 50px; text-align:center; background:#f5e4cf; position:relative; }.mimo-bottom h2{font:500 50px/1 'Fraunces',serif;color:var(--deep);margin:0 auto 15px;letter-spacing:-1.8px}.mimo-bottom p{color:#617778;margin-bottom:26px}.mimo-primary{border:0;background:var(--coral);color:#fff9ed;padding:15px 24px;border-radius:99px;font-weight:700;display:inline-flex;gap:10px;align-items:center;box-shadow:0 8px 18px #d96f5c35}.mimo-footer{max-width:1240px;margin:65px auto 0;display:flex;justify-content:space-between;color:#78908c;font-size:12px}.mimo-footer a{color:inherit;margin-left:21px;text-decoration:none}
        .mimo-modal-wrap{position:fixed;inset:0;background:#173a426e;z-index:10;display:grid;place-items:center;padding:20px}.mimo-modal{background:#fffaf4;border-radius:22px;padding:30px;max-width:450px;width:100%;box-shadow:0 25px 80px #173a4260;position:relative}.mimo-modal h3{font:500 32px 'Fraunces',serif;color:var(--deep);margin:0 0 8px}.mimo-modal p{font-size:13px;color:#6b7d7d;line-height:1.5}.mimo-close{position:absolute;right:18px;top:18px;border:0;background:none;color:#6b7d7d}.mimo-modal input,.mimo-modal textarea{width:100%;border:1px solid #ded2c3;border-radius:10px;background:#fff;padding:12px;margin-top:10px;font:inherit;font-size:13px;outline-color:var(--coral)}.mimo-modal textarea{height:90px;resize:vertical}.mimo-modal .mimo-primary{margin-top:14px;width:100%;justify-content:center}
        @media(max-width:800px){.mimo-nav{padding:18px 20px}.mimo-nav-links{display:none}.mimo-menu{display:block}.mimo-nav-links.open{display:flex;position:absolute;top:68px;left:20px;right:20px;background:#fffaf4;padding:18px;border-radius:14px;box-shadow:0 10px 30px #173a4220;flex-direction:column;align-items:flex-start}.mimo-nav-cta{display:none}.mimo-hero{grid-template-columns:1fr;padding:40px 20px 70px;gap:48px}.mimo-hero h1{font-size:55px}.mimo-hero-art{min-height:360px}.mimo-photo{inset:0 25px 18px 0}.mimo-section{padding:62px 20px}.mimo-section-head{display:block}.mimo-section-head p{margin-top:14px}.mimo-section h2{font-size:36px}.mimo-grid{display:block}.mimo-service{margin-bottom:14px;min-height:0!important}.mimo-trust{padding:58px 20px}.mimo-trust-inner{display:block}.mimo-trust h2{font-size:36px}.mimo-points{margin-top:37px}.mimo-bottom{padding:68px 20px 35px}.mimo-bottom h2{font-size:42px}.mimo-footer{display:block;line-height:2.4}.mimo-footer a{margin:0 14px 0 0}}
      `}</style>
      <nav className="mimo-nav" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(248,241,231,0.9)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
        <div className="mimo-logo"><img src="/logo-eliora-dark.svg" alt="Eliora" className="w-8 h-8" style={{ filter: "brightness(0) saturate(100%) invert(42%) sepia(32%) saturate(1200%) hue-rotate(325deg) brightness(90%) contrast(90%)" }} />Eliora Love Services</div>
        <div className={`mimo-nav-links ${menu ? "open" : ""}`}>
          <a href="#servicos">Explorar serviços</a><a href="#como-funciona">Como funciona</a><a href="#confianca">Confiança</a><button className="mimo-nav-cta" onClick={() => openRequest()}>Pedir um serviço <ArrowRight size={14} /></button>
          {onBackToSelector && <button onClick={onBackToSelector} className="mimo-nav-cta">Trocar loja</button>}
        </div>
        <button className="mimo-menu" onClick={() => setMenu(!menu)} aria-label="Abrir menu">{menu ? <X /> : <Menu />}</button>
      </nav>
      <main>
        <section className="mimo-hero">
          <div>
            <div className="mimo-kicker"><span /> cuidado que chega até si</div>
            <h1>Estar presente<br />é um <em>gesto.</em></h1>
            <p className="mimo-hero-copy">Na Eliora Love Services, encontramos pessoas de confiança para transformar a sua intenção em cuidado — mesmo à distância.</p>
            <div className="mimo-search"><Search size={18} /><input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="O que precisa hoje?" /><button onClick={() => document.getElementById("servicos")?.scrollIntoView({ behavior: "smooth" })}>Encontrar</button></div>
          </div>
          <div className="mimo-hero-art"><div className="mimo-photo" /><div className="mimo-float">feito com<br /><strong>intenção</strong></div><div className="mimo-note"><strong>Um gesto a caminho</strong><small>Entrega especial em Talatona<br />Chega hoje, até às 18h</small></div></div>
        </section>
        <section className="mimo-section" id="servicos">
          <div className="mimo-inner"><div className="mimo-section-head"><div><div className="mimo-kicker"><span /> escolha como quer cuidar</div><h2>Pequenos gestos.<br />Grande diferença.</h2></div><p>De Luanda para onde o seu carinho for preciso. Explore por intenção ou encontre o profissional certo.</p></div>
            {visibleServices.length ? <div className="mimo-grid">{visibleServices.map((service) => <ServiceCard key={service.title} service={service} onRequest={openRequest} />)}</div> : <div style={{padding:"45px 0",color:"#698080"}}>Não encontrámos esse serviço. Tente outra palavra ou fale connosco.</div>}
          </div>
        </section>
         <section className="mimo-trust" id="confianca"><div className="mimo-trust-inner"><div><div className="mimo-kicker" style={{color:"#e5a546"}}><span style={{background:"#e5a546"}} /> cuidado com responsabilidade</div><h2>Confiança não se promete.<br />Constrói-se.</h2><p>Cada pessoa e cada negócio na Eliora Love Services passa por um processo de verificação. Porque quando cuidamos de quem ama, todos os detalhes contam.</p></div><div className="mimo-points"><div className="mimo-point"><ShieldCheck size={21}/><strong>Profissionais verificados</strong><span>Identidade, referências e experiência confirmadas.</span></div><div className="mimo-point"><Star size={21}/><strong>Avaliações reais</strong><span>Escolha com a tranquilidade de quem já experimentou.</span></div><div className="mimo-point"><MapPin size={21}/><strong>Feito em Angola</strong><span>Conhecemos os bairros, os ritmos e o que importa.</span></div><div className="mimo-point"><MessageCircle size={21}/><strong>Apoio próximo</strong><span>Estamos aqui antes, durante e depois do seu pedido.</span></div></div></div></section>
         <section className="mimo-bottom" id="como-funciona"><h2>Tem uma ideia em mente?</h2><p>Conte-nos o que precisa. Nós tratamos do resto.</p><button className="mimo-primary" onClick={() => openRequest()}>Fazer um pedido <ArrowRight size={17}/></button><footer className="mimo-footer"><span>© 2024 Eliora Love Services · Cuidar é estar perto.</span><span><a href="#servicos">Serviços</a><a href="#confianca">Segurança</a><a href="#como-funciona">Ajuda</a></span></footer></section>
      </main>
      {request && <div className="mimo-modal-wrap" onClick={(e) => e.target === e.currentTarget && setRequest(false)}><div className="mimo-modal"><button className="mimo-close" onClick={() => setRequest(false)} aria-label="Fechar"><X /></button><h3>Vamos criar um gesto especial.</h3><p>{selected || "Conte-nos o que gostaria de tornar possível."}</p><input placeholder="O seu nome" value={nome} onChange={(e) => setNome(e.target.value)} /><input placeholder="Como podemos contactá-lo?" value={contacto} onChange={(e) => setContacto(e.target.value)} /><textarea placeholder="Descreva o que precisa, para quem é e quando..." value={mensagem} onChange={(e) => setMensagem(e.target.value)} /><button className="mimo-primary" onClick={sendToWhatsApp}>Enviar via WhatsApp <ArrowRight size={16}/></button></div></div>}
    </div>
  );
}
