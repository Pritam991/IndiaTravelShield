// Fetches one licensed photo per West Bengal place that has no guide photo yet.
// Same rules as fetch-images.mjs: only Creative Commons / public-domain files,
// license + author + source URL recorded, 1200px copy saved locally.
// Run: node scripts/fetch-wb-images.mjs
import fs from "node:fs";
import path from "node:path";

const UA = "IndiaTravelShield/0.1 (https://github.com/Pritam991/IndiaTravelShield; image attribution script)";
const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "public", "images", "places");
fs.mkdirSync(OUT, { recursive: true });

// place id -> Wikipedia article title to take the lead image from
const TITLES = {
  kurseong: "Kurseong",
  mirik: "Mirik",
  "lava-rimbick": "Lava, West Bengal",
  mandarmani: "Mandarmani",
  "shankarpur-tajpur": "Shankarpur",
  "bakkhali-gangasagar": "Bakkhali",
  dakshineswar: "Dakshineswar Kali Temple",
  kalighat: "Kalighat Kali Temple",
  "belur-math": "Belur Math",
  mayapur: "Mayapur",
  tarapith: "Tarapith",
  "bandel-church": "Basilica of the Holy Rosary, Bandel",
  "kolkata-churches-gurdwaras": "St. Paul's Cathedral, Kolkata",
  "darjeeling-monasteries": "Ghum Monastery",
  pakbirra: "Pakbirra",
  buxa: "Buxa Tiger Reserve",
  "neora-valley": "Neora Valley National Park",
  "victoria-memorial": "Victoria Memorial, Kolkata",
  "howrah-bridge": "Howrah Bridge",
  "botanic-garden": "Acharya Jagadish Chandra Bose Indian Botanic Garden",
  hazarduari: "Hazarduari Palace",
  "kolkata-cemeteries": "South Park Street Cemetery",
  jorasanko: "Jorasanko Thakur Bari",
  kumartuli: "Kumartuli",
  "eden-gardens": "Eden Gardens",
};

const OK = /^(CC BY(-SA)? \d\.\d|CC0( 1\.0)?|Public domain|PD)$/i; // commercial use allowed; NC and ND rejected
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const strip = (h) => (h ?? "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

async function api(base, params) {
  const url = `${base}?${new URLSearchParams({ format: "json", ...params })}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function leadFile(title) {
  const j = await api("https://en.wikipedia.org/w/api.php", {
    action: "query", prop: "pageimages", piprop: "name", redirects: "1", titles: title,
  });
  return Object.values(j.query.pages)[0].pageimage ?? null;
}

async function fileInfo(file) {
  const j = await api("https://commons.wikimedia.org/w/api.php", {
    action: "query", prop: "imageinfo", titles: `File:${file}`,
    iiprop: "url|extmetadata|mime", iiurlwidth: "1200",
    iiextmetadatafilter: "LicenseShortName|Artist|Credit",
  });
  const ii = Object.values(j.query.pages)[0].imageinfo?.[0];
  if (!ii) return null;
  const m = ii.extmetadata ?? {};
  return {
    thumb: ii.thumburl,
    descriptionUrl: ii.descriptionurl,
    mime: ii.mime,
    license: m.LicenseShortName?.value ?? "",
    author: (strip(m.Artist?.value) || strip(m.Credit?.value) || "Unknown")
      .replace(/\s+\d{4}-\d{2}-\d{2}.*$/, "")
      .replace(/^User:/, "")
      .slice(0, 80),
  };
}

const CREDITS = path.join(ROOT, "data", "wb-image-credits.json");
const credits = fs.existsSync(CREDITS) ? JSON.parse(fs.readFileSync(CREDITS, "utf8")) : {};

for (const [id, title] of Object.entries(TITLES)) {
  if (credits[id] && fs.existsSync(path.join(OUT, credits[id].file))) continue;
  try {
    const file = await leadFile(title);
    if (!file) { console.log(`SKIP ${id}: no lead image`); continue; }
    const info = await fileInfo(file);
    if (!info) { console.log(`SKIP ${id}: no info`); continue; }
    if (!/^image\/(jpeg|png)$/.test(info.mime)) { console.log(`SKIP ${id}: ${info.mime}`); continue; }
    if (!OK.test(info.license)) { console.log(`SKIP ${id}: license "${info.license}"`); continue; }
    let res;
    for (let attempt = 1; attempt <= 4; attempt++) {
      res = await fetch(info.thumb, { headers: { "User-Agent": UA } });
      if (res.ok) break;
      await sleep(4000 * attempt);
    }
    if (!res.ok) { console.log(`SKIP ${id}: download ${res.status}`); continue; }
    const ext = info.mime === "image/png" ? "png" : "jpg";
    fs.writeFileSync(path.join(OUT, `${id}.${ext}`), Buffer.from(await res.arrayBuffer()));
    credits[id] = {
      file: `${id}.${ext}`,
      title: file.replace(/_/g, " "),
      license: info.license,
      author: info.author,
      sourceUrl: info.descriptionUrl,
    };
    console.log(`OK   ${id}: ${file} | ${info.license} | ${info.author.slice(0, 40)}`);
  } catch (e) {
    console.log(`ERR  ${id}: ${e.message}`);
  }
  await sleep(1200);
}
fs.writeFileSync(CREDITS, JSON.stringify(credits, null, 2));
console.log(`\n${Object.keys(credits).length}/${Object.keys(TITLES).length} place images saved`);
