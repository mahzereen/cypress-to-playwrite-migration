# Cypress → Playwright Migration

A Principal-level quality engineering initiative demonstrating a structured, evidence-driven migration from **Cypress** to **Playwright**, using the [RealWorld App (Conduit)](https://github.com/gothinkster/realworld) as the application under test.

This monorepo is not a toy comparison — it is an engineering artifact designed to answer the questions Staff and Principal QEs are actually asked: *What does migration cost? How do auth patterns compare under parallel CI? Where does flakiness come from? When can we decommission the old framework?*

---

## Overview

| | |
|---|---|
| **App under test** | RealWorld (Conduit) — self-hosted, never public demo |
| **Baseline framework** | Cypress (`/cypress`) |
| **Target framework** | Playwright (`/playwright`) |
| **Migration artifacts** | Analysis, ADRs, architecture diagrams (`/migration`) |
| **Reporting** | Allure → GitHub Pages |
| **Status** | Scaffold — structure and placeholders in place |

## Architecture Summary

```
cypress-to-playwright-migration/
├── cypress/          # Baseline E2E framework (Cypress)
├── playwright/       # Target E2E framework (Playwright)
├── migration/        # Analysis, ADRs, architecture diagrams
├── docs/             # Test strategy
├── .github/workflows/# CI/CD (Cypress, Playwright, metrics, Allure)
└── .cursor/rules/    # Coding standards (not inline in tests)
```

Both frameworks run against a **locally started Conduit instance** in CI — reproducible, seeded, health-checked. No external demo dependency.

See [migration-architecture.md](./migration/architecture/migration-architecture.md) for system context diagrams.

## Migration Goals

1. **Empirical comparison** — run both frameworks in CI and measure flakiness, duration, and auth overhead with real numbers
2. **Auth at scale** — validate `cy.session()` vs Playwright `storageState` + setup project under parallel workers
3. **Maintainable test design** — POM, role-first selectors, API + UI layer split
4. **Single observability surface** — Allure dashboards for both frameworks during dual-run
5. **Clean decommission** — remove Cypress only when P0/P1 parity is proven and flakiness data supports the cutover

## Framework Comparison

| Dimension | Cypress (baseline) | Playwright (target) |
|-----------|-------------------|---------------------|
| Auth reuse | `cy.session()` + API login | Setup project + `storageState` + auth fixture |
| Parallel CI | Limited (same-origin constraints) | Native multi-worker |
| Cross-browser | Chromium-focused | Chromium, Firefox, WebKit |
| API testing | `cy.request()` | `request` fixture |
| Debug | Time-travel runner | Trace viewer + screenshots + video |
| Reporting | Allure plugin | `allure-playwright` |
| Selector API | CSS-centric | Role-first locators (`getByRole`) |

Detailed analysis: [migration/analysis/](./migration/analysis/)

## CI/CD Overview

Four GitHub Actions workflows:

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| [`cypress-ci.yml`](./.github/workflows/cypress-ci.yml) | Push, PR, daily cron | Run Cypress suite against local Conduit |
| [`playwright-ci.yml`](./.github/workflows/playwright-ci.yml) | Push, PR, daily cron | Run Playwright suite (setup project → tests) |
| [`migration-metrics.yml`](./.github/workflows/migration-metrics.yml) | Push, daily cron | Aggregate cross-framework metrics |
| [`publish-allure.yml`](./.github/workflows/publish-allure.yml) | After test workflows | Generate & deploy Allure to GitHub Pages |

Every workflow: start Conduit → seed data → health check → install deps → run tests → Allure → upload artifacts.

See [ci-cd-flow.md](./migration/architecture/ci-cd-flow.md) for pipeline diagrams.

## Dashboards

| Dashboard | URL | Status |
|-----------|-----|--------|
| Allure Report (GitHub Pages) | _TBD — enable Pages after first CI run_ | Pending |
| Cypress CI | _TBD — GitHub Actions badge_ | Pending |
| Playwright CI | _TBD — GitHub Actions badge_ | Pending |
| Migration Metrics | _TBD_ | Pending |

## Roadmap

| Phase | Milestone | Status |
|-------|-----------|--------|
| **0 — Scaffold** | Repo structure, ADRs, CI skeleton, Cursor rules | ✅ Current |
| **1 — Baseline** | Cypress P0 specs green against local Conduit | Not started |
| **2 — Port P0** | Playwright auth + article CRUD with CI parity | Not started |
| **3 — Port P1** | Feed, profile, API specs migrated | Not started |
| **4 — Measure** | 30-day flakiness report with real numbers | Not started |
| **5 — Decommission** | Remove Cypress, single framework in CI | Not started |

## Key Documents

| Document | Path |
|----------|------|
| Test Strategy | [docs/test-strategy.md](./docs/test-strategy.md) |
| Migration Analysis | [migration/analysis/migration-analysis.md](./migration/analysis/migration-analysis.md) |
| Auth Flow Comparison | [migration/analysis/auth-flow-comparison.md](./migration/analysis/auth-flow-comparison.md) |
| Flakiness Report | [migration/analysis/flakiness-reliability-report.md](./migration/analysis/flakiness-reliability-report.md) |
| Cost-Benefit Analysis | [migration/analysis/cost-benefit-analysis.md](./migration/analysis/cost-benefit-analysis.md) |
| ADR-001: Why Playwright | [migration/adr/001-why-playwright.md](./migration/adr/001-why-playwright.md) |

## Why This Exists

Most framework migration write-ups stop at "Playwright is faster" or "Cypress has better DX." That is Senior-level thinking — useful, but insufficient when you are advising engineering leadership on a quarter-long initiative.

This repo is structured for **Principal-level judgment**:

- **Decisions are recorded** (ADRs), not buried in Slack threads
- **Trade-offs are quantified** (flakiness report, cost-benefit analysis) — placeholders now, real data after baseline runs
- **Auth reuse is treated as infrastructure**, not a per-spec afterthought — because it is the highest-leverage optimization in any authenticated E2E suite
- **Dual-run is intentional** — we do not rip out Cypress on faith; we decommission on evidence
- **Coding standards live in Cursor rules**, keeping specs and page objects clean for review

The scaffold phase is complete. The next step is implementation: Conduit Docker setup, P0 Cypress specs, measured baseline, then Playwright port.

## License

[MIT](./LICENSE)
