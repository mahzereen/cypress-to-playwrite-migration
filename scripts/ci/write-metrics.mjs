#!/usr/bin/env node
/**
 * Aggregate Cypress + Playwright CI run results into migration/metrics/metrics.json.
 * Reads Allure *-result.json files and wall-clock durations from environment variables.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');

function summarizeAllure(resultsDir) {
  if (!fs.existsSync(resultsDir)) {
    return { total: 0, passed: 0, failed: 0, broken: 0, skipped: 0 };
  }

  const files = fs.readdirSync(resultsDir).filter((name) => name.endsWith('-result.json'));
  const summary = { total: 0, passed: 0, failed: 0, broken: 0, skipped: 0 };

  for (const file of files) {
    const payload = JSON.parse(fs.readFileSync(path.join(resultsDir, file), 'utf8'));
    summary.total += 1;
    const status = payload.status ?? 'unknown';
    if (status === 'passed') summary.passed += 1;
    else if (status === 'failed') summary.failed += 1;
    else if (status === 'broken') summary.broken += 1;
    else if (status === 'skipped') summary.skipped += 1;
  }

  return summary;
}

function frameworkBlock(exitCodeEnv, durationEnv, resultsDir) {
  const allure = summarizeAllure(resultsDir);
  const exitCode = Number.parseInt(process.env[exitCodeEnv] ?? '1', 10);
  const durationMs = Number.parseInt(process.env[durationEnv] ?? '0', 10);

  return {
    duration_ms: durationMs,
    exit_code: exitCode,
    total: allure.total,
    passed: allure.passed,
    failed: allure.failed,
    broken: allure.broken,
    skipped: allure.skipped,
    flaky: null,
    green: exitCode === 0 && allure.failed === 0 && allure.broken === 0,
  };
}

const metrics = {
  timestamp: new Date().toISOString(),
  source: 'github-actions',
  cypress: frameworkBlock(
    'CYPRESS_EXIT_CODE',
    'CYPRESS_DURATION_MS',
    path.join(repoRoot, 'cypress/reports/allure-results'),
  ),
  playwright: frameworkBlock(
    'PLAYWRIGHT_EXIT_CODE',
    'PLAYWRIGHT_DURATION_MS',
    path.join(repoRoot, 'playwright/reports/allure-results'),
  ),
};

const outDir = path.join(repoRoot, 'migration/metrics');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'metrics.json'), `${JSON.stringify(metrics, null, 2)}\n`);

console.log(JSON.stringify(metrics, null, 2));
