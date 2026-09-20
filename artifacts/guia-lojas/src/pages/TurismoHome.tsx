import { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchStores } from "@/lib/api";
import {
  Heart, ChevronRight, Star, MapPin, Menu, X,
  ShieldCheck, BadgeCheck, CreditCard, HeadphonesIcon,
  Plane, Map, Compass, TreePine, Gamepad2, Landmark, Users,
} from "lucide-react";
import StoreCategorySection from "@/components/StoreCategorySection";

const CATEGORIES = [
  { id: "agencias-viagens", name: "Agências de Viagens & Turismo", icon: <Plane size={28} className="text-[#00796B]" /> },
  { id: "passeios-excursões", name: "Passeios & Excursões", icon: <Map size={28} className="text-[#00796B]" /> },
  { id: "experiencias-turisticas", name: "Experiências Turísticas", icon: <Compass size={28} className="text-[#00796B]" /> },
  { id: "parques-lazer", name: "Parques & Espaços de Lazer", icon: <TreePine size={28} className="text-[#00796B]" /> },
  { id: "actividades-recreativas", name: "Actividades Recreativas", icon: <Gamepad2 size={28} className="text-[#00796B]" /> },
  { id: "turismo-cultural", name: "Turismo Cultural", icon: <Landmark size={28} className="text-[#00796B]" /> },
  { id: "guias-turisticos", name: "Guias Turísticos", icon: <Users size={28} className="text-[#00796B]" /> },
];

const TRUST_BADGES = [
  { icon: <ShieldCheck size={18} />, label: "Operadores verificados" },
  { icon: <BadgeCheck size={18} />, label: "Experiências comprovadas" },
  { icon: <CreditCard size={18} />, label: "Reservas fáceis" },
  { icon: <HeadphonesIcon size={18} />, label: "Apoio ao cliente" },
];

