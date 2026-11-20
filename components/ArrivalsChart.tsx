"use client";

import { useId, useMemo, useState } from "react";

export type BarRow = {
  id: string;
  name: string;
  value: number; // the number the bar is drawn from
  valueLabel: string; // what is printed at the tip
  tip: string; // extra line for the hover/focus readout
};

// Ranked horizontal bars: one hue (the data-viz skill's slot-1 blue, passes
// its checks on both surfaces), thin bars, 4px rounded data-end, square at the
// baseline, value printed at the tip, hover and keyboard readout, and a table
// view so nothing depends on hover or colour.
export default function ArrivalsChart({
  rows,
  title,
  unit,
  maxValue,
  highlightId,
  tableCaption,
}: {
  rows: BarRow[];
  title: string;
  unit: string;
  maxValue?: number;
  highlightId?: string;
  tableCaption: string;
}) {
  const [view, setView] = useState<"chart" | "table">("chart");
  const [active, setActive] = useState<string | null>(null);
  const uid = useId();
  const max = maxValue ?? Math.max(...rows.map((r) => r.value), 1);
  const activeRow = useMemo(() => rows.find((r) => r.id === active) ?? null, [rows, active]);

  return (
    <figure className="vz" aria-labelledby={`${uid}-t`}>
      <figcaption>
        <h3 id={`${uid}-t`}>{title}</h3>
        <div className="vz-tabs" role="group" aria-label="Chart or table">
          {(["chart", "table"] as const).map((v) => (
            <button
              key={v}
              type="button"
              className={view === v ? "on" : ""}
              aria-pressed={view === v}
              onClick={() => setView(v)}
            >
              {v === "chart" ? "Chart" : "Table"}
            </button>
          ))}
        </div>
      </figcaption>

      {view === "chart" ? (
        <>
          <ol className="vz-bars" aria-label={title}>
            {rows.map((r) => {
              const w = Math.max((r.value / max) * 100, 0.6);
              const dim = highlightId && r.id !== highlightId;
              return (
                <li
                  key={r.id}
                  className={`${active === r.id ? "is-active" : ""}${dim ? " is-dim" : ""}`}
                  tabIndex={0}
                  onPointerEnter={() => setActive(r.id)}
                  onPointerLeave={() => setActive(null)}
                  onFocus={() => setActive(r.id)}
                  onBlur={() => setActive(null)}
                  aria-label={`${r.name}: ${r.valueLabel}. ${r.tip}`}
                >
                  <span className="vz-name">{r.name}</span>
                  <span className="vz-track">
                    <span className="vz-fill" style={{ width: `${w}%` }} />
                  </span>
                  <span className="vz-val">{r.valueLabel}</span>
                </li>
              );
            })}
          </ol>
          <p className="vz-read" aria-live="polite">
            {activeRow ? (
              <>
                <strong>{activeRow.name}</strong> {activeRow.tip}
              </>
            ) : (
              <span className="small">Hover or tab to a bar for details.</span>
            )}
          </p>
        </>
      ) : (
        <div className="vz-table">
          <table>
            <caption>{tableCaption}</caption>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">{unit}</th>
                <th scope="col">Detail</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <th scope="row">{r.name}</th>
                  <td>{r.valueLabel}</td>
                  <td>{r.tip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </figure>
  );
}
