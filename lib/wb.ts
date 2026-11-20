import placesJson from "@/data/wb-places.json";
import placeCreditsJson from "@/data/wb-image-credits.json";
import { getDestination } from "@/lib/data";
import { getImage, type ImageCredit } from "@/lib/images";

export type RailLink = "yes" | "no" | "unverified";
export type Confidence = "good" | "partial" | "unverified";

export type Rail = {
  station: string;
  stationNote: string;
  howrah: RailLink;
  sealdah: RailLink;
  confidence: Confidence;
  note: string;
};

export type Place = {
  id: string;
  slug: string | null;
  name: string;
  category: string;
  district: string;
  summary: string;
  known: string[];
  rail: Rail;
  airport: string;
  permit: string | null;
};

export type Category = { id: string; name: string; blurb: string; cover?: string };

const data = placesJson as {
  meta: { basis: string; sourceUrl: string; readOn: string };
  categories: Category[];
  places: Place[];
};
const placeCredits = placeCreditsJson as Record<string, ImageCredit>;

export const wbMeta = data.meta;
export const wbCategories = data.categories;
export const wbPlaces = data.places;

export const getPlace = (id: string) => wbPlaces.find((p) => p.id === id);
export const getPlaceBySlug = (slug: string) =>
  wbPlaces.find((p) => p.slug === slug);
export const placesIn = (cat: string) =>
  wbPlaces.filter((p) => p.category === cat);
export const categoryOf = (id: string) =>
  wbCategories.find((c) => c.id === id);

// A place's photo: its own downloaded place photo first, otherwise the photo
// of the destination guide it links to. Null when neither exists.
export function placeImage(p: Place) {
  const own = placeCredits[p.id];
  if (own) return { ...own, src: `/images/places/${own.file}` };
  if (p.slug) return getImage(p.slug);
  return null;
}

// Link to a full destination guide when one exists.
export const guideHref = (p: Place) =>
  p.slug && getDestination(p.slug) ? `/destinations/${p.slug}` : null;

export const RAIL_LABEL: Record<RailLink, string> = {
  yes: "Connected",
  no: "Not connected",
  unverified: "Not confirmed",
};
