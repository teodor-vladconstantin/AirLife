// Tells Bing and other IndexNow engines about every URL in the live sitemap. Run after a deploy:
//   npm run indexnow
// The key file lives in public/<key>.txt (must be reachable at https://airlife.ro/<key>.txt).
import { readdirSync, readFileSync } from "node:fs";

const SITE = "https://airlife.ro";
const keyFile = readdirSync("public").find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("IndexNow key file not found in public/");
const key = keyFile.replace(".txt", "");

const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: "airlife.ro", key, keyLocation: `${SITE}/${keyFile}`, urlList }),
});
console.log(`[indexnow] ${urlList.length} URLs -> HTTP ${res.status}`);
