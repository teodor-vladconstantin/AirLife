"use client";
import { trackEvent } from "@/lib/analytics";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { OrderTimeline, type TimelineOrder } from "@/components/OrderTimeline";

type Found = {
  order: TimelineOrder & { order_number: string; subtotal: number; shipping_cost: number; total_amount: number };
  items: { product_name: string; quantity: number; unit_price: number }[];
};
const ron = (n: number) => `${Number(n).toFixed(2)} RON`;

// Guest order tracking: order number + the email used at checkout.
export default function TrackOrder({ initialOrder = "" }: { initialOrder?: string }) {
  const [num, setNum] = useState(initialOrder);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [found, setFound] = useState<Found | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(""); setFound(null);
    try {
      const r = await fetch("/api/order-lookup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderNumber: num, email }) });
      if (r.status === 429) setErr("Prea multe încercări. Încearcă din nou peste câteva minute.");
      else if (!r.ok) setErr("Nu am găsit comanda. Verifică numărul comenzii și emailul folosit la plasare.");
      else { setFound(await r.json()); trackEvent("order_lookup"); }
    } catch {
      setErr("Nu am putut verifica acum. Încearcă din nou.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4 py-12 max-w-xl space-y-6">
          <h1 className="text-3xl font-bold tracking-tight text-center">Urmărește comanda</h1>
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={submit} className="space-y-4">
                <div><Label htmlFor="t_num">Număr comandă</Label><Input id="t_num" value={num} onChange={(e) => setNum(e.target.value)} placeholder="AL000123" required /></div>
                <div><Label htmlFor="t_email">Email folosit la comandă</Label><Input id="t_email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                {err && <p className="text-sm text-destructive">{err}</p>}
                <Button type="submit" className="w-full" disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Vezi statusul"}</Button>
              </form>
            </CardContent>
          </Card>

          {found && (
            <Card>
              <CardHeader><CardTitle>Comanda {found.order.order_number}</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <OrderTimeline o={found.order} />
                <div className="border-t pt-4 space-y-1 text-sm">
                  {found.items.map((i, k) => (
                    <div key={k} className="flex justify-between"><span>{i.quantity} x {i.product_name}</span><span>{ron(i.unit_price * i.quantity)}</span></div>
                  ))}
                  <div className="flex justify-between text-muted-foreground"><span>Livrare</span><span>{found.order.shipping_cost > 0 ? ron(found.order.shipping_cost) : "Gratuită"}</span></div>
                  <div className="flex justify-between font-bold"><span>Total</span><span>{ron(found.order.total_amount)}</span></div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
