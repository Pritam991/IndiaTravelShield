import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE_URL } from "@/lib/data";
import SiteHeader from "@/components/SiteHeader";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "IndiaTravelShield | Travel India. Travel Informed.",
    template: "%s | IndiaTravelShield",
  },
  description:
    "Sourced travel advisories, entry requirements and logistics for international visitors to India.",
  openGraph: { siteName: "IndiaTravelShield", type: "website" },
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
          </div>
          <p className="small">
            Information is compiled from the official sources linked on each
            page and may be out of date. Confirm with the official source
            before you travel. We provide risk information, not a guarantee of
            safety. Entries marked &quot;data not yet loaded&quot; are
            intentionally empty rather than estimated.
          </p>
        </footer>
        <BackToTop />
      </body>
    </html>
  );
}
