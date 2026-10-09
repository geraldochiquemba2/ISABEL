import { ArrowLeft, ShieldCheck } from "lucide-react";
import { goBackTo } from "@/lib/storeBack";

// Política de Privacidade da YESOLA, em conformidade com a Lei n.º 22/11,
// de 17 de Junho (Protecção de Dados Pessoais, Angola) e os direitos
// reconhecidos pela Agência de Protecção de Dados (APD, apd.ao).
export default function Privacidade() {
  return (
    <main className="min-h-[100dvh] bg-[#FBF7F2] text-[#292727]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mx-auto max-w-[860px] px-6 py-10 md:px-12">
        <button onClick={() => goBackTo("/")} className="inline-flex items-center gap-2 text-sm text-[#697482] hover:text-[#171717] transition-colors mb-8">
          <ArrowLeft size={16} /> Voltar
        </button>
        <div className="flex items-center gap-3 mb-2">
          <span className="w-11 h-11 rounded-2xl bg-[#171717] text-white grid place-items-center">
            <ShieldCheck size={20} />
          </span>
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl tracking-[-0.02em]">Privacidade</h1>
        </div>
        <p className="text-xs text-[#697482] mb-10">Última actualização: Outubro de 2026 · YESOLA (yesola.ao) · Lei n.º 22/11, de 17 de Junho</p>

        <div className="space-y-8 text-sm leading-7 text-[#292727]/80">
          <section>
            <h2 className="text-lg font-semibold text-[#292727] mb-2">1. Quem trata os seus dados</h2>
            <p>
              O responsável pelo tratamento é a YESOLA (yesola.ao), montra digital de lojas e
              serviços em Angola. Ao criar uma conta, dá o seu <strong>consentimento livre,
              específico, explícito e informado</strong> para o tratamento aqui descrito,
              nos termos do artigo 12.º da Lei n.º 22/11.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#292727] mb-2">2. Que dados recolhemos e para quê</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Conta de loja (obrigatórios):</strong> nome, telefone, palavra-passe, província, município e endereço — para criar e gerir a conta.</li>
              <li><strong>Dados da montra:</strong> nome e descrição da loja, contactos publicados, localização, horário, logótipo e fotografias — para publicar a sua montra.</li>
              <li><strong>Produtos e serviços:</strong> nome, preço, descrições e fotografias que publica.</li>
              <li><strong>Registo do consentimento:</strong> data e hora em que aceitou esta política e os Termos de Uso.</li>
            </ul>
            <p className="mt-2">Não recolhemos dados de pagamento: os pagamentos são concluídos fora da plataforma.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#292727] mb-2">3. Dados públicos da montra</h2>
            <p>
              Os dados que publica na montra (nome da loja, contactos publicados, produtos e fotos)
              ficam visíveis a qualquer visitante — é a finalidade da plataforma. Ao publicar,
              consente essa divulgação. Não vendemos os seus dados. Usamos infra-estrutura de
              terceiros apenas para operar o serviço (alojamento, base de dados e envio de imagens).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#292727] mb-2">4. Os seus direitos</h2>
            <p>Nos termos da Lei n.º 22/11, tem direito a:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li><strong>Informação:</strong> saber quem trata os dados, para que finalidades e que dados são obrigatórios ou facultativos.</li>
              <li><strong>Acesso:</strong> confirmação de que dados seus estão a ser tratados e para que finalidades, sem custos excessivos.</li>
              <li><strong>Rectificação e actualização</strong> de dados incompletos ou inexactos (pode editar a loja no painel).</li>
              <li><strong>Oposição:</strong> opor-se ao tratamento por razões ponderosas e legítimas.</li>
              <li><strong>Apagamento/bloqueio:</strong> pedir a eliminação da conta e dos dados.</li>
            </ul>
            <p className="mt-2">
              Respondemos a pedidos de rectificação, actualização e eliminação num prazo máximo de
              sessenta dias úteis. Pode exercer os direitos no painel da loja ou pelo suporte
              indicado na página <a href="/contacto" className="underline underline-offset-2">Fale connosco</a>.
              Em caso de incumprimento, pode reclamar junto da Agência de Protecção de Dados (APD, apd.ao).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#292727] mb-2">5. Segurança</h2>
            <p>
              A palavra-passe é guardada de forma irreversível (nunca em texto legível) e o acesso
              é protegido por sessão individual. Aplicamos medidas técnicas adequadas contra acessos
              não autorizados, perda ou destruição.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#292727] mb-2">6. Menores</h2>
            <p>A plataforma destina-se à actividade comercial de adultos. Contas de menores só com representante legal.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#292727] mb-2">7. Alterações</h2>
            <p>
              Alterações a esta política serão publicadas aqui com a data de actualização. Para
              questões sobre privacidade, use o suporte YESOLA indicado no site (yesola.ao).
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
