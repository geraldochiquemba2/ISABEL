import { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchStores } from "@/lib/api";
import { ANGOLA_PROVINCES } from "@/data/angolaData";
import {
  Heart, ChevronRight, MapPin, Menu, X,
  ShieldCheck, BadgeCheck, CreditCard, HeadphonesIcon,
  Briefcase, GraduationCap, Star, Clock, PenTool, Users,
} from "lucide-react";
import StoreCategorySection from "@/components/StoreCategorySection";

const CATEGORIES = [
  { id: "vagas-emprego", name: "Vagas de Emprego", icon: <Briefcase size={28} className="text-[#4527A0]" /> },
  { id: "estagios", name: "Estágios Profissionais", icon: <GraduationCap size={28} className="text-[#4527A0]" /> },
  { id: "primeiro-emprego", name: "Primeiro Emprego", icon: <Star size={28} className="text-[#4527A0]" /> },
  { id: "trabalho-temporario", name: "Trabalho Temporário", icon: <Clock size={28} className="text-[#4527A0]" /> },
  { id: "trabalho-freelancer", name: "Trabalho Freelancer", icon: <PenTool size={28} className="text-[#4527A0]" /> },
  { id: "recrutamento-selecao", name: "Recrutamento & Seleção", icon: <Users size={28} className="text-[#4527A0]" /> },
];

const TRUST_BADGES = [
  { icon: <ShieldCheck size={18} />, label: "Empresas verificadas" },
  { icon: <BadgeCheck size={18} />, label: "Oportunidades reais" },
  { icon: <CreditCard size={18} />, label: "Candidatura gratuita" },
  { icon: <HeadphonesIcon size={18} />, label: "Apoio ao cliente" },
];

