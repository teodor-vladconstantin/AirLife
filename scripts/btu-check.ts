// Self-check for src/lib/btu.ts. Run: npx tsx scripts/btu-check.ts
import assert from "node:assert/strict";
import { btuOf, pickRecommended } from "../src/lib/btu";

assert.equal(btuOf("Aer condiționat Heiko Mora 12000 BTU"), 12000);
assert.equal(btuOf("Unitate 12.000 BTU"), 12000);
assert.equal(btuOf("Ventilator A100"), null);
const mk = (name: string, price: number) => ({ path: name, name, price, image: "/x.jpg", btu: btuOf(name)! });
const list = [mk("A 9000 BTU", 1500), mk("B 9000 BTU", 1300), mk("C 12000 BTU", 1900), mk("D 18000 BTU", 2800), mk("E 9000 BTU", 1700), mk("F 9000 BTU", 1400)];
const r = pickRecommended(list, 7000);
assert.deepEqual(r.map((p) => p.name), ["B 9000 BTU", "F 9000 BTU", "A 9000 BTU"]); // smallest fitting size, cheapest first, max 3
assert.equal(pickRecommended(list, 17000)[0].name, "D 18000 BTU");
assert.equal(pickRecommended(list, 30000).length, 0); // nothing big enough: no cards, form still shows
console.log("btu ok");
