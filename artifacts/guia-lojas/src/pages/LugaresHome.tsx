import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  MapPin, Search, Phone, ArrowLeft, Church, Landmark, Menu, X,
  ChevronRight, Heart, ShieldCheck, BadgeCheck, CreditCard, HeadphonesIcon,
} from "lucide-react";
import { fetchPlaces, type Place } from "@/lib/api";
import { ANGOLA_PROVINCES } from "@/data/angolaData";
import { PageTransition } from "@/components/PageTransition";

const KINDS = [
  { id: "", name: "Todos" },
  { id: "igreja", name: "Igrejas" },
  { id: "servico-publico", name: "Serviços Públicos" },
];

const DEFAULT_CATS = ["Igrejas", "Saúde", "Segurança", "Educação", "Correios", "Administração"];

const TRUST_BADGES = [
  { icon: <ShieldCheck size={18} />, label: "Informação verificada" },
  { icon: <BadgeCheck size={18} />, label: "Do mapa e da comunidade" },
  { icon: <CreditCard size={18} />, label: "Acesso gratuito" },
  { icon: <HeadphonesIcon size={18} />, label: "Apoio dedicado" },
];

export function mapLink(p: Place) {
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
export function PlaceCard({ p }: { p: Place }) {
  return (
    <div
      className="flex-shrink-0 w-44 rounded-2xl overflow-hidden bg-white shadow-md border border-[#EDE8DE] cursor-pointer hover:-translate-y-1 transition-all relative group"
      onClick={() => window.open(mapLink(p), "_blank", "noopener")}
    >
      <div className="relative h-28 overflow-hidden">
        <img src={KIND_IMG[p.kind] || KIND_IMG["servico-publico"]} alt={p.name} className="w-full h-full object-cover object-top" loading="lazy" decoding="async" />
        <span className="absolute top-2 right-2 text-[9px] font-semibold px-2 py-0.5 rounded-full z-20 bg-white/90 text-[#A96F12]">
          {p.source === "osm" ? "Do mapa" : p.source === "comunidade" ? "Comunidade" : "YESOLA"}
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("");
  const [province, setProvince] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [showProvinceModal, setShowProvinceModal] = useState(false);
  const [locationFilter, setLocationFilter] = useState("");

  const { data: places = [], isLoading } = useQuery({
    queryKey: ["places", q, kind, province, municipality],
    queryFn: () => fetchPlaces({
      q: q.trim() || undefined,
      kind: kind || undefined,
      province: province || undefined,
      municipality: municipality || undefined,
    }),
    staleTime: 60_000,
  });

  const municipalities = province
    ? ANGOLA_PROVINCES.find((p) => p.name === province)?.municipalities || []
    : [];

  const filteredProvinces = ANGOLA_PROVINCES.filter(
    (pr) => !locationFilter.trim() || pr.name.toLowerCase().includes(locationFilter.trim().toLowerCase())
  );

  const catOf = (p: Place) =>
    p.kind === "igreja" ? "Igrejas" : (p.category || "Serviços Públicos");
  const presentServiceCats = [...new Set(places.filter((p: Place) => p.kind !== "igreja").map(catOf))];
  const allServiceCats = [...new Set([...DEFAULT_CATS.filter((c) => c !== "Igrejas"), ...presentServiceCats])];
  const catsToShow = kind === "igreja" ? ["Igrejas"] : kind === "servico-publico" ? allServiceCats : ["Igrejas", ...allServiceCats];
  const forCat = (c: string) =>
    places.filter((p: Place) => catOf(p) === c || (c === "Igrejas" && p.kind === "igreja"));

  const scrollToList = () => {
    document.getElementById("lugares-lista")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <PageTransition>
      <div className="min-h-[100dvh] bg-[#FFFDF8] text-[#111111] pb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`
          .cat-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px; }
          .cat-scroll::-webkit-scrollbar { display: none; }
          .trust-scroll { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; }
          .trust-scroll::-webkit-scrollbar { display: none; }
          .trust-item { flex-shrink: 0; display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: white; border-radius: 12px; border: 1px solid #E8CC91; }
        `}</style>

        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#E8CC91]/60">
          <div className="flex items-center justify-between px-5 py-4">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-1" aria-label="Menu">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="flex flex-col items-center">
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 600 }}>YESOLA</span>
              <span className="text-[9px] tracking-[0.25em] text-[#A96F12] font-semibold uppercase mt-0.5">Lugares</span>
            </div>
            <span className="w-[30px]" />
          </div>
          {menuOpen && (
            <div className="bg-[#FFFDF8] border-t border-[#E8CC91]/60 px-5 py-4 flex flex-col gap-3 text-sm font-medium">
              <button onClick={() => (window.location.href = "/login-lugares")} className="py-2 text-left">Entrar</button>
              <button onClick={() => { localStorage.removeItem("eliora-selected-store"); window.location.href = "/"; }} className="py-2 text-left">Trocar de loja</button>
            </div>
          )}
        </header>

        {/* Pesquisa */}
        <section className="px-5 pt-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A96F12]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Pesquisar por nome, categoria ou endereço..."
              className="w-full bg-white border border-[#E8CC91] rounded-2xl pl-9 pr-3 py-3 text-sm outline-none focus:border-[#C99432]"
            />
          </div>
          <div className="flex gap-2 flex-wrap mt-3">
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
        </section>

        {/* Hero */}
        <section className="px-5 py-4">
          <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: "240px" }}>
            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=500&fit=crop&auto=format&q=80" alt="Mapa" className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />
            <div className="relative z-10 p-6 max-w-[60%]">
              <p className="text-[10px] tracking-[0.2em] text-[#A96F12] font-semibold uppercase">Perto de si.</p>
              <h1 className="text-[28px] leading-[1.1] font-semibold mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Igrejas e<br /><span className="text-[#A96F12]">serviços públicos.</span>
              </h1>
              <p className="text-[12px] text-[#6F6F6F] mt-3 leading-relaxed">Encontre o lugar e veja onde fica no mapa, sem conta e sem pagamento.</p>
              <button onClick={scrollToList} className="mt-4 flex items-center gap-2 bg-[#111111] text-white text-[12px] font-medium px-4 py-2.5 rounded-full hover:bg-black transition-colors">
                Explorar lugares <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* Província */}
        <section className="px-5 py-3">
          <button
            onClick={() => setShowProvinceModal(true)}
            className="w-full flex items-center gap-4 bg-white rounded-2xl px-4 py-4 border border-[#E8CC91] hover:border-[#C99432] transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#FFF8EC] flex items-center justify-center"><MapPin size={18} className="text-[#A96F12]" /></div>
            <div className="flex-1 text-left">
              <p className="text-[14px] font-semibold text-[#A96F12]">
                {province ? province + (municipality ? " · " + municipality : "") : "Em todas as províncias de Angola"}
              </p>
              <p className="text-[11px] text-[#6F6F6F]">Encontre lugares perto de si.</p>
            </div>
            <ChevronRight size={18} className="text-[#A96F12]" />
          </button>
        </section>
        {showProvinceModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center" onClick={() => setShowProvinceModal(false)}>
            <div className="bg-white rounded-t-3xl w-full max-w-lg p-6 pt-6 pb-4 max-h-[85dvh] flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4 shrink-0">
                <h3 className="text-lg font-semibold">Escolha a sua localização</h3>
                <button onClick={() => setShowProvinceModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
              </div>
              <div className="relative mb-2 shrink-0">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  placeholder="Pesquisar província ou município..."
                  className="w-full border border-gray-200 rounded-xl bg-gray-50 py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-gray-400"
                />
              </div>
              <div className="flex gap-4 flex-1 min-h-0 overflow-y-auto">
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 sticky top-0 bg-white py-1">Província</h4>
                  <div className="space-y-1 pb-2">
                    <button
                      onClick={() => { setProvince(""); setMunicipality(""); }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm ${province === "" ? "bg-[#111111] text-white font-medium" : "hover:bg-[#FFF8EC]"}`}
                    >
                      Todas
                    </button>
                    {filteredProvinces.map((pr) => (
                      <button
                        key={pr.name}
                        onClick={() => { setProvince(pr.name); setMunicipality(""); }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm ${province === pr.name ? "bg-[#111111] text-white font-medium" : "hover:bg-[#FFF8EC]"}`}
                      >
                        {pr.name}
                      </button>
                    ))}
                  </div>
                </div>
                {province && municipalities.length > 0 && (
                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 sticky top-0 bg-white py-1">Município</h4>
                    <div className="space-y-1 pb-2">
                      <button
                        onClick={() => setMunicipality("")}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm ${municipality === "" ? "bg-[#111111] text-white font-medium" : "hover:bg-[#FFF8EC]"}`}
                      >
                        Todos
                      </button>
                      {municipalities.filter((m) => !locationFilter.trim() || m.toLowerCase().includes(locationFilter.trim().toLowerCase())).map((m) => (
                        <button
                          key={m}
                          onClick={() => setMunicipality(m)}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-sm ${municipality === m ? "bg-[#111111] text-white font-medium" : "hover:bg-[#FFF8EC]"}`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="shrink-0 pt-3 bg-white">
                <button
                  onClick={() => setShowProvinceModal(false)}
                  className="w-full bg-[#111111] text-white py-3.5 rounded-xl font-medium shadow-lg"
                >
                  Ver resultados{province ? ` em ${municipality || province}` : ""}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lugares por categoria */}
        <div id="lugares-lista" className="px-5 py-4 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#6F6F6F]">
              {isLoading ? "A carregar..." : `${places.length} resultado(s)`}
            </p>
            <button onClick={() => (window.location.href = "/explorar-lugares")} className="text-xs font-semibold text-[#A96F12] flex items-center gap-1">
              Ver todas <ChevronRight size={14} />
            </button>
          </div>
          <p className="text-[11px] text-[#9CA3AF] -mt-4">toque no cartão para abrir no mapa</p>
          {catsToShow.map((c) => {
            const list = forCat(c);
            const Icon = c === "Igrejas" ? Church : Landmark;
            return (
              <div key={c}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon size={16} className="text-[#A96F12]" />
                  <h3 className="text-[14px] font-semibold text-[#2D2C2B]">{c}</h3>
                </div>
                {list.length > 0 ? (
                  <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                    {list.map((p: Place) => (
                      <PlaceCard key={p.id} p={p} />
                    ))}
                  </div>
                ) : (
                  !isLoading && (
                    <div className="rounded-2xl border border-dashed border-[#EDE8DE] p-6 text-center bg-white">
                      <p className="text-[12px] text-[#9CA3AF]">Em breve</p>
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>

        {/* Contador */}
        <section className="px-5 py-3">
          <div className="flex items-center justify-center gap-2 bg-[#FFF8EC] rounded-2xl px-4 py-3 border border-[#E8CC91]">
            <Heart size={16} className="text-[#A96F12]" />
            <span className="text-[13px] font-medium text-[#111111]">
              <span className="text-[#A96F12] font-bold">{places.length}</span> lugares perto de si, grátis e sem conta.
            </span>
          </div>
        </section>

        {/* Selos */}
        <section className="px-5 py-3">
          <div className="trust-scroll">
            {TRUST_BADGES.map((badge, i) => (
              <div key={i} className="trust-item">
                <span className="text-[#A96F12]">{badge.icon}</span>
                <span className="text-[11px] font-medium text-[#111111]">{badge.label}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center py-6 px-5">
          <p className="text-[11px] text-[#9CA3AF]">YESOLA LUGARES · PERTO DE SI.</p>
        </div>
      </div>
    </PageTransition>
  );
}
