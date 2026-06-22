# Flakiness & Reliability Report

> **Status:** Local 10-run baseline complete for both frameworks. 30-day CI window: TODO.  
> **Measurement window (local):** 2026-06-22  
> **Environment:** Local Conduit (Docker), macOS host, `retries=0`

## Methodology

| Parameter | Value |
|-----------|-------|
| Runs analyzed (local) | 10 per framework |
| Runs analyzed (CI) | TODO: ≥ 30 scheduled runs |
| Trigger (local) | `npm run baseline:cypress` / `npm run baseline:playwright` |
| Conduit | Local Docker (`npm run app:up`) |
| Cypress version | ^14.5.4 (`cypress/package.json`) |
| Playwright version | ^1.55.0 (`playwright/package.json`) |
| Workers (local) | Cypress: default; Playwright: 4 (Playwright default) |
| Retry policy | 0 |
| Flaky definition | Any spec with both passes and failures across runs (`flaky: true` in baseline summary) |
| Data files | `migration/baseline/{cypress,playwright}/baseline-summary.json` |

## Summary — 10-Run Local Baseline

| Metric | Cypress | Playwright | Delta (PW − CY) |
|--------|---------|------------|-----------------|
| Runs | 10 | 10 | — |
| Specs per run | 9 | 9 | 0 |
| Total test executions | 90 | 90 | 0 |
| Green runs | 10 / 10 | 10 / 10 | 0 |
| Suite pass rate | 100% | 100% | 0% |
| Test pass rate | 100% | 100% | 0% |
| Flaky spec count | 0 | 0 | 0 |
| Flaky spec names | none | none | — |
| Avg suite duration | 28.7s | 7.3s | −21.4s |
| p50 suite duration | 27.1s | 7.1s | −20.0s |
| p95 suite duration | 34.3s | 8.0s | −26.3s |
| Min suite duration | 25.8s | 6.9s | −18.9s |
| Max suite duration | 34.3s | 8.0s | −26.3s |

## Per-Run Comparison

| Run | Cypress status | Cypress duration (s) | Cypress pass/fail | Playwright status | Playwright duration (s) | Playwright pass/fail |
|-----|----------------|----------------------|-------------------|-------------------|-------------------------|----------------------|
| 01 | PASS | 32.5 | 9/0 | PASS | 7.6 | 9/0 |
| 02 | PASS | 26.4 | 9/0 | PASS | 7.5 | 9/0 |
| 03 | PASS | 27.1 | 9/0 | PASS | 7.0 | 9/0 |
| 04 | PASS | 25.8 | 9/0 | PASS | 7.0 | 9/0 |
| 05 | PASS | 29.7 | 9/0 | PASS | 6.9 | 9/0 |
| 06 | PASS | 29.2 | 9/0 | PASS | 7.8 | 9/0 |
| 07 | PASS | 26.4 | 9/0 | PASS | 7.1 | 9/0 |
| 08 | PASS | 28.9 | 9/0 | PASS | 7.0 | 9/0 |
| 09 | PASS | 34.3 | 9/0 | PASS | 7.6 | 9/0 |
| 10 | PASS | 27.0 | 9/0 | PASS | 8.0 | 9/0 |

**Source:** `perRun` arrays in both `baseline-summary.json` files.

## Per-Spec Reliability (10 runs each)

| Spec | Cypress pass rate | Cypress flaky | Playwright pass rate | Playwright flaky |
|------|-------------------|---------------|----------------------|------------------|
| `register` | 100% (10/10) | no | 100% (10/10) | no |
| `login` | 100% (10/10) | no | 100% (10/10) | no |
| `logout` | 100% (10/10) | no | 100% (10/10) | no |
| `create-article` | 100% (10/10) | no | 100% (10/10) | no |
| `view-article` | 100% (10/10) | no | 100% (10/10) | no |
| `edit-article` | 100% (10/10) | no | 100% (10/10) | no |
| `delete-article` | 100% (10/10) | no | 100% (10/10) | no |
| `favorite-article` | 100% (10/10) | no | 100% (10/10) | no |
| `follow-user` | 100% (10/10) | no | 100% (10/10) | no |

## Failure Category Breakdown

| Category | Cypress count | Playwright count | Notes |
|----------|---------------|------------------|-------|
| Auth / session expiry | 0 | 0 | 10-run local baseline |
| Selector / timing | 0 | 0 | 10-run local baseline |
| Network / API | 0 | 0 | 10-run local baseline |
| Test data collision | 0 | 0 | Unique factories per run |
| Environment / infra | 0 | 0 | 10-run local baseline |
| Unknown | 0 | 0 | — |
| **CI failures (30-day)** | **TODO** | **TODO** | Pending scheduled CI runs |

## Auth-Related Failures

| Framework | Auth failure count (10-run local) | % of total failures | Root cause |
|-----------|-----------------------------------|---------------------|------------|
| Cypress | 0 | 0% | — |
| Playwright | 0 | 0% | — |

## Observations

1. **Perfect pass rate locally** — 10/10 green runs for both frameworks; zero flaky specs across 90 test executions each.
2. **Playwright suite duration lower in this environment** — avg 7.3s vs 28.7s Cypress (−21.4s). Conditions: local Docker, Playwright 4 workers, Cypress default parallelism.
3. **Edit-article required reliability hardening during port** — editor form hydration race fixed with `waitForArticleLoaded` + keyboard replace; subsequently 10/10 green in baseline.
4. **CI replication TODO** — local numbers do not include GitHub Actions startup overhead or `ubuntu-latest` variance.

## Recommendations

| Finding | Action | Priority |
|---------|--------|----------|
| Local P0 stable at 100% | Proceed to P1 porting | High |
| No CI flakiness data yet | Enable scheduled `cypress-ci.yml` / `playwright-ci.yml` runs; re-run 30-day window | High |
| Auth timing unknown | Add instrumentation for cold/warm auth in CI | Medium |
| Edit form race | Keep `waitForArticleLoaded` in Playwright `EditorPage` | Medium |

## Data Sources

- [`migration/baseline/cypress/baseline-summary.json`](../baseline/cypress/baseline-summary.json) — captured 2026-06-22T02:50:26Z
- [`migration/baseline/playwright/baseline-summary.json`](../baseline/playwright/baseline-summary.json) — captured 2026-06-22T12:41:22Z
- [`migration/baseline/comparison-matrix.md`](../baseline/comparison-matrix.md)
- GitHub Actions run history: TODO — link after first CI baseline
- Allure historical trends: TODO — GitHub Pages URL after first deploy
