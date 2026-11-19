import { Heading, Hr, Text } from "@react-email/components";
import { Button } from "./components/Button";
import { Layout } from "./components/Layout";
import { brand } from "./brand";

export type OrderEmailKind = "placed" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
export type OrderEmailData = {
  order_number: string;
  customer_name: string;
  customer_phone?: string | null;
  customer_email?: string;
  shipping_address?: { county?: string; city?: string; address?: string; postalCode?: string } | null;
  payment_method: string;
  payment_status: string;
  subtotal: number;
  shipping_cost: number;
  total_amount: number;
  tracking_number?: string | null;
  courier?: string | null;
  customer_notes?: string | null;
  items: { product_name: string; quantity: number; unit_price: number }[];
};

export const ron = (n: number) => `${Number(n).toFixed(2).replace(".", ",")} RON`;
export const PAYMENT_LABEL: Record<string, string> = { card_online: "Card online", cash_on_delivery: "Ramburs la livrare", bank_transfer: "Transfer bancar" };

const COPY: Record<OrderEmailKind, { subject: (n: string) => string; title: string; lead: string }> = {
  placed: { subject: (n) => `Comanda ${n} a fost înregistrată`, title: "Comanda ta e înregistrată", lead: "Am primit comanda și o pregătim. Te anunțăm prin email la fiecare pas." },
  paid: { subject: (n) => `Plata pentru comanda ${n} a fost confirmată`, title: "Plata a fost confirmată", lead: "Am primit plata. Pregătim comanda pentru expediere." },
  processing: { subject: (n) => `Comanda ${n} este în pregătire`, title: "Comanda ta este în pregătire", lead: "Echipa AirLife pregătește produsele pentru expediere." },
  shipped: { subject: (n) => `Comanda ${n} a fost expediată`, title: "Comanda ta a plecat", lead: "Coletul este în drum spre tine." },
  delivered: { subject: (n) => `Comanda ${n} a fost livrată`, title: "Comanda a fost livrată", lead: "Mulțumim că ai cumpărat de la AirLife. Dacă ceva nu e în regulă, ne poți scrie oricând." },
  cancelled: { subject: (n) => `Comanda ${n} a fost anulată`, title: "Comanda a fost anulată", lead: "Comanda a fost anulată. Dacă ai plătit deja, rambursarea se face pe același card." },
};
export const orderSubject = (kind: OrderEmailKind, n: string) => COPY[kind].subject(n);

const p = { margin: "0 0 16px", fontSize: 16, lineHeight: "26px", color: brand.ink };
const cell = { padding: "6px 0", fontSize: 15, color: brand.ink };

function Lines({ o }: { o: OrderEmailData }) {
  return (
    <table width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse", margin: "8px 0 16px" }}>
      <tbody>
        {o.items.map((i, k) => (
          <tr key={k} style={{ borderBottom: `1px solid ${brand.border}` }}>
            <td style={cell}>{i.quantity} x {i.product_name}</td>
            <td style={{ ...cell, textAlign: "right" }}>{ron(i.unit_price * i.quantity)}</td>
          </tr>
        ))}
        <tr><td style={{ ...cell, color: brand.muted }}>Subtotal</td><td style={{ ...cell, textAlign: "right" }}>{ron(o.subtotal)}</td></tr>
        <tr><td style={{ ...cell, color: brand.muted }}>Livrare</td><td style={{ ...cell, textAlign: "right" }}>{o.shipping_cost > 0 ? ron(o.shipping_cost) : "Gratuită"}</td></tr>
        <tr><td style={{ ...cell, fontWeight: 700 }}>Total</td><td style={{ ...cell, textAlign: "right", fontWeight: 700 }}>{ron(o.total_amount)}</td></tr>
      </tbody>
    </table>
  );
}

// Customer email: one template, the status decides the wording. No unsubscribe link: this is a transactional message.
export default function OrderEmail({ kind = "placed", o }: { kind?: OrderEmailKind; o: OrderEmailData }) {
  const c = COPY[kind];
  const track = `${brand.site}/urmarire-comanda?o=${encodeURIComponent(o.order_number)}`;
  return (
    <Layout preview={c.subject(o.order_number)} reason="Primești acest email pentru că ai plasat o comandă pe airlife.ro.">
      <Heading as="h1" style={{ margin: "0 0 16px", fontSize: 24, lineHeight: "32px", color: brand.ink }}>{c.title}</Heading>
      <Text style={p}>Bună, {o.customer_name},</Text>
      <Text style={p}>{c.lead}</Text>
      <Text style={{ ...p, marginBottom: 4 }}><strong>Comanda {o.order_number}</strong></Text>
      <Lines o={o} />
      <Text style={{ ...p, fontSize: 14, color: brand.muted }}>Plată: {PAYMENT_LABEL[o.payment_method] ?? o.payment_method}.</Text>
      {kind === "placed" && o.payment_method === "bank_transfer" && (
        <Text style={p}>Te contactăm în scurt timp cu datele pentru transferul bancar. Comanda se pregătește după confirmarea plății.</Text>
      )}
      {kind === "placed" && o.payment_method === "cash_on_delivery" && <Text style={p}>Plătești curierului când primești coletul.</Text>}
      {kind === "shipped" && (o.tracking_number || o.courier) && (
        <Text style={p}>Curier: <strong>{o.courier || "-"}</strong>{o.tracking_number ? <> | AWB: <strong>{o.tracking_number}</strong></> : null}</Text>
      )}
      <Hr style={{ borderColor: brand.border, margin: "16px 0" }} />
      <div style={{ margin: "16px 0", textAlign: "center" }}><Button href={track}>Vezi statusul comenzii</Button></div>
      <Text style={{ ...p, fontSize: 14, color: brand.muted, margin: 0 }}>Întrebări? Răspunde la acest email sau sună la +40 722 15 35 25.</Text>
    </Layout>
  );
}

// Internal notification to AirLife for every new or paid order.
export function OrderAdminEmail({ kind, o }: { kind: "placed" | "paid"; o: OrderEmailData }) {
  const a = o.shipping_address;
  return (
    <Layout preview={`Comandă nouă ${o.order_number}`} reason="Notificare internă AirLife.">
      <Heading as="h1" style={{ margin: "0 0 16px", fontSize: 22, color: brand.ink }}>
        {kind === "paid" ? "Comandă plătită" : "Comandă nouă"} {o.order_number}
      </Heading>
      <Text style={p}>
        <strong>{o.customer_name}</strong><br />
        {o.customer_email}{o.customer_phone ? <> | {o.customer_phone}</> : null}<br />
        {[a?.address, a?.city, a?.county, a?.postalCode].filter(Boolean).join(", ")}
      </Text>
      <Text style={p}>Plată: <strong>{PAYMENT_LABEL[o.payment_method] ?? o.payment_method}</strong> ({o.payment_status === "paid" ? "plătită" : "neplătită"}).</Text>
      {o.payment_method === "bank_transfer" && kind === "placed" && <Text style={{ ...p, color: "#b42318" }}><strong>Transfer bancar: trimite clientului datele de plată.</strong></Text>}
      <Lines o={o} />
      {o.customer_notes ? <Text style={p}>Notițe client: {o.customer_notes}</Text> : null}
      <div style={{ margin: "16px 0" }}><Button href={`${brand.site}/admin`}>Deschide în admin</Button></div>
    </Layout>
  );
}
