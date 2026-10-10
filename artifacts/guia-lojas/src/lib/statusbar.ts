import { isNativeApp } from "@/lib/nativePhoto";

let started = false;

// Status bar nativa opaca (iOS): a WebView começa ABAIXO da hora/bateria/rede
// com fundo sólido da marca, em vez do conteúdo rolar por baixo. Na web não faz nada.
export async function initStatusBar(): Promise<void> {
  if (started) return;
  started = true;
  try {
    if (!isNativeApp()) return;
    const { StatusBar } = await import("@capacitor/status-bar");
    try {
      await StatusBar.setOverlaysWebView({ overlay: false });
    } catch {
      /* ignora */
    }
  } catch {
    /* plugin ausente ou web: ignora */
  }
  await setNativeStatusColor("#B8860B");
}

function isLight(hex: string): boolean {
  const m = hex.replace("#", "");
  if (m.length < 6) return false;
  const r = parseInt(m.slice(0, 2), 16) / 255;
  const g = parseInt(m.slice(2, 4), 16) / 255;
  const b = parseInt(m.slice(4, 6), 16) / 255;
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 0.55;
}

function beaconInfo(info: string) {
  try {
    const body = JSON.stringify({ url: info.slice(0, 300), stage: "statusbar-info" });
    fetch("https://yesola.ao/api/moderation/imgfail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch { /* ignora */ }
}

// Muda a cor da status bar NATIVA (hora/bateria/rede) em tempo real.
// Chame sempre que mudar de área/loja. Na web não faz nada.
// NOTA: importa o plugin primeiro — isPluginAvailable dá falso sem o import.
export async function setNativeStatusColor(color: string): Promise<void> {
  let native = false;
  let imported = false;
  let result = "";
  try {
    try { native = isNativeApp(); } catch { native = false; }
    let StatusBar: any = null;
    let Style: any = null;
    try {
      const mod = await import("@capacitor/status-bar");
      StatusBar = mod.StatusBar;
      Style = mod.Style;
      imported = !!StatusBar;
    } catch (e: any) {
      result = "import-fail:" + String(e?.message || e).slice(0, 80);
    }
    if (native && imported) {
      try {
        await StatusBar.setBackgroundColor({ color });
        result += "|bg-ok";
      } catch (e: any) {
        result += "|bg-fail:" + String(e?.message || e).slice(0, 60);
      }
      try {
        await StatusBar.setStyle({ style: isLight(color) ? Style.Dark : Style.Light });
        result += "|style-ok";
      } catch (e: any) {
        result += "|style-fail:" + String(e?.message || e).slice(0, 60);
      }
      try {
        const info = await StatusBar.getInfo();
        result += "|info:" + JSON.stringify(info);
      } catch (e: any) {
        result += "|info-fail:" + String(e?.message || e).slice(0, 60);
      }
    }
  } catch (e: any) {
    result += "|outer-fail:" + String(e?.message || e).slice(0, 60);
  }
  beaconInfo(`native:${native} imported:${imported} color:${color} ${result}`);
}
