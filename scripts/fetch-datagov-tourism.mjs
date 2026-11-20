// Fetches five Ministry of Tourism datasets from data.gov.in and saves a
// cleaned snapshot the site reads at build time:
//   - state/UT-wise foreign and domestic tourist VISITS, 2023 and 2024
//   - visitors to centrally protected ticketed monuments (ASI), 2023-24 and 2024-25
//   - airport-wise foreign tourist arrivals, 2024
//   - peak and lean month of arrivals from the top source countries, 2024
//   - year-wise visits, 1991 to 2024
//
// The API key is NEVER stored in this repo. Run:
//   DATAGOV_KEY=your-key node scripts/fetch-datagov-tourism.mjs
// (or put DATAGOV_KEY=... in web/.env.local, which git ignores).
//
// Why a cleaning step: the published tables mix real rows with subtotal rows
// ("Total", "Overall", "Grand Total"). Ranking without removing them puts a
// subtotal at #1. This script drops them, then CHECKS that the real rows add
// back up to the published totals, and records the result in meta.checks.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "data", "tourism-2024.json");

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
  console.error("No API key. Run: DATAGOV_KEY=your-key node scripts/fetch-datagov-tourism.mjs");
  process.exit(1);
}
const redact = (s) => String(s).split(KEY).join("[key]");

const RES = {
  states: "515c5fea-46b9-438e-b8c3-db01d4afc8c4",
  monuments: "33998e59-7b58-4659-a427-23f75088757d",
  airports: "625365ed-0b19-41a4-9276-f9f52efcf3c7",
  peakLean: "1e0c4690-cb51-4f7f-bbf0-04f5a36c01ff",
  yearly: "146c04bc-ef3a-4693-8dff-c1219e95b787",
};

