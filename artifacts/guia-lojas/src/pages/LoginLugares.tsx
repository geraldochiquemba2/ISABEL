import { useState } from "react";
import { Eye, EyeOff, ArrowLeft, MapPin } from "lucide-react";
import { adminLogin, createPlace } from "@/lib/api";
import { ANGOLA_PROVINCES } from "@/data/angolaData";
import { PageTransition } from "@/components/PageTransition";

const inputCls = "w-full border border-[#E8CC91] bg-white py-3 px-4 text-sm outline-none focus:border-[#C99432] transition-all rounded-xl";

export default function LoginLugares() {
  const [mode, setMode] = useState<"login" | "sugerir">("login");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [form, setForm] = useState<any>({
    name: "", kind: "igreja", category: "", address: "",
    province: "", municipality: "", latitude: "", longitude: "", phone: "",
  });
  const set = (k: string, v: string) => setForm((f: any) => ({ ...f, [k]: v }));

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await adminLogin(phone, password);
      localStorage.setItem("lugares-admin", JSON.stringify({ phone, at: Date.now() }));
      window.location.href = "/admin-lugares";
    } catch (err: any) {
      setError(err.message || "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  async function onSuggest(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setOk(""); setLoading(true);
    try {
      if (!form.name.trim()) throw new Error("Indique o nome do lugar.");
      await createPlace({
        ...form,
        source: "comunidade",
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
      });
      setOk("Obrigado! A sugestão foi registada e ficará visível após verificação.");
      setForm({ name: "", kind: "igreja", category: "", address: "", province: "", municipality: "", latitude: "", longitude: "", phone: "" });
    } catch (err: any) {
      setError(err.message || "Não foi possível registar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageTransition>
      <div className="min-h-[100dvh] bg-[#FFFDF8] pb-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <header className="sticky top-0 z-50 bg-[#FFFDF8]/95 border-b border-[#E8CC91]/60">
          <div className="flex items-center gap-3 px-5 py-4">
            <button onClick={() => (window.location.href = "/lugares")} className="p-1" aria-label="Voltar">
              <ArrowLeft size={22} />
            </button>
            <h1 className="text-[18px] font-bold">Lugares — acesso</h1>
          </div>
          <div className="flex gap-2 px-5 pb-3">
            {(["login", "sugerir"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); setOk(""); }}
                className={`px-4 py-2 rounded-full text-xs font-semibold ${mode === m ? "bg-black text-white" : "bg-white border border-gray-200"}`}
              >
                {m === "login" ? "Entrar" : "Sugerir lugar"}
              </button>
            ))}
          </div>
        </header>

        <section className="px-5 pt-4 max-w-md mx-auto">
          {error && <p className="text-xs bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mb-3">{error}</p>}
          {ok && <p className="text-xs bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 mb-3">{ok}</p>}

          {mode === "login" ? (
            <form onSubmit={onLogin} className="space-y-3 bg-white border border-[#E8CC91] rounded-2xl p-4">
              <h2 className="text-sm font-bold">Administração de lugares</h2>
              <p className="text-[11px] text-gray-500">Acesso reservado ao administrador YESOLA.</p>
              <input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))} placeholder="Telemóvel (9 dígitos)" inputMode="numeric" className={inputCls} />
              <div className="relative">
                <input type={showPwd ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Palavra-passe" className={`${inputCls} pr-10`} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button disabled={loading} className="w-full bg-black text-white py-3 rounded-full text-sm font-semibold disabled:opacity-50">
                {loading ? "A entrar..." : "Entrar"}
              </button>
            </form>
          ) : (
            <form onSubmit={onSuggest} className="space-y-3 bg-white border border-[#E8CC91] rounded-2xl p-4">
              <h2 className="text-sm font-bold">Sugerir igreja ou serviço público</h2>
              <p className="text-[11px] text-gray-500">Conhece um lugar em falta? Sugira aqui — é grátis.</p>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Nome do lugar *" className={inputCls} />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.kind} onChange={(e) => set("kind", e.target.value)} className={inputCls}>
                  <option value="igreja">Igreja</option>
                  <option value="servico-publico">Serviço Público</option>
                </select>
                <input value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="Categoria" className={inputCls} />
              </div>
              <input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Endereço / referência" className={inputCls} />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.province} onChange={(e) => set("province", e.target.value)} className={inputCls}>
                  <option value="">Província</option>
                  {ANGOLA_PROVINCES.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
                </select>
                <input value={form.municipality} onChange={(e) => set("municipality", e.target.value)} placeholder="Município" className={inputCls} />
              </div>
              <button disabled={loading} className="w-full bg-[#A96F12] text-white py-3 rounded-full text-sm font-semibold disabled:opacity-50">
                {loading ? "A registar..." : "Sugerir lugar"}
              </button>
              <p className="text-[11px] text-gray-500 flex items-center gap-1"><MapPin size={11} /> Se souber as coordenadas, a equipa YESOLA completa depois.</p>
            </form>
          )}
        </section>
      </div>
    </PageTransition>
  );
}
