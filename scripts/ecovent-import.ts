// Turns the public Shopify catalog of ecovent.ro (/products.json) into a Supabase migration for public.products.
// Usage (from the repo root):
//   Activation (make the imported products visible, with a price and stock):
//   npx tsx scripts/ecovent-import.ts --activate supabase/migrations/<timestamp>_activate_ecovent.sql [--markup 0] [--stock 10]
//   npx tsx scripts/ecovent-import.ts --out supabase/migrations/<timestamp>_import_ecovent [--chunk 100] [--types "Ventilatoare Baie,Dezumidificatoare"] [--per-type 5] [--limit 100] [--from cache.json]
// Without --from the catalog is read live (sequential requests, 1.5 s apart). With --from it reads a saved products.json array.
//
// Rules:
//  - "Resigilat!" products (returned / open-box) are skipped: the shop and the Merchant feed present everything as new.
//  - Only types mapped in CATEGORY_MAP are imported; the rest need a category added in src/data/categoriesData.ts first.
//  - Every row is inserted with hidden = true, price 0 and stock 0: nothing appears on the site until you set a price and unhide it in /admin.
//  - Texts and photos are used with the written agreement of ecovent.ro. Photos stay on their CDN (image_url / gallery point to cdn.shopify.com).
//  - Idempotent: rows are inserted with ON CONFLICT (slug) DO NOTHING.
import { readFileSync, writeFileSync } from "node:fs";

type ShopifyProduct = {
  title: string; handle: string; vendor: string; product_type: string; tags: string[] | string; body_html: string | null;
  variants: { sku: string | null; available: boolean; price: string }[]; images: { src: string }[];
};

// Ecovent product_type -> category name used by the shop (see src/data/categoriesData.ts).
// Not imported on purpose (not HVAC): Aspiratoare, Accesorii Aspiratoare, Filtru Apă, Răcitoare Aer.
const CATEGORY_MAP: Record<string, string> = {
  "Ventilatoare Baie": "Ventilatoare Baie",
  "Recuperatoare de Căldură": "Recuperatoare de Căldură",
  "Sisteme descentralizate": "Recuperatoare de Căldură",
  "Dezumidificatoare": "Dezumidificatoare",
  "Purificator de Aer": "Purificatoare Aer",
  "Filtre Purificator de Aer": "Filtre Purificatoare",
  "Aer Condiționat": "Aer Condiționat",
  "Aer Condiționat Portabil": "Aer Condiționat Portabil",
  "Centrale de Ventilație": "Centrale de Ventilație",
  "Filtre Centrale de Ventilație": "Filtre Centrale de Ventilație",
  "Accesorii Ventilație": "Accesorii Ventilație",
  "Grile Ventilație": "Grile de Ventilație",
  "Sisteme de Distribuție a Aerului": "Tubulatură și Distribuție Aer",
  "Tubulatură Ventilație": "Tubulatură și Distribuție Aer",
  "Izolație Tubulatură": "Tubulatură și Distribuție Aer",
  "Ventilatoare Portabile": "Ventilatoare",
  "Ventilatoare Turn": "Ventilatoare",
  "Ventilatoare Axiale": "Ventilatoare Axiale și Centrifugale",
  "Ventilatoare Centrifugale": "Ventilatoare Axiale și Centrifugale",
  "Umidificatoare": "Umidificatoare",
  "Accesorii Umidificatoare": "Umidificatoare",
  "Aerotermă": "Aeroterme",
  "Monitoare Calitate Aer": "Monitoare Calitate Aer",
};
// Some portable units are filed under "Aer Condiționat" on their side.
const categoryOf = (p: ShopifyProduct) => (p.product_type === "Aer Condiționat" && /portabil/i.test(p.title) ? "Aer Condiționat Portabil" : CATEGORY_MAP[p.product_type]);

