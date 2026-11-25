"use client";
import { useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { trackPurchase, type AnalyticsItem } from "@/lib/analytics";

// Fires GA4 / PostHog / Meta "purchase" once per order on the confirmation page (data saved by Checkout before the redirect),
// then empties the cart: card payments leave the browser for Stripe before the cart is cleared.
export default function PurchaseTracker({ orderNumber }: { orderNumber?: string }) {
  const { clearCart } = useCart();
  useEffect(() => {
    if (!orderNumber) return;
    try {
      const raw = sessionStorage.getItem("airlife_purchase");
      if (!raw) return;
      const done = JSON.parse(localStorage.getItem("airlife_tracked_orders") || "[]") as string[];
      if (!done.includes(orderNumber)) {
        const s = JSON.parse(raw) as { items: AnalyticsItem[]; value: number; shipping: number };
        trackPurchase(orderNumber, s.items, s.value, s.shipping);
        localStorage.setItem("airlife_tracked_orders", JSON.stringify([...done, orderNumber].slice(-20)));
      }
      sessionStorage.removeItem("airlife_purchase");
      void clearCart();
    } catch { /* storage blocked: skip tracking */ }
  }, [orderNumber, clearCart]);
  return null;
}
