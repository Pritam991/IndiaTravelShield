import Link from "next/link";
import { destinations, states } from "@/lib/data";
import { creditLine, getImage } from "@/lib/images";
import HomeHero, { type HeroSlide, type SearchItem } from "@/components/HomeHero";
import Ticker from "@/components/Ticker";
import QuickActions from "@/components/QuickActions";
import FeaturedStates from "@/components/FeaturedStates";
import IndiaStats from "@/components/IndiaStats";
import PhotoCard from "@/components/PhotoCard";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import { Disclosure } from "@/components/Ui";

// Featured states shown in the home-page carousel. West Bengal leads.
// Each lists the destination slugs to slide through.
const FEATURED_STATES = [
  {
    slug: "west-bengal",
    name: "West Bengal",
    blurb:
      "From Darjeeling's tea hills to the Sundarbans and Kolkata. Swipe, drag or use the arrow keys.",
    destinations: ["kolkata", "darjeeling", "sundarbans", "kalimpong", "shantiniketan", "siliguri"],
  },
  {
    slug: "rajasthan",
    name: "Rajasthan",
    blurb: "Forts, palaces and lakes in India's desert state.",
    destinations: ["jaipur", "udaipur", "jodhpur"],
  },
  {
    slug: "kerala",
    name: "Kerala",
    blurb: "Backwaters, tea hills and Fort Kochi's old streets.",
    destinations: ["kochi", "munnar", "alappuzha"],
  },
  {
    slug: "himachal-pradesh",
    name: "Himachal Pradesh",
    blurb: "Himalayan hill stations, Tibetan culture and adventure.",
    destinations: ["shimla", "manali", "dharamshala"],
  },
];

const STEPS = [
  {
    n: "01",
    title: "Know before you go",
    body: "Read the official advisories for your country and the notes on the region you plan to visit. We link every source.",
    href: "/methodology",
    cta: "How we use sources",
  },
  {
    n: "02",
    title: "Check what you need",
    body: "Find the visa, passport and special-area permit points to verify for your destination and nationality.",
    href: "/requirements",
    cta: "Open the checklist",
  },
  {
    n: "03",
    title: "Choose your destination",
    body: "Browse states, cities, hill stations and heritage towns, with how to reach each by air and rail.",
    href: "/destinations",
    cta: "Browse destinations",
  },
  {
    n: "04",
    title: "Plan every step",
    body: "Airports, trains and emergency numbers on one page, so arrival day is no surprise.",
    href: "/states/west-bengal",
    cta: "Start with West Bengal",
  },
];

const FAQ = [
  {
    q: "Is it safe to travel in India?",
    a: "Conditions differ by region and season. We do not label a place safe or unsafe. Read the current advisories from your own government, linked on every destination page, and check the regional notes before you book.",
  },
  {
    q: "Do I need a visa to visit India?",
    a: "Most foreign visitors do, but the type and eligibility depend on your nationality. Apply only on the official Government of India portal. Our checklist points you to it and does not guess your eligibility.",
  },
  {
    q: "Do I need a special permit for some areas?",
    a: "Some border and protected areas have permit rules for foreign nationals. Destination pages flag these with a permit note and link to the official authority. Always confirm before travel, since rules change.",
  },
  {
    q: "Is IndiaTravelShield a government website?",
    a: "No. We are independent and not affiliated with the Government of India or any government. We summarize official sources and link back to them.",
  },
];

export default function Home() {
  // Photos that rotate behind the hero. Only destinations with a licensed photo.
  const HERO_SLUGS = ["darjeeling", "jaipur", "goa", "leh", "kolkata", "munnar"];
  const heroSlides: HeroSlide[] = HERO_SLUGS.flatMap((slug) => {
    const d = destinations.find((x) => x.slug === slug);
    const img = getImage(slug);
    return d && img
      ? [{ slug, name: d.name, state: d.state, src: img.src, credit: creditLine(img) }]
      : [];
  });
  const searchItems: SearchItem[] = [
    ...destinations.map((d) => ({
      slug: d.slug, name: d.name, state: d.state, type: d.type, kind: "destination" as const,
    })),
    ...states.map((s) => ({
      slug: s.slug, name: s.name, state: s.name, type: s.type, kind: "state" as const,
    })),
  ];
  const tickerItems = destinations.map((d) => ({ slug: d.slug, name: d.name, state: d.state }));
  const featuredStates = FEATURED_STATES.map((fs) => ({
    slug: fs.slug,
    name: fs.name,
    blurb: fs.blurb,
    slides: fs.destinations
      .map((slug) => destinations.find((d) => d.slug === slug))
      .filter((d): d is NonNullable<typeof d> => !!d)
      .map((d) => {
        const img = getImage(d.slug);
        return {
          slug: d.slug,
          name: d.name,
          sub: d.type,
          src: img?.src ?? null,
          credit: img ? creditLine(img) : null,
        };
      }),
  })).filter((fs) => fs.slides.length > 0);
  const wb = destinations.filter((d) => d.state === "West Bengal").length;

  return (
    <>
      <HomeHero slides={heroSlides} items={searchItems} />
      <Ticker items={tickerItems} />
      <QuickActions />

      <Reveal>
        <section className="stats" aria-label="Coverage">
          <div>
            <b>
              <CountUp to={states.length} />
            </b>
            <span>states &amp; territories</span>
          </div>
          <div>
            <b>
              <CountUp to={destinations.length} />
            </b>
            <span>destination guides</span>
          </div>
          <div>
            <b>
              <CountUp to={wb} />
            </b>
            <span>in West Bengal</span>
          </div>
          <div>
            <b>
              <CountUp to={5} />
            </b>
            <span>government advisories linked</span>
          </div>
        </section>
      </Reveal>

      <IndiaStats />

      <section className="band">
        <Reveal>
          <h2>Featured states</h2>
        </Reveal>
        <FeaturedStates states={featuredStates} />
      </section>

      <section className="steps-wrap" aria-labelledby="how">
        <Reveal>
          <h2 id="how">How it works</h2>
        </Reveal>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.n} className="step" style={{ "--i": i } as React.CSSProperties}>
              <span className="step-n">{s.n}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <Link href={s.href}>{s.cta} &rarr;</Link>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="plain">
        <Reveal>
          <h2>More destinations</h2>
        </Reveal>
        <ul className="hscroll">
          {destinations
            .filter((d) => d.state !== "West Bengal")
            .slice(0, 8)
            .map((d, i) => {
              const img = getImage(d.slug);
              return (
                <li key={d.slug}>
                  <Reveal delay={(i % 4) * 80}>
                    <PhotoCard
                      href={`/destinations/${d.slug}`}
                      title={d.name}
                      sub={d.state}
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
      </section>

      <section className="plain">
        <Reveal>
          <h2>Common questions</h2>
          {FAQ.map((f, i) => (
            <Disclosure key={f.q} title={f.q} open={i === 0}>
              <p>{f.a}</p>
            </Disclosure>
          ))}
        </Reveal>
      </section>
    </>
  );
}
