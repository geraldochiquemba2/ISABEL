import { useMemo, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useQuery } from "@tanstack/react-query";
import { fetchStores } from "@/lib/api";
import { Store } from "@/data/mock";
import {
  Heart, ShoppingBag, ChevronRight, Star, MapPin, Menu, X, Search,
  Shirt, Watch, Footprints,
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
    <div className="flex-shrink-0 w-44 rounded-2xl overflow-hidden bg-white shadow-md border border-[#E8DDD0] cursor-pointer hover:-translate-y-1 transition-all" onClick={() => window.location.href = `/loja/${store.id}?from=${from}`}>
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
        <h4 className="text-sm font-semibold text-[#171717] truncate">{store.name}</h4>
        {store.description && <p className="text-[10px] text-[#716D69] mt-1 line-clamp-2">{store.description}</p>}
        <div className="flex items-center gap-1 mt-1.5">
          <Star size={11} className="text-[#B89A78] fill-[#B89A78]" />
          <span className="text-[10px] font-medium text-[#171717]">4.8</span>
        </div>
      </div>
    </div>
  );
}

const CATEGORIES = [
  { id: "feminina", name: "Moda Feminina", icon: <Shirt size={24} className="text-[#B89A78]" /> },
  { id: "masculina", name: "Moda Masculina", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B89A78" strokeWidth="1.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /></svg> },
  { id: "acessorios", name: "Acessórios", icon: <Watch size={24} className="text-[#B89A78]" /> },
  { id: "calcado", name: "Calçado", icon: <Footprints size={24} className="text-[#B89A78]" /> },
];

