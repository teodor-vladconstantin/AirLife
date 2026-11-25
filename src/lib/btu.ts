// Shared by the BTU guide page (client) and /api/btu-offer (server): pick catalog air conditioners for a needed BTU.
export interface BtuProduct { path: string; name: string; price: number; image: string; btu: number }

// "Aer condiționat Heiko Mora 12000 BTU" -> 12000
export const btuOf = (name: string): number | null => {
  const m = name.replace(/\./g, "").match(/(\d{4,5})\s*BTU/i);
  return m ? Number(m[1]) : null;
};

// Smallest units that cover the need (5% tolerance, same as the calculator), cheapest first, max 3.
export function pickRecommended(products: BtuProduct[], btuNeeded: number): BtuProduct[] {
  const fits = products.filter((p) => p.btu >= btuNeeded * 0.95);
  if (!fits.length) return [];
  const smallest = Math.min(...fits.map((p) => p.btu));
  const rank = (p: BtuProduct) => (p.btu === smallest ? 0 : 1);
  return [...fits].sort((a, b) => rank(a) - rank(b) || a.btu - b.btu || a.price - b.price).slice(0, 3);
}
