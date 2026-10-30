import { ArrowLeft, FileText } from "lucide-react";
import { goBackTo } from "@/lib/storeBack";
import { useThemeColor } from "@/lib/useThemeColor";
import { TERMS_META, TERMS_SECTIONS } from "@/data/termsContent";

export default function Termos() {
  useThemeColor("#FFFDF8");
  return (
    <main className="min-h-[100dvh] bg-[#FFFDF8] text-[#111111]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mx-auto max-w-[860px] px-6 py-10 md:px-12">
        <button
          onClick={() => goBackTo("/")}
          className="inline-flex items-center gap-2 text-sm text-[#6F6F6F] hover:text-[#111111] transition-colors mb-8 sticky top-[max(12px,env(safe-area-inset-top))] z-30 bg-white/90 backdrop-blur-md border border-black/10 shadow-sm rounded-full px-3 py-1.5"
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        <div className="flex items-center gap-3 mb-2">
          <span className="w-11 h-11 rounded-2xl bg-[#A96F12] text-white grid place-items-center">
            <FileText size={20} />
          </span>
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl tracking-[-0.02em]">Termos e Condições</h1>
        </div>
        <p className="text-xs text-[#6F6F6F] mb-6">
          Versão {TERMS_META.version} · YESOLA (yesola.ao) · {TERMS_META.entity}
        </p>

        <div className="mb-10 rounded-2xl border border-[#E9D9B6] bg-[#FBF7EC] p-5 text-sm leading-7 text-[#111111]/80">
          <p className="font-semibold text-[#111111]">{TERMS_META.entity}</p>
          <p>NIF {TERMS_META.nif} · Matrícula {TERMS_META.registration}</p>
          <p>{TERMS_META.address}</p>
          <p className="mt-2">
            Atendimento geral: {TERMS_META.generalPhone} · Empresas e serviços comerciais: {TERMS_META.businessPhone}
          </p>
          <p>
            Website:{" "}
            <a href={TERMS_META.website} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-[#A96F12]">
              {TERMS_META.website}
            </a>
          </p>
        </div>

        <div className="space-y-8 text-sm leading-7 text-[#111111]/80">
          {TERMS_SECTIONS.map((section) => (
            <section key={section.title} id={section.title.split(".")[0]}>
              <h2 className="text-lg font-semibold text-[#111111] mb-2">{section.title}</h2>
              {section.paragraphs?.map((paragraph, i) => (
                <p key={`p-${i}`} className={i > 0 ? "mt-2" : undefined}>
                  {paragraph}
                </p>
              ))}
              {section.bullets && (
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {section.after?.map((paragraph, i) => (
                <p key={`a-${i}`} className="mt-2">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-[#E9D9B6] bg-[#FBF7EC] p-5 text-sm leading-7 text-[#111111]/80">
          <p>
            Consulte também a{" "}
            <a href="/privacidade" className="underline underline-offset-2 text-[#A96F12]">
              Política de Privacidade
            </a>
            . Para denúncias, reclamações ou pedidos sobre estes Termos, utilize a página{" "}
            <a href="/contacto" className="underline underline-offset-2 text-[#A96F12]">
              Fale connosco
            </a>{" "}
            ou o atendimento geral.
          </p>
        </div>
      </div>
    </main>
  );
}
