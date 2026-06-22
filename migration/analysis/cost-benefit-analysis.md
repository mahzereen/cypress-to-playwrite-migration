# Cost-Benefit Analysis: Cypress → Playwright Migration

> **Status:** Measured runtime and reliability data available from local 10-run baseline; financial and effort estimates TODO.  
> **Horizon:** 12 months post-migration  
> **Data sources:** `migration/baseline/cypress/baseline-summary.json`, `migration/baseline/playwright/baseline-summary.json`

## Measured Quantitative Inputs

| Input | Cypress | Playwright | Source |
|-------|---------|------------|--------|
| Avg suite duration (local, 10-run) | 28.7s | 7.3s | baseline-summary.json |
| Suite pass rate (10 runs) | 100% | 100% | baseline-summary.json |
| Flaky specs (10 runs) | none | none | baseline-summary.json |
| LOC (tests+POM+utils+fixtures) | 553 | 642 | baseline-summary.json |
| P0 specs ported | 9 | 9 | migration inventory |
| LOC delta (Playwright − Cypress) | — | +89 (+16.1%) | computed from LOC |

## Investment Summary

| Cost category | Estimate | Confidence | Notes |
|---------------|----------|------------|-------|
| Initial migration (P0 specs) | TODO: eng-days | — | P0 port complete; hours not tracked |
| CI pipeline dual-run period | TODO: eng-days | — | Workflows scaffolded, not fully green in CI |
| Team training & ramp-up | TODO: eng-days | — | Not measured |
| Tooling & infra setup | TODO: eng-days | — | Docker Conduit + baseline harness done |
| Ongoing maintenance (annual) | TODO: eng-days/yr | — | Post-migration steady state |
| **Total investment** | **TODO: eng-days** | — | — |

## Benefit Summary (measured where available)

| Benefit category | Measured / estimated | Confidence | Notes |
|------------------|---------------------|------------|-------|
| Local suite runtime reduction | **74.4%** (28.7s → 7.3s) | High (local 10-run) | Same 9 P0 specs, retries=0 |
| Flakiness reduction | **0% → 0%** flaky specs (local) | Medium | Both 100% pass; CI TODO |
| Auth setup time reduction | TODO | — | Not instrumented separately |
| LOC increase for parity | **+89 lines** (+16.1%) | High | 553 → 642 |
| Cross-browser coverage | Qualitative | High | Playwright supports Chromium/Firefox/WebKit — not exercised in baseline |
| Debug time reduction (trace viewer) | TODO | — | Qualitative; not surveyed |

**Runtime reduction formula:** `(28728 − 7348) / 28728 = 74.4%` (avg ms from baseline JSON).

## ROI Projection

| Metric | Value |
|--------|-------|
| Total investment | TODO: eng-days |
| Annual savings | TODO: eng-days/yr |
| Payback period | TODO: months |
| 12-month net | TODO: eng-days |

## CI Cost Comparison

| Item | Cypress | Playwright | Delta |
|------|---------|------------|-------|
| GitHub Actions minutes (monthly) | TODO | TODO | TODO |
| Avg. run duration (CI) | TODO | TODO | Local measured: 28.7s vs 7.3s |
| Runs per month | TODO | TODO | — |
| Parallelization factor | TODO | TODO | Local PW: 4 workers |
| Estimated monthly cost | TODO | TODO | TODO |

## Reliability Tradeoffs

| Dimension | Cypress (measured) | Playwright (measured) | Tradeoff |
|-----------|-------------------|----------------------|----------|
| Pass rate (10 local runs) | 100% | 100% | Tie |
| Flaky specs | 0 | 0 | Tie |
| Avg duration | 28.7s | 7.3s | Playwright faster (local conditions) |
| Code volume | 553 LOC | 642 LOC | Playwright +16.1% LOC for same P0 scope |
| Auth pattern complexity | Lower (inline session) | Higher (setup project + fixture) | Cypress simpler; Playwright more explicit |

## Qualitative Factors

| Factor | Cypress | Playwright | Weight |
|--------|---------|------------|--------|
| Auth reuse at scale | Adequate (`cy.session()`) | Strong (setup + fixture) | High |
| Parallel CI native support | Weaker in practice (measured slower locally) | Stronger (measured faster locally) | High |
| Migration cost (inverse) | N/A — baseline | +89 LOC, P0 done | Medium |
| Trace / debug DX | Time-travel runner | Trace viewer + video | Medium — not quantified |

## Decision Matrix

| Criterion | Weight | Cypress score (1–5) | Playwright score (1–5) | Weighted delta |
|-----------|--------|---------------------|--------------------------|----------------|
| CI efficiency (local runtime) | 25% | TODO | TODO | Measured −21.4s avg; scores TODO |
| Reliability / flakiness | 25% | TODO | TODO | Both 100% local; scores TODO |
| Auth patterns | 20% | TODO | TODO | Qualitative; scores TODO |
| Maintainability (POM, fixtures) | 15% | TODO | TODO | +89 LOC; scores TODO |
| Debug / observability | 10% | TODO | TODO | Not measured |
| Migration cost (inverse) | 5% | TODO | TODO | P0 complete; scores TODO |
| **Weighted total** | 100% | **TODO** | **TODO** | **TODO** |

## Recommendation

**Continue migration to Playwright** based on measured evidence:

- **P0 parity achieved** — 9/9 specs, 100% pass rate over 10 local runs for both frameworks.
- **Zero flaky specs** in local baseline for both frameworks.
- **74.4% lower average local suite duration** for Playwright under measured conditions.

**Caveats:**

- Local measurements ≠ CI measurements — TODO: replicate baseline on `ubuntu-latest`.
- Auth overhead not isolated — runtime delta includes full suite, not auth alone.
- Effort and dollar ROI remain TODO until eng-hours and CI billing are captured.

## Related Documents

- [Migration Analysis](./migration-analysis.md)
- [Flakiness Report](./flakiness-reliability-report.md)
- [Comparison Matrix](../baseline/comparison-matrix.md)
- [ADR-001: Why Playwright](../adr/001-why-playwright.md)
- [ADR-004: CI and Reporting](../adr/004-ci-and-reporting.md)
