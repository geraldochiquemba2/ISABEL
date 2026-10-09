import { Link } from "wouter";
import { ArrowLeft, MessageCircle, Clock } from "lucide-react";

// Número oficial de atendimento (WhatsApp, formato internacional sem +).
const CONTACT_WHATSAPP = "244922001778";

export default function Contacto() {
  const waLink = CONTACT_WHATSAPP
    ? `https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent("Olá YESOLA, preciso de ajuda.")}`
    : "";
  return (
    <main className="min-h-[100dvh] bg-[#FFFDF8] text-[#111111]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mx-auto max-w-[860px] px-6 py-10 md:px-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#6F6F6F] hover:text-[#111111] transition-colors mb-8">
          <ArrowLeft size={16} /> Voltar
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <span className="w-11 h-11 rounded-2xl bg-[#A96F12] text-white grid place-items-center">
            <MessageCircle size={20} />
          </span>
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl tracking-[-0.02em]">Fale connosco</h1>
        </div>
        <p className="text-xs text-[#6F6F6F] mb-10">Dúvidas? Estamos aqui para ajudar.</p>

        <div className="bg-white border border-[#E8CC91] rounded-2xl p-6">
          {waLink ? (
            <>
              <p className="text-sm leading-7 text-[#111111]/80">
                Fala directamente com a equipa YESOLA no WhatsApp — dúvidas sobre lojas,
                contas, produtos ou qualquer outra questão.
              </p>
              <a
                href={waLink}
                target="_blank"
                rel="noopener"
                className="mt-5 inline-flex items-center gap-2 bg-[#1FA855] text-white text-sm font-semibold px-6 py-3 rounded-full hover:brightness-95 transition-all"
              >
                <MessageCircle size={16} /> Conversar no WhatsApp
              </a>
              <p className="mt-4 flex items-center gap-1.5 text-[12px] text-[#6F6F6F]">
                <Clock size={13} /> Respondemos em horário comercial.
              </p>
            </>
          ) : (
            <p className="text-sm leading-7 text-[#111111]/80">
              O nosso atendimento WhatsApp fica disponível aqui em breve. Volta daqui a pouco.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
