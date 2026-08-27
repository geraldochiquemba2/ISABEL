import { useState, useEffect } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Heart, ShoppingBag, Search, ChevronRight, Star, MapPin, Menu, X,
  ShieldCheck, BadgeCheck, CreditCard, HeadphonesIcon,
} from "lucide-react";

const CATEGORIES = [
  { id: "empreendedorismo", name: "Empreendedorismo", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#D4A843" strokeWidth="1.5"><path d="M8 28h16M10 28V16l6-8 6 8v12" /><rect x="13" y="20" width="6" height="8" /></svg> },
  { id: "gestao", name: "Gestão e\nEstratégia", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#D4A843" strokeWidth="1.5"><rect x="4" y="4" width="24" height="24" rx="3" /><path d="M4 12h24M12 12v16" /></svg> },
  { id: "financas", name: "Finanças\nPessoais", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#D4A843" strokeWidth="1.5"><circle cx="16" cy="16" r="10" /><path d="M14 12h4c1.1 0 2 .9 2 2s-.9 2-2 2h-4c-1.1 0-2 .9-2 2s.9 2 2 2h4" /></svg> },
  { id: "marketing", name: "Marketing e\nVendas", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#D4A843" strokeWidth="1.5"><path d="M6 16l8-4v8l-8-4z" /><path d="M14 12l8-4v12l-8-4" /><path d="M26 10v8" /></svg> },
  { id: "advogados", name: "Advogados\nQualificados", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#D4A843" strokeWidth="1.5"><path d="M16 4l12 8H4l12-8z" /><rect x="6" y="12" width="4" height="12" /><rect x="14" y="12" width="4" height="12" /><rect x="22" y="12" width="4" height="12" /><path d="M4 28h24" /></svg> },
  { id: "contabilistas", name: "Contabilistas\nQualificados", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#D4A843" strokeWidth="1.5"><rect x="5" y="4" width="22" height="24" rx="2" /><path d="M10 10h12M10 14h12M10 18h8" /><path d="M20 22l2 2 4-4" /></svg> },
];

const TRUST_BADGES = [
  { icon: <ShieldCheck size={18} />, label: "Compra segura" },
  { icon: <BadgeCheck size={18} />, label: "Profissionais verificados" },
  { icon: <CreditCard size={18} />, label: "Pagamentos seguros" },
  { icon: <HeadphonesIcon size={18} />, label: "Apoio dedicado" },
];

function StoreCard({ store }: { store: any }) {
  const fallbackImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format&q=75";
  const images = store.coverImages?.length > 0 ? store.coverImages : [store.coverImage || store.image || fallbackImage];
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => setCurrentIdx((p) => (p + 1) % images.length), 3000);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <div className="flex-shrink-0 w-44 rounded-2xl overflow-hidden bg-white shadow-md border border-[#EDE8DE] cursor-pointer hover:-translate-y-1 transition-all" onClick={() => window.location.href = `/loja/${store.id}?from=negocios`}>
      <div className="relative h-28 overflow-hidden">
        <img src={images[currentIdx] || fallbackImage} alt={store.name} className="w-full h-full object-cover" />
        {store.logoUrl && <img src={store.logoUrl} alt="" className="absolute top-2 left-2 w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm z-20" />}
      </div>
      <div className="p-3">
        <h4 className="text-sm font-semibold text-[#2D2C2B] truncate">{store.name}</h4>
        <p className="text-[10px] text-[#D4A843] mt-0.5">{store.category || "Negócios"}</p>
        <div className="flex items-center gap-1 mt-1">
          <MapPin size={10} className="text-[#9CA3AF]" />
          <span className="text-[10px] text-[#9CA3AF]">{store.municipality || "Luanda"}</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Star size={10} className="text-[#D4A843] fill-[#D4A843]" />
          <span className="text-[10px] font-medium text-[#2D2C2B]">4.8 ({Math.floor(Math.random() * 100 + 30)})</span>
        </div>
      </div>
    </div>
  );
}

export default function BusinessHome({ onBackToSelector }: { onBackToSelector?: () => void }) {
  useThemeColor("#FAF8F5");
  const [, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: stores = [] } = useQuery({
    queryKey: ["stores", "negocios"],
    queryFn: async () => { const r = await fetch("/api/stores?store_type=negocios"); return r.ok ? r.json() : []; },
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
            <span className="text-[9px] tracking-[0.25em] text-[#D4A843] font-semibold uppercase mt-0.5">Negócios</span>
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
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=500&fit=crop&auto=format&q=80" alt="Negócios" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />
          <div className="relative z-10 p-6 max-w-[60%]">
            <p className="text-[10px] tracking-[0.2em] text-[#D4A843] font-semibold uppercase">Os melhores parceiros para o seu negócio.</p>
            <h1 className="text-[28px] leading-[1.1] font-semibold mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Faça crescer<br />o seu <span className="text-[#D4A843]">negócio.</span>
            </h1>
            <p className="text-[12px] text-[#6B7280] mt-3 leading-relaxed">Encontre consultores, advogados, contabilistas e muito mais para impulsionar o seu sucesso.</p>
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
            <p className="text-[11px] text-[#6B7280]">Encontre serviços de negócios perto de si.</p>
          </div>
          <ChevronRight size={18} className="text-[#D4A843]" />
        </div>
      </section>

      {/* Featured Stores */}
      <section className="px-5 py-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[17px] font-semibold text-[#2D2C2B]">Profissionais em destaque</h2>
          <button onClick={() => navigate("/explorar")} className="text-[13px] text-[#D4A843] font-medium flex items-center gap-1">Ver todos <ChevronRight size={14} /></button>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {featured.length > 0 ? featured.map((store: any) => <StoreCard key={store.id} store={store} />) : (
            <>
              <StoreCard store={{ id: "demo-1", name: "Advocacia Moderna", category: "Advogados", municipality: "Luanda", coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop" }} />
              <StoreCard store={{ id: "demo-2", name: "Contabilidade Express", category: "Contabilistas", municipality: "Benguela", coverImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop" }} />
              <StoreCard store={{ id: "demo-3", name: "Estratégia & Sucesso", category: "Gestão e Estratégia", municipality: "Huila", coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop" }} />
              <StoreCard store={{ id: "demo-4", name: "Marketing Digital Pro", category: "Marketing e Vendas", municipality: "Lubango", coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop" }} />
            </>
          )}
        </div>
      </section>

      {/* Counter */}
      <section className="px-5 py-3">
        <div className="flex items-center justify-center gap-2 bg-[#FBF7ED] rounded-2xl px-4 py-3 border border-[#EDE8DE]">
          <Heart size={16} className="text-[#D4A843]" />
          <span className="text-[13px] font-medium text-[#2D2C2B]">Mais de <span className="text-[#D4A843] font-bold">+2.000</span> profissionais prontos para ajudar o seu negócio a crescer.</span>
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
        <p className="text-[11px] text-[#9CA3AF]">YESOLA NEGÓCIOS · OS MELHORES PARCEIROS PARA O SEU SUCESSO.</p>
      </div>
    </div>
  );
}
