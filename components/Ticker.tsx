import Link from "next/link";

type Item = { slug: string; name: string; state: string };

// Endless horizontal strip of destination names. Pure CSS animation: it
// pauses on hover and focus, and shows as a plain scrollable row for people
// who prefer reduced motion. The duplicate copy is hidden from assistive tech.
export default function Ticker({ items }: { items: Item[] }) {
  const row = (hidden: boolean) => (
    <ul className="tk-row" aria-hidden={hidden || undefined}>
      {items.map((i) => (
        <li key={i.slug}>
          <Link href={`/destinations/${i.slug}`} tabIndex={hidden ? -1 : 0}>
            <b>{i.name}</b>
            <span>{i.state}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="tk" role="region" aria-label="Destinations to explore">
      <div className="tk-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
