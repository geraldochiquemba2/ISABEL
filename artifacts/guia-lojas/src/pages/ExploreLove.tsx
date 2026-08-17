import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Search, Menu, X, HeartHandshake, Camera,
  Stethoscope, Home, Clock3, MapPin, ArrowLeft,
} from "lucide-react";
import { fetchStores } from "@/lib/api";

const LOVE_SERVICE_GROUPS = [
  { number: "01", title: "Actos de Amor, Homenagens e Experiências", intro: "Faça-se presente nos dias que mais importam.", category: "actos-de-amor", icon: HeartHandshake, items: ["Presentes e buquês", "Cartas escritas à mão", "Serenatas e músicos", "Festas íntimas"] },
  { number: "02", title: "Fotografia e Videomakers", intro: "Guarde o instante. Conte a história inteira.", category: "fotografia", icon: Camera, items: ["Fotógrafos", "Videomakers"] },
  { number: "03", title: "Saúde, Cuidado e Bem-Estar ao Domicílio", intro: "Cuidado especializado, no conforto de casa.", category: "saude", icon: Stethoscope, items: ["Enfermagem e médicos", "Fisioterapia e massagens", "Apoio psicológico", "Personal trainers"] },
  { number: "04", title: "Gestão do Lar e Refeições", intro: "Mais tempo para si. Uma casa que respira.", category: "lar", icon: Home, items: ["Cozinheiras e meal prep", "Personal organizers", "Limpeza profunda", "Assistente de compras"] },
  { number: "05", title: "Burocracias", intro: "Nós tratamos do que não pode esperar.", category: "burocracias", icon: Clock3, items: ["Pendências diárias", "Filas", "Entregas urgentes"] },
];

