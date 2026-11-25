// Pure helpers for the suppliers module (no React, no network): pricing maths and CSV in/out.

export interface SupplierProductRow {
  id: string;
  supplier_id: string;
  product_id: string;
  supplier_sku: string | null;
  purchase_price: number | null;
  list_price: number | null;
  markup_percent: number | null; // null = use the supplier default
}

const r2 = (n: number) => Math.round(n * 100) / 100;

// Contract markup that applies to a product: its own value, else the supplier default, else none.
export const effectiveMarkup = (row: Pick<SupplierProductRow, "markup_percent">, supplierDefault: number | null | undefined) =>
  row.markup_percent ?? supplierDefault ?? null;

// Price the contract allows: purchase price plus the markup.
export const recommendedPrice = (purchase: number | null, markup: number | null) =>
  purchase != null && markup != null ? r2(purchase * (1 + markup / 100)) : null;

// Markup actually earned at the current selling price, as a percentage of the purchase price.
export const realMarkup = (sellPrice: number, purchase: number | null) =>
  purchase != null && purchase > 0 ? r2(((sellPrice - purchase) / purchase) * 100) : null;

// ---- CSV -------------------------------------------------------------------------------------------------------------

// Accepts comma or semicolon separators, quoted fields with "" escapes, CRLF or LF, and a leading BOM.
export function parseCsv(text: string): string[][] {
  const src = text.replace(/^\uFEFF/, "");
  const first = src.split(/\r?\n/, 1)[0] ?? "";
  const sep = (first.match(/;/g)?.length ?? 0) > (first.match(/,/g)?.length ?? 0) ? ";" : ",";
  const rows: string[][] = [];
  let row: string[] = [], cell = "", quoted = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === sep) { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(cell); cell = "";
      if (row.some((x) => x.trim() !== "")) rows.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell);
  if (row.some((x) => x.trim() !== "")) rows.push(row);
  return rows.map((r) => r.map((x) => x.trim()));
}

export const toCsv = (rows: (string | number | null | undefined)[][]) =>
  "\uFEFF" + rows.map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");

// "1.234,56" / "1234.56" / "1234,56" / "12 RON" -> number, or null when it is not a price.
export function parseNumber(raw: string): number | null {
  let s = raw.replace(/\s|RON|lei/gi, "");
  if (!s) return null;
  if (s.includes(",") && s.includes(".")) s = s.lastIndexOf(",") > s.lastIndexOf(".") ? s.replace(/\./g, "").replace(",", ".") : s.replace(/,/g, "");
  else if (s.includes(",")) s = s.replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export interface OfferLine { sku: string; purchase_price?: number | null; list_price?: number | null; markup_percent?: number | null }

const HEAD: Record<string, keyof OfferLine> = {
  sku: "sku", cod: "sku", "cod produs": "sku", "cod furnizor": "sku",
  purchase_price: "purchase_price", "pret achizitie": "purchase_price", "preț achiziție": "purchase_price", achizitie: "purchase_price", "pret achizitie fara tva": "purchase_price",
  list_price: "list_price", "pret lista": "list_price", "preț listă": "list_price", "pret de lista": "list_price",
  markup_percent: "markup_percent", adaos: "markup_percent", "adaos %": "markup_percent", "adaos comercial": "markup_percent",
};
const norm = (h: string) => h.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim();

// Turns an offer file (CSV) into lines to apply. Needs a "sku" column and at least one price/markup column.
export function parseOffer(text: string): { lines: OfferLine[]; error?: string } {
  const rows = parseCsv(text);
  if (rows.length < 2) return { lines: [], error: "Fișierul nu are rânduri de date." };
  const map = rows[0].map((h) => HEAD[norm(h)] ?? HEAD[h.toLowerCase().trim()]);
  const skuCol = map.indexOf("sku");
  if (skuCol < 0) return { lines: [], error: "Lipsește coloana „sku” (sau „cod”)." };
  if (!map.some((m) => m && m !== "sku")) return { lines: [], error: "Lipsește o coloană de preț: purchase_price, list_price sau markup_percent." };
  const lines: OfferLine[] = [];
  for (const r of rows.slice(1)) {
    const sku = (r[skuCol] ?? "").trim();
    if (!sku) continue;
    const line: OfferLine = { sku };
    map.forEach((m, i) => { if (m && m !== "sku" && (r[i] ?? "") !== "") line[m] = parseNumber(r[i]) as never; });
    lines.push(line);
  }
  return { lines };
}
