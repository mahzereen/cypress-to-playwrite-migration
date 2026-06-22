# Migration Baseline Metrics

Empirical **before / after** numbers for the Cypress → Playwright migration.

## Quick start

```bash
# 1. Ensure Conduit is running
npm run app:up

# 2. Run 10 Cypress iterations (retries=0) + auto-summarize
npm run baseline:cypress

# 3. Playwright baseline (P0 ported)
npm run baseline:playwright
```

## Outputs

| File | Purpose |
|------|---------|
| `comparison-matrix.md` | Side-by-side Cypress vs Playwright (updated after each summarize) |
| `cypress/baseline-summary.md` | Human-readable Cypress scratch summary |
| `cypress/baseline-summary.json` | Machine-readable Cypress metrics |
| `cypress/cypress-baseline-runs.log` | One-line summary per run |
| `cypress/runs/run-NN.json` | Raw JSON reporter output per run |
| `playwright/*` | Same structure after Playwright baseline |

## Methodology

- **10 consecutive local runs** (configurable: `node scripts/baseline/run-baseline.mjs cypress 10`)
- **Retries = 0** — surfaces real flakiness, not masked by Cypress/Playwright retry
- **Flaky spec** — passes in some runs and fails in others across the 10-run window
- **LOC** — non-empty lines in `tests/`, `pages/`, `utils/`, `support/`, `fixtures/`

## Manual one-liner (equivalent)

```bash
cd cypress
for i in $(seq 1 10); do
  echo "=== run $i ==="
  npx cypress run --config retries.runMode=0 \
    --reporter json \
    --reporter-options "output=../migration/baseline/cypress/runs/run-$(printf '%02d' $i).json"
done | tee ../migration/baseline/cypress/cypress-baseline-runs.log

cd ..
node scripts/baseline/summarize-baseline.mjs cypress
```

Prefer `npm run baseline:cypress` — it handles paths, logging, and summary generation.
