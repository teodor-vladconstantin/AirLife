import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Cart item interface
export interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
  stock: number;
  category: string;
}

// Product interface (from Products page)
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
  features: any;
  stock: number;
}

// Cart context type
interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
  itemCount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "airlife_cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  // Load cart on mount
  useEffect(() => {
    loadCart();
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'SIGNED_IN') {
        // Merge localStorage cart with DB cart on login
        mergeCartsOnLogin();
      } else if (event === 'SIGNED_OUT') {
        // Load from localStorage on logout
        loadFromLocalStorage();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadCart = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await loadFromDatabase(user.id);
    } else {
      loadFromLocalStorage();
    }
    setIsLoading(false);
  };

  const loadFromDatabase = async (userId: string) => {
    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        id,
        product_id,
        quantity,
        products (
          id,
          name,
          price,
          image_url,
          stock,
          category
        )
      `)
      .eq("user_id", userId);

    if (error) {
      console.error("Error loading cart from DB:", error);
      loadFromLocalStorage();
      return;
    }

    if (data) {
      const cartItems: CartItem[] = data.map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        name: item.products.name,
        price: item.products.price,
        quantity: item.quantity,
        image_url: item.products.image_url,
        stock: item.products.stock,
        category: item.products.category,
      }));
      setItems(cartItems);
    }
  };

  const loadFromLocalStorage = () => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setItems(parsed);
      } catch (e) {
        console.error("Error parsing cart from localStorage:", e);
        setItems([]);
      }
    } else {
      setItems([]);
    }
  };

  const saveToLocalStorage = (cartItems: CartItem[]) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  };

  const mergeCartsOnLogin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get localStorage cart
    const localCart = localStorage.getItem(CART_STORAGE_KEY);
    if (!localCart) {
      await loadFromDatabase(user.id);
      return;
    }

    const localItems: CartItem[] = JSON.parse(localCart);

    // Merge with DB cart
    for (const item of localItems) {
      await addToCartDB(user.id, item.product_id, item.quantity);
    }

    // Clear localStorage
    localStorage.removeItem(CART_STORAGE_KEY);

    // Reload from DB
    await loadFromDatabase(user.id);
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    // Check stock
    if (product.stock < quantity) {
      toast({
        title: "Stoc insuficient",
        description: `Doar ${product.stock} bucăți disponibile.`,
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Add to database
      await addToCartDB(user.id, product.id, quantity);
      await loadFromDatabase(user.id);
    } else {
      // Add to localStorage
      addToCartLocal(product, quantity);
    }

    toast({
      title: "Produs adăugat în coș",
      description: `${product.name} a fost adăugat în coș.`,
    });
  };

  const addToCartDB = async (userId: string, productId: string, quantity: number) => {
    // Check if product already in cart
    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .single();

    if (existing) {
      // Update quantity
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + quantity })
        .eq("id", existing.id);

      if (error) console.error("Error updating cart item:", error);
    } else {
      // Insert new
      const { error } = await supabase
        .from("cart_items")
        .insert({ user_id: userId, product_id: productId, quantity });

      if (error) console.error("Error adding to cart:", error);
    }
  };

  const addToCartLocal = (product: Product, quantity: number) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product_id === product.id);

      let newItems: CartItem[];
      if (existingIndex >= 0) {
        // Update quantity
        newItems = [...prevItems];
        newItems[existingIndex].quantity += quantity;
      } else {
        // Add new item
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
        newItems = [...prevItems, newItem];
      }

      saveToLocalStorage(newItems);
      return newItems;
    });
  };

  const removeFromCart = async (productId: string) => {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (error) {
        console.error("Error removing from cart:", error);
        return;
      }

      await loadFromDatabase(user.id);
    } else {
      setItems((prevItems) => {
        const newItems = prevItems.filter((item) => item.product_id !== productId);
        saveToLocalStorage(newItems);
        return newItems;
      });
    }

    toast({
      title: "Produs eliminat",
      description: "Produsul a fost eliminat din coș.",
    });
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(productId);
      return;
    }

    // Check stock
    const item = items.find((i) => i.product_id === productId);
    if (item && item.stock < quantity) {
      toast({
        title: "Stoc insuficient",
        description: `Doar ${item.stock} bucăți disponibile.`,
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (error) {
        console.error("Error updating quantity:", error);
        return;
      }

      await loadFromDatabase(user.id);
    } else {
      setItems((prevItems) => {
        const newItems = prevItems.map((item) =>
          item.product_id === productId ? { ...item, quantity } : item
        );
        saveToLocalStorage(newItems);
        return newItems;
      });
    }
  };

  const clearCart = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id);

      if (error) {
        console.error("Error clearing cart:", error);
        return;
      }
    }

    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  // Calculate total
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    itemCount,
    isLoading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
