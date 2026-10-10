import { isNativeApp } from "@/lib/nativePhoto";

let started = false;

// Comportamento padrão do telemóvel (edge-to-edge, sem cor imposta).
export async function initStatusBar(): Promise<void> {
  if (started) return;
  started = true;
  try {
    if (!isNativeApp()) return;
    const { StatusBar } = await import("@capacitor/status-bar");
    try {
      await StatusBar.setOverlaysWebView({ overlay: true });
    } catch {
      /* ignora */
    }
  } catch {
    /* plugin ausente ou web: ignora */
  }
}

// Desativado a pedido: vale o padrão do telemóvel.
export async function setNativeStatusColor(_color: string): Promise<void> {
  return;
}
