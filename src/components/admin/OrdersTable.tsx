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
import { ORDER_STATUSES } from "@/lib/orderStatus";
import { Download, Loader2, Eye } from "lucide-react";
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
  payment_status?: string;
  supplier_status?: string | null;
  shipping_address?: { address?: string; city?: string; county?: string; postalCode?: string } | null;
}

// Paid, not cancelled and not yet forwarded to the supplier (dropshipping to-do list).
const needsSupplier = (o: Order) => o.payment_status === "paid" && o.status !== "cancelled" && (o.supplier_status ?? "new") === "new";

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
      setOrders((data || []) as unknown as Order[]);
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
    { value: "supplier", label: "De trimis la furnizor", count: orders.filter(needsSupplier).length },
    ...ORDER_STATUSES.map((st) => ({ value: st.value as string, label: st.plural, count: orders.filter((o) => o.status === st.value).length })),
  ];

  const displayOrders = selectedStatus === "all" ? orders : selectedStatus === "supplier" ? orders.filter(needsSupplier) : orders.filter((o) => o.status === selectedStatus);

  const exportCsv = () => {
    const q = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = [["Comanda", "Data", "Status", "Plata", "Client", "Telefon", "Email", "Adresa", "Total", "Furnizor"].map(q).join(",")];
    for (const o of displayOrders) {
      const a = o.shipping_address;
      rows.push([o.order_number, o.created_at, o.status, o.payment_status ?? "", o.customer_name, o.customer_phone, o.customer_email, a ? `${a.address ?? ""}, ${a.city ?? ""}, ${a.county ?? ""} ${a.postalCode ?? ""}` : "", o.total_amount, o.supplier_status ?? "new"].map(q).join(","));
    }
    const url = URL.createObjectURL(new Blob(["\ufeff" + rows.join("\n")], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `comenzi-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Row tints use the brand palette only: the further along the order, the stronger the green.
  const getRowClass = (status: string) => {
    switch (status) {
      case "pending": return "bg-secondary/70";
      case "confirmed": return "bg-accent/50";
      case "processing": return "bg-accent";
      case "shipped": return "bg-primary/10";
      case "delivered": return "bg-primary/15";
      case "cancelled": return "bg-muted text-muted-foreground";
      default: return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-bold">Comenzi</h2>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          Total: {orders.length} comenzi
          <Button variant="outline" size="sm" onClick={exportCsv} disabled={!displayOrders.length}><Download className="mr-1 h-4 w-4" />Export CSV</Button>
        </div>
      </div>

      <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
          {statusTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex-1">
              {tab.label}{tab.count > 0 || tab.value === "all" ? ` (${tab.count})` : ""}
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
                  Nu există comenzi în această categorie
                </div>
              ) : (
                <>
                <div className="hidden lg:block">
                  <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Comandă</TableHead>
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
                                {ORDER_STATUSES.map((st) => <SelectItem key={st.value} value={st.value}>{st.label}</SelectItem>)}</SelectContent>
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
                            {ORDER_STATUSES.map((st) => <SelectItem key={st.value} value={st.value}>{st.label}</SelectItem>)}</SelectContent>
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
