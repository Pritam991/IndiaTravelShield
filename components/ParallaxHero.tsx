"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Photo from "./Photo";

// Multi-layer hero: photo, glow orbs, floating chips and text each move at
// their own speed on scroll. In 3D mode the layers also follow the pointer.
export default function ParallaxHero({
  src,
  alt,
  name,
  size = "lg",
  children,
  floaters,
}: {
  src: string | null;
  alt: string;
  name: string;
  size?: "lg" | "md";
  children: ReactNode;
  floaters?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / vh));
      el.style.setProperty("--p", p.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const reset = () => {
      el.style.setProperty("--mx", "0");
      el.style.setProperty("--my", "0");
    };
    const onMove = (e: PointerEvent) => {
      if (
        document.documentElement.dataset.mode3d !== "on" ||
        e.pointerType === "touch"
      ) {
        return reset();
      }
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      el.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <div ref={ref} className={`plx plx-${size}`}>
      <div className="plx-bg">
        <Photo src={src} alt={alt} name={name} sizes="100vw" priority />
      </div>
      <span className="plx-orb a" aria-hidden="true" />
      <span className="plx-orb b" aria-hidden="true" />
      <div className="plx-shade" aria-hidden="true" />
      {floaters && <div className="floaters">{floaters}</div>}
      <div className="plx-fg">{children}</div>
    </div>
  );
}
