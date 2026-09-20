import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Smartphone, Monitor, Headphones, Refrigerator, Wrench, Wifi, Code, Shield, MapPin, X } from "lucide-react";
import { fetchStores } from "@/lib/api";

interface Store {
  id: string;
  name: string;
  category: string;
  image?: string;
  coverImage?: string;
  logoUrl?: string;
  description?: string;
  isOpen?: boolean;
  province?: string;
  municipality?: string;
  products?: { imageUrl?: string; imageUrls?: string | string[] }[];
}

const TECNOLOGIA_CATEGORIES = [
  { number: "01", title: "Telemóveis & Tablets", intro: "Os melhores smartphones e tablets das principais marcas mundiais.", category: "telemoveis-tablets", icon: Smartphone, items: ["iPhone", "Samsung", "Xiaomi", "Tecno", "Infinix", "Huawei", "Outros Smartphones", "Tablets", "Acessórios"] },
  { number: "02", title: "Computadores & Informática", intro: "Computadores, periféricos e acessórios para trabalho e lazer.", category: "computadores-informatica", icon: Monitor, items: ["Portáteis", "Computadores de Mesa", "Monitores", "Impressoras", "Teclados", "Ratos", "Armazenamento", "Acessórios"] },
  { number: "03", title: "Electrónicos & Acessórios", intro: "Electrónica de consumo, áudio, vídeo e acessórios de qualidade.", category: "electronica-acessorios", icon: Headphones, items: ["Televisores", "Colunas", "Auscultadores", "Câmaras", "Consolas", "Acessórios Electrónicos"] },
  { number: "04", title: "Electrodomicílios", intro: "Eletrodomésticos para a sua casa, desde grandes a pequenos aparelhos.", category: "electrodomesticos", icon: Refrigerator, items: ["Frigoríficos", "Arcas", "Fogões", "Microondas", "Máquinas de Lavar", "Climatização", "Pequenos Electrodomésticos"] },
  { number: "05", title: "Reparação & Assistência Técnica", intro: "Serviços profissionais de reparação e manutenção de equipamentos.", category: "reparacao-assistencia", icon: Wrench, items: ["Telemóveis", "Computadores", "Televisores", "Electrodomésticos", "Assistência Técnica"] },
  { number: "06", title: "Internet & Telecomunicações", intro: "Provedores de internet, instalação e equipamentos de rede.", category: "internet-telecomunicacoes", icon: Wifi, items: ["Provedores de Internet", "Instalação", "Routers", "Redes", "Telecomunicações"] },
  { number: "07", title: "Software & Soluções Digitais", intro: "Desenvolvimento web, apps e software empresarial sob medida.", category: "software-solucoes", icon: Code, items: ["Sites", "Aplicativos", "Sistemas Empresariais", "Software", "Suporte Informático"] },
  { number: "08", title: "Segurança Electrónica & Videovigilância", intro: "Soluções completas de segurança e monitorização para empresas e residências.", category: "seguranca-videovigilancia", icon: Shield, items: ["CCTV", "Câmaras", "Alarmes", "Controlo de Acesso", "Instalação"] },
];

