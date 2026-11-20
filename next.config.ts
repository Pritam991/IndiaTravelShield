import type { NextConfig } from "next";

// Cache Components is intentionally off: every page is static, and turning it
// off lets `dynamicParams = false` return a real HTTP 404 for unknown slugs.
const nextConfig: NextConfig = {};

export default nextConfig;
