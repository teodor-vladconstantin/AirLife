"use client";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@/lib/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Check, ChevronLeft, CreditCard, Loader2 } from "lucide-react";
import { newId, readProfile, saveProfile, withDefault, type SavedAddress } from "@/lib/account";
import { useTurnstile } from "@/components/Turnstile";
import { trackBeginCheckout, trackError } from "@/lib/analytics";

// Validation schema
// Online payments are off until NEXT_PUBLIC_PAYMENTS=on (needs the Stripe keys, see docs/stripe.md). Off = the old quote flow.
// Online store is on by default. Set NEXT_PUBLIC_PAYMENTS=off to switch it off (checkout then sends visitors to /contact).
const PAYMENTS_ON = process.env.NEXT_PUBLIC_PAYMENTS !== "off";

const checkoutSchema = z.object({
  customerName: z.string().min(3, "Numele trebuie să aibă cel puțin 3 caractere"),
  customerEmail: z.string().email("Email invalid"),
  customerPhone: z.string().min(10, "Telefon invalid"),
  county: z.string().min(2, "Județul este obligatoriu"),
  city: z.string().min(2, "Orașul este obligatoriu"),
  address: z.string().min(5, "Adresa este obligatorie"),
  postalCode: z.string().min(5, "Cod poștal invalid"),
  paymentMethod: z.enum(["card_online"]), // card only (Stripe); cash on delivery was removed, bank transfer stays off
  customerNotes: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, "Trebuie să accep ți termenii și condițiile"),
  acceptGDPR: z.boolean().refine((val) => val === true, "Trebuie să accepți politica GDPR"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const STEPS = ["Contact", "Livrare", "Plată"];
const STEP_FIELDS: (keyof CheckoutFormData)[][] = [["customerName", "customerEmail", "customerPhone"], ["county", "city", "address", "postalCode"]];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [saved, setSaved] = useState<SavedAddress[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [saveAddr, setSaveAddr] = useState(false);
  const [tsToken, tsWidget, tsReset, tsOn] = useTurnstile();
  const beganRef = useRef(false);
  useEffect(() => {
    if (!PAYMENTS_ON || beganRef.current || items.length === 0) return;
    beganRef.current = true;
    trackBeginCheckout(items.map((i) => ({ item_id: i.product_id, item_name: i.name, price: i.price, quantity: i.quantity, item_category: i.category })), total);
  }, [items, total]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "card_online",
      acceptTerms: false,
      acceptGDPR: false,
    },
  });

  const acceptTerms = watch("acceptTerms");
  const acceptGDPR = watch("acceptGDPR");

  useEffect(() => {
    checkUser();
    // Kill switch: NEXT_PUBLIC_PAYMENTS=off sends visitors away from checkout
    if (!PAYMENTS_ON) navigate("/contact");
  }, [items, navigate]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      setValue("customerEmail", user.email || "");
      const prof = readProfile(user);
      if (prof.name) setValue("customerName", prof.name);
      if (prof.phone) setValue("customerPhone", prof.phone);
      setSaved(prof.addresses);
      const def = prof.addresses.find((a) => a.isDefault) ?? prof.addresses[0];
      if (def) pickAddress(def);
    }
  };

  const pickAddress = (a: SavedAddress) => {
    setPicked(a.id);
    setValue("county", a.county);
    setValue("city", a.city);
    setValue("address", a.address);
    setValue("postalCode", a.postalCode);
  };

  // validates only the fields of the current step before moving on
  const next = async () => {
    if (await trigger(STEP_FIELDS[step - 1])) {
      setStep((s) => Math.min(3, s + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const shippingCost = total >= 1000 ? 0 : 20;
  const [codeInput, setCodeInput] = useState("");
  const [applied, setApplied] = useState<{ code: string; amount: number } | null>(null);
  const [codeBusy, setCodeBusy] = useState(false);
  const discount = applied?.amount ?? 0;
  const grandTotal = Math.round((total - discount + shippingCost) * 100) / 100;

  const DISCOUNT_MSG: Record<string, string> = {
    not_found: "Codul nu există.", inactive: "Codul nu mai este activ.", not_started: "Codul nu este încă valabil.", expired: "Codul a expirat.",
    used_up: "Codul a fost folosit de prea multe ori.", min_order: "Comanda nu atinge valoarea minimă pentru acest cod.",
  };
  const applyCode = async () => {
    if (!codeInput.trim()) return;
    setCodeBusy(true);
    try {
      const res = await fetch("/api/discount", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: codeInput, items: items.map((i) => ({ id: i.product_id, quantity: i.quantity })) }) });
      const out = await res.json().catch(() => ({}));
      if (out.ok) { setApplied({ code: out.code, amount: out.amount }); toast({ title: "Cod aplicat", description: `Reducere: ${out.amount.toFixed(2)} RON` }); }
      else toast({ title: "Cod invalid", description: out.reason === "min_order" && out.min ? `Comandă minimă: ${Number(out.min).toFixed(2)} RON.` : DISCOUNT_MSG[out.reason] ?? "Nu am putut verifica codul.", variant: "destructive" });
    } finally { setCodeBusy(false); }
  };

  // Payments on: the server reads prices from the database, creates the order and (for cards) the Stripe Checkout session.
  const submitToServer = async (data: CheckoutFormData) => {
    if (tsOn && !tsToken) { trackError("turnstile_missing"); toast({ title: "Confirmă că ești om", description: "Așteaptă verificarea și încearcă din nou.", variant: "destructive" }); return; }
    setIsSubmitting(true);
    try {
      // new address typed by a signed-in customer who ticked "save": keep it in the account (best effort)
      if (user && saveAddr && !picked) {
        try {
          const prof = readProfile(user);
          const id = newId();
          const list = [...prof.addresses, { id, label: `Adresa ${prof.addresses.length + 1}`, name: data.customerName, phone: data.customerPhone, county: data.county, city: data.city, address: data.address, postalCode: data.postalCode }];
          await saveProfile({ ...prof, name: prof.name || data.customerName, phone: prof.phone || data.customerPhone, addresses: prof.addresses.length ? list : withDefault(list, id) });
        } catch { /* the order matters more than the saved address */ }
      }
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.product_id, quantity: i.quantity })),
          customer: { name: data.customerName, email: data.customerEmail, phone: data.customerPhone },
          address: { county: data.county, city: data.city, address: data.address, postalCode: data.postalCode },
          paymentMethod: data.paymentMethod,
          notes: data.customerNotes,
          token: tsToken,
          discountCode: applied?.code,
        }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = out.error === "invalid_discount" ? (DISCOUNT_MSG[out.reason] ?? "Codul de reducere nu mai este valabil.") : out.error === "out_of_stock" ? `${out.name} nu mai are stoc suficient.` : out.error === "product_unavailable" ? "Un produs din coș nu mai este disponibil." : "Nu am putut plasa comanda. Încearcă din nou sau sună-ne.";
        trackError(String(out.error || `http_${res.status}`));
        toast({ title: "Eroare", description: msg, variant: "destructive" });
        return;
      }
      try { sessionStorage.setItem("airlife_purchase", JSON.stringify({ items: items.map((i) => ({ item_id: i.product_id, item_name: i.name, price: i.price, quantity: i.quantity, item_category: i.category })), value: grandTotal, shipping: shippingCost })); } catch { /* storage blocked */ }
      if (out.url) { window.location.assign(out.url); return; }
      await clearCart();
      window.location.assign(out.redirect);
    } finally {
      setIsSubmitting(false);
      tsReset();
    }
  };

  // Every order is paid by card through Stripe (server side: /api/checkout). With NEXT_PUBLIC_PAYMENTS=off the shop sends visitors to /contact.
  const onSubmit = async (data: CheckoutFormData) => {
    if (!PAYMENTS_ON) return navigate("/contact");
    return submitToServer(data);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-secondary/30 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-title mb-6 text-center md:mb-8">Finalizează comanda</h1>

          <ol className="mx-auto mb-8 flex max-w-xl items-center" aria-label="Pașii comenzii">
            {STEPS.map((label, i) => {
              const n = i + 1;
              const done = step > n;
              return (
                <li key={label} className="flex flex-1 items-center last:flex-none" aria-current={step === n ? "step" : undefined}>
                  <button
                    type="button"
                    disabled={!done}
                    onClick={() => setStep(n)}
                    className="flex items-center gap-2 text-sm disabled:cursor-default"
                  >
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold ${done ? "border-primary bg-primary text-primary-foreground" : step === n ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>
                      {done ? <Check className="h-4 w-4" /> : n}
                    </span>
                    <span className={`hidden sm:inline ${step === n ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{label}</span>
                  </button>
                  {n < STEPS.length && <span className={`mx-3 h-px flex-1 ${done ? "bg-primary" : "bg-border"}`} aria-hidden />}
                </li>
              );
            })}
          </ol>

          <form onSubmit={(e) => { if (step < 3) { e.preventDefault(); void next(); } else void handleSubmit(onSubmit)(e); }} noValidate>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="min-w-0 space-y-6 lg:col-span-2">
                {step === 1 && (
                  <Card>
                    <CardHeader className="p-5 sm:p-8"><CardTitle>1. Informații de contact</CardTitle></CardHeader>
                    <CardContent className="space-y-4 p-5 pt-0 sm:p-8 sm:pt-0">
                      {!user && (
                        <p className="rounded-lg bg-secondary p-3 text-sm text-muted-foreground">
                          Ai deja cont? <Link to="/auth" className="font-semibold text-primary underline">Conectează-te</Link> ca să folosești adresele salvate. Poți comanda și fără cont.
                        </p>
                      )}
                      <div>
                        <Label htmlFor="customerName">Nume complet *</Label>
                        <Input id="customerName" autoComplete="name" {...register("customerName")} placeholder="Ex: Ion Popescu" />
                        {errors.customerName && <p className="text-sm text-destructive mt-1">{errors.customerName.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="customerEmail">Email *</Label>
                        <Input id="customerEmail" type="email" autoComplete="email" {...register("customerEmail")} placeholder="exemplu@email.com" />
                        {errors.customerEmail && <p className="text-sm text-destructive mt-1">{errors.customerEmail.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="customerPhone">Telefon *</Label>
                        <Input id="customerPhone" type="tel" autoComplete="tel" {...register("customerPhone")} placeholder="07xxxxxxxx" />
                        {errors.customerPhone && <p className="text-sm text-destructive mt-1">{errors.customerPhone.message}</p>}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {step === 2 && (
                  <Card>
                    <CardHeader className="p-5 sm:p-8"><CardTitle>2. Adresă de livrare</CardTitle></CardHeader>
                    <CardContent className="space-y-4 p-5 pt-0 sm:p-8 sm:pt-0">
                      {saved.length > 0 && (
                        <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label="Adrese salvate">
                          {saved.map((a) => (
                            <button key={a.id} type="button" onClick={() => pickAddress(a)} className={`rounded-lg border p-3 text-left text-sm hover:border-primary ${picked === a.id ? "border-primary bg-primary/5" : "border-border"}`}>
                              <span className="block font-semibold">{a.label}{a.isDefault ? " · implicită" : ""}</span>
                              <span className="block text-muted-foreground">{a.address}, {a.city}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="county">Județ *</Label>
                          <Input id="county" autoComplete="address-level1" {...register("county")} placeholder="Ex: Buzău" />
                          {errors.county && <p className="text-sm text-destructive mt-1">{errors.county.message}</p>}
                        </div>
                        <div>
                          <Label htmlFor="city">Oraș *</Label>
                          <Input id="city" autoComplete="address-level2" {...register("city")} placeholder="Ex: Buzău" />
                          {errors.city && <p className="text-sm text-destructive mt-1">{errors.city.message}</p>}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="address">Adresă (stradă, număr, bloc, apartament) *</Label>
                        <Input id="address" autoComplete="street-address" {...register("address")} placeholder="Ex: Str. Exemplu, Nr. 10, Bl. A, Ap. 5" />
                        {errors.address && <p className="text-sm text-destructive mt-1">{errors.address.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Cod poștal *</Label>
                        <Input id="postalCode" autoComplete="postal-code" {...register("postalCode")} placeholder="Ex: 120000" />
                        {errors.postalCode && <p className="text-sm text-destructive mt-1">{errors.postalCode.message}</p>}
                      </div>
                      {user && !picked && (
                        <div className="flex items-center gap-2">
                          <Checkbox id="saveAddr" checked={saveAddr} onCheckedChange={(c) => setSaveAddr(c === true)} />
                          <Label htmlFor="saveAddr" className="cursor-pointer text-sm">Salvează această adresă în contul meu</Label>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {step === 3 && (
                  <>
                    <Card>
                      <CardHeader className="p-5 sm:p-8"><CardTitle>3. Verifică și plătește</CardTitle></CardHeader>
                      <CardContent className="space-y-4 p-5 pt-0 text-sm sm:p-8 sm:pt-0">
                        <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-3">
                          <div><p className="font-semibold">Contact</p><p>{watch("customerName")}</p><p className="text-muted-foreground">{watch("customerEmail")} · {watch("customerPhone")}</p></div>
                          <button type="button" className="shrink-0 font-medium text-primary hover:underline" onClick={() => setStep(1)}>Modifică</button>
                        </div>
                        <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-3">
                          <div><p className="font-semibold">Livrare</p><p className="text-muted-foreground">{watch("address")}, {watch("city")}, {watch("county")}, {watch("postalCode")}</p><p className="text-muted-foreground">24-48h lucrătoare</p></div>
                          <button type="button" className="shrink-0 font-medium text-primary hover:underline" onClick={() => setStep(2)}>Modifică</button>
                        </div>
                        <div className="flex items-start gap-3 rounded-lg border border-primary/40 bg-primary/5 p-4">
                          <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                          <div>
                            <div className="font-semibold">Card online</div>
                            <p className="text-muted-foreground">Plătești securizat prin Stripe (Visa, Mastercard și alte metode afișate la plată). Nu stocăm datele cardului. Comanda se pregătește după confirmarea plății.</p>
                          </div>
                        </div>
                        {errors.paymentMethod && <p className="text-sm text-destructive">{errors.paymentMethod.message}</p>}
                        <div>
                          <Label htmlFor="customerNotes">Notițe comandă (opțional)</Label>
                          <Textarea id="customerNotes" {...register("customerNotes")} placeholder="Observații pentru curier sau pentru comandă" rows={3} />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="space-y-4 p-5 sm:p-8">
                        <div className="flex items-start space-x-2">
                          <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(checked) => setValue("acceptTerms", checked === true, { shouldValidate: true })} />
                          <Label htmlFor="terms" className="text-sm cursor-pointer">
                            Accept <a href="/terms" target="_blank" className="text-primary underline">Termenii și Condițiile</a> *
                          </Label>
                        </div>
                        {errors.acceptTerms && <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>}
                        <div className="flex items-start space-x-2">
                          <Checkbox id="gdpr" checked={acceptGDPR} onCheckedChange={(checked) => setValue("acceptGDPR", checked === true, { shouldValidate: true })} />
                          <Label htmlFor="gdpr" className="text-sm cursor-pointer">
                            Accept <a href="/privacy" target="_blank" className="text-primary underline">Politica de Confidențialitate</a> și procesarea datelor personale *
                          </Label>
                        </div>
                        {errors.acceptGDPR && <p className="text-sm text-destructive">{errors.acceptGDPR.message}</p>}
                      </CardContent>
                    </Card>
                  </>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  {step > 1 ? <Button type="button" variant="ghost" onClick={() => setStep(step - 1)}><ChevronLeft className="mr-1 h-4 w-4" /> Înapoi</Button> : <Link to="/produse"><Button type="button" variant="ghost"><ChevronLeft className="mr-1 h-4 w-4" /> Înapoi la magazin</Button></Link>}
                  {step < 3 ? (
                    <Button type="submit" size="lg">Continuă</Button>
                  ) : (
                    <div className="flex flex-col items-end gap-2">
                      {tsWidget}
                      <Button type="submit" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Se procesează...</>) : `Plătește ${grandTotal.toFixed(2)} RON`}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Order summary */}
              <div className="min-w-0 lg:col-span-1">
                <Card className="lg:sticky lg:top-24">
                  <CardHeader className="p-5 sm:p-8"><CardTitle>Sumar comandă</CardTitle></CardHeader>
                  <CardContent className="space-y-4 p-5 pt-0 sm:p-8 sm:pt-0">
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-start gap-3 text-sm">
                          {item.image_url && <img src={item.image_url} alt="" width={48} height={48} className="h-12 w-12 shrink-0 rounded border bg-white object-contain" />}
                          <span className="min-w-0 flex-1 line-clamp-2">{item.name} <span className="text-muted-foreground">× {item.quantity}</span></span>
                          <span className="shrink-0 font-semibold">{(item.price * item.quantity).toFixed(2)} RON</span>
                        </div>
                      ))}
                    </div>
                    <Separator />
                    {!applied && (
                      <div className="flex gap-2">
                        <Input value={codeInput} onChange={(e) => setCodeInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void applyCode(); } }} placeholder="Cod de reducere" aria-label="Cod de reducere" className="uppercase" />
                        <Button type="button" variant="outline" onClick={applyCode} disabled={codeBusy || !codeInput.trim()}>{codeBusy ? "…" : "Aplică"}</Button>
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">{total.toFixed(2)} RON</span></div>
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Livrare</span><span className="font-semibold">{shippingCost === 0 ? "GRATUIT" : `${shippingCost.toFixed(2)} RON`}</span></div>
                      {applied && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Reducere ({applied.code}) <button type="button" className="ml-1 text-xs text-primary hover:underline" onClick={() => { setApplied(null); setCodeInput(""); }}>șterge</button></span><span className="font-semibold text-primary">−{discount.toFixed(2)} RON</span></div>}
                      {total < 1000 && <p className="text-xs text-muted-foreground">Mai adaugă {(1000 - total).toFixed(2)} RON pentru livrare gratuită!</p>}
                    </div>
                    <Separator />
                    <div className="flex justify-between"><span className="font-bold text-lg">Total</span><span className="font-bold text-lg text-primary">{grandTotal.toFixed(2)} RON</span></div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
