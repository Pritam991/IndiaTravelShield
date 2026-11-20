"use client";

import { useMemo, useState } from "react";
import ArrivalsChart, { type BarRow } from "./ArrivalsChart";

type Region = { key: string; label: string; pct: number };
export type Country = {
  id: string;
  name: string;
  arrivals: number;
  arrivalsLabel: string;
  shareLabel: string;
  regions: Region[];
};

// "Where do visitors from <country> go?" Picks a country and shows the
// published split across the five regions of India. The split is the
// dataset's own percentages; nothing here is estimated.
export default function ArrivalsExplorer({
  countries,
  allVisitors,
  defaultId,
}: {
  countries: Country[];
  allVisitors: Region[];
  defaultId: string;
}) {
  const [id, setId] = useState(defaultId);
  const [q, setQ] = useState("");
  const current = countries.find((c) => c.id === id) ?? countries[0];

  const matches = useMemo(() => {
    const v = q.trim().toLowerCase();
    return (v ? countries.filter((c) => c.name.toLowerCase().includes(v)) : countries).slice(0, 8);
  }, [q, countries]);

  const rows: BarRow[] = current.regions.map((r) => ({
    id: r.key,
    name: r.label,
    value: r.pct,
    valueLabel: `${r.pct % 1 === 0 ? r.pct.toFixed(0) : r.pct.toFixed(1)}%`,
    tip: `${r.pct}% of visitors from ${current.name} (${current.arrivalsLabel} in 2024) are recorded in this region.`,
  }));

  const rowsAll: BarRow[] = allVisitors.map((r) => ({
    id: r.key,
    name: r.label,
    value: r.pct,
    valueLabel: `${r.pct.toFixed(r.pct % 1 === 0 ? 0 : 1)}%`,
    tip: `${r.pct}% of all foreign tourist arrivals in 2024.`,
  }));

  return (
    <div className="ax">
      <div className="ax-pick">
        <label htmlFor="ax-q">Choose a country</label>
        <input
          id="ax-q"
          type="search"
          placeholder="Search, for example Germany"
          autoComplete="off"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="filters" role="group" aria-label="Matching countries">
          {matches.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`chip${c.id === current.id ? " on" : ""}`}
              aria-pressed={c.id === current.id}
              onClick={() => setId(c.id)}
            >
              {c.name}
            </button>
          ))}
          {q && matches.length === 0 && <span className="small">No country matches.</span>}
        </div>
      </div>

      <div className="ax-grid">
        <div>
          <p className="ax-lead">
            <strong>{current.name}</strong> sent <strong>{current.arrivalsLabel}</strong> foreign
            tourist arrivals in 2024, <strong>{current.shareLabel}</strong> of the total.
          </p>
          <ArrivalsChart
            rows={rows}
            maxValue={100}
            title={`Where visitors from ${current.name} were recorded, by region of India`}
            unit="Share of this country's visitors"
            tableCaption={`Regional split of foreign tourist arrivals from ${current.name}, 2024`}
          />
        </div>
        <div>
          <p className="ax-lead">
            For comparison, all visitors together:
          </p>
          <ArrivalsChart
            rows={rowsAll}
            maxValue={100}
            title="All foreign visitors, by region of India"
            unit="Share of all arrivals"
            tableCaption="Regional split of all foreign tourist arrivals, 2024"
          />
        </div>
      </div>
    </div>
  );
}
