import { Heading, Img, Text } from "@react-email/components";
import { Button } from "./components/Button";
import { Layout } from "./components/Layout";
import { brand, utm } from "./brand";

export type CartLine = { name: string; quantity: number; price: number; image_url: string | null };
type Props = { second?: boolean; lines?: CartLine[]; total?: number; unsubscribeUrl?: string };

export const cartReminderSubject = (second: boolean) => (second ? "Produsele din coș te mai așteaptă" : "Ai uitat ceva în coș");

export default function CartReminder({ second = false, lines = [], total = 0, unsubscribeUrl = "https://airlife.ro/unsubscribe?token=preview" }: Props) {
  const p = { margin: "0 0 16px", fontSize: 16, lineHeight: "26px", color: brand.ink };
  return (
    <Layout preview="Ți-am păstrat produsele. Finalizezi comanda în câteva minute." unsubscribeUrl={unsubscribeUrl} reason="Primești acest email pentru că ai produse în coșul tău de pe airlife.ro.">
      <Heading as="h1" style={{ margin: "0 0 16px", fontSize: 24, lineHeight: "32px", color: brand.ink }}>
        {second ? "Produsele tale mai sunt disponibile" : "Ți-am păstrat coșul"}
      </Heading>
      <Text style={p}>Bună, ai lăsat în coș:</Text>
      {lines.slice(0, 5).map((l) => (
        <table key={l.name} width="100%" style={{ marginBottom: 10 }}><tbody><tr>
          {l.image_url && <td width="64"><Img src={l.image_url} width={56} height={56} alt="" style={{ borderRadius: 6, objectFit: "contain", border: `1px solid ${brand.border}` }} /></td>}
          <td style={{ fontSize: 14, color: brand.ink }}>{l.name}<br /><span style={{ color: brand.muted }}>{l.quantity} × {l.price.toFixed(2)} RON</span></td>
        </tr></tbody></table>
      ))}
      <Text style={{ ...p, fontWeight: 700 }}>Total: {total.toFixed(2)} RON</Text>
      <Text style={p}>Livrare gratuită peste 1.000 RON, plată securizată cu cardul, retur în 14 zile.</Text>
      <div style={{ margin: "24px 0 8px", textAlign: "center" }}>
        <Button href={utm("/checkout", second ? "cos-2" : "cos-1")}>Finalizează comanda</Button>
      </div>
    </Layout>
  );
}
