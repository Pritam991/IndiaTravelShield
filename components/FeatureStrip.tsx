import Reveal from "./Reveal";

const ITEMS = [
  {
    title: "Easy to reach",
    body: "Every place lists its nearest railway station and airport, and whether Howrah and Sealdah connect to it.",
    icon: <path d="M5 16V8a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v8M5 12h14M8 20l1.5-4M16 20l-1.5-4M8 9h.01M16 9h.01" />,
  },
  {
    title: "Sources on every page",
    body: "Official advisories and portals are linked, and a missing figure says so instead of being guessed.",
    icon: <path d="M12 3 4 6v5c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6l-8-3Zm-3 9 2.5 2.5L15.5 10" />,
  },
  {
    title: "Permit notes up front",
    body: "Protected and border areas are flagged, so you know what to check before you book.",
    icon: <path d="M9 3h6l1 2h3v16H5V5h3l1-2Zm-1.5 9.5 2 2 4.5-4.5" />,
  },
  {
    title: "Clear photo credits",
    body: "Every photograph is credited to its author under the image, with its licence.",
    icon: <path d="M4 7h3l2-3h6l2 3h3v12H4V7Zm8 9a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />,
  },
];

// Four short reasons, in a grid that goes 4 -> 2 -> 1 columns. Each one is
// something this site actually does; none is a safety claim.
export default function FeatureStrip() {
  return (
    <ul className="fstrip">
      {ITEMS.map((it, i) => (
        <li key={it.title}>
          <Reveal delay={i * 70}>
            <div className="fs-item">
              <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                {it.icon}
              </svg>
              <h3>{it.title}</h3>
              <p>{it.body}</p>
            </div>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
