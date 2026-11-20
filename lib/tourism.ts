import json from "@/data/tourism-2024.json";
import { arrivalRows, type RegionKey } from "@/lib/arrivals";

export type StateRow = {
  name: string;
  region: string;
  foreign2024: number | null;
  foreign2023: number | null;
  domestic2024: number | null;
  foreignGrowthPct: number | null;
  foreignSharePct: number | null;
};
export type Monument = {
  name: string;
  circle: string;
  foreign2425: number | null;
  foreign2324: number | null;
  foreignGrowthPct: number | null;
};
export type Airport = { name: string; id: string; ftas: number | null; sharePct: number | null };

const data = json as unknown as {
  meta: {
    organisation: string;
    publisher: string;
    fetchedOn: string;
    allChecksPass: boolean;
    sources: Record<string, { title: string; resourceId: string; updated: string | null; url: string }>;
    monumentsWithNoForeignFigure: string[];
  };
  states: StateRow[];
  stateOverall: { foreign2024: number; foreign2023: number };
  monuments: Monument[];
  monumentsGrand: { foreign2425: number };
  airports: { rows: Airport[]; others: number; airModeTotal: number };
  peakLean: {
    country: string;
    peakMonth: string; peakSharePct: number | null;
    leanMonth: string; leanSharePct: number | null;
  }[];
};

export const tourism = data;
export const fmt = (n: number) => n.toLocaleString("en-US");
export const millionsLabel = (m: number) =>
  m >= 1 ? `${m.toFixed(2)} million` : fmt(Math.round(m * 1_000_000));

// ---------- states ----------
const ranked = [...data.states]
  .filter((s) => s.foreign2024 != null)
  .sort((a, b) => (b.foreign2024 ?? 0) - (a.foreign2024 ?? 0));

export const statesCount = ranked.length;
export const topStates = (n: number) => ranked.slice(0, n);
export const stateRow = (name: string) => data.states.find((s) => s.name === name) ?? null;
export const stateRank = (name: string) => {
  const i = ranked.findIndex((s) => s.name === name);
  return i < 0 ? null : i + 1;
};

// A growth rate on a small base is noise (+334% from 60,000 to 262,000).
// Only call a state "growing" when both years are at least 100,000 visits.
const MIN_BASE = 0.1; // million
export const growthIsMeaningful = (s: StateRow) =>
  (s.foreign2023 ?? 0) >= MIN_BASE && (s.foreign2024 ?? 0) >= MIN_BASE && s.foreignGrowthPct != null;
export const risers = (n: number) =>
  data.states
    .filter(growthIsMeaningful)
    .sort((a, b) => (b.foreignGrowthPct ?? 0) - (a.foreignGrowthPct ?? 0))
    .slice(0, n);

// The visits table groups states into the same five regions as the arrivals table.
const REGION_KEY: Record<string, RegionKey> = {
  North: "north",
  South: "south",
  "West and Central": "westCentral",
  East: "east",
  "North East": "northEast",
};
export const regionKeyOfState = (name: string): RegionKey | null => {
  const r = stateRow(name)?.region;
  return r ? REGION_KEY[r] ?? null : null;
};

// ---------- monuments ----------
const realMonuments = data.monuments.filter((m) => m.foreign2425 != null);
export const topMonuments = (n: number) =>
  [...realMonuments].sort((a, b) => (b.foreign2425 ?? 0) - (a.foreign2425 ?? 0)).slice(0, n);
export const monumentShare = (m: Monument) =>
  (100 * (m.foreign2425 ?? 0)) / data.monumentsGrand.foreign2425;

// The monument table is grouped by ASI "circle" (an office), and a circle can
// cover far more than its namesake town: the "Jodhpur" circle lists Chittorgarh
// Fort, the "Kolkata" circle lists Bishnupur. A circle is therefore tied to a
// place only where the circle's top monument is in that town.
const TOWN_MATCHES_CIRCLE = new Set(["Agra", "Delhi", "Goa", "Leh"]);
export const topMonumentIn = (town: string): Monument | null => {
  if (!TOWN_MATCHES_CIRCLE.has(town)) return null;
  return (
    realMonuments
      .filter((m) => m.circle === town)
      .sort((a, b) => (b.foreign2425 ?? 0) - (a.foreign2425 ?? 0))[0] ?? null
  );
};

// ---------- airports ----------
export const topAirports = (n: number) =>
  [...data.airports.rows].sort((a, b) => (b.ftas ?? 0) - (a.ftas ?? 0)).slice(0, n);
const AIRPORT_FOR: Record<string, string> = { Kochi: "Cochin" };
export const airportFor = (town: string) => {
  const key = (AIRPORT_FOR[town] ?? town).toLowerCase();
  const sorted = [...data.airports.rows].sort((a, b) => (b.ftas ?? 0) - (a.ftas ?? 0));
  const i = sorted.findIndex((a) => a.name.toLowerCase() === key);
  return i < 0 ? null : { ...sorted[i], rank: i + 1, of: sorted.length };
};

// ---------- the West Bengal / East region reading ----------
// Derived from the published arrivals table (arrivals x published % in the East
// region), so it is an estimate that carries the rounding of those percentages.
export function eastRegionReading() {
  const countries = arrivalRows.filter((r) => r.level === "country");
  const inEast = (r: { arrivals: number; regions: Record<RegionKey, number> }) =>
    (r.arrivals * r.regions.east) / 100;
  const total = countries.reduce((a, r) => a + inEast(r), 0);
  const bd = countries.find((r) => r.name === "Bangladesh");
  const us = countries.find((r) => r.name === "United States");
  return {
    totalInEast: Math.round(total),
    bangladeshInEast: bd ? Math.round(inEast(bd)) : null,
    bangladeshShare: bd ? (100 * inEast(bd)) / total : null,
    bangladeshEastPct: bd?.regions.east ?? null,
    usEastPct: us?.regions.east ?? null,
  };
}

// ---------- the signals shown on a place's card ----------
export type Signal = { label: string; value: string };
export function signalsFor(d: { name: string; state: string }): { signals: Signal[]; caveats: string[] } {
  const st = stateRow(d.state);
  const rank = stateRank(d.state);
  const signals: Signal[] = [];
  const caveats: string[] = [];

  if (st && st.foreign2024 != null && rank != null) {
    signals.push({
      label: `${d.state} ranks #${rank} of ${statesCount} states and territories for foreign tourist visits`,
      value: `${millionsLabel(st.foreign2024)} visits in 2024`,
    });
    caveats.push(`The state figure covers all of ${d.state}, not only ${d.name}.`);
    if (growthIsMeaningful(st)) {
      const g = st.foreignGrowthPct ?? 0;
      signals.push({
        label: `Foreign visits to ${d.state} ${g >= 0 ? "grew" : "fell"} between 2023 and 2024`,
        value: `${g >= 0 ? "+" : ""}${g.toFixed(1)}%`,
      });
    }
  }
  const mon = topMonumentIn(d.name);
  if (mon) {
    signals.push({
      label: `Most visited ticketed ASI monument here by foreign visitors: ${mon.name}`,
      value: `${fmt(mon.foreign2425 ?? 0)} foreign visitors in 2024-25`,
    });
  }
  const air = airportFor(d.name);
  if (air && air.ftas != null) {
    signals.push({
      label: `${air.name} airport is #${air.rank} of ${air.of} for foreign arrivals`,
      value: `${fmt(air.ftas)} arrivals in 2024`,
    });
  }
  return { signals, caveats };
}
