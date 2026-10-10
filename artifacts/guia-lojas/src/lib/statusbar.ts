import { Capacitor } from "@capacitor/core";
import { isNativeApp } from "@/lib/nativePhoto";

let started = false;

// Status bar nativa opaca (iOS): a WebView começa ABAIXO da hora/bateria/rede
// com fundo sólido da marca, em vez do conteúdo rolar por baixo. Na web não faz nada.
export async function initStatusBar(): Promise<void> {
  if (started) return;
  started = true;
  try {
    if (!isNativeApp()) return;
    if (!Capacitor.isPluginAvailable("StatusBar")) return;
    const { StatusBar, Style } = await import("@capacitor/status-bar");
    await StatusBar.setOverlaysWebView({ overlay: false });
    await StatusBar.setStyle({ style: Style.Dark });
    try {
      await StatusBar.setBackgroundColor({ color: "#B8860B" });
    } catch {
      /* iOS ignora quando sobrepõe; Android <15 aplica */
    }
  } catch {
    /* plugin ausente ou web: ignora */
  }
}
