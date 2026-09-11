import { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchStores } from "@/lib/api";
import { Store } from "@/data/mock";
import {
  Heart, ChevronRight, Star, MapPin, Menu, X,
  ShieldCheck, BadgeCheck, CreditCard, HeadphonesIcon,
} from "lucide-react";
import StoreCategorySection from "@/components/StoreCategorySection";

const CATEGORIES = [
  { id: "hoteis", name: "Hotéis & Resorts", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#0B2D56" strokeWidth="1.5"><rect x="4" y="8" width="24" height="20" rx="2" /><path d="M4 14h24" /><rect x="8" y="18" width="6" height="4" rx="1" /><rect x="18" y="18" width="6" height="4" rx="1" /><circle cx="16" cy="11" r="2" /></svg> },
  { id: "alojamento", name: "Alojamento", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#0B2D56" strokeWidth="1.5"><path d="M4 16l12-10 12 10" /><path d="M7 14v12h18V14" /><rect x="12" y="20" width="8" height="6" /></svg> },
  { id: "imobiliaria", name: "Imobiliária", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#0B2D56" strokeWidth="1.5"><rect x="4" y="8" width="24" height="20" rx="2" /><path d="M10 8V6c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v2" /><path d="M16 18v-4M14 16h4" /></svg> },
];

const TRUST_BADGES = [
  { icon: <ShieldCheck size={18} />, label: "Compra segura" },
  { icon: <BadgeCheck size={18} />, label: "Imóveis verificados" },
  { icon: <CreditCard size={18} />, label: "Pagamentos seguros" },
  { icon: <HeadphonesIcon size={18} />, label: "Apoio dedicado" },
];

export default function ImoveisHome({ onBackToSelector }: { onBackToSelector?: () => void }) {
  useThemeColor("#FAFAFA");
  const [, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ["stores", "imoveis"],
    queryFn: () => fetchStores({ storeType: "imoveis" }),
    staleTime: 60_000,
  });

  return (
    <div className="min-h-[100dvh] bg-[#FAFAFA] text-[#171717] pb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .cat-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px; }
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-item { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 10px; background: white; border-radius: 14px; border: 1px solid #A7B3C5; min-width: 72px; cursor: pointer; transition: all 0.2s; }
        .cat-item:hover { border-color: #0B2D56; background: #F4EBD7; }
        .trust-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; }
        .trust-scroll::-webkit-scrollbar { display: none; }
        .trust-item { flex-shrink: 0; display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: white; border-radius: 12px; border: 1px solid #A7B3C5; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FAFAFA]/95 backdrop-blur-md border-b border-[#A7B3C5]/60">
        <div className="flex items-center justify-between px-5 py-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
          <div className="flex flex-col items-center">
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 600, color: "#2d2c2b" }}>YESOLA</span>
            <span className="text-[9px] tracking-[0.25em] text-[#0B2D56] font-semibold uppercase mt-0.5">Imóveis</span>
          </div>

        </div>
        {menuOpen && (
          <div className="bg-[#FAFAFA] border-t border-[#A7B3C5]/60 px-5 py-4 flex flex-col gap-3 text-sm font-medium">
            <a href="/login-imoveis" className="py-2">Entrar</a>
            {onBackToSelector && <button onClick={onBackToSelector} className="py-2 text-left">Trocar loja</button>}
          </div>
        )}
      </header>

      {/* Categories */}
      <section className="px-5 pt-4 pb-2">
        <div className="cat-scroll">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => navigate(`/explorar-imoveis?categoria=${cat.id}`)} className="cat-item">
              <div className="w-10 h-10 flex items-center justify-center">{cat.icon}</div>
              <span className="text-[10px] font-medium text-[#171717] text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Hero */}
      <section className="px-5 py-4">
        <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: "240px" }}>
          <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=500&fit=crop&auto=format&q=80" alt="Imóveis" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />
          <div className="relative z-10 p-6 max-w-[60%]">
            <p className="text-[10px] tracking-[0.2em] text-[#0B2D56] font-semibold uppercase">Encontre o lar perfeito.</p>
            <h1 className="text-[28px] leading-[1.1] font-semibold mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Imóveis que<br />cabem no <span className="text-[#0B2D56]">seu bolso.</span>
            </h1>
            <p className="text-[12px] text-[#A7B3C5] mt-3 leading-relaxed">Compre, arrende ou invista em imóveis verificados por toda Angola.</p>
            <button onClick={() => navigate("/explorar-imoveis")} className="mt-4 flex items-center gap-2 bg-[#0B2D56] text-white text-[12px] font-medium px-4 py-2.5 rounded-full hover:bg-[#D4AF37] transition-colors">
              Explorar imóveis <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Province */}
      <section className="px-5 py-3">
        <div className="flex items-center gap-4 bg-white rounded-2xl px-4 py-4 border border-[#A7B3C5]">
          <div className="w-10 h-10 rounded-full bg-[#F4EBD7] flex items-center justify-center"><MapPin size={18} className="text-[#0B2D56]" /></div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-[#0B2D56]">Escolha a sua província</p>
            <p className="text-[11px] text-[#A7B3C5]">Encontre imóveis perto de si.</p>
          </div>
          <ChevronRight size={18} className="text-[#0B2D56]" />
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
        <StoreCategorySection categories={CATEGORIES} stores={stores} storeType="imoveis" exploreRoute="/explorar-imoveis" />
      )}

      {/* Counter */}
      <section className="px-5 py-3">
        <div className="flex items-center justify-center gap-2 bg-[#F4EBD7] rounded-2xl px-4 py-3 border border-[#A7B3C5]">
          <Heart size={16} className="text-[#0B2D56]" />
          <span className="text-[13px] font-medium text-[#171717]">Mais de <span className="text-[#0B2D56] font-bold">+1.200</span> imóveis disponíveis em toda Angola.</span>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="px-5 py-3">
        <div className="trust-scroll">
          {TRUST_BADGES.map((badge, i) => (
            <div key={i} className="trust-item">
              <span className="text-[#0B2D56]">{badge.icon}</span>
              <span className="text-[11px] font-medium text-[#171717]">{badge.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center py-6 px-5">
        <p className="text-[11px] text-[#A7B3C5]">YESOLA IMÓVEIS · ENCONTRE O LAR PERFEITO PARA A SUA FAMÍLIA.</p>
      </div>
    </div>
  );
}
