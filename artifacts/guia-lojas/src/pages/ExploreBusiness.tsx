import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Compass, CircleDollarSign, Target, Scale, UsersRound, Landmark } from "lucide-react";
import { fetchStores } from "@/lib/api";

const BUSINESS_CATEGORIES = [
  { number: "01", title: "Consultoria, Estratégia e Gestão Empresarial", intro: "Decisões mais claras para negócios prontos para avançar.", category: "consultoria", icon: Compass, items: ["Consultoria de Negócios e Gestão Estratégica", "Elaboração de Planos de Negócio e Viabilidade Económica", "Mapeamento, Reestruturação e Otimização de Processos", "Mentoria para Empreendedores, Startups e Founders"] },
  { number: "02", title: "Gestão Financeira, Contabilidade e Fiscalidade", intro: "O rigor financeiro que transforma números em confiança.", category: "financas", icon: CircleDollarSign, items: ["Contabilidade Certificada, Auditoria e Declarações", "Consultoria Fiscal, Planeamento Tributário e Impostos", "Gestão do Fluxo de Caixa e Finanças Empresariais", "Avaliação de Empresas (Valuation) e Análise de Risco"] },
  { number: "03", title: "Marketing, Vendas e Posicionamento de Marca", intro: "Uma presença que diz o que vale, para quem importa.", category: "marketing", icon: Target, items: ["Gestão de Redes Sociais, Conteúdo e Tráfego Pago", "Criação de Identidade Visual, Branding e Design", "Estratégias de Vendas, Prospecção e Treino Comercial", "Assessoria de Imprensa, Relações Públicas e Comunicação"] },
  { number: "04", title: "Soluções Legais, Jurídicas e Propriedade Intelectual", intro: "Estruturas sólidas para crescer com segurança.", category: "juridico", icon: Scale, items: ["Apoio Jurídico para Abertura e Registo de Empresas", "Elaboração, Análise e Auditoria de Contratos", "Registo de Marcas, Patentes e Propriedade Intelectual", "Consultoria em Conformidade (Compliance) e Regulamentação"] },
  { number: "05", title: "Recursos Humanos, Talentos e Operações", intro: "Pessoas alinhadas e operações que sustentam o ritmo.", category: "rh", icon: UsersRound, items: ["Recrutamento, Seleção e Acolhimento de Talentos (Onboarding)", "Consultoria de RH, Avaliação e Gestão de Desempenho", "Serviços de Tradução Profissional e Interpretação", "Gestão de Operações e Cadeia de Mantimentos (Logística)"] },
  { number: "06", title: "Finanças Pessoais, Investimentos e Captação", intro: "Planeamento para proteger o que construiu e abrir possibilidades.", category: "investimento", icon: Landmark, items: ["Planeamento Financeiro Pessoal e Familiar", "Consultoria em Investimentos e Gestão de Património", "Preparação para Captação de Investimento, Crédito e Parcerias"] },
];

