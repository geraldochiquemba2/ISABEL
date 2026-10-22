import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Trash2 } from "lucide-react";
import { deleteAccount } from "@/lib/api";

interface DeleteAccountMenuItemProps {
  className?: string;
  compact?: boolean;
}

export function DeleteAccountMenuItem({ className = "", compact = false }: DeleteAccountMenuItemProps) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const close = () => {
    if (loading) return;
    setOpen(false);
    setPassword("");
    setError("");
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setPassword("");
        setError("");
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  async function handleDelete() {
    setError("");
    if (!password) {
      setError("Digite a sua senha para confirmar.");
      return;
    }
    let user: any = null;
    try {
      user = JSON.parse(localStorage.getItem("guialocal_user") || "null");
    } catch {
      user = null;
    }
    if (!user?.phone) {
      setError("Sessão expirada. Entre novamente.");
      return;
    }
    setLoading(true);
    try {
      await deleteAccount(user.phone, user.storeType || "collection", password);
      localStorage.removeItem("guialocal_user");
      window.location.href = "/";
    } catch (e: any) {
      setError(e?.message || "Erro ao eliminar conta.");
      setLoading(false);
    }
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        <Trash2 size={15} /> {compact ? "Eliminar" : "Eliminar conta"}
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Eliminar conta"
            onClick={close}
          >
            <div
              className="w-full max-w-sm rounded-2xl border border-red-200 bg-white p-6 shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600">
                  <Trash2 size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">Eliminar conta</h2>
                  <p className="text-xs text-muted-foreground">Esta ação é permanente.</p>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-red-600">
                Apaga permanentemente a sua conta, a sua loja e os seus produtos ou serviços. Não pode ser anulado.
              </p>

              <input
                type="password"
                autoFocus
                placeholder="Confirme com a sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleDelete();
                }}
                className="w-full rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-red-400"
              />

              {error && <p className="text-xs font-medium text-red-600">{error}</p>}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={close}
                  disabled={loading}
                  className="flex-1 rounded-full border border-gray-300 py-2.5 text-xs font-semibold disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 rounded-full bg-red-600 py-2.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? "A eliminar..." : "Eliminar conta"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
