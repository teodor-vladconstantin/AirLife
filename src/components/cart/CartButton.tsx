import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useQuote } from "@/contexts/QuoteContext";
import { CartDrawer } from "./CartDrawer";

export const CartButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { itemCount } = useQuote();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(true)}
      >
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {itemCount > 99 ? "99+" : itemCount}
          </Badge>
        )}
      </Button>
      <CartDrawer open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
