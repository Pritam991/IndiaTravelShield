import { RAIL_LABEL, type Rail, type RailLink } from "@/lib/wb";

const ICON: Record<RailLink, string> = { yes: "✓", no: "✕", unverified: "?" };

const CONF_TEXT = {
  good: "Based on what the Wikipedia pages for the stations and this place state.",
  partial:
    "Partly confirmed from the Wikipedia station pages. Check IRCTC or the railway for current direct trains before you plan.",
  unverified:
    "Not confirmed. Treat this as a prompt to check, not as a statement of fact.",
} as const;

// "How to reach by train": nearest station and whether Howrah and Sealdah
// connect. Unknown links are shown as "Not confirmed", never guessed.
export default function RailPanel({
  rail,
  airport,
}: {
  rail: Rail;
  airport: string;
}) {
  return (
    <div className="rail">
      <p className="rail-main">
        <span className="rail-k">Nearest railway station</span>
        <strong>{rail.station}</strong>
        <span className="small">{rail.stationNote}</span>
      </p>
      <ul className="rail-links">
        {(
          [
            ["Howrah", rail.howrah],
            ["Sealdah", rail.sealdah],
          ] as const
        ).map(([name, v]) => (
          <li key={name} className={`rl rl-${v}`}>
            <i aria-hidden="true">{ICON[v]}</i>
            <span>
              <strong>{name}</strong>
              <em>{RAIL_LABEL[v]}</em>
            </span>
          </li>
        ))}
      </ul>
      <p className="small">{rail.note}</p>
      <p className="small rail-conf">
        <strong>How sure are we?</strong> {CONF_TEXT[rail.confidence]}
      </p>
      <p className="small">
        <strong>Nearest airport:</strong> {airport}
      </p>
    </div>
  );
}
