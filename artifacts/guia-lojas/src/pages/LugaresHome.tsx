import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Search, Phone, ArrowLeft, Church, Landmark } from "lucide-react";
import { fetchPlaces, type Place } from "@/lib/api";
import { ANGOLA_PROVINCES } from "@/data/angolaData";
import { PageTransition } from "@/components/PageTransition";

const KINDS = [
  { id: "", name: "Todos" },
  { id: "igreja", name: "Igrejas" },
  { id: "servico-publico", name: "Serviços Públicos" },
];

function mapLink(p: Place) {
  if (p.latitude != null && p.longitude != null) {
    return `https://www.google.com/maps?q=${p.latitude},${p.longitude}`;
  }
  const q = encodeURIComponent([p.name, p.municipality, p.province, "Angola"].filter(Boolean).join(", "));
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

const KIND_IMG: Record<string, string> = {
  igreja: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=400&h=300&fit=crop&auto=format&q=75",
  "servico-publico": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop&auto=format&q=75",
};

// Mesmo cartão das lojas (StoreCard): foto, nome, categoria, localização.
function PlaceCard({ p }: { p: Place }) {
  return (
    <div
      className="flex-shrink-0 w-44 rounded-2xl overflow-hidden bg-white shadow-md border border-[#EDE8DE] cursor-pointer hover:-translate-y-1 transition-all relative group"
      onClick={() => window.open(mapLink(p), "_blank", "noopener")}
    >
      <div className="relative h-28 overflow-hidden">
        <img src={KIND_IMG[p.kind] || KIND_IMG["servico-publico"]} alt={p.name} className="w-full h-full object-cover object-top" />
        <span className="absolute top-2 right-2 text-[9px] font-semibold px-2 py-0.5 rounded-full z-20 bg-white/90 text-[#A96F12]">
          {p.source === "osm" ? "Do mapa" : "YESOLA"}
        </span>
        {p.phone && (
          <a
            href={`tel:${p.phone}`}
            onClick={(e) => e.stopPropagation()}
            aria-label="Ligar"
            className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-sm z-30 transition-transform hover:scale-110"
          >
            <Phone size={12} />
          </a>
        )}
      </div>
      <div className="p-3">
        <h4 className="text-sm font-semibold text-[#2D2C2B] truncate">{p.name}</h4>
        <p className="text-[10px] text-[#87909a] mt-1 truncate">
          {p.category || (p.kind === "igreja" ? "Igreja" : "Serviço Público")}
        </p>
        <div className="flex items-center gap-1 mt-1">
          <MapPin size={10} className="text-[#9CA3AF]" />
          <span className="text-[10px] text-[#9CA3AF] truncate">
            {[p.municipality, p.province].filter(Boolean).join(" · ") || "Angola"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function LugaresHome() {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("");
  const [province, setProvince] = useState("");

  const { data: places = [], isLoading } = useQuery({
    queryKey: ["places", q, kind, province],
    queryFn: () => fetchPlaces({
      q: q.trim() || undefined,
      kind: kind || undefined,
      province: province || undefined,
    }),
    staleTime: 60_000,
  });

  const igrejas = places.filter((p: Place) => p.kind === "igreja");
  const servicos = places.filter((p: Place) => p.kind !== "igreja");

  return (
    <PageTransition>
      <div className="min-h-[100dvh] bg-[#FFFDF8] text-[#111111] pb-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <header className="sticky top-0 z-50 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#E8CC91]/60">
          <div className="flex items-center gap-3 px-5 py-4">
            <button onClick={() => (window.location.href = "/")} className="p-1" aria-label="Voltar">
              <ArrowLeft size={22} />
            </button>
            <div>
              <h1 className="text-[18px] font-bold leading-tight">Serviços Públicos & Igrejas</h1>
              <p className="text-[11px] text-[#6F6F6F]">Encontre e veja no mapa — sem conta, sem pagamento.</p>
            </div>
          </div>
        </header>

        <section className="px-5 pt-4 space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A96F12]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Pesquisar por nome, categoria ou endereço..."
              className="w-full bg-white border border-[#E8CC91] rounded-2xl pl-9 pr-3 py-3 text-sm outline-none focus:border-[#C99432]"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {KINDS.map((k) => (
              <button
                key={k.id}
                onClick={() => setKind(k.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                  kind === k.id ? "bg-[#111111] text-white" : "bg-white border border-[#E8CC91] text-[#6F6F6F]"
                }`}
              >
                {k.name}
              </button>
            ))}
          </div>
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="w-full bg-white border border-[#E8CC91] rounded-2xl px-3 py-3 text-sm outline-none"
          >
            <option value="">Todas as províncias</option>
            {ANGOLA_PROVINCES.map((p) => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
        </section>

        <div className="px-5 py-4 space-y-6">
          <p className="text-xs text-[#6F6F6F]">
            {isLoading ? "A carregar..." : `${places.length} resultado(s)`}
            <span className="ml-2 inline-flex items-center gap-1 align-middle">
              <Church size={11} className="text-[#A96F12]" /> toque no cartão para abrir no mapa
            </span>
          </p>

          {(kind === "" || kind === "igreja") && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Church size={16} className="text-[#A96F12]" />
                <h3 className="text-[14px] font-semibold text-[#2D2C2B]">Igrejas</h3>
              </div>
              {igrejas.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                  {igrejas.map((p: Place) => (
                    <PlaceCard key={p.id} p={p} />
                  ))}
                </div>
              ) : (
                !isLoading && (
                  <div className="rounded-2xl border border-dashed border-[#EDE8DE] p-6 text-center bg-white">
                    <p className="text-[12px] text-[#9CA3AF]">Em breve novas igrejas</p>
                  </div>
                )
              )}
            </div>
          )}

          {(kind === "" || kind === "servico-publico") && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Landmark size={16} className="text-[#A96F12]" />
                <h3 className="text-[14px] font-semibold text-[#2D2C2B]">Serviços Públicos</h3>
              </div>
              {servicos.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                  {servicos.map((p: Place) => (
                    <PlaceCard key={p.id} p={p} />
                  ))}
                </div>
              ) : (
                !isLoading && (
                  <div className="rounded-2xl border border-dashed border-[#EDE8DE] p-6 text-center bg-white">
                    <p className="text-[12px] text-[#9CA3AF]">Em breve novos serviços</p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
