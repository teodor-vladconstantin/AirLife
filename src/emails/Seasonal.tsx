import { Heading, Text } from "@react-email/components";
import { Button } from "./components/Button";
import { Layout } from "./components/Layout";
import { ProductCard, type EmailProduct } from "./components/ProductCard";
import { brand, utm } from "./brand";

export type SeasonalVariant = "iarna" | "primavara" | "pompe-caldura";

const copy = {
  iarna: {
    subject: "Aerul condiționat, pregătit pentru iarnă",
    preview: "O igienizare făcută înainte de frig te scutește de probleme în sezon.",
    h1: "Aparatul de aer condiționat, pregătit pentru iarnă",
    body: [
      "Filtrele murdare scad randamentul și strică aerul din casă. O igienizare făcută acum e mai simplă decât o defecțiune în mijlocul iernii.",
      "Echipa AirLife face igienizare și service. Spune-ne modelul aparatului și îți propunem o dată.",
    ],
    cta: "Cere o programare",
    path: "/servicii/igienizare-aer-conditionat",
    productsTitle: "Din stoc, pentru ventilația din baie:",
  },
  primavara: {
    subject: "Aerul condiționat, pregătit pentru vară",
    preview: "Igienizarea de primăvară te scutește de surprize la prima zi caldă.",
    h1: "Pregătește aerul condiționat pentru vară",
    body: [
      "După o iarnă în care aparatul a stat oprit, filtrele și unitatea interioară au nevoie de curățare. Cu o igienizare făcută înainte de caniculă, aerul rămâne curat din prima zi.",
      "Spune-ne modelul aparatului și îți propunem o dată.",
    ],
    cta: "Cere o programare",
    path: "/servicii/igienizare-aer-conditionat",
    productsTitle: "Aparate de aer condiționat din stoc:",
  },
  "pompe-caldura": {
    subject: "Pompa de căldură, verificată înainte de frig",
    preview: "O verificare la început de sezon rece e mai simplă decât o pană în ianuarie.",
    h1: "Verifică pompa de căldură înainte de frig",
    body: [
      "Aparatele care încălzesc iarna lucrează mai mult decât vara. Filtre curate, unitatea exterioară liberă și drenajul în ordine fac diferența.",
      "Un service făcut acum prinde problemele mici înainte să devină defecțiuni. Spune-ne modelul și stabilim o dată.",
    ],
    cta: "Cere un service",
    path: "/servicii/service-aer-conditionat",
    productsTitle: "Aparate de aer condiționat din stoc:",
  },
} as const;

export const seasonalSubject = (v: SeasonalVariant) => copy[v].subject;

type Props = { variant?: SeasonalVariant; unsubscribeUrl?: string; products?: EmailProduct[] };

const media = "https://sgazuswrfbbkloqfyryt.supabase.co/storage/v1/object/public/media/products";
// Real catalog rows, used for the local preview. The sender passes live products.
const sample: EmailProduct[] = [
  { name: "Controler A80-NS pentru ventilatoare A80", slug: "controler-a80-ns", price: 249, image_url: `${media}/3884-1.webp` },
  { name: "Valvă de ventilație RMP 100", slug: "valva-ventilatie-rmp-100", price: 274, image_url: `${media}/3907-1.webp` },
  { name: "Carcasă îngropată A80i-UP-GEH", slug: "carcasa-a80i-up-geh", price: 317, image_url: `${media}/4200-1.webp` },
];

export default function Seasonal({ variant = "iarna", unsubscribeUrl = "https://airlife.ro/unsubscribe?token=preview", products = sample }: Props) {
  const c = copy[variant];
  const campaign = `sezon-${variant}`;
  const p = { margin: "0 0 16px", fontSize: 16, lineHeight: "26px", color: brand.ink };
  return (
    <Layout preview={c.preview} unsubscribeUrl={unsubscribeUrl}>
      <Heading as="h1" style={{ margin: "0 0 16px", fontSize: 24, lineHeight: "32px", color: brand.ink }}>
        {c.h1}
      </Heading>
      <Text style={p}>Bună,</Text>
      {c.body.map((t) => (
        <Text key={t} style={p}>
          {t}
        </Text>
      ))}
      <div style={{ margin: "24px 0 28px", textAlign: "center" }}>
        <Button href={utm(c.path, campaign)}>{c.cta}</Button>
      </div>
      {products.length > 0 && (
        <>
          <Text style={{ ...p, fontWeight: 700, margin: "0 0 12px" }}>{c.productsTitle}</Text>
          <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
            <tbody>
              <tr>
                {products.slice(0, 3).map((x) => (
                  <ProductCard key={x.slug} p={x} campaign={campaign} />
                ))}
              </tr>
            </tbody>
          </table>
        </>
      )}
    </Layout>
  );
}
