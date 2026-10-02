import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Pencil, Trash2, Download, MapPin } from "lucide-react";
import { fetchPlaces, createPlace, updatePlace, deletePlace, importPlaces, type Place } from "@/lib/api";
import { ANGOLA_PROVINCES } from "@/data/angolaData";
import { PageTransition } from "@/components/PageTransition";

const AMENITIES = [
  { id: "place_of_worship", name: "Igrejas" },
  { id: "hospital", name: "Hospitais" },
  { id: "clinic", name: "Clínicas" },
  { id: "pharmacy", name: "Farmácias" },
  { id: "police", name: "Polícia" },
  { id: "post_office", name: "Correios" },
  { id: "townhall", name: "Administração" },
  { id: "school", name: "Escolas" },
];

const EMPTY = { name: "", kind: "igreja", category: "", address: "", province: "", municipality: "", locality: "", latitude: "", longitude: "", phone: "" };

export default function AdminLugares() {
  const queryClient = useQueryClient();
  const localUser = JSON.parse(localStorage.getItem("guialocal_user") || "null");
  const isAdmin = localUser?.phone === "999999999";

  const [tab, setTab] = useState<"lista" | "novo" | "importar">("lista");
  const [form, setForm] = useState<any>(EMPTY);
  const [editing, setEditing] = useState<Place | null>(null);
  const [search, setSearch] = useState("");
  const [bbox, setBbox] = useState({ minLat: "-13.0", minLon: "11.5", maxLat: "-4.0", maxLon: "24.5" });
  const [amenities, setAmenities] = useState<string[]>(["place_of_worship", "hospital", "police", "post_office"]);
  const [importResult, setImportResult] = useState<any>(null);
  const [msg, setMsg] = useState("");

  const { data: places = [], isLoading } = useQuery({
    queryKey: ["adminPlaces", search],
    queryFn: () => fetchPlaces({ q: search.trim() || undefined }),
    enabled: isAdmin,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["adminPlaces"] });

  const saveMut = useMutation({
    mutationFn: () =>
      editing
        ? updatePlace(editing.id, { ...form, latitude: form.latitude ? Number(form.latitude) : null, longitude: form.longitude ? Number(form.longitude) : null })
        : createPlace({ ...form, latitude: form.latitude ? Number(form.latitude) : null, longitude: form.longitude ? Number(form.longitude) : null }),
    onSuccess: () => { setForm(EMPTY); setEditing(null); setTab("lista"); setMsg("Guardado."); invalidate(); },
    onError: (e: any) => setMsg(e.message || "Erro ao guardar."),
  });

  const delMut = useMutation({
    mutationFn: (id: number) => deletePlace(id),
    onSuccess: invalidate,
  });

  const importMut = useMutation({
    mutationFn: () => importPlaces({
      minLat: Number(bbox.minLat), minLon: Number(bbox.minLon),
      maxLat: Number(bbox.maxLat), maxLon: Number(bbox.maxLon), amenities,
    }),
    onSuccess: (r) => { setImportResult(r); invalidate(); },
    onError: (e: any) => setMsg(e.message || "Erro na importação."),
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500 p-6 text-center">
        Área reservada à administração.
      </div>
    );
  }

  const set = (k: string, v: string) => setForm((f: any) => ({ ...f, [k]: v }));
  const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-black";

  return (
    <PageTransition>
      <div className="min-h-[100dvh] bg-[#FFFDF8] pb-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <header className="sticky top-0 z-50 bg-[#FFFDF8]/95 border-b border-[#E8CC91]/60">
          <div className="flex items-center gap-3 px-5 py-4">
            <button onClick={() => (window.location.href = "/")} className="p-1" aria-label="Voltar">
              <ArrowLeft size={22} />
            </button>
            <h1 className="text-[18px] font-bold">Lugares — Administração</h1>
          </div>
          <div className="flex gap-2 px-5 pb-3">
            {(["lista", "novo", "importar"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setMsg(""); }}
                className={`px-4 py-2 rounded-full text-xs font-semibold ${tab === t ? "bg-black text-white" : "bg-white border border-gray-200"}`}
              >
                {t === "lista" ? "Lugares" : t === "novo" ? "Novo" : "Importar do mapa"}
              </button>
            ))}
          </div>
        </header>

        <section className="px-5 pt-4 max-w-2xl mx-auto">
          {msg && <p className="text-xs bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">{msg}</p>}

          {tab === "lista" && (
            <>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar..."
                className="w-full bg-white border border-gray-200 rounded-2xl px-3 py-2.5 text-sm outline-none mb-3"
              />
              {isLoading ? <p className="text-sm text-gray-500">A carregar...</p> : places.map((p: Place) => (
                <div key={p.id} className="bg-white border border-gray-200 rounded-2xl p-3 mb-2 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{p.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {p.kind === "igreja" ? "Igreja" : "Serviço Público"} · {p.category} · {[p.municipality, p.province].filter(Boolean).join(", ")} · {p.source === "osm" ? "mapa" : "manual"}
                    </p>
                  </div>
                  <button onClick={() => { setEditing(p); setForm({ name: p.name, kind: p.kind, category: p.category || "", address: p.address || "", province: p.province || "", municipality: p.municipality || "", locality: p.locality || "", latitude: p.latitude ?? "", longitude: p.longitude ?? "", phone: p.phone || "" }); setTab("novo"); }} className="p-2 border rounded-full" aria-label="Editar">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => { if (confirm(`Remover "${p.name}"?`)) delMut.mutate(p.id); }} className="p-2 border rounded-full text-red-500" aria-label="Remover">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </>
          )}

          {tab === "novo" && (
            <div className="space-y-3 bg-white border border-gray-200 rounded-2xl p-4">
              <h2 className="text-sm font-bold">{editing ? "Editar lugar" : "Novo lugar"}</h2>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Nome *" className={inputCls} />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.kind} onChange={(e) => set("kind", e.target.value)} className={inputCls}>
                  <option value="igreja">Igreja</option>
                  <option value="servico-publico">Serviço Público</option>
                </select>
                <input value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="Categoria (ex: Católica)" className={inputCls} />
              </div>
              <input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Endereço" className={inputCls} />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.province} onChange={(e) => set("province", e.target.value)} className={inputCls}>
                  <option value="">Província</option>
                  {ANGOLA_PROVINCES.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
                </select>
                <input value={form.municipality} onChange={(e) => set("municipality", e.target.value)} placeholder="Município" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input value={form.latitude} onChange={(e) => set("latitude", e.target.value)} placeholder="Latitude" inputMode="decimal" className={inputCls} />
                <input value={form.longitude} onChange={(e) => set("longitude", e.target.value)} placeholder="Longitude" inputMode="decimal" className={inputCls} />
              </div>
              <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Telefone" className={inputCls} />
              <div className="flex gap-2">
                <button onClick={() => saveMut.mutate()} disabled={saveMut.isPending} className="flex-1 bg-black text-white py-3 rounded-full text-sm font-semibold disabled:opacity-50">
                  {saveMut.isPending ? "A guardar..." : editing ? "Atualizar" : "Guardar"}
                </button>
                {editing && <button onClick={() => { setEditing(null); setForm(EMPTY); }} className="px-4 py-3 border rounded-full text-sm">Cancelar</button>}
              </div>
              <p className="text-[11px] text-gray-500 flex items-center gap-1"><MapPin size={11} /> Sem coordenadas? O botão "Ver no mapa" usa o nome + município.</p>
            </div>
          )}

          {tab === "importar" && (
            <div className="space-y-3 bg-white border border-gray-200 rounded-2xl p-4">
              <h2 className="text-sm font-bold flex items-center gap-2"><Download size={15} /> Importar do OpenStreetMap</h2>
              <p className="text-[11px] text-gray-500">Busca igrejas e serviços na área (caixa) e grava os novos. Nada é apagado.</p>
              <div className="grid grid-cols-2 gap-3">
                <input value={bbox.minLat} onChange={(e) => setBbox({ ...bbox, minLat: e.target.value })} placeholder="Lat mín" inputMode="decimal" className={inputCls} />
                <input value={bbox.maxLat} onChange={(e) => setBbox({ ...bbox, maxLat: e.target.value })} placeholder="Lat máx" inputMode="decimal" className={inputCls} />
                <input value={bbox.minLon} onChange={(e) => setBbox({ ...bbox, minLon: e.target.value })} placeholder="Lon mín" inputMode="decimal" className={inputCls} />
                <input value={bbox.maxLon} onChange={(e) => setBbox({ ...bbox, maxLon: e.target.value })} placeholder="Lon máx" inputMode="decimal" className={inputCls} />
              </div>
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setAmenities((prev) => prev.includes(a.id) ? prev.filter((x) => x !== a.id) : [...prev, a.id])}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${amenities.includes(a.id) ? "bg-black text-white border-black" : "bg-white text-gray-600"}`}
                  >
                    {a.name}
                  </button>
                ))}
              </div>
              <button onClick={() => { setImportResult(null); importMut.mutate(); }} disabled={importMut.isPending} className="w-full bg-black text-white py-3 rounded-full text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                <Plus size={15} /> {importMut.isPending ? "A importar... (pode demorar)" : "Importar"}
              </button>
              {importResult && (
                <p className="text-xs bg-green-50 border border-green-200 rounded-xl p-3">
                  Importados: {importResult.imported} · já existiam/ignorados: {importResult.skipped} · total no mapa: {importResult.total}
                </p>
              )}
            </div>
          )}
        </section>
      </div>
    </PageTransition>
  );
}
