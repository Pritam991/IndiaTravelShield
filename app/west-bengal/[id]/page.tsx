import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  categoryOf,
  getPlace,
  guideHref,
  placeImage,
  placesIn,
  wbPlaces,
} from "@/lib/wb";
import { creditLine } from "@/lib/images";
import { SITE_URL } from "@/lib/data";
import JsonLd from "@/components/JsonLd";
import ParallaxHero from "@/components/ParallaxHero";
import PhotoCard from "@/components/PhotoCard";
import RailPanel from "@/components/RailPanel";
import Reveal from "@/components/Reveal";
import { BulletList, PhotoCredit, SourceLink } from "@/components/Ui";

export const dynamicParams = false;

// Places that have a full destination guide link there instead, so only the
// rest get a page of their own here.
export function generateStaticParams() {
  return wbPlaces.filter((p) => !guideHref(p)).map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/west-bengal/[id]">): Promise<Metadata> {
  const { id } = await params;
  const p = getPlace(id);
  if (!p) return {};
  return {
    title: `${p.name}, West Bengal`,
    description: `${p.summary} Nearest railway station: ${p.rail.station}.`,
    alternates: { canonical: `/west-bengal/${p.id}` },
  };
}

export default async function PlacePage({
  params,
}: PageProps<"/west-bengal/[id]">) {
  const { id } = await params;
  const p = getPlace(id);
  if (!p || guideHref(p)) notFound();
  const cat = categoryOf(p.category);
  const img = placeImage(p);
  const related = placesIn(p.category)
    .filter((x) => x.id !== p.id)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "West Bengal places", item: `${SITE_URL}/west-bengal` },
      { "@type": "ListItem", position: 3, name: p.name, item: `${SITE_URL}/west-bengal/${p.id}` },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <ParallaxHero
        src={img?.src ?? null}
        alt={p.name}
        name={p.name}
        size="md"
      >
        <nav className="crumb on-dark">
          <Link href="/">Home</Link> /{" "}
          <Link href="/west-bengal">West Bengal places</Link>
          {cat && <> / {cat.name}</>}
        </nav>
        <p className="eyebrow">{cat?.name ?? "West Bengal"}</p>
        <h1>{p.name}</h1>
        <p className="hero-sub">{p.summary}</p>
        {img && <PhotoCredit img={img} />}
      </ParallaxHero>

      <section className="layer">
        <Reveal>
          <h2>At a glance</h2>
          <ul className="bul">
            <li>
              <strong>District:</strong> {p.district}
            </li>
            <li>
              <strong>Known for:</strong> {p.known.join(", ")}
            </li>
          </ul>
          {p.permit && (
            <p className="warn">
              <strong>Entry note:</strong> {p.permit} Check{" "}
              <SourceLink id="wbforest" /> or <SourceLink id="mha" />.
            </p>
          )}
        </Reveal>
      </section>

      <section className="layer">
        <Reveal>
          <h2>How to get there by train</h2>
          <RailPanel rail={p.rail} airport={p.airport} />
          <p className="small">
            Book trains on <SourceLink id="irctc" />. Check airports at{" "}
            <SourceLink id="aai" />.
          </p>
        </Reveal>
      </section>

      <section className="layer">
        <Reveal>
          <h2>Before you go</h2>
          <BulletList
            items={[
              "Foreign visitors need a valid visa. Apply only on the official portal.",
              "Check your own government's current travel advice for India.",
              "Confirm opening days, fees and any local restrictions with the place or the local authority, since they change.",
            ]}
          />
          <p className="small">
            <Link href="/requirements">Open the requirements checklist</Link>{" "}
            · <Link href="/methodology">How we use sources</Link>
          </p>
        </Reveal>
      </section>

      {related.length > 0 && (
        <section className="plain">
          <Reveal>
            <h2>More in {cat?.name.toLowerCase()}</h2>
          </Reveal>
          <ul className="cards3">
            {related.map((r) => {
              const ri = placeImage(r);
              return (
                <li key={r.id}>
                  <PhotoCard
                    href={guideHref(r) ?? `/west-bengal/${r.id}`}
                    title={r.name}
                    sub={r.district}
                    src={ri?.src ?? null}
                    alt={r.name}
                    credit={ri ? creditLine(ri) : null}
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
