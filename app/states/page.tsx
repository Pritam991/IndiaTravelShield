import type { Metadata } from "next";
import Link from "next/link";
import { destinationsInState, states } from "@/lib/data";

export const metadata: Metadata = {
  title: "Indian states and territories",
  description:
    "Browse every Indian state and union territory with destinations and entry information.",
  alternates: { canonical: "/states" },
};

export default function StatesPage() {
  return (
    <>
      <h1>States and union territories</h1>
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
