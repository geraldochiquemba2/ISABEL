import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Sparkles, TentTree, Utensils, Music2, ShieldCheck, Camera } from "lucide-react";
import { fetchStores } from "@/lib/api";

const EVENTOS_CATEGORIES = [
  { number: "01", title: "Planeamento, Design e Assessoria de Eventos", intro: "Momentos que ficam na memória.", category: "decoracao", icon: Sparkles, items: ["Decoração Temática", "Organização e Assessoria de Festas Infantis e Batizados", "Planeamento de Aniversários, Chás de Bebé e Chás de Panela", "Organização de Eventos Corporativos, Jantares e Galas"] },
  { number: "02", title: "Estrutura, Mobilia e Aluguer de Equipamentos", intro: "Tudo o que precisa para montar o cenário perfeito.", category: "equipamentos", icon: TentTree, items: ["Aluguer de Som", "Iluminação Profissional", "Palcos", "Aluguer de Tendas", "Mesas e Cadeiras", "Louça para Festas", "Aluguer de Geradores e Equipamentos Elétricos de Apoio", "Telões de LED, Projetores e Fotomatões (360º / Photobooth)"] },
  { number: "03", title: "Gastronomia, Bar e Restauração para Eventos", intro: "Sabores que fazem a diferença.", category: "gastronomia", icon: Utensils, items: ["Serviços de Catering e Buffets Temáticos", "Bolos Artísticos, Doces Finos e Salgados", "Bar de Cócteis e Baristas"] },
  { number: "04", title: "Animação, Entretenimento e Atração de Pistas", intro: "Energia que faz a festa vibrar.", category: "animacao", icon: Music2, items: ["DJs, Bandas Musicais e Grupos Acústicos", "Animadores Infantis, Palhaços e Pinturas Faciais", "Aluguer de Insufláveis, Brinquedos e Trampolins"] },
  { number: "05", title: "Staff Profissional e Segurança", intro: "Equipa de confiança para o seu evento.", category: "staff", icon: ShieldCheck, items: ["Garçons, Barman, Copeiros e Cozinheiros para Festas", "Hostesses, Rececionistas e Promotores de Eventos", "Equipas de Segurança Privada e Controlo de Acessos", "Limpeza Antes, Durante e Pós-Evento"] },
  { number: "06", title: "Registo, Memória e Fotografia", intro: "Imortalize cada momento especial.", category: "fotografia", icon: Camera, items: ["Fotógrafos de Festas e Eventos Sociais", "Fotógrafos Corporativos e de Galas", "Videomakers", "Cabines Fotográficas (Photobooth / 360º)"] },
];

