import { Img, Link, Text } from "@react-email/components";
import { brand, utm } from "../brand";

export type EmailProduct = { name: string; slug: string; price: number; image_url: string };

// Image + name + price, all linking to the product page. Used inside a table row (3 per row).
export function ProductCard({ p, campaign }: { p: EmailProduct; campaign: string }) {
  const href = utm(`/produse/${p.slug}`, campaign);
  return (
    <td width="33%" valign="top" style={{ padding: "0 6px", textAlign: "center" }}>
      <Link href={href}>
        <Img
          src={p.image_url}
          width={160}
          height={160}
          alt={p.name}
          style={{ margin: "0 auto", borderRadius: 8, objectFit: "contain", border: `1px solid ${brand.border}` }}
        />
      </Link>
      <Link href={href} style={{ color: brand.ink, fontSize: 13, lineHeight: "18px", textDecoration: "none", fontWeight: 600 }}>
        <Text style={{ margin: "8px 0 2px" }}>{p.name}</Text>
      </Link>
      <Text style={{ margin: 0, color: brand.greenDark, fontSize: 14, fontWeight: 700 }}>{p.price.toFixed(0)} lei</Text>
    </td>
  );
}
