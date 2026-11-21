"use client";

import Link from "next/link";
import { adScriptIsLoaded, setConsent, useConsent } from "@/lib/consent";

// A plain choice shown until the visitor makes one. Accept and Decline are the
// same size and style on purpose: declining must be as easy as accepting. It
// does not block the page or trap focus. This is not a Google-certified
// consent platform (TCF); the privacy policy says so.
export default function ConsentBanner() {
  const consent = useConsent();
  if (consent !== "unset") return null;

  const decline = () => {
    // If the ad script is already on this page (they are changing an earlier
    // "accept"), reload so it stops running.
    const wasLoaded = adScriptIsLoaded();
    setConsent("denied");
    if (wasLoaded) window.location.reload();
  };

  return (
    <section className="consent" role="region" aria-label="Ads and cookies">
      <p>
        <strong>Ads and cookies.</strong> This site is supported by Google AdSense ads. Google
        sets cookies and uses device identifiers to show and measure them. Nothing from Google
        loads unless you accept. <Link href="/privacy#advertising">Read how it works</Link>.
      </p>
      <div className="consent-btns">
        <button type="button" className="btn" onClick={() => setConsent("granted")}>
          Accept
        </button>
        <button type="button" className="btn" onClick={decline}>
          Decline
        </button>
      </div>
    </section>
  );
}
