import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { Loader2, Save } from "lucide-react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

interface OrderDetailsDialogProps {
  orderId: string;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: any;
  status: string;
  payment_method: string;
  payment_status: string;
  subtotal: number;
  shipping_cost: number;
  total_amount: number;
  tracking_number: string | null;
  courier: string | null;
  customer_notes: string | null;
  admin_notes: string | null;
  created_at: string;
}

interface OrderItem {
  id: string;
  product_name: string;
  product_category: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export const OrderDetailsDialog = ({
  orderId,
  open,
  onClose,
  onUpdate,
}: OrderDetailsDialogProps) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [status, setStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courier, setCourier] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    if (open && orderId) {
      fetchOrderDetails();
    }
  }, [orderId, open]);

  const fetchOrderDetails = async () => {
    setLoading(true);

    try {
      // Fetch order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (orderError) throw orderError;

      setOrder(orderData);
      setStatus(orderData.status);
      setTrackingNumber(orderData.tracking_number || "");
      setCourier(orderData.courier || "");
      setAdminNotes(orderData.admin_notes || "");

      // Fetch order items
      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);

      if (itemsError) throw itemsError;

      setOrderItems(itemsData || []);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca detaliile solicitării",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const updates: any = {
        status,
        tracking_number: trackingNumber || null,
        courier: courier || null,
        admin_notes: adminNotes || null,
        updated_at: new Date().toISOString(),
      };

      // Update timestamps based on status
      if (status === "confirmed" && order?.status !== "confirmed") {
        updates.confirmed_at = new Date().toISOString();
      }
      if (status === "shipped" && order?.status !== "shipped") {
        updates.shipped_at = new Date().toISOString();
      }
      if (status === "delivered" && order?.status !== "delivered") {
        updates.delivered_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("orders")
        .update(updates)
        .eq("id", orderId);

      if (error) throw error;

      toast({
        title: "Succes",
        description: "Comanda a fost actualizată",
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza comanda",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "cash_on_delivery":
        return "Ramburs";
      case "bank_transfer":
        return "Transfer Bancar";
      case "card_online":
        return "Card Online";
      default:
        return method;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalii Cerere</DialogTitle>
          <DialogDescription>
            Vizualizează și actualizează statusul, detaliile de livrare și notițele interne pentru această cerere.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : order ? (
          <div className="space-y-6">
            {/* Order Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold">{order.order_number}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(order.created_at), "dd MMMM yyyy, HH:mm", {
                    locale: ro,
                  })}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            <Separator />

            {/* Customer Info */}
            <div>
              <h4 className="font-semibold mb-3">Informații Client</h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Nume:</span> {order.customer_name}
                </p>
                <p>
                  <span className="text-muted-foreground">Email:</span> {order.customer_email}
                </p>
                <p>
                  <span className="text-muted-foreground">Telefon:</span> {order.customer_phone}
                </p>
              </div>
            </div>

            <Separator />

            {/* Shipping Address */}
            <div>
              <h4 className="font-semibold mb-3">Adresă (dacă este cazul)</h4>
              <p className="text-sm text-muted-foreground">
                {order.shipping_address?.address || "-"}
                <br />
                {order.shipping_address?.city || ""}{order.shipping_address?.city ? ", " : ""}{order.shipping_address?.county || ""}
                <br />
                Cod Poștal: {order.shipping_address?.postalCode || "-"}
              </p>
            </div>

            <Separator />

            {/* Products */}
            <div>
              <h4 className="font-semibold mb-3">Produse solicitate</h4>
              <div className="space-y-2">
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start border-b pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-muted-foreground">{item.product_category}</p>
                      <p className="text-sm">
                        {item.quantity} x {item.unit_price.toFixed(2)} RON
                      </p>
                    </div>
                    <p className="font-semibold">{item.total_price.toFixed(2)} RON</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{order.subtotal.toFixed(2)} RON</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Livrare</span>
                  <span className="font-semibold">
                    {order.shipping_cost === 0
                      ? "GRATUIT"
                      : `${order.shipping_cost.toFixed(2)} RON`}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">{order.total_amount.toFixed(2)} RON</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Info */}
            <div>
              <h4 className="font-semibold mb-3">Detalii procesare</h4>
              <p className="text-sm text-muted-foreground">
                Metodă: {order.payment_method ? getPaymentMethodLabel(order.payment_method) : "-"}
              </p>
            </div>

            {order.customer_notes && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Notițe Client</h4>
                  <p className="text-sm text-muted-foreground">{order.customer_notes}</p>
                </div>
              </>
            )}

            <Separator />

            {/* Admin Controls */}
                <div className="space-y-4">
              <h4 className="font-semibold">Actualizare Solicitare</h4>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">În așteptare</SelectItem>
                    <SelectItem value="confirmed">Confirmată</SelectItem>
                    <SelectItem value="processing">În procesare</SelectItem>
                    <SelectItem value="shipped">Expediată</SelectItem>
                    <SelectItem value="delivered">Livrată</SelectItem>
                    <SelectItem value="cancelled">Anulată</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="courier">Curier</Label>
                <Input
                  id="courier"
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  placeholder="Ex: FAN Courier, Cargus"
                />
              </div>

              <div>
                <Label htmlFor="tracking">Număr de Urmărire (AWB)</Label>
                <Input
                  id="tracking"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Ex: 12345678900"
                />
              </div>

              <div>
                <Label htmlFor="adminNotes">Notițe Admin</Label>
                <Textarea
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Notițe interne"
                  rows={3}
                />
              </div>

              <Button onClick={handleSave} className="w-full" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Se salvează...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvează Modificările
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
