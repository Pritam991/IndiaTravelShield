import Link from "next/link";
import Photo from "./Photo";
import Reveal from "./Reveal";

export type Tile = {
  id: string;
  name: string;
  blurb: string;
  count: number;
  img: string | null;
  credit: string | null;
};

// Large photo tiles, one per category. A bento-style grid: the first tile is
// wider on big screens so the row doesn't look like a flat list of equals.
export default function CategoryTiles({ tiles }: { tiles: Tile[] }) {
  return (
    <ul className="ctiles">
      {tiles.map((t, i) => (
        <li
          key={t.id}
          className={i === 0 || i === tiles.length - 1 ? "wide" : undefined}
        >
          <Reveal delay={(i % 3) * 80}>
            <Link href={`/west-bengal#${t.id}`} className="ctile">
              <div className="ctile-ph">
                <Photo
                  src={t.img}
                  alt=""
                  name={t.name}
                  sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                />
              </div>
              <div className="ctile-body">
                <strong>{t.name}</strong>
                <span>{t.blurb}</span>
                <b>
                  {t.count} places <i aria-hidden="true">&rarr;</i>
                </b>
              </div>
              {t.credit && <span className="ctile-credit">{t.credit}</span>}
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
