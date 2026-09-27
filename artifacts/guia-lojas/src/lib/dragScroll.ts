/**
 * Arrastar-com-rato para as filas horizontais de lojas/categorias.
 * No PC não há swipe e a scrollbar está escondida, por isso o clique-arrastar
 * faz o papel do deslize do telemóvel. Instalado uma única vez em main.tsx.
 */

const SELECTOR = ".store-scroll, .scrollbar-hide, .scrollbar-none, .cat-scroll, .trust-scroll";
const THRESHOLD = 6;

export function enableDragScroll() {
  let el: HTMLElement | null = null;
  let startX = 0;
  let startScroll = 0;
  let dragged = false;

  const onDown = (e: MouseEvent) => {
    // Reset sempre no início de cada pressão: o "dragged" anterior já cumpriu
    // o seu papel (ou ficou preso se o mouseup foi fora da janela). Sem isto,
    // o próximo clique válido (ex: nos pontos do carrossel) era engolido.
    dragged = false;
    if (e.button !== 0) return;
    const t = e.target as HTMLElement;
    if (t.closest?.("input, textarea, select")) return;
    const target = t.closest?.(SELECTOR) as HTMLElement | null;
    if (!target) return;
    // Evita o arrasto nativo (fantasma) das imagens sem quebrar o clique
    if (t.tagName === "IMG") e.preventDefault();
    el = target;
    startX = e.clientX;
    startScroll = target.scrollLeft;
    dragged = false;
  };

  const onMove = (e: MouseEvent) => {
    if (!el) return;
    const dx = e.clientX - startX;
    if (!dragged && Math.abs(dx) > THRESHOLD) {
      dragged = true;
      document.body.classList.add("drag-scrolling");
    }
    if (dragged) el.scrollLeft = startScroll - dx;
  };

  const onUp = () => {
    el = null;
    document.body.classList.remove("drag-scrolling");
  };

  // Suprime o clique no card quando houve arrasto (evita abrir a loja sem querer)
  const onClick = (e: MouseEvent) => {
    if (dragged) {
      e.stopPropagation();
      e.preventDefault();
      dragged = false;
    }
  };

  document.addEventListener("mousedown", onDown);
  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onUp);
  document.addEventListener("click", onClick, true);
}

/**
 * Deslize automático das filas de LOJAS (não toca em categorias/selos/tabs).
 * O utilizador pode manipular à vontade: qualquer interação (toque, clique,
 * roda do rato, arrasto) pausa tudo por alguns segundos; passar o rato por
 * cima de uma fila pausa só essa fila. Respeita `prefers-reduced-motion`.
 */
export function enableAutoScroll() {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  const ROWS = ".store-scroll, .scrollbar-hide, .scrollbar-none";
  const STEP = 220;
  const INTERVAL = 2000;
  const RESUME_AFTER = 3000;

  let lastInteract = 0;
  let hovered: HTMLElement | null = null;
  let hoverTime = 0;

  const markInteract = () => {
    lastInteract = Date.now();
    hovered = null; // qualquer interação limpa a pausa de hover (evita ficar presa, ex. após tap no telemóvel)
  };
  document.addEventListener("pointerdown", markInteract, true);
  document.addEventListener("wheel", markInteract, { capture: true, passive: true });
  document.addEventListener("touchstart", markInteract, { capture: true, passive: true });
  // Durante o gesto (dedo/rato premido em movimento) mantém a pausa — sem isto,
  // um arrasto com mais de RESUME_AFTER relançava o autoplay a meio do gesto
  document.addEventListener("touchmove", markInteract, { capture: true, passive: true });
  document.addEventListener("pointermove", (e) => {
    if ((e as PointerEvent).buttons > 0) markInteract();
  }, { capture: true, passive: true });

  document.addEventListener("mouseover", (e) => {
    hovered = ((e.target as HTMLElement).closest?.(ROWS) as HTMLElement | null) ?? null;
    if (hovered) hoverTime = Date.now();
  });
  document.addEventListener("mouseout", (e) => {
    const to = (e.relatedTarget as HTMLElement | null)?.closest?.(ROWS) ?? null;
    if (to !== hovered) hovered = (to as HTMLElement | null) ?? null;
  });

  setInterval(() => {
    if (document.hidden) return;
    if (document.body.classList.contains("drag-scrolling")) return;
    if (Date.now() - lastInteract < RESUME_AFTER) return;
    const rows = document.querySelectorAll<HTMLElement>(ROWS);
    rows.forEach((row) => {
      // Pausa de hover expira ao fim de 5s parado — rato parado não trava para sempre
      if (row === hovered && Date.now() - hoverTime < 3000) return;
      if (row.getAttribute("role") === "tablist") return;
      if (row.scrollWidth <= row.clientWidth + 4) return;
      if (!row.querySelector("img")) return;
      const r = row.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const atEnd = row.scrollLeft + row.clientWidth >= row.scrollWidth - 8;
      row.scrollBy({ left: atEnd ? -row.scrollLeft : STEP, behavior: "smooth" });
    });
  }, INTERVAL);
}

/**
 * Arrasto tátil manual nas filas (telemóvel): a fila segue o dedo 1:1.
 * Só assume o gesto quando a intenção é horizontal (|dx| > |dy|); se for
 * vertical, liberta para a página continuar a rolar normalmente.
 */
export function enableTouchDrag() {
  const ROWS = ".store-scroll, .scrollbar-hide, .scrollbar-none, .cat-scroll, .trust-scroll";
  let row: HTMLElement | null = null;
  let startX = 0;
  let startY = 0;
  let startScroll = 0;
  let locked = false;
  let tracking = false;

  const release = () => {
    row = null;
    tracking = false;
    locked = false;
  };

  const onStart = (e: TouchEvent) => {
    if (e.touches.length !== 1) {
      release();
      return;
    }
    const t = e.target as HTMLElement;
    if (t.closest?.("input, textarea, select")) return;
    const target = t.closest?.(ROWS) as HTMLElement | null;
    if (!target) return;
    row = target;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startScroll = target.scrollLeft;
    locked = false;
    tracking = true;
  };

  const onMove = (e: TouchEvent) => {
    if (!tracking || !row) return;
    const t = e.touches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    if (!locked) {
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        locked = true;
      } else if (Math.abs(dy) > 10) {
        release(); // intenção vertical: devolve o gesto à página
        return;
      } else {
        return;
      }
    }
    e.preventDefault();
    row.scrollLeft = startScroll - dx;
  };

  document.addEventListener("touchstart", onStart, { capture: true, passive: true });
  document.addEventListener("touchmove", onMove, { capture: true, passive: false });
  document.addEventListener("touchend", release, { capture: true });
  document.addEventListener("touchcancel", release, { capture: true });
}