export default function TurismoHome({ onBackToSelector }: { onBackToSelector?: () => void }) {
  useThemeColor("#e0f2f1");
  const [, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ["stores", "turismo-lazer"],
    queryFn: () => fetchStores({ storeType: "turismo-lazer" }),
    staleTime: 60_000,
  });

  const nonAdmin = stores.filter((s: any) => s.phone !== "999999999");
  const featured = nonAdmin.filter((s: any) => s.isFeatured).slice(0, 6);
  const fallbackFeatured = !featured.length ? nonAdmin.slice(0, 6) : [];

  return (
    <div className="min-h-[100dvh] bg-[#e0f2f1] text-[#1a3a3a] pb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .cat-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px; }
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-item { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 10px; background: white; border-radius: 14px; border: 1px solid #b2dfdb; min-width: 72px; cursor: pointer; transition: all 0.2s; }
        .cat-item:hover { border-color: #00796B; background: #e0f7fa; }
        .trust-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; }
        .trust-scroll::-webkit-scrollbar { display: none; }
        .trust-item { flex-shrink: 0; display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: white; border-radius: 12px; border: 1px solid #b2dfdb; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#e0f2f1]/95 backdrop-blur-md border-b border-[#b2dfdb]/60">
        <div className="flex items-center justify-between px-5 py-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
          <div className="flex flex-col items-center">
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 600, color: "#1a3a3a" }}>YESOLA</span>
            <span className="text-[9px] tracking-[0.25em] text-[#00796B] font-semibold uppercase mt-0.5">Turismo & Lazer</span>
          </div>

        </div>
        {menuOpen && (
          <div className="bg-[#e0f2f1] border-t border-[#b2dfdb]/60 px-5 py-4 flex flex-col gap-3 text-sm font-medium">
            <button onClick={() => navigate("/login-turismo")} className="py-2 text-left">Entrar</button>
            {onBackToSelector && <button onClick={onBackToSelector} className="py-2 text-left">Trocar loja</button>}
          </div>
        )}
      </header>

      {/* Categories */}
      <section className="px-5 pt-4 pb-2">
        <div className="cat-scroll">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => navigate(`/explorar-turismo?categoria=${cat.id}`)} className="cat-item">
              <div className="w-10 h-10 flex items-center justify-center">{cat.icon}</div>
              <span className="text-[10px] font-medium text-[#1a3a3a] text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Hero */}
      <section className="px-5 py-4">
        <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: "240px" }}>
          <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=500&fit=crop&auto=format&q=80" alt="Turismo" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />
          <div className="relative z-10 p-6 max-w-[60%]">
            <p className="text-[10px] tracking-[0.2em] text-[#00796B] font-semibold uppercase">Explore e descubra.</p>
            <h1 className="text-[28px] leading-[1.1] font-semibold mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="text-[#00796B]">Turismo</span> & Lazer.
            </h1>
            <p className="text-[12px] text-[#6B7280] mt-3 leading-relaxed">Encontre as melhores experiências de viagem, passeios e actividades recreativas em Angola.</p>
            <button onClick={() => navigate("/explorar-turismo")} className="mt-4 flex items-center gap-2 bg-[#00796B] text-white text-[12px] font-medium px-4 py-2.5 rounded-full hover:bg-[#004D40] transition-colors">
              Explorar serviços <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Province */}
      <section className="px-5 py-3">
        <div className="flex items-center gap-4 bg-white rounded-2xl px-4 py-4 border border-[#b2dfdb]">
          <div className="w-10 h-10 rounded-full bg-[#e0f2f1] flex items-center justify-center"><MapPin size={18} className="text-[#00796B]" /></div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-[#00796B]">Em todas as províncias de Angola</p>
            <p className="text-[11px] text-[#6B7280]">Aventuras e experiências perto de si, onde estiver.</p>
          </div>
          <ChevronRight size={18} className="text-[#00796B]" />
        </div>
      </section>

      {/* Featured Stores */}
      {(featured.length > 0 || fallbackFeatured.length > 0) && (
        <section className="px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] font-semibold text-[#171717]">Lojas em destaque</h2>
            <button onClick={() => navigate("/explorar-turismo")} className="text-[12px] font-medium text-[#00838F] flex items-center gap-1">
              Ver todas <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
            {(featured.length > 0 ? featured : fallbackFeatured).map((store: any) => (
              <div key={store.id} className="flex-shrink-0 w-44 bg-white rounded-2xl overflow-hidden border border-[#B2EBF2] cursor-pointer" onClick={() => window.location.href = `/loja/${store.id}?from=turismo`}>
                <div className="h-28 overflow-hidden">
                  <img src={store.coverImage || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&auto=format&q=80"} alt={store.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h4 className="text-[13px] font-semibold text-[#171717] truncate">{store.name}</h4>
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
        <StoreCategorySection categories={CATEGORIES} stores={stores} storeType="turismo-lazer" exploreRoute="/explorar-turismo" />
      )}

      {/* Counter */}
      <section className="px-5 py-3">
        <div className="flex items-center justify-center gap-2 bg-[#e0f2f1] rounded-2xl px-4 py-3 border border-[#b2dfdb]">
          <Heart size={16} className="text-[#00796B]" />
          <span className="text-[13px] font-medium text-[#1a3a3a]">Mais de <span className="text-[#00796B] font-bold">+2.500</span> viajantes satisfeitos com as nossas experiências turísticas.</span>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="px-5 py-3">
        <div className="trust-scroll">
          {TRUST_BADGES.map((badge, i) => (
            <div key={i} className="trust-item">
              <span className="text-[#00796B]">{badge.icon}</span>
              <span className="text-[11px] font-medium text-[#1a3a3a]">{badge.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center py-6 px-5">
        <p className="text-[11px] text-[#9CA3AF]">YESOLA TURISMO · EXPLORE ANGOLA COM NÓS.</p>
      </div>
    </div>
  );
}
