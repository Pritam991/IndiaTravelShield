// Fetches the Ministry of Tourism "Foreign Tourist Arrivals by country and
// region, 2024" dataset from data.gov.in and saves a snapshot the site reads.
//
// The API key is NEVER stored in this repo. Pass it when you run the script:
//   DATAGOV_KEY=your-key node scripts/fetch-datagov-arrivals.mjs
// (or put DATAGOV_KEY=... in web/.env.local, which git ignores).
//
// The site does not call the API in the browser, so the key is never exposed.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const RESOURCE = "5bbc2b00-288e-4aa1-81ce-30c4ced91970";
const OUT = path.join(ROOT, "data", "ftas-2024.json");

function readKey() {
  if (process.env.DATAGOV_KEY) return process.env.DATAGOV_KEY.trim();
  const envFile = path.join(ROOT, ".env.local");
  if (fs.existsSync(envFile)) {
    const m = fs.readFileSync(envFile, "utf8").match(/^DATAGOV_KEY\s*=\s*(.+)$/m);
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  }
  return "";
}
const KEY = readKey();
if (!KEY) {
  console.error("No API key. Run: DATAGOV_KEY=your-key node scripts/fetch-datagov-arrivals.mjs");
  process.exit(1);
}
// Never print the key, even inside an error message.
const redact = (s) => String(s).split(KEY).join("[key]");

async function page(offset, limit = 100) {
  const url = `https://api.data.gov.in/resource/${RESOURCE}?api-key=${KEY}&format=json&limit=${limit}&offset=${offset}`;
  let last;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const j = await res.json();
      if (j.status && j.status !== "ok") throw new Error(`API status "${j.status}": ${j.message ?? ""}`);
      return j;
    } catch (e) {
      last = e;
      await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
  throw new Error(redact(last?.message ?? last));
}

// ---- fetch every page ----
const first = await page(0);
const total = Number(first.total);
let records = [...first.records];
while (records.length < total) {
  const j = await page(records.length);
  if (!j.records.length) break;
  records = records.concat(j.records);
}
if (records.length !== total) {
  throw new Error(`Expected ${total} records but got ${records.length}`);
}

// ---- structure: the dataset is a flat list with groups in the middle ----
const CONTINENTS = new Set(["Africa", "Americas", "Asia and the Pacific", "Europe", "Middle East", "Others Not Classified Elsewhere"]);
const SUBREGIONS = new Set([
  "North Africa", "Sub-Saharan Africa", "Caribbean", "Central America", "North America", "South America",
  "North-East Asia", "Oceania", "South Asia", "South-East Asia",
  "Central/Eastern Europe", "Northern Europe", "Southern/Medit. Europe", "Western Europe",
]);

// Only clear abbreviations and typos are expanded for display. Every row keeps
// its exact original text in sourceName, and political names are left alone.
const DISPLAY = {
  "Centr. African rep.": "Central African Republic",
  "Dem.rep. Congo": "Democratic Republic of the Congo",
  "Cote d'lvoire": "Côte d'Ivoire",
  "Sap Tome & Principe": "São Tomé & Príncipe",
  "Dominican Rep.": "Dominican Republic",
  "Neth. Antilles": "Netherlands Antilles",
  "St. Vincent & Gren.": "St. Vincent & the Grenadines",
  "Brit. Virgin Islands": "British Virgin Islands",
  "Rep. Moldova": "Republic of Moldova",
  "Bosnia & Herzg.": "Bosnia & Herzegovina",
  "Utd Arab Emirates": "United Arab Emirates",
  "Turkiye": "Türkiye",
  "Southern/Medit. Europe": "Southern and Mediterranean Europe",
};
const slug = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const num = (v, what) => {
  const n = Number(v === "" || v == null ? NaN : v);
  if (!Number.isFinite(n)) throw new Error(`Not a number for ${what}: ${JSON.stringify(v)}`);
  return n;
};