function StoreCard({ store, productImages }: { store: any; productImages?: string[] }) {
  const fallbackImage = "https://images.unsplash.com/photo-1529603095155-15342c491f1a?w=400&h=300&fit=crop&auto=format&q=75";
  const images = (productImages && productImages.length > 0 ? productImages : (store.coverImages && store.coverImages.length > 0 ? store.coverImages : [store.coverImage || fallbackImage])).filter(Boolean);
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
      className="flex-shrink-0 w-48 rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow border border-[#e8eaed] cursor-pointer hover:-translate-y-1"
      onClick={() => window.location.href = `/loja/${store.id}?from=love-services`}
    >
      <div className="relative h-28 overflow-hidden">
        <img src={images[currentIdx] || fallbackImage} alt={store.name} className="w-full h-full object-cover" />
        {store.logoUrl && (
          <img src={store.logoUrl} alt="" className="absolute top-2 left-2 w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm z-20" />
        )}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 z-20 flex gap-1">
            {images.map((_: string, i: number) => (
              <button key={i} onClick={(e) => { e.stopPropagation(); setCurrentIdx(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIdx ? "bg-white w-3" : "bg-white/50"}`} />
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
        <h4 className="text-sm font-semibold text-[#30343a] truncate">{store.name}</h4>
        {store.description && <p className="text-[10px] text-[#87909a] mt-1 line-clamp-2">{store.description}</p>}
      </div>
    </div>
  );
}

export default function ExploreLove() {
  const [activeFilter, setActiveFilter] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("categoria");
    if (cat) {
      const group = LOVE_SERVICE_GROUPS.find((g) => g.title === cat);
      return group ? group.category : null;
    }
    return null;
  });
  const [activeProvince, setActiveProvince] = useState<string | null>(null);
  const [activeMunicipality, setActiveMunicipality] = useState<string | null>(null);

  const { data: stores = [] } = useQuery({
    queryKey: ["stores", "love-services"],
    queryFn: () => fetchStores({ storeType: "love-services" }),
    staleTime: 60_000,
  });

  const angolaProvinces: Record<string, string[]> = {
    "Bengo": ["Ambriz", "Bula", "Dembos", "N'dalatando", "São José das Matas"],
    "Benguela": ["Benguela", "Caimbambo", "Catumbela", "Chiley", "Baía Farta", "Lobito"],
    "Bié": ["Camacupa", "Catabola", "Chinguar", "Chitembo", "Cuito", "Andulo", "N'harea"],
    "Cabinda": ["Cabinda", "Cacongo", "Belize", "Buco-Zau"],
    "Cuando-Cubango": ["Calai", "Cuangar", "Curoca", "Mavinga", "Menongue", "Rivungo"],
    "Cuanza Norte": ["Ambaca", "Bolongongo", "Cazengo", "Golungo Alto", "Lucala", "Samba Cajù"],
    "Cuanza Sul": ["Amboim", "Cassongue", "Cela", "Conda", "Ebo", "Mussende", "Porto Amboim", "Quilenda", "Quirimbo"],
    "Cunene": ["Cahama", "Cuanhala", "Curoca", "Cuvelai", "Namacunde", "Ombadja"],
    "Huambo": ["Huambo", "Caála", "Ecunha", "Londuimbali", "Mungo", "Bailundo", "Ukuma", "Chipica"],
    "Huíla": ["Cacula", "Chibia", "Chinjenje", "Cuiva", "Cuvango", "Humpata", "Lubango", "Matala", "Quilengues", "Quipungo"],
    "Icolo e Bengo": ["Dondo", "Dembos", "Icolo e Bengo", "Catete"],
    "Luanda": ["Belas", "Cacuaco", "Cazenga", "Icolo e Bengo", "Kilamba Kiaxi", "Maianga", "Rangel", "Samba", "Talatona", "Viana"],
    "Lunda Norte": ["Caungula", "Cazombo", "Cambulo", "Capenda-Camulemba", "Catchiungo", "Chitato", "Cuango", "Luau", "Luremo"],
    "Lunda Sul": ["Dala", "Muconda", "Saurimo"],
    "Malanje": ["Cacuso", "Calandula", "Cambundi-Catembo", "Cangandala", "Caombo", "Cuaba Ndongu", "Luquembo", "Malanje", "Marimba", "Massango", "Mucari", "Quela", "Quiçama"],
    "Moxico": ["Alto Zambeze", "Bundas", "Luccala", "Cameia", "Moxico", "Nacu-Curo"],
    "Namibe": ["Bibala", "Lacuando", "Mossâmedes", "Namibe", "Tômbua", "Virei"],
    "Uíge": ["Alto Cauale", "Ambuíla", "Bembe", "Buengas", "Bungo", "Cassanje", "Cazombo", "Damba", "Milunga", "Mucaba", "Negage", "Puri", "Quimavunde", "Santa Comba Dao", "Songo", "Uíge", "Vimoque"],
    "Zaire": ["Cuimba", "Iombe", "M'banza-Kongo", "Nóqui", "Soyo", "Terras do Zaire"],
  };

  const provinces = Object.keys(angolaProvinces);
  const municipalities = activeProvince ? angolaProvinces[activeProvince] || [] : [];

  const getStoresForGroup = (category: string) => {
    const group = LOVE_SERVICE_GROUPS.find((g) => g.category === category);
    const matched = stores.filter((s: any) => {
      if (s.phone === "999999999") return false;
      const cat = (s.category || "").toLowerCase();
      const matchesCategory = (group && cat.includes(group.title.toLowerCase())) || cat.includes(category.replace(/-/g, " "));
      const matchesProvince = !activeProvince || s.province === activeProvince;
      const matchesMunicipality = !activeMunicipality || s.municipality === activeMunicipality;
      return matchesCategory && matchesProvince && matchesMunicipality;
    });
    return matched.map((store: any) => {
      const productImages: string[] = [];
      (store.products || []).forEach((p: any) => {
        const urls = typeof p.imageUrls === "string"
          ? p.imageUrls.split(" ").filter(Boolean)
          : Array.isArray(p.imageUrls) ? p.imageUrls : [];
        if (urls.length > 0) productImages.push(...urls);
        else if (p.imageUrl) productImages.push(p.imageUrl);
      });
      return { store, productImages };
    });
  };

  const filteredGroups = activeFilter
    ? LOVE_SERVICE_GROUPS.filter((g) => g.category === activeFilter)
    : LOVE_SERVICE_GROUPS;

  return (
    <main className="min-h-[100dvh] bg-[#fafafa] text-[#30343a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mx-auto max-w-[1380px] px-6 py-12 md:px-12">
        <button onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm text-[#68727c] hover:text-[#30343a] transition-colors mb-12">
          <ArrowLeft size={16} /> Voltar
        </button>

        <div className="mb-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#87909a]">Explorar serviços</p>
          <h1 className="mt-4 font-serif text-5xl tracking-[-0.03em] md:text-7xl">O nosso<br /><i>universo.</i></h1>
        </div>

        <div className="flex flex-wrap gap-3 mb-12">
          <button onClick={() => setActiveFilter(null)}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
              activeFilter === null ? "bg-[#2c3035] text-white" : "bg-[#e8eaed] text-[#68727c] hover:bg-[#d1d4d8]"
            }`}>Todos</button>
          {LOVE_SERVICE_GROUPS.map((group) => (
            <button key={group.category} onClick={() => setActiveFilter(activeFilter === group.category ? null : group.category)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                activeFilter === group.category ? "bg-[#2c3035] text-white" : "bg-[#e8eaed] text-[#68727c] hover:bg-[#d1d4d8]"
              }`}>{group.number} {group.title.split(",")[0].split(" e ")[0]}</button>
          ))}
        </div>

        {/* Filtro por província */}
        <div className="mb-6">
          <span className="text-xs uppercase tracking-[0.15em] text-[#87909a] mr-2">Província:</span>
          <select
            value={activeProvince || ""}
            onChange={(e) => { setActiveProvince(e.target.value || null); setActiveMunicipality(null); }}
            className="mt-2 md:hidden w-full px-4 py-3 rounded-xl text-sm border border-[#d1d4d8] bg-white text-[#30343a] outline-none"
          >
            <option value="">Todas</option>
            {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <div className="hidden md:flex flex-wrap gap-3 mt-2">
            <button onClick={() => { setActiveProvince(null); setActiveMunicipality(null); }}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                activeProvince === null ? "bg-[#68727c] text-white" : "bg-[#e8eaed] text-[#68727c] hover:bg-[#d1d4d8]"
              }`}>Todas</button>
            {provinces.map((province) => (
              <button key={province} onClick={() => { setActiveProvince(activeProvince === province ? null : province); setActiveMunicipality(null); }}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                  activeProvince === province ? "bg-[#68727c] text-white" : "bg-[#e8eaed] text-[#68727c] hover:bg-[#d1d4d8]"
                }`}>{province}</button>
            ))}
          </div>
        </div>

        {/* Filtro por município */}
        {municipalities.length > 0 && (
          <div className="mb-12">
            <span className="text-xs uppercase tracking-[0.15em] text-[#87909a] mr-2">Município:</span>
            <select value={activeMunicipality || ""} onChange={(e) => setActiveMunicipality(e.target.value || null)}
              className="mt-2 md:hidden w-full px-4 py-3 rounded-xl text-sm border border-[#d1d4d8] bg-white text-[#30343a] outline-none">
              <option value="">Todos</option>
              {municipalities.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <div className="hidden md:flex flex-wrap gap-3 mt-2">
              <button onClick={() => setActiveMunicipality(null)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                  activeMunicipality === null ? "bg-[#87909a] text-white" : "bg-[#e8eaed] text-[#68727c] hover:bg-[#d1d4d8]"
                }`}>Todos</button>
              {municipalities.map((m) => (
                <button key={m} onClick={() => setActiveMunicipality(activeMunicipality === m ? null : m)}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                    activeMunicipality === m ? "bg-[#87909a] text-white" : "bg-[#e8eaed] text-[#68727c] hover:bg-[#d1d4d8]"
                  }`}>{m}</button>
              ))}
            </div>
          </div>
        )}

        <div>
          {filteredGroups.map((group, i) => {
            const groupStores = getStoresForGroup(group.category);
            const allProducts: any[] = [];
            groupStores.forEach(({ store, productImages }: any) => {
              (store.products || []).forEach((p: any) => {
                allProducts.push({ ...p, storeName: store.name, storeId: store.id, productImages });
              });
            });
            return (
              <article key={group.number} className={`group border-t border-[#d1d4d8] py-8 md:py-12 ${i % 2 ? "md:ml-20" : ""}`}>
                <div className="grid gap-7 md:grid-cols-[100px_minmax(0,1fr)_minmax(260px,370px)] md:items-start">
                  <span className="font-mono text-xs tracking-[0.2em] text-[#89919a]">{group.number}</span>
                  <div>
                    <h3 className="max-w-xl font-serif text-3xl leading-[1.08] text-[#30343a] md:text-[2.8rem]">{group.title}</h3>
                    <p className="mt-4 max-w-md text-sm leading-7 text-[#686e76]">{group.intro}</p>
                    <ul className="mt-6 space-y-3 border-l border-[#d7dade] pl-5 text-sm leading-5 text-[#565d66]">
                      {group.items.map((item) => {
                        const itemProducts = allProducts.filter((p) => (p.subcategory || "").toLowerCase().includes(item.toLowerCase()));
                        return (
                          <li key={item}>
                            <div className="flex gap-3">
                              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#aeb6bf]" />
                              <div className="flex-1">
                                <span>{item}</span>
                                {itemProducts.length > 0 && (
                                  <div className="mt-1.5 ml-0 space-y-1">
                                    {itemProducts.map((p) => (
                                      <a key={p.id} href={`/loja/${p.storeId}?from=love-services`}
                                        className="flex items-center gap-2 text-[11px] text-[#87909a] hover:text-[#30343a] transition-colors">
                                        <span className="h-0.5 w-0.5 rounded-full bg-[#d96f5c] flex-shrink-0" />
                                        {p.name} {p.price ? <span className="text-[#aeb6bf]">· {p.currency === "USD" ? "$" : "Kz"} {p.price.toLocaleString("pt-AO")}</span> : null}
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    {groupStores.length > 0 && (
                      <button onClick={() => setActiveFilter(activeFilter === group.category ? null : group.category)}
                        className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#68727c] hover:text-[#30343a] transition-colors">
                        Ver mais
                      </button>
                    )}
                  </div>
                  <div className="mt-4 md:mt-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#87909a] mb-3">Lojas recentes</p>
                    {groupStores.length > 0 ? (
                      <div className="flex flex-col gap-3">
                        {groupStores.slice(0, 2).map(({ store, productImages }: any) => (
                          <StoreCard key={store.id} store={store} productImages={productImages} />
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-[#d1d4d8] p-6 text-center">
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

      <section className="relative overflow-hidden border-t border-[#cbd0d5] bg-[#2c3035] px-6 py-24 text-[#fafafa] md:px-12 md:py-32">
        <div className="relative mx-auto max-w-[1380px] md:flex md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#b9c1ca]">O primeiro passo</p>
            <h2 className="mt-5 max-w-2xl font-serif text-5xl leading-[1.02] md:text-7xl">Precisa de ajuda<br /><i>com algo especial?</i></h2>
          </div>
          <div className="mt-10 md:mt-0 md:w-80">
            <p className="text-sm leading-6 text-[#cbd0d5]">Conte-nos o que precisa. A nossa equipa responde com tempo, atenção e cuidado.</p>
            <div className="mt-7">
              <a href="https://wa.me/244922001778?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20Eliora%20Love%20Services." target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#d96f5c] text-white text-sm font-medium rounded-full hover:bg-[#c5614f] transition-colors">
                Falar connosco
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
