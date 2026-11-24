import { Heading, Text } from "@react-email/components";
import { Button } from "./components/Button";
import { Layout } from "./components/Layout";
import { ProductCard, type EmailProduct } from "./components/ProductCard";
import { brand, utm } from "./brand";

export type NewsletterData = {
  preheader: string;
  headline: string;
  body: string; // paragraphs separated by a blank line
  ctaLabel?: string;
  ctaPath?: string; // site path, e.g. /produse or /aer-conditionat
  products: EmailProduct[];
  campaign: string; // utm_campaign
};

// Free-form campaign built in the admin: headline, text, optional button and up to 6 products.
export default function Newsletter({ d, unsubscribeUrl = "https://airlife.ro/unsubscribe?token=preview" }: { d: NewsletterData; unsubscribeUrl?: string }) {
  const p = { margin: "0 0 16px", fontSize: 16, lineHeight: "26px", color: brand.ink };
  const paragraphs = d.body.split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean);
  const rows: EmailProduct[][] = [];
  for (let i = 0; i < d.products.length; i += 3) rows.push(d.products.slice(i, i + 3));
  return (
    <Layout preview={d.preheader || d.headline} unsubscribeUrl={unsubscribeUrl}>
      <Heading as="h1" style={{ margin: "0 0 16px", fontSize: 24, lineHeight: "32px", color: brand.ink }}>{d.headline}</Heading>
      {paragraphs.map((t, i) => <Text key={i} style={{ ...p, whiteSpace: "pre-line" }}>{t}</Text>)}
      {rows.length > 0 && (
        <table width="100%" cellPadding={0} cellSpacing={0} style={{ margin: "8px 0 8px" }}>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>{row.map((pr) => <ProductCard key={pr.slug} p={pr} campaign={d.campaign} />)}</tr>
            ))}
          </tbody>
        </table>
      )}
      {d.ctaLabel && d.ctaPath && (
        <div style={{ margin: "24px 0 8px", textAlign: "center" }}>
          <Button href={utm(d.ctaPath, d.campaign)}>{d.ctaLabel}</Button>
        </div>
      )}
    </Layout>
  );
}
