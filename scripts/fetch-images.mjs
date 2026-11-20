// Fetches one representative photo per destination from Wikimedia Commons,
// records license + author + source, and downloads a 1200px copy locally.
// Run: node scripts/fetch-images.mjs
import fs from "node:fs";
import path from "node:path";

const UA = "IndiaTravelShield/0.1 (image attribution script; contact: set-your-email@example.com)";
const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "public", "images", "destinations");
fs.mkdirSync(OUT, { recursive: true });

// slug -> Wikipedia article title
const TITLES = {
  kolkata: "Kolkata",
  darjeeling: "Darjeeling",
  kalimpong: "Kalimpong",
  sandakphu: "Sandakphu",
  sundarbans: "Sundarbans",
  siliguri: "Siliguri",
  shantiniketan: "Santiniketan",
  bishnupur: "Bishnupur, Bankura",
  murshidabad: "Murshidabad",
  digha: "Digha",
  "cooch-behar": "Cooch Behar",
  dooars: "Dooars",
  delhi: "Delhi",
  agra: "Agra",
  jaipur: "Jaipur",
  goa: "Goa",
  kochi: "Kochi",
  leh: "Leh",
  rishikesh: "Rishikesh",
  shimla: "Shimla",
  udaipur: "Udaipur",
  jodhpur: "Jodhpur",
  munnar: "Munnar",
  alappuzha: "Alappuzha",
  manali: "Manali, Himachal Pradesh",
  dharamshala: "Dharamshala",
};

// Only licenses that allow reuse with attribution / no restriction.
const OK = /^(CC BY(-SA)?( \d\.\d)?|CC0|Public domain|PD|CC BY-SA|CC BY)/i;
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
  const page = Object.values(j.query.pages)[0];
  return page.pageimage ?? null;
}

async function fileInfo(file) {
  const j = await api("https://commons.wikimedia.org/w/api.php", {
    action: "query", prop: "imageinfo", titles: `File:${file}`,
    iiprop: "url|extmetadata|mime|size", iiurlwidth: "1200",
    iiextmetadatafilter: "LicenseShortName|Artist|Credit|ImageDescription",
  });
  const page = Object.values(j.query.pages)[0];
  const ii = page.imageinfo?.[0];
  if (!ii) return null;
  const m = ii.extmetadata ?? {};
  return {
    thumb: ii.thumburl,
    descriptionUrl: ii.descriptionurl,
    mime: ii.mime,
    license: m.LicenseShortName?.value ?? "",
    author: (strip(m.Artist?.value) || strip(m.Credit?.value) || "Unknown").replace(/\s+\d{4}-\d{2}-\d{2}.*$/, "").replace(/^User:/,"").slice(0, 80),
    alt: strip(m.ImageDescription?.value).slice(0, 160),
  };
}

const credits = fs.existsSync(path.join(ROOT, "data", "image-credits.json"))
  ? JSON.parse(fs.readFileSync(path.join(ROOT, "data", "image-credits.json"), "utf8"))
  : {};
for (const [slug, title] of Object.entries(TITLES)) {
  if (credits[slug] && fs.existsSync(path.join(OUT, credits[slug].file))) continue;
  try {
    const file = await leadFile(title);
    if (!file) { console.log(`SKIP ${slug}: no lead image`); continue; }
    const info = await fileInfo(file);
    if (!info) { console.log(`SKIP ${slug}: no info`); continue; }
    if (!/^image\/(jpeg|png)$/.test(info.mime)) { console.log(`SKIP ${slug}: ${info.mime}`); continue; }
    if (!OK.test(info.license)) { console.log(`SKIP ${slug}: license "${info.license}"`); continue; }
    let res;
    for (let attempt = 1; attempt <= 4; attempt++) {
      res = await fetch(info.thumb, { headers: { "User-Agent": UA } });
      if (res.ok) break;
      await sleep(4000 * attempt);
    }
    if (!res.ok) { console.log(`SKIP ${slug}: download ${res.status}`); continue; }
    const ext = info.mime === "image/png" ? "png" : "jpg";
    fs.writeFileSync(path.join(OUT, `${slug}.${ext}`), Buffer.from(await res.arrayBuffer()));
    credits[slug] = {
      file: `${slug}.${ext}`,
      title: file.replace(/_/g, " "),
      license: info.license,
      author: info.author,
      sourceUrl: info.descriptionUrl,
    };
    console.log(`OK   ${slug}: ${file} | ${info.license} | ${info.author.slice(0, 40)}`);
  } catch (e) {
    console.log(`ERR  ${slug}: ${e.message}`);
  }
  await sleep(1200);
}
fs.writeFileSync(path.join(ROOT, "data", "image-credits.json"), JSON.stringify(credits, null, 2));
console.log(`\n${Object.keys(credits).length}/${Object.keys(TITLES).length} images saved`);
