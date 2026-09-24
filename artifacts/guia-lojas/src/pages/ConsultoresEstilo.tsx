import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search, MapPin, Star, ChevronRight } from "lucide-react";
import { fetchStores } from "@/lib/api";
import { ANGOLA_PROVINCES } from "@/data/angolaData";

interface Store {
  id: string;
  name: string;
  category: string;
  image?: string;
  coverImage?: string;
  logoUrl?: string;
  description?: string;
  isOpen?: boolean;
  province?: string;
  municipality?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  products?: { imageUrl?: string; imageUrls?: string | string[] }[];
}

function StoreCard({ store }: { store: Store }) {
  const fallbackImage = "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop&auto=format&q=75";
  const images = store.products && store.products.length > 0 
    ? store.products.map(p => p.imageUrl || (Array.isArray(p.imageUrls) ? p.imageUrls[0] : undefined)).filter(Boolean)
    : [];
  const displayImages = images.length > 0 ? images : [store.coverImage || store.image || fallbackImage];
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (displayImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % displayImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [displayImages.length]);

  return (
    <div
      className="flex-shrink-0 w-48 rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow border border-[#E8DDD0] cursor-pointer hover:-translate-y-1"
      onClick={() => window.location.href = `/loja/${store.id}?from=collection`}
    >
      <div className="relative h-28 overflow-hidden">
        <img
          src={displayImages[currentIdx] || fallbackImage}
          alt={store.name}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = fallbackImage; }}
        />
        {displayImages.length > 1 && (
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
            {displayImages.slice(0, 5).map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === currentIdx ? 'bg-white' : 'bg-white/50'}`} />
            ))}
          </div>
        )}
        {store.isOpen === false && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-xs font-bold bg-red-500 px-2 py-1 rounded">Fechado</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-[#171717] truncate">{store.name}</h3>
        <p className="text-xs text-[#716D69] mt-0.5 truncate">{store.category}</p>
        {store.province && (
          <div className="flex items-center gap-1 mt-1.5">
            <MapPin size={10} className="text-[#B89A78]" />
            <span className="text-[10px] text-[#716D69] truncate">{store.province}{store.municipality ? `, ${store.municipality}` : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConsultoresEstilo() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ["stores", "collection", "consultoria-imagem"],
    queryFn: () => fetchStores({ storeType: "collection", q: "consultoria imagem estilo estilista" }),
  });

  const filteredStores = stores.filter((store: Store) => {
    const matchesSearch = !searchQuery || 
      store.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProvince = !selectedProvince || store.province === selectedProvince;
    
    return matchesSearch && matchesProvince;
  });

  return (
    <div className="min-h-[100dvh] bg-[#FAF8F4]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        .store-scroll { display: flex; gap: 12px; overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; padding-bottom: 8px; }
        .store-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FAF8F4]/95 backdrop-blur-md border-b border-[#E8DDD0]/60">
        <div className="flex items-center justify-between px-5 py-4">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm text-[#716D69] hover:text-[#171717] transition-colors">
            <ArrowLeft size={16} /> Voltar
          </button>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", letterSpacing: "-.02em", color: "#171717" }}>
            YESOLA
          </span>
          <div className="w-16" />
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#171717] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Consultores de Imagem & Estilo
          </h1>
          <p className="text-[#716D69] text-lg">
            Encontre especialistas para transformar o seu estilo e expressar a sua personalidade
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="px-5 py-4">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Pesquisar consultor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E8DDD0] bg-white text-sm text-[#171717] placeholder-[#9CA3AF] focus:outline-none focus:border-[#B89A78]"
            />
          </div>

          {/* Province filter */}
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-[#E8DDD0] bg-white text-sm text-[#171717] focus:outline-none focus:border-[#B89A78]"
          >
            <option value="">Todas as províncias</option>
            {ANGOLA_PROVINCES.map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Results */}
      <section className="px-5 py-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[17px] font-semibold text-[#171717]">
              {filteredStores.length} {filteredStores.length === 1 ? 'consultor' : 'consultores'} encontrado{filteredStores.length !== 1 ? 's' : ''}
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-48 rounded-2xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : filteredStores.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredStores.map((store: Store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#9CA3AF] text-sm mb-4">Nenhum consultor de imagem encontrado.</p>
              <p className="text-[#716D69] text-xs">
                Tente mudar os filtros ou pesquisar por outros termos.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-[#E8DDD0] p-6 text-center">
          <h3 className="text-lg font-semibold text-[#171717] mb-2">É consultor de imagem?</h3>
          <p className="text-sm text-[#716D69] mb-4">
            Registe o seu negócio na YESOLA e alcance mais clientes.
          </p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 bg-[#B89A78] text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-[#9A7D60] transition-colors"
          >
            Registar agora
            <ChevronRight size={14} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center py-8 border-t border-[#E8DDD0]/60">
        <p className="text-xs text-[#9CA3AF]">© 2024 YESOLA. Todos os direitos reservados.</p>
      </div>
    </div>
  );
}