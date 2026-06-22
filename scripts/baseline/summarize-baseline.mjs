#!/usr/bin/env node
/**
 * Aggregate per-run JSON into baseline summary + comparison matrix.
 * Usage: node scripts/baseline/summarize-baseline.mjs <cypress|playwright> [cypress|playwright]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');

const framework = process.argv[2];
if (!framework || !['cypress', 'playwright'].includes(framework)) {
  console.error('Usage: node scripts/baseline/summarize-baseline.mjs <cypress|playwright>');
  process.exit(1);
}

const baselineRoot = path.join(repoRoot, 'migration', 'baseline');
const frameworkDir = path.join(baselineRoot, framework);
const runsDir = path.join(frameworkDir, 'runs');

function percentile(sorted, p) {
  if (sorted.length === 0) return 0;
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

function mean(values) {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function countLoc(targetDirs) {
  let total = 0;
  const files = [];

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules') continue;
        walk(full);
      } else if (/\.(js|ts|mjs)$/.test(entry.name)) {
        files.push(full);
      }
    }
  }

  for (const dir of targetDirs) walk(dir);

  for (const file of files) {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    total += lines.filter((line) => line.trim().length > 0).length;
  }

  return { total, files: files.length };
}

function parseCypressStdout(text, wallMs = 0) {
  const specs = [];
  const specRe = /│\s*([✔✖])\s+(\S+\.cy\.\w+)\s+\S+\s+(\d+)\s+(\d+)\s+([\d-]+)/g;
  let match = specRe.exec(text);
  while (match !== null) {
    const symbol = match[1];
    const failingCol = match[5] === '-' ? 0 : Number.parseInt(match[5], 10);
    specs.push({
      file: match[2],
      title: path.basename(match[2]),
      state: symbol === '✔' && failingCol === 0 ? 'passed' : 'failed',
      durationMs: 0,
    });
    match = specRe.exec(text);
  }

  let passes = 0;
  let failures = 0;
  let tests = 0;

  const summaryPass = text.match(/All specs passed!\s+[\d:]+\s+(\d+)\s+(\d+)/);
  if (summaryPass) {
    tests = Number.parseInt(summaryPass[1], 10);
    passes = Number.parseInt(summaryPass[2], 10);
    failures = tests - passes;
  } else {
    const summaryFail = text.match(/(\d+)\s+of\s+(\d+)\s+failed/);
    if (summaryFail) {
      failures = Number.parseInt(summaryFail[1], 10);
      tests = Number.parseInt(summaryFail[2], 10);
      passes = tests - failures;
    } else {
      passes = specs.filter((s) => s.state === 'passed').length;
      failures = specs.filter((s) => s.state === 'failed').length;
      tests = specs.length;
    }
  }

  return { passes, failures, tests, durationMs: wallMs, specs };
}

function parseCypressRun(payload) {
  const stats = payload.stats ?? {};
  const durationMs = stats.duration ?? 0;
  const specs = [];

  function walkSuites(suites, fileHint = '') {
    for (const suite of suites ?? []) {
      const file = suite.file ?? fileHint;
      for (const test of suite.tests ?? []) {
        specs.push({
          file: file || test.title?.join?.(' > ') || 'unknown',
          title: (test.title ?? []).join(' > '),
          state: test.state,
          durationMs: test.duration ?? 0,
        });
      }
      walkSuites(suite.suites, file);
    }
  }

  if (payload.results) {
    for (const result of payload.results) {
      walkSuites([result], result.file);
    }
  } else if (payload.runs) {
    for (const run of payload.runs) {
      for (const spec of run.specs ?? []) {
        for (const test of spec.tests ?? []) {
          specs.push({
            file: spec.relative ?? spec.absolute ?? 'unknown',
            title: test.title?.join?.(' > ') ?? test.title ?? 'unknown',
            state: test.state,
            durationMs: test.displayError ? 0 : (test.attempts?.[0]?.duration ?? 0),
          });
        }
      }
    }
  }

  return {
    passes: stats.passes ?? specs.filter((t) => t.state === 'passed').length,
    failures: stats.failures ?? specs.filter((t) => t.state === 'failed').length,
    tests: stats.tests ?? specs.length,
    durationMs,
    specs,
  };
}

function parsePlaywrightRun(payload) {
  const specs = [];
  for (const suite of payload.suites ?? []) {
    function walk(s, fileHint) {
      const file = s.file ?? fileHint ?? 'unknown';
      for (const spec of s.specs ?? []) {
        const filePath = spec.file ?? file;
        for (const test of spec.tests ?? []) {
          const results = test.results ?? [];
          const last = results[results.length - 1];
          specs.push({
            file: filePath,
            title: [...(spec.titlePath ?? spec.title ?? []), test.title].filter(Boolean).join(' > '),
            state: last?.status === 'passed' ? 'passed' : last?.status === 'failed' ? 'failed' : last?.status,
            durationMs: results.reduce((sum, r) => sum + (r.duration ?? 0), 0),
          });
        }
      }
      for (const child of s.suites ?? []) walk(child, file);
    }
    walk(suite, suite.file);
  }

  const passes = specs.filter((t) => t.state === 'passed').length;
  const failures = specs.filter((t) => t.state === 'failed').length;
  const durationMs = specs.reduce((sum, t) => sum + t.durationMs, 0);

  return { passes, failures, tests: specs.length, durationMs, specs };
}

function specKey(file) {
  return path.basename(file).replace(/\.(cy\.js|spec\.ts)$/, '');
}

function loadRuns() {
  if (!fs.existsSync(runsDir)) return [];

  const logPath = path.join(frameworkDir, `${framework}-baseline-runs.log`);
  const wallMsByRun = new Map();

  if (fs.existsSync(logPath)) {
    for (const line of fs.readFileSync(logPath, 'utf8').split('\n')) {
      if (!line.startsWith('run=')) continue;
      const run = line.match(/run=(\d+)/)?.[1];
      const wallMs = Number.parseInt(line.match(/wallMs=(\d+)/)?.[1] ?? '0', 10);
      const status = line.match(/status=(\w+)/)?.[1] ?? 'UNKNOWN';
      if (run) wallMsByRun.set(run, { wallMs, status });
    }
  }

  if (framework === 'cypress') {
    return fs
      .readdirSync(runsDir)
      .filter((name) => /^run-\d+\.stdout\.log$/.test(name))
      .sort()
      .map((name) => {
        const run = name.match(/run-(\d+)/)?.[1] ?? name;
        const stdout = fs.readFileSync(path.join(runsDir, name), 'utf8');
        const meta = wallMsByRun.get(run) ?? { wallMs: 0, status: 'UNKNOWN' };
        return { run, ...parseCypressStdout(stdout, meta.wallMs), exitStatus: meta.status };
      });
  }

  return fs
    .readdirSync(runsDir)
    .filter((name) => /^run-\d+\.json$/.test(name))
    .sort()
    .map((name) => {
      const run = name.match(/run-(\d+)/)?.[1] ?? name;
      const raw = JSON.parse(fs.readFileSync(path.join(runsDir, name), 'utf8'));
      const meta = wallMsByRun.get(run) ?? { wallMs: 0, status: 'UNKNOWN' };
      const parsed = parsePlaywrightRun(raw);
      if (meta.wallMs > 0) parsed.durationMs = meta.wallMs;
      parsed.exitStatus = meta.status;
      return { run, ...parsed };
    });
}

const locDirs =
  framework === 'cypress'
    ? [
        path.join(repoRoot, 'cypress', 'tests'),
        path.join(repoRoot, 'cypress', 'pages'),
        path.join(repoRoot, 'cypress', 'utils'),
        path.join(repoRoot, 'cypress', 'support'),
        path.join(repoRoot, 'cypress', 'fixtures'),
      ]
    : [
        path.join(repoRoot, 'playwright', 'tests'),
        path.join(repoRoot, 'playwright', 'pages'),
        path.join(repoRoot, 'playwright', 'utils'),
        path.join(repoRoot, 'playwright', 'fixtures'),
        path.join(repoRoot, 'playwright', 'auth.setup.ts'),
      ];

const loc = countLoc(locDirs);
const runs = loadRuns();

if (runs.length === 0) {
  console.error(`No run JSON files found in ${runsDir}`);
  process.exit(1);
}

const durations = runs.map((r) => r.durationMs).sort((a, b) => a - b);
const greenRuns = runs.filter((r) => r.failures === 0).length;
const totalTests = runs[0]?.tests ?? 0;
const totalTestExecutions = runs.reduce((sum, r) => sum + r.tests, 0);
const totalPasses = runs.reduce((sum, r) => sum + r.passes, 0);
const passRate = totalTestExecutions > 0 ? (totalPasses / totalTestExecutions) * 100 : 0;
const suitePassRate = (greenRuns / runs.length) * 100;

const perSpec = new Map();
for (const run of runs) {
  for (const test of run.specs) {
    const key = specKey(test.file);
    if (!perSpec.has(key)) perSpec.set(key, { passes: 0, failures: 0, runs: 0 });
    const entry = perSpec.get(key);
    entry.runs += 1;
    if (test.state === 'passed') entry.passes += 1;
    else entry.failures += 1;
  }
}

const flakySpecs = [...perSpec.entries()]
  .filter(([, v]) => v.passes > 0 && v.failures > 0)
  .map(([name]) => name)
  .sort();

const summary = {
  framework,
  capturedAt: new Date().toISOString(),
  runs: runs.length,
  retries: 0,
  loc: loc.total,
  locFiles: loc.files,
  specs: totalTests,
  suitePassRate: Number(suitePassRate.toFixed(1)),
  testPassRate: Number(passRate.toFixed(1)),
  greenRuns,
  durationMs: {
    avg: Math.round(mean(durations)),
    p50: Math.round(percentile(durations, 50)),
    p95: Math.round(percentile(durations, 95)),
    min: durations[0] ?? 0,
    max: durations[durations.length - 1] ?? 0,
  },
  flakySpecs,
  perRun: runs.map((r) => ({
    run: r.run,
    status: r.failures === 0 && r.tests > 0 ? 'PASS' : r.exitStatus === 'PASS' ? 'PASS' : 'FAIL',
    durationMs: r.durationMs,
    passes: r.passes,
    failures: r.failures,
  })),
  perSpec: Object.fromEntries(
    [...perSpec.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, v]) => [
        name,
        {
          runs: v.runs,
          passes: v.passes,
          failures: v.failures,
          passRate: Number(((v.passes / v.runs) * 100).toFixed(1)),
          flaky: v.passes > 0 && v.failures > 0,
        },
      ]),
  ),
};

fs.mkdirSync(frameworkDir, { recursive: true });
fs.writeFileSync(
  path.join(frameworkDir, 'baseline-summary.json'),
  `${JSON.stringify(summary, null, 2)}\n`,
);

const scratchMd = `# ${framework} Baseline (scratch)

> Auto-generated by \`scripts/baseline/summarize-baseline.mjs\`
> Captured: ${summary.capturedAt}

## Configuration

| Parameter | Value |
|-----------|-------|
| Framework | ${framework} |
| Runs | ${summary.runs} |
| Retries | ${summary.retries} |
| Specs per run | ${summary.specs} |
| LOC (tests + POM + utils + fixtures) | ${summary.loc} (${summary.locFiles} files) |

## Suite summary

| Metric | Value |
|--------|-------|
| Green runs | ${summary.greenRuns} / ${summary.runs} (${summary.suitePassRate}%) |
| Test pass rate | ${summary.testPassRate}% |
| Avg duration | ${(summary.durationMs.avg / 1000).toFixed(1)}s |
| p50 duration | ${(summary.durationMs.p50 / 1000).toFixed(1)}s |
| p95 duration | ${(summary.durationMs.p95 / 1000).toFixed(1)}s |
| Min / max duration | ${(summary.durationMs.min / 1000).toFixed(1)}s / ${(summary.durationMs.max / 1000).toFixed(1)}s |
| Flaky specs | ${summary.flakySpecs.length ? summary.flakySpecs.join(', ') : 'none'} |

## Per-run matrix

| Run | Status | Duration (s) | Pass | Fail |
|-----|--------|--------------|------|------|
${summary.perRun
  .map(
    (r) =>
      `| ${r.run} | ${r.status} | ${(r.durationMs / 1000).toFixed(1)} | ${r.passes} | ${r.failures} |`,
  )
  .join('\n')}

## Per-spec reliability

| Spec | Runs | Pass | Fail | Pass rate | Flaky |
|------|------|------|------|-----------|-------|
${Object.entries(summary.perSpec)
  .map(
    ([name, v]) =>
      `| ${name} | ${v.runs} | ${v.passes} | ${v.failures} | ${v.passRate}% | ${v.flaky ? 'yes' : 'no'} |`,
  )
  .join('\n')}
`;

fs.writeFileSync(path.join(frameworkDir, 'baseline-summary.md'), scratchMd);

updateComparisonMatrix(summary);

console.log(`Wrote ${path.join(frameworkDir, 'baseline-summary.json')}`);
console.log(`Wrote ${path.join(frameworkDir, 'baseline-summary.md')}`);
console.log(`Updated ${path.join(baselineRoot, 'comparison-matrix.md')}`);

function updateComparisonMatrix(current) {
  const matrixPath = path.join(baselineRoot, 'comparison-matrix.md');
  const otherFramework = framework === 'cypress' ? 'playwright' : 'cypress';
  const otherSummaryPath = path.join(baselineRoot, otherFramework, 'baseline-summary.json');

  let other = null;
  if (fs.existsSync(otherSummaryPath)) {
    other = JSON.parse(fs.readFileSync(otherSummaryPath, 'utf8'));
  }

  const cypress = framework === 'cypress' ? current : other;
  const playwright = framework === 'playwright' ? current : other;

  const fmt = (s) => (s != null ? s : '_pending_');
  const fmtPct = (s) => (s != null ? `${s}%` : '_pending_');
  const fmtDur = (ms) => (ms != null ? `${(ms / 1000).toFixed(1)}s` : '_pending_');
  const fmtLoc = (s) => (s != null ? String(s) : '_pending_');
  const fmtFlaky = (arr) =>
    arr == null ? '_pending_' : arr.length === 0 ? 'none' : arr.join(', ');

  const delta = (a, b, suffix = '') => {
    if (a == null || b == null) return '—';
    const d = a - b;
    const sign = d > 0 ? '+' : '';
    return `${sign}${typeof d === 'number' && !suffix ? d.toFixed(1) : d}${suffix}`;
  };

  const content = `# Framework Baseline Comparison Matrix

> Side-by-side "before / after" numbers for migration analysis.
> Regenerate: \`npm run baseline:cypress\` and \`npm run baseline:playwright\` (after Playwright P0 port).

## Suite-level comparison

| Metric | Cypress | Playwright | Delta (PW − CY) |
|--------|---------|------------|-----------------|
| Captured | ${fmt(cypress?.capturedAt?.slice(0, 10))} | ${fmt(playwright?.capturedAt?.slice(0, 10))} | — |
| Runs | ${fmt(cypress?.runs)} | ${fmt(playwright?.runs)} | — |
| Retries | 0 | 0 | — |
| Specs per run | ${fmt(cypress?.specs)} | ${fmt(playwright?.specs)} | — |
| LOC (tests+POM+utils) | ${fmtLoc(cypress?.loc)} | ${fmtLoc(playwright?.loc)} | ${cypress?.loc != null && playwright?.loc != null ? delta(playwright.loc, cypress.loc) : '—'} |
| Green run rate | ${fmtPct(cypress?.suitePassRate)} | ${fmtPct(playwright?.suitePassRate)} | ${cypress?.suitePassRate != null && playwright?.suitePassRate != null ? delta(playwright.suitePassRate, cypress.suitePassRate, '%') : '—'} |
| Test pass rate | ${fmtPct(cypress?.testPassRate)} | ${fmtPct(playwright?.testPassRate)} | ${cypress?.testPassRate != null && playwright?.testPassRate != null ? delta(playwright.testPassRate, cypress.testPassRate, '%') : '—'} |
| Avg duration | ${fmtDur(cypress?.durationMs?.avg)} | ${fmtDur(playwright?.durationMs?.avg)} | ${cypress?.durationMs?.avg != null && playwright?.durationMs?.avg != null ? delta((playwright.durationMs.avg - cypress.durationMs.avg) / 1000, 0, 's') : '—'} |
| p50 duration | ${fmtDur(cypress?.durationMs?.p50)} | ${fmtDur(playwright?.durationMs?.p50)} | — |
| p95 duration | ${fmtDur(cypress?.durationMs?.p95)} | ${fmtDur(playwright?.durationMs?.p95)} | — |
| Flaky specs | ${fmtFlaky(cypress?.flakySpecs)} | ${fmtFlaky(playwright?.flakySpecs)} | — |

## Per-spec pass rate

| Spec | Cypress | Playwright | Flaky (CY) | Flaky (PW) |
|------|---------|------------|------------|------------|
${buildSpecRows(cypress, playwright)}

## How to refresh

\`\`\`bash
# Prerequisites: Conduit up (npm run app:up)
npm run baseline:cypress      # 10 runs, retries=0
npm run baseline:playwright   # after Playwright P0 is implemented
\`\`\`

Raw per-run JSON: \`migration/baseline/<framework>/runs/\`
Scratch summaries: \`migration/baseline/<framework>/baseline-summary.md\`
`;

  fs.mkdirSync(baselineRoot, { recursive: true });
  fs.writeFileSync(matrixPath, content);
}

function buildSpecRows(cypress, playwright) {
  const names = new Set([
    ...Object.keys(cypress?.perSpec ?? {}),
    ...Object.keys(playwright?.perSpec ?? {}),
  ]);

  if (names.size === 0) {
    return '| _no data yet_ | — | — | — | — |';
  }

  return [...names]
    .sort()
    .map((name) => {
      const cy = cypress?.perSpec?.[name];
      const pw = playwright?.perSpec?.[name];
      return `| ${name} | ${cy ? `${cy.passRate}%` : '_pending_'} | ${pw ? `${pw.passRate}%` : '_pending_'} | ${cy?.flaky ? 'yes' : cy ? 'no' : '—'} | ${pw?.flaky ? 'yes' : pw ? 'no' : '—'} |`;
    })
    .join('\n');
}
