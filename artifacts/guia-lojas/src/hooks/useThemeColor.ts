import { useEffect } from "react";

export function useThemeColor(color: string) {
  useEffect(() => {
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    const prev = meta.content;
    meta.content = color;
    return () => { meta!.content = prev; };
  }, [color]);
}
