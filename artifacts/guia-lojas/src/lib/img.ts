// Variante leve do proxy de imagens do nosso servidor.
// GET /api/media/image/<fileId>?size=thumb → 480px JPEG q60,
// ~80-90% mais leve que a versão cheia (1600px) e muito mais leve que o
// original do telemóvel (2-5 MB) quando o sharp não está disponível.
// Usar nos cartões/grelhas; páginas de detalhe continuam com a cheia.
//
// Só toca em URLs do nosso proxy; Unsplash e outras externas passam intactas.
export function thumbUrl(url?: string | null): string {
  if (!url) return "";
  if (!url.startsWith("/api/media/image/")) return url;
  if (url.includes("size=")) return url;
  return url.includes("?") ? `${url}&size=thumb` : `${url}?size=thumb`;
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
    const v = u.trim();
    if (v && !seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  }
  return out;
}
