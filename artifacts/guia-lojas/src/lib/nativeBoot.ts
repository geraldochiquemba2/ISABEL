// Arranque nativo (iOS/Android empacotado): a app abre sempre nas
// boas-vindas (escolher área), porque fechar totalmente mata a sessão da
// WebView. Exceto quando o reload foi provocado por navegação interna
// (Ver site, escolher área, voltar à área), que marca keepNativeArea()
// antes de navegar. Na web não faz nada (mantém onde estava).
import { isNativeApp } from "./nativePhoto";

const KEEP_KEY = "yesola-native-keep";

export function nativeBootReset(): void {
  try {
    const keep = sessionStorage.getItem(KEEP_KEY);
    sessionStorage.removeItem(KEEP_KEY);
    if (!isNativeApp() || keep) return;
    localStorage.removeItem("eliora-selected-store");
  } catch {
    /* sem storage */
  }
}

// Marca o próximo arranque como continuação interna (não limpa a área).
// One-shot: consumida e apagada no arranque seguinte.
export function keepNativeArea(): void {
  try {
    sessionStorage.setItem(KEEP_KEY, "1");
  } catch {
    /* sem storage */
  }
}
