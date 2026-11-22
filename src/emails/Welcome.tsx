import { Heading, Text } from "@react-email/components";
import { Button } from "./components/Button";
import { Layout } from "./components/Layout";
import { brand, utm } from "./brand";

type Props = { day?: 0 | 3; unsubscribeUrl?: string };

const copy = {
  0: {
    subject: "Bine ai venit la AirLife",
    preview: "Ce primești de la noi și un ghid ca să începi.",
    h1: "Bine ai venit la AirLife",
    body: [
      "Mulțumim că te-ai abonat. Îți scriem rar și doar despre lucruri utile: ce verifici înainte de sezon, când e momentul pentru igienizare sau service și oferte reale.",
      "Ca să începi, citește ghidul nostru despre igienizarea aerului condiționat: ce presupune, cât durează și la ce interval se face.",
    ],
    cta: "Citește ghidul",
    path: "/ghid/igienizare-aer-conditionat-buzau",
    campaign: "welcome-0",
  },
  3: {
    subject: "Cum îți dai seama că aparatul are nevoie de igienizare",
    preview: "Patru semne pe care le poți observa singur.",
    h1: "Patru semne că e momentul pentru igienizare",
    body: [
      "Miros neplăcut când pornește aparatul, aer mai slab decât înainte, apă care picură în interior sau zgomote noi. Dacă observi unul dintre ele, merită o verificare.",
      "Un tehnician poate găsi rapid cauza și poate curăța aparatul. Spune-ne modelul și îți propunem o dată.",
    ],
    cta: "Cere o programare",
    path: "/servicii/igienizare-aer-conditionat-buzau",
    campaign: "welcome-3",
  },
} as const;

export const welcomeSubject = (day: 0 | 3) => copy[day].subject;

export default function Welcome({ day = 0, unsubscribeUrl = "https://airlife.ro/unsubscribe?token=preview" }: Props) {
  const c = copy[day];
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
      <div style={{ margin: "24px 0 8px", textAlign: "center" }}>
        <Button href={utm(c.path, c.campaign)}>{c.cta}</Button>
      </div>
    </Layout>
  );
}
