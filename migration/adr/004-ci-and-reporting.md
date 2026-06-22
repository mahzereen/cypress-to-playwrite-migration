# ADR-004: CI and Reporting

**Status:** Accepted  
**Date:** 2026-06-17  
**Updated:** 2026-06-22 (local baseline measured; CI TODO)  
**Deciders:** QE Architecture  

## Context

During Cypress → Playwright migration, stakeholders need comparable pass rates and duration trends. Local 10-run baseline shows **100% pass** for both frameworks; **CI baseline TODO**.

Allure is wired locally:

| Framework | Results path | Reporter |
|-----------|--------------|----------|
| Cypress | `cypress/reports/allure-results/` | `@shelex/cypress-allure-plugin` |
| Playwright | `playwright/reports/allure-results/` | `allure-playwright` |

## Decision

Standardize on this CI and reporting stack:

| Layer | Tool | Status |
|-------|------|--------|
| CI orchestration | GitHub Actions | Workflows scaffolded: `cypress-ci.yml`, `playwright-ci.yml`, `migration-metrics.yml`, `publish-allure.yml` |
| App under test | Conduit (Docker, local) | `npm run app:up` — used for local baseline |
| Test reporting | Allure | Both frameworks produce `allure-results/` |
| Report hosting | GitHub Pages | `publish-allure.yml` on push to `main` — **TODO: first deploy URL** |
| Failure artifacts | Screenshots, traces, video | Playwright: `screenshot`/`video`/`trace` on failure |
| Metrics aggregation | `migration-metrics.yml` | **TODO: populate from CI runs** |

**Local baseline harness** (measured data source):

```bash
npm run baseline:cypress      # 10 runs, retries=0
npm run baseline:playwright   # 10 runs, retries=0
```

Outputs: `migration/baseline/{framework}/baseline-summary.json`

**Principles:**

1. Every CI workflow starts Conduit locally, seeds data, health-checks before tests
2. Allure results uploaded as artifacts on every run — even on failure
3. Credentials via `.env` (local) / GitHub Secrets (CI) — never committed
4. Auth state (`.auth/user.json`) generated at runtime — gitignored
5. `retries=0` for flakiness measurement windows

## Consequences

### Positive

- Single Allure format enables side-by-side dashboards once Pages deploys
- Local baseline harness produced auditable JSON for migration docs
- Measured: both frameworks **10/10 green** locally with `retries=0`

### Negative

- GitHub Pages URL not yet available — **TODO: `https://<org>.github.io/<repo>/`**
- CI workflows not yet validated end-to-end on `ubuntu-latest`
- Dual Allure reporter maintenance during transition

### Neutral

- Native Playwright HTML report and Cypress Dashboard not used — Allure is canonical
- See [ci-cd-flow.md](../architecture/ci-cd-flow.md)

## References

- [CI/CD Flow](../architecture/ci-cd-flow.md)
- [Flakiness Report](../analysis/flakiness-reliability-report.md)
- [ADR-005: Environment](./005-environment-local-vs-hosted-conduit.md)
- [Comparison Matrix](../baseline/comparison-matrix.md)
