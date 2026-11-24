"use client";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Link } from "@/lib/router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { ReviewData } from "@/lib/catalog";

export const Stars = ({ value, className = "h-4 w-4" }: { value: number; className?: string }) => (
  <span className="inline-flex" role="img" aria-label={`${value} din 5 stele`}>
    {[1, 2, 3, 4, 5].map((i) => <Star key={i} className={`${className} ${i <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />)}
  </span>
);

const ERR: Record<string, string> = {
  login_required: "Conectează-te ca să scrii o recenzie.",
  not_purchased: "Doar clienții care au cumpărat și plătit produsul pot lăsa o recenzie.",
  already_reviewed: "Ai trimis deja o recenzie pentru acest produs.",
};

export function ProductReviews({ productId, data }: { productId: string; data: ReviewData }) {
  const { toast } = useToast();
  const [elig, setElig] = useState<"loading" | "ok" | "login_required" | "not_purchased" | "already_reviewed">("loading");
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  // Automatic check: signed in + paid order with this product + no review yet.
  useEffect(() => {
    let live = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const n = session?.user.user_metadata?.full_name;
      if (typeof n === "string") setName(n);
      try {
        const res = await fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`, { headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {} });
        const out = await res.json().catch(() => ({}));
        if (live) setElig(["ok", "login_required", "not_purchased", "already_reviewed"].includes(out.state) ? out.state : "login_required");
      } catch { if (live) setElig("login_required"); }
    })();
    return () => { live = false; };
  }, [productId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) return toast({ title: "Alege un număr de stele", variant: "destructive" });
    setBusy(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) },
        body: JSON.stringify({ productId, rating, name, title: title || undefined, body: text }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) return toast({ title: ERR[out.error] ?? "Nu am putut trimite recenzia", description: out.error === "invalid_request" ? "Verifică numele și textul (minim 10 caractere)." : undefined, variant: "destructive" });
      setSent(true);
    } finally { setBusy(false); }
  };

  return (
    <section className="mb-12" aria-labelledby="reviews-h">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="reviews-h" className="text-xl font-bold text-foreground">Recenzii clienți</h2>
          {data.count > 0 ? (
            <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground"><Stars value={data.average} /> <strong className="text-foreground">{data.average.toFixed(1)}</strong> din 5 · {data.count} {data.count === 1 ? "recenzie" : "recenzii"}</p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">Încă nu sunt recenzii pentru acest produs.</p>
          )}
        </div>
        {elig === "ok" && !sent && !open && <Button variant="outline" onClick={() => setOpen(true)}>Scrie o recenzie</Button>}
      </div>

      {open && !sent && elig === "ok" && (

          <form onSubmit={submit} className="mb-6 space-y-4 rounded-xl border border-border bg-card p-5">
            <div>
              <Label>Nota ta *</Label>
              <div className="mt-1 flex gap-1" role="radiogroup" aria-label="Nota">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button key={i} type="button" role="radio" aria-checked={rating === i} aria-label={`${i} ${i === 1 ? "stea" : "stele"}`} onClick={() => setRating(i)} className="rounded p-1">
                    <Star className={`h-7 w-7 ${i <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label htmlFor="rv-name">Nume afișat *</Label><Input id="rv-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} required /></div>
              <div><Label htmlFor="rv-title">Titlu (opțional)</Label><Input id="rv-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} /></div>
            </div>
            <div><Label htmlFor="rv-text">Recenzia ta *</Label><Textarea id="rv-text" value={text} onChange={(e) => setText(e.target.value)} rows={4} minLength={10} maxLength={2000} required /></div>
            <div className="flex gap-2">
              <Button type="submit" disabled={busy}>{busy ? "Se trimite…" : "Trimite recenzia"}</Button>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Renunță</Button>
            </div>
            <p className="text-xs text-muted-foreground">Recenziile sunt acceptate doar de la clienții care au cumpărat produsul și apar după aprobare.</p>
          </form>
      )}
      {elig === "login_required" && <p className="mb-6 rounded-xl border border-border bg-card p-4 text-sm"><Link to="/auth" className="font-semibold text-primary underline">Conectează-te</Link> dacă ai cumpărat acest produs, ca să poți scrie o recenzie.</p>}
      {elig === "not_purchased" && <p className="mb-6 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">Recenziile pot fi scrise doar de clienții care au cumpărat și plătit acest produs.</p>}
      {elig === "already_reviewed" && !sent && <p className="mb-6 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">Ai trimis deja o recenzie pentru acest produs. Apare pe site după aprobare.</p>}
      {sent && <p className="mb-6 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm" role="status">Mulțumim! Recenzia ta va apărea după aprobare.</p>}

      <ul className="space-y-4">
        {data.reviews.map((r) => (
          <li key={r.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center gap-2"><Stars value={r.rating} /><span className="text-sm font-semibold">{r.author_name}</span>{r.verified_purchase && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">Achiziție verificată</span>}<span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString("ro-RO")}</span></div>
            {r.title && <p className="mt-2 font-semibold">{r.title}</p>}
            <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{r.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
