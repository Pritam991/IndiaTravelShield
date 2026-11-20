import statsJson from "@/data/india-stats.json";
import CountUp from "./CountUp";
import Reveal from "./Reveal";

type Tile = {
  id: string;
  value: number;
  decimals: number;
  unit: string;
  label: string;
  detail: string;
  source: string;
  url: string;
  tone: string;
};

const stats = statsJson as {
  asOf: string;
  disclaimer: string;
  tiles: Tile[];
};

// "India at a glance": colourful fact tiles. Every figure carries its source.
export default function IndiaStats() {
  return (
    <section className="glance" aria-labelledby="glance-h">
      <Reveal>
        <h2 id="glance-h">India at a glance</h2>
        <p className="lead">A few numbers that show how much there is to explore.</p>
      </Reveal>
      <ul className="glance-grid">
        {stats.tiles.map((t, i) => (
          <li key={t.id}>
            <Reveal delay={i * 70}>
              <article className={`gtile tone-${t.tone}`}>
                <span className="g-orb" aria-hidden="true" />
                <p className="g-num">
                  <CountUp to={t.value} decimals={t.decimals} />
                  {t.unit && <small>{t.unit}</small>}
                </p>
                <h3>{t.label}</h3>
                <p className="g-detail">{t.detail}</p>
                <a
                  className="g-src"
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source: {t.source}
                </a>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
      <p className="small glance-note">{stats.disclaimer}</p>
    </section>
  );
}
