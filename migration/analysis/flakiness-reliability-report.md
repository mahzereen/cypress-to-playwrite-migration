# Flakiness & Reliability Report

> **Status:** Scaffold — populate with real numbers from 30+ consecutive CI runs.
> **Measurement window:** _TBD — YYYY-MM-DD to YYYY-MM-DD_
> **Environment:** Local Conduit (Docker), GitHub Actions `ubuntu-latest`

## Methodology

| Parameter | Value |
|-----------|-------|
| Runs analyzed | _TBD_ (target: ≥ 30) |
| Trigger | Scheduled + on-push to `main` |
| Conduit version | _TBD_ (pinned SHA) |
| Cypress version | _TBD_ |
| Playwright version | _TBD_ |
| Workers (CI) | 1 (Cypress), 4 (Playwright) |
| Retry policy | 0 (measure raw flakiness) |
| Flaky definition | Pass on retry OR inconsistent pass/fail across runs |

## Summary

| Metric | Cypress | Playwright | Delta |
|--------|---------|------------|-------|
| Total test executions | _TBD_ | _TBD_ | — |
| Raw pass rate | _TBD %_ | _TBD %_ | — |
| Flaky test count | _TBD_ | _TBD_ | — |
| Flaky test rate | _TBD %_ | _TBD %_ | — |
| Suite failure rate (any failure) | _TBD %_ | _TBD %_ | — |
| p50 suite duration | _TBD s_ | _TBD s_ | — |
| p95 suite duration | _TBD s_ | _TBD s_ | — |

## Per-Spec Reliability

| Spec | Framework | Runs | Passes | Failures | Flaky | Pass rate |
|------|-----------|------|--------|----------|-------|-----------|
| `login` | Cypress | _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD %_ |
| `login` | Playwright | _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD %_ |
| `create-article` | Cypress | _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD %_ |
| `create-article` | Playwright | _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD %_ |
| `global-feed` | Cypress | _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD %_ |
| `global-feed` | Playwright | _TBD_ | _TBD_ | _TBD_ | _TBD_ | _TBD %_ |

## Failure Category Breakdown

| Category | Cypress count | Playwright count | Example |
|----------|---------------|------------------|---------|
| Auth / session expiry | _TBD_ | _TBD_ | Token not injected before navigation |
| Selector / timing | _TBD_ | _TBD_ | Element detached from DOM |
| Network / API | _TBD_ | _TBD_ | 502 from Conduit during seed |
| Test data collision | _TBD_ | _TBD_ | Duplicate slug under parallel workers |
| Environment / infra | _TBD_ | _TBD_ | Conduit container not ready |
| Unknown | _TBD_ | _TBD_ | — |

## Auth-Related Failures

| Framework | Auth failure count | % of total failures | Root cause (top) |
|-----------|-------------------|---------------------|------------------|
| Cypress | _TBD_ | _TBD %_ | _TBD_ |
| Playwright | _TBD_ | _TBD %_ | _TBD_ |

## Observations (placeholder)

<!-- Populate after baseline runs -->

1. _TBD_
2. _TBD_
3. _TBD_

## Recommendations

| Finding | Action | Owner | Priority |
|---------|--------|-------|----------|
| _TBD_ | _TBD_ | _TBD_ | _TBD_ |

## Data Sources

- GitHub Actions workflow run history (`.github/workflows/cypress-ci.yml`, `playwright-ci.yml`)
- Allure historical trends (GitHub Pages — link TBD)
- `migration-metrics.yml` aggregated JSON artifact
