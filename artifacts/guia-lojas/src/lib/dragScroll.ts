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
  const RESUME_AFTER = 5000;

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
      if (row === hovered && Date.now() - hoverTime < 5000) return;
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
