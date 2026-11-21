import type { Metadata } from "next";
import Link from "next/link";
import ContactLine from "@/components/ContactLine";
import { LEGAL_UPDATED } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What information IndiaTravelShield collects, how advertising works on the site, and your choices.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="prose">
      <h1>Privacy policy</h1>
      <p className="small">Last updated: {LEGAL_UPDATED}</p>

      <p>
        This policy explains what happens to information when you use
        IndiaTravelShield. We keep it short because the site collects very
        little.
      </p>

      <h2>Who we are</h2>
      <p>
        IndiaTravelShield is an independent travel information website for
        international visitors to India. It is not affiliated with the
        Government of India or any government. See the{" "}
        <Link href="/about">About page</Link>. Contact:{" "}
        <ContactLine subject="Privacy question" />.
      </p>

      <h2>What we collect directly</h2>
      <ul className="bul">
        <li>
          <strong>No accounts, forms or comments.</strong> You do not need to
          register, and we do not ask you to submit personal details on the
          site.
        </li>
        <li>
          <strong>The requirements checker runs in your browser.</strong> The
          destination and nationality you choose are used on your device to
          build the checklist. They are not sent to us.
        </li>
        <li>
          <strong>Email you send us.</strong> If you write to us, we receive
          your email address and whatever you include, and we use it only to
          reply or to correct the site.
        </li>
      </ul>

      <h2>Information stored in your browser</h2>
      <p>
        The site saves a few small items in your browser&apos;s local storage.
        They stay on your device, are not sent to us, and you can remove them
        by clearing your site data. They are:
      </p>
      <ul className="bul">
        <li>
          <strong>its-theme</strong>: your light or dark theme choice.
        </li>
        <li>
          <strong>its-3d</strong>: whether you turned the 3D effects on or off.
        </li>
        <li>
          <strong>its-req-checked</strong>: which items you ticked on the
          requirements checklist.
        </li>
        <li>
          <strong>its-consent</strong>: your choice about ads and cookies
          (accepted or declined), so we do not ask you again.
        </li>
      </ul>

      <h2>Server logs</h2>
      <p>
        Like most websites, the server that hosts the site may automatically
        record technical details of each request, such as your IP address,
        browser type, the page requested and the time. Our hosting provider
        keeps these logs for security and to keep the site running.
      </p>

      <h2 id="advertising">Advertising (Google AdSense)</h2>
      <p>
        The site is supported by advertisements served by Google AdSense.{" "}
        <strong>Nothing is loaded from Google until you press Accept</strong> on
        the banner, and then only on full guide pages (destination guides, the
        Insights page and the requirements guide), not on the home page, lists
        or this page. If you press Decline, no Google ad code is loaded and we
        set no Google cookies.
      </p>
      <p>
        If you accept, third-party vendors, including Google, use cookies and
        similar technologies to serve ads, and they may place and read cookies
        on your browser. Google uses cookies, device identifiers and your IP
        address to serve and measure ads, to limit how often you see one, to
        prevent invalid clicks, and to show ads based on your interests or
        earlier visits where that is allowed. We do not control those cookies
        and do not receive the personal data they collect. We do not pass any
        personally identifiable information to Google.
      </p>
      <p>
        You can change your choice at any time with the &ldquo;Ad and cookie
        choices&rdquo; link in the footer. If you had accepted, choosing
        Decline reloads the page so the ad code stops running.
      </p>
      <p>
        <strong>About our consent notice.</strong> The notice on this site is our
        own simple accept-or-decline choice. It is not a Google-certified
        consent management platform, and it does not send Google the IAB TCF
        consent signal. We therefore do not rely on it to request personalised
        ads for visitors in the European Economic Area, the United Kingdom or
        Switzerland.
      </p>
      <ul className="bul">
        <li>
          How Google uses data from sites that use its services:{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
          >
            policies.google.com/technologies/partner-sites
          </a>
        </li>
        <li>
          Manage or turn off personalised ads:{" "}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            adssettings.google.com
          </a>
        </li>
        <li>
          Industry opt-out for interest-based advertising:{" "}
          <a
            href="https://www.aboutads.info"
            target="_blank"
            rel="noopener noreferrer"
          >
            aboutads.info
          </a>{" "}
          (US) and{" "}
          <a
            href="https://www.youronlinechoices.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            youronlinechoices.com
          </a>{" "}
          (Europe)
        </li>
      </ul>
      <p>
        Advertisements are paid placements. They do not change the safety,
        permit or entry information on the site, and a business cannot pay to
        change how a destination is described.
      </p>

      <h2>Data we use</h2>
      <p>
        Statistics on this site come from datasets the Ministry of Tourism,
        Government of India, published on data.gov.in under the Government Open
        Data License - India. They are national and state figures, not
        information about individuals. Each place they appear carries its
        attribution, and the full list is on the{" "}
        <Link href="/methodology">sources page</Link>. Photographs come from
        Wikimedia Commons under Creative Commons licences and are credited under
        each image.
      </p>

      <h2>Links to other websites</h2>
      <p>
        Pages link to government and other external sites, such as visa
        portals, advisories and railway booking. Those sites have their own
        privacy practices, which we do not control. Apply for an Indian visa
        only on the official government portal.
      </p>

      <h2>Children</h2>
      <p>
        The site is meant for adults planning travel and is not directed at
        children. We do not knowingly collect information from children.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live (for example the European Economic Area,
        the United Kingdom or California) you may have rights to access,
        correct or delete personal data, or to object to certain uses. We hold
        very little data about you beyond any email you send us, so the most
        useful steps are usually in your own browser and in your Google ad
        settings above. To ask us about data we hold, write to{" "}
        <ContactLine subject="Data request" />.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If we change how the site handles information, we will update this
        page and its date.
      </p>
    </article>
  );
}
