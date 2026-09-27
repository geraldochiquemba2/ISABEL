import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { enableDragScroll, enableAutoScroll } from "./lib/dragScroll";

// Permite arrastar as filas de lojas com o rato (PC não tem swipe)
// e deslize automático das filas (pausa quando o utilizador manipula)
enableDragScroll();
enableAutoScroll();

createRoot(document.getElementById("root")!).render(<App />);
