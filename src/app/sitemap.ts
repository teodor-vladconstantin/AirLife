import type { MetadataRoute } from "next";
import { db, loadCategorySummaries } from "@/lib/catalog";
import { BLOG_CANONICAL } from "@/data/localSeo";

export const revalidate = 3600;

const SITE = "https://airlife.ro";
const STATIC = [
  "/", "/aer-conditionat-buzau", "/products", "/servicii", "/servicii/montaj-aer-conditionat-buzau", "/servicii/igienizare-aer-conditionat-buzau", "/servicii/service-aer-conditionat-buzau",
  "/ghid/igienizare-aer-conditionat-buzau", "/ghid/cost-montaj-aer-conditionat-buzau", "/ghid/ce-btu-aer-conditionat-buzau", "/blog", "/despre-noi", "/contact", "/livrare-si-retur", "/garantie",
  "/termeni-si-conditii", "/politica-de-confidentialitate", "/politica-de-cookies", "/subprocesatori", "/formular-retragere",
];

// Local pages (-buzau slugs and the Buzău hub) come first, then the other static pages, then deeper pages.
const priorityOf = (p: string) => (p === "/" ? 1 : p.includes("-buzau") ? 0.9 : p.split("/").length > 2 ? 0.6 : 0.8);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (process.env.NEXT_PUBLIC_COMING_SOON === "true") return [];
  const entries: MetadataRoute.Sitemap = [...STATIC, ...(await loadCategorySummaries().catch(() => [])).map((c) => `/${c.slug}`)].map((p) => ({
    url: SITE + p,
    priority: priorityOf(p),
  }));
  try {
    const client = db();
    const [{ data: posts }, { data: products }] = await Promise.all([
      client.from("blog_posts").select("slug,published_at,updated_at").eq("status", "published"),
      client.from("products").select("slug,updated_at").not("slug", "is", null),
    ]);
    for (const p of (posts ?? []).filter((x) => !BLOG_CANONICAL[x.slug])) entries.push({ url: `${SITE}/blog/${p.slug}`, lastModified: p.updated_at ?? p.published_at ?? undefined, priority: 0.6 });
    for (const p of products ?? []) entries.push({ url: `${SITE}/products/${p.slug}`, lastModified: p.updated_at ?? undefined, priority: 0.6 });
  } catch {
    // DB down: serve the static part rather than failing the sitemap
  }
  return entries;
}

