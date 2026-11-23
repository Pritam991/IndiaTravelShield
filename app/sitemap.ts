import type { MetadataRoute } from "next";
import { SITE_URL, destinations, isThinState, states } from "@/lib/data";
import { guideHref, wbPlaces } from "@/lib/wb";
import { CONTENT_UPDATED } from "@/lib/site";

// Priority tells crawlers which pages matter most; it is a hint, not a command.
// lastModified is the date the guide content last changed (lib/site.ts), not
// the build time, because a date that changes on every deploy gets ignored.
const MODIFIED = new Date(CONTENT_UPDATED);
const entry = (
  path: string,
  priority: number,
  changeFrequency: "weekly" | "monthly" | "yearly",
) => ({ url: `${SITE_URL}${path}`, lastModified: MODIFIED, changeFrequency, priority });

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    entry("", 1, "weekly"),
    entry("/destinations", 0.9, "weekly"),
    entry("/requirements", 0.9, "monthly"),
    entry("/insights", 0.8, "monthly"),
    entry("/states", 0.8, "monthly"),
    entry("/west-bengal", 0.8, "monthly"),
    entry("/methodology", 0.4, "yearly"),
    entry("/about", 0.4, "yearly"),
    entry("/contact", 0.3, "yearly"),
    entry("/privacy", 0.2, "yearly"),
    entry("/terms", 0.2, "yearly"),
    entry("/disclaimer", 0.2, "yearly"),
    ...destinations.map((d) => entry(`/destinations/${d.slug}`, 0.8, "monthly")),
    // States with no destination guides are noindex, so they stay out of here.
    ...states.filter((s) => !isThinState(s.name)).map((s) => entry(`/states/${s.slug}`, 0.6, "monthly")),
    ...wbPlaces
      .filter((p) => !guideHref(p))
      .map((p) => entry(`/west-bengal/${p.id}`, 0.5, "monthly")),
  ];
}
