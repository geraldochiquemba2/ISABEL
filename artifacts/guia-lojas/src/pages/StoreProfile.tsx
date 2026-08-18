import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useSearch } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Clock, Heart, ArrowLeft, Tag, ChevronRight, MessageSquare, X, ShoppingCart } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { STORES } from "@/data/mock";
import { useFavorites } from "@/lib/favorites";
import { PageTransition } from "@/components/PageTransition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useQuery } from "@tanstack/react-query";
import { fetchStoreById } from "@/lib/api";

export default function StoreProfile() {
  const { id } = useParams<{ id: string }>();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const tabParam = params.get("tab");
  const isFromWeddings = params.get("from") === "weddings";
  const { isFavorite, toggleFavorite } = useFavorites();
  const [coverError, setCoverError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: store, isLoading } = useQuery({
    queryKey: ["store", id],
    queryFn: () => fetchStoreById(id!),
    enabled: !!id,
  });

  // Calcular imagens e carrossel ANTES dos early returns (regra dos hooks React)
  const images = store?.coverImages && store.coverImages.length > 0
    ? store.coverImages
    : (store?.coverImage ? [store.coverImage] : []);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [images.length]);

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <p className="text-muted-foreground text-sm">Carregando dados da loja...</p>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <p className="text-muted-foreground mb-4 text-sm">Loja não encontrada.</p>
        <Link href="/busca">
          <span className="text-sm font-medium text-foreground underline">Voltar</span>
        </Link>
      </div>
    );
  }

  const currentImage = images[currentImageIndex];

  const hours = [
    { day: "Segunda — Sexta", time: "08:00 – 18:00" },
    { day: "Sábado", time: "09:00 – 14:00" },
    { day: "Domingo", time: "Fechado" },
  ];

  const weddingsBg = "bg-[#fafafa]";
  const weddingsText = "text-[#30343a]";
  const weddingsBorder = "border-[#d1d4d8]";

  return (
    <PageTransition>
      <div className={isFromWeddings ? `${weddingsBg} min-h-screen` : ""}>
      {/* Cover com carrossel */}
      <div className={`relative h-72 sm:h-96 w-full overflow-hidden ${isFromWeddings ? "bg-[#e5e7e9]" : "bg-muted"}`}>
        {!coverError && currentImage ? (
          <>
            {/* Fundo borrado */}
            <div 
              key={`bg-profile-${currentImageIndex}`}
              className="absolute inset-0 bg-cover bg-center blur-xl scale-110 opacity-70 transition-all duration-1000 ease-out"
              style={{ backgroundImage: `url(${currentImage})` }} 
            />
            {/* Imagem principal contida */}
            <motion.img
              key={`img-profile-${currentImageIndex}`}
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              src={currentImage}
              alt={store.name}
              className="w-full h-full object-contain relative z-0"
              onError={() => setCoverError(true)}
            />
            {/* Indicadores do carrossel */}
            {images.length > 1 && (
              <div className="absolute bottom-16 right-4 z-20 flex gap-1">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      i === currentImageIndex ? "bg-white w-3" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: store.coverColor }} />
        )}

        <button
          data-testid="button-back"
          onClick={() => window.history.back()}
          className={`absolute top-4 left-4 w-9 h-9 rounded-full ${isFromWeddings ? "bg-[#2c3035]/80 hover:bg-[#2c3035] text-white" : "bg-white/80 hover:bg-white text-foreground"} flex items-center justify-center transition-colors backdrop-blur-sm z-20`}
        >
          <ArrowLeft size={16} />
        </button>


      </div>

      {/* Store title row below cover */}
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 py-5 flex items-center gap-4 border-b ${isFromWeddings ? weddingsBorder : "border-border"}`}>
        {store.logoUrl ? (
          <img
            src={store.logoUrl}
            alt={`${store.name} Logo`}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover bg-white border border-black/10 shadow-sm flex-shrink-0"
          />
        ) : (
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-muted border border-black/10 flex items-center justify-center flex-shrink-0 text-lg font-bold text-foreground">
            {store.name.substring(0, 2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
              store.isOpen
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-muted text-muted-foreground border-border"
            }`}>
              {store.isOpen ? "Aberto agora" : "Fechado"}
            </span>
          </div>
          <h1 className={`text-xl sm:text-2xl font-semibold tracking-tight truncate ${isFromWeddings ? weddingsText : "text-foreground"}`}>{store.name}</h1>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <p className="text-sm text-muted-foreground">{store.category}</p>
            {store.province && store.municipality && (
              <>
                <span className="text-muted-foreground text-xs">·</span>
                <span className="text-xs font-medium text-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                  {store.province}, {store.municipality}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Meta bar */}
        <div className="py-5 border-b border-border space-y-4">
          <p className="text-sm text-muted-foreground max-w-2xl">{store.description}</p>

          {/* Address */}
          {(store.province || store.municipality || (store.address && store.address.trim())) && (
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground">
                {store.province && store.municipality ? `${store.province}, ${store.municipality}${store.address && store.address.trim() ? ` — ${store.address}` : ""}` : store.address}
              </p>
            </div>
          )}

          {/* Horários */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock size={14} />
              <span className="text-xs font-semibold uppercase tracking-widest">Horários:</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-foreground">
              {hours.map((h) => (
                <div key={h.day} className="flex items-center gap-1.5 bg-muted/50 px-2 py-0.5 rounded border border-border/50">
                  <span className="text-muted-foreground">{h.day}</span>
                  <span className="font-medium">{h.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://wa.me/244922001778?text=${encodeURIComponent(`Olá, vim pela loja ${store.name} e gostaria de mais informações.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="button-whatsapp"
            >
              <button className="flex items-center gap-1.5 sm:gap-2 bg-[#25D366] hover:bg-[#22c35f] text-white text-xs sm:text-sm font-medium px-3 sm:px-5 py-2 sm:py-2.5 rounded-full transition-colors whitespace-nowrap">
                <SiWhatsapp size={14} />
                WhatsApp
              </button>
            </a>

            <a href={`https://wa.me/244922001778?text=${encodeURIComponent(`Olá, vim pela loja ${store.name} e gostaria de mais informações.`)}`} target="_blank" rel="noopener noreferrer" data-testid="button-call">
              <button className="flex items-center gap-1.5 sm:gap-2 border border-border text-foreground text-xs sm:text-sm font-medium px-3 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-muted transition-colors whitespace-nowrap">
                <Phone size={13} />
                Ligar
              </button>
            </a>

            <a
              href={`https://wa.me/244922001778?text=${encodeURIComponent(`Olá, vim pela loja ${store.name} e gostaria de mais informações.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="button-message"
            >
              <button className="flex items-center gap-1.5 sm:gap-2 border border-border text-foreground text-xs sm:text-sm font-medium px-3 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-muted transition-colors whitespace-nowrap">
                <MessageSquare size={13} />
                Mensagem
              </button>
            </a>

          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue={tabParam === "carrinhos" && store.carrinhoAccess === "APROVADO" ? "carrinhos" : "produtos"} className="py-6 pb-14">
          <TabsList className="bg-transparent border-0 gap-0 p-0 mb-7 border-b border-border w-full justify-start rounded-none h-auto overflow-x-auto">
            {[
              { value: "produtos", label: "Produtos", labelFull: "Produtos / Serviços" },
              ...(store.carrinhoAccess === "APROVADO" ? [{ value: "carrinhos", label: "Carrinhos", labelFull: "Carrinhos" }] : []),
              { value: "info", label: "Info", labelFull: "Informações" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                data-testid={`tab-${tab.value}`}
                className="rounded-none border-0 bg-transparent px-3 sm:px-4 pb-3 text-xs sm:text-sm font-medium text-muted-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground whitespace-nowrap flex-shrink-0"
              >
                <span className="hidden sm:inline">{tab.labelFull}</span>
                <span className="sm:hidden">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="produtos">
            <ProductsTab products={store.products.filter((p: any) => !p.isCarrinho)} storeName={store.name} storeWhatsapp={store.whatsapp} />
          </TabsContent>

          {store.carrinhoAccess === "APROVADO" && (
            <TabsContent value="carrinhos">
              <CarrinhoTab products={store.products.filter((p: any) => p.isCarrinho)} storeName={store.name} storeWhatsapp={store.whatsapp} />
            </TabsContent>
          )}

          <TabsContent value="info">
            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
              <div className="space-y-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Contato</p>
                <div className="flex items-start gap-3">
                  <MapPin size={15} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground">{store.address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={15} className="text-muted-foreground flex-shrink-0" />
                  <p className="text-sm text-foreground">{store.phone}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-1.5">
                  <Clock size={11} /> Horários
                </p>
                <div className="space-y-2">
                  {hours.map((h) => (
                    <div key={h.day} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{h.day}</span>
                      <span className="font-medium text-foreground">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </PageTransition>
  );
}

// ─── Formatar preço com separador de milhares por espaço ───────────────────
function formatPrice(price: number): string {
  const [int, dec] = price.toFixed(2).split(".");
  const formatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
  return `${formatted},${dec}`;
}

function ProductsTab({ products, storeName, storeWhatsapp }: { products: { id: string; name: string; price: number; currency?: string; imageColor: string; imageUrl?: string; imageUrls?: string[]; category?: string; subcategory?: string }[]; storeName: string; storeWhatsapp: string }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxPhotoIndex, setLightboxPhotoIndex] = useState<number>(0);

  const categories = useMemo(() => {
    const map = new Map<string, Set<string>>();
    products.forEach((p) => {
      if (p.category) {
        if (!map.has(p.category)) map.set(p.category, new Set());
        if (p.subcategory) map.get(p.category)!.add(p.subcategory);
      }
    });
    return map;
  }, [products]);

  const subcategories = activeCategory ? Array.from(categories.get(activeCategory) || []) : [];

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (activeCategory && p.category !== activeCategory) return false;
      if (activeSubcategory && p.subcategory !== activeSubcategory) return false;
      return true;
    });
  }, [products, activeCategory, activeSubcategory]);

  const hasCategoryData = categories.size > 0;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null && filtered.length > 0) {
      const p = filtered[lightboxIndex];
      const pImages = p.imageUrls?.length ? p.imageUrls : (p.imageUrl ? [p.imageUrl] : []);
      if (pImages.length > 1) {
        setLightboxPhotoIndex((prev) => (prev - 1 + pImages.length) % pImages.length);
      } else {
        setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
        setLightboxPhotoIndex(0);
      }
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null && filtered.length > 0) {
      const p = filtered[lightboxIndex];
      const pImages = p.imageUrls?.length ? p.imageUrls : (p.imageUrl ? [p.imageUrl] : []);
      if (pImages.length > 1) {
        setLightboxPhotoIndex((prev) => (prev + 1) % pImages.length);
      } else {
        setLightboxIndex((lightboxIndex + 1) % filtered.length);
        setLightboxPhotoIndex(0);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Category filter bar */}
      {hasCategoryData && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setActiveCategory(null); setActiveSubcategory(null); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                !activeCategory
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              Todos
            </button>
            {Array.from(categories.keys()).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  if (activeCategory === cat) {
                    setActiveCategory(null);
                    setActiveSubcategory(null);
                  } else {
                    setActiveCategory(cat);
                    setActiveSubcategory(null);
                  }
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  activeCategory === cat
                    ? "bg-foreground text-background border-foreground"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Tag size={10} />
                  {cat}
                </span>
              </button>
            ))}
          </div>

          {/* Subcategory row */}
          <AnimatePresence>
            {activeCategory && subcategories.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 pl-1">
                  <span className="flex items-center text-xs text-muted-foreground gap-1 mr-1">
                    <ChevronRight size={11} /> em {activeCategory}:
                  </span>
                  {subcategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setActiveSubcategory(activeSubcategory === sub ? null : sub)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        activeSubcategory === sub
                          ? "bg-foreground text-background border-foreground"
                          : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Product grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            index={i}
            storeName={storeName}
            storeWhatsapp={storeWhatsapp}
            onPhotoClick={() => { setLightboxIndex(i); setLightboxPhotoIndex(0); }}
          />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-sm text-muted-foreground py-8 text-center">Nenhum item nesta categoria.</p>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2.5 z-50 bg-white/10 rounded-full"
            >
              <X size={20} />
            </button>

            {/* Carousel Content */}
            <div className="relative w-full max-w-4xl h-[65vh] flex items-center justify-center px-4" onClick={(e) => e.stopPropagation()}>
              {/* Left Arrow */}
              {filtered.length > 1 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10 border border-white/10"
                >
                  <ChevronRight size={20} className="rotate-180" />
                </button>
              )}

              {/* Active Image */}
              <motion.div
                key={`${lightboxIndex}-${lightboxPhotoIndex}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex flex-col items-center justify-center p-2 touch-pan-y"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset }) => {
                  if (offset.x < -50) {
                    handleNext();
                  } else if (offset.x > 50) {
                    handlePrev();
                  }
                }}
              >
                {(() => {
                  const p = filtered[lightboxIndex];
                  const pImages = p.imageUrls?.length ? p.imageUrls : (p.imageUrl ? [p.imageUrl] : []);
                  const currentImg = pImages[lightboxPhotoIndex];
                  
                  if (currentImg) {
                    return (
                      <>
                        <img
                          src={currentImg}
                          alt={p.name}
                          className="max-w-full max-h-[85%] object-contain rounded-xl select-none shadow-2xl border border-white/5"
                        />
                        {pImages.length > 1 && (
                          <div className="flex gap-1.5 mt-4">
                            {pImages.map((_, i) => (
                              <button
                                key={i}
                                onClick={(e) => { e.stopPropagation(); setLightboxPhotoIndex(i); }}
                                className={`w-2 h-2 rounded-full transition-all ${
                                  i === lightboxPhotoIndex ? "bg-white w-4" : "bg-white/40"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    );
                  }
                  
                  return (
                    <div
                      className="w-72 h-72 rounded-2xl flex items-center justify-center text-white font-semibold border border-white/10"
                      style={{ backgroundColor: p.imageColor }}
                    >
                      Sem Foto
                    </div>
                  );
                })()}
              </motion.div>

              {/* Right Arrow */}
              {filtered.length > 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10 border border-white/10"
                >
                  <ChevronRight size={20} />
                </button>
              )}
            </div>

            {/* Bottom info */}
            <div className="text-center text-white mt-5 px-4 max-w-md flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-base font-semibold tracking-tight">{filtered[lightboxIndex].name}</h2>
              {filtered[lightboxIndex].description && (
                <p className="text-xs text-white/70 mt-1 leading-relaxed max-w-xs">{filtered[lightboxIndex].description}</p>
              )}
              <p className="text-sm font-semibold text-emerald-400 mt-1">
                {filtered[lightboxIndex].price > 0 ? `${filtered[lightboxIndex].currency === 'USD' ? '$' : filtered[lightboxIndex].currency === 'EUR' ? '€' : 'Kz'} ${formatPrice(filtered[lightboxIndex].price)}` : "Gratuito"}
              </p>
              
              <a
                href={`https://wa.me/${storeWhatsapp}?text=${encodeURIComponent(
                  `Olá! Gostaria de pedir o seguinte produto de vossa loja ${storeName}:\n\n` +
                  `Produto: ${filtered[lightboxIndex].name}\n` +
                  `Preço: ${filtered[lightboxIndex].currency === 'USD' ? '$' : filtered[lightboxIndex].currency === 'EUR' ? '€' : 'Kz'} ${formatPrice(filtered[lightboxIndex].price)}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#22c35f] text-white text-xs font-semibold px-6 py-2.5 rounded-full transition-colors border border-white/10 shadow-lg"
              >
                <SiWhatsapp size={14} />
                Pedir no WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductCard({ product, index, storeName, storeWhatsapp, onPhotoClick }: { product: { id: string; name: string; price: number; currency?: string; imageColor: string; imageUrl?: string; imageUrls?: string[]; category?: string; subcategory?: string; description?: string }; index: number; storeName: string; storeWhatsapp: string; onPhotoClick: () => void }) {
  const [imgError, setImgError] = useState(false);

  const whatsappMessage = encodeURIComponent(
    `Olá! Gostaria de pedir o seguinte produto de vossa loja ${storeName}:\n\n` +
    `Produto: ${product.name}\n` +
    `Preço: ${product.currency === 'USD' ? '$' : product.currency === 'EUR' ? '€' : 'Kz'} ${formatPrice(product.price)}`
  );

  const whatsappUrl = `https://wa.me/244922001778?text=${whatsappMessage}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.04 }}
      className="group cursor-pointer border border-black rounded-2xl p-3 bg-card flex flex-col justify-between h-full shadow-sm hover:shadow-md transition-shadow"
      data-testid={`card-product-${product.id}`}
    >
      <div className="flex flex-col flex-grow">
        <div 
          onClick={(e) => { e.stopPropagation(); onPhotoClick(); }}
          className="relative overflow-hidden rounded-xl h-36 mb-3 bg-muted border border-black/10 cursor-zoom-in"
        >
          {product.imageUrls?.length || product.imageUrl ? (
            <img
              src={product.imageUrls?.length ? product.imageUrls[0] : product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full" style={{ backgroundColor: product.imageColor }} />
          )}
        </div>
        <p className="text-sm font-medium text-foreground leading-tight">{product.name}</p>
        {product.description && (
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{product.description}</p>
        )}
      </div>
      <div className="mt-2 flex flex-col justify-between">
        <div>
          {product.price > 0 ? (
            <p className="text-sm font-semibold text-foreground">
              {product.currency === 'USD' ? '$' : product.currency === 'EUR' ? '€' : 'Kz'} {formatPrice(product.price)}
            </p>
          ) : (
            <p className="text-xs text-emerald-600 font-medium">Gratuito</p>
          )}
          {/* Category + subcategory badges */}
          {(product.category || product.subcategory) && (
            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
              {product.category && (
                <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-muted rounded-full text-muted-foreground font-medium">
                  <Tag size={8} />
                  {product.category}
                </span>
              )}
              {product.subcategory && (
                <span className="inline-flex items-center text-[10px] px-1.5 py-0.5 bg-muted rounded-full text-muted-foreground font-medium">
                  {product.subcategory}
                </span>
              )}
            </div>
          )}
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 w-full flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#22c35f] text-white text-xs font-semibold py-2 rounded-xl transition-colors border border-black/10"
        >
          <SiWhatsapp size={13} />
          Pedir
        </a>
      </div>
    </motion.div>
  );
}

function CarrinhoTab({ products, storeName, storeWhatsapp }: { products: any[]; storeName: string; storeWhatsapp: string }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxPhotoIndex, setLightboxPhotoIndex] = useState<number>(0);

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectedProducts = products.filter(p => selected.includes(p.id));
  const totalPrice = selectedProducts.reduce((sum, p) => sum + (p.price || 0), 0);

  const sendWhatsApp = () => {
    if (selectedProducts.length === 0) return;
    let msg = `Olá! Gostaria de pedir os seguintes carrinhos de *${storeName}*:\n\n`;
    selectedProducts.forEach((p, i) => {
      msg += `${i + 1}. ${p.name}\n   Preço: ${p.price?.toLocaleString("pt-AO")} ${p.currency}\n\n`;
    });
    msg += `*Total: ${totalPrice.toLocaleString("pt-AO")} Kz*\n\nAguardo confirmação!`;
    window.open(`https://wa.me/${storeWhatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null && products.length > 0) {
      const p = products[lightboxIndex];
      const pImages = p.imageUrls?.length ? p.imageUrls : (p.imageUrl ? [p.imageUrl] : []);
      if (pImages.length > 1) {
        setLightboxPhotoIndex((prev) => (prev - 1 + pImages.length) % pImages.length);
      } else {
        setLightboxIndex((lightboxIndex - 1 + products.length) % products.length);
        setLightboxPhotoIndex(0);
      }
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null && products.length > 0) {
      const p = products[lightboxIndex];
      const pImages = p.imageUrls?.length ? p.imageUrls : (p.imageUrl ? [p.imageUrl] : []);
      if (pImages.length > 1) {
        setLightboxPhotoIndex((prev) => (prev + 1) % pImages.length);
      } else {
        setLightboxIndex((lightboxIndex + 1) % products.length);
        setLightboxPhotoIndex(0);
      }
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart size={40} className="mx-auto text-gray-300 mb-3" />
        <p className="text-sm text-muted-foreground">Nenhum carrinho disponível nesta loja.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {products.map((product: any, i: number) => {
          const isSelected = selected.includes(product.id);
          const pImages = product.imageUrls?.length ? product.imageUrls : (product.imageUrl ? [product.imageUrl] : []);
          return (
            <div
              key={product.id}
              className={`relative rounded-2xl overflow-hidden border-2 transition-all ${
                isSelected ? "border-[#D4A843] shadow-lg shadow-amber-500/20" : "border-transparent shadow-sm hover:shadow-md"
              }`}
            >
              <div
                className="aspect-square overflow-hidden cursor-zoom-in relative"
                onClick={() => { setLightboxIndex(i); setLightboxPhotoIndex(0); }}
              >
                {pImages.length > 0 ? (
                  <img src={pImages[0]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: product.imageColor }}>
                    <ShoppingCart size={28} className="text-gray-300" />
                  </div>
                )}
                {pImages.length > 1 && (
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
                    📷 {pImages.length} fotos
                  </div>
                )}
              </div>
              <div className="p-2.5">
                  <h4 className="text-xs font-semibold text-gray-900 line-clamp-2">{product.name}</h4>
                  <p className="text-xs font-bold text-[#D4A843] mt-1">{product.price?.toLocaleString("pt-AO")} {product.currency}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggle(product.id); }}
                    className={`mt-2 w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-xl transition-all border ${
                      isSelected
                        ? "bg-[#D4A843] text-white border-[#D4A843]"
                        : "bg-white text-[#D4A843] border-[#D4A843] hover:bg-[#D4A843] hover:text-white"
                    }`}
                  >
                    <ShoppingCart size={12} />
                    {isSelected ? "Adicionado ✓" : "Adicionar"}
                  </button>
                </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && products[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2.5 z-50 bg-white/10 rounded-full"
            >
              <X size={20} />
            </button>

            <div className="relative w-full max-w-4xl h-[65vh] flex items-center justify-center px-4" onClick={(e) => e.stopPropagation()}>
              {products.length > 1 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10 border border-white/10"
                >
                  <ChevronRight size={20} className="rotate-180" />
                </button>
              )}

              <motion.div
                key={`${lightboxIndex}-${lightboxPhotoIndex}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex flex-col items-center justify-center p-2 touch-pan-y"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset }) => {
                  if (offset.x < -50) handleNext();
                  else if (offset.x > 50) handlePrev();
                }}
              >
                {(() => {
                  const p = products[lightboxIndex];
                  const pImages = p.imageUrls?.length ? p.imageUrls : (p.imageUrl ? [p.imageUrl] : []);
                  const currentImg = pImages[lightboxPhotoIndex];

                  if (currentImg) {
                    return (
                      <>
                        <img
                          src={currentImg}
                          alt={p.name}
                          className="max-w-full max-h-[85%] object-contain rounded-xl select-none shadow-2xl border border-white/5"
                        />
                        {pImages.length > 1 && (
                          <div className="flex gap-1.5 mt-4">
                            {pImages.map((_: any, idx: number) => (
                              <button
                                key={idx}
                                onClick={(e) => { e.stopPropagation(); setLightboxPhotoIndex(idx); }}
                                className={`w-2 h-2 rounded-full transition-all ${
                                  idx === lightboxPhotoIndex ? "bg-white w-4" : "bg-white/40"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    );
                  }

                  return (
                    <div
                      className="w-72 h-72 rounded-2xl flex items-center justify-center text-white font-semibold border border-white/10"
                      style={{ backgroundColor: p.imageColor }}
                    >
                      Sem Foto
                    </div>
                  );
                })()}
              </motion.div>

              {products.length > 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10 border border-white/10"
                >
                  <ChevronRight size={20} />
                </button>
              )}
            </div>

            <div className="text-center text-white mt-5 px-4 max-w-md flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-base font-semibold tracking-tight">{products[lightboxIndex].name}</h2>
              <p className="text-sm font-semibold text-[#D4A843] mt-1">
                {products[lightboxIndex].price?.toLocaleString("pt-AO")} {products[lightboxIndex].currency}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selected.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-4 shadow-xl">
          <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-900">{selected.length} selecionado{selected.length > 1 ? "s" : ""}</p>
              <p className="text-sm font-bold text-[#D4A843]">{totalPrice.toLocaleString("pt-AO")} Kz</p>
            </div>
            <button
              onClick={sendWhatsApp}
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#22c35f] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <SiWhatsapp size={16} />
              Pedir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
