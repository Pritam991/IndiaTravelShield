import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  destinations,
  getDestination,
  getDetails,
  getStateByName,
  guidance,
  national,
} from "@/lib/data";
import { creditLine, getImage } from "@/lib/images";
import {
  BulletList,
  Disclosure,
  EditorialNote,
  Pending,
  PhotoCredit,
  SourceLink,
  SourceList,
} from "@/components/Ui";
import ParallaxHero from "@/components/ParallaxHero";
import SectionNav from "@/components/SectionNav";
import Tabs from "@/components/Tabs";
import Reveal from "@/components/Reveal";
import PhotoCard from "@/components/PhotoCard";

export const dynamicParams = false;

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/destinations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getDestination(slug);
  if (!d) return {};
  return {
    title: `${d.name} travel guide for foreign visitors`,
    description: `Safety information, documents and how to reach ${d.name}, ${d.state} for international travelers.`,
    alternates: { canonical: `/destinations/${d.slug}` },
  };
}

const NAV = [
  { id: "overview", label: "Overview" },
  { id: "safety", label: "Safety" },
  { id: "visitors", label: "Visitors" },
  { id: "documents", label: "Documents" },
  { id: "getting-there", label: "Getting there" },
  { id: "health", label: "Health & laws" },
  { id: "emergency", label: "Emergency" },
  { id: "sources", label: "Sources" },
];

