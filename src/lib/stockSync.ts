// Keeps stock and prices in step with the suppliers' public catalogs (server only).
// We sell at the supplier's price and buy at that price minus the contract discount.
// Rules and protections: docs/superpowers/specs/2026-11-26-stock-sync-design.md
import { adminDb } from "./email/db";
import { purchasePrice } from "./suppliers";

// ponytail: the catalogs publish yes/no, not quantities. Use real numbers once a supplier gives us a feed with them.
const IN_STOCK = 10;

export type Offer = { ok: boolean; price: number | null };
export type Entry = [sku: string, offer: Offer];
export type Availability = Map<string, Offer>;
export type Feed = Availability | { error: string };
export type Row = {
  linkId: string; supplier: string; productId: string; sku: string | null; name: string; stock: number | null;
  price: number; purchase: number | null; discount: number | null;
};
export type Change = { productId: string; name: string; sku: string; from: number; to: number };
export type Purchase = { linkId: string; to: number };
export type SupplierReport = { supplier: string; ours: number; matched: number; toZero: number; unmatched: string[]; suspect: string[]; skipped?: string };
export type Plan = { changes: Change[]; prices: Change[]; purchases: Purchase[]; reports: SupplierReport[] };

// ---- catalogs --------------------------------------------------------------------------------------------------------

const key = (sku: string | null | undefined) => (sku ?? "").trim().toLowerCase();
const positive = (n: number) => (n > 0 && Number.isFinite(n) ? n : null);

type EcoventProduct = { variants: { sku: string | null; available: boolean; price: string }[] };
export const ecoventEntries = (products: EcoventProduct[]): Entry[] =>
  products.flatMap((p) => p.variants.map((v): Entry => [key(v.sku), { ok: v.available === true, price: positive(Number(v.price)) }]));

// Preorder ("Disponibil pentru pre-comenzi") counts as unavailable. Woo prices come in minor units (bani).
type WooProduct = { sku: string; is_in_stock: boolean; is_on_backorder: boolean; prices: { price: string; currency_minor_unit: number; currency_code: string } };
export const wooEntries = (items: WooProduct[]): Entry[] =>
  items.map((p): Entry => [key(p.sku), {
    ok: p.is_in_stock === true && p.is_on_backorder !== true,
    price: p.prices.currency_code === "RON" ? positive(Number(p.prices.price) / 10 ** p.prices.currency_minor_unit) : null,
  }]);

