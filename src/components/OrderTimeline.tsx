import { Check } from "lucide-react";

export type TimelineOrder = {
  status: string;
  payment_status?: string;
  payment_method?: string;
  created_at: string;
  confirmed_at?: string | null;
  shipped_at?: string | null;
  delivered_at?: string | null;
  tracking_number?: string | null;
  courier?: string | null;
};

const FLOW = ["pending", "confirmed", "processing", "shipped", "delivered"];
const fmt = (d?: string | null) => (d ? new Date(d).toLocaleDateString("ro-RO", { day: "numeric", month: "short", year: "numeric" }) : "");

// Order progress: placed > confirmed/paid > preparing > shipped (with AWB) > delivered.
export function OrderTimeline({ o }: { o: TimelineOrder }) {
  if (o.status === "cancelled") return <p className="text-sm font-medium text-destructive">Comanda a fost anulată.</p>;
  const i = Math.max(0, FLOW.indexOf(o.status));
  const paid = o.payment_status === "paid";
  const steps = [
    { label: "Comandă plasată", at: o.created_at, done: true },
    { label: o.payment_method === "card_online" ? "Plată confirmată" : "Comandă confirmată", at: o.confirmed_at, done: paid || i >= 1 },
    { label: "În pregătire", at: null, done: i >= 2 },
    {
      label: "Expediată",
      at: o.shipped_at,
      done: i >= 3,
      extra: o.tracking_number || o.courier ? `${o.courier ?? "Curier"}${o.tracking_number ? `, AWB ${o.tracking_number}` : ""}` : "",
    },
    { label: "Livrată", at: o.delivered_at, done: i >= 4 },
  ];
  return (
    <ol className="space-y-3">
      {steps.map((s) => (
        <li key={s.label} className="flex gap-3">
          <span className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border ${s.done ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"}`}>
            {s.done && <Check className="h-3 w-3" />}
          </span>
          <div className={s.done ? "" : "text-muted-foreground"}>
            <p className="text-sm font-medium leading-5">{s.label}{s.at ? <span className="ml-2 font-normal text-muted-foreground">{fmt(s.at)}</span> : null}</p>
            {"extra" in s && s.extra ? <p className="text-sm text-muted-foreground">{s.extra}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
