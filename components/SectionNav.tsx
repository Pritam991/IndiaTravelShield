"use client";

import { useEffect, useState } from "react";

// Sticky in-page navigation that highlights the section you are reading.
export default function SectionNav({
  items,
}: {
  items: { id: string; label: string }[];
}) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const els = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav className="secnav" aria-label="On this page">
      {items.map((i) => (
        <a
          key={i.id}
          href={`#${i.id}`}
          className={active === i.id ? "on" : ""}
          aria-current={active === i.id ? "true" : undefined}
        >
          {i.label}
        </a>
      ))}
    </nav>
  );
}
