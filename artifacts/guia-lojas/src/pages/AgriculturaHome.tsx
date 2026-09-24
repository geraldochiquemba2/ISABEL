import { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchStores } from "@/lib/api";
import { ANGOLA_PROVINCES } from "@/data/angolaData";
import WhereSearch from "@/components/WhereSearch";
import type { Scope } from "@/components/WhereSearch";
import { norm } from "@/lib/locationIndex";
import {
  Heart, ChevronRight, Star, MapPin, Menu, X,
  ShieldCheck, BadgeCheck, CreditCard, HeadphonesIcon,
  Sprout, Egg, Wheat, Leaf, Tractor, Scissors, Fish, Handshake,
  Search,
} from "lucide-react";
import StoreCategorySection from "@/components/StoreCategorySection";

const CATEGORIES = [
  { id: "agricultura-producao", name: "Agricultura & Produção Agrícola", icon: <Sprout size={28} className="text-[#2E7D32]" /> },
  { id: "pecuaria-criacao", name: "Pecuária & Criação Animal", icon: <Egg size={28} className="text-[#2E7D32]" /> },
  { id: "produtores-fazendas", name: "Produtores & Fazendas", icon: <Wheat size={28} className="text-[#2E7D32]" /> },
  { id: "sementes-insumos", name: "Sementes Fertilizantes & Insumos", icon: <Leaf size={28} className="text-[#2E7D32]" /> },
  { id: "maquinas-equipamentos", name: "Máquinas & Equipamentos Agrícolas", icon: <Tractor size={28} className="text-[#2E7D32]" /> },
  { id: "avicultura", name: "Avicultura", icon: <Scissors size={28} className="text-[#2E7D32]" /> },
  { id: "pesca-aquicultura", name: "Pesca & Aquicultura", icon: <Fish size={28} className="text-[#2E7D32]" /> },
  { id: "produtos-agricolas", name: "Produtos Agrícolas", icon: <Sprout size={28} className="text-[#2E7D32]" /> },
  { id: "servicos-consultoria", name: "Serviços & Consultoria Agrícola", icon: <Handshake size={28} className="text-[#2E7D32]" /> },
];

const TRUST_BADGES = [
  { icon: <ShieldCheck size={18} />, label: "Produtores verificados" },
  { icon: <BadgeCheck size={18} />, label: "Qualidade garantida" },
  { icon: <CreditCard size={18} />, label: "Compra segura" },
  { icon: <HeadphonesIcon size={18} />, label: "Apoio ao cliente" },
];

