import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import {
  MapPin, Phone, Clock, Heart, ArrowLeft, Star,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { STORES, REVIEWS } from "@/data/mock";
import { useFavorites } from "@/lib/favorites";
import { StarRating } from "@/components/StarRating";
import { PageTransition } from "@/components/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function StoreProfile() {
  const { id } = useParams<{ id: string }>();
  const store = STORES.find((s) => s.id === id);
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!store) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">Loja não encontrada</h2>
        <p className="text-muted-foreground mb-6">Esta loja não existe ou foi removida.</p>
        <Link href="/busca">
          <Button>Voltar para a busca</Button>
        </Link>
      </div>
    );
  }

  const reviews = REVIEWS.filter((r) => r.storeId === store.id);

  const hours = [
    { day: "Segunda-Sexta", time: "08:00 – 18:00" },
    { day: "Sábado", time: "09:00 – 14:00" },
    { day: "Domingo", time: "Fechado" },
  ];

  return (
    <PageTransition>
      {/* Cover header */}
      <div
        className="relative h-56 sm:h-72 w-full"
        style={{ backgroundColor: store.coverColor }}
      >
        <Link href="/busca">
          <button
            data-testid="button-back"
            className="absolute top-4 left-4 p-2.5 rounded-xl bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-colors"
          >
            <ArrowLeft size={18} className="text-foreground" />
          </button>
        </Link>
        <button
          data-testid="button-favorite-profile"
          onClick={() => toggleFavorite(store.id)}
          className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-colors"
        >
          <Heart
            size={18}
            className={isFavorite(store.id) ? "fill-rose-500 text-rose-500" : "text-foreground"}
          />
        </button>
        <Badge
          className={`absolute bottom-4 left-4 text-xs font-medium ${
            store.isOpen
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-gray-100 text-gray-500 border-gray-200"
          }`}
          variant="outline"
        >
          {store.isOpen ? "Aberto agora" : "Fechado"}
        </Badge>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Store header info */}
        <div className="py-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
              {store.category}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{store.name}</h1>
            <div className="mt-2">
              <StarRating rating={store.rating} reviewCount={store.reviewCount} size="md" />
            </div>
            <p className="text-sm text-muted-foreground mt-2 max-w-lg">{store.description}</p>
          </div>

          <div className="flex-shrink-0">
            <a
              href={`https://wa.me/${store.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="button-whatsapp"
            >
              <Button
                className="bg-[#25D366] hover:bg-[#20c05a] text-white font-semibold px-6 gap-2 h-11"
              >
                <SiWhatsapp size={18} />
                Fale no WhatsApp
              </Button>
            </a>
          </div>
        </div>

        <Separator />

        {/* Tabs */}
        <Tabs defaultValue="produtos" className="mt-6 pb-12">
          <TabsList className="mb-6">
            <TabsTrigger value="produtos" data-testid="tab-produtos">Produtos / Serviços</TabsTrigger>
            <TabsTrigger value="info" data-testid="tab-info">Informações</TabsTrigger>
            <TabsTrigger value="avaliacoes" data-testid="tab-avaliacoes">
              Avaliações ({reviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="produtos">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {store.products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border border-card-border rounded-xl overflow-hidden"
                  data-testid={`card-product-${product.id}`}
                >
                  <div
                    className="h-32 w-full"
                    style={{ backgroundColor: product.imageColor }}
                  />
                  <div className="p-3">
                    <p className="text-sm font-semibold text-foreground leading-tight">
                      {product.name}
                    </p>
                    {product.price > 0 ? (
                      <p className="text-sm font-bold text-primary mt-1">
                        R$ {product.price.toFixed(2).replace(".", ",")}
                      </p>
                    ) : (
                      <p className="text-xs text-emerald-600 font-medium mt-1">Gratuito</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="info">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-card border border-card-border rounded-xl p-5 space-y-4">
                <h3 className="font-semibold text-foreground text-sm">Contato e localização</h3>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{store.address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-primary flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{store.phone}</p>
                </div>
              </div>

              <div className="bg-card border border-card-border rounded-xl p-5">
                <h3 className="font-semibold text-foreground text-sm mb-4 flex items-center gap-2">
                  <Clock size={15} className="text-primary" />
                  Horários de atendimento
                </h3>
                <table className="w-full text-sm">
                  <tbody>
                    {hours.map((h) => (
                      <tr key={h.day} className="border-b border-border last:border-0">
                        <td className="py-2 text-muted-foreground">{h.day}</td>
                        <td className="py-2 text-right font-medium text-foreground">
                          {h.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Map placeholder */}
              <div className="sm:col-span-2 bg-muted rounded-xl h-40 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={28} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Mapa indisponível no modo demonstração</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="avaliacoes">
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <Star size={32} className="text-muted mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Ainda não há avaliações para esta loja.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review, i) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-card border border-card-border rounded-xl p-5"
                    data-testid={`card-review-${review.id}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-sm text-foreground">{review.author}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{review.date}</p>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{review.text}</p>
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
