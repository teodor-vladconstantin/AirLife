"use client";
import { useEffect, useState } from "react";
import { Send, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type Pick = { id: string; name: string; slug: string | null; brand: string | null };
const EMPTY = { subject: "", preheader: "", headline: "", body: "", ctaLabel: "", ctaPath: "" };

export function NewsletterManager() {
  const { toast } = useToast();
  const [f, setF] = useState(EMPTY);
  const [picked, setPicked] = useState<Pick[]>([]);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Pick[]>([]);
  const [html, setHtml] = useState("");
  const [recipients, setRecipients] = useState<number | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const call = async (action: "preview" | "count" | "test" | "send") => {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/admin/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token ?? ""}` },
      body: JSON.stringify({ action, ...f, ctaLabel: f.ctaLabel || undefined, ctaPath: f.ctaPath || undefined, productIds: picked.map((p) => p.id) }),
    });
    return { ok: res.ok, out: await res.json().catch(() => ({})) };
  };

  useEffect(() => { void call("count").then(({ out }) => setRecipients(out.recipients ?? null)); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const term = q.trim().replace(/[,()%*\\]/g, " ");
    if (term.length < 2) { setHits([]); return; }
    const t = setTimeout(async () => {
      const { data } = await supabase.from("products").select("id,name,slug,brand").not("slug", "is", null).eq("hidden", false).ilike("name", `%${term.split(/\s+/).join("%")}%`).limit(8);
      setHits((data ?? []) as Pick[]);
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  const valid = f.subject.trim().length >= 3 && f.headline.trim().length >= 3 && f.body.trim().length > 0 && (!f.ctaLabel || f.ctaPath.startsWith("/"));
  const run = async (action: "preview" | "test" | "send") => {
    if (!valid) return toast({ title: "Completează subiectul, titlul și textul", description: "Butonul are nevoie de etichetă și de o cale care începe cu /, de exemplu /produse.", variant: "destructive" });
    if (action === "send" && !window.confirm(`Trimiți campania la ${recipients ?? "toți"} abonați activi? Nu se poate anula.`)) return;
    setBusy(action);
    try {
      const { ok, out } = await call(action);
      if (!ok) return toast({ title: "Nu a mers", description: out.error === "forbidden" ? "Nu ești admin." : out.error === "no_recipients" ? "Nu există abonați activi." : "Verifică câmpurile.", variant: "destructive" });
      if (action === "preview") setHtml(out.html);
      else toast({ title: action === "test" ? "Test trimis la adresa ta" : "Campanie trimisă", description: `Trimise: ${out.sent}${out.failed ? `, eșuate: ${out.failed}` : ""}` });
    } finally { setBusy(null); }
  };

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Campanie email</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label htmlFor="nl-subject">Subiect *</Label><Input id="nl-subject" value={f.subject} onChange={set("subject")} maxLength={150} /></div>
          <div><Label htmlFor="nl-pre">Previzualizare în inbox</Label><Input id="nl-pre" value={f.preheader} onChange={set("preheader")} maxLength={200} /></div>
          <div><Label htmlFor="nl-head">Titlu în email *</Label><Input id="nl-head" value={f.headline} onChange={set("headline")} maxLength={150} /></div>
          <div><Label htmlFor="nl-body">Text * <span className="text-xs text-muted-foreground">(paragrafe separate printr-un rând gol)</span></Label><Textarea id="nl-body" rows={7} value={f.body} onChange={set("body")} maxLength={5000} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label htmlFor="nl-cta">Text buton</Label><Input id="nl-cta" value={f.ctaLabel} onChange={set("ctaLabel")} placeholder="Vezi ofertele" maxLength={60} /></div>
            <div><Label htmlFor="nl-path">Cale buton</Label><Input id="nl-path" value={f.ctaPath} onChange={set("ctaPath")} placeholder="/produse?oferta=1" /></div>
          </div>

          <div>
            <Label htmlFor="nl-find">Produse în email (max. 6)</Label>
            <Input id="nl-find" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Caută un produs…" disabled={picked.length >= 6} />
            {hits.length > 0 && (
              <ul className="mt-1 divide-y rounded-md border bg-popover text-sm">
                {hits.filter((h) => !picked.some((p) => p.id === h.id)).map((h) => (
                  <li key={h.id}><button type="button" className="w-full px-3 py-2 text-left hover:bg-secondary" onClick={() => { setPicked([...picked, h]); setQ(""); setHits([]); }}>{h.name}</button></li>
                ))}
              </ul>
            )}
            <ul className="mt-2 flex flex-wrap gap-2">
              {picked.map((p) => (
                <li key={p.id} className="flex max-w-full items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs"><span className="truncate">{p.name}</span><button type="button" aria-label={`Scoate ${p.name}`} onClick={() => setPicked(picked.filter((x) => x.id !== p.id))}><X className="h-3 w-3" /></button></li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => run("preview")} disabled={!!busy}>{busy === "preview" ? "…" : "Previzualizează"}</Button>
            <Button variant="outline" onClick={() => run("test")} disabled={!!busy}>{busy === "test" ? "Se trimite…" : "Trimite test la mine"}</Button>
            <Button onClick={() => run("send")} disabled={!!busy || !html}><Send className="mr-2 h-4 w-4" />{busy === "send" ? "Se trimite…" : `Trimite la ${recipients ?? "…"} abonați`}</Button>
          </div>
          <p className="text-xs text-muted-foreground">Trimiterea e activă după ce ai previzualizat emailul. Mailul pleacă doar abonaților cu confirmare activă și are link de dezabonare.</p>
        </CardContent>
      </Card>

      <Card className="lg:sticky lg:top-24 lg:self-start">
        <CardHeader><CardTitle>Previzualizare</CardTitle></CardHeader>
        <CardContent>
          {html ? <iframe title="Previzualizare email" srcDoc={html} sandbox="" className="h-[640px] w-full rounded-md border bg-white" /> : <p className="text-sm text-muted-foreground">Apasă „Previzualizează” ca să vezi emailul.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
