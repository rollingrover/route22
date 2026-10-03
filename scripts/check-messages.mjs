// Run: node scripts/check-messages.mjs — fails if any locale file is missing
// keys, has extra keys, mismatched {placeholders}/<tags>, or a straight
// apostrophe (ICU trap that once broke a Vercel build on ethlathini.co.za).
import fs from "node:fs";
const dir = new URL("../messages/", import.meta.url);
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
const load = (f) => JSON.parse(fs.readFileSync(new URL(f, dir), "utf8"));
const flat = (o, p = "") => Object.entries(o).flatMap(([k, v]) => (typeof v === "object" ? flat(v, `${p}${k}.`) : [[`${p}${k}`, v]]));
const en = Object.fromEntries(flat(load("en.json")));
let bad = 0;
for (const f of files) {
  const m = Object.fromEntries(flat(load(f)));
  for (const k of Object.keys(en)) if (!(k in m)) { console.error(`${f}: missing ${k}`); bad++; }
  for (const k of Object.keys(m)) {
    if (!(k in en)) { console.error(`${f}: extra ${k}`); bad++; continue; }
    const ph = (s) => [...s.matchAll(/\{(\w+)/g), ...s.matchAll(/<(\w+)>/g)].map((x) => x[0]).sort().join();
    if (ph(m[k]) !== ph(en[k])) { console.error(`${f}: placeholder/tag mismatch ${k}`); bad++; }
    if (m[k].includes("'")) { console.error(`${f}: straight apostrophe in ${k}`); bad++; }
  }
}
console.log(bad ? `${bad} problem(s)` : `OK — ${files.length} locales, ${Object.keys(en).length} keys`);
process.exit(bad ? 1 : 0);
