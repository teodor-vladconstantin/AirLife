"use client";
import { trackEvent } from "@/lib/analytics";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CONSENT_TEXT } from "@/lib/email/consent";
import { useTurnstile } from "@/components/Turnstile";

// Double opt-in: this only asks for the email. The subscriber becomes "active" after clicking the link we send.
export default function SubscribeForm({ source, dark = false }: { source: string; dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [tsToken, tsWidget, tsReset, tsOn] = useTurnstile();
  const muted = dark ? "text-background/70" : "text-muted-foreground";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tsOn && !tsToken) return setState("error");
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, website, source, captcha: tsToken }),
      });
      setState(res.ok ? "done" : "error");
      if (res.ok) trackEvent("newsletter_signup", { source });
      if (!res.ok) tsReset();
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className="flex items-start gap-3 text-sm">
        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p>Gata, ești abonat! Din acum primești ofertele și sfaturile AirLife. Te poți dezabona oricând dintr-un link din fiecare email.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          required
          placeholder="adresa@ta.ro"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Adresa de email"
          className={dark ? "bg-background text-foreground" : undefined}
        />
        <Button type="submit" disabled={state === "loading" || !consent}>
          {state === "loading" ? "Se trimite..." : "Abonează-mă"}
        </Button>
      </div>
      {tsWidget}
      <label className={`flex items-start gap-2 text-xs ${muted}`}>
        <Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)} className="mt-0.5" />
        <span>
          {CONSENT_TEXT}{" "}
          <a href="/politica-de-confidentialitate" className="underline">
            Politica de confidențialitate
          </a>
        </span>
      </label>
      <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} className="hidden" aria-hidden="true" name="website" />
      {state === "error" && <p className="text-xs text-destructive">Nu am putut trimite emailul. Verifică adresa și încearcă din nou.</p>}
    </form>
  );
}
