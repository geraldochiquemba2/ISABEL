import { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchStores } from "@/lib/api";
import { useHomeCategories } from "@/lib/useVerticalGroups";
import { ANGOLA_PROVINCES } from "@/data/angolaData";
import WhereSearch from "@/components/WhereSearch";
import type { Scope } from "@/components/WhereSearch";
import { norm } from "@/lib/locationIndex";
import {
  Heart, ChevronRight, MapPin, Menu, X,
  ShieldCheck, BadgeCheck, CreditCard, HeadphonesIcon,
  Landmark, Banknote, MapPinned, TrendingUp, ArrowLeftRight,
  Search,
} from "lucide-react";
import StoreCategorySection from "@/components/StoreCategorySection";
import { thumbUrl } from "@/lib/img";

const CATEGORIES_META = [
  { id: "contas-cartoes", name: "Contas & Cartões", icon: <Landmark size={28} className="text-[#1E40AF]" /> },
  { id: "credito-financiamento", name: "Crédito & Financiamento", icon: <Banknote size={28} className="text-[#1E40AF]" /> },
  { id: "balcoes-atm", name: "Balcões & ATM", icon: <MapPinned size={28} className="text-[#1E40AF]" /> },
  { id: "investimentos", name: "Investimentos", icon: <TrendingUp size={28} className="text-[#1E40AF]" /> },
  { id: "transferencias", name: "Transferências", icon: <ArrowLeftRight size={28} className="text-[#1E40AF]" /> },
];

const TRUST_BADGES = [
  { icon: <ShieldCheck size={18} />, label: "Bancos\nverificados" },
  { icon: <BadgeCheck size={18} />, label: "Crédito\nresponsável" },
  { icon: <CreditCard size={18} />, label: "Contas\nsem complicação" },
  { icon: <HeadphonesIcon size={18} />, label: "Apoio ao cliente" },
];

