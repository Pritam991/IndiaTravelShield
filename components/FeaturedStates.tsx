"use client";

import Link from "next/link";
import { useState, type KeyboardEvent } from "react";
import Coverflow from "./Coverflow";

type Slide = {
  slug: string;
  name: string;
  sub: string;
  src: string | null;
  credit: string | null;
};

export type FeaturedState = {
  slug: string;
  name: string;
  blurb: string;
  slides: Slide[];
};

// Tabbed featured-state showcase. Only the selected state's carousel is
// mounted, so only one autoplay timer ever runs.
export default function FeaturedStates({ states }: { states: FeaturedState[] }) {
  const [active, setActive] = useState(states[0]?.slug ?? "");
  const current = states.find((s) => s.slug === active) ?? states[0];

  const onKey = (e: KeyboardEvent, idx: number) => {
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % states.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + states.length) % states.length;
    else return;
    e.preventDefault();
    setActive(states[next].slug);
    document.getElementById(`fs-tab-${states[next].slug}`)?.focus();
  };

  return (
    <>
      <div className="fs-tabs" role="tablist" aria-label="Featured states">
        {states.map((s, idx) => (
          <button
            key={s.slug}
            id={`fs-tab-${s.slug}`}
            role="tab"
            type="button"
            className="fs-tab"
            aria-selected={active === s.slug}
            aria-controls="fs-panel"
            tabIndex={active === s.slug ? 0 : -1}
            onClick={() => setActive(s.slug)}
            onKeyDown={(e) => onKey(e, idx)}
          >
            {s.name}
          </button>
        ))}
      </div>
      <div
        id="fs-panel"
        role="tabpanel"
        aria-labelledby={`fs-tab-${current.slug}`}
      >
        <p className="lead">{current.blurb}</p>
        <Coverflow
          key={current.slug}
          slides={current.slides}
          label={`Featured destinations in ${current.name}`}
        />
        <p className="center">
          <Link className="btn" href={`/states/${current.slug}`}>
            Explore {current.name}
          </Link>
        </p>
      </div>
    </>
  );
}
