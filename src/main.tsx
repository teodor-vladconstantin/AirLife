import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initAnalytics } from "./lib/analytics";

initAnalytics();

const root = document.getElementById("root")!;
// Keep the prerendered markup on screen while a lazy route chunk loads (see Suspense fallback in App.tsx).
(window as unknown as { __PRERENDER__?: string }).__PRERENDER__ = root.innerHTML;
createRoot(root).render(<App />);
