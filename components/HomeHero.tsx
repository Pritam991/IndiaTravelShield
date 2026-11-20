"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

export type HeroSlide = {
  slug: string;
  name: string;
  state: string;
  src: string;
  credit: string;
};

export type SearchItem = {
  slug: string;
  name: string;
  state: string;
  type: string;
  kind: "destination" | "state";
};

// Deliberately no "safely" or "safe": the site never claims a place is safe.
const WORDS = ["informed", "prepared", "with confidence", "your way"];
const SLIDE_MS = 6000;

// Full-width hero: photos cross-fade with a slow zoom, a headline word
// rotates, and a live search box jumps straight to a destination or state.
// Everything that moves stops for visitors who prefer reduced motion, and
// the slideshow pauses when the tab is hidden or the hero is off screen.
export default function HomeHero({
  slides,
  items,
}: {
  slides: HeroSlide[];
  items: SearchItem[];
}) {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const [idx, setIdx] = useState(0);
  const [word, setWord] = useState(0);
  const [inView, setInView] = useState(true);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const run = !reduced && inView && slides.length > 1;

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!run) return;
    const t = setInterval(() => {
      if (!document.hidden) setIdx((i) => (i + 1) % slides.length);
    }, SLIDE_MS);
    return () => clearInterval(t);
  }, [run, slides.length]);

  useEffect(() => {
    if (reduced || !inView) return;
    const t = setInterval(() => {
      if (!document.hidden) setWord((w) => (w + 1) % WORDS.length);
    }, 2600);
    return () => clearInterval(t);
  }, [reduced, inView]);

  const v = q.trim().toLowerCase();
  const results = v
    ? items
        .filter((i) => `${i.name} ${i.state} ${i.type}`.toLowerCase().includes(v))
        .slice(0, 6)
    : [];
  const showList = open && results.length > 0;
  const href = (i: SearchItem) =>
    i.kind === "state" ? `/states/${i.slug}` : `/destinations/${i.slug}`;

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Enter" && showList) {
      e.preventDefault();
      window.location.assign(href(results[active] ?? results[0]));
    }
  };

  const cur = slides[idx];

  return (
    <section ref={rootRef} className="hh full" aria-label="Welcome">
      <div className="hh-bg" aria-hidden="true">
        {slides.map((s, i) => (
          <div key={s.slug} className={`hh-slide${i === idx ? " on" : ""}`}>
            <Image
              src={s.src}
              alt=""
              fill
              sizes="100vw"
              priority={i === 0}
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
      <div className="hh-shade" aria-hidden="true" />
      <span className="hh-orb a" aria-hidden="true" />
      <span className="hh-orb b" aria-hidden="true" />

      <div className="hh-in">
        <p className="eyebrow">Travel India. Travel informed.</p>
        <h1>
          Explore India
          <span className="hh-word" aria-live="off">
            <span key={word} className="hh-word-in">
              {WORDS[word]}
            </span>
          </span>
        </h1>
        <p className="hero-sub">
          Destinations, travel advisories, entry requirements and how to get
          there, all from official sources.
        </p>

        <div className="hh-search">
          <label htmlFor="hh-q" className="sr">
            Search destinations and states
          </label>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            id="hh-q"
            type="search"
            autoComplete="off"
            placeholder="Search a place, e.g. Darjeeling"
            value={q}
            role="combobox"
            aria-expanded={showList}
            aria-controls="hh-list"
            aria-autocomplete="list"
            aria-activedescendant={showList ? `hh-o-${active}` : undefined}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
              setActive(0);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 120)}
            onKeyDown={onKey}
          />
          {showList && (
            <ul id="hh-list" role="listbox" className="hh-list">
              {results.map((r, i) => (
                <li
                  key={`${r.kind}-${r.slug}`}
                  id={`hh-o-${i}`}
                  role="option"
                  aria-selected={i === active}
                >
                  <Link
                    href={href(r)}
                    className={i === active ? "on" : ""}
                    onMouseEnter={() => setActive(i)}
                  >
                    <strong>{r.name}</strong>
                    <span>
                      {r.kind === "state" ? "State or territory" : r.state}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {open && v && results.length === 0 && (
            <p className="hh-none">No match yet. Try a state or city name.</p>
          )}
        </div>

        <p className="cta">
          <Link className="btn" href="/destinations">
            Explore destinations
          </Link>
          <Link className="btn ghost" href="/requirements">
            Check my requirements
          </Link>
        </p>

        <div className="hh-foot">
          <p className="hh-now">
            Now showing:{" "}
            <Link href={`/destinations/${cur.slug}`}>
              {cur.name}, {cur.state}
            </Link>
          </p>
          <div className="hh-dots" role="group" aria-label="Choose background photo">
            {slides.map((s, i) => (
              <button
                key={s.slug}
                type="button"
                className={i === idx ? "on" : ""}
                aria-label={`Show ${s.name}`}
                aria-current={i === idx}
                onClick={() => setIdx(i)}
              />
            ))}
          </div>
        </div>
        <p className="credit hh-credit">{cur.credit}</p>
      </div>
    </section>
  );
}
