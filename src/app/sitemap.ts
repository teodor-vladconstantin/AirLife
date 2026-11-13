import type { MetadataRoute } from "next";
import { CATEGORIES_DATA } from "@/data/categoriesData";
import { db } from "@/lib/catalog";

export const revalidate = 3600;

const SITE = "https://airlife.ro";
const STATIC = [
  "/", "/products", "/servicii", "/servicii/montaj-aer-conditionat", "/servicii/igienizare-aer-conditionat", "/servicii/service-aer-conditionat",
  "/ghid/igienizare-aer-conditionat", "/ghid/cost-montaj-aer-conditionat", "/blog", "/despre-noi", "/contact", "/livrare-si-retur", "/garantie",
  "/termeni-si-conditii", "/politica-de-confidentialitate", "/politica-de-cookies",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (process.env.NEXT_PUBLIC_COMING_SOON === "true") return [];
  const entries: MetadataRoute.Sitemap = [...STATIC, ...Object.keys(CATEGORIES_DATA).map((s) => `/${s}`)].map((p) => ({
    url: SITE + p,
    priority: p === "/" ? 1 : p.split("/").length > 2 ? 0.6 : 0.8,
  }));
  try {
    const client = db();
    const [{ data: posts }, { data: products }] = await Promise.all([
      client.from("blog_posts").select("slug,published_at,updated_at").eq("status", "published"),
      client.from("products").select("slug").not("slug", "is", null),
    ]);
    for (const p of posts ?? []) entries.push({ url: `${SITE}/blog/${p.slug}`, lastModified: p.updated_at ?? p.published_at ?? undefined, priority: 0.6 });
    for (const p of products ?? []) entries.push({ url: `${SITE}/products/${p.slug}`, priority: 0.6 });
  } catch {
    // DB down: serve the static part rather than failing the sitemap
  }
  return entries;
}
