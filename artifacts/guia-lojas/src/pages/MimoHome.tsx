import { useState, useEffect } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Heart, ShoppingBag, Search, ChevronRight, Star, MapPin, Menu, X,
  ShieldCheck, BadgeCheck, CreditCard, HeadphonesIcon,
} from "lucide-react";

const CATEGORIES = [
  { id: "namoro", name: "Agências de\nNamoro Cristão", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#D4A843" strokeWidth="1.5"><path d="M16 28s-10-6.5-10-14c0-4 3-7 6-7 2 0 3 1 4 3 1-2 2-3 4-3 3 0 6 3 6 7 0 7.5-10 14-10 14z" /></svg> },
  { id: "conselhoria", name: "Conselhoria &\nRelacionamentos", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#D4A843" strokeWidth="1.5"><circle cx="16" cy="12" r="6" /><path d="M6 28c0-5.5 4.5-10 10-10s10 4.5 10 10" /><path d="M20 10l4-4m0 0v4m0-4h-4" /></svg> },
  { id: "presentes", name: "Presentes &\nSurpresas", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#D4A843" strokeWidth="1.5"><rect x="5" y="14" width="22" height="14" rx="2" /><path d="M16 14v14" /><rect x="5" y="10" width="22" height="4" rx="1" /><path d="M16 10c-2-4-6-4-6 0h6c0-4 4-4 6 0h-6z" /></svg> },
  { id: "noivados", name: "Noivados &\nPedidos Especiais", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#D4A843" strokeWidth="1.5"><circle cx="16" cy="16" r="10" /><path d="M12 16l3 3 5-6" /></svg> },
  { id: "registros", name: "Registros de\nAmor", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#D4A843" strokeWidth="1.5"><rect x="7" y="5" width="18" height="22" rx="2" /><path d="M11 11h10M11 15h10M11 19h6" /></svg> },
  { id: "cartas", name: "Cartas &\nMensagens", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#D4A843" strokeWidth="1.5"><rect x="4" y="8" width="24" height="16" rx="2" /><path d="M4 8l12 9 12-9" /></svg> },
  { id: "mentoria", name: "Mentoria para\nCasais", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#D4A843" strokeWidth="1.5"><circle cx="12" cy="12" r="5" /><circle cx="22" cy="12" r="5" /><path d="M4 28c0-4.4 3.6-8 8-8h1" /><path d="M28 28c0-4.4-3.6-8-8-8h-1" /></svg> },
  { id: "apoio", name: "Apoio Emocional &\nEspiritual", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#D4A843" strokeWidth="1.5"><path d="M16 4v8m0 8v8M8 12l6-4v8l-6-4zm16 0l-6-4v8l6-4z" /><circle cx="16" cy="16" r="3" /></svg> },
];

const TRUST_BADGES = [
  { icon: <ShieldCheck size={18} />, label: "Compra segura" },
  { icon: <BadgeCheck size={18} />, label: "Profissionais verificados" },
  { icon: <CreditCard size={18} />, label: "Pagamentos seguros" },
  { icon: <HeadphonesIcon size={18} />, label: "Apoio dedicado" },
];

function StoreCard({ store }: { store: any }) {
  const fallbackImage = "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=300&fit=crop&auto=format&q=75";
  const images = store.coverImages?.length > 0 ? store.coverImages : [store.coverImage || store.image || fallbackImage];
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => setCurrentIdx((p) => (p + 1) % images.length), 3000);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <div className="flex-shrink-0 w-44 rounded-2xl overflow-hidden bg-white shadow-md border border-[#EDE8DE] cursor-pointer hover:-translate-y-1 transition-all" onClick={() => window.location.href = `/loja/${store.id}?from=amor`}>
      <div className="relative h-28 overflow-hidden">
        <img src={images[currentIdx] || fallbackImage} alt={store.name} className="w-full h-full object-cover" />
        {store.logoUrl && <img src={store.logoUrl} alt="" className="absolute top-2 left-2 w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm z-20" />}
      </div>
      <div className="p-3">
        <h4 className="text-sm font-semibold text-[#2D2C2B] truncate">{store.name}</h4>
        <p className="text-[10px] text-[#D4A843] mt-0.5">{store.category || "Serviços de Amor"}</p>
        <div className="flex items-center gap-1 mt-1">
          <MapPin size={10} className="text-[#9CA3AF]" />
          <span className="text-[10px] text-[#9CA3AF]">{store.municipality || "Luanda"}</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Star size={10} className="text-[#D4A843] fill-[#D4A843]" />
          <span className="text-[10px] font-medium text-[#2D2C2B]">4.8 ({Math.floor(Math.random() * 80 + 20)})</span>
        </div>
      </div>
    </div>
  );
}

export default function MimoHome({ onBackToSelector }: { onBackToSelector?: () => void }) {
  useThemeColor("#FAF8F5");
  const [, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: stores = [] } = useQuery({
    queryKey: ["stores", "amor"],
    queryFn: async () => { const r = await fetch("/api/stores?store_type=amor"); return r.ok ? r.json() : []; },
    staleTime: 60_000,
  });

  const featured = stores.filter((s: any) => s.isOpen !== false).slice(0, 4);

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
            <span className="text-[9px] tracking-[0.25em] text-[#D4A843] font-semibold uppercase mt-0.5">Serviços de Amor</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-1"><Search size={22} /></button>
            <button className="p-1"><ShoppingBag size={22} /></button>
          </div>
        </div>
        {menuOpen && (
          <div className="bg-[#FAF8F5] border-t border-[#EDE8DE]/60 px-5 py-4 flex flex-col gap-3 text-sm font-medium">
            <a href="/login" className="py-2">Entrar</a>
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
              <span className="text-[10px] font-medium text-[#2D2C2B] text-center leading-tight whitespace-pre-line">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Hero */}
      <section className="px-5 py-4">
        <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: "240px" }}>
          <img src="https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&h=500&fit=crop&auto=format&q=80" alt="Amor" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />
          <div className="relative z-10 p-6 max-w-[60%]">
            <p className="text-[10px] tracking-[0.2em] text-[#D4A843] font-semibold uppercase">O amor em cada detalhe.</p>
            <h1 className="text-[28px] leading-[1.1] font-semibold mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Celebre o amor<br />de <span className="text-[#D4A843]">forma especial.</span>
            </h1>
            <p className="text-[12px] text-[#6B7280] mt-3 leading-relaxed">Surpresas, presentes, mentoria e serviços para fortalecer e celebrar os laços afetivos.</p>
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
            <p className="text-[11px] text-[#6B7280]">Encontre serviços de amor perto de si.</p>
          </div>
          <ChevronRight size={18} className="text-[#D4A843]" />
        </div>
      </section>

      {/* Featured Stores */}
      <section className="px-5 py-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[17px] font-semibold text-[#2D2C2B]">Serviços em destaque</h2>
          <button onClick={() => navigate("/explorar")} className="text-[13px] text-[#D4A843] font-medium flex items-center gap-1">Ver todos <ChevronRight size={14} /></button>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {featured.length > 0 ? featured.map((store: any) => <StoreCard key={store.id} store={store} />) : (
            <>
              <StoreCard store={{ id: "demo-1", name: "Coração Missionário", category: "Agências de Namoro", municipality: "Luanda", coverImage: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=300&fit=crop" }} />
              <StoreCard store={{ id: "demo-2", name: "Amor & Fé", category: "Conselhoria", municipality: "Benguela", coverImage: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop" }} />
              <StoreCard store={{ id: "demo-3", name: "Presentes com Amor", category: "Presentes & Surpresas", municipality: "Huila", coverImage: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=300&fit=crop" }} />
              <StoreCard store={{ id: "demo-4", name: "Mentoria Casal Feliz", category: "Mentoria para Casais", municipality: "Lubango", coverImage: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&h=300&fit=crop" }} />
            </>
          )}
        </div>
      </section>

      {/* Counter */}
      <section className="px-5 py-3">
        <div className="flex items-center justify-center gap-2 bg-[#FBF7ED] rounded-2xl px-4 py-3 border border-[#EDE8DE]">
          <Heart size={16} className="text-[#D4A843]" />
          <span className="text-[13px] font-medium text-[#2D2C2B]">Mais de <span className="text-[#D4A843] font-bold">+3.000</span> casais felizes celebrando o amor todos os dias.</span>
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
        <p className="text-[11px] text-[#9CA3AF]">YESOLA SERVIÇOS DE AMOR · PORQUE O AMOR MERECE SER CELEBRADO.</p>
      </div>
    </div>
  );
}
