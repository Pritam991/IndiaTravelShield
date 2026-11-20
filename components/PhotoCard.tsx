"use client";

import Link from "next/link";
import { useRef, type PointerEvent } from "react";
import Photo from "./Photo";

// Card with the photo credit directly under the image. In 3D mode it tilts
// toward the pointer and shows a light glare.
export default function PhotoCard({
  href,
  title,
  sub,
  src,
  alt,
  credit,
  badge,
}: {
  href: string;
  title: string;
  sub: string;
  src: string | null;
  alt: string;
  credit?: string | null;
  badge?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const move = (e: PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (
      !el ||
      e.pointerType === "touch" ||
      document.documentElement.dataset.mode3d !== "on"
    ) {
      return;
    }
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${((x - 0.5) * 14).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${((0.5 - y) * 14).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${(x * 100).toFixed(0)}%`);
    el.style.setProperty("--gy", `${(y * 100).toFixed(0)}%`);
  };

  const leave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <Link
      ref={ref}
      href={href}
      className="pcard"
      onPointerMove={move}
      onPointerLeave={leave}
    >
      <div className="ph">
        <Photo
          src={src}
          alt={alt}
          name={title}
          sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 25vw"
        />
        {badge && <b className="badge">{badge}</b>}
        <i className="glare" aria-hidden="true" />
      </div>
      {credit && <span className="pc-credit">{credit}</span>}
      <div className="pc-body">
        <strong>{title}</strong>
        <span>{sub}</span>
      </div>
    </Link>
  );
}
