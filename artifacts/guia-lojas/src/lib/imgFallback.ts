// Fallback global de imagens (app nativa + web): qualquer <img> sem onError
// que falhe troca por uma foto da área em vez de mostrar "?" quebrado.
const FALLBACKS: Record<string, string> = {
  alimentacao: "photo-1504674900247-0877df9cc836",
  agricultura: "photo-1500937386664-56d1dfef3854",
  automoveis: "photo-1492144534655-ae79c964c9d7",
  bancos: "photo-1521737711867-e3b97375f902",
  beleza: "photo-1560066984-138dadb4c035",
  business: "photo-1507003211169-0a1dd7228f2d",
  casa: "photo-1556909114-f6e7ad7d3136",
  desporto: "photo-1534438327276-14e5300c3a48",
  empregos: "photo-1521737711867-e3b97375f902",
  entretenimento: "photo-1470229722913-7c0e2dbbafd3",
  eventos: "photo-1519167758481-83f550bb49b3",
  formacoes: "photo-1524178232363-1fb2b075b655",
  imoveis: "photo-1564013799919-ab600027ffc6",
  infantil: "photo-1564013799919-ab600027ffc6",
  love: "photo-1519741497674-611481863552",
  saude: "photo-1571019613454-1cb2f99b2d8b",
  seguradoras: "photo-1521737711867-e3b97375f902",
  servicos: "photo-1454165804606-c3d57bc86b40",
  tecnologia: "photo-1498049794561-7780e7231661",
  transportes: "photo-1586528116311-ad8dd3c8310d",
  turismo: "photo-1476514525535-07fb3b4ae5f1",
  weddings: "photo-1519741497674-611481863552",
};
const DEFAULT_FB = "photo-1441984904996-e0b6ba687e04";
const fbUrl = (id: string) =>
  `https://images.unsplash.com/${id}?w=400&h=300&fit=crop&auto=format&q=75`;

function fallbackForPath(): string {
  try {
    const p = window.location.pathname.toLowerCase();
    for (const k of Object.keys(FALLBACKS)) {
      if (p.includes(k)) return fbUrl(FALLBACKS[k]);
    }
  } catch { /* ignora */ }
  return fbUrl(DEFAULT_FB);
}

function beacon(url: string, stage: string) {
  try {
    const body = JSON.stringify({ url: url.slice(0, 300), stage });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/moderation/imgfail", body);
    } else {
      fetch("/api/moderation/imgfail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch { /* ignora */ }
}

let started = false;

export function initImgFallback(): void {
  if (started) return;
  started = true;
  try {
    document.addEventListener(
      "error",
      (e) => {
        const t = e.target as HTMLElement | null;
        if (!t || t.tagName !== "IMG") return;
        const img = t as HTMLImageElement;
        if (img.dataset.fbDone) {
          beacon(img.src, "fallback-failed");
          img.style.display = "none";
          return;
        }
        img.dataset.fbDone = "1";
        beacon(img.src, "original-failed");
        const fb = fallbackForPath();
        if (img.src !== fb) img.src = fb;
        else img.style.display = "none";
      },
      true
    );
  } catch { /* ignora */ }
}
