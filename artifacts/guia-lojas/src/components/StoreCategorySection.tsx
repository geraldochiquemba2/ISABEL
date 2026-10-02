import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ChevronRight, MapPin, TrendingUp } from "lucide-react";
import { Store } from "@/data/mock";
import { getStoreCategories } from "@/lib/storeCategories";

// Aliases de etiquetas genéricas (ex: "Mulher", "SHEIN") → palavras-chave
// das secções, para lojas registadas com categorias livres não ficarem invisíveis.
// Audiências confinam ao grupo próprio; marcas generalistas abrangem a moda.
const WORD_ALIASES: Record<string, string[]> = {
  mulher: ["feminina"],
  menina: ["feminina", "infantil"],
  meninas: ["feminina", "infantil"],
  senhoras: ["feminina"],
  homem: ["masculina"],
  senhores: ["masculina"],
  crianca: ["infantil"],
  bebe: ["infantil"],
  kids: ["infantil"],
  shein: ["moda"],
  zara: ["moda"],
};

const normWords = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[&\-_]/g, " ").replace(/\s+/g, " ").trim();

const expandWords = (n: string): string[] => {
  const words = n.split(" ").filter((w) => w.length > 2);
  const out = [...words];
  for (const w of words) {
    const als = WORD_ALIASES[w];
    if (als) for (const a of als) if (!out.includes(a)) out.push(a);
  }
  return out;
};

export function StoreCard({ store, from }: { store: Store; from: string }) {
  const fallbackImage = "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop&auto=format&q=75";
  const images = store.coverImages && store.coverImages.length > 0
    ? store.coverImages
    : [store.coverImage || fallbackImage];
  // Rotação automática: cards com +1 foto trocam a cada 3 segundos.
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div
      className="flex-shrink-0 w-44 rounded-2xl overflow-hidden bg-white shadow-md border border-[#EDE8DE] cursor-pointer hover:-translate-y-1 transition-all relative group"
      onClick={() => { window.location.href = `/loja/${store.id}?from=${from}`; }}
    >
      <div className="relative h-28 overflow-hidden">
        <img src={images[currentIdx] || fallbackImage} alt={store.name} className="w-full h-full object-cover object-top" />
        {store.logoUrl && (
          <img src={store.logoUrl} alt="" className="absolute top-2 left-2 w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm z-20" />
        )}
        
        {/* Botão de Partilha no Card */}
        <button
          onClick={async (e) => {
            e.stopPropagation();
            const url = `${window.location.origin}/loja/${store.id}?from=${from}`;
            const shareData = {
              title: store.name,
              text: `Conheça a loja ${store.name} no Guia de Lojas!`,
              url: url,
            };
            if (navigator.share) {
              try {
                await navigator.share(shareData);
              } catch (err) {}
            } else {
              navigator.clipboard.writeText(url);
              alert("Link da loja copiado!");
            }
          }}
          className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-sm z-30 transition-transform hover:scale-110"
          title="Partilhar loja"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/>
            <circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </button>

        {store.isOpen !== undefined && (
          <span className={`absolute top-2 right-2 text-[9px] font-semibold px-2 py-0.5 rounded-full z-20 ${store.isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
            {store.isOpen ? "Aberto" : "Fechado"}
          </span>
        )}

        {/* Pontos: toque muda a foto (a rotação automática continua) */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {images.slice(0, 5).map((_, i) => (
              <button
                key={i}
                aria-label={`Ver foto ${i + 1}`}
                onClick={(e) => { e.stopPropagation(); setCurrentIdx(i); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIdx ? "bg-white w-4" : "bg-white/50 w-1.5"
                }`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="p-3">
        <h4 className="text-sm font-semibold text-[#2D2C2B] truncate">{store.name}</h4>
        {store.description && <p className="text-[10px] text-[#87909a] mt-1 line-clamp-2">{store.description}</p>}
        <div className="flex items-center gap-1 mt-1">
          <MapPin size={10} className="text-[#9CA3AF]" />
          <span className="text-[10px] text-[#9CA3AF]">{store.municipality || store.province || "Angola"}</span>
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
    const target = normWords(categoryName);
    const targetWords = expandWords(target);
    return stores.filter((s: Store) => {
      const cats = getStoreCategories(s as any).map(normWords);
      return cats.some((cat) => {
        if (!cat) return false;
        if (cat.includes(target) || target.includes(cat)) return true;
        const storeWords = expandWords(cat);
        return storeWords.some((w) => targetWords.includes(w));
      });
    });
  };

  const nonAdmin = stores.filter((s: Store) => s.phone !== "999999999");
  const trending = nonAdmin.filter((s: Store) => s.isTrending).slice(0, 6);
  // Ordenação dinâmica: categorias com mais lojas primeiro, vazias no fim
  const sortedCategories = [...categories].sort(
    (a, b) => getStoresForCategory(b.name).length - getStoresForCategory(a.name).length
  );

  return (
    <div className="px-5 py-4 space-y-6">
      {/* Em Alta / Trending */}
      {trending.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-[#D4A843]" />
            <h3 className="text-[14px] font-semibold text-[#2D2C2B]">Em alta</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {trending.map((store: Store) => (
              <StoreCard key={store.id} store={store} from={storeType} />
            ))}
          </div>
          {trending.length > 2 && (<p className="swipe-hint-below">Desliza para ver mais →</p>)}
        </div>
      )}

      {sortedCategories.map((cat) => {
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
              <>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                  {categoryStores.map((store: Store) => (
                    <StoreCard key={store.id} store={store} from={storeType} />
                  ))}
                </div>
                {categoryStores.length > 2 && (<p className="swipe-hint-below">Desliza para ver mais →</p>)}
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#EDE8DE] p-6 text-center bg-white">
                <p className="text-[12px] text-[#9CA3AF]">Em breve novas lojas</p>
              </div>
            )}
          </div>
        );
      })}

    </div>
  );
}
