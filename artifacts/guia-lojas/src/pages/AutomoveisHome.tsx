import { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchStores } from "@/lib/api";
import {
  Heart, ChevronRight, Star, MapPin, Menu, X,
  ShieldCheck, BadgeCheck, CreditCard, HeadphonesIcon,
} from "lucide-react";
import StoreCategorySection from "@/components/StoreCategorySection";

const CATEGORIES = [
  { id: "venda-carros", name: "Venda de Carros", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#c9913a" strokeWidth="1.5"><path d="M5 20h22l-2-8H7L5 20z"/><circle cx="10" cy="22" r="2"/><circle cx="22" cy="22" r="2"/><path d="M7 12l1-4h16l1 4"/></svg> },
  { id: "aluguer-viaturas", name: "Aluguer de Viaturas", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#c9913a" strokeWidth="1.5"><rect x="4" y="12" width="24" height="10" rx="2"/><path d="M8 12V9a2 2 0 012-2h12a2 2 0 012 2v3"/><circle cx="10" cy="24" r="2"/><circle cx="22" cy="24" r="2"/><path d="M14 17h4"/></svg> },
  { id: "oficinas-mecanicos", name: "Oficinas & Mecânicos", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#c9913a" strokeWidth="1.5"><circle cx="16" cy="16" r="10"/><path d="M16 10v6l4 4"/><path d="M16 6v2M16 24v2M6 16h2M24 16h2"/></svg> },
  { id: "pecas-acessorios", name: "Peças & Acessórios", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#c9913a" strokeWidth="1.5"><circle cx="16" cy="16" r="6"/><path d="M16 4v4M16 24v4M4 16h4M24 16h4M7.5 7.5l2.8 2.8M21.7 21.7l2.8 2.8M7.5 24.5l2.8-2.8M21.7 10.3l2.8-2.8"/></svg> },
  { id: "lavagem-detailing", name: "Lavagem & Detailing", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#c9913a" strokeWidth="1.5"><path d="M10 6c0 4-4 6-4 10a6 6 0 0012 0c0-4-4-6-4-10"/><path d="M14 6c0 3-3 5-3 8a4.5 4.5 0 009 0c0-3-3-5-3-8"/></svg> },
  { id: "servicos-transporte", name: "Serviços de Transporte", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#c9913a" strokeWidth="1.5"><rect x="4" y="10" width="24" height="14" rx="2"/><path d="M4 18h24"/><circle cx="10" cy="26" r="2"/><circle cx="22" cy="26" r="2"/><path d="M8 10V8h16v2"/></svg> },
  { id: "assistencia-viagem", name: "Assistência em Viagem", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#c9913a" strokeWidth="1.5"><path d="M16 4l12 8v12l-12 4L4 24V12l12-8z"/><path d="M16 16v12"/><path d="M4 12l12 4 12-4"/></svg> },
  { id: "seguros-auto", name: "Seguros Automóvel", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#c9913a" strokeWidth="1.5"><path d="M16 4L6 10v6c0 6 4.5 11.6 10 13 5.5-1.4 10-7 10-13v-6L16 4z"/><path d="M12 16l3 3 5-6"/></svg> },
  { id: "insepcao-doc", name: "Inspecção & Documentação", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#c9913a" strokeWidth="1.5"><rect x="8" y="4" width="16" height="24" rx="2"/><path d="M12 10h8M12 14h8M12 18h5"/><path d="M16 22l2 2 4-4"/></svg> },
  { id: "estacionamentos", name: "Estacionamentos & Garagens", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#c9913a" strokeWidth="1.5"><rect x="4" y="8" width="24" height="18" rx="2"/><path d="M12 14v6M16 14h4a2 2 0 010 4h-4v4"/></svg> },
];

const TRUST_BADGES = [
  { icon: <ShieldCheck size={18} />, label: "Profissionais verificados" },
  { icon: <BadgeCheck size={18} />, label: "Qualidade comprovada" },
  { icon: <CreditCard size={18} />, label: "Agendamento fácil" },
  { icon: <HeadphonesIcon size={18} />, label: "Apoio ao cliente" },
];

export default function AutomoveisHome({ onBackToSelector }: { onBackToSelector?: () => void }) {
  useThemeColor("#0f1d32");
  const [, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ["stores", "automoveis"],
    queryFn: () => fetchStores({ storeType: "automoveis" }),
    staleTime: 60_000,
  });

  return (
    <div className="min-h-[100dvh] bg-[#f4f6f9] text-[#1a2744] pb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .cat-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px; }
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-item { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 10px; background: white; border-radius: 14px; border: 1px solid #e2e8f0; min-width: 72px; cursor: pointer; transition: all 0.2s; }
        .cat-item:hover { border-color: #c9913a; background: #fefbf4; }
        .trust-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; }
        .trust-scroll::-webkit-scrollbar { display: none; }
        .trust-item { flex-shrink: 0; display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: white; border-radius: 12px; border: 1px solid #e2e8f0; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f1d32]/95 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between px-5 py-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 text-white">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
          <div className="flex flex-col items-center">
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 600, color: "#fff" }}>YESOLA</span>
            <span className="text-[9px] tracking-[0.25em] text-[#c9913a] font-semibold uppercase mt-0.5">Automóveis & Mobilidade</span>
          </div>

        </div>
        {menuOpen && (
          <div className="bg-[#0f1d32] border-t border-white/10 px-5 py-4 flex flex-col gap-3 text-sm font-medium">
            <a href="/login-automoveis" className="py-2 text-white">Entrar</a>
            {onBackToSelector && <button onClick={onBackToSelector} className="py-2 text-left text-white/70">Trocar loja</button>}
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ minHeight: "320px" }}>
        <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&h=500&fit=crop&auto=format&q=80" alt="Automóveis" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1d32]/95 via-[#0f1d32]/70 to-transparent" />
        <div className="relative z-10 p-6 max-w-[65%] pt-10">
          <p className="text-[10px] tracking-[0.2em] text-[#c9913a] font-semibold uppercase">O caminho certo para chegar mais longe.</p>
          <h1 className="text-[28px] leading-[1.1] font-semibold mt-2 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Automóveis &<br /><span className="text-[#c9913a]">Mobilidade.</span>
          </h1>
          <p className="text-[12px] text-white/70 mt-3 leading-relaxed max-w-[280px]">Encontre carros, serviços e profissionais que garantem segurança, qualidade e tranquilidade para si e para a sua família.</p>
          <button onClick={() => navigate("/explorar-automoveis")} className="mt-4 flex items-center gap-2 bg-[#c9913a] text-white text-[12px] font-medium px-4 py-2.5 rounded-full hover:bg-[#b57e30] transition-colors">
            Explorar serviços <ChevronRight size={14} />
          </button>
        </div>
        <div className="absolute right-4 bottom-4 z-10 bg-[#0f1d32]/80 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/10">
          <p className="text-[10px] text-[#c9913a] font-semibold">Profissionais verificados</p>
          <p className="text-[9px] text-white/60">Confiança e segurança em cada serviço.</p>
        </div>
      </section>

      {/* Categories */}
      <section className="px-5 pt-4 pb-2">
        <div className="cat-scroll">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => navigate(`/explorar-automoveis?categoria=${cat.id}`)} className="cat-item">
              <div className="w-10 h-10 flex items-center justify-center">{cat.icon}</div>
              <span className="text-[10px] font-medium text-[#1a2744] text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Province Banner */}
      <section className="px-5 py-3">
        <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: "120px" }}>
          <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=300&fit=crop&auto=format&q=80" alt="Angola" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f1d32]/90 via-[#0f1d32]/60 to-transparent" />
          <div className="relative z-10 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#c9913a]/20 flex items-center justify-center"><MapPin size={20} className="text-[#c9913a]" /></div>
            <div>
              <p className="text-[14px] font-semibold text-[#c9913a]">Em todas as províncias de Angola</p>
              <p className="text-[11px] text-white/70">Soluções de mobilidade perto de si, onde estiver.</p>
            </div>
          </div>
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
        <StoreCategorySection categories={CATEGORIES} stores={stores} storeType="automoveis" exploreRoute="/explorar-automoveis" />
      )}

      {/* Counter */}
      <section className="px-5 py-3">
        <div className="flex items-center justify-center gap-2 bg-[#0f1d32] rounded-2xl px-4 py-3">
          <Heart size={16} className="text-[#c9913a]" />
          <span className="text-[13px] font-medium text-white">Mais de <span className="text-[#c9913a] font-bold">+500</span> profissionais em toda Angola.</span>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="px-5 py-3">
        <div className="trust-scroll">
          {TRUST_BADGES.map((badge, i) => (
            <div key={i} className="trust-item">
              <span className="text-[#c9913a]">{badge.icon}</span>
              <span className="text-[11px] font-medium text-[#1a2744]">{badge.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center py-6 px-5">
        <p className="text-[11px] text-[#9CA3AF]">YESOLA AUTOMÓVEIS · O CAMINHO CERTO PARA CHEGAR MAIS LONGE.</p>
      </div>
    </div>
  );
}
