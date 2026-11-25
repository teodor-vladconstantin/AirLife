// Turns the scraped plain-text product descriptions into structured blocks (paragraphs, subheadings, bullet lists,
// key/value tables, tag rows) so the product page can render them consistently. Pure text in, text out: nothing is
// rendered as HTML. Navigation labels copied from the source shop ("Manual utilizare", "Ghiduri și informații utile"...)
// carry no information for a visitor and are dropped.

export type DescBlock =
  | { kind: "p"; text: string; lead?: boolean }
  | { kind: "h"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "kv"; rows: [string, string][] }
  | { kind: "tags"; items: string[] };

const fold = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim();
const DROP = new Set(["manual utilizare", "ghiduri si informatii utile", "vezi specificatiile", "vezi dimensiunile", "detalii si documentatie", "specificatii tehnice"]);
const DROP_START = /^momentan acest produs nu are un manual/i;
const KV_WORDS = /^(culoare|diametru|dimensiuni|greutate|putere|alimentare|material|tensiune|debit|presiune|nivel|lungime|latime|inaltime|grosime|clasa|capacitate|garantie|tip|model|cod|autonomie|zgomot|frecventa|consum)/i;

type Tok = { t: "li" | "kv" | "short" | "p"; text: string; k?: string; v?: string };

const isUpper = (s: string) => /[A-ZĂÂÎȘȚ]{3}/.test(s) && s === s.toUpperCase();

function tokenize(raw: string): Tok[] {
  const toks: Tok[] = [];
  for (const rawLine of raw.replace(/\r\n?/g, "\n").split("\n")) {
    const line = rawLine.replace(/\s+/g, " ").trim();
    if (!line) continue;
    const key = fold(line);
    if (DROP.has(key) || DROP_START.test(line)) continue;
    if (line.includes("•") && !isUpper(line)) {
      const parts = line.split("•").map((x) => x.trim()).filter(Boolean);
      if (!line.startsWith("•") && parts.length) toks.push({ t: parts[0].length > 70 ? "p" : "short", text: parts.shift()! });
      for (const p of parts) toks.push({ t: "li", text: p });
      continue;
    }
    if (/^[-–—]\s+\S/.test(line)) { toks.push({ t: "li", text: line.replace(/^[-–—]\s+/, "") }); continue; }
    const m = line.match(/^([^:–—-]{2,30}?)\s*(:|–|—| - )\s*(\S.{0,70})$/);
    if (m && line.length <= 100 && m[1].trim().split(" ").length <= 4 && (m[2] === ":" || KV_WORDS.test(fold(m[1])))) {
      toks.push({ t: "kv", text: line, k: m[1].trim(), v: m[3].trim() });
      continue;
    }
    if (line.length <= 60 && !/[.!]$/.test(line)) { toks.push({ t: "short", text: line }); continue; }
    toks.push({ t: "p", text: line });
  }
  return toks;
}

export function parseDescription(raw: string): DescBlock[] {
  const toks = tokenize(raw || "");
  const out: DescBlock[] = [];
  for (let i = 0; i < toks.length; ) {
    const t = toks[i];
    if (t.t === "li") {
      const items: string[] = [];
      while (i < toks.length && toks[i].t === "li") items.push(toks[i++].text);
      out.push({ kind: "list", items });
    } else if (t.t === "kv") {
      const rows: [string, string][] = [];
      while (i < toks.length && toks[i].t === "kv") { rows.push([toks[i].k!, toks[i].v!]); i++; }
      if (rows.length >= 2) out.push({ kind: "kv", rows });
      else out.push({ kind: "p", text: rows[0].join(": ") });
    } else if (t.t === "short") {
      const group: string[] = [];
      let j = i;
      while (j < toks.length && toks[j].t === "short") group.push(toks[j++].text);
      const next = toks[j];
      if (group.length === 1 || (next && next.t !== "short" && group.length === 1)) {
        out.push({ kind: "h", text: group[0] });
      } else {
        // several short lines in a row: a heading if a paragraph/list follows the last one, the rest are items
        const lead = next && next.t !== "short" ? group.pop()! : null;
        const allTiny = group.every((g) => g.length <= 16);
        if (group.length === 1) out.push({ kind: "h", text: group[0] });
        else if (group.length) out.push(allTiny ? { kind: "tags", items: group } : { kind: "list", items: group });
        if (lead) out.push({ kind: "h", text: lead });
      }
      i = j;
    } else {
      out.push({ kind: "p", text: t.text });
      i++;
    }
  }
  const firstP = out.findIndex((b) => b.kind === "p");
  if (firstP === 0 || (firstP > 0 && out.slice(0, firstP).every((b) => b.kind === "h"))) {
    const b = out[firstP];
    if (b && b.kind === "p" && b.text.length > 80) b.lead = true;
  }
  // a heading with nothing after it is just a sentence fragment: show it as a paragraph
  return out.map((b, k) => (b.kind === "h" && k === out.length - 1 ? { kind: "p", text: b.text } : b));
}

const norm = (s: string) => fold(s).replace(/[^a-z0-9 ]/g, "");
// Features that already appear as bullets in the description are not listed a second time.
export function extraFeatures(features: string[], blocks: DescBlock[]): string[] {
  const seen = new Set<string>();
  for (const b of blocks) if (b.kind === "list" || b.kind === "tags") b.items.forEach((x) => seen.add(norm(x)));
  return features.filter((f) => !seen.has(norm(f)));
}