export default function BancosHome({ onBackToSelector }: { onBackToSelector?: () => void }) {
  const CATEGORIES = useHomeCategories(CATEGORIES_META, "bancos");
  useThemeColor("#EFF6FF");
  const [, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProvinceModal, setShowProvinceModal] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState("");

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ["stores", "bancos"],
    queryFn: () => fetchStores({ storeType: "bancos" }),
    staleTime: 60_000,
  });

  const nonAdmin = stores.filter((s: any) => s.phone !== "999999999");
  const featured = nonAdmin.filter((s: any) => s.isFeatured).slice(0, 6);

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
    navigate(`/explorar-bancos?` + params.toString());
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
      navigate(`/explorar-bancos?` + params.toString());
      setShowProvinceModal(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#EFF6FF] text-[#172554] pb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .cat-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px; }
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-item { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 10px; background: white; border-radius: 14px; border: 1px solid #BFDBFE; min-width: 72px; cursor: pointer; transition: all 0.2s; }
        .cat-item:hover { border-color: #1E40AF; background: #f3e5f5; }
        .trust-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; }
        .trust-scroll::-webkit-scrollbar { display: none; }
        .trust-item { flex-shrink: 0; display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: white; border-radius: 12px; border: 1px solid #BFDBFE; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#EFF6FF]/95 backdrop-blur-md border-b border-[#BFDBFE]/60">
        <div className="flex items-center justify-between px-5 py-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
          <div className="flex flex-col items-center">
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 600, color: "#172554" }}>YESOLA</span>
            <span className="text-[9px] tracking-[0.25em] text-[#1E40AF] font-semibold uppercase mt-0.5">Bancos</span>
          </div>

        </div>
        {menuOpen && (
          <div className="bg-[#EFF6FF] border-t border-[#BFDBFE]/60 px-5 py-4 flex flex-col gap-3 text-sm font-medium">
            <button onClick={() => navigate("/login-bancos")} className="py-2 text-left">Entrar</button>
            {onBackToSelector && <button onClick={onBackToSelector} className="py-2 text-left">Trocar loja</button>}
          </div>
        )}
      </header>

      {/* Categories */}
      <section className="px-5 pt-4 pb-2">
        <div className="cat-scroll">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => navigate(`/explorar-bancos?categoria=${cat.id}`)} className="cat-item">
              <div className="w-10 h-10 flex items-center justify-center">{cat.icon}</div>
              <span className="text-[10px] font-medium text-[#172554] text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Hero */}
      <section className="px-5 py-4">
        <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: "240px" }}>
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=500&fit=crop&auto=format&q=80" alt="Bancos" className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />
          <div className="relative z-10 p-6 max-w-[60%]">
            <p className="text-[10px] tracking-[0.2em] text-[#1E40AF] font-semibold uppercase">O seu dinheiro em boas mãos.</p>
            <h1 className="text-[28px] leading-[1.1] font-semibold mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="text-[#1E40AF]">Bancos</span> & Serviços.
            </h1>
            <p className="text-[12px] text-[#6B7280] mt-3 leading-relaxed">Contas, crédito e investimentos nos melhores bancos em Angola.</p>
            <button onClick={() => navigate("/explorar-bancos")} className="mt-4 flex items-center gap-2 bg-[#1E40AF] text-white text-[12px] font-medium px-4 py-2.5 rounded-full hover:bg-[#1E3A8A] transition-colors">
              Explorar serviços <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Province */}
      <section className="px-5 py-3">
        <button
          onClick={() => setShowProvinceModal(true)}
          className="w-full flex items-center gap-4 bg-white rounded-2xl px-4 py-4 border border-[#BFDBFE] hover:border-[#1E40AF] transition-colors cursor-pointer text-left"
        >
          <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center"><MapPin size={18} className="text-[#1E40AF]" /></div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-[#1E40AF]">
              {selectedProvince ? selectedProvince + (selectedMunicipality ? " \u00b7 " + selectedMunicipality : "") : "Em todas as prov\u00edncias de Angola"}
            </p>
            <p className="text-[11px] text-[#6B7280]">Serviços bancários perto de si, onde estiver.</p>
          </div>
          <ChevronRight size={18} className="text-[#1E40AF]" />
        </button>
      </section>

      {/* Province Selection Modal */}
      {showProvinceModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center" onClick={() => setShowProvinceModal(false)}>
          <div className="bg-white rounded-t-3xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#171717]">Escolha a sua localiza\u00e7\u00e3o</h3>
              <button onClick={() => setShowProvinceModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            </div>
            <div className="mb-4">
              <WhereSearch onScope={handleScopeSelect} onClear={handleScopeClear} accent="#1E40AF" />
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
                <h4 className="text-xs font-semibold text-[#6F7780] uppercase tracking-wider mb-2">Prov\u00edncia</h4>
                <div className="space-y-1 max-h-[50vh] overflow-y-auto">
                  {filteredProvinces.length === 0 && (
                      <p className="px-3 py-4 text-sm text-gray-500 text-center">Nenhuma província encontrada.</p>
                    )}
                    {filteredProvinces.map((province) => (
                    <button
                      key={province.id}
                      onClick={() => { setSelectedProvince(province.name); setSelectedMunicipality(null); }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        selectedProvince === province.name ? "bg-[#1E40AF] text-white font-medium" : "hover:bg-[#EFF6FF] text-[#171717]"
                      }`}
                    >
                      {province.name}
                    </button>
                  ))}
                </div>
              </div>
              {selectedProvince && municipalities.length > 0 && (
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-[#6F7780] uppercase tracking-wider mb-2">Munic\u00edpio</h4>
                  <div className="space-y-1 max-h-[50vh] overflow-y-auto">
                    {filteredMunicipalities.length === 0 && (
                          <p className="px-3 py-4 text-sm text-gray-500 text-center">Nenhum município encontrado.</p>
                        )}
                        {filteredMunicipalities.map((municipality) => (
                      <button
                        key={municipality}
                        onClick={() => setSelectedMunicipality(municipality)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          selectedMunicipality === municipality ? "bg-[#1E40AF] text-white font-medium" : "hover:bg-[#EFF6FF] text-[#171717]"
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
              <div className="sticky bottom-0 z-10 bg-white/95 backdrop-blur-sm pt-3 pb-1">
              <button
                onClick={handleProvinceSelect}
                className="w-full bg-[#1E40AF] text-white py-3 rounded-xl font-medium hover:bg-[#1E3A8A] transition-colors"
              >
                {selectedMunicipality ? `Explorar em ${selectedMunicipality}` : `Explorar em ${selectedProvince}`}
              </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Featured Stores */}
      {(featured.length > 0) && (
        <section className="px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] font-semibold text-[#172554]">Lojas em destaque</h2>
            <button onClick={() => navigate("/explorar-bancos")} className="text-[12px] font-medium text-[#1E40AF] flex items-center gap-1">
              Ver todas <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
            {featured.map((store: any) => (
              <div key={store.id} className="flex-shrink-0 w-44 bg-white rounded-2xl overflow-hidden border border-[#BFDBFE] cursor-pointer" onClick={() => window.location.href = `/loja/${store.id}?from=bancos`}>
                <div className="h-28 overflow-hidden">
                  <img src={thumbUrl(store.coverImage) || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop&auto=format&q=80"} alt={store.name} className="w-full h-full object-cover object-top" loading="lazy" decoding="async" />
                </div>
                <div className="p-3">
                  <h4 className="text-[13px] font-semibold text-[#172554] truncate">{store.name}</h4>
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
          {featured.length > 2 && (<p className="swipe-hint-below">Desliza para ver mais →</p>)}
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
        <StoreCategorySection categories={CATEGORIES} stores={stores} storeType="bancos" exploreRoute="/explorar-bancos" />
      )}

      {/* Counter */}
      <section className="px-5 py-3">
        <div className="flex items-center justify-center gap-2 bg-[#EFF6FF] rounded-2xl px-4 py-3 border border-[#BFDBFE]">
          <Heart size={16} className="text-[#1E40AF]" />
          <span className="text-[13px] font-medium text-[#172554]">Milhares de clientes <span className="text-[#1E40AF] font-bold">bem servidos</span> todos os dias.</span>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="px-5 py-3">
        <div className="trust-scroll">
          {TRUST_BADGES.map((badge, i) => (
            <div key={i} className="trust-item">
              <span className="text-[#1E40AF]">{badge.icon}</span>
              <span className="text-[11px] font-medium text-[#172554]">{badge.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center py-6 px-5">
        <p className="text-[11px] text-[#9CA3AF]">YESOLA BANCOS · O SEU DINHEIRO EM BOAS MÃOS.</p>
      </div>
    </div>
  );
}



