import BrandCursor from "@/components/BrandCursor";
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

const queryClient = new QueryClient();

const App = () => (
  <>
    <BrandCursor />
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <QuoteProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
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
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<FadeWrapper><NotFound /></FadeWrapper>} />
            </Routes>
            </BrowserRouter>
          </QuoteProvider>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </>
);

export default App;
