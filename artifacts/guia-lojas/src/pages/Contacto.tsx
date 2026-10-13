import { ArrowLeft, Headset, Building2, Megaphone, Users, Phone, Clock, Sparkle } from "lucide-react";
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
  {
    id: "representantes",
    icon: Users,
    titulo: "Reclamações sobre representantes",
    texto: "Para comunicar uma situação relacionada com o atendimento ou a atuação de um representante da Yesola.",
    telefone: "+244 924 861 609",
    wa: "244924861609",
    mensagem: "Olá YESOLA, quero comunicar uma situação sobre um representante.",
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
  useThemeColor("#FFFDF8");
  return (
    <main className="min-h-[100dvh] bg-white text-[#111111]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mx-auto max-w-[860px] px-5 py-8 md:px-12 md:py-10">
        <button onClick={() => goBackTo("/")} className="inline-flex items-center gap-2 text-sm text-[#6F6F6F] hover:text-[#111111] transition-colors mb-6 sticky top-[max(12px,env(safe-area-inset-top))] z-30 bg-white/90 backdrop-blur-md border border-black/10 shadow-sm rounded-full px-3 py-1.5">
          <ArrowLeft size={16} /> Voltar
        </button>

        {/* Cabeçalho — logo oficial igual à página de escolher área */}
        <header className="text-center">
          <img
            src="/logo-yesola-star-gold.png"
            alt="YESOLA"
            className="h-16 sm:h-20 w-auto object-contain mx-auto drop-shadow-[0_2px_8px_rgba(201,148,50,0.2)]"
            loading="lazy"
            decoding="async"
          />
          <h1 className="font-['Playfair_Display'] text-[44px] md:text-[56px] leading-tight font-bold mt-4 tracking-[-0.02em]">
            Fale connosco
          </h1>
          <p className="text-[17px] md:text-[19px] text-[#6F6F6F] mt-1">Estamos aqui para ajudar.</p>
        </header>

        {/* Cartões */}
        <div className="mt-8 flex flex-col gap-4">
          {CONTACTOS.map((c) => {
            const Icon = c.icon;
            const waLink = `https://wa.me/${c.wa}?text=${encodeURIComponent(c.mensagem)}`;
            return (
              <section
                key={c.id}
                className="bg-white border border-[#C9A227]/70 rounded-2xl p-5 md:p-6 flex gap-4"
              >
                <div className="shrink-0 pt-1 text-[#A96F12]">
                  <Icon size={52} strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-[19px] md:text-[21px] font-bold leading-snug">{c.titulo}</h2>
                  <p className="text-[14px] md:text-[15px] text-[#6F6F6F] mt-1.5 leading-6">{c.texto}</p>
                  <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
                    <a
                      href={`tel:${c.wa}`}
                      className="inline-flex items-center gap-2 text-[17px] font-bold tracking-tight"
                    >
                      <Phone size={17} className="text-[#A96F12]" />
                      {c.telefone}
                    </a>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex items-center justify-center gap-2 bg-[#1FA855] text-white text-[14px] font-semibold px-5 py-2.5 rounded-xl hover:brightness-95 transition-all shrink-0"
                    >
                      <WhatsAppIcon size={22} /> Falar no WhatsApp
                    </a>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* Rodapé — igual ao criativo */}
        <footer className="mt-8 text-center pb-6">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[#C9A227]/70" />
            <Sparkle size={16} className="text-[#A96F12]" />
            <div className="h-px flex-1 bg-[#C9A227]/70" />
          </div>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-[13px] text-[#6F6F6F]">
            <Clock size={13} /> Respondemos em horário comercial.
          </p>
          <p className="mt-1 font-['Playfair_Display'] text-[17px] md:text-[19px] font-semibold text-[#A96F12]">
            Yesola, tudo o que procuras, encontras aqui.
          </p>
        </footer>
      </div>
    </main>
  );
}