function StoreCard({ store }: { store: any }) {
  return (
    <div
      className="flex-shrink-0 w-48 rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow border border-[#e8eaed] cursor-pointer hover:-translate-y-1"
      onClick={() => window.location.href = `/loja/${store.id}?from=business`}
    >
      <div className="relative h-28 overflow-hidden bg-[#e9e2d6]">
        {store.logoUrl && (
          <img src={store.logoUrl} alt="" className="absolute top-2 left-2 w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm z-20" />
        )}
        {store.isOpen !== undefined && (
          <span className={`absolute top-2 right-2 text-[9px] font-semibold px-2 py-0.5 rounded-full z-20 ${store.isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
            {store.isOpen ? "Aberto" : "Fechado"}
          </span>
        )}
      </div>
      <div className="p-3">
        <h4 className="text-sm font-semibold text-[#30343a] truncate">{store.name}</h4>
        {store.description && <p className="text-[10px] text-[#87909a] mt-1 line-clamp-2">{store.description}</p>}
      </div>
    </div>
  );
}

export default function ExploreBusiness() {
  const [activeFilter, setActiveFilter] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("categoria");
    if (cat) {
      const group = BUSINESS_CATEGORIES.find((g) => g.title === cat);
      return group ? group.category : null;
    }
    return null;
  });

  const { data: stores = [] } = useQuery({
    queryKey: ["stores", "business"],
    queryFn: () => fetchStores({ storeType: "business" }),
    staleTime: 60_000,
  });

  const getStoresForGroup = (category: string) => {
    const group = BUSINESS_CATEGORIES.find((g) => g.category === category);
    return stores.filter((s: any) => {
      if (s.phone === "999999999") return false;
      const cat = (s.category || "").toLowerCase();
      return (group && cat.includes(group.title.toLowerCase())) || cat.includes(category.replace(/-/g, " "));
    });
  };

  const filteredGroups = activeFilter
    ? BUSINESS_CATEGORIES.filter((g) => g.category === activeFilter)
    : BUSINESS_CATEGORIES;

  return (
    <main className="min-h-[100dvh] bg-[#f4f1eb] text-[#112844]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#f4f1eb]/95 backdrop-blur-md border-b border-[#b88a3b]/10">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between px-6 py-4 md:px-12">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm text-[#68727c] hover:text-[#112844] transition-colors">
            <ArrowLeft size={16} /> Voltar
          </button>
          <span className="font-['Playfair_Display'] text-[19px] tracking-[-.02em] text-[#112844]">Eliora<small className="block font-['DM_Sans'] text-[8px] uppercase tracking-[.23em] text-[#b88a3b] mt-0.5">Business & Finances</small></span>
          <a href="/explorar-business" className="text-xs font-bold uppercase tracking-[0.14em] text-[#68727c] hover:text-[#b88a3b] transition-colors hidden md:block">Explorar</a>
        </div>
      </header>

      <div className="mx-auto max-w-[1380px] px-6 pt-28 pb-12 md:px-12">

        <div className="mb-16">
          <p className="font-['DM_Sans'] text-[10px] uppercase tracking-[0.25em] text-[#b88a3b]">Explorar serviços</p>
          <h1 className="mt-4 font-['Playfair_Display'] text-5xl tracking-[-0.03em] md:text-7xl">O nosso<br /><i>universo.</i></h1>
        </div>

        <div className="flex flex-wrap gap-3 mb-12">
          <button onClick={() => setActiveFilter(null)}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
              activeFilter === null ? "bg-[#112844] text-white" : "bg-[#e9e2d6] text-[#68727c] hover:bg-[#d9d0c1]"
            }`}>Todos</button>
          {BUSINESS_CATEGORIES.map((group) => (
            <button key={group.category} onClick={() => setActiveFilter(activeFilter === group.category ? null : group.category)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                activeFilter === group.category ? "bg-[#112844] text-white" : "bg-[#e9e2d6] text-[#68727c] hover:bg-[#d9d0c1]"
              }`}>{group.number} {group.title.split(",")[0].split(" e ")[0]}</button>
          ))}
        </div>

        <div>
          {filteredGroups.map((group, i) => {
            const groupStores = getStoresForGroup(group.category);
            return (
              <article key={group.number} className={`group border-t border-[#b88a3b]/20 py-8 md:py-12 ${i % 2 ? "md:ml-20" : ""}`}>
                <div className="grid gap-7 md:grid-cols-[100px_minmax(0,1fr)_minmax(260px,370px)] md:items-start">
                  <span className="font-['DM_Sans'] text-xs font-bold tracking-[0.2em] text-[#b88a3b]">{group.number}</span>
                  <div>
                    <h3 className="max-w-xl font-['Playfair_Display'] text-3xl leading-[1.08] text-[#112844] md:text-[2.8rem]">{group.title}</h3>
                    <p className="mt-4 max-w-md text-sm leading-7 text-[#112844]/60">{group.intro}</p>
                    <ul className="mt-6 space-y-3 border-l border-[#b88a3b]/30 pl-5 text-sm leading-5 text-[#112844]/70">
                      {group.items.map((item) => (
                        <li key={item}>
                          <div className="flex gap-3">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#b88a3b]" />
                            <span>{item}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {groupStores.length > 0 && (
                      <button onClick={() => setActiveFilter(activeFilter === group.category ? null : group.category)}
                        className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#68727c] hover:text-[#112844] transition-colors">
                        Ver mais
                      </button>
                    )}
                  </div>
                  <div className="mt-4 md:mt-0">
                    <p className="font-['DM_Sans'] text-[10px] uppercase tracking-[0.2em] text-[#87909a] mb-3">Lojas recentes</p>
                    {groupStores.length > 0 ? (
                      <div className="flex flex-col gap-3">
                        {groupStores.slice(0, 2).map((store: any) => (
                          <StoreCard key={store.id} store={store} />
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-[#b88a3b]/25 p-6 text-center">
                        <p className="text-xs text-[#87909a]">Em breve novas lojas</p>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <section className="relative overflow-hidden border-t border-[#b88a3b]/20 bg-[#112844] px-6 py-24 text-[#f4f1eb] md:px-12 md:py-32">
        <div className="relative mx-auto max-w-[1380px] md:flex md:items-end md:justify-between">
          <div>
            <p className="font-['DM_Sans'] text-[10px] uppercase tracking-[0.25em] text-[#b88a3b]">O primeiro passo</p>
            <h2 className="mt-5 max-w-2xl font-['Playfair_Display'] text-5xl leading-[1.02] md:text-7xl">Precisa de ajuda<br /><i>com algo especial?</i></h2>
          </div>
          <div className="mt-10 md:mt-0 md:w-80">
            <p className="text-sm leading-6 text-[#b9c1ca]">Conte-nos o que precisa. A nossa equipa responde com tempo, atenção e cuidado.</p>
            <div className="mt-7">
              <a href="https://wa.me/244922001778?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20Eliora%20Business%20%26%20Finances." target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#b88a3b] text-white text-sm font-medium rounded-full hover:bg-[#a07a33] transition-colors">
                Falar connosco
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
