import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/contexts/CartContext";
import { CartItem } from "./CartItem";
import { useNavigate } from "@/lib/router";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const { items, updateQuantity, removeFromCart, addToCart, total, itemCount } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Remove a line, and offer "Anulează" in case it was a mistake.
  const handleRemove = async (productId: string) => {
    const item = items.find((i) => i.product_id === productId);
    await removeFromCart(productId);
    if (!item) return;
    toast({
      title: "Produs scos din coș",
      description: item.name,
      action: (
        <ToastAction
          altText="Anulează ștergerea"
          onClick={() => addToCart({ id: item.product_id, name: item.name, description: "", price: item.price, category: item.category, image_url: item.image_url, features: [], stock: item.stock }, item.quantity)}
        >
          Anulează
        </ToastAction>
      ),
    });
  };

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        className="w-full sm:max-w-lg flex flex-col"
        // Pressing "Anulează" in the toast is "outside" the drawer: keep the drawer open so the restored item is visible.
        onInteractOutside={(e) => { if ((e.target as HTMLElement | null)?.closest('[aria-label^="Notifications"]')) e.preventDefault(); }}
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Coșul Meu ({itemCount} {itemCount === 1 ? "produs" : "produse"})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Coșul tău este gol</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Adaugă produse în coș și plasează comanda online.
            </p>
            <Button onClick={() => {
              onClose();
              navigate("/produse");
            }}>
              Vezi Produsele
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-1">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </ScrollArea>

            <SheetFooter className="flex-col gap-4 mt-4">
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{total.toFixed(2)} RON</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Livrare</span>
                  <span className="font-semibold">
                    {total >= 1000 ? "GRATUIT" : "20.00 RON"}
                  </span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary text-lg">
                      {(total + (total >= 1000 ? 0 : 20)).toFixed(2)} RON
                    </span>
                  </div>
                </div>
                {total < 1000 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    Mai adaugă {(1000 - total).toFixed(2)} RON pentru livrare gratuită!
                  </p>
                )}
              </div>

              <Button onClick={handleCheckout} className="w-full" size="lg">
                Finalizează comanda
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
