import { Link } from "wouter";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function Privacidade() {
  return (
    <main className="min-h-[100dvh] bg-[#FBF7F2] text-[#292727]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mx-auto max-w-[860px] px-6 py-10 md:px-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#697482] hover:text-[#171717] transition-colors mb-8">
          <ArrowLeft size={16} /> Voltar
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <span className="w-11 h-11 rounded-2xl bg-[#171717] text-white grid place-items-center">
            <ShieldCheck size={20} />
          </span>
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl tracking-[-0.02em]">Privacidade</h1>
        </div>
        <p className="text-xs text-[#697482] mb-10">Última actualização: Outubro de 2026 · YESOLA Collection (yesola.ao)</p>

        <div className="space-y-8 text-sm leading-7 text-[#292727]/80">
          <section>
            <h2 className="text-lg font-semibold text-[#292727] mb-2">1. Quem somos</h2>
            <p>
              A YESOLA Collection (yesola.ao) é uma montra digital de lojas e serviços em Angola.
              Esta política explica que dados recolhemos e como os usamos na app e no site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#292727] mb-2">2. Dados que recolhemos</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Conta de loja:</strong> nome, telefone, palavra-passe (guardada de forma irreversível), província e município.</li>
              <li><strong>Dados da loja:</strong> nome, descrição, contactos, localização, horário, logótipo, fotos de capa e galeria.</li>
              <li><strong>Produtos e serviços:</strong> nome, preço, descrições e fotografias que publica.</li>
              <li><strong>Uso:</strong> páginas visitadas e cliques em contactos (ex.: WhatsApp), para melhorar o serviço.</li>
            </ul>
            <p className="mt-2">Não recolhemos dados de pagamento: os pagamentos são concluídos fora da app.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#292727] mb-2">3. Como usamos os dados</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Criar e gerir a sua conta de loja e manter a sessão iniciada neste dispositivo.</li>
              <li>Publicar a sua montra (loja, produtos e contactos) para os visitantes.</li>
              <li>Responder a pedidos de suporte e garantir a segurança da plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#292727] mb-2">4. Partilha de dados</h2>
            <p>
              Os dados públicos da sua montra (nome da loja, contactos publicados, produtos e fotos)
              são visíveis a qualquer visitante — é a finalidade da plataforma. Não vendemos os seus
              dados. Usamos infra-estrutura de terceiros apenas para operar o serviço
              (alojamento, base de dados e envio de imagens).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#292727] mb-2">5. Os seus direitos</h2>
            <p>
              Pode a qualquer momento editar os dados da sua loja no painel, e pode pedir a
              correcção ou eliminação da sua conta e dos seus dados através do suporte YESOLA
              (fale connosco pelo WhatsApp publicado no site).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#292727] mb-2">6. Crianças</h2>
            <p>A plataforma destina-se à actividade comercial de adultos. Contas de menores só com responsável legal.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#292727] mb-2">7. Contacto</h2>
            <p>Para questões sobre privacidade, use o suporte YESOLA indicado no site (yesola.ao).</p>
          </section>
        </div>
      </div>
    </main>
  );
}
