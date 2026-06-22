# Framework Baseline Comparison Matrix

> Side-by-side "before / after" numbers for migration analysis.
> Regenerate: `npm run baseline:cypress` and `npm run baseline:playwright` (after Playwright P0 port).

## Suite-level comparison

| Metric | Cypress | Playwright | Delta (PW − CY) |
|--------|---------|------------|-----------------|
| Captured | 2026-06-22 | _pending_ | — |
| Runs | 10 | _pending_ | — |
| Retries | 0 | 0 | — |
| Specs per run | 9 | _pending_ | — |
| LOC (tests+POM+utils) | 553 | _pending_ | — |
| Green run rate | 100% | _pending_ | — |
| Test pass rate | 100% | _pending_ | — |
| Avg duration | 28.7s | _pending_ | — |
| p50 duration | 27.1s | _pending_ | — |
| p95 duration | 34.3s | _pending_ | — |
| Flaky specs | none | _pending_ | — |

## Per-spec pass rate

| Spec | Cypress | Playwright | Flaky (CY) | Flaky (PW) |
|------|---------|------------|------------|------------|
| create-article | 100% | _pending_ | no | — |
| delete-article | 100% | _pending_ | no | — |
| edit-article | 100% | _pending_ | no | — |
| favorite-article | 100% | _pending_ | no | — |
| follow-user | 100% | _pending_ | no | — |
| login | 100% | _pending_ | no | — |
| logout | 100% | _pending_ | no | — |
| register | 100% | _pending_ | no | — |
| view-article | 100% | _pending_ | no | — |

## How to refresh

```bash
# Prerequisites: Conduit up (npm run app:up)
npm run baseline:cypress      # 10 runs, retries=0
npm run baseline:playwright   # after Playwright P0 is implemented
```

Raw per-run JSON: `migration/baseline/<framework>/runs/`
Scratch summaries: `migration/baseline/<framework>/baseline-summary.md`
