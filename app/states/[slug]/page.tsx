import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { destinationsInState, getState, guidance, national, states } from "@/lib/data";
import { creditLine, getImage } from "@/lib/images";
import { BulletList, EditorialNote, Pending, PhotoCredit, SourceLink, SourceList } from "@/components/Ui";
import ParallaxHero from "@/components/ParallaxHero";
import PhotoCard from "@/components/PhotoCard";
import Reveal from "@/components/Reveal";

export const dynamicParams = false;

export function generateStaticParams() {
  return states.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/states/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = getState(slug);
  if (!s) return {};
  return {
    title: `${s.name} travel guide for foreign visitors`,
    description: `Destinations, entry documents and travel information for visiting ${s.name}, India.`,
    alternates: { canonical: `/states/${s.slug}` },
  };
}

export default async function StatePage({
  params,
}: PageProps<"/states/[slug]">) {
  const { slug } = await params;
  const s = getState(slug);
  if (!s) notFound();
  const list = destinationsInState(s.name);
  // Hero uses the state's first destination photo, if we have one.
  const heroImg = list.map((d) => getImage(d.slug)).find(Boolean) ?? null;

  return (
    <>
      <ParallaxHero
        src={heroImg?.src ?? null}
        alt={s.name}
        name={s.name}
        size="md"
      >
        <nav className="crumb on-dark">
          <Link href="/">Home</Link> / <Link href="/states">States</Link>
        </nav>
        <p className="eyebrow">{s.type}</p>
        <h1>{s.name}</h1>
        {s.overview && <p className="hero-sub">{s.overview}</p>}
        {heroImg && <PhotoCredit img={heroImg} />}
      </ParallaxHero>

      {s.permitNote && (
        <p className="warn">
          <strong>Permit note:</strong> {s.permitNote} <SourceLink id="mha" />
        </p>
      )}

      {s.slug === "west-bengal" && (
        <p className="edit-note">
          <strong>Browse by category:</strong>{" "}
          <Link href="/west-bengal">
            hills, sea, religious, wildlife and heritage places, with railway
            connections to Howrah and Sealdah
          </Link>
          .
        </p>
      )}

      <section className="plain">
        <Reveal>
          <h2>Destinations in {s.name}</h2>
        </Reveal>
        {list.length ? (
          <ul className="cards3">
            {list.map((d, i) => {
              const img = getImage(d.slug);
              return (
                <li key={d.slug}>
                  <Reveal delay={(i % 4) * 70}>
                    <PhotoCard
                      href={`/destinations/${d.slug}`}
                      title={d.name}
                      sub={d.type}
                      src={img?.src ?? null}
                      alt={`${d.name}, ${d.state}`}
                      credit={img ? creditLine(img) : null}
                      badge={d.permit ? "Permit note" : undefined}
                    />
                  </Reveal>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="pending">
            Destination guides for {s.name} are not yet added.
          </p>
        )}
      </section>

      <section className="layer">
        <Reveal>
          <h2>Before you plan a trip to {s.name}</h2>
          <EditorialNote text={guidance.editorialNote} />
          <h3>Entry documents</h3>
          <p>
            Most foreign visitors need a visa or e-Visa for India, and the rules depend on nationality.
            Apply only on the official portal: <SourceLink id="visa" />.
            {s.permitNote
              ? " This state also has special area rules for foreign nationals, described in the permit note above."
              : " We have no special area permit recorded for this state, which is not a guarantee, so verify with the Ministry of Home Affairs before you travel."}
          </p>
          <h3>Official advisories</h3>
          <p>Read your own government&apos;s current advice for India and for this region:</p>
          <SourceList ids={national.advisorySources} />
          <h3>General precautions</h3>
          <BulletList items={guidance.health.slice(0, 3)} />
        </Reveal>
      </section>

      <section className="layer">
        <Reveal>
          <h2>Safety and visitors</h2>
          <p>{guidance.visitorsExplainer[0]}</p>
          <Pending label={`Foreign tourist visits to ${s.name}`} />
          <Pending label={`Crime statistics for ${s.name} (NCRB)`} />
          <p className="small">
            Sources when loaded: <SourceLink id="tourism" />,{" "}
            <SourceLink id="ncrb" />. National foreign arrivals by region of
            India are on the <Link href="/#visitors">home page</Link>.
          </p>
        </Reveal>
      </section>
    </>
  );
}