export default function AgriculturaHome({ onBackToSelector }: { onBackToSelector?: () => void }) {
  useThemeColor("#e8f5e9");
  const [, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProvinceModal, setShowProvinceModal] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState("");

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ["stores", "agricultura-agronegocio"],
    queryFn: () => fetchStores({ storeType: "agricultura-agronegocio" }),
    staleTime: 60_000,
  });

  const nonAdmin = stores.filter((s: any) => s.phone !== "999999999");
  const featured = nonAdmin.filter((s: any) => s.isFeatured).slice(0, 6);
  const fallbackFeatured = !featured.length ? nonAdmin.slice(0, 6) : [];

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
    navigate(`/explorar-agricultura?` + params.toString());
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
      navigate(`/explorar-agricultura?${params.toString()}`);
      setShowProvinceModal(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#e8f5e9] text-[#1a3a1a] pb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .cat-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px; }
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-item { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 10px; background: white; border-radius: 14px; border: 1px solid #c8e6c9; min-width: 72px; cursor: pointer; transition: all 0.2s; }
        .cat-item:hover { border-color: #2E7D32; background: #f1f8e9; }
        .trust-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; }
        .trust-scroll::-webkit-scrollbar { display: none; }
        .trust-item { flex-shrink: 0; display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: white; border-radius: 12px; border: 1px solid #c8e6c9; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#e8f5e9]/95 backdrop-blur-md border-b border-[#c8e6c9]/60">
        <div className="flex items-center justify-between px-5 py-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
          <div className="flex flex-col items-center">
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 600, color: "#1a3a1a" }}>YESOLA</span>
            <span className="text-[9px] tracking-[0.25em] text-[#2E7D32] font-semibold uppercase mt-0.5">Agricultura & Agro-Negócio</span>
          </div>

        </div>
        {menuOpen && (
          <div className="bg-[#e8f5e9] border-t border-[#c8e6c9]/60 px-5 py-4 flex flex-col gap-3 text-sm font-medium">
            <button onClick={() => navigate("/login-agricultura")} className="py-2 text-left">Entrar</button>
            {onBackToSelector && <button onClick={onBackToSelector} className="py-2 text-left">Trocar loja</button>}
          </div>
        )}
      </header>

      {/* Categories */}
      <section className="px-5 pt-4 pb-2">
        <div className="cat-scroll">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => navigate(`/explorar-agricultura?categoria=${cat.id}`)} className="cat-item">
              <div className="w-10 h-10 flex items-center justify-center">{cat.icon}</div>
              <span className="text-[10px] font-medium text-[#1a3a1a] text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Hero */}
      <section className="px-5 py-4">
        <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: "240px" }}>
          <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=500&fit=crop&auto=format&q=80" alt="Agricultura" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />
          <div className="relative z-10 p-6 max-w-[60%]">
            <p className="text-[10px] tracking-[0.2em] text-[#2E7D32] font-semibold uppercase">Cultive o futuro.</p>
            <h1 className="text-[28px] leading-[1.1] font-semibold mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="text-[#2E7D32]">Agricultura</span> & Agro-Negócio.
            </h1>
            <p className="text-[12px] text-[#6B7280] mt-3 leading-relaxed">Descubra produtores, equipamentos e serviços agrícolas para impulsionar o seu negócio.</p>
            <button onClick={() => navigate("/explorar-agricultura")} className="mt-4 flex items-center gap-2 bg-[#2E7D32] text-white text-[12px] font-medium px-4 py-2.5 rounded-full hover:bg-[#1B5E20] transition-colors">
              Explorar serviços <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Province */}
      <section className="px-5 py-3">
        <button
          onClick={() => setShowProvinceModal(true)}
          className="w-full flex items-center gap-4 bg-white rounded-2xl px-4 py-4 border border-[#c8e6c9] hover:border-[#2E7D32] transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#e8f5e9] flex items-center justify-center"><MapPin size={18} className="text-[#2E7D32]" /></div>
          <div className="flex-1 text-left">
            <p className="text-[14px] font-semibold text-[#2E7D32]">
              {selectedProvince ? selectedProvince + (selectedMunicipality ? " · " + selectedMunicipality : "") : "Em todas as províncias de Angola"}
            </p>
            <p className="text-[11px] text-[#6B7280]">Oportunidades agrícolas perto de si, onde estiver.</p>
          </div>
          <ChevronRight size={18} className="text-[#2E7D32]" />
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
              <WhereSearch onScope={handleScopeSelect} onClear={handleScopeClear} accent="#2E7D32" />
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
                <h4 className="text-xs font-semibold text-[#6F7780] uppercase tracking-wider mb-2">Província</h4>
                <div className="space-y-1 max-h-[50vh] overflow-y-auto">
                  {filteredProvinces.length === 0 && (
                      <p className="px-3 py-4 text-sm text-gray-500 text-center">Nenhuma província encontrada.</p>
                    )}
                    {filteredProvinces.map((province) => (
                    <button
                      key={province.id}
                      onClick={() => { setSelectedProvince(province.name); setSelectedMunicipality(null); }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        selectedProvince === province.name ? "bg-[#2E7D32] text-white font-medium" : "hover:bg-[#e8f5e9] text-[#171717]"
                      }`}
                    >
                      {province.name}
                    </button>
                  ))}
                </div>
              </div>
              {selectedProvince && municipalities.length > 0 && (
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-[#6F7780] uppercase tracking-wider mb-2">Município</h4>
                  <div className="space-y-1 max-h-[50vh] overflow-y-auto">
                    {filteredMunicipalities.length === 0 && (
                          <p className="px-3 py-4 text-sm text-gray-500 text-center">Nenhum município encontrado.</p>
                        )}
                        {filteredMunicipalities.map((municipality) => (
                      <button
                        key={municipality}
                        onClick={() => setSelectedMunicipality(municipality)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          selectedMunicipality === municipality ? "bg-[#2E7D32] text-white font-medium" : "hover:bg-[#e8f5e9] text-[#171717]"
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
                className="w-full mt-6 bg-[#2E7D32] text-white py-3 rounded-xl font-medium hover:bg-[#1B5E20] transition-colors"
              >
                {selectedMunicipality ? `Explorar em ${selectedMunicipality}` : `Explorar em ${selectedProvince}`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Featured Stores */}
      {(featured.length > 0 || fallbackFeatured.length > 0) && (
        <section className="px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] font-semibold text-[#1a3a1a]">Lojas em destaque</h2>
            <button onClick={() => navigate("/explorar-agricultura")} className="text-[12px] font-medium text-[#2E7D32] flex items-center gap-1">
              Ver todas <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
            {(featured.length > 0 ? featured : fallbackFeatured).map((store: any) => (
              <div key={store.id} className="flex-shrink-0 w-44 bg-white rounded-2xl overflow-hidden border border-[#c8e6c9] cursor-pointer" onClick={() => window.location.href = `/loja/${store.id}?from=agricultura`}>
                <div className="h-28 overflow-hidden">
                  <img src={store.coverImage || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop&auto=format&q=80"} alt={store.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h4 className="text-[13px] font-semibold text-[#1a3a1a] truncate">{store.name}</h4>
                  <p className="text-[10px] text-[#6B7280] mt-0.5">{store.category}</p>
                  {store.province && (
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin size={10} className="text-[#6B7280]" />
                      <span className="text-[10px] text-[#6B7280]">{store.province}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Stores by Category */}
      {isLoading ? (
        <div className="px-5 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-4 w-32 bg-gray-200 rounded mb-3 animate-pulse" />
              <div className="flex gap-3">{[1, 2].map((j) => <div key={j} className="flex-shrink-0 w-44 h-44 rounded-2xl bg-gray-200 animate-pulse" />)}</div>
            </div>
          ))}
        </div>
      ) : (
        <StoreCategorySection categories={CATEGORIES} stores={stores} storeType="agricultura-agronegocio" exploreRoute="/explorar-agricultura" />
      )}

      {/* Counter */}
      <section className="px-5 py-3">
        <div className="flex items-center justify-center gap-2 bg-[#e8f5e9] rounded-2xl px-4 py-3 border border-[#c8e6c9]">
          <Heart size={16} className="text-[#2E7D32]" />
          <span className="text-[13px] font-medium text-[#1a3a1a]">Mais de <span className="text-[#2E7D32] font-bold">+2.000</span> produtores e agricultores conectados.</span>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="px-5 py-3">
        <div className="trust-scroll">
          {TRUST_BADGES.map((badge, i) => (
            <div key={i} className="trust-item">
              <span className="text-[#2E7D32]">{badge.icon}</span>
              <span className="text-[11px] font-medium text-[#1a3a1a]">{badge.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center py-6 px-5">
        <p className="text-[11px] text-[#9CA3AF]">YESOLA AGRICULTURA · ALIMENTANDO O FUTURO.</p>
      </div>
    </div>
  );
}
