import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ChevronRight, Star, MapPin } from "lucide-react";
import { Store } from "@/data/mock";

function StoreCard({ store, from }: { store: Store; from: string }) {
  const fallbackImage = "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop&auto=format&q=75";
  const images = store.coverImages && store.coverImages.length > 0
    ? store.coverImages
    : [store.coverImage || fallbackImage];
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => setCurrentIdx((p) => (p + 1) % images.length), 3000);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <div
      className="flex-shrink-0 w-44 rounded-2xl overflow-hidden bg-white shadow-md border border-[#EDE8DE] cursor-pointer hover:-translate-y-1 transition-all"
      onClick={() => { window.location.href = `/loja/${store.id}?from=${from}`; }}
    >
      <div className="relative h-28 overflow-hidden">
        <img src={images[currentIdx] || fallbackImage} alt={store.name} className="w-full h-full object-cover" />
        {store.logoUrl && (
          <img src={store.logoUrl} alt="" className="absolute top-2 left-2 w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm z-20" />
        )}
        {store.isOpen !== undefined && (
          <span className={`absolute top-2 right-2 text-[9px] font-semibold px-2 py-0.5 rounded-full z-20 ${store.isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
            {store.isOpen ? "Aberto" : "Fechado"}
          </span>
        )}
      </div>
      <div className="p-3">
        <h4 className="text-sm font-semibold text-[#2D2C2B] truncate">{store.name}</h4>
        {store.description && <p className="text-[10px] text-[#87909a] mt-1 line-clamp-2">{store.description}</p>}
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

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface StoreCategorySectionProps {
  categories: Category[];
  stores: Store[];
  storeType: string;
  exploreRoute: string;
}

export default function StoreCategorySection({ categories, stores, storeType, exploreRoute }: StoreCategorySectionProps) {
  const [, navigate] = useLocation();

  const getStoresForCategory = (categoryName: string) => {
    return stores.filter((s: Store) => {
      const cat = (s.category || "").toLowerCase();
      const matchesCategory = cat.includes(categoryName.toLowerCase());
      return matchesCategory && s.isOpen !== false;
    });
  };

  const hasAnyStores = categories.some((cat) => getStoresForCategory(cat.name).length > 0);
  const featured = stores.filter((s: Store) => s.isOpen !== false).slice(0, 6);

  return (
    <div className="px-5 py-4 space-y-6">
      {categories.map((cat) => {
        const categoryStores = getStoresForCategory(cat.name);
        return (
          <div key={cat.id}>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center">{cat.icon}</div>
                <h3 className="text-[14px] font-semibold text-[#2D2C2B]">{cat.name}</h3>
              </div>
              <button onClick={() => navigate(`${exploreRoute}?categoria=${cat.id}`)} className="text-[12px] text-[#D4A843] font-medium flex items-center gap-1">
                Ver mais <ChevronRight size={12} />
              </button>
            </div>
            {categoryStores.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {categoryStores.slice(0, 4).map((store: Store) => (
                  <StoreCard key={store.id} store={store} from={storeType} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#EDE8DE] p-6 text-center bg-white">
                <p className="text-[12px] text-[#9CA3AF]">Em breve novas lojas</p>
              </div>
            )}
          </div>
        );
      })}

      {!hasAnyStores && featured.length > 0 && (
        <div>
          <h3 className="text-[14px] font-semibold text-[#2D2C2B] mb-3">Destaques</h3>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {featured.map((store: Store) => (
              <StoreCard key={store.id} store={store} from={storeType} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
