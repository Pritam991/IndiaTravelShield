import type { NextConfig } from "next";

// Cache Components is intentionally off: every page is static, and turning it
// off lets `dynamicParams = false` return a real HTTP 404 for unknown slugs.
//
// Security headers. A Content-Security-Policy is deliberately NOT set here:
// Google AdSense loads scripts, frames and images from many changing hosts, and
// a strict policy silently blocks ads. Add one only after testing with ads on.
const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
