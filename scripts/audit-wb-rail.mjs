// Downgrades any Howrah/Sealdah "yes" that the station pages we read do NOT
// support. Evidence read on 2026-11-20:
//  - Howrah page: lines listed incl. Howrah-New Jalpaiguri; Sheoraphuli-Bishnupur
//    branch shown on map; Digha shown only as a map station; Bolpur, Gangasagar,
//    Bandel, Belur, Tarapith, Alipurduar NOT mentioned.
//  - Sealdah page: long-distance incl. New Jalpaiguri (Darjeeling Mail),
//    New Alipurduar, Alipurduar, Lalgola/Berhampore, Rampurhat (Maa Tara Express),
//    Malda, Balurghat; suburban Canning/Namkhana/Kakdwip/Krishnanagar;
//    Dakshineswar on the Dum Dum-Baranagar-Dakshineswar route.
// Run: node scripts/audit-wb-rail.mjs
import fs from "node:fs";
import path from "node:path";

const file = path.resolve(import.meta.dirname, "..", "data", "wb-places.json");
const d = JSON.parse(fs.readFileSync(file, "utf8"));

// id -> fields to override, with the reason
const FIX = {
  digha: {
    howrah: "unverified",
    note: "The Howrah station page shows Digha only as a station on a route map and does not say Howrah trains serve it. We could not confirm a direct service from Howrah or Sealdah, so check IRCTC.",
  },
  tarapith: {
    howrah: "unverified",
    note: "The Sealdah station page lists a Maa Tara Express to Rampurhat, the nearest main station. A direct Howrah service was not confirmed from the Howrah page.",
  },
  shantiniketan: {
    howrah: "unverified",
    sealdah: "unverified",
    confidence: "unverified",
    note: "Neither the Howrah nor the Sealdah station page mentions Bolpur or Shantiniketan, so we could not confirm which Kolkata terminal has direct trains. Check IRCTC.",
  },
  "bandel-church": {
    howrah: "unverified",
    confidence: "unverified",
    note: "Bandel is not mentioned on the Howrah or Sealdah station pages we read, so we could not confirm a direct connection. Check IRCTC.",
  },
  "belur-math": {
    howrah: "unverified",
    confidence: "unverified",
    note: "Belur Math is in Howrah district, but the Howrah and Sealdah station pages do not mention it, so we could not confirm a direct train. Check IRCTC or local transport.",
  },
  jaldapara: {
    howrah: "unverified",
    note: "The Sealdah station page lists trains to New Alipurduar and Alipurduar. The Howrah page lists a Howrah-New Jalpaiguri line but does not mention Alipurduar, so a Howrah link was not confirmed.",
  },
  "howrah-bridge": {
    confidence: "partial",
    note: "The bridge links Kolkata and Howrah, and Howrah Junction is at its western end. This is general geography rather than a statement from the station page.",
  },
};

let changed = 0;
for (const p of d.places) {
  const fix = FIX[p.id];
  if (!fix) continue;
  const { note, ...railFix } = fix;
  Object.assign(p.rail, railFix);
  if (note) p.rail.note = note;
  changed++;
}
fs.writeFileSync(file, JSON.stringify(d, null, 2));
console.log("entries corrected:", changed);

const yes = (k) => d.places.filter((p) => p.rail[k] === "yes").length;
const unv = (k) => d.places.filter((p) => p.rail[k] === "unverified").length;
console.log(`Howrah: ${yes("howrah")} yes, ${unv("howrah")} not confirmed`);
console.log(`Sealdah: ${yes("sealdah")} yes, ${unv("sealdah")} not confirmed`);
