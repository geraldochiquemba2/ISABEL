import { ArrowLeft, FileText } from "lucide-react";
import { goBackTo } from "@/lib/storeBack";

// Termos de Uso da YESOLA (yesola.ao). Aceites expressos na criação de conta,
// em conjunto com a Política de Privacidade (Lei n.º 22/11, art. 12).
export default function Termos() {
  return (
    <main className="min-h-[100dvh] bg-[#FFFDF8] text-[#111111]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mx-auto max-w-[860px] px-6 py-10 md:px-12">
        <button onClick={() => goBackTo("/")} className="inline-flex items-center gap-2 text-sm text-[#6F6F6F] hover:text-[#111111] transition-colors mb-8">
          <ArrowLeft size={16} /> Voltar
        </button>
        <div className="flex items-center gap-3 mb-2">
          <span className="w-11 h-11 rounded-2xl bg-[#A96F12] text-white grid place-items-center">
            <FileText size={20} />
          </span>
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl tracking-[-0.02em]">Termos de Uso</h1>
        </div>
        <p className="text-xs text-[#6F6F6F] mb-10">Última actualização: Outubro de 2026 · YESOLA (yesola.ao)</p>

        <div className="space-y-8 text-sm leading-7 text-[#111111]/80">
          <section>
            <h2 className="text-lg font-semibold text-[#111111] mb-2">1. O que é a YESOLA</h2>
            <p>
              A YESOLA (yesola.ao) é uma montra digital de lojas, serviços e profissionais
              em Angola. Qualquer pessoa pode ver as montras; só lojistas com conta aprovada
              publicam conteúdos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111111] mb-2">2. Conta de lojista</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>A conta é pessoal e intransmissível; cada número de telefone vale uma conta por plataforma.</li>
              <li>Contas novas ficam <strong>pendentes</strong> até aprovação pela equipa YESOLA.</li>
              <li>Deve ter pelo menos 18 anos; menores só com representante legal.</li>
              <li>É responsável por manter a sua palavra-passe em segredo.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111111] mb-2">3. Conteúdos da montra</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>É responsável por tudo o que publica: nome, descrição, preços, fotos, contactos e horário.</li>
              <li>É proibido publicar conteúdos falsos, burlas, produtos ilícitos ou conteúdos que violem a lei angolana.</li>
              <li>A YESOLA pode remover conteúdos e suspender contas que violem estes termos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111111] mb-2">4. Dados pessoais</h2>
            <p>
              Ao criar a conta, aceita expressamente o tratamento dos seus dados nos termos da{" "}
              <a href="/privacidade" className="underline underline-offset-2 text-[#A96F12]">Política de Privacidade</a>,
              em conformidade com a Lei n.º 22/11, de 17 de Junho (Protecção de Dados Pessoais).
              Os dados públicos da sua montra ficam visíveis a qualquer visitante — é a finalidade da plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111111] mb-2">5. Disponibilidade e suporte</h2>
            <p>
              Fazemos o possível para manter o serviço sempre disponível, mas não garantimos
              ausência de falhas. Para dúvidas e apoio, use a página{" "}
              <a href="/contacto" className="underline underline-offset-2 text-[#A96F12]">Fale connosco</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111111] mb-2">6. Lei aplicável</h2>
            <p>
              Estes termos regem-se pela lei angolana. Alterações serão publicadas nesta página
              com a data de actualização.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
