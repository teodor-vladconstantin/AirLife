// Copies the product photos imported from ecovent.ro (cdn.shopify.com) into the public Supabase Storage bucket "media"
// and points products.image_url / products.gallery at the copies, so the shop no longer depends on their CDN.
//
// Run it on your own machine (it needs the service key; never commit it):
//   SUPABASE_URL=https://<project>.supabase.co SUPABASE_SERVICE_ROLE_KEY=<service key> npx tsx scripts/mirror-ecovent-images.ts
// Options: --dry (only count, change nothing) · --limit 20 (first 20 products, to try it) · --concurrency 3 · --max-photos 6 (photos kept per product)
//
// Safe to run again: products whose photos all live in Supabase are skipped, and photos are stored under a fixed path
// (products/ecovent/<slug>/<n>.<ext>, upsert). A photo that fails to download or upload keeps its original URL.
import { createClient } from "@supabase/supabase-js";

const args = process.argv.slice(2);
const flag = (n: string) => args.includes(`--${n}`);
const num = (n: string, d: number) => { const i = args.indexOf(`--${n}`); return i >= 0 ? Number(args[i + 1]) : d; };

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
// SUPABASE_KEY_VIA_PROXY=1: the service key is added to the request by a network proxy (the cloud sandbox), so the script
// never holds it and must not send its own Authorization header. Normal use: set SUPABASE_SERVICE_ROLE_KEY.
const viaProxy = process.env.SUPABASE_KEY_VIA_PROXY === "1";
const key = viaProxy ? "proxy-injected" : process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."); process.exit(1); }
const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
  ...(viaProxy ? { global: { fetch: (input: RequestInfo | URL, init?: RequestInit) => { const h = new Headers(init?.headers); h.delete("authorization"); return fetch(input, { ...init, headers: h }); } } } : {}),
});

const BUCKET = "media";
const SOURCE = "cdn.shopify.com";
const EXT: Record<string, string> = { "image/webp": "webp", "image/png": "png", "image/jpeg": "jpg", "image/gif": "gif", "image/avif": "avif" };
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function download(src: string): Promise<{ bytes: ArrayBuffer; type: string } | null> {
  // Ask the CDN for at most 1600 px wide (it never upscales); fall back to the original file.
  const resized = `${src}${src.includes("?") ? "&" : "?"}width=1600`;
  for (const candidate of [resized, src]) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetch(candidate, { headers: { "User-Agent": "airlife-catalog-import/1.0" } });
        const type = (res.headers.get("content-type") ?? "").split(";")[0].trim();
        if (res.ok && EXT[type]) return { bytes: await res.arrayBuffer(), type };
        if (res.status === 404 || res.status === 400) break; // try the original, or give up
      } catch { /* network hiccup: retry */ }
      await sleep(500 * attempt);
    }
  }
  return null;
}

type Row = { id: string; slug: string; image_url: string | null; gallery: string[] | null };
const stats = { products: 0, photos: 0, failed: 0, skipped: 0 };

async function mirrorProduct(p: Row) {
  const urls = [p.image_url, ...(p.gallery ?? [])].filter((u): u is string => !!u).slice(0, num("max-photos", 6));
  const out: string[] = [];
  for (let i = 0; i < urls.length; i++) {
    const src = urls[i];
    if (!src.includes(SOURCE)) { out.push(src); continue; }
    const file = await download(src);
    if (!file) { stats.failed++; out.push(src); continue; }
    const path = `products/ecovent/${p.slug}/${i}.${EXT[file.type]}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file.bytes, { contentType: file.type, upsert: true, cacheControl: "31536000" });
    if (error) { stats.failed++; out.push(src); console.warn(`  upload failed (${path}): ${error.message}`); continue; }
    out.push(supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
    stats.photos++;
    await sleep(120); // be gentle with their CDN
  }
  const { error } = await supabase.from("products").update({ image_url: out[0] ?? null, gallery: out.slice(1) }).eq("id", p.id);
  if (error) console.warn(`  could not update ${p.slug}: ${error.message}`);
  stats.products++;
  if (stats.products % 10 === 0) console.log(`  ${stats.products} products, ${stats.photos} photos copied, ${stats.failed} failed`);
}

(async () => {
  const todo: Row[] = [];
  for (let from = 0; ; from += 500) {
    const { data, error } = await supabase.from("products").select("id,slug,image_url,gallery").not("slug", "is", null).order("slug").range(from, from + 499);
    if (error) { console.error(error.message); process.exit(1); }
    for (const r of (data ?? []) as Row[]) {
      if ([r.image_url, ...(r.gallery ?? [])].some((u) => u?.includes(SOURCE))) todo.push(r); else stats.skipped++;
    }
    if ((data ?? []).length < 500) break;
  }
  const work = todo.slice(0, num("limit", Infinity));
  const photos = work.reduce((n, p) => n + [p.image_url, ...(p.gallery ?? [])].filter((u) => u?.includes(SOURCE)).length, 0);
  console.log(`${work.length} products to process (${photos} photos); ${stats.skipped} already on Supabase.`);
  if (flag("dry")) return;

  const queue = [...work];
  await Promise.all(Array.from({ length: num("concurrency", 3) }, async () => { for (let p = queue.shift(); p; p = queue.shift()) await mirrorProduct(p); }));
  console.log(`Done: ${stats.products} products, ${stats.photos} photos copied, ${stats.failed} failed${stats.failed ? " (run again to retry them)" : ""}.`);
})();
