# Framework Baseline Comparison Matrix

> Side-by-side "before / after" numbers for migration analysis.
> Regenerate: `npm run baseline:cypress` and `npm run baseline:playwright` (after Playwright P0 port).

## Suite-level comparison

| Metric | Cypress | Playwright | Delta (PW − CY) |
|--------|---------|------------|-----------------|
| Captured | 2026-06-22 | 2026-06-22 | — |
| Runs | 10 | 10 | — |
| Retries | 0 | 0 | — |
| Specs per run | 9 | 9 | — |
| LOC (tests+POM+utils) | 553 | 642 | +89.0 |
| Green run rate | 100% | 100% | 0% |
| Test pass rate | 100% | 100% | 0% |
| Avg duration | 28.7s | 7.3s | -21.38s |
| p50 duration | 27.1s | 7.1s | — |
| p95 duration | 34.3s | 8.0s | — |
| Flaky specs | none | none | — |

## Per-spec pass rate

| Spec | Cypress | Playwright | Flaky (CY) | Flaky (PW) |
|------|---------|------------|------------|------------|
| create-article | 100% | 100% | no | no |
| delete-article | 100% | 100% | no | no |
| edit-article | 100% | 100% | no | no |
| favorite-article | 100% | 100% | no | no |
| follow-user | 100% | 100% | no | no |
| login | 100% | 100% | no | no |
| logout | 100% | 100% | no | no |
| register | 100% | 100% | no | no |
| view-article | 100% | 100% | no | no |

## How to refresh

```bash
# Prerequisites: Conduit up (npm run app:up)
npm run baseline:cypress      # 10 runs, retries=0
npm run baseline:playwright   # after Playwright P0 is implemented
```

Raw per-run JSON: `migration/baseline/<framework>/runs/`
Scratch summaries: `migration/baseline/<framework>/baseline-summary.md`
