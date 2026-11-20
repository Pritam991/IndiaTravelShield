import type { MetadataRoute } from "next";
import { SITE_URL, destinations, states } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/states",
    "/destinations",
    "/requirements",
    "/methodology",
    "/about",
    "/contact",
    "/privacy",
    ...states.map((s) => `/states/${s.slug}`),
    ...destinations.map((d) => `/destinations/${d.slug}`),
  ];
  return paths.map((p) => ({ url: `${SITE_URL}${p}` }));
}
