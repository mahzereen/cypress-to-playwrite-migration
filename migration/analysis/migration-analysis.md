# Migration Analysis

> **Status:** Scaffold — populate with empirical data after baseline test runs.
> **Target application:** RealWorld App ([Conduit](https://github.com/gothinkster/realworld))
> **Last updated:** _TBD_

## Executive Summary

| Dimension | Cypress (baseline) | Playwright (target) | Delta |
|-----------|-------------------|---------------------|-------|
| Total specs | _TBD_ | _TBD_ | — |
| Total test cases | _TBD_ | _TBD_ | — |
| Avg. suite duration (CI) | _TBD_ | _TBD_ | — |
| Flaky test rate (30-day) | _TBD_ | _TBD_ | — |
| Auth setup time (p50) | _TBD_ | _TBD_ | — |
| Lines of test code | _TBD_ | _TBD_ | — |

## Scope

| In scope | Out of scope |
|----------|--------------|
| UI E2E flows (login, articles, feed, profile) | Visual regression (phase 2) |
| API-level auth & CRUD validation | Performance/load testing |
| Auth reuse patterns (`cy.session()` vs `storageState`) | Mobile native apps |
| CI parity & Allure reporting | Third-party Conduit forks |

## Migration Inventory

| Cypress spec | Playwright equivalent | Priority | Complexity | Status |
|--------------|----------------------|----------|------------|--------|
| `ui/auth/login.cy.js` | `ui/auth/login.spec.ts` | P0 | Low | Not started |
| `ui/articles/create-article.cy.js` | `ui/articles/create-article.spec.ts` | P0 | Medium | Not started |
| `ui/feed/global-feed.cy.js` | `ui/feed/global-feed.spec.ts` | P1 | Low | Not started |
| `api/auth/login.api.cy.js` | `api/auth/login.api.spec.ts` | P0 | Low | Not started |
| `api/articles/articles.api.cy.js` | `api/articles/articles.api.spec.ts` | P1 | Medium | Not started |

## Framework Capability Matrix

| Capability | Cypress | Playwright | Migration impact |
|------------|---------|------------|------------------|
| Session/auth caching | `cy.session()` | `storageState` + setup project | High — see [auth-flow-comparison.md](./auth-flow-comparison.md) |
| Parallel execution | Limited (same-origin) | Native multi-worker | Medium |
| API testing | `cy.request()` | `request` fixture | Low |
| Cross-browser | Chromium-focused | Chromium, Firefox, WebKit | Medium |
| Auto-wait | Built-in | Built-in (locator-based) | Low |
| Trace/debug | Time-travel | Trace viewer + screenshots | Medium |
| Allure integration | Plugin | `allure-playwright` | Low |

## Risk Register

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|------------|--------|------------|
| R1 | Selector brittleness on third-party Conduit UI | High | High | `getByRole` strategy — see ADR-003 |
| R2 | Auth token expiry mid-suite | Medium | Medium | API re-login in setup project |
| R3 | CI environment drift (local vs hosted Conduit) | Medium | High | Self-hosted Conduit in CI — see ADR-005 |
| R4 | Flaky tests inflate migration timeline | Medium | High | Baseline flakiness report before porting |
| R5 | Team ramp-up on Playwright patterns | Low | Medium | POM + fixture conventions in `.cursor/rules/` |

## Migration Phases

| Phase | Goal | Exit criteria |
|-------|------|---------------|
| 0 — Scaffold | Repo structure, CI skeleton, ADRs | This document populated |
| 1 — Baseline | Cypress suite green against local Conduit | Flakiness report with real numbers |
| 2 — Port P0 | Auth + article CRUD in Playwright | Parity on P0 specs, CI green |
| 3 — Port P1 | Feed, profile, API specs | Full inventory migrated |
| 4 — Decommission | Remove Cypress, update docs | Single framework in CI |

## Related Documents

- [Auth Flow Comparison](./auth-flow-comparison.md)
- [Flakiness & Reliability Report](./flakiness-reliability-report.md)
- [Cost-Benefit Analysis](./cost-benefit-analysis.md)
- [Migration Architecture](../architecture/migration-architecture.md)
- [ADR-001: Why Playwright](../adr/001-why-playwright.md)
