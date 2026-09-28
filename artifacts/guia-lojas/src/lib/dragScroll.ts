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
 * Deslize automático das filas: DESLIGADO por pedido do utilizador.
 * As filas mexem-se apenas com gesto manual (swipe no telemóvel,
 * arrasto com o rato no PC). Mantida por compatibilidade com main.tsx.
 */
export function enableAutoScroll() {
  return;
}

/**
 * Arrasto tátil (telemóvel): intencionalmente vazio.
 * O scroll nativo do browser (overflow-x: auto + -webkit-overflow-scrolling)
 * já dá swipe com inércia/momentum. O hijack manual anterior (touchmove +
 * preventDefault + scrollLeft 1:1) matava a inércia e fazia as filas
 * "falhar"/prender no dedo, além de lutar com o scroll-snap.
 * Mantida por compatibilidade com main.tsx — não instala listeners.
 */
export function enableTouchDrag() {
  return;
}
