import creditsJson from "@/data/image-credits.json";

export type ImageCredit = {
  file: string;
  title: string;
  license: string;
  author: string;
  sourceUrl: string;
};

const credits = creditsJson as Record<string, ImageCredit>;

// Returns null when we have no licensed photo; callers show a designed fallback.
export function getImage(slug: string) {
  const c = credits[slug];
  return c ? { ...c, src: `/images/destinations/${c.file}` } : null;
}

// Short plain-text credit shown directly under photos on cards.
export const creditLine = (c: ImageCredit) =>
  `Photo: ${c.author} · ${c.license}`;
