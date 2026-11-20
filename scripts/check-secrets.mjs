// Scans the files git tracks or has staged for anything that looks like an API
// key, and exits non-zero if it finds one. Run before you commit or push:
//   npm run check:secrets
//
// It looks for:
//   - a data.gov.in style key: 56 hex characters
//   - "api-key=<long value>" in a URL
//   - the exact value of DATAGOV_KEY, if it is set in your environment
// It never prints the value it found, only the file and line.
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const git = (cmd) => execSync(`git ${cmd}`, { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

const files = new Set(
  [...git("ls-files -z").split("\0"), ...git("diff --cached --name-only -z").split("\0")].filter(Boolean),
);
// Untracked but not ignored files are the ones about to be added next.
for (const f of git("ls-files -z --others --exclude-standard").split("\0").filter(Boolean)) files.add(f);

const SKIP_EXT = /\.(png|jpe?g|gif|webp|ico|woff2?|ttf|pdf|lock)$/i;
const SKIP_FILE = /(^|\/)package-lock\.json$/;
const patterns = [
  { name: "56-character hex string (data.gov.in key format)", re: /\b[0-9a-f]{56}\b/i },
  { name: "api-key= with a long value", re: /api[-_]?key=[A-Za-z0-9]{20,}/i },
];
const envKey = (process.env.DATAGOV_KEY || "").trim();

const hits = [];
for (const f of files) {
  if (SKIP_EXT.test(f) || SKIP_FILE.test(f)) continue;
  const abs = path.join(ROOT, f);
  if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) continue;
  const lines = fs.readFileSync(abs, "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const p of patterns) if (p.re.test(line)) hits.push({ f, n: i + 1, what: p.name });
    if (envKey.length >= 16 && line.includes(envKey)) hits.push({ f, n: i + 1, what: "the value of DATAGOV_KEY" });
  });
}

if (hits.length) {
  console.error(`\nPossible secret in ${hits.length} place(s). Do not commit or push:\n`);
  for (const h of hits) console.error(`  ${h.f}:${h.n}  ${h.what}`);
  console.error("\nRemove it, keep keys in .env.local (git-ignored) or an environment variable, then run again.");
  process.exit(1);
}
console.log(`No secrets found in ${files.size} files checked.`);
