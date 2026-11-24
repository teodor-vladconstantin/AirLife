import { untypedDb } from "@/lib/untypedDb";
import { recommendedPrice } from "@/lib/suppliers";

// The contract markup belongs to the supplier. Whenever it changes (or purchase prices change), the selling price of every
// product of that supplier that has a purchase price becomes: purchase price + markup.
// Returns how many products were updated.
export async function applySupplierMarkup(supplierId: string, markup: number | null): Promise<{ updated: number; failed: number }> {
  if (markup == null) return { updated: 0, failed: 0 };
  type R = { id: string; product_id: string; purchase_price: number | null };
  const rows: R[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await untypedDb.from("supplier_products").select("id,product_id,purchase_price").eq("supplier_id", supplierId).not("purchase_price", "is", null).order("id").range(from, from + 999);
    if (error || !data) break;
    rows.push(...(data as R[]));
    if (data.length < 1000) break;
  }
  const todo = rows.flatMap((r) => { const p = recommendedPrice(r.purchase_price, markup); return p == null ? [] : [{ r, p }]; });
  let updated = 0, failed = 0;
  for (let i = 0; i < todo.length; i += 20) {
    const res = await Promise.all(todo.slice(i, i + 20).map(async ({ r, p }) => {
      const { error } = await untypedDb.from("products").update({ price: p }).eq("id", r.product_id);
      return !error;
    }));
    updated += res.filter(Boolean).length;
    failed += res.filter((x) => !x).length;
  }
  return { updated, failed };
}
