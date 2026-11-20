import sourcesJson from "@/data/sources.json";
import nationalJson from "@/data/national.json";
import statesJson from "@/data/states.json";
import destinationsJson from "@/data/destinations.json";
import destinationsWbJson from "@/data/destinations_wb.json";
import detailsJson from "@/data/details.json";
import guidanceJson from "@/data/guidance.json";

export type Source = { name: string; url: string };
export type State = {
  slug: string;
  name: string;
  type: string;
  priority?: boolean;
  overview?: string;
  permitNote?: string;
};
export type Destination = {
  slug: string;
  name: string;
  state: string;
  type: string;
  overview: string;
  airport: string;
  rail: string;
  permit: string | null;
  sources: string[];
};
export type Emergency = { label: string; number: string; status: string };

export const sources = sourcesJson as Record<string, Source>;
export const national = nationalJson as {
  emergency: Emergency[];
  emergencyNote: string;
  verifiedOn: string;
  verifiedSource: string;
  advisorySources: string[];
  visaSource: string;
};

// West Bengal (priority) first, then alphabetical.
export const states: State[] = [...(statesJson as State[])].sort(
  (a, b) =>
    Number(!!b.priority) - Number(!!a.priority) || a.name.localeCompare(b.name),
);

// West Bengal destinations are loaded first so they lead every list.
export const destinations: Destination[] = [
  ...(destinationsWbJson as Destination[]),
  ...(destinationsJson as Destination[]),
];

export type Details = {
  highlights: string[];
  bestTime: string;
  gettingAround: string;
  safety: string[];
  health: string[];
  tips: string[];
};
export type Guidance = {
  editorialNote: string;
  documents: { title: string; body: string }[];
  visitorsExplainer: string[];
  health: string[];
  laws: string[];
  culture: string[];
  emergencyGuide: string[];
};

export const details = detailsJson as Record<string, Details>;
export const guidance = guidanceJson as Guidance;
export const getDetails = (slug: string) => details[slug] ?? null;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://indiatravelshield.com";

export const getState = (slug: string) => states.find((s) => s.slug === slug);
export const getStateByName = (name: string) =>
  states.find((s) => s.name === name);
export const getDestination = (slug: string) =>
  destinations.find((d) => d.slug === slug);
export const destinationsInState = (stateName: string) =>
  destinations.filter((d) => d.state === stateName);
