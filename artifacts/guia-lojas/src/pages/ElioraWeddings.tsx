import { useState, useEffect } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchStores } from "@/lib/api";
import { Store } from "@/data/mock";
import StoreCategorySection from "@/components/StoreCategorySection";
import {
  Heart, ShoppingBag, Search, ChevronRight, Star, MapPin, Menu, X,
  ShieldCheck, BadgeCheck, CreditCard, HeadphonesIcon,
} from "lucide-react";

const CATEGORIES = [
  { id: "planeamento", name: "Planeamento", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#D4A843" strokeWidth="1.5"><rect x="4" y="4" width="24" height="24" rx="3" /><path d="M4 10h24M10 4v24" /></svg> },
  { id: "noivados", name: "Noivados", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#D4A843" strokeWidth="1.5"><path d="M16 28s-10-6.5-10-14c0-4 3-7 6-7 2 0 3 1 4 3 1-2 2-3 4-3 3 0 6 3 6 7 0 7.5-10 14-10 14z" /></svg> },
  { id: "fotografia", name: "Fotografia", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#D4A843" strokeWidth="1.5"><rect x="4" y="10" width="24" height="16" rx="3" /><circle cx="16" cy="18" r="5" /><circle cx="16" cy="18" r="2" /><rect x="12" y="7" width="8" height="3" rx="1" /></svg> },
  { id: "beleza", name: "Beleza", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#D4A843" strokeWidth="1.5"><circle cx="16" cy="10" r="6" /><path d="M6 28c0-5.5 4.5-10 10-10s10 4.5 10 10" /></svg> },
  { id: "decoracao", name: "Decoração", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#D4A843" strokeWidth="1.5"><circle cx="16" cy="14" r="5" /><path d="M16 19v8" /><path d="M12 27h8" /><path d="M11 14c-3-2-3-6 0-7s6 1 5 4" /><path d="M21 14c3-2 3-6 0-7s-6 1-5 4" /></svg> },
];

const TRUST_BADGES = [
  { icon: <ShieldCheck size={18} />, label: "Compra segura" },
  { icon: <BadgeCheck size={18} />, label: "Profissionais verificados" },
  { icon: <CreditCard size={18} />, label: "Pagamentos seguros" },
  { icon: <HeadphonesIcon size={18} />, label: "Apoio dedicado" },
];

function CategorySection({ categoryName, stores }: { categoryName: string; stores: Store[] }) {
  return null;
}

export function ElioraWeddings({ onBackToSelector }: { onBackToSelector?: () => void }) {
  useThemeColor("#FAF8F5");
  const [, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ["stores", "weddings"],
    queryFn: () => fetchStores({ storeType: "weddings" }),
    staleTime: 60_000,
  });

  return (
    <div className="min-h-[100dvh] bg-[#FAF8F5] text-[#2D2C2B] pb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .cat-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px; }
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-item { flex-shrink: 0; display: flex; flex-col; align-items: center; gap: 6px; padding: 12px 10px; background: white; border-radius: 14px; border: 1px solid #EDE8DE; min-width: 72px; cursor: pointer; transition: all 0.2s; }
        .cat-item:hover { border-color: #D4A843; background: #FBF7ED; }
        .trust-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; }
        .trust-scroll::-webkit-scrollbar { display: none; }
        .trust-item { flex-shrink: 0; display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: white; border-radius: 12px; border: 1px solid #EDE8DE; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EDE8DE]/60">
        <div className="flex items-center justify-between px-5 py-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
          <div className="flex flex-col items-center">
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 600, color: "#2d2c2b" }}>YESOLA</span>
            <span className="text-[9px] tracking-[0.25em] text-[#D4A843] font-semibold uppercase mt-0.5">Casamentos</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-1"><Search size={22} /></button>
            <button className="p-1"><ShoppingBag size={22} /></button>
          </div>
        </div>
        {menuOpen && (
          <div className="bg-[#FAF8F5] border-t border-[#EDE8DE]/60 px-5 py-4 flex flex-col gap-3 text-sm font-medium">
            <a href="/login-weddings" className="py-2">Entrar</a>
            {onBackToSelector && <button onClick={onBackToSelector} className="py-2 text-left">Trocar loja</button>}
          </div>
        )}
      </header>

      {/* Categories */}
      <section className="px-5 pt-4 pb-2">
        <div className="cat-scroll">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => navigate(`/explorar?categoria=${cat.id}`)} className="cat-item">
              <div className="w-10 h-10 flex items-center justify-center">{cat.icon}</div>
              <span className="text-[10px] font-medium text-[#2D2C2B] text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Hero */}
      <section className="px-5 py-4">
        <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: "240px" }}>
          <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=500&fit=crop&auto=format&q=80" alt="Casamento" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />
          <div className="relative z-10 p-6 max-w-[60%]">
            <p className="text-[10px] tracking-[0.2em] text-[#D4A843] font-semibold uppercase">O seu sonho. O nosso propósito.</p>
            <h1 className="text-[28px] leading-[1.1] font-semibold mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Tudo para o seu<br /><span className="text-[#D4A843]">casamento</span> perfeito.
            </h1>
            <p className="text-[12px] text-[#6B7280] mt-3 leading-relaxed">Encontre os melhores profissionais e serviços para tornar o seu grande dia inesquecível.</p>
            <button onClick={() => navigate("/explorar")} className="mt-4 flex items-center gap-2 bg-[#D4A843] text-white text-[12px] font-medium px-4 py-2.5 rounded-full hover:bg-[#C49A38] transition-colors">
              Explorar serviços <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Province */}
      <section className="px-5 py-3">
        <div className="flex items-center gap-4 bg-white rounded-2xl px-4 py-4 border border-[#EDE8DE]">
          <div className="w-10 h-10 rounded-full bg-[#FBF7ED] flex items-center justify-center"><MapPin size={18} className="text-[#D4A843]" /></div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-[#D4A843]">Escolha a sua província</p>
            <p className="text-[11px] text-[#6B7280]">Encontre serviços de casamentos perto de si.</p>
          </div>
          <ChevronRight size={18} className="text-[#D4A843]" />
        </div>
      </section>

      {/* Stores by Category */}
      <StoreCategorySection
        categories={CATEGORIES}
        stores={stores}
        storeType="weddings"
        exploreRoute="/explorar"
      />

      {/* Counter */}
      <section className="px-5 py-3">
        <div className="flex items-center justify-center gap-2 bg-[#FBF7ED] rounded-2xl px-4 py-3 border border-[#EDE8DE]">
          <Heart size={16} className="text-[#D4A843]" />
          <span className="text-[13px] font-medium text-[#2D2C2B]">Mais de <span className="text-[#D4A843] font-bold">+1.500</span> casamentos realizados com amor, dedicação e excelência.</span>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="px-5 py-3">
        <div className="trust-scroll">
          {TRUST_BADGES.map((badge, i) => (
            <div key={i} className="trust-item">
              <span className="text-[#D4A843]">{badge.icon}</span>
              <span className="text-[11px] font-medium text-[#2D2C2B]">{badge.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center py-6 px-5">
        <p className="text-[11px] text-[#9CA3AF]">YESOLA CASAMENTOS · O SEU DIA PERFEITO, DO SEU JEITO.</p>
      </div>
    </div>
  );
}

export default ElioraWeddings;