const rows = [];
let continent = null, sub = null, grandTotal = null, grandTotalRegions = null;
for (const r of records) {
  const sourceName = String(r.country_territory ?? "").trim();
  const arrivals = num(r.arrivals__in_numbers_, sourceName);
  const regions = {
    north: num(r.north__in_percentage_, sourceName),
    south: num(r.south__in_percentage_, sourceName),
    westCentral: num(r.west_and_central__in_percentage_, sourceName),
    east: num(r.east__in_percentage_, sourceName),
    northEast: num(r.north_east__in_percentage_, sourceName),
  };
  // The published all-visitors split. Stored as published, not recomputed.
  if (sourceName === "Grand Total") { grandTotal = arrivals; grandTotalRegions = regions; continue; }
  let level = "country";
  if (CONTINENTS.has(sourceName)) { level = "continent"; continent = sourceName; sub = null; }
  else if (SUBREGIONS.has(sourceName)) { level = "subregion"; sub = sourceName; }
  const name = DISPLAY[sourceName] ?? sourceName;
  rows.push({
    id: slug(name),
    n: rows.length + 1,
    name,
    sourceName,
    level,
    continent: level === "continent" ? null : continent,
    subregion: level === "country" ? sub : null,
    arrivals,
    regions,
  });
}
if (grandTotal == null) throw new Error("No Grand Total row found");

// ---- consistency checks: do the parts add up to the whole? ----
const sum = (xs) => xs.reduce((a, b) => a + b.arrivals, 0);
const mismatches = [];
const check = (label, parent, kids) => {
  const s = sum(kids);
  if (s !== parent) mismatches.push({ label, stated: parent, sumOfParts: s, difference: parent - s });
};
const conts = rows.filter((r) => r.level === "continent");
check("Continents vs Grand Total", grandTotal, conts);
for (const c of conts) {
  const kids = rows.filter((r) => r.continent === c.sourceName && (r.level === "subregion" || (r.level === "country" && !r.subregion)));
  if (kids.length) check(`${c.sourceName} vs its parts`, c.arrivals, kids);
}
for (const s of rows.filter((r) => r.level === "subregion")) {
  check(`${s.sourceName} vs its countries`, s.arrivals, rows.filter((r) => r.subregion === s.sourceName));
}
const badPct = rows.filter((r) => {
  const t = Object.values(r.regions).reduce((a, b) => a + b, 0);
  return r.arrivals > 0 && Math.abs(t - 100) > 1;
}).map((r) => r.sourceName);

const meta = first;
const out = {
  meta: {
    title: meta.title,
    organisation: (meta.org ?? []).join(", "),
    sector: (meta.sector ?? []).join(", "),
    resourceId: RESOURCE,
    publisher: "data.gov.in",
    year: 2024,
    apiUpdated: meta.updated ? new Date(Number(meta.updated) * 1000).toISOString() : null,
    fetchedOn: new Date().toISOString().slice(0, 10),
    recordCount: total,
    grandTotal,
    grandTotalRegions,
    checks: {
      allPartsAddUp: mismatches.length === 0,
      mismatches,
      rowsWhoseRegionPercentagesMissHundred: badPct,
    },
  },
  rows,
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

console.log(`Saved ${rows.length} rows (${total} records incl. Grand Total) -> data/ftas-2024.json`);
console.log(`Grand total: ${grandTotal.toLocaleString("en-US")}   dataset updated: ${out.meta.apiUpdated}`);
console.log(`Levels: ${conts.length} continents, ${rows.filter((r) => r.level === "subregion").length} sub-regions, ${rows.filter((r) => r.level === "country").length} countries`);
console.log(`Parts add up to wholes: ${mismatches.length === 0 ? "yes, everywhere" : "NO, " + mismatches.length + " mismatch(es)"}`);
mismatches.forEach((m) => console.log("   ", m.label, "stated", m.stated, "parts", m.sumOfParts, "diff", m.difference));
console.log(`Rows whose five region % miss 100 by more than 1: ${badPct.length}`);
