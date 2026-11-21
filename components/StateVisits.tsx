import Link from "next/link";
import { growthIsMeaningful, millionsLabel, stateRank, stateRow, statesCount, tourism } from "@/lib/tourism";
import { Pending } from "@/components/Ui";

// Foreign tourist visits to a state, from the Ministry of Tourism's state-wise
// table on data.gov.in. Shown instead of a "data not yet loaded" placeholder.
// If a state is ever missing from the table, the placeholder comes back, so a
// page never shows an invented number.
export default function StateVisits({ state, place }: { state: string; place?: string }) {
  const row = stateRow(state);
  const rank = stateRank(state);
  const src = tourism.meta.sources.states;
  if (!row || row.foreign2024 == null || rank == null) {
    return <Pending label={`Foreign tourist visits to ${state}`} />;
  }
  const growth = growthIsMeaningful(row) ? row.foreignGrowthPct : null;
  return (
    <div className="sv">
      <p className="sv-main">
        <strong>{millionsLabel(row.foreign2024)}</strong> foreign tourist visits to {state} in 2024,{" "}
        <strong>
          #{rank} of {statesCount}
        </strong>{" "}
        states and territories
        {growth != null && (
          <>
            , {growth >= 0 ? "up" : "down"} <strong>{Math.abs(growth).toFixed(1)}%</strong> on 2023
          </>
        )}
        .
      </p>
      <p className="small">
        {row.domestic2024 != null && <>Domestic visits: {millionsLabel(row.domestic2024)}. </>}
        {place ? `This is the figure for all of ${state}, not only ${place}. ` : ""}A visit is counted in each state a
        tourist goes to, so one trip can count more than once.
        <Link href="/insights">See how {state} compares</Link>.
      </p>
      <p className="small">
        Source: Ministry of Tourism, Government of India,{" "}
        <a href={src.url} target="_blank" rel="noopener noreferrer">
          {src.title}
        </a>
        , Open Government Data Platform India, published under the{" "}
        <a
          href="https://data.gov.in/government-open-data-license-india"
          target="_blank"
          rel="noopener noreferrer"
        >
          Government Open Data License - India
        </a>
        . Not endorsed by the data provider.
      </p>
    </div>
  );
}
