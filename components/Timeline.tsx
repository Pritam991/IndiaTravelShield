import Link from "next/link";
import Reveal from "./Reveal";

const STEPS = [
  { n: 1, title: "Pick a place", body: "Browse by category and read the practical notes for each.", href: "/west-bengal", cta: "Browse places" },
  { n: 2, title: "Check what you need", body: "Visa, passport and permit points to verify for your nationality.", href: "/requirements", cta: "Open checklist" },
  { n: 3, title: "Plan the journey", body: "Nearest station, airport and whether Howrah or Sealdah connects.", href: "/destinations", cta: "See destinations" },
  { n: 4, title: "Read the advisories", body: "Your own government's current advice, linked on every page.", href: "/methodology", cta: "See our sources" },
];

// Vertical timeline on phones, horizontal on wide screens.
export default function Timeline() {
  return (
    <ol className="tl">
      {STEPS.map((s, i) => (
        <li key={s.n}>
          <Reveal delay={i * 90}>
            <div className="tl-item">
              <span className="tl-n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <Link href={s.href}>
                {s.cta} <i aria-hidden="true">&rarr;</i>
              </Link>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
