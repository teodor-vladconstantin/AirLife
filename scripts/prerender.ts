// Runs after `vite build`. Writes dist/<path>/index.html for blog + programmatic pages with real
// content, title, meta and JSON-LD already in the HTML, so crawlers do not depend on JS rendering.
// React replaces #root on load (createRoot), so there is no hydration to keep in sync.
// Vercel serves these files before the SPA rewrite. Also regenerates dist/sitemap.xml.
// Blog markdown comes from admins only and is not sanitised here.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { loadEnv } from "vite";
import { createClient } from "@supabase/supabase-js";
import { marked } from "marked";
import { CATEGORIES_DATA } from "../src/data/categoriesData";
import { allLocalPaths, getLocalPage, PHONE_DISPLAY, PHONE_TEL } from "../src/data/localSeo";

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
  return h.replace('<div id="root"></div>', `<div id="root"><main style="max-width:48rem;margin:0 auto;padding:2rem 1rem;font-family:Inter,sans-serif">${p.body}</main></div>`);
};

const write = (path: string, html: string) => {
  const file = join(DIST, path, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
};

const pages: Page[] = [];

// --- programmatic local pages
for (const path of allLocalPaths()) {
  const [, , service, locality] = path.split("/");
  const lp = getLocalPage(service, locality)!;
  pages.push({
    path,
    title: lp.title,
    description: lp.description,
    jsonLd: [
      { "@context": "https://schema.org", "@type": "Service", name: lp.h1, provider: { "@type": "HVACBusiness", name: "AirLife", telephone: PHONE_TEL, url: `${SITE}/` } },
      { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: lp.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
    body: `<h1>${esc(lp.h1)}</h1><p>${esc(lp.intro)}</p><p>${esc(lp.localNote)}</p>
<p><a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a> · <a href="/request-quote">Cere ofertă online</a></p>
<h2>Ce include</h2><ul>${lp.includes.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
<h2>Cum decurge</h2><ol>${lp.steps.map((i) => `<li>${esc(i)}</li>`).join("")}</ol>
<h2>Întrebări frecvente</h2>${lp.faqs.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("")}
<h2>Vezi și</h2><ul>${lp.related.map((r) => `<li><a href="${r.path}">${esc(r.label)}</a></li>`).join("")}</ul>`,
  });
}

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

  pages.push({
    path: "/blog",
    title: "Blog | Sfaturi aer condiționat Buzău | AirLife",
    description: "Ghiduri practice despre alegerea, montajul, igienizarea și service-ul aerului condiționat. Sfaturi de la specialiștii AirLife din Buzău.",
    body: `<h1>Blog AirLife</h1><ul>${posts.map((p) => `<li><a href="/blog/${p.slug}">${esc(p.title)}</a>${p.excerpt ? ` – ${esc(p.excerpt)}` : ""}</li>`).join("")}</ul>`,
  });
  for (const p of posts) {
    pages.push({
      path: `/blog/${p.slug}`,
      title: p.meta_title || `${p.title} | AirLife`,
      description: p.meta_description || p.excerpt || p.title,
      ogType: "article",
      ogImage: p.cover_image ?? undefined,
      jsonLd: [{
        "@context": "https://schema.org", "@type": "BlogPosting", headline: p.title,
        description: p.meta_description || p.excerpt, image: p.cover_image, datePublished: p.published_at, dateModified: p.updated_at,
        mainEntityOfPage: `${SITE}/blog/${p.slug}`,
        author: { "@type": "Organization", name: "AirLife" }, publisher: { "@type": "Organization", name: "AirLife", url: `${SITE}/` },
      }],
      body: `<article><h1>${esc(p.title)}</h1>${marked.parse(p.content, { async: false })}</article>`,
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
  }

  for (const p of products) {
    const feats = Array.isArray(p.features) ? (p.features as string[]) : [];
    const specs = Object.entries((p.specs ?? {}) as Record<string, string>);
    const cat = Object.values(CATEGORIES_DATA).find((c) => c.name === p.category);
    pages.push({
      path: `/products/${p.slug}`,
      title: `${p.name} | AirLife Magazin HVAC`,
      description: p.description.slice(0, 155),
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

// --- write pages + sitemap
const shell = readFileSync(join(DIST, "index.html"), "utf8");
for (const p of pages) write(p.path, render(shell, p));

const today = new Date().toISOString().slice(0, 10);
const existing = [...readFileSync(join(DIST, "sitemap.xml"), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, ""));
const paths = [...new Set([...existing, ...pages.map((p) => p.path)])];
const prio = (p: string) => (p === "/" ? "1.0" : p.startsWith("/blog/") || p.split("/").length > 3 ? "0.6" : "0.8");
writeFileSync(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
    .map((p) => `  <url><loc>${SITE}${p}</loc><lastmod>${today}</lastmod><priority>${prio(p)}</priority></url>`)
    .join("\n")}\n</urlset>\n`,
);
console.log(`[prerender] ${pages.length} pages, ${paths.length} sitemap URLs`);
