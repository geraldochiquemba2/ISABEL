import { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchStores } from "@/lib/api";
import { ANGOLA_PROVINCES } from "@/data/angolaData";
import {
  Heart, ChevronRight, Star, MapPin, Menu, X,
  ShieldCheck, BadgeCheck, CreditCard, HeadphonesIcon,
  Users, Video, Mic, Camera, Tv, Music, Globe, Smile,
} from "lucide-react";
import StoreCategorySection from "@/components/StoreCategorySection";

const CATEGORIES = [
  { id: "influenciadores-digitais", name: "Influenciadores Digitais", icon: <Users size={28} className="text-[#C2185B]" /> },
  { id: "criadores-conteudo", name: "Criadores de Conteúdo", icon: <Video size={28} className="text-[#C2185B]" /> },
  { id: "criadores-ugc", name: "Criadores UGC", icon: <Mic size={28} className="text-[#C2185B]" /> },
  { id: "videomakers", name: "Videomakers", icon: <Camera size={28} className="text-[#C2185B]" /> },
  { id: "fotografos-comerciais", name: "Fotógrafos Comerciais", icon: <Tv size={28} className="text-[#C2185B]" /> },
  { id: "apresentadores", name: "Apresentadores & Hosts", icon: <Music size={28} className="text-[#C2185B]" /> },
  { id: "podcasters", name: "Podcasters", icon: <Globe size={28} className="text-[#C2185B]" /> },
  { id: "streamers", name: "Streamers", icon: <Smile size={28} className="text-[#C2185B]" /> },
  { id: "modelos-marcas", name: "Modelos para Marcas", icon: <Heart size={28} className="text-[#C2185B]" /> },
];

const TRUST_BADGES = [
  { icon: <ShieldCheck size={18} />, label: "Criadores verificados" },
  { icon: <BadgeCheck size={18} />, label: "Conteúdo de qualidade" },
  { icon: <CreditCard size={18} />, label: "Parceria fácil" },
  { icon: <HeadphonesIcon size={18} />, label: "Apoio ao cliente" },
];

