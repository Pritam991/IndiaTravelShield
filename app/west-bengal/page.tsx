import type { Metadata } from "next";
import Link from "next/link";
import {
  guideHref,
  placeImage,
  wbCategories,
  wbMeta,
  wbPlaces,
} from "@/lib/wb";
import { creditLine } from "@/lib/images";
import WbExplorer, { type ExplorerPlace } from "@/components/WbExplorer";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "West Bengal places to visit by category",
  description:
    "Hill stations, beaches, temples, wildlife and heritage sites in West Bengal, each with its nearest railway station and whether Howrah and Sealdah connect to it.",
  alternates: { canonical: "/west-bengal" },
};

export default function WestBengalPage() {
  const places: ExplorerPlace[] = wbPlaces.map((p) => {
    const img = placeImage(p);
    return {
      id: p.id,
      name: p.name,
      category: p.category,
      district: p.district,
      summary: p.summary,
      station: p.rail.station,
      howrah: p.rail.howrah,
      sealdah: p.rail.sealdah,
      img: img?.src ?? null,
      credit: img ? creditLine(img) : null,
      href: guideHref(p) ?? `/west-bengal/${p.id}`,
    };
  });

  return (
    <>
      <nav className="crumb">
        <Link href="/">Home</Link> /{" "}
        <Link href="/states/west-bengal">West Bengal</Link> / Places
      </nav>
      <h1>Places to visit in West Bengal</h1>
      <p className="lead">
        Browse by what you want to do: hills, the sea, temples, wildlife or
        heritage. Each place shows its nearest railway station and whether
        Howrah and Sealdah connect to it.
      </p>

      <Reveal>
        <p className="edit-note">
          <strong>How to read the train information.</strong> A tick means the
          connection is supported by the Wikipedia pages for the Howrah and
          Sealdah stations, at least in part. Open a place to see how sure we
          are, since many routes still need a road leg at the end. A question
          mark means we could not confirm it, so check IRCTC or the railway
          before you plan. We do not guess.
        </p>
      </Reveal>

      <WbExplorer categories={wbCategories} places={places} />

      <p className="small">
        Place list and categories follow the Wikipedia article{" "}
        <a href={wbMeta.sourceUrl} target="_blank" rel="noopener noreferrer">
          Tourism in West Bengal
        </a>
        , read on {wbMeta.readOn}. Railway details come from the Wikipedia pages
        for Howrah Junction and Sealdah stations. These are secondary sources,
        not official ones.
      </p>
    </>
  );
}
