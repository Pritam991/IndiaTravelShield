"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Photo from "./Photo";

export type ExplorerPlace = {
  id: string;
  name: string;
  category: string;
  district: string;
  summary: string;
  station: string;
  howrah: string;
  sealdah: string;
  img: string | null;
  credit: string | null;
  href: string;
};

type Cat = { id: string; name: string; blurb: string };

const dot = (v: string) => (v === "yes" ? "✓" : v === "no" ? "✕" : "?");

// Category tabs + station filter over the West Bengal place list.
export default function WbExplorer({
  categories,
  places,
}: {
  categories: Cat[];
  places: ExplorerPlace[];
}) {
  const [cat, setCat] = useState("all");
  const [rail, setRail] = useState<"any" | "howrah" | "sealdah">("any");
  const [q, setQ] = useState("");
  const v = q.trim().toLowerCase();

  // A link like /west-bengal#hills opens that category.
  useEffect(() => {
    const apply = () => {
      const h = window.location.hash.replace("#", "");
      if (categories.some((c) => c.id === h)) setCat(h);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [categories]);

  const shown = places.filter((p) => {
    if (cat !== "all" && p.category !== cat) return false;
    if (rail === "howrah" && p.howrah !== "yes") return false;
    if (rail === "sealdah" && p.sealdah !== "yes") return false;
    return !v || `${p.name} ${p.district} ${p.summary}`.toLowerCase().includes(v);
  });
  const current = categories.find((c) => c.id === cat);
  const count = (id: string) => places.filter((p) => p.category === id).length;

  return (
    <>
      <input
        type="search"
        placeholder="Search a place or district"
        aria-label="Search West Bengal places"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="filters" role="tablist" aria-label="Categories">
        <button
          role="tab"
          type="button"
          className={`chip${cat === "all" ? " on" : ""}`}
          aria-selected={cat === "all"}
          onClick={() => setCat("all")}
        >
          All ({places.length})
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            role="tab"
            type="button"
            className={`chip${cat === c.id ? " on" : ""}`}
            aria-selected={cat === c.id}
            onClick={() => setCat(c.id)}
          >
            {c.name} ({count(c.id)})
          </button>
        ))}
      </div>
      <div className="filters" role="group" aria-label="Train connection">
        <span className="small">Reached by train from:</span>
        {(
          [
            ["any", "Any"],
            ["howrah", "Howrah"],
            ["sealdah", "Sealdah"],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            className={`chip${rail === k ? " on" : ""}`}
            aria-pressed={rail === k}
            onClick={() => setRail(k)}
          >
            {label}
          </button>
        ))}
      </div>
      {current && <p className="lead">{current.blurb}</p>}
      <p className="small" aria-live="polite">
        {shown.length} place{shown.length === 1 ? "" : "s"}
        {rail !== "any" && " with a confirmed connection"}
      </p>

      <ul className="cards3">
        {shown.map((p) => (
          <li key={p.id}>
            <Link href={p.href} className="pcard">
              <div className="ph">
                <Photo
                  src={p.img}
                  alt={p.name}
                  name={p.name}
                  sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
                />
              </div>
              {p.credit && <span className="pc-credit">{p.credit}</span>}
              <div className="pc-body">
                <strong>{p.name}</strong>
                <span>{p.district}</span>
                <span className="pc-rail">
                  Station: {p.station}
                  <br />
                  Howrah {dot(p.howrah)} · Sealdah {dot(p.sealdah)}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {shown.length === 0 && (
        <p className="pending">
          Nothing matches. {rail !== "any" && "Not every place has a confirmed connection yet. "}
          Try clearing a filter.
        </p>
      )}
    </>
  );
}
