import { Lock } from "lucide-react";
import { unblockStore } from "@/lib/api";

function getViewer(): { phone?: string; storeType?: string } | null {
  try {
    const s = localStorage.getItem("guialocal_user");
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

function removeLocalBlock(storeId: string) {
  try {
    const raw = localStorage.getItem("yesola-blocks");
    const list: string[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem("yesola-blocks", JSON.stringify(list.filter((x) => x !== storeId)));
  } catch { /* ignora */ }
}

// Cadeado sobre o card de loja bloqueada. O card fica no lugar;
// ao tocar pergunta se deseja desbloquear.
export default function StoreLockOverlay({ storeId, onUnlock }: { storeId: string; onUnlock: () => void }) {
  async function handleUnlock(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Deseja desbloquear esta loja?")) return;
    try {
      const v = getViewer();
      if (v?.phone) await unblockStore(v.phone, v.storeType || "collection", storeId);
      else removeLocalBlock(storeId);
    } catch {
      removeLocalBlock(storeId);
    }
    onUnlock();
  }

  return (
    <button
      onClick={handleUnlock}
      data-testid="button-unblock-store"
      className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-1.5 bg-black/55 backdrop-blur-[1px] text-white"
      title="Você bloqueou esta loja"
    >
      <Lock size={22} />
      <span className="text-[11px] font-semibold px-3 text-center">Você bloqueou esta loja</span>
      <span className="text-[10px] text-white/70 underline">Toque para desbloquear</span>
    </button>
  );
}
