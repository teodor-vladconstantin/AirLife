import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { QuoteProvider } from "./contexts/QuoteContext";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import AboutUs from "./pages/AboutUs";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import MyOrders from "./pages/MyOrders";
import RequestQuote from "./pages/RequestQuote";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import FadeWrapper from "@/components/FadeWrapper";
import ComingSoon from "./pages/ComingSoon";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import CookieBanner from "./components/CookieBanner";
import Services from "./pages/Services";
import CookiePolicy from "./pages/CookiePolicy";
import ShippingAndReturns from "./pages/ShippingAndReturns";
import Warranty from "./pages/Warranty";
import CategoryPage from "./pages/CategoryPage";
import MontajAerConditionat from "./pages/services/MontajAerConditionat";
import IgienizareAerConditionat from "./pages/services/IgienizareAerConditionat";
import ServiceAerConditionat from "./pages/services/ServiceAerConditionat";
import GhidIgienizare from "./pages/guides/GhidIgienizare";
import GhidCostMontaj from "./pages/guides/GhidCostMontaj";

// Set VITE_COMING_SOON=true to hide the site (only /auth and /admin stay reachable)
const comingSoon = import.meta.env.VITE_COMING_SOON === "true";

const queryClient = new QueryClient();

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
            </BrowserRouter>
          </QuoteProvider>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </>
);

export default App;
