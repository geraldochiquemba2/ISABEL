import { ArrowLeft, Headset, Building2, Megaphone, Users, Clock, Sparkle } from "lucide-react";
import { goBackTo } from "@/lib/storeBack";
import { useThemeColor } from "@/lib/useThemeColor";

const CONTACTOS = [
  {
    id: "apoio",
    icon: Headset,
    titulo: "Apoio, reclamações e denúncias",
    texto: "Tens dúvidas, foste mal atendido ou queres denunciar uma situação numa loja? Fala connosco.",
    telefone: "+244 921 515 062",
    wa: "244921515062",
    mensagem: "Olá YESOLA, preciso de apoio.",
  },
  {
    id: "adesao",
    icon: Building2,
    titulo: "Adesão de empresas",
    texto: "Tens um negócio, com loja física ou online? Contacta-nos para iniciar a avaliação para adesão à Yesola, independentemente da dimensão da tua empresa.",
    telefone: "+244 950 760 511",
    wa: "244950760511",
    mensagem: "Olá YESOLA, tenho um negócio e quero aderir.",
  },
  {
    id: "publicidade",
    icon: Megaphone,
    titulo: "Publicidade e Marketing",
    texto: "Divulga a tua empresa cadastrada na Yesola. Conhece os nossos serviços e as condições de publicidade e marketing.",
    telefone: "+244 922 001 778",
    wa: "244922001778",
    mensagem: "Olá YESOLA, quero divulgar a minha empresa.",
  },
  ];

function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.1-.7l.4-.5c.1-.2.1-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.2-.7.6-.2.5-.9 2.1-.9 4.4 0 1.4.5 2.7 1.4 3.8a7.6 7.6 0 0 0 5 3.3c1.4.5 2 .4 2.7.3.4 0 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.1-.5-.3Z" />
    </svg>
  );
}

export default function Contacto() {
  useThemeColor("#FFF9EC");
  return (
    <main className="min-h-[100dvh] text-[#111111] relative overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif", background: "linear-gradient(180deg, #FFFEF8 0%, #FFF8E3 30%, #FFF3D3 55%, #FFF9EC 100%)" }}>
      {/* Brilho dourado de fundo — aproxima o criativo */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#F5C542]/30 blur-3xl" />
        <div className="absolute -top-16 -right-20 h-72 w-72 rounded-full bg-[#C9A227]/25 blur-3xl" />
        <div className="absolute top-1/3 -left-28 h-96 w-96 rounded-full bg-[#FFE9A8]/40 blur-3xl" />
        <div className="absolute top-1/2 -right-28 h-96 w-96 rounded-full bg-[#F5C542]/25 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-[#C9A227]/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[860px] px-5 py-8 md:px-12 md:py-10">
        <button onClick={() => goBackTo("/")} className="inline-flex items-center gap-2 text-sm text-[#6F6F6F] hover:text-[#111111] transition-colors mb-6 sticky top-[max(12px,env(safe-area-inset-top))] z-30 bg-white/90 backdrop-blur-md border border-black/10 shadow-sm rounded-full px-3 py-1.5">
          <ArrowLeft size={16} /> Voltar
        </button>

        {/* Cabeçalho — logo oficial + título azul-marinho */}
        <header className="text-center">
          <img
            src="/logo-yesola-star-gold.png"
            alt="YESOLA"
            className="h-20 sm:h-24 w-auto object-contain mx-auto drop-shadow-[0_4px_16px_rgba(201,148,50,0.45)]"
            loading="lazy"
            decoding="async"
          />
          <h1 className="font-['Playfair_Display'] text-[44px] md:text-[56px] leading-tight font-bold mt-3 tracking-[-0.02em] text-[#10123A]">
            Fale connosco
          </h1>
          <p className="text-[17px] md:text-[19px] text-[#5B5E6B] mt-1">Estamos aqui para ajudar.</p>
          <div className="mt-3 flex items-center gap-3 max-w-[420px] mx-auto">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C9A227] to-[#C9A227]" />
            <Sparkle size={16} className="text-[#C9A227] shrink-0" />
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#C9A227] to-[#C9A227]" />
          </div>
        </header>

        {/* Cartões — creme com moldura dourada e brilho */}
        <div className="mt-6 flex flex-col gap-4">
          {CONTACTOS.map((c) => {
            const Icon = c.icon;
            const waLink = `https://wa.me/${c.wa}?text=${encodeURIComponent(c.mensagem)}`;
            return (
              <section
                key={c.id}
                className="rounded-3xl border-2 border-[#D9B545] bg-gradient-to-b from-[#FFFFFB] to-[#FFF6DC] shadow-[0_0_28px_rgba(217,181,69,0.45),inset_0_1px_0_rgba(255,255,255,0.9)] p-4 md:p-5 flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 md:w-[72px] md:h-[72px] shrink-0 rounded-full border-2 border-[#D9B545] bg-[#FFFEF5] grid place-items-center text-[#B8860B] shadow-[0_0_18px_rgba(217,181,69,0.55),inset_0_2px_6px_rgba(217,181,69,0.25)]">
                    <Icon size={32} strokeWidth={1.9} />
                  </div>
                </div>
                <div className="w-px self-stretch bg-[#D9B545]/60" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <h2 className="font-['Playfair_Display'] text-[19px] md:text-[22px] font-bold leading-snug text-[#10123A]">{c.titulo}</h2>
                  <p className="text-[13.5px] md:text-[14.5px] text-[#5B5E6B] mt-1.5 leading-6">{c.texto}</p>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener"
                    className="mt-2.5 inline-flex items-center gap-2 text-[17px] md:text-[18px] font-bold tracking-tight text-[#10123A] hover:text-[#1FA855] transition-colors"
                    aria-label={`${c.titulo} no WhatsApp: ${c.telefone}`}
                  >
                    <WhatsAppIcon size={24} /> {c.telefone}
                  </a>
                </div>
              </section>
            );
          })}
        </div>

        {/* Rodapé — horário + slogan */}
        <footer className="mt-8 text-center pb-6">
          <div className="flex items-center gap-3 max-w-[520px] mx-auto">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C9A227] to-[#C9A227]" />
            <Sparkle size={16} className="text-[#C9A227] shrink-0" />
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#C9A227] to-[#C9A227]" />
          </div>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-[13px] text-[#5B5E6B]">
            <Clock size={13} /> Segunda a sexta-feira, das 09h00 às 16h30.
          </p>
          <p className="mt-1 font-['Playfair_Display'] text-[17px] md:text-[19px] font-semibold text-[#A96F12]">
            Yesola, tudo o que procuras, encontras aqui.
          </p>
        </footer>
      </div>
    </main>
  );
}
