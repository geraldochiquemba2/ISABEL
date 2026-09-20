import { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchStores } from "@/lib/api";
import { ANGOLA_PROVINCES } from "@/data/angolaData";
import {
  Heart, ChevronRight, Star, MapPin, Menu, X,
  ShieldCheck, BadgeCheck, CreditCard, HeadphonesIcon,
  UtensilsCrossed, Cake, Zap, ChefHat, ShoppingCart, Beef, Croissant, Droplets, Package, Truck,
} from "lucide-react";
import StoreCategorySection from "@/components/StoreCategorySection";

const CATEGORIES = [
  { id: "restaurantes", name: "Restaurantes", icon: <UtensilsCrossed size={28} className="text-[#D84315]" /> },
  { id: "pastelarias-cafes", name: "Pastelarias & Cafés", icon: <Cake size={28} className="text-[#D84315]" /> },
  { id: "fast-food", name: "Fast Food & Take-away", icon: <Zap size={28} className="text-[#D84315]" /> },
  { id: "catering", name: "Catering", icon: <ChefHat size={28} className="text-[#D84315]" /> },
  { id: "supermercados", name: "Supermercados & Mercearias", icon: <ShoppingCart size={28} className="text-[#D84315]" /> },
  { id: "talhos-peixarias", name: "Talhos & Peixarias", icon: <Beef size={28} className="text-[#D84315]" /> },
  { id: "padarias", name: "Padarias", icon: <Croissant size={28} className="text-[#D84315]" /> },
  { id: "bebidas", name: "Bebidas & Água", icon: <Droplets size={28} className="text-[#D84315]" /> },
  { id: "produtos-alimentares", name: "Produtos Alimentares", icon: <Package size={28} className="text-[#D84315]" /> },
  { id: "entregas-comida", name: "Entregas de Comida", icon: <Truck size={28} className="text-[#D84315]" /> },
];

const TRUST_BADGES = [
  { icon: <ShieldCheck size={18} />, label: "Restaurantes verificados" },
  { icon: <BadgeCheck size={18} />, label: "Qualidade garantida" },
  { icon: <CreditCard size={18} />, label: "Pedido fácil" },
  { icon: <HeadphonesIcon size={18} />, label: "Apoio ao cliente" },
];

