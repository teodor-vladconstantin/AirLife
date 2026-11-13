// Runs after `vite build`. Writes dist/<path>/index.html for blog, category and product pages with real
// content, title, meta and JSON-LD already in the HTML, so crawlers do not depend on JS rendering.
// React replaces #root on load (createRoot), so there is no hydration to keep in sync.
// Vercel serves these files before the SPA rewrite. Also regenerates dist/sitemap.xml.
// Blog markdown comes from admins only and is not sanitised here.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createServer, loadEnv } from "vite";
import { createClient } from "@supabase/supabase-js";
import { marked } from "marked";
import { bylineName } from "../src/data/author";
import { inCluster, orderedClusters } from "../src/data/blogClusters";
import { postSchemas, roDate } from "../src/lib/blogSchema";
import { CATEGORIES_DATA } from "../src/data/categoriesData";

const DIST = "dist";
const SITE = "https://airlife.ro";
const env = { ...loadEnv("production", process.cwd(), "VITE_"), ...process.env };

// Coming-soon builds must stay invisible: no static pages, no sitemap, crawlers told to stay away.
if (env.VITE_COMING_SOON === "true") {
  writeFileSync(join(DIST, "robots.txt"), "User-agent: *\nDisallow: /\n");
  writeFileSync(join(DIST, "sitemap.xml"), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n');
  const f = join(DIST, "index.html");
  writeFileSync(f, readFileSync(f, "utf8").replace('content="index, follow"', 'content="noindex, nofollow"'));
  console.log("[prerender] VITE_COMING_SOON=true: noindex + robots Disallow, no static pages");
  process.exit(0);
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

interface Page {
  path: string;
  title: string;
  description: string;
  ogType?: string;
  ogImage?: string;
  jsonLd?: unknown[];
  body: string;
  html?: string; // full server-rendered markup, replaces the plain body wrapper
}

const setMeta = (html: string, attr: "name" | "property", key: string, content: string) => {
  const tag = `<meta ${attr}="${key}" content="${esc(content)}" />`;
  const re = new RegExp(`<meta ${attr}="${key}"[^>]*>`);
  return re.test(html) ? html.replace(re, tag) : html.replace("</head>", `${tag}\n</head>`);
};

const render = (shell: string, p: Page) => {
  const url = `${SITE}${p.path}`;
  let h = shell.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(p.title)}</title>`);
  h = h.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`);
  h = setMeta(h, "name", "description", p.description);
  h = setMeta(h, "property", "og:title", p.title);
  h = setMeta(h, "property", "og:description", p.description);
  h = setMeta(h, "property", "og:url", url);
  h = setMeta(h, "property", "og:type", p.ogType ?? "website");
  h = setMeta(h, "name", "twitter:title", p.title);
  h = setMeta(h, "name", "twitter:description", p.description);
  if (p.ogImage) {
    h = setMeta(h, "property", "og:image", p.ogImage);
    h = setMeta(h, "name", "twitter:image", p.ogImage);
  }
  const ld = (p.jsonLd ?? []).map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join("\n");
  h = h.replace("</head>", `${ld}\n</head>`);
  if (p.html) return h.replace('<div id="root"></div>', () => `<div id="root">${p.html}</div>`);
  return h.replace('<div id="root"></div>', `<div id="root"><main style="max-width:48rem;margin:0 auto;padding:2rem 1rem;font-family:Inter,sans-serif">${p.body}</main></div>`);
};

