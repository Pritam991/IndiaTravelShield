import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE_URL } from "@/lib/data";
import SiteHeader from "@/components/SiteHeader";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import AdSenseLoader from "@/components/AdSenseLoader";
import ConsentBanner from "@/components/ConsentBanner";
import ConsentLink from "@/components/ConsentLink";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "IndiaTravelShield | Travel India. Travel Informed.",
    template: "%s | IndiaTravelShield",
  },
  description:
    "Travel guides, entry requirements and logistics for international visitors to India, with official sources linked and our own guidance labelled.",
  openGraph: { siteName: "IndiaTravelShield", type: "website" },
  other: { "google-adsense-account": "ca-pub-2502630111748192" },
};

// Runs before first paint so the saved theme and 3D choice never flash.
// 3D defaults on for fine pointers, and off for touch and reduced motion.
const INIT = `try{var d=document.documentElement,t=localStorage.getItem('its-theme');if(t)d.dataset.theme=t;var m=localStorage.getItem('its-3d');if(!m)m=(matchMedia('(prefers-reduced-motion: reduce)').matches||!matchMedia('(pointer: fine)').matches)?'off':'on';d.dataset.mode3d=m}catch(e){document.documentElement.dataset.mode3d='off'}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INIT }} />
      </head>
      <body>
        <ScrollProgress />
        <SiteHeader />
        <main>{children}</main>
        <footer>
          <div className="foot-in">
            <div>
              <span className="logo-plate foot-logo">
                <Image
                  src="/logo.png"
                  alt="IndiaTravelShield"
                  width={720}
                  height={322}
                  sizes="150px"
                />
              </span>
              <p>
                An independent information service,{" "}
                <strong>not affiliated with the Government of India</strong> or
                any government. We do not process visa applications.
              </p>
            </div>
            <div>
              <strong>Explore</strong>
              <p>
                <Link href="/states">States</Link>
                <br />
                <Link href="/destinations">Destinations</Link>
                <br />
                <Link href="/requirements">Requirements</Link>
                <br />
                <Link href="/methodology">Sources &amp; method</Link>
              </p>
            </div>
            <div>
              <strong>About</strong>
              <p>
                <Link href="/about">About us</Link>
                <br />
                <Link href="/contact">Contact &amp; corrections</Link>
                <br />
                <Link href="/privacy">Privacy policy</Link>
                <br />
                <ConsentLink />
              </p>
            </div>
          </div>
        </footer>
        <BackToTop />
        <ConsentBanner />
        {/*
          Google AdSense loads only after the visitor accepts, and only on full
          content pages (see lib/ads.ts). Site ownership is declared by the
          google-adsense-account meta tag in metadata.other above, so nothing
          has to load from Google before consent.
        */}
        <AdSenseLoader />
      </body>
    </html>
  );
}
