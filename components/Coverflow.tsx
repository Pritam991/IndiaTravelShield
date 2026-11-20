"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import Photo from "./Photo";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

type Slide = {
  slug: string;
  name: string;
  sub: string;
  src: string | null;
  credit: string | null;
};

type Pos = { i: number; from: number; dir: 1 | -1 };

// Circular distance of a slide from the active one, in (-n/2, n/2].
// `tie` decides which side a slide exactly opposite the active one sits on
// (only possible when n is even), so it keeps moving in the same direction.
function offset(idx: number, active: number, n: number, tie: 1 | -1) {
  const o = (((idx - active) % n) + n) % n;
  if (o * 2 < n) return o;
  if (o * 2 > n) return o - n;
  return tie * (n / 2);
}

// Looping 3D coverflow that slides automatically. Autoplay pauses on hover,
// keyboard focus, when scrolled off-screen or when the tab is hidden, can be
// paused by the visitor, and is off entirely for reduced-motion users.
export default function Coverflow({
  slides,
  label = "Featured destinations",
  autoplay = true,
  interval = 1000,
}: {
  slides: Slide[];
  label?: string;
  autoplay?: boolean;
  interval?: number;
}) {
  const n = slides.length;
  const [pos, setPos] = useState<Pos>({ i: 0, from: 0, dir: 1 });
  const [userPaused, setUserPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [focusIn, setFocusIn] = useState(false);
  const [inView, setInView] = useState(false);
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const dragged = useRef(false);

  const canAuto = autoplay && !reduced && n > 1;
  const running = canAuto && !userPaused && inView && !hover && !focusIn;

  const go = (d: 1 | -1) =>
    setPos((p) => ({ i: (p.i + d + n) % n, from: p.i, dir: d }));
  const goTo = (target: number) =>
    setPos((p) => {
      if (target === p.i) return p;
      const o = offset(target, p.i, n, 1);
      return { i: target, from: p.i, dir: o >= 0 ? 1 : -1 };
    });

  // Only animate while the carousel is actually on screen.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The timer restarts whenever the slide changes, so manual navigation
  // always gets a full interval before the next automatic move.
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      if (!document.hidden) go(1);
    }, interval);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, pos.i, interval, n]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  };
  const down = (e: PointerEvent) => {
    startX.current = e.clientX;
    dragged.current = false;
  };
  const up = (e: PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 40) {
      dragged.current = true;
      go(dx < 0 ? 1 : -1);
    }
  };
  const onFocus = (e: FocusEvent) => {
    // Only keyboard focus pauses; a mouse click on a control should not.
    if (e.target.matches(":focus-visible")) setFocusIn(true);
  };
  const onBlur = (e: FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setFocusIn(false);
    }
  };

  return (
    <div
      ref={rootRef}
      className="cf-wrap"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <div
        className="cf"
        role="group"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        onKeyDown={onKey}
        onPointerDown={down}
        onPointerUp={up}
      >
        {slides.map((s, idx) => {
          const o = offset(idx, pos.i, n, pos.dir === 1 ? -1 : 1);
          const prev = offset(idx, pos.from, n, pos.dir);
          const a = Math.abs(o);
          // A slide that wraps around the back should reappear instantly
          // rather than sweep across the stage.
          const jump = Math.abs(o - prev) > n / 2;
          return (
            <div
              key={s.slug}
              className={`cf-slide${a > 2 ? " far" : ""}${jump ? " jump" : ""}`}
              style={
                { "--o": o, "--a": a, "--s": Math.sign(o) } as CSSProperties
              }
              aria-hidden={a !== 0}
            >
              <Link
                href={`/destinations/${s.slug}`}
                className="cf-card"
                tabIndex={a === 0 ? 0 : -1}
                draggable={false}
                onClick={(e) => {
                  if (a !== 0 || dragged.current) {
                    e.preventDefault();
                    if (a !== 0) goTo(idx);
                  }
                }}
              >
                <div className="ph">
                  <Photo
                    src={s.src}
                    alt={s.name}
                    name={s.name}
                    sizes="(max-width: 600px) 80vw, 340px"
                  />
                </div>
                {s.credit && <span className="pc-credit">{s.credit}</span>}
                <div className="pc-body">
                  <strong>{s.name}</strong>
                  <span>{s.sub}</span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {canAuto && (
        <span
          key={pos.i}
          className={`cf-timer${running ? "" : " paused"}`}
          style={{ animationDuration: `${interval}ms` }}
          aria-hidden="true"
        />
      )}

      <p className="sr" aria-live={running ? "off" : "polite"}>
        Showing {slides[pos.i].name}, slide {pos.i + 1} of {n}
      </p>

      <div className="cf-ctl">
        <button
          type="button"
          className="icon-btn"
          aria-label="Previous destination"
          onClick={() => go(-1)}
          disabled={n < 2}
        >
          &#8592;
        </button>
        <div className="dots">
          {slides.map((s, idx) => (
            <button
              key={s.slug}
              type="button"
              aria-label={`Show ${s.name}`}
              aria-current={idx === pos.i}
              className={idx === pos.i ? "on" : ""}
              onClick={() => goTo(idx)}
            />
          ))}
        </div>
        <button
          type="button"
          className="icon-btn"
          aria-label="Next destination"
          onClick={() => go(1)}
          disabled={n < 2}
        >
          &#8594;
        </button>
        {canAuto && (
          <button
            type="button"
            className="icon-btn"
            aria-label={
              userPaused
                ? "Resume automatic sliding"
                : "Pause automatic sliding"
            }
            aria-pressed={userPaused}
            onClick={() => setUserPaused((v) => !v)}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              {userPaused ? (
                <path d="M8 5v14l11-7Z" fill="currentColor" />
              ) : (
                <path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" />
              )}
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