const write = (path: string, html: string) => {
  const file = join(DIST, path, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
};

const pages: Page[] = [];
const lastmod = new Map<string, string>(); // only paths with a real modification date

// --- blog (from Supabase; a failure skips the blog but never fails the build)
try {
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY");
  const db = createClient(url, key);
  const { data, error } = await db
    .from("blog_posts")
    .select("slug,title,excerpt,content,cover_image,category,meta_title,meta_description,published_at,updated_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw error;
  const posts = data ?? [];
  const related = (p: (typeof posts)[number]) => {
    const rel = posts.filter((o) => o.category === p.category && o.slug !== p.slug).slice(0, 3);
    return rel.length ? `<h2>Citește și</h2><ul>${rel.map((o) => `<li><a href="/blog/${o.slug}">${esc(o.title)}</a></li>`).join("")}</ul>` : "";
  };

  pages.push({
    path: "/blog",
    title: "Blog | Sfaturi aer condiționat | AirLife",
    description: "Ghiduri practice despre alegerea, montajul, igienizarea și service-ul aerului condiționat. Sfaturi de la specialiștii AirLife.",
    body: `<h1>Blog AirLife</h1>${orderedClusters(posts).map((c) => `<h2>${esc(c)}</h2><ul>${inCluster(posts, c).map((p) => `<li><a href="/blog/${p.slug}">${esc(p.title)}</a>${p.excerpt ? ` – ${esc(p.excerpt)}` : ""}</li>`).join("")}</ul>`).join("")}`,
  });
  for (const p of posts) {
    lastmod.set(`/blog/${p.slug}`, String(p.updated_at ?? p.published_at).slice(0, 10));
    pages.push({
      path: `/blog/${p.slug}`,
      title: p.meta_title || `${p.title} | AirLife`,
      description: p.meta_description || p.excerpt || p.title,
      ogType: "article",
      ogImage: p.cover_image ?? undefined,
      jsonLd: postSchemas(p),
      body: `<article><h1>${esc(p.title)}</h1><p>De <strong>${esc(bylineName())}</strong> · Publicat ${roDate(p.published_at)}${roDate(p.updated_at) !== roDate(p.published_at) ? ` · Actualizat ${roDate(p.updated_at)}` : ""}</p>${marked.parse(p.content, { async: false })}</article>${related(p)}`,
    });
  }
} catch (e) {
  console.warn("[prerender] blog skipped:", (e as Error).message);
}

// --- categories + products (from Supabase, same failure policy as the blog)
for (const c of Object.values(CATEGORIES_DATA)) {
  pages.push({ path: `/${c.slug}`, title: c.title, description: c.metaDescription, body: `<h1>${esc(c.h1)}</h1><p>${esc(c.description)}</p>` });
}
try {
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY");
  const { data, error } = await createClient(url, key)
    .from("products")
    .select("slug,name,sku,brand,category,description,price,image_url,gallery,features,specs,stock")
    .not("slug", "is", null)
    .order("name");
  if (error) throw error;
  const products = data ?? [];

  for (const c of Object.values(CATEGORIES_DATA)) {
    const list = products.filter((p) => p.category === c.name);
    const page = pages.find((p) => p.path === `/${c.slug}`)!;
    page.body += `<ul>${list.map((p) => `<li><a href="/products/${p.slug}">${esc(p.name)}</a> – ${Number(p.price).toFixed(2)} RON</li>`).join("")}</ul>`;
    page.body += `<h2>${esc(c.buyingGuide.title)}</h2><ul>${c.buyingGuide.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
    page.jsonLd = [
      {
        "@context": "https://schema.org", "@type": "CollectionPage", name: c.h1, description: c.metaDescription, url: `${SITE}/${c.slug}`, inLanguage: "ro-RO",
        mainEntity: { "@type": "ItemList", numberOfItems: list.length, itemListElement: list.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}/products/${p.slug}`, name: p.name })) },
      },
      {
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Acasă", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: c.name, item: `${SITE}/${c.slug}` },
        ],
      },
    ];
  }

  // Google Merchant Center feed (RSS 2.0 + g: namespace). Shipping/returns are set in the Merchant account.
  const item = (p: (typeof products)[number]) => `<item>
<g:id>${esc(p.sku ?? p.slug)}</g:id><title>${esc(p.name.slice(0, 150))}</title><description>${esc(p.description.slice(0, 4900))}</description>
<link>${SITE}/products/${p.slug}</link>${p.image_url ? `<g:image_link>${esc(p.image_url)}</g:image_link>` : ""}
<g:availability>${p.stock > 0 ? "in_stock" : "out_of_stock"}</g:availability><g:price>${Number(p.price).toFixed(2)} RON</g:price>
<g:condition>new</g:condition>${p.brand ? `<g:brand>${esc(p.brand)}</g:brand>` : ""}${p.sku ? `<g:mpn>${esc(p.sku)}</g:mpn>` : ""}<g:identifier_exists>${p.brand && p.sku ? "yes" : "no"}</g:identifier_exists>
</item>`;
  writeFileSync(
    join(DIST, "merchant-feed.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel><title>AirLife</title><link>${SITE}</link><description>Catalog AirLife</description>
${products.filter((p) => p.price > 0).map(item).join("\n")}
</channel></rss>
`,
  );

  for (const p of products) {
    const feats = Array.isArray(p.features) ? (p.features as string[]) : [];
    const specs = Object.entries((p.specs ?? {}) as Record<string, string>);
    const cat = Object.values(CATEGORIES_DATA).find((c) => c.name === p.category);
    pages.push({
      path: `/products/${p.slug}`,
      title: p.name.length + 10 <= 65 ? `${p.name} | AirLife` : p.name,
      description: ((d) => (d.length > 158 ? d.slice(0, 158).replace(/\s+\S*$/, "…") : d))(`${p.name}. ${p.description}`),
      ogType: "product",
      ogImage: p.image_url ?? undefined,
      jsonLd: [
        {
          "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.description,
          image: p.gallery?.length ? p.gallery : p.image_url, sku: p.sku ?? undefined,
          brand: { "@type": "Brand", name: p.brand ?? "AirLife" },
          offers: {
            "@type": "Offer", url: `${SITE}/products/${p.slug}`, priceCurrency: "RON", price: Number(p.price).toFixed(2),
            availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition", seller: { "@type": "Organization", name: "AirLife" },
            // mirrors /livrare-si-retur: 20 RON under 1000 RON, free above; 24-48 working hours; 14-day return (OUG 34/2014)
            shippingDetails: {
              "@type": "OfferShippingDetails",
              shippingRate: { "@type": "MonetaryAmount", value: Number(p.price) >= 1000 ? 0 : 20, currency: "RON" },
              shippingDestination: { "@type": "DefinedRegion", addressCountry: "RO" },
              deliveryTime: {
                "@type": "ShippingDeliveryTime",
                handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
                transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" },
              },
            },
            hasMerchantReturnPolicy: {
              "@type": "MerchantReturnPolicy", applicableCountry: "RO", returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
              merchantReturnDays: 14, returnMethod: "https://schema.org/ReturnByMail", returnFees: "https://schema.org/ReturnShippingFees",
            },
          },
        },
        {
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Acasă", item: `${SITE}/` },
            ...(cat ? [{ "@type": "ListItem", position: 2, name: cat.name, item: `${SITE}/${cat.slug}` }] : []),
            { "@type": "ListItem", position: cat ? 3 : 2, name: p.name, item: `${SITE}/products/${p.slug}` },
          ],
        },
      ],
      body: `<h1>${esc(p.name)}</h1>${p.image_url ? `<img src="${esc(p.image_url)}" alt="${esc(p.name)}" width="480">` : ""}
<p><strong>${Number(p.price).toFixed(2)} RON</strong></p><p>${esc(p.description)}</p>
${feats.length ? `<ul>${feats.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>` : ""}
${specs.length ? `<table>${specs.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</table>` : ""}`,
    });
  }
} catch (e) {
  console.warn("[prerender] products skipped:", (e as Error).message);
}

// --- static React pages (home, services, guides, about, contact...) rendered with Vite SSR
// supabase client touches localStorage at import time; a no-op stub is enough on the server
(globalThis as { localStorage?: unknown }).localStorage ??= { getItem: () => null, setItem: () => {}, removeItem: () => {} };
try {
  const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
  try {
    const { renderPage, staticPaths } = await vite.ssrLoadModule("/src/prerender-entry.tsx");
    for (const path of staticPaths as string[]) {
      const { html, seo } = renderPage(path);
      if (!seo) { console.warn(`[prerender] ${path}: no SEO props, skipped`); continue; }
      const ld = seo.structuredData ? (Array.isArray(seo.structuredData) ? seo.structuredData : [seo.structuredData]) : [];
      pages.push({ path, title: seo.title, description: seo.description, ogImage: seo.ogImage, jsonLd: ld, body: "", html });
    }
  } finally {
    await vite.close();
  }
} catch (e) {
  console.warn("[prerender] static pages skipped:", (e as Error).message);
}

// --- write pages + sitemap
const shell = readFileSync(join(DIST, "index.html"), "utf8");
// Vite SSR emits dev asset URLs (/src/assets/x.webp); point them at the hashed files from the client build.
const assetMap = new Map<string, string>();
for (const f of readdirSync(join(DIST, "assets"))) {
  const m = f.match(/^(.+)-[\w-]{8}\.(\w+)$/);
  if (m) assetMap.set(`${m[1]}.${m[2]}`, f);
}
const fixAssets = (h: string) => h.replace(/\/src\/assets\/([\w.-]+)/g, (m, f) => (assetMap.has(f) ? `/assets/${assetMap.get(f)}` : m));
for (const p of pages) write(p.path, fixAssets(render(shell, p)));

const existing = [...readFileSync(join(DIST, "sitemap.xml"), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, ""));
const paths = [...new Set([...existing, ...pages.map((p) => p.path)])];
const prio = (p: string) => (p === "/" ? "1.0" : p.startsWith("/blog/") || p.split("/").length > 3 ? "0.6" : "0.8");
writeFileSync(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
    .map((p) => `  <url><loc>${SITE}${p}</loc>${lastmod.has(p) ? `<lastmod>${lastmod.get(p)}</lastmod>` : ""}<priority>${prio(p)}</priority></url>`)
    .join("\n")}\n</urlset>\n`,
);
console.log(`[prerender] ${pages.length} pages, ${paths.length} sitemap URLs`);
