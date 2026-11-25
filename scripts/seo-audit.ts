// Run against a running build (set the site visible: VITE_COMING_SOON=false):
//   npx next build && npx next start -p 3000   then   npm run seo:audit   (BASE=http://localhost:3000 by default)
// Crawls every URL in /sitemap.xml: title/description length, one <h1>, canonical, image alt,
// duplicate titles/descriptions, and internal links that point nowhere. Exit code 1 if any error.
import { readFileSync } from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3000";
const SITE = "https://airlife.ro";
const errors: string[] = [];
const warns: string[] = [];

const get = (path: string) => fetch(BASE + path, { redirect: "manual" });
const redirects = new Set([...readFileSync("next.config.mjs", "utf8").matchAll(/r\("([^":]+)"/g)].map((m) => m[1]));
const status = new Map<string, number>();
const exists = async (path: string) => {
  const clean = path.split("#")[0].split("?")[0].replace(/\/$/, "") || "/";
  if (!status.has(clean)) status.set(clean, (await get(clean)).status);
  return status.get(clean)! < 400;
};

const sitemap = await (await get("/sitemap.xml")).text();
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, "") || "/");
const titles = new Map<string, string[]>();
const descs = new Map<string, string[]>();

for (const path of paths) {
  const html = await (await get(path)).text();
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? "";
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  const canon = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  const tag = (s: string) => `${path || "/"}: ${s}`;

  if (!title) errors.push(tag("missing <title>"));
  else if (title.length > 65) warns.push(tag(`title ${title.length} chars (>65)`));
  else if (title.length < 25) warns.push(tag(`title ${title.length} chars (<25)`));
  if (!desc) errors.push(tag("missing meta description"));
  else if (desc.length > 165) warns.push(tag(`description ${desc.length} chars (>165)`));
  else if (desc.length < 70) warns.push(tag(`description ${desc.length} chars (<70)`));
  if (h1 !== 1) errors.push(tag(`${h1} <h1> tags (expected 1)`));
  if (!canon) errors.push(tag("missing canonical"));
  else if (canon !== `${SITE}${path === "/" ? "/" : path}`) warns.push(tag(`canonical ${canon}`));
  for (const img of html.match(/<img\b[^>]*>/g) ?? []) if (!/\balt="/.test(img)) warns.push(tag("image without alt"));

  titles.set(title, [...(titles.get(title) ?? []), path]);
  if (desc) descs.set(desc, [...(descs.get(desc) ?? []), path]);

  for (const m of html.matchAll(/<a\b[^>]*href="(\/[^"#?]*)/g)) {
    const href = m[1];
    if (href.startsWith("//")) continue;
    if (redirects.has(href)) errors.push(tag(`link to redirected URL ${href}`));
    else if (!(await exists(href))) errors.push(tag(`broken internal link ${href}`));
  }
}
for (const [t, ps] of titles) if (t && ps.length > 1) errors.push(`duplicate title "${t}" on ${ps.join(", ")}`);
for (const [d, ps] of descs) if (ps.length > 1) warns.push(`duplicate description on ${ps.join(", ")}`);

const uniq = (a: string[]) => [...new Set(a)];
console.log(`[seo-audit] ${paths.length} pages · ${uniq(errors).length} errors · ${uniq(warns).length} warnings`);
for (const e of uniq(errors)) console.log("  ERROR ", e);
for (const w of uniq(warns)) console.log("  warn  ", w);
process.exit(errors.length ? 1 : 0);
