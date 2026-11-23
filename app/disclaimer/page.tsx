import type { Metadata } from "next";
import Link from "next/link";
import ContactLine from "@/components/ContactLine";
import { LEGAL_UPDATED } from "@/lib/site";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "IndiaTravelShield gives general travel information, not legal, medical or visa advice. Read what that means before you rely on a page.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <article className="prose">
      <h1>Disclaimer</h1>
      <p className="small">Last updated: {LEGAL_UPDATED}</p>

      <h2>General information only</h2>
      <p>
        Everything on IndiaTravelShield is general information to help you plan.
        It is not legal, immigration, medical, insurance or financial advice,
        and it does not replace a qualified professional or your own
        government&apos;s travel advice.
      </p>

      <h2>Not a government site, not a visa agent</h2>
      <p>
        We are an independent publication. We are not affiliated with the
        Government of India or any government, and we do not accept or process
        visa or permit applications. Apply only on the official government
        portals linked from each page, because look-alike sites charge extra
        fees.
      </p>

      <h2>Rules and conditions change</h2>
      <p>
        Visa and permit rules, fees, health requirements, prices, transport
        schedules and safety conditions can change without notice. Pages say
        when guidance is our own editorial summary and has not been checked line
        by line against an official source. Confirm anything that matters, such
        as entry documents, restricted-area permits and vaccinations, with the
        official source before you travel.
      </p>

      <h2>No safety rating</h2>
      <p>
        We do not label a place safe or unsafe. We describe practical risks and
        send you to current government advisories. Travel carries risk, and you
        travel at your own responsibility.
      </p>

      <h2>Emergencies</h2>
      <p>
        The site cannot help in an emergency. In India, dial <strong>112</strong>.
      </p>

      <h2>Advertising and affiliate links</h2>
      <p>
        The site shows advertisements from Google AdSense and may carry
        affiliate links in future. Paid placements never change the safety,
        permit or entry information. We are not responsible for advertisers&apos;
        claims. See the <Link href="/privacy#advertising">privacy policy</Link>.
      </p>

      <h2>External links</h2>
      <p>
        We link to third-party sites for convenience. We do not control them and
        are not responsible for what they say or how they handle your data.
      </p>

      <h2>Corrections</h2>
      <p>
        Spotted a mistake? Tell us at <ContactLine subject="Correction" /> or
        through the <Link href="/contact">contact page</Link>. See the{" "}
        <Link href="/terms">terms of service</Link> for the full terms of use.
      </p>
    </article>
  );
}
