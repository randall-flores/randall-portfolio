// Repeatable performance check.
//
//   pnpm perf            # 3 runs, mobile, median
//   pnpm perf --runs=5   # more samples
//   pnpm perf --desktop  # desktop profile
//
// Why this exists: a single Lighthouse or PageSpeed run is close to worthless.
// Total Blocking Time in particular swings by an order of magnitude depending
// on what else the machine is doing, so one number can send you chasing a
// regression that was never there. This runs N times and reports the MEDIAN,
// which is the smallest honest unit of measurement.
//
// Dev-only. Nothing here ships to the browser.

import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const runs = Number(args.find((a) => a.startsWith("--runs="))?.split("=")[1] ?? 3);
const desktop = args.includes("--desktop");
const PORT = Number(process.env.PERF_PORT ?? 4319);
const URL = `http://localhost:${PORT}/`;

// Budgets are a ceiling on the MEDIAN, and they are deliberately looser than
// the numbers a quiet machine produces. The job here is to catch a real
// regression, not to fail every time something else is compiling in the
// background — a check that cries wolf is a check you learn to ignore.
// Deployed numbers on real hardware run better than these; tighten only if
// you start seeing consistent headroom.
const BUDGET = desktop
  ? { score: 78, "total-blocking-time": 450, "speed-index": 2500, "largest-contentful-paint": 2500, "cumulative-layout-shift": 0.1 }
  : { score: 65, "total-blocking-time": 900, "speed-index": 4500, "largest-contentful-paint": 4500, "cumulative-layout-shift": 0.1 };

const METRICS = [
  "first-contentful-paint",
  "largest-contentful-paint",
  "total-blocking-time",
  "speed-index",
  "cumulative-layout-shift",
];

const sh = (cmd, argv, opts = {}) =>
  new Promise((resolve, reject) => {
    const p = spawn(cmd, argv, {
      shell: true,
      stdio: process.env.PERF_DEBUG ? "inherit" : "ignore",
      ...opts,
    });
    p.on("error", reject);
    p.on("exit", (code) => resolve(code ?? 1));
  });

async function waitForServer(timeoutMs = 90_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(URL, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

const fmt = (key, v) =>
  key === "cumulative-layout-shift" ? v.toFixed(3) : `${Math.round(v)} ms`;

async function main() {
  console.log(`\n  Building…`);
  if ((await sh("pnpm", ["build"])) !== 0) {
    console.error("  Build failed. Fix that first.");
    process.exit(1);
  }

  console.log(`  Serving on :${PORT}…`);
  const server = spawn("pnpm", ["start"], {
    shell: true,
    stdio: "ignore",
    env: { ...process.env, PORT: String(PORT) },
    detached: false,
  });

  const stop = () => {
    try {
      server.kill("SIGKILL");
    } catch {
      /* already gone */
    }
  };
  process.on("exit", stop);
  process.on("SIGINT", () => {
    stop();
    process.exit(130);
  });

  if (!(await waitForServer())) {
    console.error("  Server never became ready.");
    stop();
    process.exit(1);
  }

  const profile = desktop ? "desktop" : "mobile";
  console.log(`  Running Lighthouse ${runs}x (${profile})…\n`);

  const samples = [];
  for (let i = 1; i <= runs; i++) {
    const dir = mkdtempSync(join(tmpdir(), "perf-"));
    const out = join(dir, "run.json");
    // The exit code is not trustworthy here. On Windows, Lighthouse finishes
    // the run, writes the report, and *then* throws cleaning up Chrome's temp
    // directory — exiting non-zero on a run that fully succeeded. So the
    // report file is the source of truth, not the status code.
    await sh("npx", [
      "-y",
      "lighthouse@12",
      URL,
      "--only-categories=performance",
      desktop ? "--preset=desktop" : "",
      "--output=json",
      `--output-path=${out}`,
      "--quiet",
      `--chrome-flags="--headless=new --no-sandbox --user-data-dir=${join(dir, "chrome")}"`,
    ].filter(Boolean));

    if (!existsSync(out)) {
      console.error(`  run ${i}: no report produced`);
      rmSync(dir, { recursive: true, force: true });
      continue;
    }

    let report;
    try {
      report = JSON.parse(readFileSync(out, "utf8"));
    } catch {
      console.error(`  run ${i}: report unreadable`);
      rmSync(dir, { recursive: true, force: true });
      continue;
    }
    const sample = { score: report.categories.performance.score * 100 };
    for (const m of METRICS) sample[m] = report.audits[m].numericValue;
    samples.push(sample);
    console.log(
      `  run ${i}:  score ${Math.round(sample.score)}   TBT ${Math.round(sample["total-blocking-time"])}ms   SI ${Math.round(sample["speed-index"])}ms`,
    );
    rmSync(dir, { recursive: true, force: true });
  }

  stop();

  if (samples.length === 0) {
    console.error("\n  No successful runs.");
    process.exit(1);
  }

  console.log(`\n  ── median of ${samples.length} ──`);
  const medians = { score: median(samples.map((s) => s.score)) };
  for (const m of METRICS) medians[m] = median(samples.map((s) => s[m]));

  console.log(`  score${" ".repeat(26)}${Math.round(medians.score)}`);
  for (const m of METRICS) {
    console.log(`  ${m.padEnd(30)}${fmt(m, medians[m])}`);
  }

  const spread =
    Math.max(...samples.map((s) => s["total-blocking-time"])) -
    Math.min(...samples.map((s) => s["total-blocking-time"]));
  if (spread > 400) {
    console.log(
      `\n  Note: TBT spread across runs was ${Math.round(spread)}ms. This machine is\n  noisy right now — treat the median loosely and close other apps.`,
    );
  }

  const failures = [];
  if (medians.score < BUDGET.score) {
    failures.push(`score ${Math.round(medians.score)} < ${BUDGET.score}`);
  }
  for (const [key, limit] of Object.entries(BUDGET)) {
    if (key === "score") continue;
    if (medians[key] > limit) failures.push(`${key} ${fmt(key, medians[key])} > ${fmt(key, limit)}`);
  }

  if (failures.length) {
    console.log(`\n  OVER BUDGET (${profile}):`);
    for (const f of failures) console.log(`    - ${f}`);
    process.exit(1);
  }
  console.log(`\n  Within budget (${profile}).\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
