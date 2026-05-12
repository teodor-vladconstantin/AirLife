import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Package, ShoppingBag, Loader2 } from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: any;
  payment_method: string;
  subtotal: number;
  shipping_cost: number;
  total_amount: number;
  customer_notes: string | null;
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

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      navigate("/products");
      return;
    }
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      // Fetch order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (orderError) throw orderError;
      setOrder(orderData);

      // Fetch order items
      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);

      if (itemsError) throw itemsError;
      setOrderItems(itemsData || []);
    } catch (error) {
      console.error("Error fetching order:", error);
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "cash_on_delivery":
        return "Ramburs (Cash la Livrare)";
      case "bank_transfer":
        return "Transfer Bancar";
      case "card_online":
        return "Plată Online cu Card";
      default:
        return method;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Cererea ta a fost primită!</h1>
            <p className="text-xl text-muted-foreground">
              Mulțumim — vom pregăti oferta și te vom contacta în curând.
            </p>
          </div>

          {/* Order Number */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Număr Cerere</p>
                <p className="text-3xl font-bold text-primary">{order.order_number}</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Detalii Cerere
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Products */}
              <div>
                <h3 className="font-semibold mb-3">Produse solicitate</h3>
                <div className="space-y-2">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-start border-b pb-2 last:border-0">
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-muted-foreground">{item.product_category}</p>
                        <p className="text-sm">
                          Cantitate: {item.quantity} x {item.unit_price.toFixed(2)} RON
                        </p>
                      </div>
                      <p className="font-semibold">{item.total_price.toFixed(2)} RON</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{order.subtotal.toFixed(2)} RON</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Livrare</span>
                  <span className="font-semibold">
                    {order.shipping_cost === 0 ? "GRATUIT" : `${order.shipping_cost.toFixed(2)} RON`}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-lg text-primary">{order.total_amount.toFixed(2)} RON</span>
                </div>
              </div>

              <Separator />

              {/* Shipping Address */}
              <div>
                <h3 className="font-semibold mb-2">Adresă (dacă este cazul)</h3>
                <p className="text-sm text-muted-foreground">
                  {order.shipping_address?.address || "-"}
                  <br />
                  {order.shipping_address?.city || ""}{order.shipping_address?.city ? ", " : ""}{order.shipping_address?.county || ""}
                  <br />
                  Cod Poștal: {order.shipping_address?.postalCode || "-"}
                </p>
              </div>

              <Separator />

              {/* Contact Info */}
              <div>
                <h3 className="font-semibold mb-2">Informații de Contact</h3>
                <p className="text-sm text-muted-foreground">
                  {order.customer_name}
                  <br />
                  Email: {order.customer_email}
                  <br />
                  Telefon: {order.customer_phone}
                </p>
              </div>

              <Separator />

              {/* Payment Method */}
              <div>
                <h3 className="font-semibold mb-2">Detalii procesare</h3>
                  <p className="text-sm text-muted-foreground">{order.payment_method ? getPaymentMethodLabel(order.payment_method) : "-"}</p>
              </div>

              {order.customer_notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Notițe</h3>
                    <p className="text-sm text-muted-foreground">{order.customer_notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mb-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Ce urmează?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Vom analiza cererea și pregătim o ofertă personalizată</li>
                <li>✓ Vei primi un email la {order.customer_email} cu detalii</li>
                <li>✓ Te vom contacta telefonic pentru detalii suplimentare</li>
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <Link to="/my-orders">
              <Button variant="outline" className="gap-2">
                <Package className="h-4 w-4" />
                Vezi Solicitările Mele
              </Button>
            </Link>
            <Link to="/products">
              <Button className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Vezi Produsele
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
