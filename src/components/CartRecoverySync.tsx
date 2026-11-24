"use client";
import { useEffect, useRef } from "react";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";

// Tells the server what a signed-in customer has in the cart (4 s after the last change), so a reminder can be sent
// if no order follows. Guests are never sent anywhere. Renders nothing.
export default function CartRecoverySync() {
  const { items } = useCart();
  const last = useRef("");
  useEffect(() => {
    const payload = JSON.stringify(items.map((i) => ({ id: i.product_id, quantity: i.quantity })).sort((a, b) => a.id.localeCompare(b.id)));
    if (payload === last.current || (payload === "[]" && !last.current)) return;
    const t = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      last.current = payload;
      fetch("/api/cart-recovery", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` }, body: JSON.stringify({ items: JSON.parse(payload) }) }).catch(() => {});
    }, 4000);
    return () => clearTimeout(t);
  }, [items]);
  return null;
}