function StoreCard({ store }: { store: any }) {
  return (
    <div
      className="flex-shrink-0 w-48 rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow border border-[#e8eaed] cursor-pointer hover:-translate-y-1"
      onClick={() => window.location.href = `/loja/${store.id}?from=eventos`}
    >
      <div className="relative h-28 overflow-hidden bg-[#f0e6df]">
        {store.logoUrl && (
          <img
            src={store.logoUrl}
            alt=""
            className="absolute top-2 left-2 w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm z-20"
            style={{ filter: "brightness(0) saturate(100%) invert(35%) sepia(40%) saturate(400%) hue-rotate(320deg) brightness(85%) contrast(85%)" }}
          />
        )}
        {store.isOpen !== undefined && (
          <span className={`absolute top-2 right-2 text-[9px] font-semibold px-2 py-0.5 rounded-full z-20 ${store.isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
            {store.isOpen ? "Aberto" : "Fechado"}
          </span>
        )}
      </div>
      <div className="p-3">
        <h4 className="text-sm font-semibold text-[#3c2731] truncate">{store.name}</h4>
        {store.description && <p className="text-[10px] text-[#87909a] mt-1 line-clamp-2">{store.description}</p>}
      </div>
    </div>
  );
}

export default function ExploreEventos() {
  const [activeFilter, setActiveFilter] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("categoria");
    if (cat) {
      const group = EVENTOS_CATEGORIES.find((g) => g.title === cat);
      return group ? group.category : null;
    }
    return null;
  });

  const { data: stores = [] } = useQuery({
    queryKey: ["stores", "eventos"],
    queryFn: () => fetchStores({ storeType: "eventos" }),
    staleTime: 60_000,
  });

  const getStoresForGroup = (category: string) => {
    const group = EVENTOS_CATEGORIES.find((g) => g.category === category);
    return stores.filter((s: any) => {
      if (s.phone === "999999999") return false;
      const cat = (s.category || "").toLowerCase();
      return (group && cat.includes(group.title.toLowerCase())) || cat.includes(category.replace(/-/g, " "));
    });
  };

  const filteredGroups = activeFilter
    ? EVENTOS_CATEGORIES.filter((g) => g.category === activeFilter)
    : EVENTOS_CATEGORIES;

  return (
    <main className="min-h-[100dvh] bg-[#fffcf9] text-[#3c2731]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#fffcf9]/95 backdrop-blur-md border-b border-[#8e5557]/10">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between px-6 py-4 md:px-12">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm text-[#68727c] hover:text-[#3c2731] transition-colors">
            <ArrowLeft size={16} /> Voltar
          </button>
          <span className="font-['Playfair_Display'] text-[19px] tracking-[-.02em] text-[#3c2731]">Eliora<small className="block font-['DM_Sans'] text-[8px] uppercase tracking-[.23em] text-[#8e5557] mt-0.5">Eventos & Celebrações</small></span>
          <a href="/explorar-eventos" className="text-xs font-bold uppercase tracking-[0.14em] text-[#68727c] hover:text-[#8e5557] transition-colors hidden md:block">Explorar</a>
        </div>
      </header>

      <div className="mx-auto max-w-[1380px] px-6 pt-28 pb-12 md:px-12">

        <div className="mb-16">
          <p className="font-['DM_Sans'] text-[10px] uppercase tracking-[0.25em] text-[#8e5557]">Explorar serviços</p>
          <h1 className="mt-4 font-['Playfair_Display'] text-5xl tracking-[-0.03em] md:text-7xl">O nosso<br /><i>universo.</i></h1>
        </div>

        <div className="flex flex-wrap gap-3 mb-12">
          <button onClick={() => setActiveFilter(null)}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
              activeFilter === null ? "bg-[#3c2731] text-white" : "bg-[#f0e6df] text-[#68727c] hover:bg-[#e0d4cc]"
            }`}>Todos</button>
          {EVENTOS_CATEGORIES.map((group) => (
            <button key={group.category} onClick={() => setActiveFilter(activeFilter === group.category ? null : group.category)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                activeFilter === group.category ? "bg-[#3c2731] text-white" : "bg-[#f0e6df] text-[#68727c] hover:bg-[#e0d4cc]"
              }`}>{group.number} {group.title.split(",")[0].split(" e ")[0]}</button>
          ))}
        </div>

        <div>
          {filteredGroups.map((group, i) => {
            const groupStores = getStoresForGroup(group.category);
            return (
              <article key={group.number} className={`group border-t border-[#8e5557]/20 py-8 md:py-12 ${i % 2 ? "md:ml-20" : ""}`}>
                <div className="grid gap-7 md:grid-cols-[100px_minmax(0,1fr)_minmax(260px,370px)] md:items-start">
                  <span className="font-['DM_Sans'] text-xs font-bold tracking-[0.2em] text-[#8e5557]">{group.number}</span>
                  <div>
                    <h3 className="max-w-xl font-['Playfair_Display'] text-3xl leading-[1.08] text-[#3c2731] md:text-[2.8rem]">{group.title}</h3>
                    <p className="mt-4 max-w-md text-sm leading-7 text-[#3c2731]/60">{group.intro}</p>
                    <ul className="mt-6 space-y-3 border-l border-[#8e5557]/30 pl-5 text-sm leading-5 text-[#3c2731]/70">
                      {group.items.map((item) => (
                        <li key={item}>
                          <div className="flex gap-3">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#8e5557]" />
                            <span>{item}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {groupStores.length > 0 && (
                      <button onClick={() => setActiveFilter(activeFilter === group.category ? null : group.category)}
                        className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#68727c] hover:text-[#3c2731] transition-colors">
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
                      <div className="rounded-2xl border border-dashed border-[#8e5557]/25 p-6 text-center">
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

      <section className="relative overflow-hidden border-t border-[#8e5557]/20 bg-[#3c2731] px-6 py-24 text-[#fffcf9] md:px-12 md:py-32">
        <div className="relative mx-auto max-w-[1380px] md:flex md:items-end md:justify-between">
          <div>
            <p className="font-['DM_Sans'] text-[10px] uppercase tracking-[0.25em] text-[#8e5557]">O primeiro passo</p>
            <h2 className="mt-5 max-w-2xl font-['Playfair_Display'] text-5xl leading-[1.02] md:text-7xl">Precisa de ajuda<br /><i>com algo especial?</i></h2>
          </div>
          <div className="mt-10 md:mt-0 md:w-80">
            <p className="text-sm leading-6 text-[#c4b0b1]">Conte-nos o que precisa. A nossa equipa responde com tempo, atenção e cuidado.</p>
            <div className="mt-7">
              <a href="https://wa.me/244922001778?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20Eliora%20Eventos%20%26%20Celebrações." target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#8e5557] text-white text-sm font-medium rounded-full hover:bg-[#7a4a4c] transition-colors">
                Falar connosco
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
