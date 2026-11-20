import type { Metadata } from "next";
import Link from "next/link";
import { destinations } from "@/lib/data";
import { creditLine, getImage } from "@/lib/images";
import { countries as arrivalCountries, type RegionKey } from "@/lib/arrivals";
import {
  eastRegionReading,
  fmt,
  millionsLabel,
  regionKeyOfState,
  risers,
  signalsFor,
  stateRow,
  statesCount,
  topAirports,
  topMonuments,
  topStates,
  tourism,
  monumentShare,
} from "@/lib/tourism";
import ArrivalsChart, { type BarRow } from "@/components/ArrivalsChart";
import InsightsSuggest, { type PlaceItem, type SourceCountry } from "@/components/InsightsSuggest";
import PageHeader from "@/components/PageHeader";
import Band from "@/components/Band";
import Reveal from "@/components/Reveal";
import PhotoCard from "@/components/PhotoCard";

export const metadata: Metadata = {
  title: "Where foreign visitors go in India: data and suggested places",
  description:
    "Foreign tourist visits by state, the most visited monuments, busiest airports and the months visitors come, from the Ministry of Tourism, with places to look at based on the data.",
  alternates: { canonical: "/insights" },
};

const REGION_LABEL: Record<RegionKey, string> = {
  north: "North",
  south: "South",
  westCentral: "West and Central",
  east: "East",
  northEast: "North East",
};

