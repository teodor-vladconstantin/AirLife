import { Heading, Text } from "@react-email/components";
import { Button } from "./components/Button";
import { Layout } from "./components/Layout";
import { brand } from "./brand";

type Props = { confirmUrl?: string; unsubscribeUrl?: string };

export default function Confirm({
  confirmUrl = "https://airlife.ro/confirm?token=preview",
  unsubscribeUrl = "https://airlife.ro/unsubscribe?token=preview",
}: Props) {
  const p = { margin: "0 0 16px", fontSize: 16, lineHeight: "26px", color: brand.ink };
  return (
    <Layout
      preview="Un click și ești abonat. Dacă nu ai cerut tu, ignoră mesajul."
      unsubscribeUrl={unsubscribeUrl}
      reason="Primești acest email pentru că cineva a introdus această adresă pe airlife.ro."
    >
      <Heading as="h1" style={{ margin: "0 0 16px", fontSize: 24, lineHeight: "32px", color: brand.ink }}>
        Confirmă abonarea
      </Heading>
      <Text style={p}>Bună,</Text>
      <Text style={p}>
        Apasă butonul de mai jos ca să confirmi că vrei emailuri de la AirLife: sfaturi de întreținere, oferte sezoniere
        și remindere de service. Fără confirmare, nu îți trimitem nimic.
      </Text>
      <div style={{ margin: "24px 0", textAlign: "center" }}>
        <Button href={confirmUrl}>Confirmă abonarea</Button>
      </div>
      <Text style={{ ...p, fontSize: 14, color: brand.muted, margin: 0 }}>
        Dacă nu ai cerut tu, ignoră mesajul și nu se întâmplă nimic.
      </Text>
    </Layout>
  );
}
