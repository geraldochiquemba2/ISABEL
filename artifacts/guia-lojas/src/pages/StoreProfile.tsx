import { useState, useMemo } from "react";
import { useParams, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Clock, Heart, ArrowLeft, Tag, ChevronRight, MessageSquare } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { STORES } from "@/data/mock";
import { useFavorites } from "@/lib/favorites";
import { PageTransition } from "@/components/PageTransition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StoreProfile() {
  const { id } = useParams<{ id: string }>();
  const store = STORES.find((s) => s.id === id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [coverError, setCoverError] = useState(false);

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

  const hours = [
    { day: "Segunda — Sexta", time: "08:00 – 18:00" },
    { day: "Sábado", time: "09:00 – 14:00" },
    { day: "Domingo", time: "Fechado" },
  ];

  return (
    <PageTransition>
      {/* Cover */}
      <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-muted">
        {!coverError ? (
          <img
            src={store.coverImage}
            alt={store.name}
            className="w-full h-full object-cover"
            onError={() => setCoverError(true)}
          />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: store.coverColor }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        <button
          data-testid="button-back"
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors backdrop-blur-sm"
        >
          <ArrowLeft size={16} className="text-foreground" />
        </button>

        <button
          data-testid="button-favorite-profile"
          onClick={() => toggleFavorite(store.id)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors backdrop-blur-sm"
        >
          <Heart size={16} className={isFavorite(store.id) ? "fill-rose-500 text-rose-500" : "text-foreground"} />
        </button>

        {/* Title overlay on cover */}
        <div className="absolute bottom-5 left-5 right-5">
          <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full mb-2 ${
            store.isOpen ? "bg-white/90 text-emerald-700" : "bg-white/80 text-muted-foreground"
          }`}>
            {store.isOpen ? "Aberto agora" : "Fechado"}
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight drop-shadow-sm">{store.name}</h1>
          <p className="text-white/80 text-sm mt-0.5">{store.category}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Meta bar */}
        <div className="py-5 border-b border-border space-y-4">
          <p className="text-sm text-muted-foreground max-w-2xl">{store.description}</p>

          {/* Address */}
          <div className="flex items-start gap-2">
            <MapPin size={14} className="text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground">{store.address}</p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://wa.me/${store.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="button-whatsapp"
            >
              <button className="flex items-center gap-2 bg-[#25D366] hover:bg-[#22c35f] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors whitespace-nowrap">
                <SiWhatsapp size={15} />
                WhatsApp
              </button>
            </a>

            <a href={`tel:${store.phone.replace(/\D/g, "")}`} data-testid="button-call">
              <button className="flex items-center gap-2 border border-border text-foreground text-sm font-medium px-5 py-2.5 rounded-full hover:bg-muted transition-colors whitespace-nowrap">
                <Phone size={14} />
                Ligar
              </button>
            </a>

            <a
              href={`https://wa.me/${store.whatsapp}?text=Olá, vim pelo GuiaLocal e gostaria de mais informações.`}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="button-message"
            >
              <button className="flex items-center gap-2 border border-border text-foreground text-sm font-medium px-5 py-2.5 rounded-full hover:bg-muted transition-colors whitespace-nowrap">
                <MessageSquare size={14} />
                Mensagem
              </button>
            </a>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="produtos" className="py-6 pb-14">
          <TabsList className="bg-transparent border-0 gap-0 p-0 mb-7 border-b border-border w-full justify-start rounded-none h-auto">
            {[
              { value: "produtos", label: "Produtos / Serviços" },
              { value: "info", label: "Informações" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                data-testid={`tab-${tab.value}`}
                className="rounded-none border-0 bg-transparent px-4 pb-3 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="produtos">
            <ProductsTab products={store.products} />
          </TabsContent>

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

              <div className="sm:col-span-2 bg-muted rounded-2xl h-44 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={22} className="text-muted-foreground mx-auto mb-2 opacity-30" />
                  <p className="text-xs text-muted-foreground">Mapa indisponível no modo demonstração</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}

function ProductsTab({ products }: { products: { id: string; name: string; price: number; imageColor: string; imageUrl?: string; category?: string; subcategory?: string }[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);

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
          <ProductCard key={product.id} product={product} index={i} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-sm text-muted-foreground py-8 text-center">Nenhum item nesta categoria.</p>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product, index }: { product: { id: string; name: string; price: number; imageColor: string; imageUrl?: string; category?: string; subcategory?: string }; index: number }) {
  const [imgError, setImgError] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.04 }}
      className="group cursor-pointer"
      data-testid={`card-product-${product.id}`}
    >
      <div className="relative overflow-hidden rounded-xl h-40 mb-3 bg-muted">
        {product.imageUrl && !imgError ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: product.imageColor }} />
        )}
      </div>
      <p className="text-sm font-medium text-foreground leading-tight">{product.name}</p>
      {product.price > 0 ? (
        <p className="text-sm font-semibold text-foreground mt-0.5">
          R$ {product.price.toFixed(2).replace(".", ",")}
        </p>
      ) : (
        <p className="text-xs text-emerald-600 font-medium mt-0.5">Gratuito</p>
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
    </motion.div>
  );
}
