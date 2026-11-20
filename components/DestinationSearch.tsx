"use client";

import { useState } from "react";
import PhotoCard from "./PhotoCard";

type Item = {
  slug: string;
  name: string;
  state: string;
  type: string;
  hasPermit: boolean;
  img: string | null;
  credit: string | null;
};

// Search box + filter chips + photo card grid.
export default function DestinationSearch({ items }: { items: Item[] }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const v = q.toLowerCase().trim();

  // Unique states in the order they first appear (West Bengal leads).
  const stateNames = [...new Set(items.map((i) => i.state))];

  const shown = items.filter((i) => {
    if (filter === "permit" && !i.hasPermit) return false;
    if (filter.startsWith("s:") && i.state !== filter.slice(2)) return false;
    return `${i.name} ${i.state} ${i.type}`.toLowerCase().includes(v);
  });

  const chips: [string, string][] = [
    ["all", "All"],
    ...stateNames.map((s): [string, string] => [`s:${s}`, s]),
    ["permit", "Permit note"],
  ];

  return (
    <>
      <input
        type="search"
        placeholder="Search destination, state or type"
        aria-label="Search destinations"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="filters" role="group" aria-label="Filter destinations">
        {chips.map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`chip${filter === key ? " on" : ""}`}
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="small" aria-live="polite">
        {shown.length} destination{shown.length === 1 ? "" : "s"}
      </p>
      <ul className="cards3">
        {shown.map((i) => (
          <li key={i.slug}>
            <PhotoCard
              href={`/destinations/${i.slug}`}
              title={i.name}
              sub={i.state}
              src={i.img}
              alt={`${i.name}, ${i.state}`}
              credit={i.credit}
              badge={i.hasPermit ? "Permit note" : undefined}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
