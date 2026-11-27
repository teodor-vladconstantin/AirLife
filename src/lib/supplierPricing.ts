import { untypedDb } from "@/lib/untypedDb";
import { purchasePrice } from "@/lib/suppliers";

// The contract discount belongs to the supplier. Whenever it changes, the purchase price of every product of that supplier
// becomes: selling price (the supplier's price) minus the discount. Selling prices are never touched here.
// Returns how many products were updated.
export async function applySupplierDiscount(supplierId: string, discount: number | null): Promise<{ updated: number; failed: number }> {
  if (discount == null) return { updated: 0, failed: 0 };
  type R = { id: string; purchase_price: number | null; products: { price: number } };
  const rows: R[] = [];
  let failed = 0;
  for (let from = 0; ; from += 1000) {
    const { data, error } = await untypedDb.from("supplier_products").select("id,purchase_price,products!inner(price)").eq("supplier_id", supplierId).order("id").range(from, from + 999);
    if (error || !data) { failed++; break; }
    rows.push(...(data as unknown as R[]));
    if (data.length < 1000) break;
  }
  const todo = rows.flatMap((r) => { const p = purchasePrice(r.products.price, discount); return p == null || p === r.purchase_price ? [] : [{ r, p }]; });
  let updated = 0;
  for (let i = 0; i < todo.length; i += 20) {
    const res = await Promise.all(todo.slice(i, i + 20).map(async ({ r, p }) => {
      const { error } = await untypedDb.from("supplier_products").update({ purchase_price: p, updated_at: new Date().toISOString() }).eq("id", r.id);
      return !error;
    }));
    updated += res.filter(Boolean).length;
    failed += res.filter((x) => !x).length;
  }
  return { updated, failed };
}
