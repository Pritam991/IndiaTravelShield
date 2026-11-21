import type { Metadata } from "next";
import { sources } from "@/lib/data";
import { SourceList } from "@/components/Ui";
import DataAttribution from "@/components/DataAttribution";

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
          <strong>No source, no figure.</strong> Every statistic comes from a
          named published dataset and carries its source and year. Where we do
          not have one, the page says &quot;data not yet loaded&quot; and we do
          not estimate. Our own descriptive guidance is a different thing: it is
          labelled as editorial and has not been checked line by line.
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
          <strong>Checks.</strong> Where we load figures from a dataset we remove
          subtotal rows and check that the rows add up to the published
          totals. Entry rules and permit notes are labelled by how well we could
          check them, and some are from Wikipedia and still need confirming
          with the official source.
        </li>
        <li>
          <strong>Corrections.</strong> Found an error? Tell us and we will fix
          and log it.
        </li>
      </ol>
      <h2>Source list</h2>
      <SourceList ids={Object.keys(sources)} />
      <DataAttribution />
    </>
  );
}
