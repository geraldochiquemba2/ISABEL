import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { enableDragScroll, enableAutoScroll, enableTouchDrag } from "./lib/dragScroll";

// Só movimento manual: arrastar com o rato no PC, swipe nativo no telemóvel.
// O deslize automático está desligado (enableAutoScroll e enableTouchDrag são no-ops).
enableDragScroll();
enableAutoScroll();
enableTouchDrag();

createRoot(document.getElementById("root")!).render(<App />);