async function fetchAll(id) {
  let out = [], first = null, total = Infinity;
  for (let offset = 0; offset < total; offset += 100) {
    const url = `https://api.data.gov.in/resource/${id}?api-key=${KEY}&format=json&limit=100&offset=${offset}`;
    let j, last;
    for (let attempt = 1; attempt <= 4; attempt++) {
      try {
        const res = await fetch(url, { headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        j = await res.json();
        if (j.status && j.status !== "ok") throw new Error(`API status "${j.status}"`);
        break;
      } catch (e) { last = e; j = null; await new Promise((r) => setTimeout(r, 1500 * attempt)); }
    }
    if (!j) throw new Error(redact(last?.message ?? last));
    first ??= j;
    total = Number(j.total);
    out = out.concat(j.records);
    if (!j.records.length) break;
  }
  if (out.length !== total) throw new Error(`${id}: expected ${total} records, got ${out.length}`);
  return { meta: first, records: out };
}

const clean = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
const numOrNull = (v) => (v === "" || v == null || isNaN(Number(v)) ? null : Number(v));
const isRealRow = (r) => /^\d+$/.test(String(r.sl__no_ ?? "").trim());
const iso = (u) => (u ? new Date(Number(u) * 1000).toISOString().slice(0, 10) : null);
const slug = (s) => clean(s).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const checks = [];
const check = (label, parts, whole, tol = 0) => {
  const ok = Math.abs(parts - whole) <= tol;
  checks.push({ label, parts, published: whole, ok });
  return ok;
};

// ---------- states ----------
const S = await fetchAll(RES.states);
const stateRows = S.records.filter(isRealRow).map((r) => ({
  name: clean(r.state_ut),
  region: clean(r.category),
  foreign2024: numOrNull(r._2024___foreign__in_million_),
  foreign2023: numOrNull(r._2023___foreign__in_million_),
  domestic2024: numOrNull(r._2024___domestic__in_million_),
  domestic2023: numOrNull(r._2023___domestic__in_million_),
  foreignGrowthPct: numOrNull(r.growth_rate___ftv_2024_23),
  foreignSharePct: numOrNull(r.percentage_share_2024___ftv),
  domesticSharePct: numOrNull(r.percentage_share_2024___dtv),
}));
const overall = S.records.find((r) => r.sl__no_ === "Overall");
check("State foreign visits 2024 (millions): 36 states vs published Overall",
  +stateRows.reduce((a, r) => a + (r.foreign2024 ?? 0), 0).toFixed(3), numOrNull(overall._2024___foreign__in_million_), 0.01);
check("State foreign-visit shares add to 100%",
  +stateRows.reduce((a, r) => a + (r.foreignSharePct ?? 0), 0).toFixed(2), 100, 0.1);

// ---------- monuments ----------
const M = await fetchAll(RES.monuments);
const monuments = M.records.filter(isRealRow).map((r) => ({
  name: clean(r.name_of_the_monuments),
  circle: clean(r.category),
  foreign2425: numOrNull(r._2024_25___foreign),
  foreign2324: numOrNull(r._2023_24___foreign),
  domestic2425: numOrNull(r._2024_25___domestic),
  foreignGrowthPct: numOrNull(r.percentage_growth_2024_25_2023_24___foreign),
}));
const mGrand = M.records.find((r) => r.sl__no_ === "Grand Total");
check("Monuments foreign visitors 2024-25: 145 monuments vs published Grand Total",
  monuments.reduce((a, r) => a + (r.foreign2425 ?? 0), 0), numOrNull(mGrand._2024_25___foreign));
const monumentsGrand = {
  foreign2425: numOrNull(mGrand._2024_25___foreign),
  foreign2324: numOrNull(mGrand._2023_24___foreign),
  domestic2425: numOrNull(mGrand._2024_25___domestic),
};
const monumentsNoData = monuments.filter((m) => m.foreign2425 == null).map((m) => m.name);

// ---------- airports ----------
const A = await fetchAll(RES.airports);
const airportRows = A.records.filter(isRealRow).map((r) => ({
  name: clean(r.airport), id: slug(r.airport), ftas: numOrNull(r.ftas), sharePct: numOrNull(r.percentage_share),
}));
const airOthers = A.records.find((r) => clean(r.sl__no_) === "Others");
const airTotal = A.records.find((r) => /Total FTAs/i.test(clean(r.sl__no_)));
check("Airport arrivals: 20 airports + Others vs published air-mode total",
  airportRows.reduce((a, r) => a + (r.ftas ?? 0), 0) + numOrNull(airOthers.ftas), numOrNull(airTotal.ftas));
const airports = { rows: airportRows, others: numOrNull(airOthers.ftas), airModeTotal: numOrNull(airTotal.ftas) };

// ---------- peak / lean ----------
const P = await fetchAll(RES.peakLean);
const peakLean = P.records.map((r) => ({
  country: clean(r.country),
  peakMonth: clean(r.peak_month), peakSharePct: numOrNull(r.peak_month__percentage_share_),
  leanMonth: clean(r.lean_month), leanSharePct: numOrNull(r.lean_month__percentage_share_),
}));

// ---------- yearly ----------
const Y = await fetchAll(RES.yearly);
const yearly = Y.records.map((r) => ({
  year: numOrNull(r.year),
  domestic: numOrNull(r.tourist_visits___domestic),
  foreign: numOrNull(r.tourist_visits___foreign),
}));
const y24 = yearly.find((y) => y.year === 2024);
check("Year-wise 2024 foreign visits vs state table Overall",
  y24.foreign, Math.round(numOrNull(overall._2024___foreign__in_million_) * 1e6), 5000);

const src = (m, id) => ({ title: clean(m.title), resourceId: id, updated: iso(m.updated), url: `https://www.data.gov.in/resource/${id}` });
const out = {
  meta: {
    organisation: "Ministry of Tourism",
    publisher: "data.gov.in",
    fetchedOn: new Date().toISOString().slice(0, 10),
    sources: {
      states: src(S.meta, RES.states), monuments: src(M.meta, RES.monuments), airports: src(A.meta, RES.airports),
      peakLean: src(P.meta, RES.peakLean), yearly: src(Y.meta, RES.yearly),
    },
    checks,
    allChecksPass: checks.every((c) => c.ok),
    monumentsWithNoForeignFigure: monumentsNoData,
  },
  states: stateRows,
  stateOverall: {
    foreign2024: numOrNull(overall._2024___foreign__in_million_),
    foreign2023: numOrNull(overall._2023___foreign__in_million_),
    domestic2024: numOrNull(overall._2024___domestic__in_million_),
  },
  monuments,
  monumentsGrand,
  airports,
  peakLean,
  yearly,
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

console.log(`Saved -> data/tourism-2024.json`);
console.log(`states ${stateRows.length} | monuments ${monuments.length} | airports ${airportRows.length}+others | peak/lean ${peakLean.length} | years ${yearly.length}`);
for (const c of checks) console.log(`${c.ok ? "PASS" : "FAIL"}  ${c.label}: ${c.parts} vs ${c.published}`);
if (monumentsNoData.length) console.log(`No foreign figure published for: ${monumentsNoData.join("; ")}`);
if (!out.meta.allChecksPass) process.exitCode = 2;
