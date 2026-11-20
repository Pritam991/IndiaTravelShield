import type { MetadataRoute } from "next";
import { SITE_URL, destinations, states } from "@/lib/data";
import { guideHref, wbPlaces } from "@/lib/wb";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/states",
    "/west-bengal",
    "/destinations",
    "/requirements",
    "/insights",
    "/methodology",
    "/about",
    "/contact",
    "/privacy",
    ...states.map((s) => `/states/${s.slug}`),
    ...destinations.map((d) => `/destinations/${d.slug}`),
    ...wbPlaces
      .filter((p) => !guideHref(p))
      .map((p) => `/west-bengal/${p.id}`),
  ];
  return paths.map((p) => ({ url: `${SITE_URL}${p}` }));
}
