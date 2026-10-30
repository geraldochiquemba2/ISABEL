import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, Link, useSearch } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Clock, Heart, ArrowLeft, Tag, ChevronRight, MessageSquare, X, ShoppingCart, Navigation, Flag, Ban, Map as MapIcon, LayoutDashboard, MoreHorizontal, Truck, Share2, ExternalLink, Pencil } from "lucide-react";
import { SiWhatsapp, SiInstagram, SiTiktok, SiFacebook } from "react-icons/si";
import { STORES, type Store } from "@/data/mock";
import { useFavorites } from "@/lib/favorites";
import { PageTransition } from "@/components/PageTransition";
import { SplashScreen } from "@/components/SplashScreen";
import { TermsGateProvider, useTermsGate } from "@/components/TermsGate";
import { getDeliveryInfo, getSocialHandle, getSocialLinks, type SocialKey } from "@/lib/storeExtras";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchStoreById, trackWhatsAppClick, reportContent, blockStore, unblockStore, updateStore } from "@/lib/api";
import { goBackFromStore } from "@/lib/storeBack";
import { dashboardPathForUser } from "@/lib/session";
import { thumbUrl, thumbList, dedupeUrls, shareUrl } from "@/lib/img";

function MapPreview({ latitude, longitude }: { latitude: number; longitude: number }) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !latitude || !longitude) return;

    const loadLeaflet = async () => {
      if (!(window as any).L) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);

        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        document.head.appendChild(script);
        await new Promise<void>((resolve) => { script.onload = () => resolve(); });
      }

      const L = (window as any).L;
      const map = L.map(mapRef.current, { zoomControl: false, maxZoom: 17 }).setView([latitude, longitude], 15);
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { attribution: "" }).addTo(map);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { opacity: 0.3 }).addTo(map);
      L.marker([latitude, longitude]).addTo(map);

      setTimeout(() => map.invalidateSize(), 100);
    };

    loadLeaflet();
  }, [latitude, longitude]);

  return <div ref={mapRef} className="w-full h-full bg-gray-100" />;
}

export default function StoreProfile() {
  return (
    <TermsGateProvider>
      <StoreProfileContent />
    </TermsGateProvider>
  );
}

