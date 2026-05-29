import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Heart, ArrowLeft } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { STORES, REVIEWS } from "@/data/mock";
import { useFavorites } from "@/lib/favorites";
import { StarRating } from "@/components/StarRating";
import { PageTransition } from "@/components/PageTransition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StoreProfile() {
  const { id } = useParams<{ id: string }>();
  const store = STORES.find((s) => s.id === id);
  const { isFavorite, toggleFavorite } = useFavorites();

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

  const reviews = REVIEWS.filter((r) => r.storeId === store.id);

  const hours = [
    { day: "Segunda — Sexta", time: "08:00 – 18:00" },
    { day: "Sábado", time: "09:00 – 14:00" },
    { day: "Domingo", time: "Fechado" },
  ];

  return (
    <PageTransition>
      {/* Cover */}
      <div className="relative h-64 sm:h-80 w-full" style={{ backgroundColor: store.coverColor }}>
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <Link href="/busca">
            <button data-testid="button-back" className="w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors">
              <ArrowLeft size={16} className="text-foreground" />
            </button>
          </Link>
        </div>
        <button
          data-testid="button-favorite-profile"
          onClick={() => toggleFavorite(store.id)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
        >
          <Heart size={16} className={isFavorite(store.id) ? "fill-rose-500 text-rose-500" : "text-foreground"} />
        </button>

        <div className="absolute bottom-4 left-4">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            store.isOpen ? "bg-white/90 text-emerald-700" : "bg-white/80 text-muted-foreground"
          }`}>
            {store.isOpen ? "Aberto agora" : "Fechado"}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="py-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5">{store.category}</p>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">{store.name}</h1>
            <div className="mt-2"><StarRating rating={store.rating} reviewCount={store.reviewCount} size="md" /></div>
            <p className="text-sm text-muted-foreground mt-3 max-w-md leading-relaxed">{store.description}</p>
          </div>
          <div className="flex-shrink-0">
            <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noopener noreferrer" data-testid="button-whatsapp">
              <button className="flex items-center gap-2 bg-[#25D366] hover:bg-[#22c35f] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors">
                <SiWhatsapp size={16} />
                Fale no WhatsApp
              </button>
            </a>
          </div>
        </div>

        <div className="border-t border-border" />

        {/* Tabs */}
        <Tabs defaultValue="produtos" className="py-6 pb-12">
          <TabsList className="bg-transparent border-0 gap-0 p-0 mb-6 border-b border-border w-full justify-start rounded-none h-auto">
            {[
              { value: "produtos", label: "Produtos / Serviços" },
              { value: "info", label: "Informações" },
              { value: "avaliacoes", label: `Avaliações (${reviews.length})` },
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {store.products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="group cursor-pointer"
                  data-testid={`card-product-${product.id}`}
                >
                  <div className="h-36 rounded-xl w-full mb-3" style={{ backgroundColor: product.imageColor }} />
                  <p className="text-sm font-medium text-foreground leading-tight">{product.name}</p>
                  {product.price > 0 ? (
                    <p className="text-sm text-foreground font-semibold mt-0.5">
                      R$ {product.price.toFixed(2).replace(".", ",")}
                    </p>
                  ) : (
                    <p className="text-xs text-emerald-600 font-medium mt-0.5">Gratuito</p>
                  )}
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="info">
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Contato</p>
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
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-1.5">
                  <Clock size={13} /> Horários
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

              <div className="sm:col-span-2 bg-muted rounded-2xl h-40 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={24} className="text-muted-foreground mx-auto mb-2 opacity-40" />
                  <p className="text-xs text-muted-foreground">Mapa indisponível no modo demonstração</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="avaliacoes">
            {reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground py-10 text-center">Nenhuma avaliação ainda.</p>
            ) : (
              <div className="space-y-4 max-w-2xl">
                {reviews.map((review, i) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="py-4 border-b border-border last:border-0"
                    data-testid={`card-review-${review.id}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{review.author}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{review.date}</p>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2.5 leading-relaxed">{review.text}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}
