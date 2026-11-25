import { Heading, Text } from "@react-email/components";
import { Button } from "./components/Button";
import { Layout } from "./components/Layout";
import { ProductCard, type EmailProduct } from "./components/ProductCard";
import { brand, utm } from "./brand";

export type BtuOfferData = { areaM2: number; volumeM3: number; btuNeeded: number; btuRecommended: number; products: EmailProduct[] };

export const btuOfferSubject = (d: BtuOfferData) => `Oferta ta AirLife: aparat de ${d.btuRecommended.toLocaleString("ro-RO")} BTU`;

// Follow-up for someone who used the BTU calculator and asked for an offer. Transactional (they requested it): no unsubscribe link.
export default function BtuOffer({ d }: { d: BtuOfferData }) {
  const p = { margin: "0 0 16px", fontSize: 16, lineHeight: "26px", color: brand.ink };
  const n = (x: number) => x.toLocaleString("ro-RO");
  return (
    <Layout preview={`Pentru camera ta ai nevoie de circa ${n(d.btuRecommended)} BTU.`} reason="Primești acest email pentru că ai cerut o ofertă în calculatorul BTU de pe airlife.ro.">
      <Heading as="h1" style={{ margin: "0 0 16px", fontSize: 24, lineHeight: "32px", color: brand.ink }}>Oferta ta pentru aer condiționat</Heading>
      <Text style={p}>Bună,</Text>
      <Text style={p}>
        Pentru o cameră de {n(d.areaM2)} mp ({n(d.volumeM3)} mc) necesarul estimat este de circa {n(d.btuNeeded)} BTU, deci îți recomandăm un aparat de {n(d.btuRecommended)} BTU.
      </Text>
      {d.products.length > 0 && (
        <>
          <Text style={p}>Câteva aparate potrivite din stoc:</Text>
          <table width="100%" cellPadding={0} cellSpacing={0} role="presentation"><tbody><tr>{d.products.map((x) => <ProductCard key={x.slug} p={x} campaign="btu-offer" />)}</tr></tbody></table>
        </>
      )}
      <Text style={{ ...p, marginTop: 20 }}>Te sunăm sau îți scriem în cel mai scurt timp cu oferta finală, inclusiv montajul. Dacă vrei să vorbim imediat, sună la +40 722 15 35 25 sau scrie-ne pe WhatsApp.</Text>
      <div style={{ margin: "24px 0 8px", textAlign: "center" }}>
        <Button href={utm("/aer-conditionat", "btu-offer")}>Vezi toate aparatele</Button>
      </div>
    </Layout>
  );
}