// A repeated SKU is available if any copy is, and has no price when the copies disagree.
export function toAvailability(entries: Entry[]): Availability {
  const map: Availability = new Map();
  for (const [sku, offer] of entries) {
    if (!sku) continue;
    const seen = map.get(sku);
    map.set(sku, seen ? { ok: seen.ok || offer.ok, price: seen.price === offer.price ? offer.price : null } : offer);
  }
  return map;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// One retry after a 429. The shared deadline keeps a slow supplier from using up the cron's whole time budget.
async function get(url: string, deadline: number, retried = false): Promise<Response> {
  const left = deadline - Date.now();
  if (left <= 0) throw new Error("timpul alocat citirii a expirat");
  const res = await fetch(url, { headers: { "User-Agent": "airlife-stock-sync/1.0" }, cache: "no-store", signal: AbortSignal.timeout(Math.min(20_000, left)) });
  if (res.status === 429 && !retried) {
    const wait = Math.min(Number(res.headers.get("retry-after")) || 60, 90) * 1000;
    if (wait < deadline - Date.now()) { await sleep(wait); return get(url, deadline, true); }
  }
  if (!res.ok) throw new Error(`${new URL(url).host} a răspuns ${res.status}`);
  return res;
}

async function readEcovent(deadline: number) {
  const all: EcoventProduct[] = [];
  for (let page = 1; page <= 40; page++) {
    const { products } = await (await get(`https://ecovent.ro/products.json?limit=250&page=${page}`, deadline)).json();
    if (!Array.isArray(products)) throw new Error("catalog Ecovent în format neașteptat");
    if (!products.length) return toAvailability(ecoventEntries(all));
    all.push(...products);
    await sleep(1500);
  }
  throw new Error("catalog Ecovent cu prea multe pagini");
}

// Simple products and variations are two separate listings in the WooCommerce Store API.
async function readNovingair(deadline: number) {
  const all: WooProduct[] = [];
  for (const type of ["", "&type=variation"]) {
    for (let page = 1, pages = 1; page <= pages; page++) {
      const res = await get(`https://ventilatie-recuperare.ro/wp-json/wc/store/v1/products?per_page=100&page=${page}${type}`, deadline);
      const items = await res.json();
      pages = Number(res.headers.get("x-wp-totalpages"));
      if (!Array.isArray(items) || !pages || pages > 40) throw new Error("catalog Novingair în format neașteptat");
      all.push(...items);
    }
  }
  return toAvailability(wooEntries(all));
}

// Keys are suppliers.name in the database.
const SOURCES: Record<string, (deadline: number) => Promise<Availability>> = { Ecovent: readEcovent, Novingair: readNovingair };

// ---- planning (pure) -------------------------------------------------------------------------------------------------

// force skips only the "too many products drop to 0" protection.
export function planSync(rows: Row[], feeds: Record<string, Feed>, force = false): Plan {
  const trusted = new Map<string, Availability>();
  const reports: SupplierReport[] = [];
  for (const [supplier, feed] of Object.entries(feeds)) {
    const mine = rows.filter((r) => r.supplier === supplier);
    const report: SupplierReport = { supplier, ours: mine.length, matched: 0, toZero: 0, unmatched: [], suspect: [] };
    reports.push(report);
    if (!(feed instanceof Map)) { report.skipped = `catalogul nu a putut fi citit (${feed.error})`; continue; }
    let inStock = 0;
    for (const r of mine) {
      const ok = feed.get(key(r.sku))?.ok;
      if ((r.stock ?? 0) > 0) inStock++;
      if (ok === undefined) { report.unmatched.push(r.sku || r.name); continue; }
      report.matched++;
      if (!ok && (r.stock ?? 0) > 0) report.toZero++;
    }
    if (report.matched * 10 < report.ours * 9) report.skipped = `doar ${report.matched} din ${report.ours} produse se potrivesc (minimum 90%)`;
    else if (!force && report.toZero * 10 > inStock * 3) report.skipped = `${report.toZero} din ${inStock} produse în stoc ar trece pe 0 (maximum 30%)`;
    else trusted.set(supplier, feed);
  }

  const byProduct = new Map<string, Row[]>();
  for (const r of rows) byProduct.set(r.productId, [...(byProduct.get(r.productId) ?? []), r]);
  const changes: Change[] = [];
  const prices: Change[] = [];
  const purchases: Purchase[] = [];
  for (const links of byProduct.values()) {
    for (const r of links) {
      const price = trusted.get(r.supplier)?.get(key(r.sku))?.price;
      if (!price) continue;
      // a price under half or over double ours is more likely a broken catalog than an offer
      if (r.price > 0 && (price * 2 < r.price || price > r.price * 2)) {
        reports.find((x) => x.supplier === r.supplier)!.suspect.push(`${r.sku}: ${r.price} -> ${price}`);
        continue;
      }
      // ponytail: with several suppliers the selling price stays manual; pick a rule once a product actually has two
      if (links.length === 1 && price !== r.price) prices.push({ productId: r.productId, name: r.name, sku: r.sku ?? "", from: r.price, to: price });
      const buy = purchasePrice(price, r.discount);
      if (buy !== null && buy !== r.purchase) purchases.push({ linkId: r.linkId, to: buy });
    }
    const states = links.map((r) => trusted.get(r.supplier)?.get(key(r.sku))?.ok);
    // available if any supplier has it; 0 only when every supplier of the product says no
    const to = states.includes(true) ? IN_STOCK : states.every((s) => s === false) ? 0 : null;
    const { productId, name, sku, stock } = links[0];
    if (to !== null && to !== stock) changes.push({ productId, name, sku: sku ?? "", from: stock ?? 0, to });
  }
  return { changes, prices, purchases, reports };
}

// Plain-text report, or null when there is nothing worth telling.
export function reportText({ changes, prices, purchases, reports }: Plan, applied: boolean): string | null {
  if (!changes.length && !prices.length && !purchases.length && !reports.some((r) => r.skipped || r.unmatched.length || r.suspect.length)) return null;
  const out = reports.map((r) =>
    [
      `${r.supplier}: ${r.matched}/${r.ours} produse potrivite`,
      ...(r.skipped ? [`  SĂRIT, stoc și prețuri nemodificate: ${r.skipped}`] : []),
      ...(!r.skipped && r.unmatched.length ? [`  SKU negăsite la furnizor: ${r.unmatched.join(", ")}`] : []),
      ...(r.suspect.length ? [`  PREȚ SUSPECT, nemodificat (verifică manual): ${r.suspect.join("; ")}`] : []),
    ].join("\n"),
  );
  const line = (c: Change) => `  ${c.from} -> ${c.to}  ${c.sku}  ${c.name}`;
  out.push(applied ? "Modificări aplicate" : "Modificări propuse (nimic scris)");
  out.push(`Stoc: ${changes.length}`, ...changes.map(line));
  out.push(`Preț de vânzare: ${prices.length}`, ...prices.map(line));
  out.push(`Preț de achiziție: ${purchases.length}`);
  return out.join("\n");
}

// ---- run -------------------------------------------------------------------------------------------------------------

type DbRow = {
  id: string; product_id: string; supplier_sku: string | null; purchase_price: number | null;
  suppliers: { name: string; default_markup_percent: number | null };
  products: { name: string; stock: number | null; price: number };
};

export async function runStockSync({ apply = false, force = false } = {}) {
  const db = adminDb();
  const rows: Row[] = [];
  for (let from = 0; ; from += 1000) {
    // suppliers.default_markup_percent holds the contract DISCOUNT (the column keeps its first name)
    const { data, error } = await db.from("supplier_products").select("id,product_id,supplier_sku,purchase_price,suppliers(name,default_markup_percent),products(name,stock,price)").order("id").range(from, from + 999);
    if (error) throw new Error(`citirea produselor a eșuat: ${error.message}`);
    for (const d of data as unknown as DbRow[])
      rows.push({
        linkId: d.id, supplier: d.suppliers.name, productId: d.product_id, sku: d.supplier_sku, name: d.products.name,
        stock: d.products.stock, price: d.products.price, purchase: d.purchase_price, discount: d.suppliers.default_markup_percent,
      });
    if (data.length < 1000) break;
  }

  const deadline = Date.now() + 150_000;
  const feeds: Record<string, Feed> = Object.fromEntries(
    await Promise.all(
      Object.entries(SOURCES).map(async ([name, read]) => [name, await read(deadline).catch((e: Error) => ({ error: e.message }))] as const),
    ),
  );
  const plan = planSync(rows, feeds, force);

  if (apply) {
    for (const to of [0, IN_STOCK]) {
      const ids = plan.changes.filter((c) => c.to === to).map((c) => c.productId);
      for (let i = 0; i < ids.length; i += 100) {
        const { error } = await db.from("products").update({ stock: to }).in("id", ids.slice(i, i + 100));
        if (error) throw new Error(`scrierea stocului a eșuat: ${error.message}`);
      }
    }
    const writes = [
      ...plan.prices.map((c) => () => db.from("products").update({ price: c.to }).eq("id", c.productId)),
      ...plan.purchases.map((p) => () => db.from("supplier_products").update({ purchase_price: p.to, updated_at: new Date().toISOString() }).eq("id", p.linkId)),
    ];
    for (let i = 0; i < writes.length; i += 20) {
      const failed = (await Promise.all(writes.slice(i, i + 20).map((w) => w()))).find((r) => r.error);
      if (failed) throw new Error(`scrierea prețurilor a eșuat: ${failed.error!.message}`);
    }
  }
  return plan;
}
