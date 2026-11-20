"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Photo from "./Photo";

export type RegionPct = { north: number; south: number; westCentral: number; east: number; northEast: number };
export type SourceCountry = { id: string; name: string; arrivals: number; regions: RegionPct };
export type PlaceItem = {
  slug: string;
  name: string;
  state: string;
  type: string;
  regionKey: keyof RegionPct;
  regionLabel: string;
  stateVisitsM: number; // foreign tourist visits to the state, millions, 2024
  img: string | null;
  credit: string | null;
  permit: boolean;
};

const fmtPct = (p: number) => `${p % 1 === 0 ? p.toFixed(0) : p.toFixed(1)}%`;
const visits = (m: number) =>
  m >= 1 ? `${m.toFixed(2)} million` : Math.round(m * 1e6).toLocaleString("en-US");

// Regions of India are the finest split the data gives for one nationality, so
// the places are grouped BY REGION, in the order that country visited them.
// Within a region every place shares the same published percentage, so they are
// not ranked against each other here. Inside a region they are listed by how
// many foreign visits their state received, which is a separate, labelled fact.
export default function InsightsSuggest({
  countries,
  places,
  defaultId,
}: {
  countries: SourceCountry[];
  places: PlaceItem[];
  defaultId: string;
}) {
  const [id, setId] = useState(defaultId);
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(6);
  const current = countries.find((c) => c.id === id) ?? countries[0];

  const matches = useMemo(() => {
    const v = q.trim().toLowerCase();
    return (v ? countries.filter((c) => c.name.toLowerCase().includes(v)) : countries).slice(0, 8);
  }, [q, countries]);

  const groups = useMemo(() => {
    const keys = [...new Set(places.map((p) => p.regionKey))];
    return keys
      .map((k) => {
        const inRegion = places.filter((p) => p.regionKey === k).sort((a, b) => b.stateVisitsM - a.stateVisitsM);
        return { key: k, label: inRegion[0].regionLabel, pct: current.regions[k], places: inRegion };
      })
      .sort((a, b) => b.pct - a.pct);
  }, [places, current]);

  const lead = groups[0];

  return (
    <div className="isg">
      <div className="ax-pick">
        <label htmlFor="isg-q">Visitors from</label>
        <input
          id="isg-q"
          type="search"
          placeholder="Search a country, for example Germany"
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
              onClick={() => {
                setId(c.id);
                setShown(6);
              }}
            >
              {c.name}
            </button>
          ))}
          {q && matches.length === 0 && <span className="small">No country matches.</span>}
        </div>
      </div>

      <p className="isg-lead" aria-live="polite">
        In 2024, <strong>{current.name}</strong> sent <strong>{current.arrivals.toLocaleString("en-US")}</strong> foreign
        tourist arrivals. The largest share, <strong>{fmtPct(lead.pct)}</strong>, was recorded in{" "}
        <strong>{lead.label} India</strong>. Our places, grouped by region, most-visited region first:
      </p>

      <div className="isg-groups">
        {groups.map((g) => (
          <section key={g.key} className="isg-group" aria-label={`${g.label} India`}>
            <header>
              <h3>{g.label} India</h3>
              <p className="isg-pct">
                <b>{fmtPct(g.pct)}</b>
                <span>of {current.name} visitors</span>
              </p>
              <span className="isg-bar" aria-hidden="true">
                <i style={{ width: `${Math.max(g.pct, 0.5)}%` }} />
              </span>
            </header>
            <ul className="isg-grid">
              {g.places.slice(0, g.key === lead.key ? shown : 3).map((p) => (
                <li key={p.slug}>
                  <Link href={`/destinations/${p.slug}`} className="isg-card">
                    <div className="isg-ph">
                      <Photo src={p.img} alt="" name={p.name} sizes="(max-width: 700px) 100vw, 33vw" />
                      {p.permit && <b className="badge">Permit note</b>}
                    </div>
                    {p.credit && <span className="pc-credit">{p.credit}</span>}
                    <div className="isg-body">
                      <strong>{p.name}</strong>
                      <span className="isg-sub">
                        {p.type}, {p.state}
                      </span>
                      <span className="isg-fact2">
                        {p.state}: {visits(p.stateVisitsM)} foreign visits in 2024, all nationalities
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            {g.key === lead.key && g.places.length > shown && (
              <p>
                <button type="button" className="chip" onClick={() => setShown((n) => n + 6)}>
                  Show more places in {g.label} India ({g.places.length - shown} more)
                </button>
              </p>
            )}
          </section>
        ))}
      </div>

      <p className="small">
        The data splits each country&apos;s visitors by region of India, not by place, so places in the same region share
        one percentage and are not ranked against each other. It shows where visitors went and says nothing about safety
        or quality. Each region lists up to three places other than the lead region.
      </p>
    </div>
  );
}
