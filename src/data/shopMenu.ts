import { CATEGORIES_DATA } from "@/data/categoriesData";

// Structure of the "Magazin" menu: 3 main sections, each with a few sub-sections that group the product categories.
// A category that is not listed here still shows up (under "Alte categorii"), so new categories are never lost.
export interface MenuGroup { title: string; slugs: string[] }
export interface MenuSection { key: string; title: string; description: string; groups: MenuGroup[] }

export const SHOP_MENU: MenuSection[] = [
  {
    key: "climatizare", title: "Climatizare și încălzire", description: "Răcire și căldură pentru casă",
    groups: [
      { title: "Aer condiționat", slugs: ["aer-conditionat", "aer-conditionat-portabil", "aer-conditionat-fara-unitate-exterioara"] },
      { title: "Încălzire", slugs: ["aeroterme"] },
      { title: "Accesorii", slugs: ["accesorii-aer-conditionat"] },
    ],
  },
  {
    key: "ventilatie", title: "Ventilație", description: "Aer proaspăt în toată casa",
    groups: [
      { title: "Aparate", slugs: ["centrale-ventilatie", "recuperatoare-caldura", "ventilatoare-baie", "ventilatoare", "ventilatoare-axiale-centrifugale"] },
      { title: "Instalație", slugs: ["tubulatura-distributie-aer", "grile-ventilatie"] },
      { title: "Accesorii și filtre", slugs: ["accesorii-ventilatie", "filtre-centrale-ventilatie"] },
    ],
  },
  {
    key: "aer-sanatos", title: "Aer sănătos și întreținere", description: "Curat, uscat, controlat",
    groups: [
      { title: "Calitatea aerului", slugs: ["purificatoare-aer", "dezumidificatoare", "umidificatoare", "monitoare-calitate-aer"] },
      { title: "Întreținere", slugs: ["filtre-purificatoare", "curatare-si-intretinere", "consumabile-hvac"] },
    ],
  },
];

export interface MenuLink { slug: string; name: string; count?: number }
export interface BuiltGroup { title: string; links: MenuLink[] }
export interface BuiltSection { key: string; title: string; description: string; groups: BuiltGroup[]; names: string[] }

// Resolves slugs to names and counts. With counts known, empty categories (and the groups/sections that end up empty) are hidden.
export function buildMenu(counts: Record<string, number> | null): BuiltSection[] {
  const link = (slug: string): MenuLink | null => {
    const c = CATEGORIES_DATA[slug];
    if (!c) return null;
    const n = counts?.[c.name];
    return counts && !n ? null : { slug, name: c.name, count: n };
  };
  const used = new Set(SHOP_MENU.flatMap((s) => s.groups.flatMap((g) => g.slugs)));
  const extra = Object.keys(CATEGORIES_DATA).filter((s) => !used.has(s));
  const sections = [...SHOP_MENU, ...(extra.length ? [{ key: "alte", title: "Alte categorii", description: "", groups: [{ title: "Mai multe", slugs: extra }] }] : [])];
  return sections.flatMap((s) => {
    const groups = s.groups.map((g) => ({ title: g.title, links: g.slugs.map(link).filter((l): l is MenuLink => !!l) })).filter((g) => g.links.length);
    return groups.length ? [{ key: s.key, title: s.title, description: s.description, groups, names: groups.flatMap((g) => g.links.map((l) => CATEGORIES_DATA[l.slug].name)) }] : [];
  });
}
