// Variante leve do proxy de imagens do nosso servidor.
// GET /api/media/image/<fileId>?size=thumb → 480px JPEG q60,
// ~80-90% mais leve que a versão cheia (1600px) e muito mais leve que o
// original do telemóvel (2-5 MB) quando o sharp não está disponível.
// Usar nos cartões/grelhas; páginas de detalhe continuam com a cheia.
//
// Só toca em URLs do nosso proxy; Unsplash e outras externas passam intactas.
//
// URLs absolutas SEMPRE: a app nativa corre empacotada em
// capacitor://localhost, onde caminhos relativos /api/... não resolvem
// (o fetch é reescrito pelo interceptor em apiBase.ts, mas <img> não é).
import { API_BASE } from "./apiBase";

// Imagens direto no Worker (1 invocação) em vez de Pages→Worker (2 invocações).
// Corte de ~50% na cota gratuita. As demais seguem na API_BASE.
const MEDIA_BASE = "https://isabel-api.chiquembaines.workers.dev";

export function absUrl(url: string): string {
  if (!url) return url;
  if (/^(https?:|data:|blob:|capacitor:)/i.test(url)) return url;
  if (url.startsWith("/api/media/")) return MEDIA_BASE + url;
  if (url.startsWith("/")) return API_BASE.replace(/\/+$/, "") + url;
  return url;
}

export function thumbUrl(url?: string | null): string {
  if (!url) return "";
  if (!url.startsWith("/api/media/image/")) return absUrl(url);
  if (url.includes("size=")) return absUrl(url);
  const out = url.includes("?") ? `${url}&size=thumb` : `${url}?size=thumb`;
  return absUrl(out);
}

export function thumbList(urls: Array<string | null | undefined>): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const u of urls) {
    if (!u) continue;
    const t = thumbUrl(u);
    // Mesma foto gravada em cover_image + cover_images (74 lojas, 398
    // produtos): sem isto o carrossel mostra 2 pontos para 1 foto.
    if (t && !seen.has(t)) {
      seen.add(t);
      out.push(t);
    }
  }
  return out;
}

// Deduplica mantendo a ordem (para arrays cheios: lightbox, contagens).
export function dedupeUrls(urls: Array<string | null | undefined>): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const u of urls) {
    if (typeof u !== "string") continue;
    const v = absUrl(u.trim());
    if (v && !seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  }
  return out;
}
