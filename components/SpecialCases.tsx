"use client";

import { useState } from "react";
import { evidenceOf, req, type SpecialCase } from "@/lib/requirements";

const FILTERS = [
  ["all", "All"],
  ["Permit", "Permit"],
  ["Registration", "Registration"],
  ["Check locally", "Check locally"],
] as const;

function Case({ c }: { c: SpecialCase }) {
  const ev = evidenceOf(c);
  return (
    <article id={c.id} className={`sc sc-${c.tag.toLowerCase().replace(/\s+/g, "-")}`}>
      <header>
        <h3>{c.title}</h3>
        <span className="sc-tags">
          <b className="sc-tag">{c.tag}</b>
          <b className="sc-who">{c.applies}</b>
        </span>
      </header>
      <p className="sc-sum">{c.summary}</p>
      <p className={`sc-ev ev-${ev.level}`}>
        <i aria-hidden="true">{ev.level === "official" ? "✓" : "!"}</i>
        {ev.label}
      </p>
      <ul className="bul">
        {c.points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      {c.how && (
        <>
          <h4>How to do it</h4>
          <ol className="bul">
            {c.how.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
        </>
      )}
      {c.help && <p className="sc-help">{c.help}</p>}
      <p className="small sc-src">
        Sources:{" "}
        {c.sources.map((id, i) => {
          const s = req.sources[id];
          if (!s) return null;
          const ext = s.url.startsWith("http");
          return (
            <span key={id}>
              {i > 0 && " · "}
              <a
                href={s.url}
                {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {s.label}
              </a>
            </span>
          );
        })}
      </p>
    </article>
  );
}

// Filterable list of special cases. The cards are always in the page so every
// anchor link (for example #kedarnath) works whichever filter is on.
export default function SpecialCases({ cases }: { cases: SpecialCase[] }) {
  const [f, setF] = useState<string>("all");
  return (
    <>
      <div className="filters" role="group" aria-label="Filter special cases">
        {FILTERS.map(([k, label]) => (
          <button
            key={k}
            type="button"
            className={`chip${f === k ? " on" : ""}`}
            aria-pressed={f === k}
            onClick={() => setF(k)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="sc-grid">
        {cases.map((c) => (
          <div key={c.id} hidden={f !== "all" && c.tag !== f}>
            <Case c={c} />
          </div>
        ))}
      </div>
    </>
  );
}
