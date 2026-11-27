// Self-check for src/lib/stockSync.ts. Run: npx tsx scripts/stock-sync-check.ts
import assert from "node:assert/strict";
import { ecoventEntries, planSync, toAvailability, wooEntries, type Offer, type Row } from "../src/lib/stockSync";
import { purchasePrice } from "../src/lib/suppliers";

// parsers: SKU is trimmed and case-insensitive, preorder counts as unavailable, a repeated SKU is available if any copy is
// and has no price when the copies disagree
const eco = toAvailability(ecoventEntries([{ variants: [
  { sku: " Ab1 ", available: false, price: "10.00" }, { sku: "ab1", available: true, price: "12.00" },
  { sku: null, available: true, price: "1" }, { sku: "c", available: true, price: "206.99" },
] }]));
assert.deepEqual([...eco], [["ab1", { ok: true, price: null }], ["c", { ok: true, price: 206.99 }]]);
const money = { price: "129900", currency_minor_unit: 2, currency_code: "RON" };
const woo = toAvailability(wooEntries([
  { sku: "S1", is_in_stock: true, is_on_backorder: false, prices: money },
  { sku: "S2", is_in_stock: true, is_on_backorder: true, prices: money },
  { sku: "S3", is_in_stock: false, is_on_backorder: false, prices: { ...money, currency_code: "EUR" } },
  { sku: "", is_in_stock: true, is_on_backorder: false, prices: money },
]));
assert.deepEqual([...woo], [["s1", { ok: true, price: 1299 }], ["s2", { ok: false, price: 1299 }], ["s3", { ok: false, price: null }]]);
assert.equal(purchasePrice(206.99, 20), 165.59);
assert.equal(purchasePrice(100, null), null);

// 20 products of one supplier, all in stock with 10
const base = { price: 100, purchase: 80, discount: 20 };
const rows: Row[] = Array.from({ length: 20 }, (_, i) => ({ ...base, linkId: `l${i}`, supplier: "Ecovent", productId: `p${i}`, sku: `S${i}`, name: `P${i}`, stock: 10 }));
const feed = (off: number[], missing: number[] = []) =>
  new Map(rows.flatMap((_, i) => (missing.includes(i) ? [] : [[`s${i}`, { ok: !off.includes(i), price: 100 }] as [string, Offer]])));
const to = (p: ReturnType<typeof planSync>) => p.changes.map((c) => [c.productId, c.to]);

// unavailable -> 0, available -> 10 (also resets a partly sold 8), unchanged rows are not written, unknown SKU untouched
const mixed = rows.map((r, i) => ({ ...r, stock: i === 1 ? 8 : i === 2 ? 0 : i === 3 ? 4 : 10 }));
const a = planSync(mixed, { Ecovent: feed([0], [3]) });
assert.deepEqual(to(a), [["p0", 0], ["p1", 10], ["p2", 10]]);
assert.deepEqual(a.reports[0].unmatched, ["S3"]);
assert.equal(a.reports[0].skipped, undefined);

// catalog could not be read: nothing changes
const b = planSync(rows, { Ecovent: { error: "429" } });
assert.equal(b.changes.length, 0);
assert.match(b.reports[0].skipped!, /429/);

// under 90% matched: nothing changes, even with force
assert.equal(planSync(rows, { Ecovent: feed([5], [0, 1, 2]) }, true).changes.length, 0);

// exactly 30% to zero passes, more is blocked unless forced
assert.equal(planSync(rows, { Ecovent: feed([0, 1, 2, 3, 4, 5]) }).changes.length, 6);
const many = feed([0, 1, 2, 3, 4, 5, 6]);
assert.equal(planSync(rows, { Ecovent: many }).changes.length, 0);
assert.equal(planSync(rows, { Ecovent: many }, true).changes.length, 7);

// two suppliers for one product
const two: Row[] = [
  { ...base, linkId: "e", supplier: "Ecovent", productId: "x", sku: "E1", name: "X", stock: 0 },
  { ...base, linkId: "n", supplier: "Novingair", productId: "x", sku: "N1", name: "X", stock: 0 },
];
const one = (ok: boolean, sku: string, price = 100) => new Map([[sku, { ok, price }]]);
assert.deepEqual(to(planSync(two, { Ecovent: one(false, "e1"), Novingair: one(true, "n1") })), [["x", 10]]);
const stocked = two.map((r) => ({ ...r, stock: 10 }));
assert.equal(planSync(stocked, { Ecovent: one(false, "e1"), Novingair: { error: "down" } }, true).changes.length, 0);
assert.deepEqual(to(planSync(stocked, { Ecovent: one(false, "e1"), Novingair: one(false, "n1") }, true)), [["x", 0]]);

// a supplier without a catalog source is left alone
assert.equal(planSync([{ ...base, linkId: "y", supplier: "Altul", productId: "y", sku: "1", name: "Y", stock: 5 }], {}).changes.length, 0);

// prices: ours follows theirs, the purchase price is theirs minus the contract discount
const sync = (price: number | null, over: Partial<Row> = {}) =>
  planSync([{ ...rows[0], ...over }], { Ecovent: new Map([["s0", { ok: true, price }]]) });
const c = sync(206.99, { price: 248.39, purchase: null });
assert.deepEqual(c.prices.map((x) => [x.productId, x.from, x.to]), [["p0", 248.39, 206.99]]);
assert.deepEqual(c.purchases, [{ linkId: "l0", to: 165.59 }]);
// same price, purchase already right: nothing to write
assert.deepEqual([sync(100).prices, sync(100).purchases], [[], []]);
// no discount on the supplier: price follows, purchase untouched
assert.deepEqual([sync(110, { discount: null }).prices.length, sync(110, { discount: null }).purchases.length], [1, 0]);
// no price at the supplier: untouched
assert.deepEqual([sync(null).prices, sync(null).purchases], [[], []]);
// under half or over double: reported, not written
for (const wild of [49, 201]) {
  const w = sync(wild);
  assert.deepEqual([w.prices.length, w.purchases.length, w.reports[0].suspect.length], [0, 0, 1]);
}
// two suppliers: the selling price is left alone, each link gets its own purchase price
const d = planSync(two, { Ecovent: one(true, "e1", 90), Novingair: one(true, "n1", 110) });
assert.deepEqual([d.prices, d.purchases], [[], [{ linkId: "e", to: 72 }, { linkId: "n", to: 88 }]]);
// untrusted catalog: no prices either
assert.equal(planSync(rows.map((r) => ({ ...r, purchase: null })), { Ecovent: feed([5], [0, 1, 2]) }).purchases.length, 0);

console.log("stock sync ok");
