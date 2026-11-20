import Link from "next/link";
import { national, type Destination } from "@/lib/data";
import { RAIL_LABEL, type Rail, type RailLink } from "@/lib/wb";

const TICK: Record<RailLink, string> = { yes: "✓", no: "✕", unverified: "?" };

// Side card on destination pages: the practical facts in one place. Every
// line comes from our data; nothing here is a safety claim.
export default function QuickFacts({
  d,
  rail,
}: {
  d: Destination;
  rail: Rail | null;
}) {
  const all = national.emergency[0];
  return (
    <div className="facts">
      <h2 className="facts-h">Plan at a glance</h2>
      <dl>
        <div>
          <dt>Nearest airport</dt>
          <dd>{d.airport}</dd>
        </div>
        <div>
          <dt>By rail</dt>
          <dd>{d.rail}</dd>
        </div>
        {rail && (
          <div>
            <dt>Trains from Kolkata</dt>
            <dd>
              <span className="fchips">
                <span className={`fchip fc-${rail.howrah}`}>
                  Howrah {TICK[rail.howrah]} {RAIL_LABEL[rail.howrah]}
                </span>
                <span className={`fchip fc-${rail.sealdah}`}>
                  Sealdah {TICK[rail.sealdah]} {RAIL_LABEL[rail.sealdah]}
                </span>
              </span>
            </dd>
          </div>
        )}
        <div>
          <dt>Entry note</dt>
          <dd>
            {d.permit ? (
              <>
                Permit or park rules may apply.{" "}
                <a href="#documents">See Documents</a>.
              </>
            ) : (
              <>None recorded in our data. Verify before you travel.</>
            )}
          </dd>
        </div>
        <div>
          <dt>Emergency</dt>
          <dd>
            <strong>{all.number}</strong> all-in-one
          </dd>
        </div>
      </dl>
      {d.state === "West Bengal" && (
        <p className="small">
          <Link href="/west-bengal">More West Bengal places by category</Link>
        </p>
      )}
    </div>
  );
}
