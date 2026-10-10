import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteAccount } from "@/lib/api";

// Secção "Conta" partilhada por todos os dashboards (eliminar a própria conta).
// Lei 22/11 + App Store 5.1.1: confirma com a senha, apaga conta+loja+produtos.
export default function ContaSection() {
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  let user: any = null;
  try {
    const str = localStorage.getItem("guialocal_user");
    user = str ? JSON.parse(str) : null;
  } catch { user = null; }

  async function handleDelete() {
    if (!confirm) { setConfirm(true); return; }
    if (!pwd) { setError("Digite a sua senha para confirmar."); return; }
    setLoading(true);
    setError("");
    try {
      await deleteAccount(user?.phone, user?.storeType || "collection", pwd);
      localStorage.removeItem("guialocal_user");
      window.location.href = "/";
    } catch (e: any) {
      setError(e.message || "Erro ao eliminar conta.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h2 className="text-lg font-bold">Conta</h2>
        <p className="text-sm text-muted-foreground">{user?.name} · {user?.phone}</p>
      </div>
      <div className="rounded-2xl border border-red-200 bg-red-50/60 p-5 space-y-3">
        <p className="text-sm font-semibold text-red-700 flex items-center gap-2"><Trash2 size={15} /> Eliminar conta</p>
        <p className="text-xs text-red-600/80 leading-relaxed">
          Apaga permanentemente a sua conta, a sua loja e os seus produtos. Esta ação não pode ser anulada.
        </p>
        {!confirm ? (
          <button onClick={handleDelete} className="w-full bg-white border border-red-300 text-red-600 py-2.5 rounded-full text-xs font-semibold hover:bg-red-600 hover:text-white transition-colors">
            Eliminar a minha conta…
          </button>
        ) : (
          <div className="space-y-2.5">
            <input
              type="password"
              placeholder="Confirme com a sua senha"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              className="w-full border border-red-200 bg-white rounded-xl py-2.5 px-4 text-sm outline-none focus:border-red-400"
            />
            {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
            <div className="flex gap-2">
              <button onClick={() => { setConfirm(false); setPwd(""); setError(""); }} className="flex-1 border border-gray-300 py-2.5 rounded-full text-xs font-semibold">
                Cancelar
              </button>
              <button onClick={handleDelete} disabled={loading} className="flex-1 bg-red-600 text-white py-2.5 rounded-full text-xs font-semibold hover:bg-red-700 disabled:opacity-50">
                {loading ? "A eliminar…" : "Confirmar eliminação"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
