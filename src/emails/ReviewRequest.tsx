import { Heading, Link, Text } from "@react-email/components";
import { Button } from "./components/Button";
import { Layout } from "./components/Layout";
import { brand, utm } from "./brand";

export type ReviewItem = { name: string; slug: string };
type Props = { orderNumber?: string; items?: ReviewItem[] };

export const reviewRequestSubject = (orderNumber: string) => `Cum ți s-a părut comanda ${orderNumber}?`;

// Transactional follow-up for a delivered order: no unsubscribe list, one email per order.
export default function ReviewRequest({ orderNumber = "AL-0000", items = [] }: Props) {
  const p = { margin: "0 0 16px", fontSize: 16, lineHeight: "26px", color: brand.ink };
  return (
    <Layout preview="Părerea ta ajută alți clienți să aleagă." reason={`Primești acest email pentru că ai plasat comanda ${orderNumber} pe airlife.ro. Îți scriem o singură dată pentru fiecare comandă.`}>
      <Heading as="h1" style={{ margin: "0 0 16px", fontSize: 24, lineHeight: "32px", color: brand.ink }}>Cum ți s-a părut comanda?</Heading>
      <Text style={p}>Bună, sperăm că produsele din comanda {orderNumber} au ajuns bine. Dacă ai un minut, lasă o recenzie: ajută alți clienți și ne ajută pe noi să îmbunătățim magazinul.</Text>
      {items.slice(0, 5).map((i) => (
        <Text key={i.slug} style={{ ...p, margin: "0 0 8px" }}>
          •{" "}<Link href={utm(`/produse/${i.slug}#reviews-h`, "recenzie")} style={{ color: brand.greenDark }}>{i.name}</Link>
        </Text>
      ))}
      <div style={{ margin: "24px 0 8px", textAlign: "center" }}>
        <Button href={utm(items[0] ? `/produse/${items[0].slug}#reviews-h` : "/my-orders", "recenzie")}>Scrie o recenzie</Button>
      </div>
      <Text style={{ ...p, fontSize: 13, color: brand.muted }}>Ai o problemă cu comanda? Scrie-ne la contact@airlife.ro și o rezolvăm.</Text>
    </Layout>
  );
}
