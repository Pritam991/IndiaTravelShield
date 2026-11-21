"use client";

import { setConsent } from "@/lib/consent";

// Footer link that lets a visitor change their ad and cookie choice at any
// time. It re-opens the banner.
export default function ConsentLink() {
  return (
    <button type="button" className="linklike" onClick={() => setConsent("unset")}>
      Ad and cookie choices
    </button>
  );
}
