// Google Merchant Center feed (RSS 2.0 + g: namespace), also served at /feed/google.xml (rewrite in next.config.mjs).
// Same visibility rules as the shop (no hidden products, no placeholder photos), real sale price. Shipping/returns are set in the Merchant account.
// GTIN, when known, is stored in products.specs.gtin (8/12/13/14 digits).
import { db } from "@/lib/catalog";
import { gtinOf, isShopVisible, salePricing } from "@/lib/pricing";

export const revalidate = 3600;

const SITE = "https://airlife.ro";
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// Google product taxonomy, only for categories where the path is certain; the others are left out rather than guessed.
const GOOGLE_CATEGORY: Record<string, string> = {
  "Aer Condiționat": "Home & Garden > Household Appliances > Climate Control Appliances > Air Conditioners",
  "Aer Condiționat fără Unitate Exterioară": "Home & Garden > Household Appliances > Climate Control Appliances > Air Conditioners",
  "Dezumidificatoare": "Home & Garden > Household Appliances > Climate Control Appliances > Dehumidifiers",
  "Purificatoare Aer": "Home & Garden > Household Appliances > Air Purifiers",
};
const abs = (u: string) => (u.startsWith("http") ? u : SITE + u);

export async function GET() {
  const { data } = await db().from("products").select("*").not("slug", "is", null).order("name");
  const items = (data ?? []).filter((p) => isShopVisible(p) && Number(p.price) > 0).map((p) => {
    const { price, compare_at } = salePricing(p);
    const list = compare_at ?? price;
    const gtin = gtinOf(p.specs);
    const extra = (p.gallery ?? []).filter((g) => g && g !== p.image_url).slice(0, 10);
    return `<item>
<g:id>${esc(p.sku ?? p.slug!)}</g:id><title>${esc(p.name.slice(0, 150))}</title><description>${esc(p.description.slice(0, 4900))}</description>
<link>${SITE}/products/${p.slug}</link><g:image_link>${esc(abs(p.image_url!))}</g:image_link>${extra.map((g) => `<g:additional_image_link>${esc(abs(g))}</g:additional_image_link>`).join("")}
<g:availability>${(p.stock ?? 0) > 0 ? "in_stock" : "out_of_stock"}</g:availability><g:price>${list.toFixed(2)} RON</g:price>${compare_at ? `<g:sale_price>${price.toFixed(2)} RON</g:sale_price>` : ""}
<g:condition>new</g:condition>${p.brand ? `<g:brand>${esc(p.brand)}</g:brand>` : ""}${gtin ? `<g:gtin>${gtin}</g:gtin>` : ""}${p.sku ? `<g:mpn>${esc(p.sku)}</g:mpn>` : ""}<g:identifier_exists>${p.brand && (gtin || p.sku) ? "yes" : "no"}</g:identifier_exists>
<g:product_type>${esc(p.category)}</g:product_type>${GOOGLE_CATEGORY[p.category] ? `<g:google_product_category>${esc(GOOGLE_CATEGORY[p.category])}</g:google_product_category>` : ""}
</item>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel><title>AirLife</title><link>${SITE}</link><description>Catalog AirLife</description>
${items.join("\n")}
</channel></rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