const args = process.argv.slice(2);
const arg = (name: string) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : undefined; };
const out = arg("out");
if (!out && !arg("activate")) { console.error("Missing --out <file.sql> (or --activate <file.sql>)"); process.exit(1); }
const types = (arg("types") ?? Object.keys(CATEGORY_MAP).join(",")).split(",").map((s) => s.trim()).filter(Boolean);
const perType = arg("per-type") ? Number(arg("per-type")) : Infinity;
const limit = arg("limit") ? Number(arg("limit")) : Infinity;
const activateOut = arg("activate");
const markup = arg("markup") ? Number(arg("markup")) : 0; // percent added to the price on their site
const stockWhenAvailable = arg("stock") ? Number(arg("stock")) : 10;
const chunk = arg("chunk") ? Number(arg("chunk")) : 0; // with --chunk N, --out is a file prefix and N products go in each _partNN.sql

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function load(): Promise<ShopifyProduct[]> {
  const from = arg("from");
  if (from) return JSON.parse(readFileSync(from, "utf8"));
  const all: ShopifyProduct[] = [];
  for (let page = 1; page < 20; page++) {
    const res = await fetch(`https://ecovent.ro/products.json?limit=250&page=${page}`, { headers: { "User-Agent": "airlife-catalog-import/1.0" } });
    if (!res.ok) throw new Error(`ecovent.ro answered ${res.status}`);
    const { products } = (await res.json()) as { products: ShopifyProduct[] };
    if (!products.length) break;
    all.push(...products);
    await sleep(1500);
  }
  return all;
}

const entities: Record<string, string> = { "&nbsp;": " ", "&amp;": "&", "&quot;": '"', "&#39;": "'", "&apos;": "'", "&lt;": "<", "&gt;": ">", "&ndash;": "–", "&mdash;": "—", "&hellip;": "…" };
const decode = (s: string) => s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&[a-z]+;|&#39;/gi, (m) => entities[m.toLowerCase()] ?? m);
const strip = (s: string) => decode(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
// Lines that name the other shop, a URL, an e-mail or a phone number do not belong in our product text.
const foreign = /ecovent|https?:|www\.|@|\+40|\b0[237]\d{8}\b|vintage\./i;

function cleanHtml(html: string) {
  const h = html
    .replace(/<!--[\s\S]*?-->/g, "").replace(/<(style|script|svg|iframe|noscript)[\s\S]*?<\/\1>/gi, "")
    .replace(/<img[^>]*>/gi, "");
  const features: string[] = [];
  for (const m of h.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)) {
    const t = strip(m[1]);
    if (t.length >= 12 && t.length <= 140 && !foreign.test(t) && !features.includes(t)) features.push(t);
  }
  const text = decode(
    h.replace(/<li[^>]*>/gi, "\n• ").replace(/<\/(p|div|section|article|h[1-6]|li|tr|details|figure)>/gi, "\n").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, " "),
  );
  const seen = new Set<string>();
  const lines = text.split("\n").map((l) => l.replace(/\s+/g, " ").trim()).filter((l) => l.length >= 3 && !foreign.test(l) && !seen.has(l) && !!seen.add(l));
  let description = "";
  for (const l of lines) {
    if ((description + "\n\n" + l).length > 3000) break;
    description += (description ? "\n\n" : "") + l;
  }
  return { description, features: features.slice(0, 8) };
}

const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ø/g, "o").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const shortSlug = (s: string, n = 80) => { const f = slugify(s); return f.length <= n ? f : f.slice(0, n).replace(/-[^-]*$/, ""); };
const q = (s: string) => `'${s.replace(/'/g, "''")}'`;
// The text comes from another site: strip the dollar-quote tag so it cannot end the quoted string early.
const dq = (s: string) => `$ev$${s.split("$ev$").join("")}$ev$`;

