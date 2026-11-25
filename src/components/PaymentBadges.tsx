import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

// Card brands confirmed for this shop: Checkout Session without payment_method_types (src/app/api/checkout/route.ts)
// + Stripe account "Default" configuration. Visa and Mastercard are accepted out of the box; Maestro is not on
// Stripe's supported-brand list, and Apple Pay / Google Pay are intentionally not shown here.
// One-colour marks (currentColor) so they sit in the green/neutral palette; all tiles share the same 24px height.
const tile = "inline-flex h-6 w-10 items-center justify-center rounded border border-border bg-white text-foreground/70";

const Visa = () => (
  <span className={tile} role="img" aria-label="Visa">
    <svg viewBox="0 0 40 24" className="h-full w-full" aria-hidden="true">
      <text x="20" y="16.5" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontSize="11.5" fontWeight="900" fontStyle="italic" letterSpacing="-0.3" fill="currentColor">VISA</text>
    </svg>
  </span>
);

const Mastercard = () => (
  <span className={tile} role="img" aria-label="Mastercard">
    <svg viewBox="0 0 40 24" className="h-full w-full" aria-hidden="true">
      <circle cx="15.5" cy="12" r="6" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="24.5" cy="12" r="6" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  </span>
);

export function PaymentBadges({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-2 text-sm", dark ? "text-background/80" : "text-muted-foreground", className)}>
      <span className="inline-flex items-center gap-1.5">
        <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
        Plată securizată prin Stripe
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Visa />
        <Mastercard />
      </span>
    </div>
  );
}

export default PaymentBadges;
