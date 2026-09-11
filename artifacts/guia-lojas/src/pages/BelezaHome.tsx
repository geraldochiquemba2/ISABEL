import { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchStores } from "@/lib/api";
import {
  Heart, ChevronRight, MapPin, Menu, X, TrendingUp,
  ShieldCheck, BadgeCheck, CreditCard, HeadphonesIcon,
} from "lucide-react";
import StoreCategorySection from "@/components/StoreCategorySection";

const CATEGORIES = [
  { id: "cabelo", name: "Cabelo", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#7A4549" strokeWidth="1.5"><path d="M16 4c-4 0-8 4-8 10s4 10 8 10 8-4 8-10-4-10-8-10z" /><path d="M16 4v24" /><path d="M8 12c4 2 12 2 16 0" /><path d="M8 20c4-2 12-2 16 0" /></svg> },
  { id: "unhas", name: "Unhas", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#7A4549" strokeWidth="1.5"><rect x="12" y="4" width="8" height="20" rx="4" /><path d="M12 24v4M20 24v4" /><path d="M16 8v4" /></svg> },
  { id: "maquiagem", name: "Maquiagem", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#7A4549" strokeWidth="1.5"><path d="M8 28l4-16 8 4-4 16z" /><circle cx="24" cy="8" r="4" /><path d="M20 12l-4 4" /></svg> },
  { id: "rosto-pele", name: "Rosto & Pele", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#7A4549" strokeWidth="1.5"><circle cx="16" cy="16" r="10" /><circle cx="12" cy="14" r="1.5" fill="#7A4549" /><circle cx="20" cy="14" r="1.5" fill="#7A4549" /><path d="M12 20c2 2 6 2 8 0" /></svg> },
  { id: "corpo-spa", name: "Corpo & Spa", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#7A4549" strokeWidth="1.5"><path d="M16 28s-10-6.5-10-14c0-4 3-7 6-7 2 0 3 1 4 3 1-2 2-3 4-3 3 0 6 3 6 7 0 7.5-10 14-10 14z" /></svg> },
  { id: "depilacao", name: "Depilação", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#7A4549" strokeWidth="1.5"><path d="M8 28l4-12 4 4-4 12z" /><path d="M20 28l4-12-4-4-4 4z" /><circle cx="16" cy="8" r="3" /></svg> },
];



const TRUST_BADGES = [
  { icon: <ShieldCheck size={18} />, label: "Profissionais verificados" },
  { icon: <BadgeCheck size={18} />, label: "Qualidade comprovada" },
  { icon: <CreditCard size={18} />, label: "Agendamento fácil" },
  { icon: <HeadphonesIcon size={18} />, label: "Apoio ao cliente" },
];

export default function BelezaHome({ onBackToSelector }: { onBackToSelector?: () => void }) {
  useThemeColor("#FBF7F2");
  const [, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ["stores", "beleza"],
    queryFn: () => fetchStores({ storeType: "beleza" }),
    staleTime: 60_000,
  });

  const nonAdmin = stores.filter((s: any) => s.phone !== "999999999");
  const featured = nonAdmin.filter((s: any) => s.isFeatured).slice(0, 6);
  const trending = nonAdmin.filter((s: any) => s.isTrending).slice(0, 6);
  const fallbackFeatured = !featured.length ? nonAdmin.slice(0, 6) : [];

  return (
    <div className="min-h-[100dvh] bg-[#FBF7F2] text-[#292727] pb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .cat-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px; }
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-item { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 10px; background: white; border-radius: 14px; border: 1px solid #EAD9D5; min-width: 72px; cursor: pointer; transition: all 0.2s; }
        .cat-item:hover { border-color: #7A4549; background: #FBF7F2; }
        .trust-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; }
        .trust-scroll::-webkit-scrollbar { display: none; }
        .trust-item { flex-shrink: 0; display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: white; border-radius: 12px; border: 1px solid #EAD9D5; }
        .service-card { flex-shrink: 0; width: 160px; background: white; border-radius: 16px; overflow: hidden; border: 1px solid #EAD9D5; cursor: pointer; transition: all 0.2s; }
        .service-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FBF7F2]/95 backdrop-blur-md border-b border-[#EAD9D5]/60">
        <div className="flex items-center justify-between px-5 py-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
          <div className="flex flex-col items-center">
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 600, color: "#2d2c2b" }}>YESOLA</span>
            <span className="text-[9px] tracking-[0.25em] text-[#7A4549] font-semibold uppercase mt-0.5">Beleza & Bem-estar</span>
          </div>

        </div>
        {menuOpen && (
          <div className="bg-[#FBF7F2] border-t border-[#EAD9D5]/60 px-5 py-4 flex flex-col gap-3 text-sm font-medium">
            <a href="/login-beleza" className="py-2">Entrar</a>
            {onBackToSelector && <button onClick={onBackToSelector} className="py-2 text-left">Trocar loja</button>}
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="px-5 py-4">
        <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: "280px" }}>
          <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=500&fit=crop&auto=format&q=80" alt="Beleza" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FBF7F2]/95 via-[#FBF7F2]/70 to-transparent" />
          <div className="relative z-10 p-6 max-w-[55%]">
            <h1 className="text-[28px] leading-[1.1] font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Beleza &<br /><span className="text-[#7A4549]">Bem-estar</span>
            </h1>
            <p className="text-[12px] text-[#697482] mt-3 leading-relaxed">Cuide de si. Porque você é especial, e merece o melhor.</p>
            <button onClick={() => navigate("/explorar-beleza")} className="mt-4 flex items-center gap-2 bg-[#7A4549] text-white text-[12px] font-medium px-4 py-2.5 rounded-full hover:bg-[#5A3335] transition-colors">
              Descubra, reserve e transforme-se <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="px-5 py-2">
        <div className="relative">
          <input type="text" placeholder="O que procura hoje?" className="w-full bg-white border border-[#EAD9D5] rounded-full px-5 py-3 text-sm text-[#292727] placeholder:text-[#697482] outline-none focus:border-[#7A4549] transition-colors" />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#697482" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
      </section>

      {/* Categories */}
      <section className="px-5 pt-4 pb-2">
        <div className="cat-scroll">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => navigate(`/explorar-beleza?categoria=${cat.id}`)} className="cat-item">
              <div className="w-10 h-10 flex items-center justify-center">{cat.icon}</div>
              <span className="text-[10px] font-medium text-[#292727] text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Em Alta */}
      {trending.length > 0 && (
        <section className="px-5 py-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-[#7A4549]" />
            <h2 className="text-[17px] font-semibold text-[#292727]">Em alta</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
            {trending.map((store: any) => (
              <div key={store.id} className="service-card" onClick={() => window.location.href = `/loja/${store.id}?from=beleza`}>
                <div className="h-28 overflow-hidden">
                  <img src={store.coverImage || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop&auto=format&q=80"} alt={store.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h4 className="text-[13px] font-semibold text-[#292727] truncate">{store.name}</h4>
                  <p className="text-[10px] text-[#697482] mt-0.5">{store.category}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Stores */}
      {(featured.length > 0 || fallbackFeatured.length > 0) && (
        <section className="px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] font-semibold text-[#292727]">Lojas em destaque</h2>
            <button onClick={() => navigate("/explorar-beleza")} className="text-[12px] font-medium text-[#7A4549] flex items-center gap-1">
              Ver todas <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
            {(featured.length > 0 ? featured : fallbackFeatured).map((store: any) => (
              <div key={store.id} className="service-card" onClick={() => window.location.href = `/loja/${store.id}?from=beleza`}>
                <div className="h-28 overflow-hidden">
                  <img src={store.coverImage || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop&auto=format&q=80"} alt={store.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h4 className="text-[13px] font-semibold text-[#292727] truncate">{store.name}</h4>
                  <p className="text-[10px] text-[#697482] mt-0.5">{store.category}</p>
                  {store.province && (
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin size={10} className="text-[#697482]" />
                      <span className="text-[10px] text-[#697482]">{store.province}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Promo Banner */}
      <section className="px-5 py-3">
        <div className="bg-white rounded-2xl px-5 py-4 border border-[#EAD9D5] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#FBF7F2] flex items-center justify-center">
            <Heart size={20} className="text-[#7A4549]" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-[#292727]">Cuide de si com amor 💛</p>
            <p className="text-[11px] text-[#697482]">Agende, receba e sinta-se ainda melhor. Você merece!</p>
          </div>
          <button className="text-[12px] font-medium text-[#7A4549] border border-[#7A4549] px-4 py-2 rounded-full hover:bg-[#FBF7F2] transition-colors">
            Ver promoções
          </button>
        </div>
      </section>

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
        <StoreCategorySection categories={CATEGORIES} stores={stores} storeType="beleza" exploreRoute="/explorar-beleza" />
      )}

      {/* Province */}
      <section className="px-5 py-3">
        <div className="flex items-center gap-4 bg-white rounded-2xl px-4 py-4 border border-[#EAD9D5]">
          <div className="w-10 h-10 rounded-full bg-[#FBF7F2] flex items-center justify-center"><MapPin size={18} className="text-[#7A4549]" /></div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-[#7A4549]">Em todas as províncias de Angola</p>
            <p className="text-[11px] text-[#697482]">Serviços de beleza e bem-estar perto de si.</p>
          </div>
          <ChevronRight size={18} className="text-[#7A4549]" />
        </div>
      </section>

      {/* Trust Badges */}
      <section className="px-5 py-3">
        <div className="trust-scroll">
          {TRUST_BADGES.map((badge, i) => (
            <div key={i} className="trust-item">
              <span className="text-[#7A4549]">{badge.icon}</span>
              <span className="text-[11px] font-medium text-[#292727]">{badge.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center py-6 px-5">
        <p className="text-[11px] text-[#697482]">YESOLA BELEZA · CUIDE DE SI PORQUE MERECE O MELHOR.</p>
      </div>
    </div>
  );
}
