"use client";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTurnstile } from "@/components/Turnstile";
import { useToast } from "@/hooks/use-toast";

// "Anunță-mă când revine în stoc" (out of stock) / "Anunță-mă dacă scade prețul" (in stock).
export function StockAlertForm({ productId, kind }: { productId: string; kind: "back_in_stock" | "price_drop" }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(kind === "back_in_stock");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [tsToken, tsWidget, tsReset, tsOn] = useTurnstile();
  const label = kind === "back_in_stock" ? "Anunță-mă când revine în stoc" : "Anunță-mă dacă scade prețul";

  useEffect(() => { supabase.auth.getSession().then(({ data: { session } }) => { if (session?.user.email) setEmail(session.user.email); }); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tsOn && !tsToken) return toast({ title: "Confirmă că ești om", description: "Așteaptă verificarea și încearcă din nou.", variant: "destructive" });
    setBusy(true);
    try {
      const res = await fetch("/api/alerts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId, email, kind, token: tsToken }) });
      const out = await res.json().catch(() => ({}));
      if (res.ok) setDone(true);
      else toast({ title: out.error === "already_in_stock" ? "Produsul este deja în stoc" : "Nu am putut salva alerta", description: out.error === "invalid_request" ? "Verifică adresa de email." : undefined, variant: "destructive" });
    } finally { setBusy(false); tsReset(); }
  };

  if (done) return <p className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm" role="status">Gata! Îți scriem o singură dată, la {email}, {kind === "back_in_stock" ? "când produsul revine în stoc" : "dacă prețul scade"}.</p>;
  if (!open) return <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-2 py-1 text-sm font-medium text-primary hover:underline"><Bell className="h-4 w-4" />{label}</button>;
  return (
    <form onSubmit={submit} className="space-y-2 rounded-lg border border-border bg-card p-3">
      <p className="flex items-center gap-2 text-sm font-semibold"><Bell className="h-4 w-4 text-primary" />{label}</p>
      <div className="flex gap-2">
        <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="adresa@email.ro" aria-label="Email pentru alertă" autoComplete="email" />
        <Button type="submit" disabled={busy}>{busy ? "…" : "Anunță-mă"}</Button>
      </div>
      {tsWidget}
      <p className="text-xs text-muted-foreground">Primești un singur email, apoi alerta se închide. Te poți dezabona oricând.</p>
    </form>
  );
}
