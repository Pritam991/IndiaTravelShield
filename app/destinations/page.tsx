import type { Metadata } from "next";
import { destinations } from "@/lib/data";
import { creditLine, getImage } from "@/lib/images";
import DestinationSearch from "@/components/DestinationSearch";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Destinations in India",
  description:
    "Browse India destinations with safety information, entry documents and travel logistics.",
  alternates: { canonical: "/destinations" },
};

export default function DestinationsPage() {
  const items = destinations.map((d) => {
    const img = getImage(d.slug);
    return {
      slug: d.slug,
      name: d.name,
      state: d.state,
      type: d.type,
      hasPermit: !!d.permit,
      img: img?.src ?? null,
      credit: img ? creditLine(img) : null,
    };
  });
  return (
    <>
      <PageHeader
        eyebrow="Destinations"
        title="Destinations in India"
        lead="Guides with practical notes, documents to check and how to get there. West Bengal destinations are listed first."
      />
      <DestinationSearch items={items} />
    </>
  );
}
