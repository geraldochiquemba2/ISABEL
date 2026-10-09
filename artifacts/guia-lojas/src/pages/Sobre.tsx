import { useState } from "react";
import { ArrowLeft, MapPin, Heart, Users, ShieldCheck, MessageCircle, LayoutGrid, Target, Eye, Gem } from "lucide-react";
import { goBackTo } from "@/lib/storeBack";

// Página "Sobre nós" — texto oficial da Isabel (doc: Yesola_Sobre_Nos_Com_Proposito).
// FOTOS: os blocos de fotografia são reservados (dourado/bege) até chegarem as
// fotografias reais e autorizadas — nunca usar fotos genéricas de pessoas.
// Galeria: fotografias reais de Angola (Wikimedia Commons, licença livre).
// Serão substituídas pelas fotografias oficiais e autorizadas quando chegarem.
const GALERIA = [
  { nome: "Kalandula", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Kalandula%20waterfalls%20of%20the%20Lucala-River%20in%20Malange%2C%20Angola.JPG?width=800" },
  { nome: "Tundavala", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Tundavala%20Gap.jpg?width=800" },
  { nome: "Namibe", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Mini%20oasis%20in%20the%20namibe%20desert%2C%20Angola.JPG?width=800" },
  { nome: "Morro do Moco", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Morro%20do%20Moco%2C%20Huambo%2C%20Angola.jpg?width=800" },
  { nome: "Pedras Negras", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Pungo%20Andongo%2C%20Malange%2C%20Angola.JPG?width=800" },
  { nome: "Serra da Leba", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Serra%20da%20Leba%20Road%2C%20Angola.jpg?width=800" },
];

const EQUIPA = [
  { nome: "Elisa Wandi", zona: "Ingombotas" },
  { nome: "Ana Dumbo", zona: "Benguela" },
  { nome: "Leonel António", zona: "Huambo" },
  { nome: "Gládia Goreth", zona: "Lubango" },
];

const DISTINGUE = [
  { icon: <MapPin size={18} />, titulo: "Alcance nacional", texto: "Uma plataforma pensada para todas as províncias de Angola." },
  { icon: <ShieldCheck size={18} />, titulo: "Credibilidade", texto: "Valorização de negócios responsáveis e comprometidos com a qualidade. A presença na plataforma não constitui garantia absoluta contra burlas." },
  { icon: <MessageCircle size={18} />, titulo: "Contacto directo", texto: "Comunicação entre consumidores e empresas, incluindo pelo WhatsApp." },
  { icon: <LayoutGrid size={18} />, titulo: "Diversidade", texto: "Diferentes áreas comerciais, produtos e serviços num só lugar." },
];

const MVV = [
  {
    id: "missao",
    nome: "Missão",
    icon: <Target size={14} />,
    texto: "Facilitar o acesso dos angolanos a empresas, produtos e serviços credíveis e de qualidade, promovendo ligações comerciais mais simples, acessíveis e transparentes.",
  },
  {
    id: "visao",
    nome: "Visão",
    icon: <Eye size={14} />,
    texto: "Consolidar a Yesola como uma referência nacional na descoberta de negócios, contribuindo para um mercado angolano mais conectado, organizado e confiável.",
  },
  {
    id: "valores",
    nome: "Valores",
    icon: <Gem size={14} />,
    texto: "Credibilidade, integridade, responsabilidade, qualidade, respeito pelo consumidor, inovação e valorização do empreendedorismo angolano.",
  },
];

function Titulo({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-['Playfair_Display'] text-[24px] leading-tight font-semibold text-[#111111]">
      {children}
    </h2>
  );
}

function FotoReservada({ legenda, alta }: { legenda: string; alta?: boolean }) {
  return (
    <div
      className={`rounded-2xl bg-gradient-to-br from-[#F5E7C6] via-[#EFDDB4] to-[#E3C98F] border border-[#E8CC91] flex flex-col items-center justify-center gap-1.5 text-center px-2 ${alta ? "min-h-[220px]" : "min-h-[120px]"}`}
    >
      <MapPin size={18} className="text-[#A96F12]" />
      <p className="text-[11px] font-semibold text-[#8a6410]">{legenda}</p>
      <p className="text-[9px] text-[#8a6410]/70">fotografia oficial em breve</p>
    </div>
  );
}

export default function Sobre() {
  const [aba, setAba] = useState("missao");
  const mvv = MVV.find((m) => m.id === aba)!;

  return (
    <main className="min-h-[100dvh] bg-[#FFFDF8] text-[#111111] pb-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mx-auto max-w-[860px] px-5 py-6 md:px-12">
        <button onClick={() => goBackTo("/")} className="inline-flex items-center gap-2 text-sm text-[#6F6F6F] hover:text-[#111111] transition-colors mb-5">
          <ArrowLeft size={16} /> Voltar
        </button>

        {/* Hero */}
        <section className="text-center py-4">
          <p className="text-[10px] tracking-[0.25em] text-[#A96F12] font-bold uppercase">Sobre nós</p>
          <h1 className="font-['Playfair_Display'] text-[32px] leading-[1.15] font-semibold mt-2">
            Angola inteira,<br />mais próxima de si.
          </h1>
          <p className="text-[13px] text-[#6F6F6F] mt-3 leading-relaxed max-w-[420px] mx-auto">
            Conectamos pessoas, empresas e oportunidades em todo o território nacional.
          </p>
        </section>

        {/* Galeria */}
        <section className="py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {GALERIA.map((g) => (
              <div key={g.nome} className="relative rounded-2xl overflow-hidden min-h-[120px] bg-[#F5E7C6]">
                <img src={g.img} alt={g.nome} className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
                <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-black/55 px-2 py-0.5 rounded-full">
                  {g.nome}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-[#9CA3AF] mt-2 text-center">Fotos reais de Angola (Wikimedia Commons, licença livre) — substituíveis pelas oficiais.</p>
        </section>

        {/* Quem somos */}
        <section className="py-4">
          <Titulo>Quem somos</Titulo>
          <p className="text-[13px] text-[#44403c] mt-2.5 leading-7">
            A Yesola é o marketplace angolano que aproxima os cidadãos de empresas, produtos e
            serviços credíveis e de qualidade, em todo o território nacional. Somos uma plataforma
            digital concebida para transformar a forma como os angolanos procuram, descobrem e
            entram em contacto com negócios. Reunimos diferentes áreas de actividade num único
            espaço, de forma prática, organizada e acessível.
          </p>
        </section>

        {/* História */}
        <section className="py-4">
          <Titulo>A história por detrás da Yesola</Titulo>
          <p className="text-[13px] text-[#44403c] mt-2.5 leading-7">
            A Yesola nasceu da convicção de que os angolanos merecem mais facilidade e segurança na
            procura de produtos e serviços. Num mercado em que encontrar empresas fiáveis pode
            exigir tempo, recomendações e, por vezes, envolver experiências desagradáveis, surgiu a
            necessidade de criar uma solução capaz de aproximar consumidores e negócios de maneira
            mais simples.
          </p>
          <p className="text-[13px] text-[#44403c] mt-2.5 leading-7">
            Foi a partir dessa visão que começou a ser construída a Yesola: uma plataforma pensada
            para dar visibilidade a empresas, facilitar o contacto directo e contribuir para reduzir
            os riscos de burlas.
          </p>
        </section>

        {/* Propósito */}
        <section className="py-4">
          <Titulo>Mais do que um marketplace, um propósito</Titulo>
          <p className="text-[13px] text-[#44403c] mt-2.5 leading-7">
            A Yesola existe para aproximar pessoas de oportunidades reais e ajudar a construir
            relações comerciais mais responsáveis. O nosso propósito é valorizar negócios que
            respeitam os consumidores, incentivar o bom atendimento e contribuir para que cada
            angolano encontre soluções com mais facilidade e confiança. Queremos que a tecnologia
            sirva as pessoas e que a proximidade entre empresas e clientes se traduza em benefícios
            para toda Angola.
          </p>
          <div className="mt-4 rounded-2xl bg-white border border-[#E8CC91] p-5 text-center">
            <p className="font-['Playfair_Display'] text-[17px] leading-relaxed italic text-[#7c5a10]">
              “Não queremos apenas ajudar as pessoas a encontrar o que procuram. Queremos que
              encontrem com mais confiança.”
            </p>
          </div>
        </section>

        {/* Liderança */}
        <section className="py-4">
          <Titulo>A liderança</Titulo>
          <div className="mt-3 rounded-2xl bg-white border border-[#E8CC91] overflow-hidden">
            <FotoReservada legenda="Isabel Taka · Fundadora" alta />
            <div className="p-5">
              <h3 className="text-[16px] font-bold">Isabel Taka <span className="text-[#A96F12] font-semibold">| Fundadora</span></h3>
              <p className="text-[13px] text-[#44403c] mt-2 leading-7">
                Influenciadora digital cristã e empresária angolana, Isabel Taka idealizou a Yesola
                com o propósito de aproximar os angolanos de empresas, produtos e serviços credíveis
                e de qualidade. Movida pelo desejo de contribuir para um mercado mais organizado,
                acessível e confiável, criou a Yesola com a visão de valorizar os negócios nacionais
                e promover relações comerciais mais transparentes.
              </p>
            </div>
          </div>
        </section>

        {/* Equipa */}
        <section className="py-4">
          <Titulo>Uma equipa que aproxima Angola</Titulo>
          <p className="text-[13px] text-[#44403c] mt-2.5 leading-7">
            A presença da Yesola é construída com o apoio de representantes que actuam em diferentes
            municípios e províncias, estabelecendo contacto com empresas, acompanhando informações
            comerciais e contribuindo para a organização das lojas na plataforma.
          </p>
          <div className="grid grid-cols-2 gap-2.5 mt-3">
            {EQUIPA.map((m) => (
              <div key={m.nome} className="rounded-2xl bg-white border border-[#E8CC91] p-3 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#FFF4DC] border border-[#E8CC91] flex items-center justify-center">
                  <Users size={20} className="text-[#A96F12]" />
                </div>
                <p className="text-[13px] font-bold mt-2">{m.nome}</p>
                <p className="text-[11px] text-[#A96F12] font-semibold">{m.zona}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-[#9CA3AF] mt-2 text-center">Nomes e composição da equipa sujeitos a confirmação antes da publicação.</p>
        </section>

        {/* Propósito social */}
        <section className="py-4">
          <div className="rounded-2xl bg-[#111111] text-white p-6 text-center">
            <Heart size={22} className="mx-auto text-[#E8CC91]" />
            <h2 className="font-['Playfair_Display'] text-[22px] font-semibold mt-2">Yesola com Propósito</h2>
            <p className="text-[12px] text-white/70 mt-1">O coração social da Yesola</p>
            <p className="text-[13px] text-white/85 mt-3 leading-7">
              Acreditamos que o crescimento de uma empresa deve também gerar oportunidades para quem
              mais precisa. Por isso, a Yesola com Propósito é a nossa área de responsabilidade
              social: uma iniciativa que transforma a actividade comercial em apoio concreto às
              igrejas e às comunidades.
            </p>
            <div className="mt-4 rounded-xl bg-white/10 border border-white/15 py-4 px-3">
              <p className="font-['Playfair_Display'] text-[26px] font-semibold text-[#E8CC91]">10%</p>
              <p className="text-[11px] text-white/80 leading-6 mt-1">
                DOS PAGAMENTOS DOS VENDEDORES<br />destinados a iniciativas de apoio às igrejas e às comunidades
              </p>
            </div>
            <p className="text-[13px] text-white/85 mt-4 leading-7">
              Ao escolher a Yesola, não está apenas a apoiar negócios angolanos. Está também a fazer
              parte de um propósito maior: ajudar a transformar vidas e fortalecer comunidades.
            </p>
          </div>
        </section>

        {/* Distingue */}
        <section className="py-4">
          <Titulo>O que nos distingue</Titulo>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
            {DISTINGUE.map((d) => (
              <div key={d.titulo} className="rounded-2xl bg-white border border-[#E8CC91] p-4 flex gap-3">
                <div className="w-10 h-10 shrink-0 rounded-full bg-[#FFF4DC] flex items-center justify-center text-[#A96F12]">
                  {d.icon}
                </div>
                <div>
                  <p className="text-[13px] font-bold">{d.titulo}</p>
                  <p className="text-[12px] text-[#6F6F6F] mt-1 leading-6">{d.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Missão / Visão / Valores */}
        <section className="py-4">
          <Titulo>Missão, visão e valores</Titulo>
          <div className="flex gap-2 mt-3">
            {MVV.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setAba(m.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full text-xs font-bold transition-colors ${
                  aba === m.id ? "bg-[#111111] text-white" : "bg-white border border-[#E8CC91] text-[#6F6F6F]"
                }`}
              >
                {m.icon} {m.nome}
              </button>
            ))}
          </div>
          <div className="mt-2.5 rounded-2xl bg-white border border-[#E8CC91] p-5">
            <p className="text-[13px] text-[#44403c] leading-7">{mvv.texto}</p>
          </div>
        </section>

        {/* Compromisso */}
        <section className="py-4">
          <Titulo>O nosso compromisso</Titulo>
          <p className="text-[13px] text-[#44403c] mt-2.5 leading-7">
            Trabalhamos para dar destaque a empresas que valorizam a qualidade, a responsabilidade e
            o bom atendimento. Procuramos incentivar relações comerciais mais transparentes e
            promover uma cultura de respeito pelos consumidores.
          </p>
          <div className="mt-4 text-center py-2">
            <p className="font-['Playfair_Display'] text-[22px] font-semibold">YESOLA</p>
            <p className="text-[12px] text-[#A96F12] font-semibold mt-1">Tudo o que procuras, encontras aqui.</p>
            <p className="text-[11px] text-[#6F6F6F] mt-2">Uma plataforma. Diferentes províncias. Milhares de oportunidades por descobrir.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
