import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Search, Phone, Navigation, Church, Landmark, ArrowLeft } from "lucide-react";
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

        <section className="px-5 pt-4">
          <p className="text-xs text-[#6F6F6F] mb-3">{isLoading ? "A carregar..." : `${places.length} resultado(s)`}</p>
          <div className="space-y-3">
            {places.map((p: Place) => (
              <div key={p.id} className="bg-white border border-[#E8CC91] rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFF8EC] border border-[#E8CC91] flex items-center justify-center shrink-0">
                    {p.kind === "igreja"
                      ? <Church size={18} className="text-[#A96F12]" />
                      : <Landmark size={18} className="text-[#A96F12]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold truncate">{p.name}</h3>
                    <p className="text-[11px] text-[#A96F12] font-medium">
                      {p.category || (p.kind === "igreja" ? "Igreja" : "Serviço Público")}
                    </p>
                    {(p.address || p.municipality || p.province) && (
                      <p className="text-[11px] text-[#6F6F6F] mt-1 flex items-center gap-1">
                        <MapPin size={11} className="shrink-0" />
                        <span className="truncate">{[p.address, p.municipality, p.province].filter(Boolean).join(" · ")}</span>
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <a
                        href={mapLink(p)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-[#111111] text-white text-[11px] font-semibold px-3.5 py-2 rounded-full"
                      >
                        <Navigation size={12} /> Ver no mapa
                      </a>
                      {p.phone && (
                        <a
                          href={`tel:${p.phone}`}
                          className="inline-flex items-center gap-1.5 border border-[#E8CC91] text-[11px] font-semibold px-3.5 py-2 rounded-full"
                        >
                          <Phone size={12} /> Ligar
                        </a>
                      )}
                      <span className="text-[10px] text-[#9CA3AF]">
                        {p.source === "osm" ? "Do mapa" : "YESOLA"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {!isLoading && places.length === 0 && (
              <p className="text-sm text-[#6F6F6F] text-center py-10">Nenhum lugar encontrado. Tente outra pesquisa.</p>
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
