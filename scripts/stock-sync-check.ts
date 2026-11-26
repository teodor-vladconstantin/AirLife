// Self-check for src/lib/stockSync.ts. Run: npx tsx scripts/stock-sync-check.ts
import assert from "node:assert/strict";
import { ecoventEntries, planSync, toAvailability, wooEntries, type Row } from "../src/lib/stockSync";

// parsers: SKU is trimmed and case-insensitive, preorder counts as unavailable, a repeated SKU is available if any copy is
const eco = toAvailability(ecoventEntries([{ variants: [{ sku: " Ab1 ", available: false }, { sku: "ab1", available: true }, { sku: null, available: true }] }]));
assert.deepEqual([...eco], [["ab1", true]]);
const woo = toAvailability(wooEntries([
  { sku: "S1", is_in_stock: true, is_on_backorder: false },
  { sku: "S2", is_in_stock: true, is_on_backorder: true },
  { sku: "S3", is_in_stock: false, is_on_backorder: false },
  { sku: "", is_in_stock: true, is_on_backorder: false },
]));
assert.deepEqual([...woo], [["s1", true], ["s2", false], ["s3", false]]);

// 20 products of one supplier, all in stock with 10
const rows: Row[] = Array.from({ length: 20 }, (_, i) => ({ supplier: "Ecovent", productId: `p${i}`, sku: `S${i}`, name: `P${i}`, stock: 10 }));
const feed = (off: number[], missing: number[] = []) =>
  new Map(rows.flatMap((_, i) => (missing.includes(i) ? [] : [[`s${i}`, !off.includes(i)] as [string, boolean]])));
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
  { supplier: "Ecovent", productId: "x", sku: "E1", name: "X", stock: 0 },
  { supplier: "Novingair", productId: "x", sku: "N1", name: "X", stock: 0 },
];
const one = (v: boolean, sku: string) => new Map([[sku, v]]);
assert.deepEqual(to(planSync(two, { Ecovent: one(false, "e1"), Novingair: one(true, "n1") })), [["x", 10]]);
const stocked = two.map((r) => ({ ...r, stock: 10 }));
assert.equal(planSync(stocked, { Ecovent: one(false, "e1"), Novingair: { error: "down" } }, true).changes.length, 0);
assert.deepEqual(to(planSync(stocked, { Ecovent: one(false, "e1"), Novingair: one(false, "n1") }, true)), [["x", 0]]);

// a supplier without a catalog source is left alone
assert.equal(planSync([{ supplier: "Altul", productId: "y", sku: "1", name: "Y", stock: 5 }], {}).changes.length, 0);

console.log("stock sync ok");
