"use client";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist";

export function WishlistButton({ productId, productName, className = "", withLabel = false }: { productId: string; productName: string; className?: string; withLabel?: boolean }) {
  const { has, toggle } = useWishlist();
  const on = has(productId);
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(productId); }}
      aria-pressed={on}
      aria-label={on ? `Scoate ${productName} din favorite` : `Adaugă ${productName} la favorite`}
      className={`inline-flex items-center justify-center gap-2 rounded-full transition-colors ${className}`}
    >
      <Heart className={`h-4 w-4 ${on ? "fill-destructive text-destructive" : ""}`} />
      {withLabel && <span className="text-sm font-medium">{on ? "În favorite" : "Adaugă la favorite"}</span>}
    </button>
  );
}
