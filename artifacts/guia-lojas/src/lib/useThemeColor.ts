import { useEffect } from "react";

// Fixa a cor da barra do navegador (theme-color) enquanto a página está aberta.
// Sem isto, ao navegar entre páginas o Safari reaproveita a cor anterior
// (ex.: Contacto herdava o escuro do index em vez do marfim da página).
export function useThemeColor(color: string) {
  useEffect(() => {
    let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    let created = false;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
      created = true;
    }
    const prev = meta.getAttribute("content");
    meta.setAttribute("content", color);
    return () => {
      try {
        if (created) meta?.remove();
        else if (prev) meta?.setAttribute("content", prev);
      } catch { /* ignora */ }
    };
  }, [color]);
}