function StoreProfileContent() {
  const { id } = useParams<{ id: string }>();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const tabParam = params.get("tab");
  const isFromWeddings = params.get("from") === "weddings";
  const servicoParam = params.get("servico");

  // Voltar com fallback determinístico (ver @/lib/storeBack):
  // link direto (WhatsApp/partilha) não tem histórico interno — nesse caso
  // vamos para a home da vertical de ?from= em vez de página vazia.
  const handleBack = () => goBackFromStore(params.get("from"));
  const { guard } = useTermsGate();
  const queryClient = useQueryClient();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [coverError, setCoverError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMapApps, setShowMapApps] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSent, setReportSent] = useState(false);
  const [reportError, setReportError] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const coverTouch = useRef<{ x: number } | null>(null);
  const coverDragging = useRef(false);
  const [dragX, setDragX] = useState<number | null>(null);

  const { data: store, isLoading } = useQuery({
    queryKey: ["store", id],
    queryFn: () => fetchStoreById(id!),
    enabled: !!id,
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
  });

  function getViewer() {
    try {
      const s = localStorage.getItem("guialocal_user");
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  }

  const viewer = getViewer();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("yesola-blocks");
      const list: string[] = raw ? JSON.parse(raw) : [];
      if (store?.id && list.includes(store.id)) setIsBlocked(true);
      else setIsBlocked(false);
    } catch { /* ignora */ }
    if (store) {
      import("@/lib/statusColor").then((m) => m.setStatusColor(m.colorForStore(store as any)));
    }
  }, [store?.id]);

  useEffect(() => {
    if (!showMore) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!moreRef.current?.contains(e.target as Node)) setShowMore(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [showMore]);

  function toggleLocalBlock(id: string, block: boolean) {
    try {
      const raw = localStorage.getItem("yesola-blocks");
      const list: string[] = raw ? JSON.parse(raw) : [];
      const next = block ? Array.from(new Set([...list, id])) : list.filter((x) => x !== id);
      localStorage.setItem("yesola-blocks", JSON.stringify(next));
    } catch { /* ignora */ }
  }

  async function handleBlockToggle() {
    const v = getViewer();
    if (!v?.phone) {
      alert("Inicie sessão para bloquear lojas.");
      window.location.href = "/login";
      return;
    }
    if (!store?.id) return;
    try {
      if (!isBlocked) {
        if (v?.phone) await blockStore(v.phone, v.storeType || "collection", store.id);
        toggleLocalBlock(store.id, true);
        setIsBlocked(true);
      } else {
        if (v?.phone) await unblockStore(v.phone, v.storeType || "collection", store.id);
        toggleLocalBlock(store.id, false);
        setIsBlocked(false);
      }
    } catch {
      alert("Não foi possível atualizar o bloqueio. Tente novamente.");
    }
  }

  async function handleSendReport() {
    if (!store?.id) return;
    if (reportReason.trim().length < 3) { setReportError("Descreva o motivo."); return; }
    setReportError("");
    try {
      const v = getViewer();
      await reportContent({
        phone: v?.phone, storeType: v?.storeType || "collection",
        targetType: "store", targetId: store.id, reason: reportReason.trim(),
      });
      setReportSent(true);
    } catch (e: any) {
      setReportError(e.message || "Erro ao enviar denúncia.");
    }
  }

  // Calcular imagens e carrossel ANTES dos early returns (regra dos hooks React)
  // Thumbs (480px) no carrossel: a cheia (1600px/original de MBs) demorava
  // segundos a aparecer ao clicar no card. Full só no lightbox/modal.
  const fullCoverImages = dedupeUrls(store?.coverImages && store.coverImages.length > 0
    ? store.coverImages
    : (store?.coverImage ? [store.coverImage] : []));
  const images = useMemo(() => thumbList(fullCoverImages), [store?.coverImages, store?.coverImage]);

  // Swipe lateral (toque e rato) para navegar nas fotos da capa
  const swipeCover = (dx: number) => {
    if (images.length <= 1) return;
    if (dx < -40) setCurrentImageIndex((p) => (p + 1) % images.length);
    else if (dx > 40) setCurrentImageIndex((p) => (p - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      if (coverDragging.current) return;
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [images.length]);

  // Pré-carrega as restantes thumbs + a 1ª cheia em idle para o swipe/lightbox
  // abrir instantâneo depois do clique no card.
  useEffect(() => {
    if (fullCoverImages.length === 0) return;
    const preload = (src: string) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    };
    // thumbs seguintes imediato
    images.slice(1, 4).forEach(preload);
    // cheia da 1ª foto em idle (para zoom futuro sem esperar)
    const idle = (window as any).requestIdleCallback as ((cb: () => void) => void) | undefined;
    const firstFull = fullCoverImages[0];
    if (firstFull) {
      if (idle) idle(() => preload(firstFull));
      else setTimeout(() => preload(firstFull), 1500);
    }
  }, [images, fullCoverImages]);

  if (isLoading) {
    return <SplashScreen show label="A carregar loja..." />;
  }

  if (!store) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <p className="text-[#77736D] mb-4 text-sm">Loja não encontrada.</p>
        <Link href="/busca">
          <span className="text-sm font-medium text-[#171717] underline">Voltar</span>
        </Link>
      </div>
    );
  }

  const currentImage = images[currentImageIndex];
  const socialLinks = getSocialLinks(store);
  const deliveryInfo = getDeliveryInfo(store);
  const saved = isFavorite(store.id);
  const isOwner = !!viewer?.storeId && viewer.storeId === store.id;
  const whatsappNumber = toAngolaWhatsApp(store.whatsapp || store.phone);
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Olá, vim pela loja ${store.name} (${store.category}) e gostaria de mais informações.`)}`
    : "";
  const telHref = store.phone
    ? `tel:${store.phone.startsWith("+") ? store.phone : `+244${store.phone.replace(/\D/g, "")}`}`
    : "";

  const openWhatsApp = () => {
    trackWhatsAppClick(store.id);
    window.open(whatsappHref, "_blank", "noopener,noreferrer");
  };
  const onWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    guard(openWhatsApp);
  };
  const onCallClick = (e: React.MouseEvent) => {
    e.preventDefault();
    guard(() => {
      window.location.href = telHref;
    });
  };
  const handleFavorite = () => {
    toggleFavorite(store.id);
    toast({
      title: saved ? "Removida das guardadas" : "Loja guardada",
      description: saved ? "Pode voltar a guardá-la quando quiser." : "Encontra-a depois em Lojas Favoritas.",
    });
  };

  const endCoverDrag = (dx: number | null) => {
    coverDragging.current = false;
    setDragX(null);
    if (dx !== null) swipeCover(dx);
  };

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
      <div className={isFromWeddings ? `${weddingsBg} min-h-screen` : "bg-[#FBF7EC] min-h-screen text-[#171717]"}>
      {/* Cover com carrossel */}
      <div
        className={`relative h-72 sm:h-96 w-full overflow-hidden cursor-grab active:cursor-grabbing select-none touch-pan-y ${isFromWeddings ? "bg-[#e5e7e9]" : "bg-[#E9D9B6]"}`}
        onTouchStart={(e) => { coverTouch.current = { x: e.touches[0].clientX }; coverDragging.current = true; }}
        onTouchMove={(e) => { if (!coverTouch.current) return; setDragX(e.touches[0].clientX - coverTouch.current.x); }}
        onTouchEnd={(e) => {
          if (!coverTouch.current) return;
          const dx = e.changedTouches[0].clientX - coverTouch.current.x;
          coverTouch.current = null;
          endCoverDrag(dx);
        }}
        onMouseDown={(e) => { coverTouch.current = { x: e.clientX }; coverDragging.current = true; }}
        onMouseMove={(e) => { if (!coverTouch.current) return; setDragX(e.clientX - coverTouch.current.x); }}
        onMouseUp={(e) => {
          if (!coverTouch.current) return;
          const dx = e.clientX - coverTouch.current.x;
          coverTouch.current = null;
          endCoverDrag(dx);
        }}
        onMouseLeave={() => {
          if (!coverTouch.current) return;
          coverTouch.current = null;
          endCoverDrag(null);
        }}
      >
        {!coverError && images.length > 0 ? (
          <>
            {/* Pista deslizante 1:1 com o dedo */}
            <div
              className="flex h-full w-full"
              style={{
                transform: `translateX(calc(${-currentImageIndex * 100}% + ${dragX ?? 0}px))`,
                transition: dragX === null ? "transform 0.35s ease-out" : "none",
              }}
            >
              {images.map((src, i) => (
                <div key={i} className="relative h-full w-full flex-shrink-0 overflow-hidden">
                  {/* Fundo borrado */}
                  <div
                    className="absolute inset-0 bg-cover bg-center blur-xl scale-110 opacity-70"
                    style={{ backgroundImage: `url(${src})` }}
                  />
                  {/* Imagem principal contida */}
                  <img
                    src={src}
                    alt={store.name}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    loading={i === 0 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : "auto"}
                    decoding="async"
                    className="relative z-0 h-full w-full object-contain"
                    onError={() => setCoverError(true)}
                  />
                </div>
              ))}
            </div>
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
          onClick={handleBack}
          className={`fixed left-4 w-9 h-9 rounded-full ${isFromWeddings ? "bg-[#2c3035]/80 hover:bg-[#2c3035] text-white" : "bg-white/80 hover:bg-white text-[#171717]"} flex items-center justify-center transition-colors backdrop-blur-sm z-20`}
          style={{ top: "calc(1rem + env(safe-area-inset-top))" }}
        >
          <ArrowLeft size={16} />
        </button>

        <div className="fixed right-4 flex items-center gap-2 z-20" style={{ top: "calc(1rem + env(safe-area-inset-top))" }}>
          {viewer?.phone && (
            <a
              href={dashboardPathForUser(viewer)}
              data-testid="button-back-dashboard"
              title="Voltar ao meu painel"
              className={`flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium ${isFromWeddings ? "bg-[#2c3035]/80 hover:bg-[#2c3035] text-white" : "bg-white/80 hover:bg-white text-[#171717]"} transition-colors backdrop-blur-sm`}
            >
              <LayoutDashboard size={14} />
              Painel
            </a>
          )}
          <button
              onClick={handleFavorite}
              aria-pressed={saved}
              title={saved ? "Remover das lojas favoritas" : "Guardar loja"}
              data-testid="button-save-store-cover"
              className={`w-9 h-9 rounded-full ${isFromWeddings ? "bg-[#2c3035]/80 hover:bg-[#2c3035] text-white" : "bg-white/80 hover:bg-white text-[#171717]"} flex items-center justify-center transition-colors backdrop-blur-sm`}
            >
            <Heart size={15} className={saved ? "text-rose-500" : ""} fill={saved ? "currentColor" : "none"} />
          </button>
          <button
            onClick={async () => {
              const shareData = {
                title: store.name,
                text: `Conheça a loja ${store.name} (${store.category}) no Guia de Lojas!`,
                url: window.location.href,
              };
              if (navigator.share) {
                try {
                  await navigator.share(shareData);
                } catch (err) {}
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link da loja copiado para a área de transferência!");
              }
            }}
            data-testid="button-share-cover"
            className={`w-9 h-9 rounded-full ${isFromWeddings ? "bg-[#2c3035]/80 hover:bg-[#2c3035] text-white" : "bg-white/80 hover:bg-white text-[#171717]"} flex items-center justify-center transition-colors backdrop-blur-sm`}
            title="Partilhar loja"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
        </div>


      </div>

      {/* Store title row below cover */}
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 py-5 flex items-center gap-4 border-b bg-white ${isFromWeddings ? weddingsBorder : "border-[#E9D9B6]"}`}>
        {store.logoUrl ? (
          <img
            src={thumbUrl(store.logoUrl)}
            alt={`${store.name} Logo`}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover bg-white border border-[#E9D9B6] shadow-sm flex-shrink-0"
          loading="eager" decoding="async" />
        ) : (
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#E9D9B6] border border-[#E9D9B6] flex items-center justify-center flex-shrink-0 text-lg font-bold text-[#171717]">
            {store.name.substring(0, 2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
              store.isOpen
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-[#E9D9B6]/40 text-[#77736D] border-[#E9D9B6]"
            }`}>
              {store.isOpen ? "Aberto agora" : "Fechado"}
            </span>
          </div>
          <h1 className={`text-xl sm:text-2xl font-semibold tracking-tight truncate ${isFromWeddings ? weddingsText : "text-[#171717]"}`}>{store.name}</h1>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <p className="text-sm text-[#77736D]">{store.category}</p>
            {store.province && store.municipality && (
              <>
                <span className="text-[#77736D] text-xs">·</span>
                <span className="text-xs font-medium text-[#171717] bg-[#FBF7EC] px-1.5 py-0.5 rounded border border-[#E9D9B6]">
                  {store.province}, {store.municipality}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Meta bar */}
        <div className="py-5 border-b border-[#E9D9B6] space-y-4">
          <p className="text-sm text-[#77736D] max-w-2xl">{store.description}</p>

          {/* Address */}
          {(store.province || store.municipality || (store.address && store.address.trim())) && (
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-[#77736D] mt-0.5 flex-shrink-0" />
              <p className="text-sm text-[#171717]">
                {store.province && store.municipality ? `${store.province}, ${store.municipality}${store.address && store.address.trim() ? ` — ${store.address}` : ""}` : store.address}
              </p>
            </div>
          )}

          {/* Horários */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
            <div className="flex items-center gap-1.5 text-[#77736D]">
              <Clock size={14} />
              <span className="text-xs font-semibold uppercase tracking-widest">Horários:</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#171717]">
              {hours.map((h) => (
                <div key={h.day} className="flex items-center gap-1.5 bg-[#FBF7EC]/50 px-2 py-0.5 rounded border border-[#E9D9B6]/50">
                  <span className="text-[#77736D]">{h.day}</span>
                  <span className="font-medium">{h.time}</span>
                </div>
              ))}
            </div>
          </div>

          {isOwner && (!socialLinks.length || !deliveryInfo) && (
            <div className="flex flex-col gap-2 rounded-2xl border border-[#E9D9B6] bg-white/70 p-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-[#171717]">Complete a sua loja</p>
                <p className="text-xs text-[#77736D] mt-0.5">Mostre as redes sociais e as condições de entrega aos clientes.</p>
              </div>
              <button
                onClick={() => setShowEditor(true)}
                className="self-start rounded-full bg-[#D8B532] px-4 py-2 text-xs font-semibold text-white hover:bg-[#B8962A] transition-colors sm:self-auto"
              >
                Adicionar
              </button>
            </div>
          )}

          {/* Action buttons — "Mais" é sempre o último. */}
          <div className="flex flex-wrap items-center gap-2">
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="button-whatsapp"
                onClick={onWhatsAppClick}
              >
                <button className="flex items-center gap-1.5 sm:gap-2 bg-[#25D366] hover:bg-[#22c35f] text-white text-xs sm:text-sm font-medium px-3 sm:px-5 py-2 sm:py-2.5 rounded-full transition-colors whitespace-nowrap">
                  <SiWhatsapp size={14} />
                  WhatsApp
                </button>
              </a>
            )}

            {store.phone && (
              <a href={telHref} data-testid="button-call" onClick={onCallClick}>
                <button className="flex items-center gap-1.5 sm:gap-2 border border-[#E9D9B6] text-[#171717] text-xs sm:text-sm font-medium px-3 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-[#E9D9B6]/50 transition-colors whitespace-nowrap">
                  <Phone size={13} />
                  Ligar
                </button>
              </a>
            )}

            {socialLinks.length > 0 && (
              <button
                onClick={() => setShowSocial(true)}
                data-testid="button-socials"
                className="flex items-center gap-1.5 sm:gap-2 border border-[#E9D9B6] text-[#171717] text-xs sm:text-sm font-medium px-3 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-[#E9D9B6]/50 transition-colors whitespace-nowrap"
              >
                <Share2 size={13} />
                Redes sociais
              </button>
            )}

            {deliveryInfo && (
              <button
                onClick={() => setShowDelivery(true)}
                data-testid="button-delivery"
                className="flex items-center gap-1.5 sm:gap-2 border border-[#E9D9B6] text-[#171717] text-xs sm:text-sm font-medium px-3 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-[#E9D9B6]/50 transition-colors whitespace-nowrap"
              >
                <Truck size={13} />
                Entregas
              </button>
            )}

            <button
              onClick={handleFavorite}
              aria-pressed={saved}
              data-testid="button-save-store"
              className={`flex items-center gap-1.5 sm:gap-2 border text-xs sm:text-sm font-medium px-3 sm:px-5 py-2 sm:py-2.5 rounded-full transition-colors whitespace-nowrap ${
                saved
                  ? "border-rose-200 bg-rose-50 text-rose-600"
                  : "border-[#E9D9B6] text-[#171717] hover:bg-[#E9D9B6]/50"
              }`}
            >
              <Heart size={13} fill={saved ? "currentColor" : "none"} />
              {saved ? "Guardada" : "Guardar"}
            </button>

            <button
              onClick={async () => {
                const shareData = {
                  title: store.name,
                  text: `Conheça a loja ${store.name} (${store.category}) no Guia de Lojas!`,
                  url: window.location.href,
                };
                if (navigator.share) {
                  try {
                    await navigator.share(shareData);
                  } catch (err) {
                    console.log("Compartilhamento cancelado");
                  }
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link da loja copiado para a área de transferência!");
                }
              }}
              data-testid="button-share-store"
              className="flex items-center gap-1.5 sm:gap-2 border border-[#E9D9B6] text-[#171717] text-xs sm:text-sm font-medium px-3 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-[#E9D9B6]/50 transition-colors whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              Partilhar
            </button>

            <button
              onClick={() => setShowMapApps(true)}
              data-testid="button-directions"
              className="flex items-center gap-1.5 sm:gap-2 border border-[#E9D9B6] text-[#171717] text-xs sm:text-sm font-medium px-3 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-[#E9D9B6]/50 transition-colors whitespace-nowrap"
            >
              <MapPin size={13} />
              Como chegar
            </button>

            <div className="relative ml-auto" ref={moreRef}>
              <button
                onClick={() => setShowMore((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={showMore}
                data-testid="button-more-store"
                className="flex items-center gap-1.5 sm:gap-2 border border-[#E9D9B6] text-[#171717] text-xs sm:text-sm font-medium px-3 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-[#E9D9B6]/50 transition-colors whitespace-nowrap"
              >
                <MoreHorizontal size={14} />
                Mais
              </button>
              <AnimatePresence>
                {showMore && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    role="menu"
                    className="absolute right-0 top-full mt-2 z-30 w-52 rounded-2xl border border-[#E9D9B6] bg-white p-1.5 shadow-xl"
                  >
                    <button
                      role="menuitem"
                      onClick={() => {
                        setShowMore(false);
                        setShowReport(true);
                        setReportSent(false);
                        setReportReason("");
                        setReportError("");
                      }}
                      data-testid="button-report-store"
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-[#171717] hover:bg-[#FBF7EC] transition-colors"
                    >
                      <Flag size={14} className="text-[#77736D]" />
                      Denunciar loja
                    </button>
                    <button
                      role="menuitem"
                      onClick={() => {
                        setShowMore(false);
                        void handleBlockToggle();
                      }}
                      data-testid="button-block-store"
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-[#171717] hover:bg-[#FBF7EC] transition-colors"
                    >
                      <Ban size={14} className="text-[#77736D]" />
                      {isBlocked ? "Desbloquear loja" : "Bloquear loja"}
                    </button>
                    {isOwner && (
                      <button
                        role="menuitem"
                        onClick={() => {
                          setShowMore(false);
                          setShowEditor(true);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-[#171717] hover:bg-[#FBF7EC] transition-colors"
                      >
                        <Pencil size={14} className="text-[#77736D]" />
                        Redes e entregas
                      </button>
                    )}
                    <div className="my-1 border-t border-[#E9D9B6]" />
                    <a
                      role="menuitem"
                      href="/termos"
                      onClick={() => setShowMore(false)}
                      className="flex w-full items-center rounded-xl px-3 py-2 text-left text-xs text-[#77736D] hover:bg-[#FBF7EC] hover:text-[#171717] transition-colors"
                    >
                      Termos e Condições
                    </a>
                    <a
                      role="menuitem"
                      href="/privacidade"
                      onClick={() => setShowMore(false)}
                      className="flex w-full items-center rounded-xl px-3 py-2 text-left text-xs text-[#77736D] hover:bg-[#FBF7EC] hover:text-[#171717] transition-colors"
                    >
                      Política de Privacidade
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Modal de Denúncia */}
        <AnimatePresence>
          {showReport && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
              onClick={() => setShowReport(false)}
            >
              <div
                className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base">Denunciar loja</h3>
                  <button onClick={() => setShowReport(false)} aria-label="Fechar"><X size={18} /></button>
                </div>
                {reportSent ? (
                  <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl p-3">
                    Denúncia enviada. A nossa equipa vai rever este conteúdo. Obrigado.
                  </p>
                ) : (
                  <>
                    <p className="text-xs text-gray-600">Descreva o problema com <strong>{store.name}</strong> (conteúdo impróprio, burla, informação falsa…).</p>
                    <textarea
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      rows={4}
                      placeholder="Motivo da denúncia"
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-yellow-500"
                    />
                    {reportError && <p className="text-xs text-red-600 font-medium">{reportError}</p>}
                    <button
                      onClick={handleSendReport}
                      className="w-full bg-foreground text-background py-2.5 rounded-full text-sm font-semibold"
                    >
                      Enviar denúncia
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal de Aplicativos de Mapa */}
        <AnimatePresence>
          {showMapApps && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
              onClick={() => setShowMapApps(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Abrir em...</h3>
                  <button
                    onClick={() => setShowMapApps(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} className="text-gray-500" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-3">Escolha o aplicativo de mapas preferido:</p>

                {/* Mini Mapa */}
                {store.latitude && store.longitude && (
                  <div className="mb-4 rounded-xl overflow-hidden border border-gray-200" style={{ height: "180px" }}>
                    <MapPreview latitude={store.latitude} longitude={store.longitude} />
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const url = store.latitude && store.longitude
                        ? `https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`
                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${store.name} ${store.province || ''} ${store.municipality || ''} ${store.address || ''}`)}`;
                      window.open(url, "_blank");
                      setShowMapApps(false);
                    }}
                    className="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl transition-colors text-sm font-medium text-white shadow-sm"
                    style={{ backgroundColor: "#4285F4" }}
                  >
                    <MapPin size={22} className="text-white" />
                    <span>Google Maps</span>
                  </button>

                  <button
                    onClick={() => {
                      const url = store.latitude && store.longitude
                        ? `https://waze.com/ul?ll=${store.latitude},${store.longitude}&navigate=yes`
                        : `https://waze.com/ul?q=${encodeURIComponent(`${store.name} ${store.province || ''} ${store.municipality || ''} ${store.address || ''}`)}`;
                      window.open(url, "_blank");
                      setShowMapApps(false);
                    }}
                    className="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl transition-colors text-sm font-medium text-white shadow-sm"
                    style={{ backgroundColor: "#33CCFF" }}
                  >
                    <Navigation size={22} className="text-white" />
                    <span>Waze</span>
                  </button>

                  <button
                    onClick={() => {
                      const url = store.latitude && store.longitude
                        ? `https://maps.apple.com/?daddr=${store.latitude},${store.longitude}&dirflg=d`
                        : `https://maps.apple.com/?q=${encodeURIComponent(`${store.name} ${store.province || ''} ${store.municipality || ''} ${store.address || ''}`)}`;
                      window.open(url, "_blank");
                      setShowMapApps(false);
                    }}
                    className="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl transition-colors text-sm font-medium shadow-sm"
                    style={{ backgroundColor: "#e8e8e8", color: "#333" }}
                  >
                    <MapIcon size={22} className="text-white" />
                    <span>Apple Maps</span>
                  </button>
                </div>

                <button
                  onClick={() => setShowMapApps(false)}
                  className="w-full mt-4 py-3 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal de Redes Sociais */}
        <AnimatePresence>
          {showSocial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
              onClick={() => setShowSocial(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Redes sociais</h3>
                    <p className="text-xs text-[#77736D] mt-0.5">Contactos oficiais de {store.name}</p>
                  </div>
                  <button
                    onClick={() => setShowSocial(false)}
                    aria-label="Fechar"
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} className="text-gray-500" />
                  </button>
                </div>
                <div className="space-y-2">
                  {socialLinks.map((link) => (
                    <a
                      key={link.key}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-2xl border border-[#E9D9B6] px-4 py-3 hover:bg-[#FBF7EC] transition-colors"
                    >
                      <span className="w-9 h-9 rounded-xl bg-[#FBF7EC] border border-[#E9D9B6] grid place-items-center text-[#171717] flex-shrink-0">
                        <SocialIcon kind={link.key} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-[#171717]">{link.label}</span>
                        <span className="block truncate text-xs text-[#77736D]">{link.handle}</span>
                      </span>
                      <ExternalLink size={15} className="text-[#77736D] flex-shrink-0" />
                    </a>
                  ))}
                </div>
                <button
                  onClick={() => setShowSocial(false)}
                  className="w-full mt-4 py-3 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Fechar
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal de Entregas */}
        <AnimatePresence>
          {showDelivery && deliveryInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
              onClick={() => setShowDelivery(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-xl bg-[#FBF7EC] border border-[#E9D9B6] grid place-items-center text-[#A96F12]">
                      <Truck size={17} />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Entregas</h3>
                      <p className="text-[11px] text-[#77736D]">Informação indicada pela loja</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDelivery(false)}
                    aria-label="Fechar"
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} className="text-gray-500" />
                  </button>
                </div>
                <div className="space-y-3">
                  {deliveryInfo.zones && <DeliveryRow label="Zonas" value={deliveryInfo.zones} />}
                  {deliveryInfo.fee && <DeliveryRow label="Taxa" value={deliveryInfo.fee} />}
                  {deliveryInfo.conditions && <DeliveryRow label="Condições" value={deliveryInfo.conditions} />}
                </div>
                <p className="mt-4 rounded-xl bg-[#FBF7EC] border border-[#E9D9B6]/70 p-3 text-[11px] leading-relaxed text-[#77736D]">
                  A YESOLA não faz entregas. Confirme sempre a zona, o valor e o prazo diretamente com a loja antes de pagar.
                </p>
                <button
                  onClick={() => setShowDelivery(false)}
                  className="w-full mt-4 py-3 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Fechar
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {showEditor && isOwner && (
          <StoreExtrasEditor
            store={store}
            onClose={() => setShowEditor(false)}
            onSaved={() => {
              setShowEditor(false);
              queryClient.invalidateQueries({ queryKey: ["store", store.id] });
              toast({ title: "Informação atualizada", description: "As redes e entregas já estão visíveis na loja." });
            }}
          />
        )}

        {/* Tabs */}
        <Tabs defaultValue={tabParam === "carrinhos" && store.carrinhoAccess === "APROVADO" ? "carrinhos" : "produtos"} className="py-6 pb-14">
          <TabsList className="bg-transparent border-0 gap-0 p-0 mb-7 border-b border-[#E9D9B6] w-full justify-start rounded-none h-auto overflow-x-auto">
            {[
              { value: "produtos", label: "Produtos", labelFull: "Produtos / Serviços" },
              ...(store.carrinhoAccess === "APROVADO" ? [{ value: "carrinhos", label: "Carrinhos", labelFull: "Carrinhos" }] : []),
              { value: "info", label: "Info", labelFull: "Informações" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                data-testid={`tab-${tab.value}`}
                className="rounded-none border-0 bg-transparent px-3 sm:px-4 pb-3 text-xs sm:text-sm font-medium text-[#77736D] data-[state=active]:text-[#171717] data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#D8B532] whitespace-nowrap flex-shrink-0"
              >
                <span className="hidden sm:inline">{tab.labelFull}</span>
                <span className="sm:hidden">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="produtos">
            <ProductsTab products={store.products.filter((p: any) => !p.isCarrinho)} storeId={store.id} storeName={store.name} storeWhatsapp={store.whatsapp} highlightProduct={servicoParam} />
          </TabsContent>

          {store.carrinhoAccess === "APROVADO" && (
            <TabsContent value="carrinhos">
              <CarrinhoTab products={store.products.filter((p: any) => p.isCarrinho)} storeId={store.id} storeName={store.name} storeWhatsapp={store.whatsapp} />
            </TabsContent>
          )}

          <TabsContent value="info">
            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
              <div className="space-y-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#77736D]">Contato</p>
                <div className="flex items-start gap-3">
                  <MapPin size={15} className="text-[#77736D] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[#171717]">{store.address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={15} className="text-[#77736D] flex-shrink-0" />
                  <p className="text-sm text-[#171717]">{store.phone}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#77736D] mb-4 flex items-center gap-1.5">
                  <Clock size={11} /> Horários
                </p>
                <div className="space-y-2">
                  {hours.map((h) => (
                    <div key={h.day} className="flex justify-between text-sm">
                      <span className="text-[#77736D]">{h.day}</span>
                      <span className="font-medium text-[#171717]">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <footer className="border-t border-[#E9D9B6] py-6 mt-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <Link href="/favoritos"><span className="font-medium text-[#171717] hover:text-[#A96F12] transition-colors">Lojas Favoritas</span></Link>
              <Link href="/termos"><span className="font-medium text-[#171717] hover:text-[#A96F12] transition-colors">Termos e Condições</span></Link>
              <Link href="/privacidade"><span className="font-medium text-[#171717] hover:text-[#A96F12] transition-colors">Política de Privacidade</span></Link>
            </div>
            <p className="text-[11px] leading-relaxed text-[#77736D]">
              YESOLA – Prestação de Serviços, (SU), LDA · NIF 5003489922
            </p>
          </div>
        </footer>
      </div>
      </div>
    </PageTransition>
  );
}

function toAngolaWhatsApp(value?: string | null): string {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("244") ? digits : `244${digits}`;
}

function SocialIcon({ kind }: { kind: SocialKey }) {
  if (kind === "instagram") return <SiInstagram size={16} />;
  if (kind === "tiktok") return <SiTiktok size={16} />;
  return <SiFacebook size={16} />;
}

function DeliveryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#E9D9B6] bg-[#FBF7EC]/60 px-3.5 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#77736D]">{label}</p>
      <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-[#171717]">{value}</p>
    </div>
  );
}

const editInputClass =
  "w-full rounded-xl border border-[#E9D9B6] bg-white px-3.5 py-2.5 text-sm text-[#171717] outline-none transition-colors placeholder:text-[#9A968F] focus:border-[#D8B532]";

function StoreExtrasEditor({ store, onClose, onSaved }: { store: Store; onClose: () => void; onSaved: () => void }) {
  const delivery = getDeliveryInfo(store);
  const [instagram, setInstagram] = useState(getSocialHandle(store, "instagram"));
  const [tiktok, setTiktok] = useState(getSocialHandle(store, "tiktok"));
  const [facebook, setFacebook] = useState(getSocialHandle(store, "facebook"));
  const [zones, setZones] = useState(delivery?.zones || "");
  const [fee, setFee] = useState(delivery?.fee || "");
  const [conditions, setConditions] = useState(delivery?.conditions || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      await updateStore(store.id, {
        socials: { instagram, tiktok, facebook },
        delivery: { zones, fee, conditions },
      });
      onSaved();
    } catch {
      setError("Não foi possível guardar. Verifique a ligação e tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[#FBF7EC] border border-[#E9D9B6] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#E9D9B6] bg-[#FBF7EC]/95 px-5 py-4 backdrop-blur">
          <div>
            <h3 className="text-base font-semibold text-[#171717]">Redes e entregas</h3>
            <p className="text-xs text-[#77736D] mt-0.5">Só o que preencher aparece na loja.</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#77736D] hover:bg-[#E9D9B6]/50 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <section className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#77736D]">Redes sociais</p>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[#171717]">Instagram</span>
              <input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@loja ou link" className={editInputClass} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[#171717]">TikTok</span>
              <input value={tiktok} onChange={(e) => setTiktok(e.target.value)} placeholder="@loja ou link" className={editInputClass} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[#171717]">Facebook</span>
              <input value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="página ou link" className={editInputClass} />
            </label>
          </section>

          <section className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#77736D]">Entregas</p>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[#171717]">Zonas</span>
              <input value={zones} onChange={(e) => setZones(e.target.value)} placeholder="Ex.: Luanda, Talatona, Kilamba" className={editInputClass} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[#171717]">Taxa</span>
              <input value={fee} onChange={(e) => setFee(e.target.value)} placeholder="Ex.: Grátis acima de 20.000 Kz" className={editInputClass} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[#171717]">Condições</span>
              <textarea value={conditions} onChange={(e) => setConditions(e.target.value)} rows={3} placeholder="Ex.: Entrega em 24h; pagamento por transferência." className={editInputClass} />
            </label>
          </section>

          {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button onClick={onClose} className="flex-1 rounded-full border border-[#E9D9B6] py-3 text-sm font-medium text-[#171717] hover:bg-[#E9D9B6]/40 transition-colors">
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 rounded-full bg-[#D8B532] py-3 text-sm font-semibold text-white hover:bg-[#B8962A] disabled:opacity-50 transition-colors"
            >
              {saving ? "A guardar..." : "Guardar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Formatar preço com separador de milhares por espaço ───────────────────
function formatPrice(price: number): string {
  const [int, dec] = price.toFixed(2).split(".");
  const formatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
  return `${formatted},${dec}`;
}

// ─── Foto no pedido WhatsApp ─────────────────────────────────────────────
// O link wa.me só leva TEXTO (limite oficial: sem foto anexada). O que dá
// para fazer é incluir o link público da foto na mensagem — o WhatsApp
// mostra a pré-visualização e o vendedor toca para ver. Só a 1ª foto
// (mensagens gigantes partem em alguns telemóveis).
type PhotoProduct = { imageUrl?: string; imageUrls?: string | string[] | null };

function firstPhotoUrl(p: PhotoProduct | null | undefined): string {
  return photoUrlAt(p, 0);
}

// Todas as fotos (dedup, ordem, URLs públicas). Mesma ordem do thumbList,
// por isso o índice da foto visível no card/lightbox corresponde.
function allPhotoUrls(p: PhotoProduct | null | undefined): string[] {
  if (!p) return [];
  const raw = typeof p.imageUrls === "string"
    ? p.imageUrls.split(" ").filter(Boolean)
    : Array.isArray(p.imageUrls) && p.imageUrls.length ? p.imageUrls : (p.imageUrl ? [p.imageUrl] : []);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const u of raw) {
    if (typeof u !== "string") continue;
    const v = u.trim();
    if (v && !seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  }
  return out;
}

// Foto N (0 = principal). Usada para mandar a foto que o cliente está a ver.
function photoUrlAt(p: PhotoProduct | null | undefined, index: number): string {
  const list = allPhotoUrls(p);
  if (!list.length) return "";
  const i = Math.min(Math.max(Number.isFinite(index) ? index : 0, 0), list.length - 1);
  return shareUrl(list[i]);
}

function moneyLabel(price: number, currency?: string): string {
  const sym = currency === "USD" ? "$" : currency === "EUR" ? "€" : "Kz";
  return price > 0 ? `Preço: ${sym} ${formatPrice(price)}` : "Preço sob consulta";
}

function singleOrderMessage(storeName: string, p: { name: string; price: number; currency?: string } & PhotoProduct, photoIndex = 0): string {
  const foto = photoUrlAt(p, photoIndex);
  return (
    `Olá! Gostaria de pedir o seguinte produto de vossa loja ${storeName}:\n\n` +
    `Produto: ${p.name}\n` +
    `${moneyLabel(p.price, p.currency)}` +
    `${foto ? `\nFoto: ${foto}` : ""}`
  );
}

function ProductsTab({ products, storeId, storeName, storeWhatsapp, highlightProduct }: { products: { id: string; name: string; price: number; currency?: string; imageColor: string; imageUrl?: string; imageUrls?: string[]; category?: string; subcategory?: string; description?: string }[]; storeId: string; storeName: string; storeWhatsapp: string; highlightProduct?: string | null }) {
  const { guard } = useTermsGate();
  // Categoria virtual para produtos sem categoria (não existe na BD).
  const OUTROS_CAT = "__outros__";
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxPhotoIndex, setLightboxPhotoIndex] = useState<number>(0);
  const highlightIdRef = useRef<string | null>(null);
  const highlightScrolledRef = useRef(false);

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

  const subcategories = activeCategory && activeCategory !== OUTROS_CAT ? Array.from(categories.get(activeCategory) || []) : [];

  // Produtos sem categoria (71 em 40 lojas): apareciam em "Todos" mas sumiam
  // ao tocar em qualquer chip. Chip "Outros" para nunca ficarem invisíveis.
  const hasUncategorized = useMemo(() => products.some((p) => !p.category), [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (activeCategory === OUTROS_CAT) return !p.category;
      if (activeCategory && p.category !== activeCategory) return false;
      if (activeSubcategory && p.subcategory !== activeSubcategory) return false;
      return true;
    });
  }, [products, activeCategory, activeSubcategory]);

  useEffect(() => {
    if (highlightProduct && products.length > 0 && !highlightIdRef.current) {
      const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const target = norm(highlightProduct);
      const match = products.find((p) => norm(p.name).includes(target))
        || products.find((p) => norm(p.category || "").includes(target) || norm(p.subcategory || "").includes(target));
      if (match) {
        highlightIdRef.current = `product-${match.id}`;
        if (match.category) setActiveCategory(match.category);
      }
    }
  }, [highlightProduct, products]);

  useEffect(() => {
    if (highlightIdRef.current && !highlightScrolledRef.current) {
      const el = document.getElementById(highlightIdRef.current);
      if (el) {
        highlightScrolledRef.current = true;
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          window.scrollBy({ top: -120, behavior: "smooth" });
        }, 200);
      }
    }
  }, [filtered]);

  const hasCategoryData = categories.size > 0;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null && filtered.length > 0) {
      const p = filtered[lightboxIndex];
      const pImages = dedupeUrls(p.imageUrls?.length ? p.imageUrls : (p.imageUrl ? [p.imageUrl] : []));
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
      const pImages = dedupeUrls(p.imageUrls?.length ? p.imageUrls : (p.imageUrl ? [p.imageUrl] : []));
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
                  ? "bg-[#D8B532] text-white border-[#D8B532]"
                  : "border-[#E9D9B6] text-[#77736D] hover:border-[#D8B532] hover:text-[#171717]"
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
                    ? "bg-[#D8B532] text-white border-[#D8B532]"
                    : "border-[#E9D9B6] text-[#77736D] hover:border-[#D8B532] hover:text-[#171717]"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Tag size={10} />
                  {cat}
                </span>
              </button>
            ))}
            {hasUncategorized && (
              <button
                onClick={() => {
                  if (activeCategory === OUTROS_CAT) {
                    setActiveCategory(null);
                    setActiveSubcategory(null);
                  } else {
                    setActiveCategory(OUTROS_CAT);
                    setActiveSubcategory(null);
                  }
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  activeCategory === OUTROS_CAT
                    ? "bg-[#D8B532] text-white border-[#D8B532]"
                    : "border-[#E9D9B6] text-[#77736D] hover:border-[#D8B532] hover:text-[#171717]"
                }`}
              >
                Outros
              </button>
            )}
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
                  <span className="flex items-center text-xs text-[#77736D] gap-1 mr-1">
                    <ChevronRight size={11} /> em {activeCategory}:
                  </span>
                  {subcategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setActiveSubcategory(activeSubcategory === sub ? null : sub)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        activeSubcategory === sub
                          ? "bg-[#D8B532] text-white border-[#D8B532]"
                          : "border-[#E9D9B6] text-[#77736D] hover:border-[#D8B532] hover:text-[#171717]"
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
            storeId={storeId}
            storeName={storeName}
            storeWhatsapp={storeWhatsapp}
            onPhotoClick={() => { setLightboxIndex(i); setLightboxPhotoIndex(0); }}
          />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-sm text-[#77736D] py-8 text-center">Nenhum item nesta categoria.</p>
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
              className="absolute right-4 text-white hover:text-gray-300 transition-colors p-2.5 z-50 bg-white/10 rounded-full"
              style={{ top: "calc(1rem + env(safe-area-inset-top))" }}
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
                  const pImages = dedupeUrls(p.imageUrls?.length ? p.imageUrls : (p.imageUrl ? [p.imageUrl] : []));
                  const currentImg = pImages[lightboxPhotoIndex];
                  
                  if (currentImg) {
                    return (
                      <>
                        <img
                          src={currentImg}
                          alt={p.name}
                          className="max-w-full max-h-[85%] object-contain rounded-xl select-none shadow-2xl border border-white/5"
                        loading="lazy" decoding="async" />
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
                {filtered[lightboxIndex].price > 0 ? `${filtered[lightboxIndex].currency === 'USD' ? '$' : filtered[lightboxIndex].currency === 'EUR' ? '€' : 'Kz'} ${formatPrice(filtered[lightboxIndex].price)}` : "Preço sob consulta"}
              </p>
              
              <a
                href={`https://wa.me/${storeWhatsapp}?text=${encodeURIComponent(
                  singleOrderMessage(storeName, filtered[lightboxIndex], lightboxPhotoIndex)
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  const url = e.currentTarget.href;
                  guard(() => {
                    trackWhatsAppClick(storeId);
                    window.open(url, "_blank", "noopener,noreferrer");
                  });
                }}
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

function ProductCard({ product, index, storeId, storeName, storeWhatsapp, onPhotoClick }: { product: { id: string; name: string; price: number; currency?: string; imageColor: string; imageUrl?: string; imageUrls?: string[]; category?: string; subcategory?: string; description?: string }; index: number; storeId: string; storeName: string; storeWhatsapp: string; onPhotoClick: () => void }) {
  const { guard } = useTermsGate();
  const [imgError, setImgError] = useState(false);

  // Roda as fotos do produto (1s) quando há mais de uma imagem
  // Grelha usa thumbs (480px); a cheia só abre no lightbox.
  const fullPImgs = product.imageUrls?.length ? product.imageUrls : (product.imageUrl ? [product.imageUrl] : []);
  const pImgs = useMemo(() => thumbList(fullPImgs), [product.imageUrls, product.imageUrl]);
  const [pImgIdx, setPImgIdx] = useState(0);

  useEffect(() => {
    if (pImgs.length <= 1) return;
    const t = setInterval(() => setPImgIdx((p) => (p + 1) % pImgs.length), 2000);
    return () => clearInterval(t);
  }, [pImgs.length]);

  // Pedir manda a foto que está visível no card (roda a cada 2s), não
  // necessariamente a principal.
  const visibleIdx = pImgs.length > 0 ? pImgIdx % pImgs.length : 0;
  const whatsappMessage = encodeURIComponent(singleOrderMessage(storeName, product, visibleIdx));

  const whatsappUrl = `https://wa.me/244${storeWhatsapp}?text=${whatsappMessage}`;

  return (
    <motion.div
      id={`product-${product.id}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.04 }}
      className="group cursor-pointer border border-[#E9D9B6] rounded-2xl p-3 bg-white flex flex-col justify-between h-full shadow-sm hover:shadow-md hover:border-[#D8B532] transition-shadow"
      data-testid={`card-product-${product.id}`}
    >
      <div className="flex flex-col flex-grow">
        <div
          onClick={(e) => { e.stopPropagation(); onPhotoClick(); }}
          className="relative overflow-hidden rounded-xl h-36 mb-3 bg-[#FBF7EC] border border-[#E9D9B6] cursor-zoom-in"
        >
          {product.imageUrls?.length || product.imageUrl ? (
            <>
              <img
                src={pImgs.length ? pImgs[pImgIdx % pImgs.length] : product.imageUrl}
                alt={product.name}
                draggable={false}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={() => setImgError(true)}
                loading={index < 4 ? "eager" : "lazy"} decoding="async"
              />
              {pImgs.length > 1 && (
                <div className="absolute bottom-1.5 right-1.5 z-10 flex gap-1">
                  {pImgs.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setPImgIdx(i); }}
                      className={`h-1.5 rounded-full transition-all ${i === pImgIdx % pImgs.length ? "bg-white w-3" : "bg-white/50 w-1.5"}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full" style={{ backgroundColor: product.imageColor }} />
          )}
        </div>
        <p className="text-sm font-medium text-[#171717] leading-tight">{product.name}</p>
        {product.description && (
          <p className="text-xs text-[#77736D] mt-1 leading-relaxed line-clamp-2">{product.description}</p>
        )}
      </div>
      <div className="mt-2 flex flex-col justify-between">
        <div>
          {product.price > 0 ? (
            <p className="text-sm font-semibold text-[#171717]">
              {product.currency === 'USD' ? '$' : product.currency === 'EUR' ? '€' : 'Kz'} {formatPrice(product.price)}
            </p>
          ) : (
            <p className="text-xs text-amber-700 font-medium">Preço sob consulta</p>
          )}
          {/* Category + subcategory badges */}
          {(product.category || product.subcategory) && (
            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
              {product.category && (
                <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-[#FBF7EC] rounded-full text-[#77736D] border border-[#E9D9B6] font-medium">
                  <Tag size={8} className="text-[#D8B532]" />
                  {product.category}
                </span>
              )}
              {product.subcategory && (
                <span className="inline-flex items-center text-[10px] px-1.5 py-0.5 bg-[#FBF7EC] rounded-full text-[#77736D] border border-[#E9D9B6] font-medium">
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
          onClick={(e) => {
            e.preventDefault();
            const url = e.currentTarget.href;
            guard(() => {
              trackWhatsAppClick(storeId);
              window.open(url, "_blank", "noopener,noreferrer");
            });
          }}
          className="mt-3 w-full flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#22c35f] text-white text-xs font-semibold py-2 rounded-xl transition-colors border border-[#E9D9B6]"
        >
          <SiWhatsapp size={13} />
          Pedir
        </a>
      </div>
    </motion.div>
  );
}

function CarrinhoTab({ products, storeId, storeName, storeWhatsapp }: { products: any[]; storeId: string; storeName: string; storeWhatsapp: string }) {
  const { guard } = useTermsGate();
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
      const foto = firstPhotoUrl(p);
      msg += `${i + 1}. ${p.name}\n   Preço: ${p.price?.toLocaleString("pt-AO")} ${p.currency}${foto ? `\n   Foto: ${foto}` : ""}\n\n`;
    });
    msg += `*Total: ${totalPrice.toLocaleString("pt-AO")} Kz*\n\nAguardo confirmação!`;
    trackWhatsAppClick(storeId);
    window.open(`https://wa.me/${storeWhatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null && products.length > 0) {
      const p = products[lightboxIndex];
      const pImages = dedupeUrls(p.imageUrls?.length ? p.imageUrls : (p.imageUrl ? [p.imageUrl] : []));
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
      const pImages = dedupeUrls(p.imageUrls?.length ? p.imageUrls : (p.imageUrl ? [p.imageUrl] : []));
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
        <p className="text-sm text-[#77736D]">Nenhum carrinho disponível nesta loja.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {products.map((product: any, i: number) => {
          const isSelected = selected.includes(product.id);
          const fullImgs = product.imageUrls?.length ? product.imageUrls : (product.imageUrl ? [product.imageUrl] : []);
          const pImages = thumbList(fullImgs);
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
                  <img src={pImages[0]} alt={product.name} className="w-full h-full object-cover" loading="lazy" decoding="async" onError={(e) => { e.currentTarget.style.display = "none"; }} />
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
              className="absolute right-4 text-white hover:text-gray-300 transition-colors p-2.5 z-50 bg-white/10 rounded-full"
              style={{ top: "calc(1rem + env(safe-area-inset-top))" }}
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
                  const pImages = dedupeUrls(p.imageUrls?.length ? p.imageUrls : (p.imageUrl ? [p.imageUrl] : []));
                  const currentImg = pImages[lightboxPhotoIndex];

                  if (currentImg) {
                    return (
                      <>
                        <img
                          src={currentImg}
                          alt={p.name}
                          className="max-w-full max-h-[85%] object-contain rounded-xl select-none shadow-2xl border border-white/5"
                        loading="lazy" decoding="async" />
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
              onClick={() => guard(sendWhatsApp)}
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
