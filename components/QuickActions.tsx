import Link from "next/link";
import Reveal from "./Reveal";

const ACTIONS = [
  {
    href: "/requirements",
    title: "Check what I need",
    body: "Visa, passport and permit points for your destination.",
    tone: "a1",
    icon: (
      <path d="M9 3h6l1 2h3v16H5V5h3l1-2Zm-1.5 9.5 2 2 4.5-4.5" />
    ),
  },
  {
    href: "/destinations",
    title: "Browse destinations",
    body: "Cities, hill stations, heritage towns and wildlife.",
    tone: "a2",
    icon: (
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Zm0-8.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    ),
  },
  {
    href: "/states/west-bengal",
    title: "Start with West Bengal",
    body: "Kolkata, Darjeeling, the Sundarbans and more.",
    tone: "a3",
    icon: <path d="M4 20 10 8l4 7 2-3 4 8H4Zm11-13a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />,
  },
  {
    href: "/methodology",
    title: "How we use sources",
    body: "What we check, what we leave out, and why.",
    tone: "a4",
    icon: <path d="M12 3 4 6v5c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6l-8-3Zm-3 9 2.5 2.5L15.5 10" />,
  },
];

// Four large action cards under the hero. Each is a single link, so the
// whole card is clickable and keyboard reachable.
export default function QuickActions() {
  return (
    <ul className="qa">
      {ACTIONS.map((a, i) => (
        <li key={a.href}>
          <Reveal delay={i * 70}>
            <Link href={a.href} className={`qa-card ${a.tone}`}>
              <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {a.icon}
              </svg>
              <strong>{a.title}</strong>
              <span>{a.body}</span>
              <i aria-hidden="true">&rarr;</i>
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
