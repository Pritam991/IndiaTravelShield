"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useDocAttr } from "@/lib/useDocAttr";

const LINKS: [string, string][] = [
  ["/west-bengal", "West Bengal"],
  ["/states", "States"],
  ["/destinations", "Destinations"],
  ["/requirements", "Requirements"],
  ["/methodology", "Sources & Method"],
];

function save(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage can be blocked; the toggle still works for this visit */
  }
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const mode3d = useDocAttr("mode3d");

  const toggle3d = () => {
    const next = mode3d === "on" ? "off" : "on";
    document.documentElement.dataset.mode3d = next;
    save("its-3d", next);
  };

  const toggleTheme = () => {
    const d = document.documentElement;
    const isDark =
      d.dataset.theme === "dark" ||
      (!d.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
    const next = isDark ? "light" : "dark";
    d.dataset.theme = next;
    save("its-theme", next);
  };

  return (
    <header className="top">
      <div className="top-in">
        <Link
          className="logo"
          href="/"
          aria-label="IndiaTravelShield home"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logo.png"
            alt="IndiaTravelShield: Travel Prepared. Travel Protected."
            width={720}
            height={322}
            priority
            sizes="(max-width: 600px) 110px, 140px"
          />
        </Link>
        <nav id="site-nav" aria-label="Main" className={open ? "open" : ""}>
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="tools">
          <button
            type="button"
            className="icon-btn txt"
            aria-pressed={mode3d === "on"}
            onClick={toggle3d}
            title="Toggle 3D effects"
          >
            3D
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle light and dark theme"
            title="Toggle theme"
          >
            <svg className="ic-moon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10Z" fill="currentColor" />
            </svg>
            <svg className="ic-sun" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <circle cx="12" cy="12" r="4.5" fill="currentColor" />
              <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1" />
              </g>
            </svg>
          </button>
          <button
            type="button"
            className="icon-btn burger"
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d={open ? "M5 5l14 14M19 5 5 19" : "M4 7h16M4 12h16M4 17h16"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
