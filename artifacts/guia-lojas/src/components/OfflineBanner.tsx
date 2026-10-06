import { useEffect, useState } from "react";
import { Network } from "@capacitor/network";
import { WifiOff } from "lucide-react";

// Aviso offline nativo: aparece quando o iPhone perde internet.
// Funciona na app instalada e no browser.
export default function OfflineBanner() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    let alive = true;
    let sub: { remove: () => void } | null = null;
    (async () => {
      try {
        const s = await Network.getStatus();
        if (alive) setOnline(s.connected);
      } catch {
        if (alive && typeof navigator !== "undefined") setOnline(navigator.onLine);
      }
      try {
        sub = await Network.addListener("networkStatusChange", (s) => {
          if (alive) setOnline(s.connected);
        });
      } catch {
        /* sem plugin: fica o estado inicial */
      }
    })();
    const onWin = () => alive && setOnline(navigator.onLine);
    window.addEventListener("online", onWin);
    window.addEventListener("offline", onWin);
    return () => {
      alive = false;
      try { sub?.remove(); } catch { /* ignore */ }
      window.removeEventListener("online", onWin);
      window.removeEventListener("offline", onWin);
    };
  }, []);
  if (online) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 bg-[#171717] text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-xl">
      <WifiOff size={14} />
      Sem internet — ligue os dados para continuar
    </div>
  );
}
