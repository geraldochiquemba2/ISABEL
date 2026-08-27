import { useMemo, useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useQuery } from "@tanstack/react-query";
import { fetchStores } from "@/lib/api";
import { Store } from "@/data/mock";
import {
  Heart, ShoppingBag, ArrowRight, ChevronRight, Star, MapPin,
  ShieldCheck, BadgeCheck, CreditCard, HeadphonesIcon, Bell, Menu, X, Search,
} from "lucide-react";

function StoreCard({ store, from }: { store: Store; from: string }) {
  const fallbackImage = "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop&auto=format&q=75";
  const images = store.coverImages && store.coverImages.length > 0
    ? store.coverImages
    : [store.coverImage || fallbackImage];
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => setCurrentIdx((prev) => (prev + 1) % images.length), 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="flex-shrink-0 w-44 rounded-2xl overflow-hidden bg-white shadow-md border border-[#EDE8DE] cursor-pointer hover:-translate-y-1 transition-all" onClick={() => window.location.href = `/loja/${store.id}?from=${from}`}>
      <div className="relative h-28 overflow-hidden">
        <img src={images[currentIdx] || fallbackImage} alt={store.name} className="w-full h-full object-cover" />
        {store.logoUrl && <img src={store.logoUrl} alt="" className="absolute top-2 left-2 w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm z-20" />}
        {store.isOpen !== undefined && (
          <span className={`absolute top-2 right-2 text-[9px] font-semibold px-2 py-0.5 rounded-full z-20 ${store.isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
            {store.isOpen ? "Aberto" : "Fechado"}
          </span>
        )}
      </div>
      <div className="p-3">
        <h4 className="text-sm font-semibold text-[#2D2C2B] truncate">{store.name}</h4>
        {store.description && <p className="text-[10px] text-[#87909a] mt-1 line-clamp-2">{store.description}</p>}
        <div className="flex items-center gap-1 mt-1.5">
          <Star size={11} className="text-[#D4A843] fill-[#D4A843]" />
          <span className="text-[10px] font-medium text-[#2D2C2B]">4.8</span>
        </div>
      </div>
    </div>
  );
}

const TRUST_BADGES = [
  { icon: <ShieldCheck size={18} />, label: "Compra segura" },
  { icon: <BadgeCheck size={18} />, label: "Lojas verificadas" },
  { icon: <CreditCard size={18} />, label: "Entregas rápidas" },
  { icon: <HeadphonesIcon size={18} />, label: "Apoio ao cliente" },
];

export default function Home({ onBackToSelector }: { onBackToSelector?: () => void }) {
  useThemeColor("#FAF8F5");
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ["stores", "collection"],
    queryFn: () => fetchStores({ storeType: "collection" }),
    staleTime: 60_000,
  });

  const featured = useMemo(() => {
    return stores.slice(0, 6);
  }, [stores]);

  return (
    <div className="min-h-[100dvh] bg-[#FAF8F5] text-[#2D2C2B] pb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .trust-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; }
        .trust-scroll::-webkit-scrollbar { display: none; }
        .trust-item { flex-shrink: 0; display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: white; border-radius: 12px; border: 1px solid #EDE8DE; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EDE8DE]/60">
        <div className="flex items-center justify-between px-5 py-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">
            {menuOpen ? <X size={22} color="#2D2C2B" /> : <Menu size={22} color="#2D2C2B" />}
          </button>
          <div className="flex flex-col items-center">
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: 600, color: "#2d2c2b", letterSpacing: "-.02em" }}>YESOLA</span>
            <svg width="30" height="8" viewBox="0 0 30 8" fill="none" className="mt-0.5"><path d="M0 4C5 1 10 0 15 2C20 4 25 3 30 1" stroke="#D4A843" strokeWidth="1.5" fill="none" /></svg>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-1"><Bell size={22} color="#2D2C2B" /><span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#D4A843] rounded-full" /></button>
            <button className="p-1"><ShoppingBag size={22} color="#2D2C2B" /></button>
          </div>
        </div>
        {menuOpen && (
          <div className="bg-[#FAF8F5] border-t border-[#EDE8DE]/60 px-5 py-4 flex flex-col gap-3 text-sm font-medium text-[#2D2C2B]">
            <a href="/login" className="py-2">Entrar</a>
            {onBackToSelector && <button onClick={onBackToSelector} className="py-2 text-left">Trocar loja</button>}
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative px-5 pt-6 pb-4 overflow-hidden" style={{ minHeight: "220px" }}>
        <div className="relative z-10 max-w-[280px]">
          <h1 className="text-[32px] leading-[1.1] font-semibold text-[#2D2C2B]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Tudo o que<br />procuras,<br /><span className="text-[#D4A843]">encontras aqui.</span>
          </h1>
          <p className="text-[13px] text-[#6B7280] mt-4 leading-relaxed">
            Soluções completas para o seu dia a dia, negócios, formações, casa e muito mais, <span className="text-[#D4A843] font-medium">na sua província.</span>
          </p>
        </div>
        <div className="absolute right-0 top-0 w-[55%] h-full">
          <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&h=400&fit=crop&auto=format&q=80" alt="Mulher feliz" className="w-full h-full object-cover object-top" style={{ maskImage: "linear-gradient(to left, black 60%, transparent 100%)", WebkitMaskImage: "linear-gradient(to left, black 60%, transparent 100%)" }} />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-5 py-3 space-y-3">
        <button onClick={() => setLocation("/descobrir-estilo")} className="w-full flex items-center gap-4 bg-white rounded-2xl px-4 py-4 border border-[#EDE8DE] hover:border-[#D4A843]/30 transition-all">
          <div className="w-12 h-12 rounded-full bg-[#FBF7ED] flex items-center justify-center"><Search size={20} className="text-[#D4A843]" /></div>
          <div className="text-left flex-1"><p className="text-[14px] font-semibold text-[#D4A843]">Quero conhecer o meu estilo</p><p className="text-[11px] text-[#6B7280]">Descobre o teu estilo com especialistas de confiança.</p></div>
          <ChevronRight size={18} className="text-[#D4A843]" />
        </button>
        <button onClick={() => setLocation("/carrinhos")} className="w-full flex items-center gap-4 bg-white rounded-2xl px-4 py-4 border border-[#EDE8DE] hover:border-[#D4A843]/30 transition-all">
          <div className="w-12 h-12 rounded-full bg-[#FBF7ED] flex items-center justify-center"><ShoppingBag size={20} className="text-[#D4A843]" /></div>
          <div className="text-left flex-1"><p className="text-[14px] font-semibold text-[#D4A843]">Ver carrinhos</p><p className="text-[11px] text-[#6B7280]">SHEIN, ZARA, FASHION NOVA e outros</p></div>
          <ChevronRight size={18} className="text-[#D4A843]" />
        </button>
      </section>

      {/* Collection Banner */}
      <section className="px-5 py-3">
        <div className="relative rounded-2xl overflow-hidden bg-[#FBF7ED] border border-[#EDE8DE] p-5">
          <h3 className="text-[18px] font-semibold text-[#D4A843]" style={{ fontFamily: "'Playfair Display', serif" }}>Coleção de Vestuário<br />e Acessórios</h3>
          <p className="text-[12px] text-[#6B7280] mt-2">Tudo o que reflete quem você é.</p>
          <button onClick={() => setLocation("/explorar")} className="mt-3 flex items-center gap-2 bg-[#D4A843] text-white text-[12px] font-medium px-4 py-2.5 rounded-full hover:bg-[#C49A38] transition-colors">
            Explorar coleção <ChevronRight size={14} />
          </button>
        </div>
      </section>

      {/* Featured Stores */}
      <section className="px-5 py-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[17px] font-semibold text-[#2D2C2B]">Lojas em destaque</h2>
          <button onClick={() => setLocation("/explorar")} className="text-[13px] text-[#D4A843] font-medium flex items-center gap-1">Ver todas <ChevronRight size={14} /></button>
        </div>
        {isLoading ? (
          <div className="flex gap-3 overflow-x-auto">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="flex-shrink-0 w-44 h-48 rounded-2xl bg-gray-200 animate-pulse" />)}</div>
        ) : featured.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">{featured.map((store: Store) => <StoreCard key={store.id} store={store} from="collection" />)}</div>
        ) : (
          <p className="text-sm text-[#9CA3AF] text-center py-6">Nenhuma loja disponível de momento.</p>
        )}
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
    </div>
  );
}
