# Migration Analysis

> **Status:** P0 complete — baseline measured locally (10 runs, retries=0)  
> **Target application:** [TonyMckes/conduit-realworld-example-app](https://github.com/TonyMckes/conduit-realworld-example-app) (local Docker)  
> **Last updated:** 2026-06-22  
> **Data sources:** [`migration/baseline/cypress/baseline-summary.json`](../baseline/cypress/baseline-summary.json), [`migration/baseline/playwright/baseline-summary.json`](../baseline/playwright/baseline-summary.json)

## Executive Summary

| Dimension | Cypress (baseline) | Playwright (target) | Delta |
|-----------|-------------------|---------------------|-------|
| P0 specs per run | 9 | 9 | 0 |
| P0 test executions (10 runs) | 90 | 90 | 0 |
| Avg. suite duration (local, 10-run avg) | 28.7s | 7.3s | −21.4s |
| Green run rate (10 runs) | 100% (10/10) | 100% (10/10) | 0 |
| Test pass rate (10 runs) | 100% | 100% | 0 |
| Flaky specs (10 runs) | none | none | — |
| Lines of test code (tests+POM+utils+fixtures) | 553 | 642 | +89 |
| Auth setup time (p50) | TODO: not measured | TODO: not measured | — |
| Flaky test rate (30-day CI) | TODO: pending CI window | TODO: pending CI window | — |

## Approach

1. **Establish Cypress baseline** — implement P0 page objects, factories, and specs against local Conduit; capture 10 consecutive local runs with `retries=0`.
2. **Port P0 1:1 to Playwright** — mirror spec scope, factories, and page-object surfaces; add setup project + `storageState` + auth fixture.
3. **Measure under identical conditions** — same app (`npm run app:up`), same 9 P0 scenarios, same retry policy (`0`), same baseline harness (`npm run baseline:cypress` / `npm run baseline:playwright`).
4. **Compare empirically** — pass rate, duration, LOC, and per-spec reliability feed ADRs and decommission decision.

## Scope

### In scope (P0 — implemented in both frameworks)

| Area | Scenarios | Cypress | Playwright |
|------|-----------|---------|------------|
| Auth | Register, login, logout | ✅ | ✅ |
| Articles | Create, view, edit, delete | ✅ | ✅ |
| Social | Favorite article, follow user | ✅ | ✅ |

### Out of scope (this migration phase)

| Item | Status |
|------|--------|
| Global feed / tag filters (P1) | Not started |
| API-only spec files (P1) | Not started |
| Visual regression | Out of scope |
| Public demo Conduit | Out of scope (ADR-005) |

## Migration Inventory

| Cypress spec | Playwright equivalent | Priority | Status |
|--------------|----------------------|----------|--------|
| `ui/auth/register.cy.js` | `ui/auth/register.spec.ts` | P0 | ✅ Ported |
| `ui/auth/login.cy.js` | `ui/auth/login.spec.ts` | P0 | ✅ Ported |
| `ui/auth/logout.cy.js` | `ui/auth/logout.spec.ts` | P0 | ✅ Ported |
| `ui/articles/create-article.cy.js` | `ui/articles/create-article.spec.ts` | P0 | ✅ Ported |
| `ui/articles/view-article.cy.js` | `ui/articles/view-article.spec.ts` | P0 | ✅ Ported |
| `ui/articles/edit-article.cy.js` | `ui/articles/edit-article.spec.ts` | P0 | ✅ Ported |
| `ui/articles/delete-article.cy.js` | `ui/articles/delete-article.spec.ts` | P0 | ✅ Ported |
| `ui/social/favorite-article.cy.js` | `ui/social/favorite-article.spec.ts` | P0 | ✅ Ported |
| `ui/social/follow-user.cy.js` | `ui/social/follow-user.spec.ts` | P0 | ✅ Ported |

## Measured Results (local baseline)

Captured **2026-06-22** — 10 runs each, `retries=0`, local Conduit via Docker.

| Metric | Cypress | Playwright |
|--------|---------|------------|
| Avg duration | 28,728 ms (28.7s) | 7,348 ms (7.3s) |
| p50 duration | 27,149 ms (27.1s) | 7,058 ms (7.1s) |
| p95 duration | 34,292 ms (34.3s) | 8,012 ms (8.0s) |
| Min / max duration | 25.8s / 34.3s | 6.9s / 8.0s |
| Green runs | 10 / 10 | 10 / 10 |
| Test pass rate | 100% | 100% |
| Flaky specs | none | none |
| LOC | 553 (23 files) | 642 (23 files) |

Full per-run and per-spec tables: [`migration/baseline/comparison-matrix.md`](../baseline/comparison-matrix.md)

## Framework Capability Matrix

| Capability | Cypress (implemented) | Playwright (implemented) | Migration impact |
|------------|----------------------|--------------------------|------------------|
| Session/auth caching | `cy.session()` + API login | Setup project + `storageState` + `auth.fixture` | High — see [auth-flow-comparison.md](./auth-flow-comparison.md) |
| Parallel execution | Single-browser run in baseline | 4 workers (default local) | Measured −21.4s avg suite time |
| API helpers | `cy.request()` via `apiClient.js` | `request` fixture via `apiClient.ts` | Low — ported |
| Reporting | `@shelex/cypress-allure-plugin` | `allure-playwright` | Low — both wired |
| Auto-wait | Built-in | Locator-based | Low |

## Risk Register

| ID | Risk | Likelihood | Impact | Mitigation | Status |
|----|------|------------|--------|------------|--------|
| R1 | Selector brittleness on third-party Conduit UI | Medium | High | POM + role-first where possible (ADR-003) | Monitoring |
| R2 | Auth state collision under parallel workers | Low | Medium | Unique users per test via factories | Mitigated in P0 |
| R3 | CI environment drift vs local baseline | Medium | High | Local Conduit in CI (ADR-005) | TODO: CI baseline |
| R4 | Flaky tests inflate timeline | Low (P0) | High | 10-run local baseline: 0 flaky specs | Re-measure in CI |
| R5 | Playwright edit-form race on article load | Medium | Medium | `waitForArticleLoaded` + keyboard fill | Fixed in port |

## Migration Phases

| Phase | Goal | Exit criteria | Status |
|-------|------|---------------|--------|
| 0 — Scaffold | Repo structure, CI skeleton, ADRs | Structure in place | ✅ Complete |
| 1 — Baseline | Cypress P0 green + measured | 10/10 green, flakiness report | ✅ Complete |
| 2 — Port P0 | Playwright P0 parity | 10/10 green, same 9 specs | ✅ Complete |
| 3 — Port P1 | Feed, profile, API specs | TODO: inventory TBD | Not started |
| 4 — CI measure | 30-day CI flakiness window | TODO: pending scheduled runs | Not started |
| 5 — Decommission | Remove Cypress | P0/P1 parity + CI evidence | Not started |

## Related Documents

- [Auth Flow Comparison](./auth-flow-comparison.md)
- [Flakiness & Reliability Report](./flakiness-reliability-report.md)
- [Cost-Benefit Analysis](./cost-benefit-analysis.md)
- [Comparison Matrix](../baseline/comparison-matrix.md)
- [Migration Architecture](../architecture/migration-architecture.md)
- [ADR-001: Why Playwright](../adr/001-why-playwright.md)
