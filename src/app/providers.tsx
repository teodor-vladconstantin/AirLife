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
import { supabase } from "@/integrations/supabase/client";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  useEffect(() => initAnalytics(), []);
  // A password-recovery link lands on any page with a session in the URL hash: send the user to the new-password form.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "PASSWORD_RECOVERY") return;
      try { sessionStorage.setItem("airlife_recovery", "1"); } catch { /* storage blocked */ }
      if (window.location.pathname !== "/auth") window.location.assign("/auth");
    });
    return () => subscription.unsubscribe();
  }, []);
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
