// Makes a 480px WebP thumbnail next to each product's main photo in Supabase Storage (media/products/...):
//   <dir>/0.png  ->  <dir>/0.thumb.webp
// Additive only: never overwrites an existing file and never touches the database. The shop uses the thumbnail in
// grids (src/lib/thumb.ts) and falls back to the original photo when a thumbnail does not exist.
//
//   npx tsx --env-file=.env.local scripts/make-thumbnails.ts            # create the missing thumbnails
//   npx tsx --env-file=.env.local scripts/make-thumbnails.ts --dry-run  # only count
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."); process.exit(1); }
const dry = process.argv.includes("--dry-run");
const supabase = createClient(url, key, { auth: { persistSession: false } });

const BUCKET = "media";
const MARK = `/storage/v1/object/public/${BUCKET}/`;
const WIDTH = 480;
const stats = { products: 0, created: 0, existed: 0, skipped: 0, failed: 0 };

async function one(imageUrl: string) {
  const path = decodeURIComponent(imageUrl.split(MARK)[1]?.split("?")[0] ?? "");
  if (!path || !/\.(png|jpe?g|webp)$/i.test(path) || path.endsWith(".thumb.webp")) { stats.skipped++; return; }
  const thumbPath = path.replace(/\.(png|jpe?g|webp)$/i, ".thumb.webp");
  const dir = thumbPath.slice(0, thumbPath.lastIndexOf("/"));
  const name = thumbPath.slice(thumbPath.lastIndexOf("/") + 1);
  const { data: existing } = await supabase.storage.from(BUCKET).list(dir, { search: name, limit: 1 });
  if (existing?.some((f) => f.name === name)) { stats.existed++; return; }
  if (dry) { stats.created++; return; }
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`download ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const out = await sharp(buf).resize({ width: WIDTH, withoutEnlargement: true }).webp({ quality: 78 }).toBuffer();
    const { error } = await supabase.storage.from(BUCKET).upload(thumbPath, out, { contentType: "image/webp", upsert: false, cacheControl: "31536000" });
    if (error) throw new Error(error.message);
    stats.created++;
  } catch (e) {
    stats.failed++;
    console.warn(`  failed ${path}: ${(e as Error).message}`);
  }
}

async function main() {
  const urls: string[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from("products").select("image_url").not("image_url", "is", null).range(from, from + 999);
    if (error) throw error;
    for (const r of data ?? []) if (r.image_url?.includes(MARK)) urls.push(r.image_url);
    if (!data || data.length < 1000) break;
  }
  stats.products = urls.length;
  console.log(`${urls.length} product photos in Storage${dry ? " (dry run)" : ""}`);
  const queue = [...urls];
  await Promise.all(Array.from({ length: 6 }, async () => { for (let u = queue.shift(); u; u = queue.shift()) await one(u); }));
  console.log(stats);
}
main().catch((e) => { console.error(e); process.exit(1); });
