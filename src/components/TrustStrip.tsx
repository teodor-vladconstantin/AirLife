import { MapPin, Truck, ShieldCheck, Lock } from "lucide-react";

// Icon row under the hero (the usual store pattern): short facts, no buttons, no boxes.
const items = [
  { icon: MapPin, title: "Buzău & Județ", text: "Montaj & igienizare" },
  { icon: Truck, title: "Livrare Rapidă", text: "Gratuit peste 1000 RON" },
  { icon: ShieldCheck, title: "Garanție Legală", text: "24 luni persoane fizice" },
  { icon: Lock, title: "Plată securizată", text: "Card online, prin Stripe" },
];

const TrustStrip = () => (
  <section aria-label="Avantaje" className="border-b border-border bg-background">
    <ul className="container mx-auto grid grid-cols-2 gap-x-4 gap-y-5 px-4 py-6 md:grid-cols-4 md:py-8">
      {items.map(({ icon: Icon, title, text }) => (
        <li key={title} className="flex items-start gap-3">
          <Icon className="mt-0.5 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-snug text-foreground">{title}</p>
            <p className="text-sm leading-snug text-muted-foreground">{text}</p>
          </div>
        </li>
      ))}
    </ul>
  </section>
);

export default TrustStrip;
