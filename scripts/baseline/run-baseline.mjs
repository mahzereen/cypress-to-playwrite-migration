#!/usr/bin/env node
/**
 * Run N headless test iterations and write per-run JSON results.
 * Usage: node scripts/baseline/run-baseline.mjs <cypress|playwright> [runs=10]
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');

const framework = process.argv[2];
const runCount = Number.parseInt(process.argv[3] ?? '10', 10);

if (!['cypress', 'playwright'].includes(framework)) {
  console.error('Usage: node scripts/baseline/run-baseline.mjs <cypress|playwright> [runs=10]');
  process.exit(1);
}

const baselineDir = path.join(repoRoot, 'migration', 'baseline', framework);
const runsDir = path.join(baselineDir, 'runs');
const logPath = path.join(baselineDir, `${framework}-baseline-runs.log`);

fs.mkdirSync(runsDir, { recursive: true });

const config = {
  cypress: {
    cwd: path.join(repoRoot, 'cypress'),
    buildCommand: (runLabel, runsDirPath) => [
      'npx',
      [
        'cypress',
        'run',
        '--config',
        'retries=0',
        '--reporter',
        'spec',
      ],
    ],
  },
  playwright: {
    cwd: path.join(repoRoot, 'playwright'),
    buildCommand: (runLabel, runsDirPath) => {
      const jsonPath = path.join(runsDirPath, `run-${runLabel}.json`);
      return [
        'npx',
        [
          'playwright',
          'test',
          '--retries=0',
          '--reporter=json',
        ],
        { PLAYWRIGHT_JSON_OUTPUT_NAME: jsonPath },
      ];
    },
  },
};

function padRun(n) {
  return String(n).padStart(2, '0');
}

function appendLog(line) {
  fs.appendFileSync(logPath, `${line}\n`);
}

function getVersion(cwd, tool) {
  const result = spawnSync('npx', [tool, '--version'], {
    cwd,
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });
  return (result.stdout || result.stderr || '').trim() || 'unknown';
}

const { cwd, buildCommand } = config[framework];
const version = getVersion(cwd, framework === 'cypress' ? 'cypress' : 'playwright');

fs.writeFileSync(
  logPath,
  [
    `# ${framework} baseline — ${new Date().toISOString()}`,
    `# runs=${runCount} retries=0 version=${version}`,
    '',
  ].join('\n'),
);

console.log(`Running ${framework} baseline: ${runCount} iterations (retries=0)`);
console.log(`Results → ${runsDir}`);
console.log(`Log     → ${logPath}`);

const runSummaries = [];

for (let i = 1; i <= runCount; i += 1) {
  const runLabel = padRun(i);
  const jsonPath = path.join(runsDir, `run-${runLabel}.json`);
  const stdoutPath = path.join(runsDir, `run-${runLabel}.stdout.log`);

  if (fs.existsSync(jsonPath)) fs.unlinkSync(jsonPath);

  const started = Date.now();
  console.log(`\n=== run ${i}/${runCount} ===`);

  const [cmd, args, extraEnv = {}] = buildCommand(runLabel, runsDir);
  const result = spawnSync(cmd, args, {
    cwd,
    encoding: 'utf8',
    shell: process.platform === 'win32',
    env: { ...process.env, FORCE_COLOR: '0', ...extraEnv },
  });

  const durationMs = Date.now() - started;
  const stdout = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  fs.writeFileSync(stdoutPath, stdout);

  const exitCode = result.status ?? 1;
  const status = exitCode === 0 ? 'PASS' : 'FAIL';

  let passes = null;
  let failures = null;
  let tests = null;
  let reporterDurationMs = null;

  if (fs.existsSync(jsonPath)) {
    try {
      const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      if (!payload.stdoutTail && !payload.infrastructureError) {
        const stats = payload.stats ?? payload;
        passes = stats.passes ?? null;
        failures = stats.failures ?? null;
        tests = stats.tests ?? null;
        reporterDurationMs = stats.duration ?? null;
      }
    } catch {
      // fall through — summarize parses stdout.log
    }
  }

  const line = [
    `run=${runLabel}`,
    `status=${status}`,
    `exit=${exitCode}`,
    `wallMs=${durationMs}`,
    reporterDurationMs != null ? `reporterMs=${reporterDurationMs}` : null,
    tests != null ? `tests=${tests}` : null,
    passes != null ? `passes=${passes}` : null,
    failures != null ? `failures=${failures}` : null,
  ]
    .filter(Boolean)
    .join(' ');

  appendLog(line);
  console.log(line);
  runSummaries.push({ run: runLabel, status, exitCode, durationMs, passes, failures, tests });
}

const passedRuns = runSummaries.filter((r) => r.status === 'PASS').length;
console.log(`\nCompleted ${runCount} runs — ${passedRuns}/${runCount} green`);

const summarizeScript = path.join(__dirname, 'summarize-baseline.mjs');
const summarize = spawnSync('node', [summarizeScript, framework], {
  cwd: repoRoot,
  encoding: 'utf8',
  stdio: 'inherit',
});

process.exit(summarize.status ?? 0);
