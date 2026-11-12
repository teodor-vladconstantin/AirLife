// Server-side entry used only by scripts/prerender.ts (via vite.ssrLoadModule). Renders static pages to HTML.
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "./contexts/CartContext";
import { QuoteProvider } from "./contexts/QuoteContext";
import Index from "./pages/Index";
import Services from "./pages/Services";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import ShippingAndReturns from "./pages/ShippingAndReturns";
import Warranty from "./pages/Warranty";
import MontajAerConditionatBuzau from "./pages/services/MontajAerConditionatBuzau";
import IgienizareAerConditionatBuzau from "./pages/services/IgienizareAerConditionatBuzau";
import ServiceAerConditionatBuzau from "./pages/services/ServiceAerConditionatBuzau";
import GhidIgienizare from "./pages/guides/GhidIgienizare";
import GhidCostMontajBuzau from "./pages/guides/GhidCostMontajBuzau";

const PAGES: Record<string, () => JSX.Element> = {
  "/": Index,
  "/servicii": Services,
  "/servicii/montaj-aer-conditionat": MontajAerConditionatBuzau,
  "/servicii/igienizare-aer-conditionat": IgienizareAerConditionatBuzau,
  "/servicii/service-aer-conditionat": ServiceAerConditionatBuzau,
  "/ghid/igienizare-aer-conditionat": GhidIgienizare,
  "/ghid/cost-montaj-aer-conditionat": GhidCostMontajBuzau,
  "/despre-noi": AboutUs,
  "/contact": Contact,
  "/livrare-si-retur": ShippingAndReturns,
  "/garantie": Warranty,
};

export const staticPaths = Object.keys(PAGES);

// SEO.tsx stores its props on globalThis.__SEO__ during SSR; we return them with the markup.
export function renderPage(path: string) {
  const Page = PAGES[path];
  (globalThis as { __SEO__?: unknown }).__SEO__ = undefined;
  const html = renderToString(
    <QueryClientProvider client={new QueryClient()}>
      <TooltipProvider>
        <CartProvider>
          <QuoteProvider>
            <StaticRouter location={path}>
              <Page />
            </StaticRouter>
          </QuoteProvider>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>,
  );
  return { html, seo: (globalThis as { __SEO__?: unknown }).__SEO__ as { title: string; description: string; canonical?: string; ogImage?: string; structuredData?: unknown } | undefined };
}
