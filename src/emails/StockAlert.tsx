import { Heading, Img, Text } from "@react-email/components";
import { Button } from "./components/Button";
import { Layout } from "./components/Layout";
import { brand, utm } from "./brand";

type Props = { kind?: "back_in_stock" | "price_drop"; name?: string; slug?: string; image_url?: string | null; price?: number; oldPrice?: number; unsubscribeUrl?: string };

export const stockAlertSubject = (kind: "back_in_stock" | "price_drop", name: string) =>
  kind === "back_in_stock" ? `Din nou în stoc: ${name}` : `Preț mai mic: ${name}`;

export default function StockAlert({ kind = "back_in_stock", name = "Produs", slug = "", image_url, price = 0, oldPrice, unsubscribeUrl = "https://airlife.ro/unsubscribe?token=preview" }: Props) {
  const p = { margin: "0 0 16px", fontSize: 16, lineHeight: "26px", color: brand.ink };
  return (
    <Layout preview={kind === "back_in_stock" ? "Produsul pe care îl așteptai e disponibil." : "Produsul urmărit are un preț mai mic."} unsubscribeUrl={unsubscribeUrl} reason="Primești acest email pentru că ai cerut o alertă pentru acest produs pe airlife.ro.">
      <Heading as="h1" style={{ margin: "0 0 16px", fontSize: 24, lineHeight: "32px", color: brand.ink }}>
        {kind === "back_in_stock" ? "Produsul e din nou în stoc" : "Prețul a scăzut"}
      </Heading>
      {image_url && <Img src={image_url} width={200} height={200} alt={name} style={{ margin: "0 auto 12px", borderRadius: 8, objectFit: "contain", border: `1px solid ${brand.border}` }} />}
      <Text style={{ ...p, fontWeight: 600, textAlign: "center" }}>{name}</Text>
      <Text style={{ ...p, textAlign: "center", fontSize: 20, color: brand.greenDark, fontWeight: 700 }}>
        {price.toFixed(2)} RON{oldPrice ? <span style={{ color: brand.muted, fontSize: 14, fontWeight: 400, textDecoration: "line-through" }}> {oldPrice.toFixed(2)} RON</span> : null}
      </Text>
      <Text style={p}>Stocul și prețul se pot schimba, așa că dacă îl vrei, comandă-l cât e disponibil.</Text>
      <div style={{ margin: "24px 0 8px", textAlign: "center" }}>
        <Button href={utm(`/produse/${slug}`, kind === "back_in_stock" ? "alerta-stoc" : "alerta-pret")}>Vezi produsul</Button>
      </div>
    </Layout>
  );
}
