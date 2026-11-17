import { Heading, Text } from "@react-email/components";
import { Button } from "./components/Button";
import { Layout } from "./components/Layout";
import { brand, utm } from "./brand";

type Props = { productType?: string | null; unsubscribeUrl?: string };

export const reminderSubject = "Se apropie un an de la ultima igienizare";

export default function ServiceReminder({ productType, unsubscribeUrl = "https://airlife.ro/unsubscribe?token=preview" }: Props) {
  const p = { margin: "0 0 16px", fontSize: 16, lineHeight: "26px", color: brand.ink };
  return (
    <Layout preview="Filtrele și unitatea interioară se curăță cel mai bine la intervale regulate." unsubscribeUrl={unsubscribeUrl}>
      <Heading as="h1" style={{ margin: "0 0 16px", fontSize: 24, lineHeight: "32px", color: brand.ink }}>
        E timpul pentru o nouă igienizare
      </Heading>
      <Text style={p}>Bună,</Text>
      <Text style={p}>
        A trecut aproape un an de la ultima intervenție la {productType ? `aparatul tău (${productType})` : "aparatul tău"}.
        Filtrele și unitatea interioară se curăță cel mai bine la intervale regulate, ca aerul din casă să rămână curat și
        aparatul să lucreze fără efort.
      </Text>
      <Text style={p}>Alege o dată și venim la tine.</Text>
      <div style={{ margin: "24px 0 8px", textAlign: "center" }}>
        <Button href={utm("/servicii/igienizare-aer-conditionat", "reminder-igienizare")}>Programează igienizarea</Button>
      </div>
    </Layout>
  );
}
