import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowUpRight, Mail, Phone, Instagram } from "lucide-react";

type CollectionGroup = {
  number: string;
  title: string;
  intro: string;
  items: string[];
  category: string;
};

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

const groups: CollectionGroup[] = [
  {
    number: "01",
    title: "Moda Feminina",
    intro: "Vestuário, acessórios e looks para todas as ocasiões.",
    items: ["Vestidos & Saias", "Blusas & Camisas", "Calças & Jeans", "Casacos & Jaquetas", "Acessórios Femininos"],
    category: "moda-feminina",
  },
  {
    number: "02",
    title: "Moda Masculina",
    intro: "Estilo e conforto para o homem moderno.",
    items: ["Camisas & Polos", "Calças & Berendas", "Casacos & Trajes", "Calçado Masculino", "Acessórios Masculinos"],
    category: "moda-masculina",
  },
  {
    number: "03",
    title: "Moda Infantil",
    intro: "Vestuário divertido e confortável para os pequenos.",
    items: ["Roupas para Bebés", "Vestuário Infantil (2-10 anos)", "Calçado Infantil", "Acessórios Infantis", "Kits de Enxoval"],
    category: "moda-infantil",
  },
  {
    number: "04",
    title: "Saúde & Beleza",
    intro: "Produtos e cuidados para realçar a vossa beleza natural.",
    items: ["Skincare & Tratamentos", "Maquilhagem", "Perfumes & Fragrâncias", "Cabelo & Penteados", "Produtos Capilares"],
    category: "beleza-saude",
  },
  {
    number: "05",
    title: "Perucas",
    intro: "Perucas e adições capilares de alta qualidade.",
    items: ["Perucas Naturais", "Perucas Sintéticas", "Adições & Mechas", "Acessórios para Perucas", "Manutenção & Cuidados"],
    category: "perucas",
  },
  {
    number: "06",
    title: "Eletrônicos",
    intro: "Tecnologia e gadgets para o dia a dia.",
    items: ["Smartphones & Tablets", "Acessórios Tech", "Áudio & Fones", "Computadores", "Wearables & Gadgets"],
    category: "eletronicos",
  },
  {
    number: "07",
    title: "Casa & Decoração",
    intro: "Tudo para tornar a vossa casa mais acolhedora.",
    items: ["Mobiliário", "Decoração & Objetos", "Iluminação", "Têxteis & Roupa de Cama", "Utensílios de Cozinha"],
    category: "casa-decoracao",
  },
  {
    number: "08",
    title: "Alimentação",
    intro: "Sabores e productos para todos os gostos.",
    items: ["Restaurantes & Take-away", "Bolos & Pastelaria", "Bebidas & Distribuidoras", "Supermercados", "Orgânicos & Naturais"],
    category: "alimentacao",
  },
];

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

