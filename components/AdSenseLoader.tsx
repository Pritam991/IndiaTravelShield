"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { ADSENSE_SRC, adsEligible } from "@/lib/ads";
import { useConsent } from "@/lib/consent";

// Loads Google AdSense only when BOTH are true: the visitor accepted ads and
// cookies, and this page is a full content page (see lib/ads.ts). Until then
// nothing is requested from Google. It runs after hydration, which also avoids
// the hydration mismatch the script caused when it sat in <head>.
export default function AdSenseLoader() {
  const consent = useConsent();
  const path = usePathname();
  if (consent !== "granted" || !adsEligible(path)) return null;
  return (
    <Script
      id="adsense-loader"
      async
      src={ADSENSE_SRC}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
