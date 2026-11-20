import Link from "next/link";
import ArrivalsChart, { type BarRow } from "./ArrivalsChart";
import ArrivalsExplorer, { type Country } from "./ArrivalsExplorer";
import CountUp from "./CountUp";
import Reveal from "./Reveal";
import {
  DATASET_URL,
  arrivalsMeta,
  continents,
  countries,
  fmt,
  fmtPct,
  regionsFor,
  shareOfTotal,
  topCountries,
  REGIONS,
} from "@/lib/arrivals";

// "Who visits India": the Ministry of Tourism's 2024 foreign tourist arrivals,
// from data.gov.in. Server component: the data is read at build time, so the
// API key is never sent to a visitor's browser.
export default function VisitorStats() {
  const total = arrivalsMeta.grandTotal;
  const top = topCountries(10);
  const conts = continents();

  const topRows: BarRow[] = top.map((c) => ({
    id: c.id,
    name: c.name,
    value: c.arrivals,
    valueLabel: fmt(c.arrivals),
    tip: `${fmt(c.arrivals)} arrivals in 2024, ${fmtPct(shareOfTotal(c.arrivals))} of all foreign tourist arrivals.`,
  }));

  const contRows: BarRow[] = conts.map((c) => ({
    id: c.id,
    name: c.name,
    value: c.arrivals,
    valueLabel: fmt(c.arrivals),
    tip: `${fmt(c.arrivals)} arrivals in 2024, ${fmtPct(shareOfTotal(c.arrivals))} of all foreign tourist arrivals.`,
  }));

  const pickerCountries: Country[] = countries().map((c) => ({
    id: c.id,
    name: c.name,
    arrivals: c.arrivals,
    arrivalsLabel: fmt(c.arrivals),
    shareLabel: `${shareOfTotal(c.arrivals).toFixed(1)}%`,
    regions: regionsFor(c).map((r) => ({ key: r.key, label: r.label, pct: r.pct })),
  }));

  const allVisitors = REGIONS.map((r) => ({
    key: r.key,
    label: r.label,
    pct: arrivalsMeta.grandTotalRegions[r.key],
  }));

  const usa = top.find((c) => c.name === "United States");

  return (
    <section id="visitors" className="vs" aria-labelledby="vs-h">
      <Reveal>
        <p className="eyebrow dk">Who visits India</p>
        <h2 id="vs-h">Foreign tourist arrivals in 2024</h2>
        <p className="lead">
          Official figures from the Ministry of Tourism, shown simply: how many
          visitors came, where from, and which part of India they were recorded in.
        </p>
      </Reveal>

      <Reveal>
        <div className="vs-hero">
          <p className="vs-num">
            <CountUp to={total} />
          </p>
          <p className="vs-cap">
            foreign tourist arrivals in India in {arrivalsMeta.year}
            {usa && (
              <>
                . The United States was the largest single source, with{" "}
                <strong>{fmt(usa.arrivals)}</strong>.
              </>
            )}
          </p>
        </div>
      </Reveal>

      <div className="vs-cols">
        <Reveal>
          <ArrivalsChart
            rows={topRows}
            title="Top 10 countries by arrivals"
            unit="Arrivals"
            tableCaption="Foreign tourist arrivals in 2024, ten largest source countries"
          />
        </Reveal>
        <Reveal delay={80}>
          <ArrivalsChart
            rows={contRows}
            title="Arrivals by world region"
            unit="Arrivals"
            tableCaption="Foreign tourist arrivals in 2024 by world region"
          />
        </Reveal>
      </div>

      <Reveal>
        <h3 className="vs-h3">Where do visitors from your country go?</h3>
        <ArrivalsExplorer
          countries={pickerCountries}
          allVisitors={allVisitors}
          defaultId={usa?.id ?? pickerCountries[0].id}
        />
      </Reveal>

      <Reveal>
        <div className="vs-note">
          <p>
            <strong>How to read this.</strong> An &ldquo;arrival&rdquo; is a
            foreign tourist arriving in India, so one person who visits twice in
            a year counts twice. The five regions (North, South, West and
            Central, East, North East) are the Ministry&apos;s own groupings.
            The data does not break these down by state or city, so it cannot
            tell you how many visitors went to West Bengal alone.
          </p>
          <p>
            These numbers describe where visitors came from and where they were
            recorded. They are not a measure of how safe a place is.
          </p>
          <p>
            <Link className="btn sm" href="/insights">
              See states, monuments, airports and places the data points to
            </Link>
          </p>
          <p className="small">
            Source:{" "}
            <a href={DATASET_URL} target="_blank" rel="noopener noreferrer">
              {arrivalsMeta.title}
            </a>
            , {arrivalsMeta.organisation} via {arrivalsMeta.publisher}. Fetched{" "}
            {arrivalsMeta.fetchedOn}. We checked that the country rows add up to
            their regions and to the published total of {fmt(total)}. See also{" "}
            <Link href="/methodology">our methodology</Link>.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