export default async function DestinationPage({
  params,
}: PageProps<"/destinations/[slug]">) {
  const { slug } = await params;
  const d = getDestination(slug);
  if (!d) notFound();
  const state = getStateByName(d.state);
  const img = getImage(d.slug);
  const info = getDetails(d.slug);
  const nearby = destinations
    .filter((x) => x.state === d.state && x.slug !== d.slug)
    .slice(0, 4);

  return (
    <>
      <ParallaxHero
        src={img?.src ?? null}
        alt={`${d.name}, ${d.state}`}
        name={d.name}
        size="md"
      >
        <nav className="crumb on-dark">
          <Link href="/">Home</Link> /{" "}
          <Link href="/destinations">Destinations</Link> /{" "}
          {state ? (
            <Link href={`/states/${state.slug}`}>{d.state}</Link>
          ) : (
            d.state
          )}
        </nav>
        <p className="eyebrow">{d.type}</p>
        <h1>
          {d.name}, {d.state}
        </h1>
        <p className="hero-sub">{d.overview}</p>
        {img && <PhotoCredit img={img} />}
      </ParallaxHero>

      <SectionNav items={NAV} />

      {info && (
        <section id="overview" className="layer">
          <Reveal>
            <h2>Overview: what to see and when to go</h2>
            <EditorialNote text={guidance.editorialNote} />
            <h3>Highlights</h3>
            <BulletList items={info.highlights} />
            <h3>Best time to visit</h3>
            <p>{info.bestTime}</p>
            <h3>Getting around</h3>
            <p>{info.gettingAround}</p>
          </Reveal>
        </section>
      )}

      <section id="safety" className="layer">
        <Reveal>
          <h2>Safety intelligence</h2>
          {info && (
            <>
              <h3>Practical risks to plan for in {d.name}</h3>
              <BulletList items={info.safety} />
            </>
          )}
          <h3>Official government advisories</h3>
          <p>
            Government travel advisories apply to India as a whole and sometimes
            name specific regions. Read the current version from your own
            government before booking:
          </p>
          <SourceList ids={national.advisorySources} />
          <Pending label={`Crime statistics for ${d.name} (NCRB)`} />
          <p className="small">
            We show no combined safety score. See{" "}
            <Link href="/methodology">our methodology</Link>.
          </p>
        </Reveal>
      </section>

      <section id="visitors" className="layer">
        <Reveal>
          <h2>International visitors</h2>
          {guidance.visitorsExplainer.map((t) => (
            <p key={t}>{t}</p>
          ))}
          <Pending label={`Foreign tourist visits to ${d.state}`} />
          <p className="small">
            Source when loaded: <SourceLink id="tourism" />
          </p>
        </Reveal>
      </section>

      <section id="documents" className="layer">
        <Reveal>
          <h2>Documents</h2>
          <p>
            Most foreign visitors need a visa or e-Visa. Eligibility depends on
            nationality. Apply only on the official portal:{" "}
            <SourceLink id="visa" />.
          </p>
          {guidance.documents.map((doc, i) => (
            <Disclosure key={doc.title} title={doc.title} open={i === 0}>
              <p>{doc.body}</p>
            </Disclosure>
          ))}
          {d.permit ? (
            <p className="warn">
              <strong>Special permit note:</strong> {d.permit} Check{" "}
              <SourceLink id="mha" />.
            </p>
          ) : (
            <p>
              No special area permit is recorded for {d.name} in our data. This
              is not a guarantee, so verify with <SourceLink id="mha" /> before
              you travel.
            </p>
          )}
          <p>
            <Link className="btn sm" href="/requirements">
              Check by nationality
            </Link>
          </p>
        </Reveal>
      </section>

      <section id="getting-there" className="layer">
        <Reveal>
          <h2>How to get there</h2>
          <Tabs
            tabs={[
              {
                id: "air",
                label: "By air",
                content: (
                  <p>
                    <strong>{d.airport}</strong>
                    <br />
                    <span className="small">
                      Check airports at <SourceLink id="aai" />.
                    </span>
                  </p>
                ),
              },
              {
                id: "rail",
                label: "By rail",
                content: (
                  <p>
                    <strong>{d.rail}</strong>
                    <br />
                    <span className="small">
                      Book trains on <SourceLink id="irctc" />.
                    </span>
                  </p>
                ),
              },
            ]}
          />
        </Reveal>
      </section>

      <section id="health" className="layer">
        <Reveal>
          <h2>Health &amp; local laws</h2>
          <Disclosure title={`Health advice for ${d.name}`} open>
            {info && <BulletList items={info.health} />}
            <h3>General health precautions</h3>
            <BulletList items={guidance.health} />
            <Pending label={`Named hospitals and pharmacies in ${d.name}`} />
          </Disclosure>
          <Disclosure title="Local laws and rules">
            <BulletList items={guidance.laws} />
            <Pending label={`Local rules specific to ${d.name}`} />
          </Disclosure>
          <Disclosure title="Culture and etiquette">
            <BulletList items={guidance.culture} />
          </Disclosure>
          {info && (
            <Disclosure title={`Practical tips for ${d.name}`}>
              <BulletList items={info.tips} />
            </Disclosure>
          )}
        </Reveal>
      </section>

      <section id="emergency" className="layer">
        <Reveal>
          <h2>Emergency help</h2>
          <ul className="emerg">
            {national.emergency.map((e) => (
              <li key={e.label}>
                <b>{e.number}</b>
                <span>{e.label}</span>
                <em>
                  {e.status === "verified"
                    ? `checked ${national.verifiedOn}`
                    : "not yet verified"}
                </em>
              </li>
            ))}
          </ul>
          <p className="small">
            {national.emergencyNote} Source: <SourceLink id={national.verifiedSource} />.
          </p>
          <h3>If something goes wrong</h3>
          <BulletList items={guidance.emergencyGuide} />
        </Reveal>
      </section>

      <section id="sources" className="layer">
        <Reveal>
          <h2>Sources for this page</h2>
          <SourceList ids={d.sources} />
        </Reveal>
      </section>

      {nearby.length > 0 && (
        <section className="plain">
          <Reveal>
            <h2>More in {d.state}</h2>
          </Reveal>
          <ul className="cards3">
            {nearby.map((n) => {
              const ni = getImage(n.slug);
              return (
                <li key={n.slug}>
                  <PhotoCard
                    href={`/destinations/${n.slug}`}
                    title={n.name}
                    sub={n.type}
                    src={ni?.src ?? null}
                    alt={`${n.name}, ${n.state}`}
                    credit={ni ? creditLine(ni) : null}
                    badge={n.permit ? "Permit note" : undefined}
                  />
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </>
  );
}
