// Headless Chrome CDP capture rig. Exact CSS viewport + deviceScaleFactor via
// Emulation.setDeviceMetricsOverride, so the 125% Windows display scale never
// touches the output (see memory: headless --window-size crops at 125% DPI).
// Usage: node capture.mjs <jobs.json>
// Job: { url, out, width, height, dsf, mobile, waitMs, scrollTo, clickSel, settleMs }
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9333 + Math.floor(Math.random() * 200); // fresh port per run (memory trap #10)
const jobs = JSON.parse(readFileSync(process.argv[2], "utf8"));

const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  "--enable-unsafe-swiftshader",
  "--no-first-run",
  "--hide-scrollbars",
  "--window-size=1600,1000",
  `--user-data-dir=${process.env.TEMP}\\cdp-capture-${PORT}`,
  "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getTarget() {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json`);
      const list = await res.json();
      const page = list.find((t) => t.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error("Chrome debug port never came up");
}

let msgId = 0;
const pending = new Map();
let ws;

function send(method, params = {}, timeoutMs = 30000) {
  const id = ++msgId;
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`CDP timeout ${method} after ${timeoutMs}ms`));
    }, timeoutMs);
    pending.set(id, {
      resolve: (v) => { clearTimeout(t); resolve(v); },
      reject: (e) => { clearTimeout(t); reject(e); },
    });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

let loadFired = false;
function onMessage(ev) {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(`${msg.error.message}`));
    else resolve(msg.result);
  } else if (msg.method === "Page.loadEventFired") {
    loadFired = true;
  }
}

async function run() {
  const wsUrl = await getTarget();
  ws = new WebSocket(wsUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  ws.onmessage = onMessage;

  await send("Page.enable");
  await send("Runtime.enable");

  for (const job of jobs) {
    try {
      await runJob(job);
    } catch (e) {
      console.error(`JOB FAIL ${job.out || job.url}: ${e.message}`);
      // dsf fallback: heavy WebGL pages can hang captureScreenshot at dsf 2
      if ((job.dsf ?? 2) > 1.25) {
        const fb = { ...job, dsf: 1.25 };
        try {
          await runJob(fb);
          console.log(`RECOVERED at dsf 1.25: ${job.out}`);
        } catch (e2) {
          console.error(`FALLBACK FAIL ${job.out}: ${e2.message}`);
        }
      }
    }
  }
}

async function runJob(job) {
  {
    const {
      url, out, width = 1440, height = 900, dsf = 2, mobile = false,
      waitMs = 4000, scrollTo = 0, clickSel = null, settleMs = 1200,
      evalJs = null, probe = null,
    } = job;

    await send("Emulation.setDeviceMetricsOverride", {
      width, height, deviceScaleFactor: dsf, mobile,
    });
    if (mobile) {
      await send("Emulation.setTouchEmulationEnabled", { enabled: true });
      await send("Network.enable");
      await send("Network.setUserAgentOverride", {
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
      });
    } else {
      await send("Emulation.setTouchEmulationEnabled", { enabled: false });
    }

    loadFired = false;
    await send("Page.navigate", { url });
    for (let i = 0; i < waitMs / 100 && !loadFired; i++) await sleep(100);
    await sleep(waitMs); // SPA settle: entrances, fonts, images

    if (clickSel) {
      await send("Runtime.evaluate", {
        expression: `document.querySelector(${JSON.stringify(clickSel)})?.click()`,
      });
      await sleep(settleMs);
    }
    if (evalJs) {
      await send("Runtime.evaluate", { expression: evalJs, awaitPromise: true }, 90000);
      await sleep(settleMs);
    }
    if (scrollTo) {
      await send("Runtime.evaluate", {
        expression: `window.scrollTo({ top: ${scrollTo}, behavior: "instant" })`,
      });
      await sleep(settleMs);
    }

    if (out) {
      const shot = await send("Page.captureScreenshot", { format: "png" });
      mkdirSync(dirname(out), { recursive: true });
      writeFileSync(out, Buffer.from(shot.data, "base64"));
    }

    if (probe) {
      const p = await send("Runtime.evaluate", {
        expression: probe, returnByValue: true, awaitPromise: true,
      });
      console.log(`PROBE ${url} :: ${typeof p.result.value === "string" ? p.result.value : JSON.stringify(p.result.value)}`);
    }

    // Report page metrics so overflow/blank pages are caught immediately
    const m = await send("Runtime.evaluate", {
      expression: `JSON.stringify({ title: document.title, h: document.documentElement.scrollHeight, w: document.documentElement.scrollWidth, url: location.href })`,
      returnByValue: true,
    });
    console.log(`OK ${out} :: ${m.result.value}`);
  }
}

run()
  .then(() => { chrome.kill(); process.exit(0); })
  .catch((e) => { console.error("FAIL:", e.message); chrome.kill(); process.exit(1); });
