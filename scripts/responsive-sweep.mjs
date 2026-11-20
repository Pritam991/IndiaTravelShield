// Loads pages in headless Edge at several viewport widths and reports
// horizontal overflow and content that never revealed. Dev tool, not shipped.
// usage: node scripts/responsive-sweep.mjs
import { spawn } from "node:child_process";

const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const BASE = "http://localhost:3000/";
const PAGES = ["", "destinations/darjeeling", "destinations/leh", "west-bengal/dakshineswar", "states/west-bengal"];
const SIZES = [[360, 740], [390, 844], [1024, 768]];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const port = 9100 + Math.floor(Math.random() * 600);
const proc = spawn(EDGE, [
  "--headless=new", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
  `--remote-debugging-port=${port}`, `--user-data-dir=${process.env.TEMP}\\sweep-${port}`, "about:blank",
], { stdio: "ignore" });

let ws, id = 0;
const pend = new Map();
const send = (method, params = {}) => new Promise((res, rej) => {
  const i = ++id; pend.set(i, { res, rej });
  ws.send(JSON.stringify({ id: i, method, params }));
});
const ev = async (expression) =>
  (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result.value;

const MEASURE = `(()=>{
  const vw=document.documentElement.clientWidth;
  const bad=[];
  document.querySelectorAll('body *').forEach(el=>{
    const r=el.getBoundingClientRect();
    if(r.width>0&&(r.right>vw+1||r.left<-1)){
      let p=el.parentElement,clip=false;
      while(p&&p!==document.body){const o=getComputedStyle(p).overflowX;if(['hidden','auto','scroll','clip'].includes(o)){clip=true;break;}p=p.parentElement;}
      if(!clip)bad.push((el.className&&String(el.className).split(' ')[0])||el.tagName);
    }
  });
  const small=[...document.querySelectorAll('a,button')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&(r.height<24||r.width<24)&&getComputedStyle(e).visibility!=='hidden'&&!e.closest('.sr,.dots,.hh-dots')}).length;
  return JSON.stringify({vw,scrollW:document.documentElement.scrollWidth,bad:[...new Set(bad)].slice(0,5),
    unrevealed:document.querySelectorAll('.reveal:not(.is-in)').length, tinyTargets:small});
})()`;

try {
  let t;
  for (let i = 0; i < 60; i++) {
    try { t = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (Array.isArray(t) && t.length) break; } catch {}
    await sleep(300);
  }
  ws = new WebSocket(t.find((x) => x.type === "page").webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pend.has(d.id)) { const p = pend.get(d.id); pend.delete(d.id); if (d.error) p.rej(new Error(JSON.stringify(d.error)));
      else p.res(d.result); }
  };
  await send("Page.enable");

  let problems = 0;
  for (const [w, h] of SIZES) {
    await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: w < 700 });
    const rows = [];
    for (const pg of PAGES) {
      await send("Page.navigate", { url: BASE + pg });
      await sleep(2200);
      await ev(`(async()=>{const hh=document.documentElement.scrollHeight;for(let y=0;y<hh;y+=250){window.scrollTo({top:y,behavior:"instant"});await new Promise(r=>setTimeout(r,220));}window.scrollTo({top:0,behavior:"instant"});})()`);
      await sleep(500);
      const m = JSON.parse(await ev(MEASURE));
      const over = m.scrollW > m.vw;
      // carousel slides are positioned off-stage on purpose and clipped by .cf-wrap
      const real = m.bad.filter((c) => !/^cf-/.test(c));
      if (over || real.length || m.unrevealed) problems++;
      rows.push(`${pg || "/"}`.padEnd(28) + (over ? "OVERFLOW " : "ok       ") + (real.length ? "[" + real.join(",") + "] " : "") + (m.unrevealed ? `unrevealed:${m.unrevealed} ` : ""));
    }
    console.log(`\n== ${w}x${h} ==`);
    console.log(rows.join("\n"));
  }
  console.log(`\npages with a problem: ${problems}`);
} finally {
  try { ws.close(); } catch {}
  proc.kill();
}