export default function InsightsPage() {
  const m = tourism.meta;
  const overall = tourism.stateOverall.foreign2024;
  const top = topStates(10);
  const east = eastRegionReading();

  // ---- charts ----
  const stateRows: BarRow[] = top.map((s) => ({
    id: s.name,
    name: s.name,
    value: s.foreign2024 ?? 0,
    valueLabel: `${(s.foreign2024 ?? 0).toFixed(2)}m`,
    tip: `${millionsLabel(s.foreign2024 ?? 0)} foreign tourist visits in 2024, ${s.foreignSharePct}% of the national total. ${
      s.foreignGrowthPct != null ? `Change from 2023: ${s.foreignGrowthPct > 0 ? "+" : ""}${s.foreignGrowthPct}%.` : ""
    }`,
  }));
  const monRows: BarRow[] = topMonuments(10).map((x) => ({
    id: x.name,
    name: x.name,
    value: x.foreign2425 ?? 0,
    valueLabel: fmt(x.foreign2425 ?? 0),
    tip: `${fmt(x.foreign2425 ?? 0)} foreign visitors in 2024-25 (${monumentShare(x).toFixed(1)}% of all foreign visitors to ticketed ASI monuments). ASI circle: ${x.circle}.`,
  }));
  const airRows: BarRow[] = topAirports(10).map((a) => ({
    id: a.id,
    name: a.name,
    value: a.ftas ?? 0,
    valueLabel: fmt(a.ftas ?? 0),
    tip: `${fmt(a.ftas ?? 0)} foreign tourist arrivals in 2024, ${a.sharePct}% of arrivals by air.`,
  }));

  // ---- suggestions ----
  const placeItems: PlaceItem[] = destinations
    .map((d) => {
      const key = regionKeyOfState(d.state);
      const st = stateRow(d.state);
      if (!key || !st || st.foreign2024 == null) return null;
      const img = getImage(d.slug);
      return {
        slug: d.slug,
        name: d.name,
        state: d.state,
        type: d.type,
        regionKey: key,
        regionLabel: REGION_LABEL[key],
        stateVisitsM: st.foreign2024,
        img: img?.src ?? null,
        credit: img ? creditLine(img) : null,
        permit: !!d.permit,
      };
    })
    .filter((p): p is PlaceItem => p !== null);

  const pickCountries: SourceCountry[] = arrivalCountries().map((c) => ({
    id: c.id,
    name: c.name,
    arrivals: c.arrivals,
    regions: c.regions,
  }));
  const defaultId = pickCountries.find((c) => c.name === "United States")?.id ?? pickCountries[0].id;

  // Each place appears in ONE block only. A state can be both well visited and
  // growing; showing the same twelve places twice would add nothing.
  const topFive = new Set(topStates(5).map((s) => s.name));
  const growing = new Set(risers(6).map((s) => s.name));
  const topTen = new Set(top.map((s) => s.name));
  const withData = destinations.filter((d) => stateRow(d.state)?.foreign2024 != null);
  // 1. Well visited: state is in the top five for foreign visits.
  const wellVisited = withData.filter((d) => topFive.has(d.state));
  // 2. Growing: state is NOT already in block 1, but its foreign visits grew clearly.
  const growingPlaces = withData.filter((d) => !topFive.has(d.state) && growing.has(d.state));
  // 3. Quieter: outside the top ten, not growing clearly, and no permit note.
  const quieter = withData.filter((d) => !topTen.has(d.state) && !growing.has(d.state) && !d.permit);
  // Anything else (top ten but not top five or growing, or permit-flagged) is shown in the picker only.

  const card = (d: (typeof destinations)[number]) => {
    const img = getImage(d.slug);
    const { signals, caveats } = signalsFor(d);
    return (
      <li key={d.slug}>
        <div className="sg-card">
          <PhotoCard
            href={`/destinations/${d.slug}`}
            title={d.name}
            sub={`${d.type}, ${d.state}`}
            src={img?.src ?? null}
            alt={`${d.name}, ${d.state}`}
            credit={img ? creditLine(img) : null}
            badge={d.permit ? "Permit note" : undefined}
          />
          <ul className="sg-sig">
            {signals.map((s) => (
              <li key={s.label}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
          {caveats.length > 0 && <p className="sg-cav">{caveats.join(" ")}</p>}
        </div>
      </li>
    );
  };

  const wb = stateRow("West Bengal");

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Where foreign visitors go in India"
        crumbs={
          <>
            <Link href="/">Home</Link> / Insights
          </>
        }
        lead="What the Ministry of Tourism's published figures say about which states, monuments and airports foreign visitors use, which months they come, and which of our places match. These are facts about where people went. They are not a measure of safety and not a ranking of what is best."
      />

      <section className="reqnote">
        <p>
          <strong>How we use the data.</strong> Every figure on this page comes from datasets the Ministry of Tourism
          published on data.gov.in, fetched on {m.fetchedOn}. We removed the subtotal rows before ranking, then checked
          that the rows add back up to the published totals. {m.allChecksPass ? "All checks passed." : "Some checks failed."}{" "}
          Where a number cannot support a conclusion, the page says so.
        </p>
      </section>

      <Band tone="soft" label="States" id="states">
        <Reveal>
          <p className="eyebrow dk">States</p>
          <h2>Foreign tourist visits by state</h2>
          <p className="lead">
            In 2024 there were <strong>{millionsLabel(overall)}</strong> foreign tourist visits across {statesCount} states
            and territories. A &ldquo;visit&rdquo; is counted in each state a tourist goes to, which is why this is more
            than twice the {fmt(9951722)} arrivals on the home page.
          </p>
        </Reveal>
        <div className="ins-cols">
          <Reveal>
            <ArrivalsChart
              rows={stateRows}
              title="Top 10 states and territories, foreign tourist visits 2024 (millions)"
              unit="Visits (millions)"
              tableCaption="Foreign tourist visits by state, 2024, ten highest"
            />
          </Reveal>
          <Reveal delay={80}>
            <div className="ins-callout">
              <h3>Reading West Bengal</h3>
              {wb && (
                <>
                  <p>
                    West Bengal recorded <strong>{millionsLabel(wb.foreign2024 ?? 0)}</strong> foreign tourist visits in
                    2024, <strong>#2 of {statesCount}</strong>, up {wb.foreignGrowthPct}% on 2023.
                  </p>
                </>
              )}
              <p>
                But the same data shows who those visitors mostly are. Of foreign arrivals recorded in the East region
                of India, we estimate about{" "}
                <strong>{east.bangladeshShare != null ? Math.round(east.bangladeshShare) : "?"}%</strong> come from
                Bangladesh. Only {east.usEastPct}% of visitors from the United States were recorded in the East, against
                about {east.bangladeshEastPct}% of Bangladeshi visitors.
              </p>
              <p className="small">
                That estimate multiplies each country&apos;s arrivals by its published share for the East, so it carries
                the rounding of those shares. The state data does not split West Bengal by nationality. It does not mean
                West Bengal is unsuitable for visitors from elsewhere. It means this headline number is mostly a
                neighbouring-country story.
              </p>
            </div>
          </Reveal>
        </div>
      </Band>

      <section className="layer">
        <Reveal>
          <p className="eyebrow dk">Monuments and airports</p>
          <h2>Which sites and gateways foreign visitors use</h2>
        </Reveal>
        <div className="ins-cols">
          <Reveal>
            <ArrivalsChart
              rows={monRows}
              title="Most visited ticketed ASI monuments by foreign visitors, 2024-25"
              unit="Foreign visitors"
              tableCaption="Foreign visitors to centrally protected ticketed monuments, 2024-25, ten highest"
            />
          </Reveal>
          <Reveal delay={80}>
            <ArrivalsChart
              rows={airRows}
              title="Airports with the most foreign arrivals, 2024"
              unit="Foreign arrivals"
              tableCaption="Foreign tourist arrivals by airport, 2024, ten highest"
            />
          </Reveal>
        </div>
        <p className="small">
          Monument figures only cover sites that the Archaeological Survey of India sells tickets for. Many popular places
          (living temples, parks, beaches, hill towns) are not in it. Airport figures cover arrivals by air only (
          {fmt(tourism.airports.airModeTotal)} of the 9,951,722 total).
        </p>
      </section>

      <Band tone="dark" label="Suggested places" id="suggest">
        <Reveal>
          <p className="eyebrow">Places to look at</p>
          <h2>Places the data points to</h2>
          <p className="lead on-dark-text">
            Three plain readings of the data, each limited to places we have guides for. They show where visitors have
            gone. They do not say a place is safe, and they do not say it is the best fit for you.
          </p>
        </Reveal>

        <div className="sg-block">
          <h3>1. Well visited: in the five states with the most foreign visits</h3>
          <p className="on-dark-text">
            {topStates(5)
              .map((s) => s.name)
              .join(", ")}
            .
          </p>
          <ul className="sg-grid">{wellVisited.map(card)}</ul>
        </div>

        <div className="sg-block">
          <h3>2. Growing: other states where foreign visits rose clearly from 2023 to 2024</h3>
          <p className="on-dark-text">
            Only states with at least 100,000 foreign visits in both years are counted, because a rise from a very small
            number says little. States already in block 1 are not repeated.{" "}
            {risers(6)
              .filter((s) => !topFive.has(s.name))
              .map((s) => `${s.name} (+${s.foreignGrowthPct}%)`)
              .join(", ")}
            .
          </p>
          <ul className="sg-grid">{growingPlaces.map(card)}</ul>
        </div>

        <div className="sg-block">
          <h3>3. Quieter: outside the top ten states for foreign visits</h3>
          <p className="on-dark-text">
            A lower count can simply mean fewer places to stay, harder access or less promotion. It is not a sign of
            anything wrong. Places with a permit note, and states already shown above, are left out here.
          </p>
          <ul className="sg-grid">{quieter.map(card)}</ul>
          {quieter.length === 0 && <p className="on-dark-text">No places of ours match.</p>}
        </div>
      </Band>

      <section className="layer" id="from-your-country">
        <Reveal>
          <p className="eyebrow dk">By nationality</p>
          <h2>Places by where visitors from your country went</h2>
          <p className="lead">
            The data splits each country&apos;s visitors across five regions of India. Pick a country to see our places
            in the regions it visited most.
          </p>
        </Reveal>
        <InsightsSuggest countries={pickCountries} places={placeItems} defaultId={defaultId} />
      </section>

      <section className="layer" id="months">
        <Reveal>
          <p className="eyebrow dk">Timing</p>
          <h2>When visitors from the main source countries come</h2>
          <p className="lead">
            The busiest and quietest month of arrivals, as a share of that country&apos;s year. It describes when people
            travelled, not when the weather is best. Weather and seasons vary a lot across India.
          </p>
        </Reveal>
        <div className="vz-table ins-months">
          <table>
            <caption>Peak and lean month of foreign tourist arrivals, 2024, top 15 source countries</caption>
            <thead>
              <tr>
                <th scope="col">Country</th>
                <th scope="col">Busiest month</th>
                <th scope="col">Quietest month</th>
              </tr>
            </thead>
            <tbody>
              {tourism.peakLean.map((p) => (
                <tr key={p.country}>
                  <th scope="row">{p.country}</th>
                  <td>
                    {p.peakMonth} <span className="small">({p.peakSharePct}% of the year)</span>
                  </td>
                  <td>
                    {p.leanMonth} <span className="small">({p.leanSharePct}% of the year)</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="layer">
        <Reveal>
          <h2>What this data cannot tell you</h2>
          <ul className="bul">
            <li>
              <strong>It says nothing about safety.</strong> A state with many foreign visits is not thereby safe, and a
              quiet one is not thereby unsafe. For risk, read the official advisories linked on each destination page.
            </li>
            <li>
              <strong>It is by state, not by town.</strong> We cannot say how many foreign visitors went to Darjeeling or
              Kochi, only to their states.
            </li>
            <li>
              <strong>Visits and arrivals differ.</strong> A visit is counted in every state a tourist goes to, an arrival
              once, on entering India.
            </li>
            <li>
              <strong>It describes the past.</strong> The figures are for 2024 and 2024-25. Conditions change.
            </li>
          </ul>
          <p className="small">
            Sources (Ministry of Tourism, via data.gov.in):{" "}
            {Object.values(m.sources).map((s, i) => (
              <span key={s.resourceId}>
                {i > 0 && " · "}
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.title}
                </a>
              </span>
            ))}
            .
          </p>
          <p className="small">
            See also <Link href="/#visitors">arrivals by country</Link> and{" "}
            <Link href="/methodology">our methodology</Link>.
          </p>
        </Reveal>
      </section>
    </>
  );
}
