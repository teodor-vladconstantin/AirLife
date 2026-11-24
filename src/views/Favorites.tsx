"use client";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "@/lib/router";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shop/ProductCard";
import { CardSkeleton } from "@/components/shop/Skeletons";
import { isShopVisible, salePricing } from "@/lib/pricing";
import { useWishlist } from "@/lib/wishlist";
import type { ProductCardData } from "@/lib/shop";

const Favorites = () => {
  const { ids } = useWishlist();
  const [cards, setCards] = useState<ProductCardData[] | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    if (!ids.length) { setCards([]); return; }
    let live = true;
    supabase
      .from("products")
      .select("id,slug,name,brand,category,price,sale_price,sale_ends_at,stock,image_url,hidden,created_at")
      .in("id", ids)
      .then(({ data }) => {
        if (!live) return;
        const byId = new Map((data ?? []).filter(isShopVisible).filter((r) => r.slug).map((r) => [r.id, { id: r.id, slug: r.slug!, name: r.name, brand: r.brand, category: r.category, ...salePricing(r), stock: r.stock, image_url: r.image_url!, created_at: r.created_at } as ProductCardData]));
        setCards(ids.flatMap((id) => (byId.has(id) ? [byId.get(id)!] : [])));
      });
    return () => { live = false; };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="mb-1 text-3xl font-bold text-foreground">Favorite</h1>
          <p className="mb-6 text-sm text-muted-foreground">Produsele salvate rămân în acest browser.</p>
          {cards === null ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4" role="status" aria-label="Se încarcă">{Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}</div>
          ) : cards.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center">
              <Heart className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
              <p className="mb-4 font-medium">Nu ai produse favorite încă.</p>
              <Link to="/produse"><Button>Vezi produsele</Button></Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
              {cards.map((c) => <ProductCard key={c.id} product={c} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Favorites;
