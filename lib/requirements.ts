import json from "@/data/requirements.json";

export type SourceKind = "official" | "wikipedia" | "editorial";
export type ReqSource = { label: string; url: string; kind: SourceKind };

export type ChecklistItem = {
  id: string;
  kind: "required" | "if-applies" | "good";
  text: string;
  note: string;
};
export type ChecklistGroup = {
  id: string;
  title: string;
  blurb: string;
  items: ChecklistItem[];
};
export type SpecialCase = {
  id: string;
  title: string;
  tag: string;
  applies: string;
  summary: string;
  points: string[];
  how?: string[];
  help?: string;
  sources: string[];
};

const data = json as {
  readOn: string;
  sources: Record<string, ReqSource>;
  quick: { id: string; title: string; body: string; href: string; cta: string }[];
  checklist: ChecklistGroup[];
  evisa: {
    intro: string;
    facts: { k: string; v: string }[];
    steps: string[];
    warning: string;
  };
  special: SpecialCase[];
  after: { title: string; body: string }[];
};

export const req = data;

// The strongest evidence behind a special case, shown as a badge so a reader
// can tell a government statement from a Wikipedia summary.
export function evidenceOf(c: SpecialCase): {
  level: "official" | "secondary" | "editorial";
  label: string;
} {
  const kinds = c.sources.map((id) => data.sources[id]?.kind);
  // "Official" here means we actually read an official page for THIS case,
  // not just that a general ministry link is listed.
  const readOfficial = ["arunachal", "chardham"];
  if (c.sources.some((id) => readOfficial.includes(id))) {
    return { level: "official", label: "Backed by an official page we read" };
  }
  if (kinds.includes("wikipedia")) {
    return { level: "secondary", label: "From Wikipedia, confirm officially" };
  }
  return { level: "editorial", label: "Our own note, confirm officially" };
}
