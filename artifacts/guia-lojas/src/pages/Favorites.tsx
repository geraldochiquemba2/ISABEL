import { motion } from "framer-motion";
import { Heart, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useFavorites } from "@/lib/favorites";
import { fetchStoreById } from "@/lib/api";
import { StoreCard } from "@/components/StoreCard";
import { PageTransition } from "@/components/PageTransition";
import type { Store } from "@/data/mock";

export default function Favorites() {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const [, setLocation] = useLocation();

  const selectedStore = typeof window !== "undefined" ? localStorage.getItem("eliora-selected-store") : null;

  const themeMap: Record<string, any> = {
    collection: { bg: "bg-[#FBF7EC]", text: "text-[#171717]", subtext: "text-[#77736D]", border: "border-[#E9D9B6]", accent: "bg-[#D8B532]", accentHover: "hover:bg-[#B8962A]", heartBg: "bg-[#E9D9B6]/50", heartText: "text-[#A96F12]", explore: "/busca" },
    weddings: { bg: "bg-[#F8F6F1]", text: "text-[#2B2B2B]", subtext: "text-[#6B6B6B]", border: "border-[#E7E3DC]", accent: "bg-[#B9A07E]", accentHover: "hover:bg-[#A8926C]", heartBg: "bg-[#F0ECE4]", heartText: "text-[#8B7355]", explore: "/explorar-weddings" },
    "love-services": { bg: "bg-[#FFF7F9]", text: "text-[#2B2B2B]", subtext: "text-[#6B6B6B]", border: "border-[#F3E0E6]", accent: "bg-[#E86F9C]", accentHover: "hover:bg-[#D85F8C]", heartBg: "bg-[#FCE7EF]", heartText: "text-[#C94F85]", explore: "/explorar-love" },
    business: { bg: "bg-[#F8FAFC]", text: "text-[#0F172A]", subtext: "text-[#475569]", border: "border-[#E2E8F0]", accent: "bg-[#2563EB]", accentHover: "hover:bg-[#1D4ED8]", heartBg: "bg-[#DBEAFE]", heartText: "text-[#1E40AF]", explore: "/explorar-empresas" },
    formacoes: { bg: "bg-[#F7F9FF]", text: "text-[#0F172A]", subtext: "text-[#475569]", border: "border-[#E2E8F0]", accent: "bg-[#3B82F6]", accentHover: "hover:bg-[#2563EB]", heartBg: "bg-[#DBEAFE]", heartText: "text-[#1D4ED8]", explore: "/explorar-formacoes" },
    eventos: { bg: "bg-[#FBF8F4]", text: "text-[#191817]", subtext: "text-[#6B6B6B]", border: "border-[#E8DDD0]", accent: "bg-[#C45125]", accentHover: "hover:bg-[#a33f1c]", heartBg: "bg-[#F3E4DD]", heartText: "text-[#C45125]", explore: "/explorar-eventos" },
    entretenimento: { bg: "bg-[#F8F7FF]", text: "text-[#1E1B4B]", subtext: "text-[#475569]", border: "border-[#E0E7FF]", accent: "bg-[#6366F1]", accentHover: "hover:bg-[#4F46E5]", heartBg: "bg-[#E0E7FF]", heartText: "text-[#4338CA]", explore: "/explorar-entretenimento" },
    imoveis: { bg: "bg-[#F7F8FA]", text: "text-[#1F2937]", subtext: "text-[#4B5563]", border: "border-[#E5E7EB]", accent: "bg-[#0F766E]", accentHover: "hover:bg-[#115E59]", heartBg: "bg-[#CCFBF1]", heartText: "text-[#0F766E]", explore: "/explorar-imoveis" },
    infantil: { bg: "bg-[#FFF8FB]", text: "text-[#2B2B2B]", subtext: "text-[#6B6B6B]", border: "border-[#F3E0F7]", accent: "bg-[#EC4899]", accentHover: "hover:bg-[#DB2777]", heartBg: "bg-[#FCE7F3]", heartText: "text-[#BE185D]", explore: "/explorar-infantil" },
    automoveis: { bg: "bg-[#F8FAFF]", text: "text-[#0F172A]", subtext: "text-[#475569]", border: "border-[#DBEAFE]", accent: "bg-[#2563EB]", accentHover: "hover:bg-[#1D4ED8]", heartBg: "bg-[#DBEAFE]", heartText: "text-[#1E40AF]", explore: "/explorar-automoveis" },
    saude: { bg: "bg-[#F7FFFD]", text: "text-[#064E3B]", subtext: "text-[#475569]", border: "border-[#A7F3D0]", accent: "bg-[#059669]", accentHover: "hover:bg-[#047857]", heartBg: "bg-[#D1FAE5]", heartText: "text-[#065F46]", explore: "/explorar-saude" },
    beleza: { bg: "bg-[#FFFBFD]", text: "text-[#2B2B2B]", subtext: "text-[#6B6B6B]", border: "border-[#F3E0E8]", accent: "bg-[#D946EF]", accentHover: "hover:bg-[#C026D3]", heartBg: "bg-[#FAE8FF]", heartText: "text-[#A21CAF]", explore: "/explorar-beleza" },
    casa: { bg: "bg-[#FBFAF7]", text: "text-[#2B2B2B]", subtext: "text-[#6B6B6B]", border: "border-[#E7E3DC]", accent: "bg-[#8B7355]", accentHover: "hover:bg-[#7A6248]", heartBg: "bg-[#F0ECE4]", heartText: "text-[#7A6248]", explore: "/explorar-casa" },
    "tecnologia-electronicos": { bg: "bg-[#F8FAFF]", text: "text-[#0F172A]", subtext: "text-[#475569]", border: "border-[#E2E8F0]", accent: "bg-[#0EA5E9]", accentHover: "hover:bg-[#0284C7]", heartBg: "bg-[#E0F2FE]", heartText: "text-[#0369A1]", explore: "/explorar-tecnologia" },
    "alimentacao-restauracao": { bg: "bg-[#FFFBF7]", text: "text-[#2B2B2B]", subtext: "text-[#6B6B6B]", border: "border-[#FDE68A]", accent: "bg-[#F59E0B]", accentHover: "hover:bg-[#D97706]", heartBg: "bg-[#FEF3C7]", heartText: "text-[#92400E]", explore: "/explorar-alimentacao" },
    "turismo-lazer": { bg: "bg-[#F7FFFE]", text: "text-[#064E3B]", subtext: "text-[#475569]", border: "border-[#99F6E4]", accent: "bg-[#14B8A6]", accentHover: "hover:bg-[#0D9488]", heartBg: "bg-[#CCFBF1]", heartText: "text-[#115E59]", explore: "/explorar-turismo" },
    "desporto-fitness": { bg: "bg-[#F7FFF9]", text: "text-[#14532D]", subtext: "text-[#475569]", border: "border-[#BBF7D0]", accent: "bg-[#22C55E]", accentHover: "hover:bg-[#16A34A]", heartBg: "bg-[#DCFCE7]", heartText: "text-[#166534]", explore: "/explorar-desporto" },
    "empregos-oportunidades": { bg: "bg-[#F8FAFC]", text: "text-[#0F172A]", subtext: "text-[#475569]", border: "border-[#E2E8F0]", accent: "bg-[#475569]", accentHover: "hover:bg-[#334155]", heartBg: "bg-[#E2E8F0]", heartText: "text-[#1E293B]", explore: "/explorar-empregos" },
    "agricultura-agronegocio": { bg: "bg-[#F7FFF7]", text: "text-[#14532D]", subtext: "text-[#475569]", border: "border-[#BBF7D0]", accent: "bg-[#16A34A]", accentHover: "hover:bg-[#15803D]", heartBg: "bg-[#DCFCE7]", heartText: "text-[#166534]", explore: "/explorar-agricultura" },
    "influenciadores-criadores": { bg: "bg-[#FFFBFD]", text: "text-[#2B2B2B]", subtext: "text-[#6B6B6B]", border: "border-[#F3E8FF]", accent: "bg-[#A855F7]", accentHover: "hover:bg-[#9333EA]", heartBg: "bg-[#F3E8FF]", heartText: "text-[#6B21A8]", explore: "/explorar-influenciadores" },
    "transportes-logistica": { bg: "bg-[#F8FAFC]", text: "text-[#0F172A]", subtext: "text-[#475569]", border: "border-[#E2E8F0]", accent: "bg-[#64748B]", accentHover: "hover:bg-[#475569]", heartBg: "bg-[#E2E8F0]", heartText: "text-[#334155]", explore: "/explorar-transportes" },
    "servicos-profissionais": { bg: "bg-[#F8FAFC]", text: "text-[#0F172A]", subtext: "text-[#475569]", border: "border-[#E2E8F0]", accent: "bg-[#475569]", accentHover: "hover:bg-[#334155]", heartBg: "bg-[#E2E8F0]", heartText: "text-[#1E293B]", explore: "/explorar-servicos" },
    bancos: { bg: "bg-[#F8FAFF]", text: "text-[#0F172A]", subtext: "text-[#475569]", border: "border-[#DBEAFE]", accent: "bg-[#1D4ED8]", accentHover: "hover:bg-[#1E40AF]", heartBg: "bg-[#DBEAFE]", heartText: "text-[#1E3A8A]", explore: "/explorar-bancos" },
    seguradoras: { bg: "bg-[#F8FAFF]", text: "text-[#0F172A]", subtext: "text-[#475569]", border: "border-[#DBEAFE]", accent: "bg-[#2563EB]", accentHover: "hover:bg-[#1D4ED8]", heartBg: "bg-[#DBEAFE]", heartText: "text-[#1E40AF]", explore: "/explorar-seguradoras" }
  };

  const theme = themeMap[selectedStore || "collection"] || themeMap.collection;

  const { data: stores = [], isLoading } = useQuery<Store[]>({
    queryKey: ["favorite-stores", favorites.join(",")],
    queryFn: async () => {
      const results = await Promise.allSettled(favorites.map((id) => fetchStoreById(id)));
      return results
        .filter((r): r is PromiseFulfilledResult<Store> => r.status === "fulfilled" && !!r.value)
        .map((r) => r.value);
    },
    enabled: favorites.length > 0,
    staleTime: 60_000,
  });

  const bg = theme.bg;
  const text = theme.text;
  const border = theme.border;
  const accent = theme.accent;
  const accentHover = theme.accentHover;
  const heartText = theme.heartText;
  const heartBg = theme.heartBg;
  const subtext = theme.subtext;

  return (
    <PageTransition>
      <div className={`min-h-[100dvh] ${bg} ${text}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="mb-8">
            <button onClick={() => window.history.back()} className={`mb-4 w-10 h-10 rounded-2xl bg-white border ${border} ${text} grid place-items-center hover:opacity-90 transition-colors`}>
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-2.5">
              <span className={`w-10 h-10 rounded-2xl ${accent} text-white grid place-items-center`}>
                <Heart size={18} fill="currentColor" />
              </span>
              <h1 className="text-2xl font-semibold tracking-tight">Lojas Favoritas</h1>
            </div>
            <p className={`text-sm mt-2 ${subtext}`}>
              {favorites.length === 0
                ? "Nenhuma loja guardada ainda."
                : `${favorites.length} ${favorites.length === 1 ? "loja guardada" : "lojas guardadas"} para encontrar depois.`}
            </p>
          </div>

          {favorites.length > 0 && isLoading ? (
            <div className="py-24 flex flex-col items-center gap-3 text-[#77736D]">
              <Loader2 size={22} className="animate-spin" />
              <p className="text-sm">A carregar as lojas guardadas...</p>
            </div>
          ) : stores.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className={`w-16 h-16 rounded-full ${heartBg} grid place-items-center mb-5`}>
                <Heart size={28} className={`${heartText} opacity-60`} />
              </div>
              <p className={`${text} text-sm font-medium mb-1`}>
                {favorites.length > 0 ? "As lojas guardadas já não estão disponíveis." : "Explore lojas e guarde as favoritas"}
              </p>
              <p className={`${subtext} text-xs mb-7`}>Toque no coração de qualquer loja para a guardar aqui.</p>
              <button onClick={() => setLocation(theme.explore)} className={`inline-flex items-center gap-1.5 text-sm font-medium text-white ${accent} ${accentHover} rounded-full px-5 py-2.5 transition-colors`}>
                Explorar lojas <ArrowRight size={14} />
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {stores.map((store, i) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  isFavorite={isFavorite(store.id)}
                  onToggleFavorite={toggleFavorite}
                  index={i}
                />
              ))}
            </div>
          )}

          <div className={`mt-12 flex flex-wrap items-center gap-x-4 gap-y-2 border-t ${border} pt-5 text-xs`}>
            <Link href="/termos"><span className={`font-medium ${text} hover:opacity-80 transition-colors`}>Termos e Condições</span></Link>
            <Link href="/privacidade"><span className={`font-medium ${text} hover:opacity-80 transition-colors`}>Política de Privacidade</span></Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
