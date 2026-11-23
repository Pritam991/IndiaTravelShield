"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { adsEligible } from "@/lib/ads";
import { useConsent } from "@/lib/consent";

// A manual in-content ad unit. It renders nothing until ALL of these hold:
//   1. the visitor accepted ads (same consent gate as the script loader),
//   2. this page is on the full-guide allow-list in lib/ads.ts,
//   3. a unit id is set in NEXT_PUBLIC_ADSENSE_SLOT_INCONTENT.
// Create the unit in AdSense (Ads > By ad unit > Display ads), paste its
// numeric slot id into .env.local, and restart. Until then no empty box shows.
//
// Policy notes: the label is the plain word "Advertisement"; space is reserved
// so the page does not jump; the margins keep the unit well away from links,
// buttons and the consent banner so it cannot be tapped by accident.
const SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT_INCONTENT;
const CLIENT = "ca-pub-2502630111748192";

export default function AdSlot() {
  const consent = useConsent();
  const path = usePathname();
  const pushed = useRef(false);
  const show = !!SLOT && consent === "granted" && adsEligible(path);

  useEffect(() => {
    if (!show || pushed.current) return;
    pushed.current = true;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      /* an ad blocker or a failed script must never break the page */
    }
  }, [show]);

  if (!show) return null;
  return (
    <aside className="adslot" aria-label="Advertisement">
      <span className="adslot-label">Advertisement</span>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={CLIENT}
        data-ad-slot={SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