function StoreCard({ store, productImages }: { store: Store; productImages?: string[] }) {
  const fallbackImage = "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop&auto=format&q=75";
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
      className="flex-shrink-0 w-48 rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow border border-[#e8eaed] cursor-pointer hover:-translate-y-1"
      onClick={() => window.location.href = `/loja/${store.id}?from=collection`}
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
            {images.map((_, i) => (
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
        <h4 className="text-sm font-semibold text-[#30343a] truncate">{store.name}</h4>
        {store.description && (
          <p className="text-[10px] text-[#87909a] mt-1 line-clamp-2">{store.description}</p>
        )}
      </div>
    </div>
  );
}

export default function ExploreCollection() {
  const [activeFilter, setActiveFilter] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("categoria");
  });
  const [activeProvince, setActiveProvince] = useState<string | null>(null);
  const [activeMunicipality, setActiveMunicipality] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("categoria");
    if (cat) setActiveFilter(cat);
  }, []);

  const { data: stores = [] } = useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      const res = await fetch("/api/stores");
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60_000,
  });

  const provinces = Object.keys(angolaProvinces);
  const municipalities = activeProvince ? angolaProvinces[activeProvince] || [] : [];

  const getStoresForGroup = (category: string) => {
    const matched = stores.filter((s: Store) => {
      const cat = (s.category || "").toLowerCase();
      const group = groups.find((g) => g.category === category);
      const matchesCategory = cat.includes(category.replace(/-/g, " ")) || (group && cat.includes(group.title.toLowerCase()));
      const matchesProvince = !activeProvince || s.province === activeProvince;
      const matchesMunicipality = !activeMunicipality || s.municipality === activeMunicipality;
      return matchesCategory && matchesProvince && matchesMunicipality;
    });
    return matched.map((store) => {
      const productImages: string[] = [];
      (store.products || []).forEach((p) => {
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
    ? groups.filter((g) => g.category === activeFilter)
    : [...groups].sort((a, b) => getStoresForGroup(b.category).length - getStoresForGroup(a.category).length);

  return (
    <main className="min-h-[100dvh] bg-[#fafafa] text-[#30343a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap');
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 bg-[#fafafa]/95 backdrop-blur-md border-b border-[#d9dde1]/60">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between px-6 py-4 md:px-12">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm text-[#68727c] hover:text-[#30343a] transition-colors">
            <ArrowLeft size={16} /> Voltar
          </button>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", letterSpacing: "-.02em", color: "#2d2c2b" }}>YESOLA<small style={{ display: "block", color: "#D4A843", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: ".23em", fontSize: "8px", marginTop: "2px" }}>Collection</small></span>
          <a href="/explorar" className="text-xs font-bold uppercase tracking-[0.14em] text-[#68727c] hover:text-[#c9a84c] transition-colors hidden md:block">Explorar</a>
        </div>
      </header>

      <div className="mx-auto max-w-[1380px] px-6 pt-28 pb-12 md:px-12">

        <div className="mb-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#87909a]">Explorar lojas</p>
          <h1 className="mt-4 font-serif text-5xl tracking-[-0.03em] md:text-7xl">O nosso<br /><i>universo.</i></h1>
        </div>

        <div className="flex flex-wrap gap-3 mb-12">
          <button
            onClick={() => setActiveFilter(null)}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
              activeFilter === null
                ? "bg-[#2c3035] text-white"
                : "bg-[#e8eaed] text-[#68727c] hover:bg-[#d1d4d8]"
            }`}
          >
            Todos
          </button>
          {groups.map((group) => (
            <button
              key={group.category}
              onClick={() => setActiveFilter(activeFilter === group.category ? null : group.category)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                activeFilter === group.category
                  ? "bg-[#2c3035] text-white"
                  : "bg-[#e8eaed] text-[#68727c] hover:bg-[#d1d4d8]"
              }`}
            >
              {group.number} {group.title.split(",")[0].split(" e ")[0]}
            </button>
          ))}
        </div>

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
            <button
              onClick={() => { setActiveProvince(null); setActiveMunicipality(null); }}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                activeProvince === null
                  ? "bg-[#68727c] text-white"
                  : "bg-[#e8eaed] text-[#68727c] hover:bg-[#d1d4d8]"
              }`}
            >
              Todas
            </button>
            {provinces.map((province) => (
              <button
                key={province}
                onClick={() => { setActiveProvince(activeProvince === province ? null : province); setActiveMunicipality(null); }}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                  activeProvince === province
                    ? "bg-[#68727c] text-white"
                    : "bg-[#e8eaed] text-[#68727c] hover:bg-[#d1d4d8]"
                }`}
              >
                {province}
              </button>
            ))}
          </div>
        </div>

        {municipalities.length > 0 && (
          <div className="mb-12">
            <span className="text-xs uppercase tracking-[0.15em] text-[#87909a] mr-2">Município:</span>
            <select
              value={activeMunicipality || ""}
              onChange={(e) => setActiveMunicipality(e.target.value || null)}
              className="mt-2 md:hidden w-full px-4 py-3 rounded-xl text-sm border border-[#d1d4d8] bg-white text-[#30343a] outline-none"
            >
              <option value="">Todos</option>
              {municipalities.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <div className="hidden md:flex flex-wrap gap-3 mt-2">
              <button
                onClick={() => setActiveMunicipality(null)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                  activeMunicipality === null
                    ? "bg-[#87909a] text-white"
                    : "bg-[#e8eaed] text-[#68727c] hover:bg-[#d1d4d8]"
                }`}
              >
                Todos
              </button>
              {municipalities.map((m) => (
                <button
                  key={m}
                  onClick={() => setActiveMunicipality(activeMunicipality === m ? null : m)}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.15em] transition-all ${
                    activeMunicipality === m
                      ? "bg-[#87909a] text-white"
                      : "bg-[#e8eaed] text-[#68727c] hover:bg-[#d1d4d8]"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          {filteredGroups.map((group, i) => (
            <article key={group.number} className={`group border-t border-[#d1d4d8] py-8 md:py-12 ${i % 2 ? "md:ml-20" : ""}`}>
              <div className="grid gap-7 md:grid-cols-[100px_minmax(0,1fr)_minmax(260px,370px)] md:items-start">
                <span className="font-mono text-xs tracking-[0.2em] text-[#89919a]">{group.number}</span>
                <div>
                  <h3 className="max-w-xl font-serif text-3xl leading-[1.08] text-[#30343a] md:text-[2.8rem]">{group.title}</h3>
                  <p className="mt-4 max-w-md text-sm leading-7 text-[#686e76]">{group.intro}</p>
                   <ul className="mt-6 space-y-3 border-l border-[#d7dade] pl-5 text-sm leading-5 text-[#565d66]">
                     {group.items.map((item) => (
                       <li key={item}>
                         <a
                           href={`/explorar?categoria=${group.category}`}
                           className={`flex gap-3 transition-transform duration-300 group-hover:translate-x-1 cursor-pointer ${
                             activeFilter === group.category ? "text-[#30343a] font-medium" : "hover:text-[#30343a]"
                           }`}
                         >
                           <span className={`mt-2 h-1 w-1 shrink-0 rounded-full ${activeFilter === group.category ? "bg-[#30343a]" : "bg-[#aeb6bf]"}`} />{item}
                         </a>
                       </li>
                     ))}
                   </ul>
                  {getStoresForGroup(group.category).length > 0 && (
                    <button
                      onClick={() => setActiveFilter(activeFilter === group.category ? null : group.category)}
                      className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#68727c] hover:text-[#30343a] transition-colors"
                    >
                      Ver mais <ArrowUpRight size={14} />
                    </button>
                  )}
                </div>
                <div className="mt-4 md:mt-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#87909a] mb-3">Lojas recentes</p>
                  {getStoresForGroup(group.category).length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {getStoresForGroup(group.category).slice(0, 2).map(({ store, productImages }) => (
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
          ))}
        </div>
      </div>

      <section className="relative overflow-hidden border-t border-[#cbd0d5] bg-[#2c3035] px-6 py-24 text-[#fafafa] md:px-12 md:py-32">
        <div className="absolute -right-16 -top-24 h-96 w-96 rounded-full border border-[#e4e7ea]/20" />
        <div className="absolute -right-4 -top-12 h-72 w-72 rounded-full border border-[#e4e7ea]/15" />
        <div className="relative mx-auto max-w-[1380px] md:flex md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#b9c1ca]">O primeiro passo</p>
            <h2 className="mt-5 max-w-2xl font-serif text-5xl leading-[1.02] md:text-7xl">Encontre o que<br /><i>procurais.</i></h2>
          </div>
          <div className="mt-10 md:mt-0 md:w-80">
            <p className="text-sm leading-6 text-[#cbd0d5]">Contem-nos o que procuram. A nossa equipa responde com tempo, atenção e as melhores opções.</p>
            <div className="mt-7 flex items-center gap-4">
              <a href="https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20YESOLA%20Collection%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#e3e7eb] hover:text-white transition-colors">
                <Phone size={14} /> Ligar
              </a>
              <a href="https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20YESOLA%20Collection%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#e3e7eb] hover:text-white transition-colors">
                <Mail size={14} /> Email
              </a>
              <a href="https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20YESOLA%20Collection%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#e3e7eb] hover:text-white transition-colors">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1380px] flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-12 bg-[#fafafa]">
        <div className="flex items-center gap-3">
          <img src="/logo-yesola-icon-dark.png" alt="YESOLA Collection" className="w-8 h-8" />
          <span className="font-serif text-lg tracking-[0.08em] text-[#2d2c2b]">YESOLA <i className="font-normal">Collection</i></span>
        </div>
        <p className="text-xs text-[#747b84]">Tudo o que procurais, encontrais aqui.</p>
        <div className="flex items-center gap-5 text-[#747b84]">
          <a href="https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20YESOLA%20Collection%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><Mail size={16} /></a>
          <a href="https://wa.me/244922001778?text=Ol%C3%A1%2C%20vim%20pela%20YESOLA%20Collection%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><Phone size={16} /></a>

          <span className="font-mono text-[10px] tracking-[0.2em]">© 2024 YESOLA</span>
        </div>
      </footer>
    </main>
  );
}
