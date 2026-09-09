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
  { id: "clinicas", name: "Clínicas & Hospitais", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#2E7D32" strokeWidth="1.5"><rect x="6" y="8" width="20" height="20" rx="2" /><path d="M16 14v8M12 18h8" /><rect x="10" y="4" width="12" height="6" rx="1" /></svg> },
  { id: "medicos", name: "Médicos Particulares", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#2E7D32" strokeWidth="1.5"><circle cx="16" cy="10" r="6" /><path d="M6 28c0-5.5 4.5-10 10-10s10 4.5 10 10" /><path d="M16 14v4M14 16h4" /></svg> },
  { id: "dentaria", name: "Medicina Dentária", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#2E7D32" strokeWidth="1.5"><path d="M10 8c-2 0-4 2-4 4 0 4 2 6 4 10 1 2 2 4 6 4s5-2 6-4c2-4 4-6 4-10 0-2-2-4-4-4-2 0-3 1-4 3-1-2-2-3-4-3-2 0-4 2-4 4 0 4 2 6 4 10" /></svg> },
  { id: "saude-mental", name: "Saúde Mental & Psicologia", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#2E7D32" strokeWidth="1.5"><circle cx="16" cy="12" r="8" /><path d="M12 28c0-4 2-6 4-8 2 2 4 4 4 8" /><path d="M13 11c0-1.5 1.5-3 3-3s3 1.5 3 3" /></svg> },
  { id: "pediatria", name: "Pediatria & Neonatologia", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#2E7D32" strokeWidth="1.5"><circle cx="16" cy="14" r="8" /><path d="M12 28c0-4 2-6 4-8 2 2 4 4 4 8" /><circle cx="14" cy="12" r="1" fill="#2E7D32" /><circle cx="18" cy="12" r="1" fill="#2E7D32" /><path d="M14 16c1 1 3 1 4 0" strokeLinecap="round" /></svg> },
  { id: "terapias", name: "Terapias Alternativas", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#2E7D32" strokeWidth="1.5"><path d="M16 28s-10-6.5-10-14c0-4 3-7 6-7 2 0 3 1 4 3 1-2 2-3 4-3 3 0 6 3 6 7 0 7.5-10 14-10 14z" /></svg> },
  { id: "nutricao", name: "Nutrição & Dietética", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#2E7D32" strokeWidth="1.5"><path d="M8 28h16M10 28V16l6-8 6 8v12" /><rect x="13" y="20" width="6" height="8" /></svg> },
  { id: "fisioterapia", name: "Fisioterapia & Reabilitação", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#2E7D32" strokeWidth="1.5"><circle cx="16" cy="16" r="10" /><path d="M16 10v6l4 4" /><path d="M16 6v2M16 24v2M6 16h2M24 16h2" /></svg> },
  { id: "analises", name: "Análises Clínicas & Exames", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#2E7D32" strokeWidth="1.5"><rect x="8" y="4" width="16" height="24" rx="2" /><path d="M12 10h8M12 14h8M12 18h5" /><path d="M16 22l2 2 4-4" /></svg> },
  { id: "planos", name: "Planos de Saúde & Seguros", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#2E7D32" strokeWidth="1.5"><path d="M16 4L6 10v6c0 6 4.5 11.6 10 13 5.5-1.4 10-7 10-13v-6L16 4z" /><path d="M12 16l3 3 5-6" /></svg> },
];

const TRUST_BADGES = [
  { icon: <ShieldCheck size={18} />, label: "Profissionais verificados" },
  { icon: <BadgeCheck size={18} />, label: "Qualidade comprovada" },
  { icon: <CreditCard size={18} />, label: "Agendamento fácil" },
  { icon: <HeadphonesIcon size={18} />, label: "Apoio ao cliente" },
];

export default function SaúdeHome({ onBackToSelector }: { onBackToSelector?: () => void }) {
  useThemeColor("#f0f7f0");
  const [, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ["stores", "saude"],
    queryFn: () => fetchStores({ storeType: "saude" }),
    staleTime: 60_000,
  });

  return (
    <div className="min-h-[100dvh] bg-[#f0f7f0] text-[#1a3a1a] pb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .cat-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px; }
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-item { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 10px; background: white; border-radius: 14px; border: 1px solid #d4e8d4; min-width: 72px; cursor: pointer; transition: all 0.2s; }
        .cat-item:hover { border-color: #2E7D32; background: #f5faf5; }
        .trust-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; }
        .trust-scroll::-webkit-scrollbar { display: none; }
        .trust-item { flex-shrink: 0; display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: white; border-radius: 12px; border: 1px solid #d4e8d4; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#f0f7f0]/95 backdrop-blur-md border-b border-[#d4e8d4]/60">
        <div className="flex items-center justify-between px-5 py-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
          <div className="flex flex-col items-center">
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 600, color: "#1a3a1a" }}>YESOLA</span>
            <span className="text-[9px] tracking-[0.25em] text-[#2E7D32] font-semibold uppercase mt-0.5">Saúde & Bem-Estar</span>
          </div>

        </div>
        {menuOpen && (
          <div className="bg-[#f0f7f0] border-t border-[#d4e8d4]/60 px-5 py-4 flex flex-col gap-3 text-sm font-medium">
            <a href="/login-saude" className="py-2">Entrar</a>
            {onBackToSelector && <button onClick={onBackToSelector} className="py-2 text-left">Trocar loja</button>}
          </div>
        )}
      </header>

      {/* Categories */}
      <section className="px-5 pt-4 pb-2">
        <div className="cat-scroll">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => navigate(`/explorar-saude?categoria=${cat.id}`)} className="cat-item">
              <div className="w-10 h-10 flex items-center justify-center">{cat.icon}</div>
              <span className="text-[10px] font-medium text-[#1a3a1a] text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Hero */}
      <section className="px-5 py-4">
        <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: "240px" }}>
          <img src="https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=500&fit=crop&auto=format&q=80" alt="Saúde" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />
          <div className="relative z-10 p-6 max-w-[60%]">
            <p className="text-[10px] tracking-[0.2em] text-[#2E7D32] font-semibold uppercase">Cuide do seu maior tesouro.</p>
            <h1 className="text-[28px] leading-[1.1] font-semibold mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              A sua <span className="text-[#2E7D32]">saúde</span> em primeiro lugar.
            </h1>
            <p className="text-[12px] text-[#6B7280] mt-3 leading-relaxed">Encontre profissionais, clínicas e serviços que cuidam de si e da sua família com excelência, atenção e amor.</p>
            <button onClick={() => navigate("/explorar-saude")} className="mt-4 flex items-center gap-2 bg-[#2E7D32] text-white text-[12px] font-medium px-4 py-2.5 rounded-full hover:bg-[#1B5E20] transition-colors">
              Explorar serviços <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Province */}
      <section className="px-5 py-3">
        <div className="flex items-center gap-4 bg-white rounded-2xl px-4 py-4 border border-[#d4e8d4]">
          <div className="w-10 h-10 rounded-full bg-[#e8f5e9] flex items-center justify-center"><MapPin size={18} className="text-[#2E7D32]" /></div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-[#2E7D32]">Em todas as províncias de Angola</p>
            <p className="text-[11px] text-[#6B7280]">Serviços de saúde e bem-estar perto de si, onde estiver.</p>
          </div>
          <ChevronRight size={18} className="text-[#2E7D32]" />
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
        <StoreCategorySection categories={CATEGORIES} stores={stores} storeType="saude" exploreRoute="/explorar-saude" />
      )}

      {/* Counter */}
      <section className="px-5 py-3">
        <div className="flex items-center justify-center gap-2 bg-[#e8f5e9] rounded-2xl px-4 py-3 border border-[#d4e8d4]">
          <Heart size={16} className="text-[#2E7D32]" />
          <span className="text-[13px] font-medium text-[#1a3a1a]">Mais de <span className="text-[#2E7D32] font-bold">+5.000</span> pacientes satisfeitos com os nossos serviços de saúde.</span>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="px-5 py-3">
        <div className="trust-scroll">
          {TRUST_BADGES.map((badge, i) => (
            <div key={i} className="trust-item">
              <span className="text-[#2E7D32]">{badge.icon}</span>
              <span className="text-[11px] font-medium text-[#1a3a1a]">{badge.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center py-6 px-5">
        <p className="text-[11px] text-[#9CA3AF]">YESOLA SAÚDE · CUIDAMOS DE SI COM EXCELÊNCIA.</p>
      </div>
    </div>
  );
}