function StoreCard({ store, productImages }: { store: any; productImages?: string[] }) {
  const fallbackImage = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop&auto=format&q=75";
  const images = productImages && productImages.length > 0 ? productImages : [store.coverImage || store.image || fallbackImage];
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div
      className="flex-shrink-0 w-48 rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow border border-[#B3C9D6] cursor-pointer hover:-translate-y-1"
      onClick={() => window.location.href = `/loja/${store.id}?from=tecnologia`}
    >
      <div className="relative h-28 overflow-hidden">
        <img
          src={images[currentIdx] || fallbackImage}
          alt={store.name}
          className="w-full h-full object-cover"
        />
        {store.logoUrl && (
          <img
            src={store.logoUrl}
            alt={`Logo ${store.name}`}
            className="absolute top-2 left-2 w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm z-20"
          />
        )}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 z-20 flex gap-1">
            {images.map((_: string, i: number) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrentIdx(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIdx ? "bg-white w-3" : "bg-white/50"}`}
              />
            ))}
          </div>
        )}
        {store.isOpen !== undefined && (
          <span className={`absolute top-2 right-2 text-[9px] font-semibold px-2 py-0.5 rounded-full z-20 ${store.isOpen ? "bg-[#1565C0] text-white" : "bg-red-100 text-red-600"}`}>
            {store.isOpen ? "Aberto" : "Fechado"}
          </span>
        )}
      </div>
      <div className="p-3">
        <h4 className="text-sm font-semibold text-[#0D1B2A] truncate">{store.name}</h4>
        {store.description && (
          <p className="text-[10px] text-[#5C6B73] mt-1 line-clamp-2">{store.description}</p>
        )}
      </div>
    </div>
  );
}

export default function ExploreTecnologia() {
  const [activeFilter, setActiveFilter] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("categoria");
    if (cat) {
      const group = TECNOLOGIA_CATEGORIES.find((g) => g.title.toLowerCase().includes(cat.toLowerCase()) || g.category.toLowerCase() === cat.toLowerCase());
      return group ? group.category : null;
    }
    return null;
  });
  const [activeProvince, setActiveProvince] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("provincia") || null;
  });
  const [activeMunicipality, setActiveMunicipality] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("municipio") || null;
  });

  const hasActiveFilters = activeFilter !== null || activeProvince !== null || activeMunicipality !== null;

  const clearAllFilters = () => {
    setActiveFilter(null);
    
    setActiveProvince(null);
    setActiveMunicipality(null);
    const url = new URL(window.location.href);
    url.search = "";
    window.history.replaceState({}, "", url.toString());
  };

  const angolaProvinces: Record<string, string[]> = {
    "Luanda": ["Belas", "Cacuaco", "Cazenga", "Icolo e Bengo", "Kilamba Kiaxi", "Maianga", "Rangel", "Samba", "Talatona", "Viana"],
    "Benguela": ["Benguela", "Caimbambo", "Catumbela", "Chiley", "Baía Farta", "Lobito"],
    "Huíla": ["Cacula", "Chibia", "Chinjenje", "Cuiva", "Cuvango", "Humpata", "Lubango", "Matala", "Quilengues", "Quipungo"],
    "Huambo": ["Huambo", "Caála", "Ecunha", "Londuimbali", "Mungo", "Bailundo", "Ukuma", "Chipica"],
    "Bengo": ["Ambriz", "Bula", "Dembos", "N'dalatando", "São José das Matas"],
    "Bié": ["Camacupa", "Catabola", "Chinguar", "Chitembo", "Cuito", "Andulo", "N'harea"],
    "Cabinda": ["Cabinda", "Cacongo", "Belize", "Buco-Zau"],
    "Cuando-Cubango": ["Calai", "Cuangar", "Curoca", "Mavinga", "Menongue", "Rivungo"],
    "Cuanza Norte": ["Ambaca", "Bolongongo", "Cazengo", "Golungo Alto", "Lucala", "Samba Cajù"],
    "Cuanza Sul": ["Amboim", "Cassongue", "Cela", "Conda", "Ebo", "Mussende", "Porto Amboim", "Quilenda", "Quirimbo"],
    "Cunene": ["Cahama", "Cuanhala", "Curoca", "Cuvelai", "Namacunde", "Ombadja"],
    "Icolo e Bengo": ["Dondo", "Dembos", "Icolo e Bengo", "Catete"],
    "Lunda Norte": ["Caungula", "Cazombo", "Cambulo", "Capenda-Camulemba", "Catchiungo", "Chitato", "Cuango", "Luau", "Luremo"],
    "Lunda Sul": ["Dala", "Muconda", "Saurimo"],
    "Malanje": ["Cacuso", "Calandula", "Cambundi-Catembo", "Cangandala", "Caombo", "Cuaba Ndongu", "Luquembo", "Malanje", "Marimba", "Massango", "Mucari", "Quela", "Quiçama"],
    "Moxico": ["Alto Zambeze", "Bundas", "Luccala", "Cameia", "Moxico", "Nacu-Curo"],
    "Namibe": ["Bibala", "Lacuando", "Mossâmedes", "Namibe", "Tômbua", "Virei"],
    "Uíge": ["Alto Cauale", "Ambuíla", "Bembe", "Buengas", "Bungo", "Cassanje", "Cazombo", "Damba", "Milunga", "Mucaba", "Negage", "Puri", "Quimavunde", "Santa Comba Dao", "Songo", "Uíge", "Vimoque"],
    "Zaire": ["Cuimba", "Iombe", "M'banza-Kongo", "Nóqui", "Soyo", "Terras do Zaire"],
  };

  const { data: stores = [] } = useQuery({
    queryKey: ["stores", "tecnologia-electronicos"],
    queryFn: () => fetchStores({ storeType: "tecnologia-electronicos" }),
    staleTime: 60_000,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products", "tecnologia-electronicos"],
    queryFn: async () => {
      const res = await fetch("/api/products?store_type=tecnologia-electronicos");
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60_000,
  });

  const getProductsForStore = (storeId: string) => {
    return products.filter((p: any) => p.storeId === storeId).flatMap((p: any) =>
      (p.imageUrls && p.imageUrls.length > 0) ? p.imageUrls : (p.imageUrl ? [p.imageUrl] : [])
    );
  };

  const provinces = Object.keys(angolaProvinces);
  const municipalities = activeProvince ? angolaProvinces[activeProvince] || [] : [];

  const getStoresForGroup = (category: string) => {
    const group = TECNOLOGIA_CATEGORIES.find((g) => g.category === category);
    return stores.filter((s: any) => {
      if (s.phone === "999999999") return false;
      const cat = (s.category || "").toLowerCase();
      const matchesCategory = (group && cat.includes(group.title.toLowerCase())) || cat.includes(category.replace(/-/g, " "));
      const matchesProvince = !activeProvince || s.province === activeProvince;
      const matchesMunicipality = !activeMunicipality || s.municipality === activeMunicipality;
      return matchesCategory && matchesProvince && matchesMunicipality;
    });
  };

  const filteredGroups = activeFilter
    ? TECNOLOGIA_CATEGORIES.filter((g) => g.title.toLowerCase().includes(activeFilter.toLowerCase()) || g.category === activeFilter)
    : TECNOLOGIA_CATEGORIES;

  return (
    <main className="min-h-[100dvh] bg-[#F0F4F8] text-[#0D1B2A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0D1B2A]/95 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between px-6 py-4 md:px-12">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Voltar
          </button>
          <span className="font-['Playfair_Display'] text-[19px] tracking-[-.02em] text-white">YESOLA<small className="block font-['DM_Sans'] text-[8px] uppercase tracking-[.23em] text-[#1565C0] mt-0.5">Tecnologia & Electrónica</small></span>
          <a href="/explorar-tecnologia" className="text-xs font-bold uppercase tracking-[0.14em] text-white/60 hover:text-[#1565C0] transition-colors hidden md:block">Explorar</a>
        </div>
      </header>

      <div className="mx-auto max-w-[1380px] px-6 pt-28 pb-12 md:px-12">

        <div className="mb-16">
          <p className="font-['DM_Sans'] text-[10px] uppercase tracking-[0.25em] text-[#1565C0]">Explorar serviços</p>
          <h1 className="mt-4 font-['Playfair_Display'] text-5xl tracking-[-0.03em] md:text-7xl text-[#0D1B2A]">O nosso<br /><i>universo.</i></h1>
        </div>

        <div className="flex flex-wrap gap-3 mb-12">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] bg-red-100 text-red-700 hover:bg-red-200 transition-all font-semibold border border-red-200"
            >
              <X size={14} /> Limpar Filtros
            </button>
          )}
          <button onClick={() => setActiveFilter(null)}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
              activeFilter === null ? "bg-[#1565C0] text-white" : "bg-[#B3C9D6] text-[#5C6B73] hover:bg-[#9DBDD3]"
            }`}>Todos</button>
          {TECNOLOGIA_CATEGORIES.map((group) => (
            <button key={group.category} onClick={() => setActiveFilter(activeFilter === group.category ? null : group.category)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                activeFilter === group.category ? "bg-[#1565C0] text-white" : "bg-[#B3C9D6] text-[#5C6B73] hover:bg-[#9DBDD3]"
              }`}>{group.number} {group.title.split(",")[0].split(" e ")[0]}</button>
          ))}
        </div>

        <div className="mb-6">
          <span className="text-xs uppercase tracking-[0.15em] text-[#5C6B73] mr-2">Província:</span>
          <select
            value={activeProvince || ""}
            onChange={(e) => { setActiveProvince(e.target.value || null); setActiveMunicipality(null); }}
            className="mt-2 md:hidden w-full px-4 py-3 rounded-xl text-sm border border-[#B3C9D6] bg-white text-[#0D1B2A] outline-none"
          >
            <option value="">Todas</option>
            {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <div className="hidden md:flex flex-wrap gap-3 mt-2">
            <button
              onClick={() => { setActiveProvince(null); setActiveMunicipality(null); }}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                activeProvince === null ? "bg-[#1565C0] text-white" : "bg-[#B3C9D6] text-[#5C6B73] hover:bg-[#9DBDD3]"
              }`}>Todas</button>
            {provinces.map((province) => (
              <button
                key={province}
                onClick={() => { setActiveProvince(activeProvince === province ? null : province); setActiveMunicipality(null); }}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                  activeProvince === province ? "bg-[#1565C0] text-white" : "bg-[#B3C9D6] text-[#5C6B73] hover:bg-[#9DBDD3]"
                }`}>{province}</button>
            ))}
          </div>
        </div>

        {municipalities.length > 0 && (
          <div className="mb-12">
            <span className="text-xs uppercase tracking-[0.15em] text-[#5C6B73] mr-2">Município:</span>
            <select
              value={activeMunicipality || ""}
              onChange={(e) => setActiveMunicipality(e.target.value || null)}
              className="mt-2 md:hidden w-full px-4 py-3 rounded-xl text-sm border border-[#B3C9D6] bg-white text-[#0D1B2A] outline-none"
            >
              <option value="">Todos</option>
              {municipalities.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <div className="hidden md:flex flex-wrap gap-3 mt-2">
              <button
                onClick={() => setActiveMunicipality(null)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                  activeMunicipality === null ? "bg-[#5C6B73] text-white" : "bg-[#B3C9D6] text-[#5C6B73] hover:bg-[#9DBDD3]"
                }`}>Todos</button>
              {municipalities.map((m) => (
                <button
                  key={m}
                  onClick={() => setActiveMunicipality(activeMunicipality === m ? null : m)}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                    activeMunicipality === m ? "bg-[#5C6B73] text-white" : "bg-[#B3C9D6] text-[#5C6B73] hover:bg-[#9DBDD3]"
                  }`}>{m}</button>
              ))}
            </div>
          </div>
        )}

        <div>
          {filteredGroups.map((group, i) => {
            const groupStores = getStoresForGroup(group.category);
            const Icon = group.icon;
            return (
              <article key={group.number} className={`group border-t border-[#B3C9D6] py-8 md:py-12 ${i % 2 ? "md:ml-20" : ""}`}>
                <div className="grid gap-7 md:grid-cols-[100px_minmax(0,1fr)_minmax(260px,370px)] md:items-start">
                  <span className="font-['DM_Sans'] text-xs font-bold tracking-[0.2em] text-[#1565C0]">{group.number}</span>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Icon size={24} className="text-[#1565C0]" />
                      <h3 className="max-w-xl font-['Playfair_Display'] text-3xl leading-[1.08] text-[#0D1B2A] md:text-[2.8rem]">{group.title}</h3>
                    </div>
                    <p className="mt-4 max-w-md text-sm leading-7 text-[#5C6B73]">{group.intro}</p>
                    <ul className="mt-6 space-y-3 border-l border-[#1565C0]/30 pl-5 text-sm leading-5 text-[#0D1B2A]/70">
                      {group.items.map((item) => (
                        <li key={item}>
                          <div className="flex gap-3">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#1565C0]" />
                            <span>{item}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {groupStores.length > 0 && (
                      <button onClick={() => setActiveFilter(activeFilter === group.category ? null : group.category)}
                        className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#5C6B73] hover:text-[#0D1B2A] transition-colors">
                        Ver mais
                      </button>
                    )}
                  </div>
                  <div className="mt-4 md:mt-0">
                    <p className="font-['DM_Sans'] text-[10px] uppercase tracking-[0.2em] text-[#5C6B73] mb-3">Lojas recentes</p>
                    {groupStores.length > 0 ? (
                      <div className="flex flex-col gap-3">
                        {groupStores.slice(0, 2).map((store: any) => (
                          <StoreCard key={store.id} store={store} productImages={getProductsForStore(store.id)} />
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-[#B3C9D6] p-6 text-center">
                        <p className="text-xs text-[#5C6B73]">Em breve novas lojas</p>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <section className="relative overflow-hidden border-t border-[#1565C0]/20 bg-[#0D1B2A] px-6 py-24 text-white md:px-12 md:py-32">
        <div className="relative mx-auto max-w-[1380px] md:flex md:items-end md:justify-between">
          <div>
            <p className="font-['DM_Sans'] text-[10px] uppercase tracking-[0.25em] text-[#1565C0]">O primeiro passo</p>
            <h2 className="mt-5 max-w-2xl font-['Playfair_Display'] text-5xl leading-[1.02] md:text-7xl">Precisa de ajuda<br /><i>com algo especial?</i></h2>
          </div>
          <div className="mt-10 md:mt-0 md:w-80">
            <p className="text-sm leading-6 text-white/60">Conte-nos o que procura. A nossa equipa responde com tempo, atenção e cuidado.</p>
            <div className="mt-7">
              <a href="https://wa.me/244922001778?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20YESOLA%20Tecnologia%20%26%20Electrónica." target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1565C0] text-white text-sm font-medium rounded-full hover:bg-[#0D47A1] transition-colors">
                Falar connosco
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
