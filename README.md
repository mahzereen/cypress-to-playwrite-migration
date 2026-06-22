# Cypress → Playwright Migration

A structured, evidence-driven migration from **Cypress** to **Playwright**, using [TonyMckes/conduit-realworld-example-app](https://github.com/TonyMckes/conduit-realworld-example-app) as the application under test.

This monorepo answers: *What does migration cost? How do auth patterns compare? Where does flakiness come from? When can we decommission Cypress?* — with **measured baseline data**, not estimates.

---

## Overview

| | |
|---|---|
| **App under test** | Conduit (RealWorld) — local Docker only |
| **Baseline framework** | Cypress (`/cypress`) |
| **Target framework** | Playwright (`/playwright`) |
| **Migration artifacts** | Analysis, ADRs, architecture diagrams (`/migration`) |
| **Reporting** | Allure → GitHub Pages (deploy TODO) |
| **Status** | **P0 complete** — 9 specs ported, local baseline captured |

## Architecture Summary

```
cypress-to-playwright-migration/
├── cypress/          # Baseline E2E framework (Cypress)
├── playwright/       # Target E2E framework (Playwright)
├── migration/        # Analysis, ADRs, baseline metrics
├── docs/             # Test strategy
├── infra/            # Docker Conduit + seed scripts
├── .github/workflows/# CI/CD (Cypress, Playwright, metrics, Allure)
└── .cursor/rules/    # Coding standards
```

Both frameworks run against a **locally started Conduit instance** — reproducible, seeded, health-checked. No public demo dependency.

See [migration-architecture.md](./migration/architecture/migration-architecture.md) for system context diagrams.

## Migration Story

1. **Scaffold** — monorepo, ADRs, Cursor rules, CI workflow stubs
2. **Cypress P0** — 9 specs (auth, article CRUD, favorite, follow) with POM, factories, `cy.session()`
3. **Baseline Cypress** — 10 local runs, `retries=0` → **100% pass**, **0 flaky specs**, **28.7s avg**
4. **Playwright P0 port** — 1:1 spec parity, setup project + `storageState` + auth fixture
5. **Baseline Playwright** — 10 local runs, `retries=0` → **100% pass**, **0 flaky specs**, **7.3s avg**
6. **Next** — P1 specs, CI baseline (30-day window), Cypress decommission on evidence

## Framework Comparison (measured — local 10-run baseline)

Captured **2026-06-22**, local Docker Conduit, `retries=0`, 9 P0 specs per run.

| Dimension | Cypress (baseline) | Playwright (target) | Delta |
|-----------|-------------------|---------------------|-------|
| Specs per run | 9 | 9 | 0 |
| Pass rate (10 runs) | **100%** (10/10 green) | **100%** (10/10 green) | 0 |
| Flaky specs | **none** | **none** | — |
| Avg suite duration | **28.7s** | **7.3s** | **−21.4s** |
| p50 / p95 duration | 27.1s / 34.3s | 7.1s / 8.0s | — |
| LOC (tests+POM+utils) | **553** | **642** | **+89** |
| Auth reuse | `cy.session()` + API login | `storageState` + setup project + auth fixture | See [auth comparison](./migration/analysis/auth-flow-comparison.md) |
| Fixed waits | None in P0 | `waitForTimeout`: **0** in `playwright/` | — |

**Source:** [`migration/baseline/comparison-matrix.md`](./migration/baseline/comparison-matrix.md)

| Capability | Cypress | Playwright |
|------------|---------|------------|
| Parallel execution | Default (measured slower locally) | 4 workers (measured faster locally) |
| Cross-browser | Chromium-focused | Chromium, Firefox, WebKit (not in baseline) |
| API helpers | `cy.request()` | `request` fixture |
| Debug | Time-travel runner | Trace viewer + screenshots + video |
| Reporting | `@shelex/cypress-allure-plugin` | `allure-playwright` |

Detailed analysis: [migration/analysis/](./migration/analysis/)

## CI/CD Overview

Four GitHub Actions workflows (scaffolded — **CI green TODO**):

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| [`cypress-ci.yml`](./.github/workflows/cypress-ci.yml) | Push, PR, daily cron | Run Cypress suite against local Conduit |
| [`playwright-ci.yml`](./.github/workflows/playwright-ci.yml) | Push, PR, daily cron | Run Playwright (setup → tests) |
| [`migration-metrics.yml`](./.github/workflows/migration-metrics.yml) | Push, daily cron | Aggregate cross-framework metrics |
| [`publish-allure.yml`](./.github/workflows/publish-allure.yml) | Push to `main` | Generate & deploy Allure to GitHub Pages |

Every workflow: start Conduit → seed data → health check → install deps → run tests → Allure → upload artifacts.

See [ci-cd-flow.md](./migration/architecture/ci-cd-flow.md) for pipeline diagrams.

**Local baseline commands:**

```bash
npm run app:up && npm run app:seed
npm run baseline:cypress      # 10 runs, retries=0
npm run baseline:playwright   # 10 runs, retries=0
```

## Dashboards

| Dashboard | URL | Status |
|-----------|-----|--------|
| Allure Report (GitHub Pages) | TODO: `https://<org>.github.io/<repo>/` | Pending first `publish-allure.yml` deploy |
| Comparison matrix | [migration/baseline/comparison-matrix.md](./migration/baseline/comparison-matrix.md) | ✅ Populated |
| Cypress baseline | [migration/baseline/cypress/baseline-summary.md](./migration/baseline/cypress/baseline-summary.md) | ✅ 2026-06-22 |
| Playwright baseline | [migration/baseline/playwright/baseline-summary.md](./migration/baseline/playwright/baseline-summary.md) | ✅ 2026-06-22 |
| CI badges | TODO | Pending workflow green |

## Roadmap

| Phase | Milestone | Status |
|-------|-----------|--------|
| **0 — Scaffold** | Repo structure, ADRs, CI skeleton, Cursor rules | ✅ Complete |
| **1 — Baseline** | Cypress P0 specs green + 10-run metrics | ✅ 100% pass, 28.7s avg |
| **2 — Port P0** | Playwright auth + article CRUD + social parity | ✅ 100% pass, 7.3s avg |
| **3 — Port P1** | Feed, profile, API specs | Not started |
| **4 — CI measure** | 30-day flakiness report on `ubuntu-latest` | TODO |
| **5 — Decommission** | Remove Cypress, single framework in CI | Not started |

## Key Documents

| Document | Path |
|----------|------|
| Test Strategy | [docs/test-strategy.md](./docs/test-strategy.md) |
| Migration Analysis | [migration/analysis/migration-analysis.md](./migration/analysis/migration-analysis.md) |
| Auth Flow Comparison | [migration/analysis/auth-flow-comparison.md](./migration/analysis/auth-flow-comparison.md) |
| Flakiness Report | [migration/analysis/flakiness-reliability-report.md](./migration/analysis/flakiness-reliability-report.md) |
| Cost-Benefit Analysis | [migration/analysis/cost-benefit-analysis.md](./migration/analysis/cost-benefit-analysis.md) |
| Comparison Matrix | [migration/baseline/comparison-matrix.md](./migration/baseline/comparison-matrix.md) |
| ADR-001: Why Playwright | [migration/adr/001-why-playwright.md](./migration/adr/001-why-playwright.md) |

## Quick Start

```bash
# 1. Environment
cp .env.example .env

# 2. Start Conduit
npm run app:up
npm run app:seed

# 3. Cypress
cd cypress && npm install && npm test

# 4. Playwright
cd playwright && npm install && npx playwright install chromium && npm test
```

## Why This Exists

Decisions are recorded (ADRs), trade-offs are quantified where measured (baseline JSON), and dual-run continues until CI evidence supports Cypress decommission. Coding standards live in `.cursor/rules/` — specs stay clean for review.

**Measured headline:** P0 parity at **100% pass rate** and **0 flaky specs** (10 local runs each); Playwright **7.3s** avg vs Cypress **28.7s** avg under identical P0 scope.

## License

[MIT](./LICENSE)
