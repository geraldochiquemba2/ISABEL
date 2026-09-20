import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, UtensilsCrossed, Cake, Zap, ChefHat, ShoppingCart, Beef, Croissant, Droplets, Package, Truck, X } from "lucide-react";
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

const ALIMENTACAO_CATEGORIES = [
  { number: "01", title: "Restaurantes", intro: "Cozinha angolana, africana, internacional, familiar e especializada.", category: "restaurantes", icon: UtensilsCrossed, items: ["Cozinha Angolana", "Cozinha Africana", "Cozinha Internacional", "Restaurante Familiar", "Cozinha Especializada"] },
  { number: "02", title: "Pastelarias & Cafés", intro: "Cafés, pastelarias, casas de chá, geladarias e sobremesas.", category: "pastelarias-cafes", icon: Cake, items: ["Cafés & Pastelarias", "Casas de Chá", "Geladarias", "Sobremesas & Confeitaria"] },
  { number: "03", title: "Fast Food & Take-away", intro: "Hambúrgueres, pizzas, frango, refeições rápidas e take-away.", category: "fast-food", icon: Zap, items: ["Hambúrgueres", "Pizzas", "Frango Frito", "Refeições Rápidas", "Take-away"] },
  { number: "04", title: "Catering", intro: "Festas, casamentos, empresas, eventos e buffet.", category: "catering", icon: ChefHat, items: ["Catering de Festas", "Casamentos & Eventos", "Buffet Empresarial", "Eventos Especiais"] },
  { number: "05", title: "Supermercados & Mercearias", intro: "Supermercados, minimercados, mercearias e lojas de conveniência.", category: "supermercados", icon: ShoppingCart, items: ["Supermercados", "Minimercados", "Mercearias", "Lojas de Conveniência"] },
  { number: "06", title: "Talhos & Peixarias", intro: "Carnes, aves, peixe, marisco e congelados.", category: "talhos-peixarias", icon: Beef, items: ["Carnes & Aves", "Peixe Fresco", "Marisco", "Congelados"] },
  { number: "07", title: "Padarias", intro: "Pão, produtos de padaria e produção artesanal.", category: "padarias", icon: Croissant, items: ["Pão Fresco", "Produtos de Padaria", "Produção Artesanal"] },
  { number: "08", title: "Bebidas & Água", intro: "Água mineral, sumos, refrigerantes e distribuição de bebidas não alcoólicas.", category: "bebidas", icon: Droplets, items: ["Água Mineral", "Sumos & Refrigerantes", "Distribuição de Bebidas"] },
  { number: "09", title: "Produtos Alimentares", intro: "Produtos nacionais, importados, naturais, congelados e especializados.", category: "produtos-alimentares", icon: Package, items: ["Produtos Nacionais", "Produtos Importados", "Produtos Naturais", "Congelados & Especializados"] },
  { number: "10", title: "Entregas de Comida", intro: "Delivery de refeições, entrega de compras e entrega alimentar.", category: "entregas-comida", icon: Truck, items: ["Delivery de Refeições", "Entrega de Compras", "Entrega Alimentar"] },
];

