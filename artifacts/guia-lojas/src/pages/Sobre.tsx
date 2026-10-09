import { Link } from "wouter";
import { ArrowLeft, Store } from "lucide-react";

// Página "Sobre nós" (botão à esquerda da logo na página inicial).
// O texto final chega da Isabel — as secções abaixo são a estrutura;
// basta substituir os parágrafos quando os dizeres chegarem.
export default function Sobre() {
  return (
    <main className="min-h-[100dvh] bg-[#FFFDF8] text-[#111111]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mx-auto max-w-[860px] px-6 py-10 md:px-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#6F6F6F] hover:text-[#111111] transition-colors mb-8">
          <ArrowLeft size={16} /> Voltar
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <span className="w-11 h-11 rounded-2xl bg-[#A96F12] text-white grid place-items-center">
            <Store size={20} />
          </span>
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl tracking-[-0.02em]">Sobre nós</h1>
        </div>
        <p className="text-xs text-[#6F6F6F] mb-10">YESOLA · yesola.ao</p>

        <div className="space-y-8 text-sm leading-7 text-[#111111]/80">
          <section>
            <h2 className="text-lg font-semibold text-[#111111] mb-2">Quem somos</h2>
            <p>
              A YESOLA é uma montra digital feita em Angola, para Angola: junta lojas,
              serviços e profissionais de todas as províncias num só lugar — da moda e
              beleza à alimentação, saúde, tecnologia e muito mais.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111111] mb-2">O que fazemos</h2>
            <p>
              Damos a cada negócio — grande ou pequeno — uma montra própria com fotos,
              produtos, contactos e localização, para que qualquer pessoa encontre o que
              procura perto de si, na sua província e no seu município.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111111] mb-2">Porque existimos</h2>
            <p>
              Ao escolher a YESOLA, ajudas a transformar vidas e a fazer alguém feliz:
              cada visita apoia negócios locais e quem trabalha todos os dias para servir
              a sua comunidade.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
