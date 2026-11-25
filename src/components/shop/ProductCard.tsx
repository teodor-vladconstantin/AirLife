"use client";
import { memo, useState } from "react";
import { Loader2, ShoppingCart } from "lucide-react";
import { Link } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { trackAddToCart } from "@/lib/analytics";
import { WishlistButton } from "@/components/shop/WishlistButton";
import { thumbUrl, fallbackTo } from "@/lib/thumb";
import { discountPct, formatPrice, type ProductCardData } from "@/lib/shop";

// Collection card in the usual online-store layout: square photo with a badge, brand, two-line title, price (with the
// struck-through list price on sale) and a quick "add to cart".
export const ProductCard = memo(function ProductCard({ product, priority = false }: { product: ProductCardData; priority?: boolean }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const out = product.stock <= 0;
  const pct = discountPct(product);
  const href = `/produse/${product.slug}`;

  return (
    <article className="group relative flex min-w-0 flex-col">
      <Link to={href} className="relative block aspect-square overflow-hidden rounded-xl bg-secondary/70" aria-label={product.name}>
        <img
          src={thumbUrl(product.image_url)}
          onError={fallbackTo(product.image_url)}
          alt={`${product.name} - AirLife Buzău`}
          width={400}
          height={400}
          loading={priority ? undefined : "lazy"}
          decoding="async"
          {...(priority ? { fetchPriority: "high" as const } : {})}
          className={`h-full w-full object-contain p-4 mix-blend-multiply transition-transform duration-300 group-hover:scale-[1.03] ${out ? "opacity-60" : ""}`}
        />
        {(pct > 0 || out) && (
          <span className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-xs font-semibold ${out ? "bg-muted text-muted-foreground" : "bg-promo text-promo-foreground"}`}>
            {out ? "Indisponibil" : `-${pct}%`}
          </span>
        )}
      </Link>
      <WishlistButton productId={product.id} productName={product.name} className="absolute right-2 top-2 h-11 w-11 bg-background/90 shadow-sm hover:bg-background" />
      <div className="flex flex-1 flex-col gap-1 pt-3">
        {product.brand && <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">{product.brand}</p>}
        <h3 className="line-clamp-2 min-h-[2.5rem] break-words text-sm font-semibold leading-snug text-foreground">
          <Link to={href} className="hover:text-primary">{product.name}</Link>
        </h3>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
          <span className={`text-base font-bold sm:text-lg ${product.compare_at ? "text-promo" : "text-foreground"}`}>{formatPrice(product.price)}</span>
          {product.compare_at && <span className="text-sm text-muted-foreground line-through">{formatPrice(product.compare_at)}</span>}
        </div>
        <p className={`text-xs ${out ? "text-muted-foreground" : "text-primary"}`}>{out ? "Indisponibil momentan" : product.stock <= 3 ? `Ultimele ${product.stock} bucăți` : "În stoc"}</p>
        <Button
          variant="outline"
          className="mt-2 w-full border-foreground/20"
          disabled={out || adding}
          aria-busy={adding}
          onClick={async () => {
            setAdding(true);
            try {
            await addToCart({ id: product.id, name: product.name, description: "", price: product.price, category: product.category, image_url: product.image_url, features: [], stock: product.stock });
            trackAddToCart({ item_id: product.id, item_name: product.name, price: product.price, item_category: product.category, quantity: 1 });
            } finally { setAdding(false); }
          }}
        >
          {adding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
          {out ? "Indisponibil" : adding ? "Se adaugă…" : "Adaugă în coș"}
        </Button>
      </div>
    </article>
  );
});
