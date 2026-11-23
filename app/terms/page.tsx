import type { Metadata } from "next";
import Link from "next/link";
import ContactLine from "@/components/ContactLine";
import { LEGAL_UPDATED } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of service",
  description:
    "The terms that apply when you use IndiaTravelShield: acceptable use, intellectual property, third-party links and advertising, and limits of liability.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <article className="prose">
      <h1>Terms of service</h1>
      <p className="small">Last updated: {LEGAL_UPDATED}</p>

      <p>
        By using IndiaTravelShield (the &ldquo;site&rdquo;) you agree to these
        terms. If you do not agree, please do not use the site.
      </p>

      <h2>What the site is</h2>
      <p>
        IndiaTravelShield is an independent information service for people
        planning travel to India. It is not a government website, is not
        affiliated with the Government of India or any government, and does not
        process visa applications or permits. See the{" "}
        <Link href="/about">About page</Link> and the{" "}
        <Link href="/disclaimer">disclaimer</Link>.
      </p>

      <h2>Acceptable use</h2>
      <p>You agree not to:</p>
      <ul className="bul">
        <li>scrape the site in bulk or place unreasonable load on it;</li>
        <li>try to gain unauthorised access to the site or its hosting;</li>
        <li>
          interfere with advertising, including clicking ads yourself or
          encouraging others to, or generating artificial impressions;
        </li>
        <li>use the site for anything unlawful.</li>
      </ul>

      <h2>Intellectual property</h2>
      <p>
        The text, layout and code of the site belong to IndiaTravelShield unless
        stated otherwise. You may quote short excerpts with a link back to the
        page. Any other copying needs our written permission. Photographs come
        from Wikimedia Commons under Creative Commons licences and remain the
        property of their authors; each is credited under the image. Statistics
        come from datasets published under the Government Open Data License -
        India, with attribution on the pages that use them.
      </p>

      <h2>Third-party links and advertising</h2>
      <p>
        The site links to government portals and other external websites and
        may show advertisements served by Google AdSense. We do not control
        those sites or advertisers and are not responsible for their content,
        products or privacy practices. An advertisement is a paid placement,
        not a recommendation. See the{" "}
        <Link href="/privacy#advertising">privacy policy</Link> for how
        advertising works.
      </p>

      <h2>No warranties</h2>
      <p>
        Entry rules, permits, prices, advisories and safety conditions change.
        We work to keep the site accurate and label guidance that has not been
        checked against an official source, but the site is provided
        &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties
        of any kind. Always confirm requirements on the official source before
        you travel.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent the law allows, IndiaTravelShield and its owner
        are not liable for any loss, cost or damage, including a refused
        boarding, denied entry, missed permit, injury or financial loss, that
        arises from using or relying on the site. Nothing in these terms limits
        any right you have under consumer law that cannot be excluded.
      </p>

      <h2>Corrections and takedowns</h2>
      <p>
        If you find an error, or you are a rights holder who wants a credit
        changed or an item removed, write to us from the{" "}
        <Link href="/contact">contact page</Link>.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of India, and the courts of India
        have jurisdiction, subject to any mandatory consumer protections that
        apply where you live.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms. The date at the top shows the latest
        version, and continuing to use the site means you accept the update.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms: <ContactLine subject="Terms question" />.
      </p>
    </article>
  );
}
