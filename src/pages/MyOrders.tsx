import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Package, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_method: string;
  total_amount: number;
  created_at: string;
  tracking_number: string | null;
}

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<{ [key: string]: OrderItem[] }>({});
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUserAndFetchOrders();
  }, []);

  const checkUserAndFetchOrders = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      navigate("/auth");
      return;
    }

    setUser(user);
    await fetchOrders(user.id);
  };

  const fetchOrders = async (userId: string) => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

      // Fetch items for all orders
      if (ordersData && ordersData.length > 0) {
        const orderIds = ordersData.map((o) => o.id);
        const { data: itemsData, error: itemsError } = await supabase
          .from("order_items")
          .select("*")
          .in("order_id", orderIds);

        if (itemsError) throw itemsError;

        // Group items by order_id
        const itemsByOrder: { [key: string]: OrderItem[] } = {};
        itemsData?.forEach((item: any) => {
          if (!itemsByOrder[item.order_id]) {
            itemsByOrder[item.order_id] = [];
          }
          itemsByOrder[item.order_id].push(item);
        });

        setOrderItems(itemsByOrder);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderExpand = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "pending":
        return "secondary";
      case "confirmed":
      case "processing":
        return "default";
      case "shipped":
      case "delivered":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "În așteptare";
      case "confirmed":
        return "Confirmată";
      case "processing":
        return "În procesare";
      case "shipped":
        return "Expediată";
      case "delivered":
        return "Livrată";
      case "cancelled":
        return "Anulată";
      default:
        return status;
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Comenzile Mele</h1>
            <p className="text-muted-foreground">Vezi istoricul comenzilor tale</p>
          </div>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nu ai comenzi încă</h3>
                <p className="text-muted-foreground mb-6">Explorează produsele noastre și plasează prima comandă!</p>
                <Button onClick={() => navigate("/products")}>Vezi Produsele</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const isExpanded = expandedOrders.has(order.id);
                const items = orderItems[order.id] || [];

                return (
                  <Card key={order.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg">{order.order_number}</h3>
                            <Badge variant={getStatusBadgeVariant(order.status)}>
                              {getStatusLabel(order.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(order.created_at), "d MMMM yyyy, HH:mm", { locale: ro })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-primary">{order.total_amount.toFixed(2)} RON</p>
                          <p className="text-sm text-muted-foreground">{getPaymentMethodLabel(order.payment_method)}</p>
                        </div>
                      </div>

                      {/* Tracking Number */}
                      {order.tracking_number && (
                        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                          <p className="text-sm">
                            <span className="font-semibold">Număr de urmărire:</span> {order.tracking_number}
                          </p>
                        </div>
                      )}

                      {/* Quick summary */}
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground">
                          {items.length} {items.length === 1 ? "produs" : "produse"}
                        </p>
                      </div>

                      {/* Expand button */}
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => toggleOrderExpand(order.id)}
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="mr-2 h-4 w-4" />
                            Ascunde detaliile
                          </>
                        ) : (
                          <>
                            <ChevronDown className="mr-2 h-4 w-4" />
                            Vezi detaliile
                          </>
                        )}
                      </Button>

                      {/* Expanded details */}
                      {isExpanded && (
                        <>
                          <Separator className="my-4" />
                          <div className="space-y-3">
                            <h4 className="font-semibold">Produse comandate:</h4>
                            {items.map((item) => (
                              <div key={item.id} className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{item.product_name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Cantitate: {item.quantity} x {item.unit_price.toFixed(2)} RON
                                  </p>
                                </div>
                                <p className="font-semibold">{item.total_price.toFixed(2)} RON</p>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyOrders;
