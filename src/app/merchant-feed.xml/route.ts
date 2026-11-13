// Google Merchant Center feed (RSS 2.0 + g: namespace). Shipping/returns are set in the Merchant account.
import { db } from "@/lib/catalog";

export const revalidate = 3600;

const SITE = "https://airlife.ro";
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const { data } = await db().from("products").select("slug,name,sku,brand,description,price,image_url,stock").not("slug", "is", null).order("name");
  const items = (data ?? []).filter((p) => p.price > 0).map((p) => `<item>
<g:id>${esc(p.sku ?? p.slug!)}</g:id><title>${esc(p.name.slice(0, 150))}</title><description>${esc(p.description.slice(0, 4900))}</description>
<link>${SITE}/products/${p.slug}</link>${p.image_url ? `<g:image_link>${esc(p.image_url)}</g:image_link>` : ""}
<g:availability>${p.stock > 0 ? "in_stock" : "out_of_stock"}</g:availability><g:price>${Number(p.price).toFixed(2)} RON</g:price>
<g:condition>new</g:condition>${p.brand ? `<g:brand>${esc(p.brand)}</g:brand>` : ""}${p.sku ? `<g:mpn>${esc(p.sku)}</g:mpn>` : ""}<g:identifier_exists>${p.brand && p.sku ? "yes" : "no"}</g:identifier_exists>
</item>`);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel><title>AirLife</title><link>${SITE}</link><description>Catalog AirLife</description>
${items.join("\n")}
</channel></rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