export default function AlimentacaoHome({ onBackToSelector }: { onBackToSelector?: () => void }) {
  useThemeColor("#fbe9e7");
  const [, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProvinceModal, setShowProvinceModal] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null);

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ["stores", "alimentacao-restauracao"],
    queryFn: () => fetchStores({ storeType: "alimentacao-restauracao" }),
    staleTime: 60_000,
  });

  const nonAdmin = stores.filter((s: any) => s.phone !== "999999999");
  const featured = nonAdmin.filter((s: any) => s.isFeatured).slice(0, 6);
  const fallbackFeatured = !featured.length ? nonAdmin.slice(0, 6) : [];

  const municipalities = selectedProvince
    ? ANGOLA_PROVINCES.find((p) => p.name === selectedProvince)?.municipalities || []
    : [];

  const handleProvinceSelect = () => {
    if (selectedProvince) {
      const params = new URLSearchParams();
      params.set("provincia", selectedProvince);
      if (selectedMunicipality) params.set("municipio", selectedMunicipality);
      navigate($route?+ params.toString());
      setShowProvinceModal(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#fbe9e7] text-[#3a1a1a] pb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .cat-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px; }
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-item { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 10px; background: white; border-radius: 14px; border: 1px solid #ffccbc; min-width: 72px; cursor: pointer; transition: all 0.2s; }
        .cat-item:hover { border-color: #D84315; background: #fff3e0; }
        .trust-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; }
        .trust-scroll::-webkit-scrollbar { display: none; }
        .trust-item { flex-shrink: 0; display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: white; border-radius: 12px; border: 1px solid #ffccbc; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#fbe9e7]/95 backdrop-blur-md border-b border-[#ffccbc]/60">
        <div className="flex items-center justify-between px-5 py-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
          <div className="flex flex-col items-center">
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 600, color: "#3a1a1a" }}>YESOLA</span>
            <span className="text-[9px] tracking-[0.25em] text-[#D84315] font-semibold uppercase mt-0.5">Alimentação & Restauração</span>
          </div>

        </div>
        {menuOpen && (
          <div className="bg-[#fbe9e7] border-t border-[#ffccbc]/60 px-5 py-4 flex flex-col gap-3 text-sm font-medium">
            <button onClick={() => navigate("/login-alimentacao")} className="py-2 text-left">Entrar</button>
            {onBackToSelector && <button onClick={onBackToSelector} className="py-2 text-left">Trocar loja</button>}
          </div>
        )}
      </header>

      {/* Categories */}
      <section className="px-5 pt-4 pb-2">
        <div className="cat-scroll">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => navigate(`/explorar-alimentacao?categoria=${cat.id}`)} className="cat-item">
              <div className="w-10 h-10 flex items-center justify-center">{cat.icon}</div>
              <span className="text-[10px] font-medium text-[#3a1a1a] text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Hero */}
      <section className="px-5 py-4">
        <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: "240px" }}>
          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=500&fit=crop&auto=format&q=80" alt="Alimentação" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />
          <div className="relative z-10 p-6 max-w-[60%]">
            <p className="text-[10px] tracking-[0.2em] text-[#D84315] font-semibold uppercase">Sabores que encantam.</p>
            <h1 className="text-[28px] leading-[1.1] font-semibold mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="text-[#D84315]">Alimentação</span> de excelência.
            </h1>
            <p className="text-[12px] text-[#6B7280] mt-3 leading-relaxed">Descubra os melhores restaurantes, cafés e serviços de entrega de comida perto de si.</p>
            <button onClick={() => navigate("/explorar-alimentacao")} className="mt-4 flex items-center gap-2 bg-[#D84315] text-white text-[12px] font-medium px-4 py-2.5 rounded-full hover:bg-[#BF360C] transition-colors">
              Explorar serviços <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Province */}
      <section className="px-5 py-3">
        <button
          onClick={() => setShowProvinceModal(true)}
          className="w-full flex items-center gap-4 bg-white rounded-2xl px-4 py-4 border border-[#ffccbc] hover:border-[#D84315] transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#fbe9e7] flex items-center justify-center"><MapPin size={18} className="text-[#D84315]" /></div>
          <div className="flex-1 text-left">
            <p className="text-[14px] font-semibold text-[#D84315]">
              {selectedProvince ? selectedProvince + (selectedMunicipality ? " Â· " + selectedMunicipality : "") : "Em todas as provÃ­ncias de Angola"}
            </p>
            <p className="text-[11px] text-[#6B7280]">Encontre os melhores restaurantes e produtos alimentares perto de si.</p>
          </div>
          <ChevronRight size={18} className="text-[#D84315]" />
        </button>
      </section>
      {/* Province Selection Modal */}
      {showProvinceModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center" onClick={() => setShowProvinceModal(false)}>
          <div className="bg-white rounded-t-3xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#171717]">Escolha a sua localizaÃ§Ã£o</h3>
              <button onClick={() => setShowProvinceModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <h4 className="text-xs font-semibold text-[#6F7780] uppercase tracking-wider mb-2">ProvÃ­ncia</h4>
                <div className="space-y-1 max-h-[50vh] overflow-y-auto">
                  {ANGOLA_PROVINCES.map((province) => (
                    <button
                      key={province.id}
                      onClick={() => { setSelectedProvince(province.name); setSelectedMunicipality(null); }}
                      className={w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors {
                        selectedProvince === province.name ? "bg-[#D84315] text-white font-medium" : "hover:bg-[#fbe9e7] text-[#171717]"
                      }}
                    >
                      {province.name}
                    </button>
                  ))}
                </div>
              </div>
              {selectedProvince && municipalities.length > 0 && (
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-[#6F7780] uppercase tracking-wider mb-2">MunicÃ­pio</h4>
                  <div className="space-y-1 max-h-[50vh] overflow-y-auto">
                    {municipalities.map((municipality) => (
                      <button
                        key={municipality}
                        onClick={() => setSelectedMunicipality(municipality)}
                        className={w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors {
                          selectedMunicipality === municipality ? "bg-[#D84315] text-white font-medium" : "hover:bg-[#fbe9e7] text-[#171717]"
                        }}
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
                className="w-full mt-6 bg-[#D84315] text-white py-3 rounded-xl font-medium transition-colors"
              >
                {selectedMunicipality ? Explorar em {selectedMunicipality} : Explorar em {selectedProvince}}
              </button>
            )}
          </div>
        </div>
      )}


      {/* Featured Stores */}
      {(featured.length > 0 || fallbackFeatured.length > 0) && (
        <section className="px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] font-semibold text-[#3a1a1a]">Lojas em destaque</h2>
            <button onClick={() => navigate("/explorar-alimentacao")} className="text-[12px] font-medium text-[#D84315] flex items-center gap-1">
              Ver todas <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
            {(featured.length > 0 ? featured : fallbackFeatured).map((store: any) => (
              <div key={store.id} className="flex-shrink-0 w-44 bg-white rounded-2xl overflow-hidden border border-[#ffccbc] cursor-pointer" onClick={() => window.location.href = `/loja/${store.id}?from=alimentacao`}>
                <div className="h-28 overflow-hidden">
                  <img src={store.coverImage || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop&auto=format&q=80"} alt={store.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h4 className="text-[13px] font-semibold text-[#3a1a1a] truncate">{store.name}</h4>
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
        <StoreCategorySection categories={CATEGORIES} stores={stores} storeType="alimentacao-restauracao" exploreRoute="/explorar-alimentacao" />
      )}

      {/* Counter */}
      <section className="px-5 py-3">
        <div className="flex items-center justify-center gap-2 bg-[#fbe9e7] rounded-2xl px-4 py-3 border border-[#ffccbc]">
          <Heart size={16} className="text-[#D84315]" />
          <span className="text-[13px] font-medium text-[#3a1a1a]">Mais de <span className="text-[#D84315] font-bold">+4.000</span> clientes satisfeitos com os nossos serviços gastronómicos.</span>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="px-5 py-3">
        <div className="trust-scroll">
          {TRUST_BADGES.map((badge, i) => (
            <div key={i} className="trust-item">
              <span className="text-[#D84315]">{badge.icon}</span>
              <span className="text-[11px] font-medium text-[#3a1a1a]">{badge.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center py-6 px-5">
        <p className="text-[11px] text-[#9CA3AF]">YESOLA ALIMENTAÇÃO · SABORES QUE CONECTAM.</p>
      </div>
    </div>
  );
}


