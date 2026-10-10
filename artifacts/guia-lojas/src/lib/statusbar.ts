import { isNativeApp } from "@/lib/nativePhoto";

let started = false;

// Barra opaca neutra (branca, padrão do sistema): a WebView começa ABAIXO
// da hora/bateria/rede para o conteúdo nunca invadir o topo. Na web não faz nada.
export async function initStatusBar(): Promise<void> {
  if (started) return;
  started = true;
  try {
    if (!isNativeApp()) return;
    const { StatusBar, Style } = await import("@capacitor/status-bar");
    try {
      await StatusBar.setOverlaysWebView({ overlay: false });
    } catch {
      /* ignora */
    }
    try {
      // Texto escuro (fundo claro). Style.Light = conteúdo escuro.
      await StatusBar.setStyle({ style: Style.Light });
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
