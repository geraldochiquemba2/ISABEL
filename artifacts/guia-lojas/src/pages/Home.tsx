import { useMemo, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useQuery } from "@tanstack/react-query";
import { fetchStores } from "@/lib/api";
import { Store } from "@/data/mock";
import { ANGOLA_PROVINCES } from "@/data/angolaData";
import WhereSearch from "@/components/WhereSearch";
import type { Scope } from "@/components/WhereSearch";
import { norm } from "@/lib/locationIndex";
import {
  Heart, ShoppingBag, ChevronRight, Star, MapPin, Menu, X, Search,
  Shirt, Watch, Footprints, Gem, Briefcase, Baby, Sparkles, Smartphone, Home as HomeIcon, UtensilsCrossed,
} from "lucide-react";

function StoreCard({ store, from }: { store: Store; from: string }) {
  const fallbackImage = "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop&auto=format&q=75";
  const images = store.coverImages && store.coverImages.length > 0
    ? store.coverImages
    : [store.coverImage || fallbackImage];
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => setCurrentIdx((prev) => (prev + 1) % images.length), 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="flex-shrink-0 w-44 rounded-2xl overflow-hidden bg-white shadow-md border border-[#E9D9B6] cursor-pointer hover:-translate-y-1 transition-all relative group" onClick={() => window.location.href = `/loja/${store.id}?from=${from}`}>
      <div className="relative h-28 overflow-hidden">
        <img src={images[currentIdx] || fallbackImage} alt={store.name} className="w-full h-full object-cover" />
        {store.logoUrl && <img src={store.logoUrl} alt="" className="absolute top-2 left-2 w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm z-20" />}
        
        {/* Botão de Partilha no Card */}
        <button
          onClick={async (e) => {
            e.stopPropagation();
            const url = `${window.location.origin}/loja/${store.id}?from=${from}`;
            const shareData = {
              title: store.name,
              text: `Conheça a loja ${store.name} no Guia de Lojas!`,
              url: url,
            };
            if (navigator.share) {
              try {
                await navigator.share(shareData);
              } catch (err) {}
            } else {
              navigator.clipboard.writeText(url);
              alert("Link da loja copiado!");
            }
          }}
          className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-sm z-30 transition-transform hover:scale-110"
          title="Partilhar loja"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/>
            <circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </button>

        {store.isOpen !== undefined && (
          <span className={`absolute top-2 right-2 text-[9px] font-semibold px-2 py-0.5 rounded-full z-20 ${store.isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
            {store.isOpen ? "Aberto" : "Fechado"}
          </span>
        )}
      </div>
      <div className="p-3">
        <h4 className="text-sm font-semibold text-[#171717] truncate">{store.name}</h4>
        {store.description && <p className="text-[10px] text-[#77736D] mt-1 line-clamp-2">{store.description}</p>}

      </div>
    </div>
  );
}

const CATEGORIES = [
  { id: "moda-feminina", name: "Moda Feminina", icon: <Shirt size={24} className="text-[#D8B532]" /> },
  { id: "moda-masculina", name: "Moda Masculina", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D8B532" strokeWidth="1.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /></svg> },
  { id: "moda-infantil", name: "Moda Infantil", icon: <Baby size={24} className="text-[#D8B532]" /> },
  { id: "calcado", name: "Calçado", icon: <Footprints size={24} className="text-[#D8B532]" /> },
  { id: "bolsas-acessorios", name: "Bolsas & Acessórios", icon: <Briefcase size={24} className="text-[#D8B532]" /> },
  { id: "joias-bijutarias", name: "Jóias & Bijutarias", icon: <Gem size={24} className="text-[#D8B532]" /> },
  { id: "beleza-bem-estar", name: "Beleza & Bem-Estar", icon: <Sparkles size={24} className="text-[#D8B532]" /> },
  { id: "tecnologia-eletronicos", name: "Tecnologia", icon: <Smartphone size={24} className="text-[#D8B532]" /> },
  { id: "casa-servicos", name: "Casa & Serviços", icon: <HomeIcon size={24} className="text-[#D8B532]" /> },
  { id: "alimentacao-restauracao", name: "Alimentação", icon: <UtensilsCrossed size={24} className="text-[#D8B532]" /> },
];

export default function Home({ onBackToSelector }: { onBackToSelector?: () => void }) {
  useThemeColor("#FBF7EC");
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProvinceModal, setShowProvinceModal] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState("");

  const municipalities = selectedProvince
    ? ANGOLA_PROVINCES.find((p) => p.name === selectedProvince)?.municipalities || []
    : [];

  const filteredProvinces = ANGOLA_PROVINCES.filter(
    (pr) => !locationFilter.trim() || norm(pr.name).includes(norm(locationFilter))
  );
  const filteredMunicipalities = municipalities.filter(
    (mun) => !locationFilter.trim() || norm(mun).includes(norm(locationFilter))
  );

  const handleScopeSelect = (scope: Scope) => {
    try {
      localStorage.setItem("eliora-location-scope", JSON.stringify(scope));
    } catch {
      /* armazenamento indisponivel */
    }
    const params = new URLSearchParams();
    params.set("provincia", scope.province);
    if (scope.municipality) params.set("municipio", scope.municipality);
    if (scope.kind === "nearby" && scope.locality) params.set("localidade", scope.locality);
    params.set("scope", scope.kind);
    setLocation(`/explorar?` + params.toString());
    setShowProvinceModal(false);
  };

  const handleScopeClear = () => {
    try {
      localStorage.removeItem("eliora-location-scope");
    } catch {
      /* armazenamento indisponivel */
    }
  };

  const handleProvinceSelect = () => {
    if (selectedProvince) {
      const params = new URLSearchParams();
      params.set("provincia", selectedProvince);
      if (selectedMunicipality) params.set("municipio", selectedMunicipality);
      setLocation(`/explorar?` + params.toString());
      setShowProvinceModal(false);
    }
  };

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ["stores", "collection"],
    queryFn: () => fetchStores({ storeType: "collection" }),
    staleTime: 60_000,
  });

  const nonAdmin = useMemo(() => stores.filter((s: Store) => s.phone !== "999999999"), [stores]);
  const featured = useMemo(() => nonAdmin.filter((s: Store) => s.isFeatured).slice(0, 6), [nonAdmin]);
  const fallbackFeatured = useMemo(() => !featured.length ? nonAdmin.slice(0, 6) : [], [featured, nonAdmin]);

  return (
    <div className="min-h-[100dvh] bg-[#FBF7EC] text-[#171717] pb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .cat-scroll { display: flex; gap: 10px; overflow-x: auto; scrollbar-width: none; padding: 0 20px; }
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-item { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 14px 12px; background: white; border-radius: 16px; border: 1px solid #E9D9B6; min-width: 80px; cursor: pointer; transition: all 0.2s; }
        .cat-item:hover { border-color: #D8B532; background: #E9D9B6; }
        .store-scroll { display: flex; gap: 12px; overflow-x: auto; scrollbar-width: none; padding-bottom: 8px; }
        .store-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FBF7EC]/95 backdrop-blur-md border-b border-[#E9D9B6]/60">
        <div className="flex items-center justify-between px-5 py-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">
            {menuOpen ? <X size={22} color="#171717" /> : <Menu size={22} color="#171717" />}
          </button>
          <div className="flex flex-col items-center">
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 600, color: "#171717", letterSpacing: "-.02em" }}>YESOLA</span>
            <span className="text-[9px] tracking-[0.25em] text-[#D8B532] font-medium uppercase mt-0.5">COLLECTION</span>
          </div>
        </div>
        {menuOpen && (
          <div className="bg-[#FBF7EC] border-t border-[#E9D9B6]/60 px-5 py-4 flex flex-col gap-3 text-sm font-medium text-[#171717]">
            <a href="/login" className="py-2">Entrar</a>
            {onBackToSelector && <button onClick={onBackToSelector} className="py-2 text-left">Trocar loja</button>}
          </div>
        )}
      </header>

      {/* Categories */}
      <section className="py-4">
        <div className="cat-scroll">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => setLocation(`/explorar?categoria=${cat.id}`)} className="cat-item">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-[#E9D9B6]">
                {cat.icon}
              </div>
              <span className="text-[11px] font-medium text-[#171717] text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Hero */}
      <section className="relative px-5 py-4 overflow-hidden">
        <div className="relative rounded-2xl overflow-hidden bg-[#FFFFFF] border border-[#E9D9B6] p-5" style={{ minHeight: "180px" }}>
          <div className="relative z-10 max-w-[55%]">
            <h1 className="text-[26px] leading-[1.1] font-semibold text-[#171717]" style={{ fontFamily: "'Playfair Display', serif" }}>
              ESTILO QUE FAZ<br />PARTE <span className="text-[#D8B532]">DE SI.</span>
            </h1>
            <p className="text-[12px] text-[#77736D] mt-3 leading-relaxed">
              Descubra as melhores lojas de moda, calçado e acessórios da sua província.
            </p>
            <button onClick={() => setLocation("/explorar")} className="mt-4 flex items-center gap-2 bg-[#D8B532] text-white text-[12px] font-medium px-4 py-2.5 rounded-full hover:bg-[#B8962A] transition-colors">
              Explorar coleção <ChevronRight size={14} />
            </button>
          </div>
          <div className="absolute right-0 top-0 w-[45%] h-full">
            <img src="https://images.unsplash.com/photo-1611432579699-484f7990b127?w=500&h=400&fit=crop&auto=format&q=80" alt="Moda elegante" className="w-full h-full object-cover object-top rounded-r-2xl" style={{ maskImage: "linear-gradient(to left, black 60%, transparent 100%)", WebkitMaskImage: "linear-gradient(to left, black 60%, transparent 100%)" }} />
          </div>
        </div>
      </section>

      {/* Province */}
      <section className="px-5 py-3">
        <button
          onClick={() => setShowProvinceModal(true)}
          className="w-full flex items-center gap-4 bg-white rounded-2xl px-4 py-4 border border-[#E9D9B6] hover:border-[#D8B532] transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#FBF7EC] flex items-center justify-center border border-[#E9D9B6]"><MapPin size={18} className="text-[#D8B532]" /></div>
          <div className="flex-1 text-left">
            <p className="text-[14px] font-semibold text-[#D8B532]">
              {selectedProvince ? selectedProvince + (selectedMunicipality ? " · " + selectedMunicipality : "") : "Em todas as províncias de Angola"}
            </p>
            <p className="text-[11px] text-[#77736D]">Encontre as melhores lojas de moda perto de si.</p>
          </div>
          <ChevronRight size={18} className="text-[#D8B532]" />
        </button>
      </section>

      {/* Province Selection Modal */}
      {showProvinceModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center" onClick={() => setShowProvinceModal(false)}>
          <div className="bg-white rounded-t-3xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#171717]">Escolha a sua localização</h3>
              <button onClick={() => setShowProvinceModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            </div>
            <div className="mb-4">
              <WhereSearch onScope={handleScopeSelect} onClear={handleScopeClear} accent="#D8B532" />
            </div>
            <div className="relative mb-2">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="Pesquisar província ou município..."
                className="w-full border border-gray-200 rounded-xl bg-gray-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-gray-400 placeholder:text-gray-400"
              />
            </div>
            <p className="text-[11px] text-gray-500 mb-3">Pesquise por bairro/localidade acima, ou escolha manualmente abaixo:</p>
            <div className="flex gap-4">
              <div className="flex-1">
                <h4 className="text-xs font-semibold text-[#77736D] uppercase tracking-wider mb-2">Província</h4>
                <div className="space-y-1 max-h-[50vh] overflow-y-auto">
                  {filteredProvinces.length === 0 && (
                      <p className="px-3 py-4 text-sm text-gray-500 text-center">Nenhuma província encontrada.</p>
                    )}
                    {filteredProvinces.map((province) => (
                    <button
                      key={province.id}
                      onClick={() => { setSelectedProvince(province.name); setSelectedMunicipality(null); }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        selectedProvince === province.name ? "bg-[#D8B532] text-white font-medium" : "hover:bg-[#FBF7EC] text-[#171717]"
                      }`}
                    >
                      {province.name}
                    </button>
                  ))}
                </div>
              </div>
              {selectedProvince && municipalities.length > 0 && (
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-[#77736D] uppercase tracking-wider mb-2">Município</h4>
                  <div className="space-y-1 max-h-[50vh] overflow-y-auto">
                    {filteredMunicipalities.length === 0 && (
                          <p className="px-3 py-4 text-sm text-gray-500 text-center">Nenhum município encontrado.</p>
                        )}
                        {filteredMunicipalities.map((municipality) => (
                      <button
                        key={municipality}
                        onClick={() => setSelectedMunicipality(municipality)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          selectedMunicipality === municipality ? "bg-[#D8B532] text-white font-medium" : "hover:bg-[#FBF7EC] text-[#171717]"
                        }`}
                      >
                        {municipality}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {selectedProvince && (
              <button
                onClick={handleProvinceSelect}
                className="w-full mt-6 bg-[#D8B532] text-white py-3 rounded-xl font-medium hover:bg-[#B8962A] transition-colors"
              >
                {selectedMunicipality ? `Explorar em ${selectedMunicipality}` : `Explorar em ${selectedProvince}`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <section className="px-5 py-3 space-y-3">
        <button onClick={() => setLocation("/consultores-estilo")} className="w-full flex items-center gap-4 bg-white rounded-2xl px-4 py-4 border border-[#E9D9B6] hover:border-[#D8B532]/30 transition-all">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-[#E9D9B6]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D8B532" strokeWidth="1.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><circle cx="9" cy="9" r="1" fill="#D8B532" /><circle cx="15" cy="9" r="1" fill="#D8B532" /></svg>
          </div>
          <div className="text-left flex-1">
            <p className="text-[14px] font-semibold text-[#171717]">Quero conhecer o meu estilo</p>
            <p className="text-[11px] text-[#77736D]">Descubra o seu estilo com especialistas.</p>
          </div>
          <ChevronRight size={18} className="text-[#D8B532]" />
        </button>
        <button onClick={() => setLocation("/carrinhos")} className="w-full flex items-center gap-4 bg-white rounded-2xl px-4 py-4 border border-[#E9D9B6] hover:border-[#D8B532]/30 transition-all">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-[#E9D9B6]">
            <ShoppingBag size={20} className="text-[#D8B532]" />
          </div>
          <div className="text-left flex-1">
            <p className="text-[14px] font-semibold text-[#171717]">Ver carrinhos Shein, Zara e outros</p>
            <p className="text-[11px] text-[#77736D]">Inspire-se e encontre os melhores looks.</p>
          </div>
          <ChevronRight size={18} className="text-[#D8B532]" />
        </button>
      </section>

      {/* Featured Stores */}
      <section className="px-5 py-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[17px] font-semibold text-[#171717]">Lojas em destaque</h2>
          <button onClick={() => setLocation("/explorar")} className="text-[13px] text-[#D8B532] font-medium flex items-center gap-1">Ver todas <ChevronRight size={14} /></button>
        </div>
        {isLoading ? (
          <div className="store-scroll">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="flex-shrink-0 w-44 h-48 rounded-2xl bg-gray-200 animate-pulse" />)}</div>
        ) : (featured.length > 0 ? featured : fallbackFeatured).length > 0 ? (
          <div className="store-scroll">{(featured.length > 0 ? featured : fallbackFeatured).map((store: Store) => <StoreCard key={store.id} store={store} from="collection" />)}</div>
        ) : (
          <p className="text-sm text-[#9CA3AF] text-center py-6">Nenhuma loja disponível de momento.</p>
        )}
      </section>
    </div>
  );
}
