import { supabase } from "@/integrations/supabase/client";

// ponytail: contact/service requests reuse the orders table (same path as product quotes) so they show up
// in admin Orders. Split into a dedicated table + email notification when volume justifies it.
export const submitRequest = async (kind: string, p: { name: string; phone: string; email?: string; details: string }) => {
  const { data: orderNumber, error: numError } = await supabase.rpc("generate_order_number");
  if (numError) throw numError;
  const { error } = await supabase.from("orders").insert({
    order_number: orderNumber as string,
    customer_name: p.name,
    customer_email: p.email || "",
    customer_phone: p.phone,
    shipping_address: {},
    payment_method: "bank_transfer",
    subtotal: 0,
    shipping_cost: 0,
    total_amount: 0,
    customer_notes: `[${kind}] ${p.details}`,
    status: "pending",
  });
  if (error) throw error;
  return orderNumber as string;
};
