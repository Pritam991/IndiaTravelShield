import type { Metadata } from "next";
import { Fragment } from "react";
import { destinations, national } from "@/lib/data";
import { SourceLink } from "@/components/Ui";
import RequirementsChecker from "@/components/RequirementsChecker";

export const metadata: Metadata = {
  title: "India entry requirements checker",
  description: "Find out what documents you need to visit India, by destination.",
  alternates: { canonical: "/requirements" },
};

export default function RequirementsPage() {
  const options = destinations.map((d) => ({
    slug: d.slug,
    name: d.name,
    permit: d.permit,
  }));
  return (
    <>
      <h1>Check what you need</h1>
      <p className="lead">
        Visa rules depend on your nationality and change often. We do not guess
        them. This tool lists what to verify and sends you to the official
        source.
      </p>
      <RequirementsChecker
        options={options}
        visaLink={<SourceLink id="visa" />}
        boiLink={<SourceLink id="boi" />}
        mhaLink={<SourceLink id="mha" />}
        advisoryLinks={national.advisorySources.map((id, i) => (
          <Fragment key={id}>
            {i > 0 && ", "}
            <SourceLink id={id} />
          </Fragment>
        ))}
      />
    </>
  );
}
