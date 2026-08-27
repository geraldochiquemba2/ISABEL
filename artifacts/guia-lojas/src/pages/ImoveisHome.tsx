import { useMemo, useState, useEffect } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchStores } from "@/lib/api";
import { Store } from "@/data/mock";
import {
  Heart, ShoppingBag, Search, ChevronRight, Star, MapPin, Menu, X,
  ShieldCheck, BadgeCheck, CreditCard, HeadphonesIcon,
} from "lucide-react";

const CATEGORIES = [
  { id: "comprar", name: "Comprar Imóveis", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#D4A843" strokeWidth="1.5"><path d="M4 16l12-10 12 10" /><path d="M7 14v12h18V14" /><rect x="12" y="20" width="8" height="6" /></svg> },
  { id: "arrendar", name: "Arrendar Imóveis", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#D4A843" strokeWidth="1.5"><rect x="4" y="8" width="24" height="20" rx="2" /><path d="M10 8V6c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v2" /><path d="M16 18v-4M14 16h4" /></svg> },
  { id: "lancamentos", name: "Lançamentos Imobiliários", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#D4A843" strokeWidth="1.5"><path d="M16 4l12 8v16H4V12l12-8z" /><rect x="12" y="18" width="8" height="10" /><path d="M4 12l12 8 12-8" /></svg> },
  { id: "hoteis", name: "Hotéis, Resorts & Pousadas", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#D4A843" strokeWidth="1.5"><rect x="4" y="8" width="24" height="20" rx="2" /><path d="M4 14h24" /><rect x="8" y="18" width="6" height="4" rx="1" /><rect x="18" y="18" width="6" height="4" rx="1" /><circle cx="16" cy="11" r="2" /></svg> },
  { id: "investimentos", name: "Investimentos Imobiliários", icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#D4A843" strokeWidth="1.5"><path d="M4 28h24" /><path d="M6 24l6-8 4 4 6-10 6 6" /><circle cx="28" cy="12" r="2" fill="#D4A843" /></svg> },
];

const TRUST_BADGES = [
  { icon: <ShieldCheck size={18} />, label: "Compra segura" },
  { icon: <BadgeCheck size={18} />, label: "Imóveis verificados" },
  { icon: <CreditCard size={18} />, label: "Pagamentos seguros" },
  { icon: <HeadphonesIcon size={18} />, label: "Apoio dedicado" },
];

function StoreCard({ store }: { store: Store }) {
  const fallbackImage = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop&auto=format&q=75";
  const images = store.coverImages && store.coverImages.length > 0 ? store.coverImages : [store.coverImage || fallbackImage];
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => setCurrentIdx((p) => (p + 1) % images.length), 3000);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <div className="flex-shrink-0 w-44 rounded-2xl overflow-hidden bg-white shadow-md border border-[#EDE8DE] cursor-pointer hover:-translate-y-1 transition-all" onClick={() => window.location.href = `/loja/${store.id}?from=imoveis`}>
      <div className="relative h-28 overflow-hidden">
        <img src={images[currentIdx] || fallbackImage} alt={store.name} className="w-full h-full object-cover" />
        {store.logoUrl && <img src={store.logoUrl} alt="" className="absolute top-2 left-2 w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm z-20" />}
      </div>
      <div className="p-3">
        <h4 className="text-sm font-semibold text-[#2D2C2B] truncate">{store.name}</h4>
        <p className="text-[10px] text-[#D4A843] mt-0.5">{store.category}</p>
        <div className="flex items-center gap-1 mt-1">
          <MapPin size={10} className="text-[#9CA3AF]" />
          <span className="text-[10px] text-[#9CA3AF]">{store.municipality || store.province || "Angola"}</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Star size={10} className="text-[#D4A843] fill-[#D4A843]" />
          <span className="text-[10px] font-medium text-[#2D2C2B]">4.8</span>
        </div>
      </div>
    </div>
  );
}

function CategorySection({ categoryName, stores }: { categoryName: string; stores: Store[] }) {
  if (stores.length === 0) return null;
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3 px-1">
        <h3 className="text-[14px] font-semibold text-[#2D2C2B]">{categoryName}</h3>
        <button className="text-[12px] text-[#D4A843] font-medium flex items-center gap-1">Ver todos <ChevronRight size={12} /></button>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {stores.map((store: Store) => <StoreCard key={store.id} store={store} />)}
      </div>
    </div>
  );
}

export default function ImoveisHome({ onBackToSelector }: { onBackToSelector?: () => void }) {
  useThemeColor("#FAF8F5");
  const [, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ["stores", "imoveis"],
    queryFn: () => fetchStores({ storeType: "imoveis" }),
    staleTime: 60_000,
  });

  const getStoresForCategory = (categoryName: string) => {
    return stores.filter((s: Store) => {
      const matchesCategory = s.category?.toLowerCase().includes(categoryName.toLowerCase());
      return matchesCategory && s.isOpen !== false;
    });
  };

  const featured = useMemo(() => stores.filter((s: Store) => s.isOpen !== false).slice(0, 4), [stores]);

  return (
    <div className="min-h-[100dvh] bg-[#FAF8F5] text-[#2D2C2B] pb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .cat-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px; }
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-item { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 10px; background: white; border-radius: 14px; border: 1px solid #EDE8DE; min-width: 72px; cursor: pointer; transition: all 0.2s; }
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
            <span className="text-[9px] tracking-[0.25em] text-[#D4A843] font-semibold uppercase mt-0.5">Imóveis</span>
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
              <span className="text-[10px] font-medium text-[#2D2C2B] text-center leading-tight">{cat.name}</span>
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
            <p className="text-[10px] tracking-[0.2em] text-[#D4A843] font-semibold uppercase">Encontre o lar perfeito.</p>
            <h1 className="text-[28px] leading-[1.1] font-semibold mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Imóveis que<br />cabem no <span className="text-[#D4A843]">seu bolso.</span>
            </h1>
            <p className="text-[12px] text-[#6B7280] mt-3 leading-relaxed">Compre, arrende ou invista em imóveis verificados por toda Angola.</p>
            <button onClick={() => navigate("/explorar")} className="mt-4 flex items-center gap-2 bg-[#D4A843] text-white text-[12px] font-medium px-4 py-2.5 rounded-full hover:bg-[#C49A38] transition-colors">
              Explorar imóveis <ChevronRight size={14} />
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
            <p className="text-[11px] text-[#6B7280]">Encontre imóveis perto de si.</p>
          </div>
          <ChevronRight size={18} className="text-[#D4A843]" />
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
        <div className="px-5 py-4 space-y-2">
          {CATEGORIES.map((cat) => (
            <CategorySection key={cat.id} categoryName={cat.name} stores={getStoresForCategory(cat.name)} />
          ))}
          {featured.length > 0 && !CATEGORIES.some((cat) => getStoresForCategory(cat.name).length > 0) && (
            <div>
              <h3 className="text-[14px] font-semibold text-[#2D2C2B] mb-3 px-1">Imóveis em destaque</h3>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {featured.map((store: Store) => <StoreCard key={store.id} store={store} />)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Counter */}
      <section className="px-5 py-3">
        <div className="flex items-center justify-center gap-2 bg-[#FBF7ED] rounded-2xl px-4 py-3 border border-[#EDE8DE]">
          <Heart size={16} className="text-[#D4A843]" />
          <span className="text-[13px] font-medium text-[#2D2C2B]">Mais de <span className="text-[#D4A843] font-bold">+1.200</span> imóveis disponíveis em toda Angola.</span>
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
        <p className="text-[11px] text-[#9CA3AF]">YESOLA IMÓVEIS · ENCONTRE O LAR PERFEITO PARA A SUA FAMÍLIA.</p>
      </div>
    </div>
  );
}
