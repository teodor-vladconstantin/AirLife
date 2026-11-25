"use client";
import { Heart } from "lucide-react";
import { useNavigate } from "@/lib/router";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { useWishlist } from "@/lib/wishlist";

export function WishlistButton({ productId, productName, className = "", withLabel = false }: { productId: string; productName: string; className?: string; withLabel?: boolean }) {
  const { has, toggle } = useWishlist();
  const { toast } = useToast();
  const navigate = useNavigate();
  const on = has(productId);

  const click = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const r = await toggle(productId);
    if (r === "login_required") {
      toast({
        title: "Conectează-te ca să salvezi la favorite",
        description: "Favoritele se păstrează în contul tău și le găsești pe orice dispozitiv.",
        action: <ToastAction altText="Conectează-te" onClick={() => navigate("/auth")}>Conectează-te</ToastAction>,
      });
    } else if (r === "error") {
      toast({ title: "Nu am putut salva", description: "Încearcă din nou.", variant: "destructive" });
    }
  };

  return (
    <button
      type="button"
      onClick={click}
      aria-pressed={on}
      aria-label={on ? `Scoate ${productName} din favorite` : `Adaugă ${productName} la favorite`}
      className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full transition-colors ${className}`}
    >
      <Heart className={`h-4 w-4 ${on ? "fill-primary text-primary" : ""}`} />
      {withLabel && <span className="text-sm font-medium">{on ? "În favorite" : "Adaugă la favorite"}</span>}
    </button>
  );
}
