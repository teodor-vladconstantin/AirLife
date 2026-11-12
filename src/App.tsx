import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { QuoteProvider } from "./contexts/QuoteContext";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import FadeWrapper from "@/components/FadeWrapper";
import CookieBanner from "./components/CookieBanner";

const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const RequestQuote = lazy(() => import("./pages/RequestQuote"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Services = lazy(() => import("./pages/Services"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const ShippingAndReturns = lazy(() => import("./pages/ShippingAndReturns"));
const Warranty = lazy(() => import("./pages/Warranty"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const MontajAerConditionat = lazy(() => import("./pages/services/MontajAerConditionat"));
const IgienizareAerConditionat = lazy(() => import("./pages/services/IgienizareAerConditionat"));
const ServiceAerConditionat = lazy(() => import("./pages/services/ServiceAerConditionat"));
const GhidIgienizare = lazy(() => import("./pages/guides/GhidIgienizare"));
const GhidCostMontaj = lazy(() => import("./pages/guides/GhidCostMontaj"));

// Set VITE_COMING_SOON=true to hide the site (only /auth and /admin stay reachable)
const comingSoon = import.meta.env.VITE_COMING_SOON === "true";

const queryClient = new QueryClient();

// Shows the server-prerendered HTML (if any) while a lazy route chunk loads, so there is no blank flash.
const PrerenderFallback = () => {
  const html = typeof window === "undefined" ? "" : (window as unknown as { __PRERENDER__?: string }).__PRERENDER__ ?? "";
  return <div className="min-h-screen" dangerouslySetInnerHTML={{ __html: html }} />;
};

const App = () => (
  <>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <QuoteProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <CookieBanner />
              <Suspense fallback={<PrerenderFallback />}>
            {comingSoon ? (
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<ComingSoon />} />
            </Routes>
            ) : (
            <Routes>
              <Route path="/" element={<FadeWrapper><Index /></FadeWrapper>} />
              <Route path="/auth" element={<FadeWrapper><Auth /></FadeWrapper>} />
              <Route path="/products" element={<FadeWrapper><Products /></FadeWrapper>} />
              <Route path="/products/:productId" element={<FadeWrapper><ProductDetails /></FadeWrapper>} />
              <Route path="/about" element={<FadeWrapper><AboutUs /></FadeWrapper>} />
              <Route path="/checkout" element={<FadeWrapper><Checkout /></FadeWrapper>} />
              <Route path="/request-quote" element={<FadeWrapper><RequestQuote /></FadeWrapper>} />
              <Route path="/order-confirmation/:orderId" element={<FadeWrapper><OrderConfirmation /></FadeWrapper>} />
              <Route path="/my-orders" element={<FadeWrapper><MyOrders /></FadeWrapper>} />
              <Route path="/admin" element={<FadeWrapper><Admin /></FadeWrapper>} />
              <Route path="/terms" element={<FadeWrapper><TermsAndConditions /></FadeWrapper>} />
              <Route path="/privacy" element={<FadeWrapper><PrivacyPolicy /></FadeWrapper>} />
              <Route path="/contact" element={<FadeWrapper><Contact /></FadeWrapper>} />
              <Route path="/despre-noi" element={<FadeWrapper><AboutUs /></FadeWrapper>} />
              <Route path="/termeni-si-conditii" element={<FadeWrapper><TermsAndConditions /></FadeWrapper>} />
              <Route path="/politica-de-confidentialitate" element={<FadeWrapper><PrivacyPolicy /></FadeWrapper>} />
              <Route path="/politica-de-cookies" element={<FadeWrapper><CookiePolicy /></FadeWrapper>} />
              <Route path="/livrare-si-retur" element={<FadeWrapper><ShippingAndReturns /></FadeWrapper>} />
              <Route path="/garantie" element={<FadeWrapper><Warranty /></FadeWrapper>} />
              <Route path="/servicii" element={<FadeWrapper><Services /></FadeWrapper>} />
              <Route path="/servicii/montaj-aer-conditionat" element={<FadeWrapper><MontajAerConditionat /></FadeWrapper>} />
              <Route path="/servicii/igienizare-aer-conditionat" element={<FadeWrapper><IgienizareAerConditionat /></FadeWrapper>} />
              <Route path="/servicii/service-aer-conditionat" element={<FadeWrapper><ServiceAerConditionat /></FadeWrapper>} />
              <Route path="/ghid/igienizare-aer-conditionat" element={<FadeWrapper><GhidIgienizare /></FadeWrapper>} />
              <Route path="/ghid/cost-montaj-aer-conditionat" element={<FadeWrapper><GhidCostMontaj /></FadeWrapper>} />
              <Route path="/accesorii-aer-conditionat" element={<FadeWrapper><CategoryPage forcedSlug="accesorii-aer-conditionat" /></FadeWrapper>} />
              <Route path="/consumabile-hvac" element={<FadeWrapper><CategoryPage forcedSlug="consumabile-hvac" /></FadeWrapper>} />
              <Route path="/curatare-si-intretinere" element={<FadeWrapper><CategoryPage forcedSlug="curatare-si-intretinere" /></FadeWrapper>} />
              <Route path="/filtre-purificatoare" element={<FadeWrapper><CategoryPage forcedSlug="filtre-purificatoare" /></FadeWrapper>} />
              <Route path="/purificatoare-aer" element={<FadeWrapper><CategoryPage forcedSlug="purificatoare-aer" /></FadeWrapper>} />
              <Route path="/dezumidificatoare" element={<FadeWrapper><CategoryPage forcedSlug="dezumidificatoare" /></FadeWrapper>} />
              <Route path="/blog" element={<FadeWrapper><Blog /></FadeWrapper>} />
              <Route path="/blog/:slug" element={<FadeWrapper><BlogPost /></FadeWrapper>} />
              <Route path="/aer-conditionat" element={<FadeWrapper><CategoryPage forcedSlug="aer-conditionat" /></FadeWrapper>} />
              <Route path="/aer-conditionat-fara-unitate-exterioara" element={<FadeWrapper><CategoryPage forcedSlug="aer-conditionat-fara-unitate-exterioara" /></FadeWrapper>} />
              <Route path="/recuperatoare-caldura" element={<FadeWrapper><CategoryPage forcedSlug="recuperatoare-caldura" /></FadeWrapper>} />
              <Route path="/ventilatoare-baie" element={<FadeWrapper><CategoryPage forcedSlug="ventilatoare-baie" /></FadeWrapper>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<FadeWrapper><NotFound /></FadeWrapper>} />
            </Routes>
            )}
              </Suspense>
            </BrowserRouter>
          </QuoteProvider>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </>
);

export default App;