(async () => {
  const all = await load();
  const isResealed = (p: ShopifyProduct) => (Array.isArray(p.tags) ? p.tags : [p.tags]).some((t) => /resigilat/i.test(t)) || /^resigilat/i.test(p.title);
  const usable = all.filter((p) => !isResealed(p) && p.images.length > 0 && categoryOf(p) && types.includes(p.product_type));
  const perVendorSeen: Record<string, number> = {};
  const taken: Record<string, number> = {};
  const picked: ShopifyProduct[] = [];
  // available products first, spread across vendors when --per-type is used
  const ordered = [...usable].sort((a, b) => Number(b.variants.some((v) => v.available)) - Number(a.variants.some((v) => v.available)));
  for (const p of ordered) {
    if (picked.length >= limit) break;
    if ((taken[categoryOf(p)!] ?? 0) >= perType) continue;
    const key = `${categoryOf(p)}|${p.vendor}`;
    if (perType !== Infinity && (perVendorSeen[key] ?? 0) >= Math.ceil(perType / 2)) continue;
    const { description } = cleanHtml(p.body_html ?? "");
    if (perType !== Infinity && description.length < 80) continue; // quality bar only when sampling
    perVendorSeen[key] = (perVendorSeen[key] ?? 0) + 1;
    taken[categoryOf(p)!] = (taken[categoryOf(p)!] ?? 0) + 1;
    picked.push(p);
  }

  const slugs = new Set<string>();
  const activation: { slug: string; price: number; stock: number }[] = [];
  const rows = picked.map((p) => {
    const cleaned = cleanHtml(p.body_html ?? "");
    const { features } = cleaned;
    const description = cleaned.description || p.title; // some products have no text on their side: keep the title so the NOT NULL column is filled
    let slug = shortSlug(p.handle || p.title);
    for (let i = 2; slugs.has(slug); i++) slug = `${shortSlug(p.handle || p.title, 74)}-${i}`;
    slugs.add(slug);
    const base = Number(p.variants[0]?.price);
    const price = Math.round(base * (1 + markup / 100) * 100) / 100;
    if (price > 0) activation.push({ slug, price, stock: p.variants.some((v) => v.available) ? stockWhenAvailable : 0 });
    const [first, ...rest] = p.images.map((i) => i.src);
    const sku = p.variants[0]?.sku?.trim() || null;
    return `(${q(p.title.slice(0, 200))}, ${dq(description)}, 0, ${q(categoryOf(p)!)}, ${q(first)}, ${q(JSON.stringify(features))}::jsonb, 0, ${q(slug)}, ${sku ? q(sku) : "NULL"}, ${p.vendor ? q(p.vendor) : "NULL"}, ARRAY[${rest.slice(0, 10).map(q).join(", ")}]::text[], '{}'::jsonb, true)`;
  });

  if (activateOut) {
    const values = activation.map((a) => `(${q(a.slug)}, ${a.price.toFixed(2)}, ${a.stock})`).join(",\n");
    writeFileSync(activateOut, `-- Makes the products imported from ecovent.ro visible: sets price and stock and clears hidden.
-- ${activation.length} products. Price = the price on ecovent.ro${markup ? ` + ${markup}%` : " (no markup)"}; stock = ${stockWhenAvailable} when ecovent.ro lists the product as available, otherwise 0 (shown as "Indisponibil").
-- The stock number is a placeholder (their catalog does not publish quantities): adjust it in /admin. Products with no price on their side stay hidden.
-- Only touches rows that are still hidden with price 0, so it never overwrites a price you set by hand. Safe to run again.
UPDATE public.products AS p
SET price = v.price, stock = v.stock, hidden = false
FROM (VALUES
${values}
) AS v(slug, price, stock)
WHERE p.slug = v.slug AND p.hidden = true AND p.price = 0;
`);
    console.log(`${activation.length} of ${picked.length} products -> ${activateOut} (price range ${Math.min(...activation.map((a) => a.price))} - ${Math.max(...activation.map((a) => a.price))} RON, ${activation.filter((a) => a.stock > 0).length} with stock).`);
    return;
  }
  const header = (n: number, part: string) => `-- Import from ecovent.ro (written agreement with the owner). ${n} products${part}, all hidden, price 0, stock 0.
-- Set the price and unhide each product in /admin before it shows on the site. Safe to run again (ON CONFLICT (slug) DO NOTHING).
-- Generated by scripts/ecovent-import.ts; "Resigilat!" (open-box) products are excluded on purpose.
`;
  const cols = "(name, description, price, category, image_url, features, stock, slug, sku, brand, gallery, specs, hidden)";
  const insert = (r: string[]) => r.map((_, i) => i).filter((i) => i % 25 === 0).map((i) => `INSERT INTO public.products ${cols} VALUES\n${r.slice(i, i + 25).join(",\n")}\nON CONFLICT (slug) DO NOTHING;`).join("\n\n");
  if (!chunk) {
    writeFileSync(out!, `${header(rows.length, "")}\n${insert(rows)}\n`);
    console.log(`${rows.length} products -> ${out}. Per category: ${JSON.stringify(taken)}`);
    return;
  }
  const parts = Math.ceil(rows.length / chunk);
  for (let n = 0; n < parts; n++) {
    const slice = rows.slice(n * chunk, (n + 1) * chunk);
    const file = `${out}_part${String(n + 1).padStart(2, "0")}.sql`;
    writeFileSync(file, `${header(slice.length, ` (part ${n + 1} of ${parts})`)}\n${insert(slice)}\n`);
    console.log(`${file}: ${slice.length} products, ${(Buffer.byteLength(insert(slice)) / 1024).toFixed(0)} KB`);
  }
  console.log(`Total ${rows.length} products. Per category: ${JSON.stringify(taken)}`);
})();
