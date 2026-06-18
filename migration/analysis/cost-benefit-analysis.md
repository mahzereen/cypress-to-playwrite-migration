# Cost-Benefit Analysis: Cypress → Playwright Migration

> **Status:** Scaffold — refine with actual team hours and CI billing data.
> **Horizon:** 12 months post-migration

## Investment Summary

| Cost category | Estimate | Confidence | Notes |
|---------------|----------|------------|-------|
| Initial migration (P0 + P1 specs) | _TBD_ eng-days | Low | Depends on spec count & complexity |
| CI pipeline dual-run period | _TBD_ eng-days | Medium | Both frameworks until decommission |
| Team training & ramp-up | _TBD_ eng-days | Medium | Playwright fixtures, trace viewer |
| Tooling & infra setup | _TBD_ eng-days | High | Allure, GitHub Pages, Conduit Docker |
| Ongoing maintenance (annual) | _TBD_ eng-days/yr | Low | Post-migration steady state |
| **Total investment** | **_TBD_ eng-days** | — | — |

## Benefit Summary

| Benefit category | Estimate | Confidence | Notes |
|------------------|----------|------------|-------|
| CI runtime reduction (parallel workers) | _TBD %_ | Medium | Measured after Playwright port |
| Flakiness reduction | _TBD %_ | Low | See flakiness-reliability-report.md |
| Auth setup time reduction | _TBD %_ | Medium | storageState vs repeated cy.session() |
| Debug time reduction (trace viewer) | _TBD %_ | Low | Qualitative — survey team |
| Cross-browser coverage | Qualitative | High | WebKit/Firefox without extra tooling |
| Vendor / license risk reduction | Qualitative | Medium | Playwright OSS (Microsoft) |
| **Total annual savings** | **_TBD_ eng-days/yr** | — | — |

## ROI Projection

| Metric | Value |
|--------|-------|
| Total investment | _TBD_ eng-days |
| Annual savings | _TBD_ eng-days/yr |
| Payback period | _TBD_ months |
| 12-month net | _TBD_ eng-days |

## CI Cost Comparison (placeholder)

| Item | Cypress (monthly) | Playwright (monthly) | Delta |
|------|-------------------|----------------------|-------|
| GitHub Actions minutes | _TBD_ | _TBD_ | _TBD_ |
| Avg. run duration | _TBD_ min | _TBD_ min | _TBD_ |
| Runs per month | _TBD_ | _TBD_ | — |
| Parallelization factor | 1x | _TBD_x | — |
| Estimated monthly cost | _TBD $_ | _TBD $_ | _TBD $_ |

## Qualitative Factors

| Factor | Cypress | Playwright | Weight |
|--------|---------|------------|--------|
| Auth reuse at scale | Adequate | Strong | High |
| Parallel CI native support | Weak | Strong | High |
| Ecosystem / hiring market | Mature | Growing rapidly | Medium |
| Trace / debug DX | Good | Excellent | Medium |
| API + UI in one runner | Good | Good | Low |
| Community for Conduit-like apps | Moderate | Moderate | Low |

## Decision Matrix

| Criterion | Weight | Cypress score (1–5) | Playwright score (1–5) | Weighted delta |
|-----------|--------|---------------------|------------------------|----------------|
| CI efficiency | 25% | _TBD_ | _TBD_ | _TBD_ |
| Reliability / flakiness | 25% | _TBD_ | _TBD_ | _TBD_ |
| Auth patterns | 20% | _TBD_ | _TBD_ | _TBD_ |
| Maintainability (POM, fixtures) | 15% | _TBD_ | _TBD_ | _TBD_ |
| Debug / observability | 10% | _TBD_ | _TBD_ | _TBD_ |
| Migration cost (inverse) | 5% | _TBD_ | _TBD_ | _TBD_ |
| **Weighted total** | 100% | **_TBD_** | **_TBD_** | **_TBD_** |

## Recommendation

Proceed with migration to Playwright. The combination of native parallel execution, setup-project auth reuse (`storageState`), and superior trace-based debugging justifies the one-time migration cost — particularly at Staff/Principal scale where CI minutes and flakiness tax compound across teams.

## Related Documents

- [Migration Analysis](./migration-analysis.md)
- [Flakiness Report](./flakiness-reliability-report.md)
- [ADR-001: Why Playwright](../adr/001-why-playwright.md)
- [ADR-004: CI and Reporting](../adr/004-ci-and-reporting.md)