export default function InfluenciadoresHome({ onBackToSelector }: { onBackToSelector?: () => void }) {
  useThemeColor("#fce4ec");
  const [, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProvinceModal, setShowProvinceModal] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null);

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ["stores", "influenciadores-criadores"],
    queryFn: () => fetchStores({ storeType: "influenciadores-criadores" }),
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
      navigate(`/explorar-influenciadores?` + params.toString());
      setShowProvinceModal(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#fce4ec] text-[#3a1a2a] pb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .cat-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px; }
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-item { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 10px; background: white; border-radius: 14px; border: 1px solid #f8bbd0; min-width: 72px; cursor: pointer; transition: all 0.2s; }
        .cat-item:hover { border-color: #C2185B; background: #fce4ec; }
        .trust-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; }
        .trust-scroll::-webkit-scrollbar { display: none; }
        .trust-item { flex-shrink: 0; display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: white; border-radius: 12px; border: 1px solid #f8bbd0; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#fce4ec]/95 backdrop-blur-md border-b border-[#f8bbd0]/60">
        <div className="flex items-center justify-between px-5 py-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
          <div className="flex flex-col items-center">
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 600, color: "#3a1a2a" }}>YESOLA</span>
            <span className="text-[9px] tracking-[0.25em] text-[#C2185B] font-semibold uppercase mt-0.5">Influenciadores & Criadores de Conteúdo</span>
          </div>

        </div>
        {menuOpen && (
          <div className="bg-[#fce4ec] border-t border-[#f8bbd0]/60 px-5 py-4 flex flex-col gap-3 text-sm font-medium">
            <button onClick={() => navigate("/login-influenciadores")} className="py-2 text-left">Entrar</button>
            {onBackToSelector && <button onClick={onBackToSelector} className="py-2 text-left">Trocar loja</button>}
          </div>
        )}
      </header>

      {/* Categories */}
      <section className="px-5 pt-4 pb-2">
        <div className="cat-scroll">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => navigate(`/explorar-influenciadores?categoria=${cat.id}`)} className="cat-item">
              <div className="w-10 h-10 flex items-center justify-center">{cat.icon}</div>
              <span className="text-[10px] font-medium text-[#3a1a2a] text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Hero */}
      <section className="px-5 py-4">
        <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: "240px" }}>
          <img src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&h=500&fit=crop&auto=format&q=80" alt="Influenciadores" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />
          <div className="relative z-10 p-6 max-w-[60%]">
            <p className="text-[10px] tracking-[0.2em] text-[#C2185B] font-semibold uppercase">Influencie e inspire.</p>
            <h1 className="text-[28px] leading-[1.1] font-semibold mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="text-[#C2185B]">Influenciadores</span> & Criadores.
            </h1>
            <p className="text-[12px] text-[#6B7280] mt-3 leading-relaxed">Conecte-se com os melhores criadores de conteúdo, videomakers e influenciadores digitais.</p>
            <button onClick={() => navigate("/explorar-influenciadores")} className="mt-4 flex items-center gap-2 bg-[#C2185B] text-white text-[12px] font-medium px-4 py-2.5 rounded-full hover:bg-[#880E4F] transition-colors">
              Explorar serviços <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Province */}
      <section className="px-5 py-3">
        <button
          onClick={() => setShowProvinceModal(true)}
          className="w-full flex items-center gap-4 bg-white rounded-2xl px-4 py-4 border border-[#f48fb1] hover:border-[#C2185B] transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#fce4ec] flex items-center justify-center"><MapPin size={18} className="text-[#C2185B]" /></div>
          <div className="flex-1 text-left">
            <p className="text-[14px] font-semibold text-[#C2185B]">
              {selectedProvince ? selectedProvince + (selectedMunicipality ? " · " + selectedMunicipality : "") : "Em todas as províncias de Angola"}
            </p>
            <p className="text-[11px] text-[#6B7280]">Encontre influenciadores e criadores de conteÃºdo perto de si.</p>
          </div>
          <ChevronRight size={18} className="text-[#C2185B]" />
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
            <div className="flex gap-4">
              <div className="flex-1">
                <h4 className="text-xs font-semibold text-[#6F7780] uppercase tracking-wider mb-2">Província</h4>
                <div className="space-y-1 max-h-[50vh] overflow-y-auto">
                  {ANGOLA_PROVINCES.map((province) => (
                    <button
                      key={province.id}
                      onClick={() => { setSelectedProvince(province.name); setSelectedMunicipality(null); }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        selectedProvince === province.name ? "bg-[#C2185B] text-white font-medium" : "hover:bg-[#fce4ec] text-[#171717]"
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
                    {municipalities.map((municipality) => (
                      <button
                        key={municipality}
                        onClick={() => setSelectedMunicipality(municipality)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          selectedMunicipality === municipality ? "bg-[#C2185B] text-white font-medium" : "hover:bg-[#fce4ec] text-[#171717]"
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
                className="w-full mt-6 bg-[#C2185B] text-white py-3 rounded-xl font-medium transition-colors"
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
            <h2 className="text-[17px] font-semibold text-[#3a1a2a]">Lojas em destaque</h2>
            <button onClick={() => navigate("/explorar-influenciadores")} className="text-[12px] font-medium text-[#C2185B] flex items-center gap-1">
              Ver todas <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
            {(featured.length > 0 ? featured : fallbackFeatured).map((store: any) => (
              <div key={store.id} className="flex-shrink-0 w-44 bg-white rounded-2xl overflow-hidden border border-[#f8bbd0] cursor-pointer" onClick={() => window.location.href = `/loja/${store.id}?from=influenciadores`}>
                <div className="h-28 overflow-hidden">
                  <img src={store.coverImage || "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=300&fit=crop&auto=format&q=80"} alt={store.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h4 className="text-[13px] font-semibold text-[#3a1a2a] truncate">{store.name}</h4>
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
        <StoreCategorySection categories={CATEGORIES} stores={stores} storeType="influenciadores-criadores" exploreRoute="/explorar-influenciadores" />
      )}

      {/* Counter */}
      <section className="px-5 py-3">
        <div className="flex items-center justify-center gap-2 bg-[#fce4ec] rounded-2xl px-4 py-3 border border-[#f8bbd0]">
          <Heart size={16} className="text-[#C2185B]" />
          <span className="text-[13px] font-medium text-[#3a1a2a]">Mais de <span className="text-[#C2185B] font-bold">+1.500</span> criadores de conteúdo conectados.</span>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="px-5 py-3">
        <div className="trust-scroll">
          {TRUST_BADGES.map((badge, i) => (
            <div key={i} className="trust-item">
              <span className="text-[#C2185B]">{badge.icon}</span>
              <span className="text-[11px] font-medium text-[#3a1a2a]">{badge.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center py-6 px-5">
        <p className="text-[11px] text-[#9CA3AF]">YESOLA INFLUÊNCIA · CRIAMOS CONEXÕES QUE INSPIRAM.</p>
      </div>
    </div>
  );
}



