import { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchStores } from "@/lib/api";
import {
  Heart, ChevronRight, MapPin, Menu, X,
  ShieldCheck, BadgeCheck, CreditCard, HeadphonesIcon,
} from "lucide-react";
import StoreCategorySection from "@/components/StoreCategorySection";

const CATEGORIES = [
  { id: "limpeza", name: "Limpeza Residencial", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#8B4513" strokeWidth="1.5"><path d="M8 28h16M10 28V16l6-8 6 8v12" /><rect x="13" y="20" width="6" height="8" /></svg> },
  { id: "canalizacao", name: "Canalização", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#8B4513" strokeWidth="1.5"><path d="M16 4v12M12 16h8M10 28h12" /><circle cx="16" cy="28" r="2" /></svg> },
  { id: "eletricistas", name: "Eletricistas", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#8B4513" strokeWidth="1.5"><path d="M18 4L10 18h6l-2 10 8-14h-6l2-10z" /></svg> },
  { id: "pintura", name: "Pintura", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#8B4513" strokeWidth="1.5"><rect x="6" y="6" width="20" height="16" rx="2" /><path d="M6 22v4M26 22v4M10 26h12" /><path d="M12 10h8M12 14h4" /></svg> },
  { id: "carpintaria", name: "Carpintaria & Marcenaria", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#8B4513" strokeWidth="1.5"><rect x="6" y="8" width="20" height="20" rx="2" /><path d="M10 8V6c0-1 .5-2 2-2h8c1.5 0 2 1 2 2v2" /><path d="M6 16h20" /></svg> },
  { id: "decoracao", name: "Decoração & Interiores", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#8B4513" strokeWidth="1.5"><circle cx="16" cy="14" r="5" /><path d="M16 19v8" /><path d="M12 27h8" /><path d="M11 14c-3-2-3-6 0-7s6 1 5 4" /><path d="M21 14c3-2 3-6 0-7s-6 1-5 4" /></svg> },
  { id: "jardinagem", name: "Jardinagem", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#8B4513" strokeWidth="1.5"><path d="M16 28v-8M12 20c-4 0-8-4-8-8 4 0 8 4 8 8z" /><path d="M20 20c4 0 8-4 8-8-4 0-8 4-8 8z" /><path d="M16 20c-2-4-2-8 0-12 2 4 2 8 0 12z" /></svg> },
  { id: "mudancas", name: "Mudanças & Transporte", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#8B4513" strokeWidth="1.5"><rect x="4" y="10" width="18" height="14" rx="2" /><path d="M22 14h4l4 6v4h-8" /><circle cx="10" cy="24" r="3" /><circle cx="26" cy="24" r="3" /></svg> },
  { id: "reparacoes", name: "Reparações & Manutenção", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#8B4513" strokeWidth="1.5"><path d="M14 4l-4 4 8 8-4 4 8 8 4-4" /><path d="M18 8l8 8" /><path d="M10 24l-4 4" /></svg> },
  { id: "seguranca", name: "Segurança Residencial", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#8B4513" strokeWidth="1.5"><path d="M16 4L6 10v6c0 6 4.5 11.6 10 13 5.5-1.4 10-7 10-13v-6L16 4z" /><path d="M12 16l3 3 5-6" /></svg> },
];

const TRUST_BADGES = [
  { icon: <ShieldCheck size={18} />, label: "Profissionais verificados" },
  { icon: <BadgeCheck size={18} />, label: "Serviços com garantia" },
  { icon: <CreditCard size={18} />, label: "Agendamento fácil" },
  { icon: <HeadphonesIcon size={18} />, label: "Apoio ao cliente" },
];

export default function CasaHome({ onBackToSelector }: { onBackToSelector?: () => void }) {
  useThemeColor("#FFF8F0");
  const [, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ["stores", "casa"],
    queryFn: () => fetchStores({ storeType: "casa" }),
    staleTime: 60_000,
  });

  return (
    <div className="min-h-[100dvh] bg-[#FFF8F0] text-[#2D2C2B] pb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .cat-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px; }
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-item { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 10px; background: white; border-radius: 14px; border: 1px solid #EDE8DE; min-width: 72px; cursor: pointer; transition: all 0.2s; }
        .cat-item:hover { border-color: #8B4513; background: #FFF8F0; }
        .trust-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; }
        .trust-scroll::-webkit-scrollbar { display: none; }
        .trust-item { flex-shrink: 0; display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: white; border-radius: 12px; border: 1px solid #EDE8DE; }
        .provider-card { flex-shrink: 0; width: 160px; background: white; border-radius: 16px; overflow: hidden; border: 1px solid #EDE8DE; cursor: pointer; transition: all 0.2s; }
        .provider-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FFF8F0]/95 backdrop-blur-md border-b border-[#EDE8DE]/60">
        <div className="flex items-center justify-between px-5 py-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
          <div className="flex flex-col items-center">
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 600, color: "#2d2c2b" }}>YESOLA</span>
            <span className="text-[9px] tracking-[0.25em] text-[#8B4513] font-semibold uppercase mt-0.5">Casa & Serviços</span>
          </div>

        </div>
        {menuOpen && (
          <div className="bg-[#FFF8F0] border-t border-[#EDE8DE]/60 px-5 py-4 flex flex-col gap-3 text-sm font-medium">
            <a href="/login-casa" className="py-2">Entrar</a>
            {onBackToSelector && <button onClick={onBackToSelector} className="py-2 text-left">Trocar loja</button>}
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="px-5 py-4">
        <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: "280px" }}>
          <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=500&fit=crop&auto=format&q=80" alt="Casa" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFF8F0]/95 via-[#FFF8F0]/70 to-transparent" />
          <div className="relative z-10 p-6 max-w-[55%]">
            <h1 className="text-[28px] leading-[1.1] font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
              O cuidado<br />que a sua<br /><span className="text-[#8B4513]">casa</span> merece.
            </h1>
            <p className="text-[12px] text-[#6B7280] mt-3 leading-relaxed">Profissionais qualificados para tornar o seu lar mais bonito, seguro e funcional, com qualidade e confiança.</p>
            <button onClick={() => navigate("/explorar-casa")} className="mt-4 flex items-center gap-2 bg-[#8B4513] text-white text-[12px] font-medium px-4 py-2.5 rounded-full hover:bg-[#6B3410] transition-colors">
              Encontrar profissional <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-5 pt-4 pb-2">
        <div className="cat-scroll">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => navigate(`/explorar-casa?categoria=${cat.id}`)} className="cat-item">
              <div className="w-10 h-10 flex items-center justify-center">{cat.icon}</div>
              <span className="text-[10px] font-medium text-[#2D2C2B] text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Province */}
      <section className="px-5 py-3">
        <div className="flex items-center gap-4 bg-white rounded-2xl px-4 py-4 border border-[#EDE8DE]">
          <div className="w-10 h-10 rounded-full bg-[#FFF8F0] flex items-center justify-center"><MapPin size={18} className="text-[#8B4513]" /></div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-[#8B4513]">Em todas as províncias de Angola</p>
            <p className="text-[11px] text-[#6B7280]">Serviços para o seu lar, perto de si, onde estiver.</p>
          </div>
          <ChevronRight size={18} className="text-[#8B4513]" />
        </div>
      </section>

      {/* Featured Stores */}
      {stores.length > 0 && (
        <section className="px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] font-semibold text-[#2D2C2B]">Lojas em destaque</h2>
            <button onClick={() => navigate("/explorar-casa")} className="text-[12px] font-medium text-[#8B4513] flex items-center gap-1">
              Ver todas <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
            {stores.filter((s: any) => s.phone !== "999999999").slice(0, 6).map((store: any) => (
              <div
                key={store.id}
                className="provider-card"
                onClick={() => window.location.href = `/loja/${store.id}?from=casa`}
              >
                <div className="h-28 overflow-hidden">
                  <img
                    src={store.coverImage || store.image || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format&q=80"}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h4 className="text-[13px] font-semibold text-[#2D2C2B] truncate">{store.name}</h4>
                  <p className="text-[10px] text-[#9CA3AF] mt-0.5">{store.category}</p>
                  {store.province && (
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin size={10} className="text-[#9CA3AF]" />
                      <span className="text-[10px] text-[#9CA3AF]">{store.province}</span>
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
        <StoreCategorySection categories={CATEGORIES} stores={stores} storeType="casa" exploreRoute="/explorar-casa" />
      )}

      {/* Trust Badges */}
      <section className="px-5 py-3">
        <div className="trust-scroll">
          {TRUST_BADGES.map((badge, i) => (
            <div key={i} className="trust-item">
              <span className="text-[#8B4513]">{badge.icon}</span>
              <span className="text-[11px] font-medium text-[#2D2C2B]">{badge.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center py-6 px-5">
        <p className="text-[11px] text-[#9CA3AF]">YESOLA CASA · PROFISSIONAIS VERIFICADOS · CONFIANÇA E SEGURANÇA.</p>
      </div>
    </div>
  );
}
