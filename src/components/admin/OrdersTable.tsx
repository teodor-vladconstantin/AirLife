import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { OrderDetailsDialog } from "./OrderDetailsDialog";
import { Loader2, Eye } from "lucide-react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: string;
  total_amount: number;
  created_at: string;
  tracking_number: string | null;
}

export const OrdersTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
    } else {
      setOrders(data || []);
    }

    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, newStatus: any) => {
    try {
      await supabase.from("orders").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", orderId);
      // refresh local list
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    } catch (e) {
      console.error("Error updating order status:", e);
    }
  };

  const statusTabs = [
    { value: "all", label: "Toate", count: orders.length },
    { value: "pending", label: "În așteptare", count: orders.filter(o => o.status === 'pending').length },
    { value: "confirmed", label: "Confirmate", count: orders.filter(o => o.status === 'confirmed').length },
    { value: "processing", label: "În procesare", count: orders.filter(o => o.status === 'processing').length },
    { value: "shipped", label: "Expediate", count: orders.filter(o => o.status === 'shipped').length },
    { value: "delivered", label: "Livrate", count: orders.filter(o => o.status === 'delivered').length },
  ];

  const displayOrders = selectedStatus === "all" ? orders : orders.filter((o) => o.status === selectedStatus);

  const getRowClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50/60 dark:bg-yellow-900/20";
      case "confirmed":
        return "bg-accent/60 dark:bg-primary/10";
      case "processing":
        return "bg-sky-50/60 dark:bg-sky-900/20";
      case "shipped":
        return "bg-indigo-50/60 dark:bg-indigo-900/20";
      case "delivered":
        return "bg-accent dark:bg-primary/20";
      case "cancelled":
        return "bg-rose-50/60 dark:bg-rose-900/20";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-bold">Solicitări</h2>
        <div className="text-sm text-muted-foreground">
          Total: {orders.length} solicitări
        </div>
      </div>

      <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
          {statusTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex-1">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedStatus} className="mt-6">
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : displayOrders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Nu există solicitări în această categorie
                </div>
              ) : (
                <>
                <div className="hidden lg:block">
                  <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Număr Cerere</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead className="text-right">Acțiuni</TableHead>
                        </TableRow>
                      </TableHeader>
                    <TableBody>
                      {displayOrders.map((order) => (
                        <TableRow key={order.id} className={`${getRowClass(order.status)} hover:bg-muted/50`}>
                          <TableCell className="font-medium">
                            {order.order_number}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.customer_name}</p>
                              <p className="break-all text-sm text-muted-foreground">
                                {order.customer_email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(order.created_at), "dd MMM yyyy, HH:mm", {
                              locale: ro,
                            })}
                          </TableCell>
                          <TableCell className="flex flex-wrap items-center gap-2">
                            <OrderStatusBadge status={order.status} />
                            <Select value={order.status} onValueChange={(v) => updateOrderStatus(order.id, v)}>
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
                          </TableCell>
                          <TableCell className="font-semibold">
                            {order.total_amount.toFixed(2)} RON
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedOrder(order.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Detalii
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="divide-y lg:hidden">
                  {displayOrders.map((order) => (
                    <div key={order.id} className={`${getRowClass(order.status)} space-y-3 p-4`}>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <p className="font-semibold">{order.order_number}</p>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <div className="min-w-0 text-sm">
                        <p className="break-words font-medium">{order.customer_name}</p>
                        <p className="break-all text-muted-foreground">{order.customer_email}</p>
                        <p className="text-muted-foreground">{format(new Date(order.created_at), "dd MMM yyyy, HH:mm", { locale: ro })}</p>
                      </div>
                      <p className="font-semibold">{order.total_amount.toFixed(2)} RON</p>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Select value={order.status} onValueChange={(v) => updateOrderStatus(order.id, v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">În așteptare</SelectItem>
                            <SelectItem value="confirmed">Confirmată</SelectItem>
                            <SelectItem value="processing">În procesare</SelectItem>
                            <SelectItem value="shipped">Expediată</SelectItem>
                            <SelectItem value="delivered">Livrată</SelectItem>
                            <SelectItem value="cancelled">Anulată</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" className="sm:shrink-0" onClick={() => setSelectedOrder(order.id)}>
                          <Eye className="mr-1 h-4 w-4" />
                          Detalii
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedOrder && (
        <OrderDetailsDialog
          orderId={selectedOrder}
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={fetchOrders}
        />
      )}
    </div>
  );
};
