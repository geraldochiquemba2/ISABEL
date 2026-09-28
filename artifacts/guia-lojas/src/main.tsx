import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { enableDragScroll, enableAutoScroll, enableTouchDrag } from "./lib/dragScroll";

// Permite arrastar as filas de lojas com o rato (PC não tem swipe)
// e deslize automático das filas só no PC (pausa quando o utilizador manipula)
enableDragScroll();
enableAutoScroll();
// No telemóvel usa-se o scroll nativo com inércia (enableTouchDrag é no-op)
enableTouchDrag();

createRoot(document.getElementById("root")!).render(<App />);
