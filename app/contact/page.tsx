import type { Metadata } from "next";
import Link from "next/link";
import ContactLine from "@/components/ContactLine";

export const metadata: Metadata = {
  title: "Contact and corrections",
  description:
    "How to contact IndiaTravelShield, report an error or suggest an improvement.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <article className="prose">
      <h1>Contact and corrections</h1>
      <p className="lead">
        Found a mistake, an outdated rule or a broken link? Tell us. Accuracy
        matters more here than on most sites, because a wrong permit or entry
        note can affect someone&apos;s trip.
      </p>

      <h2>Email</h2>
      <p>
        <ContactLine subject="IndiaTravelShield feedback" />
      </p>

      <h2>Reporting an error</h2>
      <p>To help us check and fix it quickly, please include:</p>
      <ul className="bul">
        <li>the page address, or the destination and section it is on</li>
        <li>what the page says and what you believe is correct</li>
        <li>
          a link to an official source that shows the correct information, if
          you have one
        </li>
      </ul>
      <p>
        We check reports against the official source before changing a page.
        Our approach to sources is explained on the{" "}
        <Link href="/methodology">sources and methodology</Link> page.
      </p>

      <h2>What we can and cannot help with</h2>
      <ul className="bul">
        <li>
          <strong>We can</strong> correct information on this site, add a
          destination, or fix a photo credit.
        </li>
        <li>
          <strong>We cannot</strong> process visa applications, issue permits,
          give legal advice, or help in an emergency. For an emergency in
          India, dial <strong>112</strong>. For visa and permit applications,
          use the official government portals linked from each page.
        </li>
      </ul>

      <h2>Photo and copyright notices</h2>
      <p>
        Photos come from Wikimedia Commons under Creative Commons licences and
        are credited under each image. If you are the author of a photo and
        want a credit changed or the photo removed, write to us with the page
        and the photo.
      </p>

      <h2>Advertising and partnerships</h2>
      <p>
        We may show ads and may add affiliate links in future. Paid placements
        never change safety, permit or entry information. Write to us about
        partnerships, but please do not expect changes to how a destination is
        described.
      </p>
    </article>
  );
}
