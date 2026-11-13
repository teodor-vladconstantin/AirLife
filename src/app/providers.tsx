"use client";
import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { QuoteProvider } from "@/contexts/QuoteContext";
import ScrollToTop from "@/components/ScrollToTop";
import CookieBanner from "@/components/CookieBanner";
import { initAnalytics } from "@/lib/analytics";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  useEffect(() => initAnalytics(), []);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <QuoteProvider>
            <Toaster />
            <Sonner />
            <ScrollToTop />
            <CookieBanner />
            {children}
          </QuoteProvider>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
