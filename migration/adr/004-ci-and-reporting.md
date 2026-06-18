# ADR-004: CI and Reporting

**Status:** Accepted  
**Date:** 2026-06-17  
**Deciders:** QE Architecture  

## Context

During the Cypress → Playwright migration, two frameworks run in parallel. Stakeholders need a **single observability surface** to compare pass rates, flakiness, duration trends, and failure categories — without switching between incompatible native reporters.

CI must be deterministic: no dependency on public Conduit demo endpoints, no committed secrets, and artifacts retained for post-mortem analysis.

## Decision

Standardize on the following CI and reporting stack:

| Layer | Tool | Purpose |
|-------|------|---------|
| CI orchestration | GitHub Actions | Four workflows: Cypress, Playwright, metrics, Allure publish |
| App under test | Conduit (Docker, local) | Started and seeded in every workflow run |
| Test reporting | Allure (`allure-playwright`, Cypress Allure plugin) | Unified report format across frameworks |
| Report hosting | GitHub Pages | Published via `publish-allure.yml` |
| Failure artifacts | Screenshots, traces, videos | Uploaded as workflow artifacts (short retention) |
| Metrics aggregation | `migration-metrics.yml` | Cross-framework comparison JSON for trend analysis |

Observability principles:

1. **Every workflow** starts Conduit locally, seeds data, health-checks before tests
2. **Allure results** uploaded as artifacts on every run — even on failure
3. **Secrets** (test user credentials) via GitHub Secrets — never in repo
4. **Auth state files** generated at runtime — gitignored, never uploaded
5. **Migration metrics** workflow runs on schedule to feed flakiness and cost-benefit reports

## Consequences

### Positive

- Single dashboard (Allure on GitHub Pages) for both frameworks during migration
- Historical trends enable data-driven decommission of Cypress
- Artifact retention supports async debugging without re-running CI
- Metrics workflow automates flakiness report population

### Negative

- GitHub Pages adds a deploy step and branch management (`gh-pages`)
- Allure plugin maintenance for two frameworks during dual-run period
- Artifact storage costs at scale (mitigated by retention policies)

### Neutral

- Native Playwright HTML report and Cypress Dashboard are not used — Allure is canonical
- Workflow YAML lives in `.github/workflows/` — see [ci-cd-flow.md](../architecture/ci-cd-flow.md)

## References

- [CI/CD Flow](../architecture/ci-cd-flow.md)
- [Flakiness Report](../analysis/flakiness-reliability-report.md)
- [ADR-005: Environment — Local vs Hosted Conduit](./005-environment-local-vs-hosted-conduit.md)
