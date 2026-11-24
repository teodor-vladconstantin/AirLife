// Pure logic for the shop listing (collection) pages: filters, sorting, facets with counts, URL <-> state.
// No React and no browser APIs here, so it can be tested on its own.

export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  category: string;
  price: number; // effective price (sale price when a sale is live)
  compare_at?: number; // struck-through list price when a sale is live
  stock: number;
  image_url: string;
  created_at: string;
}

export type SortKey = "new" | "price-asc" | "price-desc" | "name" | "discount";
export const SORTS: { value: SortKey; label: string }[] = [
  { value: "new", label: "Cele mai noi" },
  { value: "price-asc", label: "Preț crescător" },
  { value: "price-desc", label: "Preț descrescător" },
  { value: "name", label: "Nume, A-Z" },
  { value: "discount", label: "Reducere cea mai mare" },
];

export interface Filters {
  q: string;
  categories: string[];
  brands: string[];
  min?: number;
  max?: number;
  inStock: boolean;
  onSale: boolean;
  sort: SortKey;
  page: number;
}

export const PAGE_SIZE = 24;
export const DEFAULT_FILTERS: Filters = { q: "", categories: [], brands: [], inStock: false, onSale: false, sort: "new", page: 1 };

const num = (v: string | null) => {
  if (v == null || v.trim() === "") return undefined;
  const n = Number(v.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};
const list = (v: string | null) => (v ? v.split("|").map((s) => s.trim()).filter(Boolean) : []);

export function parseFilters(params: URLSearchParams): Filters {
  const sort = params.get("sort") as SortKey | null;
  const page = Number(params.get("page"));
  return {
    q: (params.get("q") ?? "").trim(),
    categories: list(params.get("categorie")),
    brands: list(params.get("brand")),
    min: num(params.get("min")),
    max: num(params.get("max")),
    inStock: params.get("stoc") === "1",
    onSale: params.get("oferta") === "1",
    sort: SORTS.some((s) => s.value === sort) ? (sort as SortKey) : "new",
    page: Number.isInteger(page) && page > 1 ? page : 1,
  };
}

// Only non-default values go in the address, so /produse stays clean and a shared link reproduces the view.
export function toQuery(f: Filters): string {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.categories.length) p.set("categorie", f.categories.join("|"));
  if (f.brands.length) p.set("brand", f.brands.join("|"));
  if (f.min != null) p.set("min", String(f.min));
  if (f.max != null) p.set("max", String(f.max));
  if (f.inStock) p.set("stoc", "1");
  if (f.onSale) p.set("oferta", "1");
  if (f.sort !== "new") p.set("sort", f.sort);
  if (f.page > 1) p.set("page", String(f.page));
  const s = p.toString();
  return s ? `?${s}` : "";
}

const fold = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const discount = (c: ProductCardData) => (c.compare_at ? (c.compare_at - c.price) / c.compare_at : 0);

type Skip = "categories" | "brands" | "price" | "stock" | "sale" | "sort";

// `skip` leaves one filter group out: used to count the options of that group (a facet shows what you would get if you picked it).
export function matches(c: ProductCardData, f: Filters, skip?: Skip) {
  if (f.q) {
    const hay = fold(`${c.name} ${c.brand ?? ""} ${c.category}`);
    if (!fold(f.q).split(/\s+/).filter(Boolean).every((w) => hay.includes(w))) return false;
  }
  if (skip !== "categories" && f.categories.length && !f.categories.includes(c.category)) return false;
  if (skip !== "brands" && f.brands.length && !f.brands.includes(c.brand ?? "")) return false;
  if (skip !== "price") {
    if (f.min != null && c.price < f.min) return false;
    if (f.max != null && c.price > f.max) return false;
  }
  if (skip !== "stock" && f.inStock && c.stock <= 0) return false;
  if (skip !== "sale" && f.onSale && !c.compare_at) return false;
  return true;
}

// Whatever the sort, products that can be bought come first and unavailable ones go to the end of the list.
export function sortCards(cards: ProductCardData[], sort: SortKey) {
  const sorted = sortBy(cards, sort);
  return [...sorted.filter((c) => c.stock > 0), ...sorted.filter((c) => c.stock <= 0)];
}

function sortBy(cards: ProductCardData[], sort: SortKey) {
  const out = [...cards];
  const byName = (a: ProductCardData, b: ProductCardData) => a.name.localeCompare(b.name, "ro");
  switch (sort) {
    case "price-asc": return out.sort((a, b) => a.price - b.price || byName(a, b));
    case "price-desc": return out.sort((a, b) => b.price - a.price || byName(a, b));
    case "name": return out.sort(byName);
    case "discount": return out.sort((a, b) => discount(b) - discount(a) || byName(a, b));
    default: return out.sort((a, b) => b.created_at.localeCompare(a.created_at) || byName(a, b));
  }
}

export function applyFilters(cards: ProductCardData[], f: Filters) {
  return sortCards(cards.filter((c) => matches(c, f)), f.sort);
}

export interface Facets {
  categories: { name: string; count: number }[];
  brands: { name: string; count: number }[];
  inStock: number;
  onSale: number;
  priceMin: number;
  priceMax: number;
}

export function facets(cards: ProductCardData[], f: Filters): Facets {
  const count = (key: (c: ProductCardData) => string, skip: Skip) => {
    const m = new Map<string, number>();
    for (const c of cards) if (matches(c, f, skip)) m.set(key(c), (m.get(key(c)) ?? 0) + 1);
    // options that are selected stay visible even when their count dropped to 0
    for (const sel of skip === "categories" ? f.categories : f.brands) if (!m.has(sel)) m.set(sel, 0);
    return [...m.entries()].filter(([name]) => name).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "ro"));
  };
  const priced = cards.filter((c) => matches(c, f, "price"));
  const prices = (priced.length ? priced : cards).map((c) => c.price);
  return {
    categories: count((c) => c.category, "categories"),
    brands: count((c) => c.brand ?? "", "brands"),
    inStock: cards.filter((c) => matches(c, f, "stock") && c.stock > 0).length,
    onSale: cards.filter((c) => matches(c, f, "sale") && !!c.compare_at).length,
    priceMin: prices.length ? Math.floor(Math.min(...prices)) : 0,
    priceMax: prices.length ? Math.ceil(Math.max(...prices)) : 0,
  };
}

export const discountPct = (c: ProductCardData) => (c.compare_at ? Math.round(discount(c) * 100) : 0);

export const formatPrice = (n: number) =>
  `${n.toLocaleString("ro-RO", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })} RON`;

export const activeFilterCount = (f: Filters, ignoreCategory = false) =>
  (ignoreCategory ? 0 : f.categories.length) + f.brands.length + (f.min != null || f.max != null ? 1 : 0) + (f.inStock ? 1 : 0) + (f.onSale ? 1 : 0) + (f.q ? 1 : 0);
