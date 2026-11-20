import type { Metadata } from "next";
import Link from "next/link";
import ContactLine from "@/components/ContactLine";

export const metadata: Metadata = {
  title: "About IndiaTravelShield",
  description:
    "Who IndiaTravelShield is for, what it covers, and how it handles sources and accuracy.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <article className="prose">
      <h1>About IndiaTravelShield</h1>
      <p className="lead">
        An independent guide for people outside India who want to visit it
        well-informed: what to check, what you need, and how to get there.
      </p>

      <h2>Why this site exists</h2>
      <p>
        Planning a trip to India means sorting through government advisories,
        visa portals, permit rules for protected regions, and travel blogs of
        very uneven quality. IndiaTravelShield brings the practical questions
        for each destination into one place and points you to the official
        source for each answer.
      </p>

      <h2>What you will find</h2>
      <ul className="bul">
        <li>
          Guides to states and destinations, with West Bengal covered first,
          including highlights, best seasons and how to get around.
        </li>
        <li>
          Practical risks and health notes for each place, written plainly.
        </li>
        <li>
          A checklist of the documents to verify for your nationality and
          destination, linked to the official portals.
        </li>
        <li>
          Links to current government travel advisories from several
          countries, so you can read your own government&apos;s advice.
        </li>
      </ul>

      <h2>How we handle accuracy</h2>
      <ul className="bul">
        <li>
          <strong>Sources come first.</strong> Where a figure should come from
          an official source and we do not yet have it, the page says
          &quot;data not yet loaded&quot; instead of guessing.
        </li>
        <li>
          <strong>No safety score.</strong> We do not label a place safe or
          unsafe, and we do not combine different statistics into one rating.
          We describe risks and send you to current advisories.
        </li>
        <li>
          <strong>Editorial guidance is labelled.</strong> Much of the
          descriptive text is general travel guidance that has not yet been
          checked line by line against official sources. Pages say so, and you
          should confirm anything important before you travel. Emergency
          numbers were checked against the National Portal of India on 20
          November 2026.
        </li>
        <li>
          <strong>Corrections are welcome.</strong> See{" "}
          <Link href="/contact">how to report an error</Link>.
        </li>
      </ul>
      <p>
        More detail is on the{" "}
        <Link href="/methodology">sources and methodology</Link> page.
      </p>

      <h2>What we are not</h2>
      <ul className="bul">
        <li>
          We are <strong>not</strong> a government website and are not
          affiliated with the Government of India or any government.
        </li>
        <li>
          We are <strong>not</strong> a visa agent. We do not process visa
          applications or permits. Apply only on the official portals, since
          look-alike sites charge extra fees.
        </li>
        <li>
          We do not give legal, medical or insurance advice. Speak to a
          qualified professional for those.
        </li>
      </ul>

      <h2>Photos</h2>
      <p>
        Photographs come from Wikimedia Commons under Creative Commons
        licences. Each photo is credited to its author directly under the
        image, with a link to its source page.
      </p>

      <h2>Funding</h2>
      <p>
        The site may show advertising and may use affiliate links in future.
        Paid placements never change the safety, permit or entry information.
        See the <Link href="/privacy">privacy policy</Link> for how
        advertising works.
      </p>

      <h2>Get in touch</h2>
      <p>
        Questions, corrections or ideas: <ContactLine subject="About" />.
      </p>
    </article>
  );
}
