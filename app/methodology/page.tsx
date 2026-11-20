import type { Metadata } from "next";
import { sources } from "@/lib/data";
import { SourceList } from "@/components/Ui";

export const metadata: Metadata = {
  title: "Data sources and methodology",
  description: "Where our data comes from and how we handle it.",
  alternates: { canonical: "/methodology" },
};

export default function MethodologyPage() {
  return (
    <>
      <h1>Sources &amp; methodology</h1>
      <ol>
        <li>
          <strong>No source, no data.</strong> Every fact needs an official
          source and a date. Otherwise the page says &quot;data not yet
          loaded&quot;.
        </li>
        <li>
          <strong>No blended scores.</strong> We do not merge different years or
          different definitions into one safety score. Indicators are shown
          separately.
        </li>
        <li>
          <strong>Risk information, not guarantees.</strong> We never state that
          a place is &quot;safe&quot;.
        </li>
        <li>
          <strong>Human review.</strong> Visa, permit and advisory content is
          checked against the original before publishing.
        </li>
        <li>
          <strong>Corrections.</strong> Found an error? Tell us and we will fix
          and log it.
        </li>
      </ol>
      <h2>Source list</h2>
      <SourceList ids={Object.keys(sources)} />
    </>
  );
}