function StoreCard({ store, productImages }: { store: any; productImages?: string[] }) {
  const fallbackImage = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop&auto=format&q=75";
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
      className="flex-shrink-0 w-48 rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow border border-[#E8D5C0] cursor-pointer hover:-translate-y-1"
      onClick={() => window.location.href = `/loja/${store.id}?from=alimentacao`}
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
          <span className={`absolute top-2 right-2 text-[9px] font-semibold px-2 py-0.5 rounded-full z-20 ${store.isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
            {store.isOpen ? "Aberto" : "Fechado"}
          </span>
        )}
      </div>
      <div className="p-3">
        <h4 className="text-sm font-semibold text-[#2D1B0E] truncate">{store.name}</h4>
        {store.description && (
          <p className="text-[10px] text-[#6D5843] mt-1 line-clamp-2">{store.description}</p>
        )}
      </div>
    </div>
  );
}

export default function ExploreAlimentacao() {
  const [activeFilter, setActiveFilter] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("categoria");
    if (cat) {
      const group = ALIMENTACAO_CATEGORIES.find((g) => g.title.toLowerCase().includes(cat.toLowerCase()) || g.category.toLowerCase() === cat.toLowerCase());
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
    queryKey: ["stores", "alimentacao-restauracao"],
    queryFn: () => fetchStores({ storeType: "alimentacao-restauracao" }),
    staleTime: 60_000,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products", "alimentacao-restauracao"],
    queryFn: async () => {
      const res = await fetch("/api/products?store_type=alimentacao-restauracao");
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
    const group = ALIMENTACAO_CATEGORIES.find((g) => g.category === category);
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
    ? ALIMENTACAO_CATEGORIES.filter((g) => g.title.toLowerCase().includes(activeFilter.toLowerCase()) || g.category === activeFilter)
    : ALIMENTACAO_CATEGORIES;

  return (
    <main className="min-h-[100dvh] bg-[#FFF8F0] text-[#2D1B0E]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFF8F0]/95 backdrop-blur-md border-b border-[#D84315]/10">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between px-6 py-4 md:px-12">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm text-[#6D5843] hover:text-[#D84315] transition-colors">
            <ArrowLeft size={16} /> Voltar
          </button>
          <span className="font-['Playfair_Display'] text-[19px] tracking-[-.02em] text-[#D84315]">YESOLA<small className="block font-['DM_Sans'] text-[8px] uppercase tracking-[.23em] text-[#B71C1C] mt-0.5">Alimentação & Restauração</small></span>
          <a href="/explorar-alimentacao" className="text-xs font-bold uppercase tracking-[0.14em] text-[#6D5843] hover:text-[#D84315] transition-colors hidden md:block">Explorar</a>
        </div>
      </header>

      <div className="mx-auto max-w-[1380px] px-6 pt-28 pb-12 md:px-12">

        <div className="mb-16">
          <p className="font-['DM_Sans'] text-[10px] uppercase tracking-[0.25em] text-[#D84315]">Explorar serviços</p>
          <h1 className="mt-4 font-['Playfair_Display'] text-5xl tracking-[-0.03em] md:text-7xl">O nosso<br /><i>universo.</i></h1>
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
              activeFilter === null ? "bg-[#D84315] text-white" : "bg-[#FBE9E7] text-[#6D5843] hover:bg-[#FFCCBC]"
            }`}>Todos</button>
          {ALIMENTACAO_CATEGORIES.map((group) => (
            <button key={group.category} onClick={() => setActiveFilter(activeFilter === group.category ? null : group.category)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                activeFilter === group.category ? "bg-[#D84315] text-white" : "bg-[#FBE9E7] text-[#6D5843] hover:bg-[#FFCCBC]"
              }`}>{group.number} {group.title.split(",")[0].split(" e ")[0]}</button>
          ))}
        </div>

        <div className="mb-6">
          <span className="text-xs uppercase tracking-[0.15em] text-[#6D5843] mr-2">Província:</span>
          <select
            value={activeProvince || ""}
            onChange={(e) => { setActiveProvince(e.target.value || null); setActiveMunicipality(null); }}
            className="mt-2 md:hidden w-full px-4 py-3 rounded-xl text-sm border border-[#E8D5C0] bg-white text-[#2D1B0E] outline-none"
          >
            <option value="">Todas</option>
            {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <div className="hidden md:flex flex-wrap gap-3 mt-2">
            <button
              onClick={() => { setActiveProvince(null); setActiveMunicipality(null); }}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                activeProvince === null ? "bg-[#B71C1C] text-white" : "bg-[#FBE9E7] text-[#6D5843] hover:bg-[#FFCCBC]"
              }`}>Todas</button>
            {provinces.map((province) => (
              <button
                key={province}
                onClick={() => { setActiveProvince(activeProvince === province ? null : province); setActiveMunicipality(null); }}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                  activeProvince === province ? "bg-[#B71C1C] text-white" : "bg-[#FBE9E7] text-[#6D5843] hover:bg-[#FFCCBC]"
                }`}>{province}</button>
            ))}
          </div>
        </div>

        {municipalities.length > 0 && (
          <div className="mb-12">
            <span className="text-xs uppercase tracking-[0.15em] text-[#6D5843] mr-2">Município:</span>
            <select
              value={activeMunicipality || ""}
              onChange={(e) => setActiveMunicipality(e.target.value || null)}
              className="mt-2 md:hidden w-full px-4 py-3 rounded-xl text-sm border border-[#E8D5C0] bg-white text-[#2D1B0E] outline-none"
            >
              <option value="">Todos</option>
              {municipalities.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <div className="hidden md:flex flex-wrap gap-3 mt-2">
              <button
                onClick={() => setActiveMunicipality(null)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                  activeMunicipality === null ? "bg-[#6D5843] text-white" : "bg-[#FBE9E7] text-[#6D5843] hover:bg-[#FFCCBC]"
                }`}>Todos</button>
              {municipalities.map((m) => (
                <button
                  key={m}
                  onClick={() => setActiveMunicipality(activeMunicipality === m ? null : m)}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                    activeMunicipality === m ? "bg-[#6D5843] text-white" : "bg-[#FBE9E7] text-[#6D5843] hover:bg-[#FFCCBC]"
                  }`}>{m}</button>
              ))}
            </div>
          </div>
        )}

        <div>
          {filteredGroups.map((group, i) => {
            const groupStores = getStoresForGroup(group.category);
            return (
              <article key={group.number} className={`group border-t border-[#D84315]/20 py-8 md:py-12 ${i % 2 ? "md:ml-20" : ""}`}>
                <div className="grid gap-7 md:grid-cols-[100px_minmax(0,1fr)_minmax(260px,370px)] md:items-start">
                  <span className="font-['DM_Sans'] text-xs font-bold tracking-[0.2em] text-[#B71C1C]">{group.number}</span>
                  <div>
                    <h3 className="max-w-xl font-['Playfair_Display'] text-3xl leading-[1.08] text-[#D84315] md:text-[2.8rem]">{group.title}</h3>
                    <p className="mt-4 max-w-md text-sm leading-7 text-[#D84315]/60">{group.intro}</p>
                    <ul className="mt-6 space-y-3 border-l border-[#B71C1C]/30 pl-5 text-sm leading-5 text-[#D84315]/70">
                      {group.items.map((item) => (
                        <li key={item}>
                          <div className="flex gap-3">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#B71C1C]" />
                            <span>{item}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {groupStores.length > 0 && (
                      <button onClick={() => setActiveFilter(activeFilter === group.category ? null : group.category)}
                        className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#6D5843] hover:text-[#D84315] transition-colors">
                        Ver mais
                      </button>
                    )}
                  </div>
                  <div className="mt-4 md:mt-0">
                    <p className="font-['DM_Sans'] text-[10px] uppercase tracking-[0.2em] text-[#6D5843] mb-3">Lojas recentes</p>
                    {groupStores.length > 0 ? (
                      <div className="flex flex-col gap-3">
                        {groupStores.slice(0, 2).map((store: any) => (
                          <StoreCard key={store.id} store={store} productImages={getProductsForStore(store.id)} />
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-[#D84315]/25 p-6 text-center">
                        <p className="text-xs text-[#6D5843]">Em breve novas lojas</p>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <section className="relative overflow-hidden border-t border-[#B71C1C]/20 bg-[#D84315] px-6 py-24 text-[#FFF8F0] md:px-12 md:py-32">
        <div className="relative mx-auto max-w-[1380px] md:flex md:items-end md:justify-between">
          <div>
            <p className="font-['DM_Sans'] text-[10px] uppercase tracking-[0.25em] text-[#FFCCBC]">O primeiro passo</p>
            <h2 className="mt-5 max-w-2xl font-['Playfair_Display'] text-5xl leading-[1.02] md:text-7xl">Precisa de ajuda<br /><i>com algo especial?</i></h2>
          </div>
          <div className="mt-10 md:mt-0 md:w-80">
            <p className="text-sm leading-6 text-[#FFF8F0]/60">Conte-nos o que procura. A nossa equipa responde com tempo, atenção e cuidado.</p>
            <div className="mt-7">
              <a href="https://wa.me/244922001778?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20YESOLA%20Alimentação%20%26%20Restauração." target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#B71C1C] text-white text-sm font-medium rounded-full hover:bg-[#8B1414] transition-colors">
                Falar connosco
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}