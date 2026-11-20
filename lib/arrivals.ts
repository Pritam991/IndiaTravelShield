import json from "@/data/ftas-2024.json";

export type Level = "continent" | "subregion" | "country";
export type RegionKey = "north" | "south" | "westCentral" | "east" | "northEast";

export type ArrivalRow = {
  id: string;
  n: number;
  name: string;
  sourceName: string;
  level: Level;
  continent: string | null;
  subregion: string | null;
  arrivals: number;
  regions: Record<RegionKey, number>;
};

type File = {
  meta: {
    title: string;
    organisation: string;
    resourceId: string;
    publisher: string;
    year: number;
    apiUpdated: string | null;
    fetchedOn: string;
    recordCount: number;
    grandTotal: number;
    grandTotalRegions: Record<RegionKey, number>;
    checks: { allPartsAddUp: boolean };
  };
  rows: ArrivalRow[];
};

const data = json as unknown as File;

export const arrivalsMeta = data.meta;
export const arrivalRows = data.rows;
export const DATASET_URL = `https://www.data.gov.in/resource/${data.meta.resourceId}`;

export const REGIONS: { key: RegionKey; label: string }[] = [
  { key: "north", label: "North" },
  { key: "south", label: "South" },
  { key: "westCentral", label: "West and Central" },
  { key: "east", label: "East" },
  { key: "northEast", label: "North East" },
];

// Compact, readable number: 9,951,722 -> "9.95 million"; 338,605 -> "338,605".
export const fmt = (n: number) => n.toLocaleString("en-US");
export const fmtMillions = (n: number) => `${(n / 1_000_000).toFixed(2)} million`;
export const fmtPct = (p: number) => `${p % 1 === 0 ? p.toFixed(0) : p.toFixed(1)}%`;

export const continents = () =>
  arrivalRows
    .filter((r) => r.level === "continent" && r.sourceName !== "Others Not Classified Elsewhere")
    .sort((a, b) => b.arrivals - a.arrivals);

export const countries = () =>
  arrivalRows.filter((r) => r.level === "country").sort((a, b) => b.arrivals - a.arrivals);

export const topCountries = (n: number) => countries().slice(0, n);

// Share of ALL arrivals, as a percentage of the published grand total.
export const shareOfTotal = (arrivals: number) => (100 * arrivals) / data.meta.grandTotal;

// Where a single source's visitors went (published percentages).
export const regionsFor = (row: ArrivalRow) =>
  REGIONS.map((r) => ({ ...r, pct: row.regions[r.key] }));

// For the picker: countries only, biggest source first.
export const pickerOptions = () =>
  countries().map((c) => ({ id: c.id, name: c.name, arrivals: c.arrivals }));
