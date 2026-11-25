// Lists products that are incomplete for Google Merchant Center / Shopping ads.
// Run: npx tsx --env-file=.env.local scripts/feed-audit.ts
import { gtinOf, isShopVisible } from "../src/lib/pricing";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY!;
const res = await fetch(`${url}/rest/v1/produse?select=*&order=name`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
if (!res.ok) throw new Error(`products: ${res.status} ${await res.text()}`);
const data = (await res.json()) as Array<Record<string, any>>; // eslint-disable-line @typescript-eslint/no-explicit-any

const rows = data.map((p) => {
  const issues: string[] = [];
  if (p.hidden) issues.push("ascuns (nu intră în feed)");
  else if (!isShopVisible(p)) issues.push("fără poză reală (nu intră în feed)");
  if (!p.slug) issues.push("fără slug (nu intră în feed)");
  if (!(Number(p.price) > 0)) issues.push("fără preț");
  if (!p.brand) issues.push("fără brand");
  if (!p.sku) issues.push("fără SKU/MPN");
  if (!gtinOf(p.specs)) issues.push("fără GTIN (specs.gtin)");
  if (p.description.length < 150) issues.push(`descriere scurtă (${p.description.length} caractere)`);
  if (!p.gallery?.length) issues.push("fără poze suplimentare");
  return { p, issues };
});
const bad = rows.filter((r) => r.issues.length);
console.log(`${data.length} produse, ${bad.length} cu probleme, ${data.length - bad.length} complete\n`);
for (const { p, issues } of bad) console.log(`- ${p.name} [${p.slug ?? p.id}]: ${issues.join("; ")}`);
