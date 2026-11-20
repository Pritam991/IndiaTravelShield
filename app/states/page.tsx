import type { Metadata } from "next";
import Link from "next/link";
import { destinationsInState, states } from "@/lib/data";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Indian states and territories",
  description:
    "Browse every Indian state and union territory with destinations and entry information.",
  alternates: { canonical: "/states" },
};

export default function StatesPage() {
  return (
    <>
      <PageHeader
        eyebrow="States"
        title="States and union territories"
        lead="Every Indian state and union territory, with the destinations we cover and any permit notes."
      />
      <ul className="cards">
        {states.map((s) => {
          const n = destinationsInState(s.name).length;
          return (
            <li key={s.slug}>
              <Link href={`/states/${s.slug}`}>
                <strong>{s.name}</strong>
                {s.priority && <em>Featured</em>}
                <span>
                  {n ? `${n} destination${n > 1 ? "s" : ""}` : "Coming soon"}
                </span>
                {s.permitNote && <em>Permit note</em>}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