export default function Home({ onBackToSelector }: { onBackToSelector?: () => void }) {
  useThemeColor("#FAF8F4");
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ["stores", "collection"],
    queryFn: () => fetchStores({ storeType: "collection" }),
    staleTime: 60_000,
  });

  const nonAdmin = useMemo(() => stores.filter((s: Store) => s.phone !== "999999999"), [stores]);
  const featured = useMemo(() => nonAdmin.filter((s: Store) => s.isFeatured).slice(0, 6), [nonAdmin]);
  const fallbackFeatured = useMemo(() => !featured.length ? nonAdmin.slice(0, 6) : [], [featured, nonAdmin]);

  return (
    <div className="min-h-[100dvh] bg-[#FAF8F4] text-[#171717] pb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .cat-scroll { display: flex; gap: 10px; overflow-x: auto; scrollbar-width: none; padding: 0 20px; }
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-item { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 14px 12px; background: white; border-radius: 16px; border: 1px solid #E8DDD0; min-width: 80px; cursor: pointer; transition: all 0.2s; }
        .cat-item:hover { border-color: #B89A78; background: #FBF7ED; }
        .store-scroll { display: flex; gap: 12px; overflow-x: auto; scrollbar-width: none; padding-bottom: 8px; }
        .store-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FAF8F4]/95 backdrop-blur-md border-b border-[#E8DDD0]/60">
        <div className="flex items-center justify-between px-5 py-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">
            {menuOpen ? <X size={22} color="#171717" /> : <Menu size={22} color="#171717" />}
          </button>
          <div className="flex flex-col items-center">
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 600, color: "#171717", letterSpacing: "-.02em" }}>YESOLA</span>
            <span className="text-[9px] tracking-[0.25em] text-[#B89A78] font-medium uppercase mt-0.5">COLLECTION</span>
          </div>
          <button className="p-1"><ShoppingBag size={22} color="#171717" /></button>
        </div>
        {menuOpen && (
          <div className="bg-[#FAF8F4] border-t border-[#E8DDD0]/60 px-5 py-4 flex flex-col gap-3 text-sm font-medium text-[#171717]">
            <a href="/login" className="py-2">Entrar</a>
            {onBackToSelector && <button onClick={onBackToSelector} className="py-2 text-left">Trocar loja</button>}
          </div>
        )}
      </header>

      {/* Categories */}
      <section className="py-4">
        <div className="cat-scroll">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => setLocation(`/explorar?categoria=${cat.id}`)} className="cat-item">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-[#E8DDD0]">
                {cat.icon}
              </div>
              <span className="text-[11px] font-medium text-[#171717] text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Hero */}
      <section className="relative px-5 py-4 overflow-hidden">
        <div className="relative rounded-2xl overflow-hidden bg-[#FFFFFF] border border-[#E8DDD0] p-5" style={{ minHeight: "180px" }}>
          <div className="relative z-10 max-w-[55%]">
            <h1 className="text-[26px] leading-[1.1] font-semibold text-[#171717]" style={{ fontFamily: "'Playfair Display', serif" }}>
              ESTILO QUE FAZ<br />PARTE <span className="text-[#B89A78]">DE SI.</span>
            </h1>
            <p className="text-[12px] text-[#716D69] mt-3 leading-relaxed">
              Descubra as melhores lojas de moda, calçado e acessórios da sua província.
            </p>
            <button onClick={() => setLocation("/explorar")} className="mt-4 flex items-center gap-2 bg-[#B89A78] text-white text-[12px] font-medium px-4 py-2.5 rounded-full hover:bg-[#9A7D60] transition-colors">
              Explorar coleção <ChevronRight size={14} />
            </button>
          </div>
          <div className="absolute right-0 top-0 w-[45%] h-full">
            <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&h=400&fit=crop&auto=format&q=80" alt="Moda elegante" className="w-full h-full object-cover object-top rounded-r-2xl" style={{ maskImage: "linear-gradient(to left, black 60%, transparent 100%)", WebkitMaskImage: "linear-gradient(to left, black 60%, transparent 100%)" }} />
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-5 py-3 space-y-3">
        <button onClick={() => setLocation("/descobrir-estilo")} className="w-full flex items-center gap-4 bg-white rounded-2xl px-4 py-4 border border-[#E8DDD0] hover:border-[#B89A78]/30 transition-all">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-[#E8DDD0]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B89A78" strokeWidth="1.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><circle cx="9" cy="9" r="1" fill="#B89A78" /><circle cx="15" cy="9" r="1" fill="#B89A78" /></svg>
          </div>
          <div className="text-left flex-1">
            <p className="text-[14px] font-semibold text-[#171717]">Quero conhecer o meu estilo</p>
            <p className="text-[11px] text-[#716D69]">Descubra o seu estilo com especialistas.</p>
          </div>
          <ChevronRight size={18} className="text-[#B89A78]" />
        </button>
        <button onClick={() => setLocation("/carrinhos")} className="w-full flex items-center gap-4 bg-white rounded-2xl px-4 py-4 border border-[#E8DDD0] hover:border-[#B89A78]/30 transition-all">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-[#E8DDD0]">
            <ShoppingBag size={20} className="text-[#B89A78]" />
          </div>
          <div className="text-left flex-1">
            <p className="text-[14px] font-semibold text-[#171717]">Ver carrinhos Shein, Zara e outros</p>
            <p className="text-[11px] text-[#716D69]">Inspire-se e encontre os melhores looks.</p>
          </div>
          <ChevronRight size={18} className="text-[#B89A78]" />
        </button>
      </section>

      {/* Featured Stores */}
      <section className="px-5 py-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[17px] font-semibold text-[#171717]">Lojas em destaque</h2>
          <button onClick={() => setLocation("/explorar")} className="text-[13px] text-[#B89A78] font-medium flex items-center gap-1">Ver todas <ChevronRight size={14} /></button>
        </div>
        {isLoading ? (
          <div className="store-scroll">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="flex-shrink-0 w-44 h-48 rounded-2xl bg-gray-200 animate-pulse" />)}</div>
        ) : (featured.length > 0 ? featured : fallbackFeatured).length > 0 ? (
          <div className="store-scroll">{(featured.length > 0 ? featured : fallbackFeatured).map((store: Store) => <StoreCard key={store.id} store={store} from="collection" />)}</div>
        ) : (
          <p className="text-sm text-[#9CA3AF] text-center py-6">Nenhuma loja disponível de momento.</p>
        )}
      </section>
    </div>
  );
}
