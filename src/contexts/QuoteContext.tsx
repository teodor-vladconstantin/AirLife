import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CartItem, Product } from "./CartContext";

interface QuoteContextType {
  items: CartItem[];
  addToQuote: (product: Product, quantity?: number) => Promise<void>;
  removeFromQuote: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearQuote: () => void;
  total: number;
  itemCount: number;
  isLoading: boolean;
  submitQuote: (payload: { name: string; email: string; phone: string; notes?: string; shipping_address?: { address?: string; city?: string; county?: string; postalCode?: string } }) => Promise<{ id?: string; error?: any }>;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

const STORAGE_KEY = "airlife_quote";

export const QuoteProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing quote from localStorage", e);
        setItems([]);
      }
    }
  }, []);

  const save = (next: CartItem[]) => {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addToQuote = async (product: Product, quantity: number = 1) => {
    if (product.stock < quantity) {
      toast({ title: "Stoc insuficient", description: `Doar ${product.stock} disponibile.`, variant: "destructive" });
      return;
    }

    setItems((prev) => {
      const idx = prev.findIndex((p) => p.product_id === product.id);
      let next: CartItem[];
      if (idx >= 0) {
        next = [...prev];
        next[idx].quantity += quantity;
      } else {
        const newItem: CartItem = {
          id: crypto.randomUUID(),
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity,
          image_url: product.image_url,
          stock: product.stock,
          category: product.category,
        };
        next = [...prev, newItem];
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });

    toast({ title: "Adăugat la ofertă", description: `${product.name} a fost adăugat în lista pentru ofertă.` });
  };

  const removeFromQuote = async (productId: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.product_id !== productId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    toast({ title: "Eliminat", description: "Produsul a fost eliminat din listă." });
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return removeFromQuote(productId);
    setItems((prev) => {
      const next = prev.map((it) => (it.product_id === productId ? { ...it, quantity } : it));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clearQuote = () => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const total = items.reduce((s, it) => s + it.price * it.quantity, 0);
  const itemCount = items.reduce((s, it) => s + it.quantity, 0);

  const submitQuote = async (payload: { name: string; email: string; phone: string; notes?: string; shipping_address?: { address?: string; city?: string; county?: string; postalCode?: string } }) => {
    setIsLoading(true);
    try {
      const { data: orderNumData } = await supabase.rpc("generate_order_number");
      const orderNumber = orderNumData as string;
      // attach user_id when an authenticated session exists
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id ?? null;

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          user_id: userId,
          customer_name: payload.name,
          customer_email: payload.email,
          customer_phone: payload.phone,
          shipping_address: payload.shipping_address || {},
          payment_method: "bank_transfer",
          subtotal: total,
          shipping_cost: 0,
          total_amount: total,
          customer_notes: payload.notes || "Cerere ofertă",
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      for (const item of items) {
        const { error: itemError } = await supabase.from("order_items").insert({
          order_id: order.id,
          product_id: item.product_id,
          product_name: item.name,
          product_category: item.category,
          product_image_url: item.image_url,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
        });
        if (itemError) throw itemError;
      }

      clearQuote();
      toast({ title: "Cerere trimisă", description: `Număr cerere: ${orderNumber}` });
      return { id: order.id, orderNumber };
    } catch (error: any) {
      console.error("Submit quote error:", error);
      toast({ title: "Eroare", description: error.message || "Nu s-a putut trimite cererea.", variant: "destructive" });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const value: QuoteContextType = {
    items,
    addToQuote,
    removeFromQuote,
    updateQuantity,
    clearQuote,
    total,
    itemCount,
    isLoading,
    submitQuote,
  };

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
};

export const useQuote = () => {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used within QuoteProvider");
  return ctx;
};
