// Pure helpers for the suppliers module (no React, no network): pricing maths and CSV out.

export interface SupplierProductRow {
  id: string;
  supplier_id: string;
  product_id: string;
  supplier_sku: string | null;
  purchase_price: number | null;
  list_price: number | null;
}

// Contract: we sell at the supplier's price and buy at that price minus the discount.
export const purchasePrice = (price: number, discount: number | null) =>
  discount != null ? Math.round(price * (100 - discount)) / 100 : null;

// ---- CSV -------------------------------------------------------------------------------------------------------------

export const toCsv = (rows: (string | number | null | undefined)[][]) =>
  "﻿" + rows.map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