export default function EmpregosHome({ onBackToSelector }: { onBackToSelector?: () => void }) {
  useThemeColor("#ede7f6");
  const [, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProvinceModal, setShowProvinceModal] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null);

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ["stores", "empregos-oportunidades"],
    queryFn: () => fetchStores({ storeType: "empregos-oportunidades" }),
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
      navigate(`/explorar-empregos?` + params.toString());
      setShowProvinceModal(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#ede7f6] text-[#2a1a4a] pb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .cat-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px; }
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-item { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 10px; background: white; border-radius: 14px; border: 1px solid #d1c4e9; min-width: 72px; cursor: pointer; transition: all 0.2s; }
        .cat-item:hover { border-color: #4527A0; background: #f3e5f5; }
        .trust-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; }
        .trust-scroll::-webkit-scrollbar { display: none; }
        .trust-item { flex-shrink: 0; display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: white; border-radius: 12px; border: 1px solid #d1c4e9; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#ede7f6]/95 backdrop-blur-md border-b border-[#d1c4e9]/60">
        <div className="flex items-center justify-between px-5 py-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
          <div className="flex flex-col items-center">
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 600, color: "#2a1a4a" }}>YESOLA</span>
            <span className="text-[9px] tracking-[0.25em] text-[#4527A0] font-semibold uppercase mt-0.5">Empregos & Oportunidades</span>
          </div>

        </div>
        {menuOpen && (
          <div className="bg-[#ede7f6] border-t border-[#d1c4e9]/60 px-5 py-4 flex flex-col gap-3 text-sm font-medium">
            <button onClick={() => navigate("/login-empregos")} className="py-2 text-left">Entrar</button>
            {onBackToSelector && <button onClick={onBackToSelector} className="py-2 text-left">Trocar loja</button>}
          </div>
        )}
      </header>

      {/* Categories */}
      <section className="px-5 pt-4 pb-2">
        <div className="cat-scroll">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => navigate(`/explorar-empregos?categoria=${cat.id}`)} className="cat-item">
              <div className="w-10 h-10 flex items-center justify-center">{cat.icon}</div>
              <span className="text-[10px] font-medium text-[#2a1a4a] text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Hero */}
      <section className="px-5 py-4">
        <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: "240px" }}>
          <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop&auto=format&q=80" alt="Empregos" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />
          <div className="relative z-10 p-6 max-w-[60%]">
            <p className="text-[10px] tracking-[0.2em] text-[#4527A0] font-semibold uppercase">Construa o seu futuro.</p>
            <h1 className="text-[28px] leading-[1.1] font-semibold mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="text-[#4527A0]">Empregos</span> & Oportunidades.
            </h1>
            <p className="text-[12px] text-[#6B7280] mt-3 leading-relaxed">Encontre as melhores vagas de emprego, estágios e oportunidades profissionais em Angola.</p>
            <button onClick={() => navigate("/explorar-empregos")} className="mt-4 flex items-center gap-2 bg-[#4527A0] text-white text-[12px] font-medium px-4 py-2.5 rounded-full hover:bg-[#311B92] transition-colors">
              Explorar serviços <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Province */}
      <section className="px-5 py-3">
        <button
          onClick={() => setShowProvinceModal(true)}
          className="w-full flex items-center gap-4 bg-white rounded-2xl px-4 py-4 border border-[#d1c4e9] hover:border-[#4527A0] transition-colors cursor-pointer text-left"
        >
          <div className="w-10 h-10 rounded-full bg-[#ede7f6] flex items-center justify-center"><MapPin size={18} className="text-[#4527A0]" /></div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-[#4527A0]">
              {selectedProvince ? selectedProvince + (selectedMunicipality ? " \u00b7 " + selectedMunicipality : "") : "Em todas as prov\u00edncias de Angola"}
            </p>
            <p className="text-[11px] text-[#6B7280]">Oportunidades profissionais perto de si, onde estiver.</p>
          </div>
          <ChevronRight size={18} className="text-[#4527A0]" />
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
            <div className="flex gap-4">
              <div className="flex-1">
                <h4 className="text-xs font-semibold text-[#6F7780] uppercase tracking-wider mb-2">Prov\u00edncia</h4>
                <div className="space-y-1 max-h-[50vh] overflow-y-auto">
                  {ANGOLA_PROVINCES.map((province) => (
                    <button
                      key={province.id}
                      onClick={() => { setSelectedProvince(province.name); setSelectedMunicipality(null); }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        selectedProvince === province.name ? "bg-[#4527A0] text-white font-medium" : "hover:bg-[#ede7f6] text-[#171717]"
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
                    {municipalities.map((municipality) => (
                      <button
                        key={municipality}
                        onClick={() => setSelectedMunicipality(municipality)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          selectedMunicipality === municipality ? "bg-[#4527A0] text-white font-medium" : "hover:bg-[#ede7f6] text-[#171717]"
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
                className="w-full mt-6 bg-[#4527A0] text-white py-3 rounded-xl font-medium hover:bg-[#311B92] transition-colors"
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
            <h2 className="text-[17px] font-semibold text-[#2a1a4a]">Lojas em destaque</h2>
            <button onClick={() => navigate("/explorar-empregos")} className="text-[12px] font-medium text-[#4527A0] flex items-center gap-1">
              Ver todas <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
            {(featured.length > 0 ? featured : fallbackFeatured).map((store: any) => (
              <div key={store.id} className="flex-shrink-0 w-44 bg-white rounded-2xl overflow-hidden border border-[#d1c4e9] cursor-pointer" onClick={() => window.location.href = `/loja/${store.id}?from=empregos`}>
                <div className="h-28 overflow-hidden">
                  <img src={store.coverImage || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop&auto=format&q=80"} alt={store.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h4 className="text-[13px] font-semibold text-[#2a1a4a] truncate">{store.name}</h4>
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
        <StoreCategorySection categories={CATEGORIES} stores={stores} storeType="empregos-oportunidades" exploreRoute="/explorar-empregos" />
      )}

      {/* Counter */}
      <section className="px-5 py-3">
        <div className="flex items-center justify-center gap-2 bg-[#ede7f6] rounded-2xl px-4 py-3 border border-[#d1c4e9]">
          <Heart size={16} className="text-[#4527A0]" />
          <span className="text-[13px] font-medium text-[#2a1a4a]">Mais de <span className="text-[#4527A0] font-bold">+6.000</span> candidatos e empresas conectados.</span>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="px-5 py-3">
        <div className="trust-scroll">
          {TRUST_BADGES.map((badge, i) => (
            <div key={i} className="trust-item">
              <span className="text-[#4527A0]">{badge.icon}</span>
              <span className="text-[11px] font-medium text-[#2a1a4a]">{badge.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center py-6 px-5">
        <p className="text-[11px] text-[#9CA3AF]">YESOLA EMPREGOS · O SEU FUTURO COMEÇA AQUI.</p>
      </div>
    </div>
  );
}



