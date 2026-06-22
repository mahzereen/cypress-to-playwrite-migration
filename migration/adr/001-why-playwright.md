# ADR-001: Why Playwright

**Status:** Accepted  
**Date:** 2026-06-17  
**Updated:** 2026-06-22 (P0 measured)  
**Deciders:** QE Architecture  

## Context

The team maintains a Cypress-based E2E suite against the RealWorld (Conduit) application. P0 scope (9 specs: auth, article CRUD, favorite, follow) is implemented in both frameworks with local 10-run baselines (`retries=0`).

Measured local baseline (2026-06-22):

| Metric | Cypress | Playwright |
|--------|---------|------------|
| Avg suite duration | 28.7s | 7.3s |
| Pass rate (10 runs) | 100% | 100% |
| Flaky specs | none | none |
| LOC | 553 | 642 |

Source: `migration/baseline/cypress/baseline-summary.json`, `migration/baseline/playwright/baseline-summary.json`.

Cypress limitations under parallel CI and cross-browser coverage motivated evaluating Playwright as the target framework.

## Decision

Adopt **Playwright** as the target E2E framework. Cypress remains the baseline during dual-run until P1 parity and CI evidence support decommission.

**Auth reuse is a deciding factor.** Playwright's setup-project pattern with `storageState` (`auth.setup.ts` → `.auth/user.json`) plus `auth.fixture.ts` for per-test API login mirrors Cypress `cy.session()` without UI login repetition. See [auth-flow-comparison.md](../analysis/auth-flow-comparison.md).

Additional factors:

| Factor | Playwright advantage |
|--------|---------------------|
| Parallel execution | Native multi-worker — measured 7.3s avg vs 28.7s Cypress (local 10-run) |
| Auth reuse | `storageState` + setup project + auth fixture |
| Debugging | Trace viewer with network, DOM snapshots, screenshots |
| API testing | Built-in `request` fixture alongside browser tests |
| Auto-wait | Locator-based assertions |
| OSS governance | Microsoft-backed, Apache 2.0 |

## Consequences

### Positive

- Measured **74.4% reduction** in average local suite duration (28.7s → 7.3s) for identical P0 scope
- **100% pass rate**, **0 flaky specs** over 10 local runs post-port
- Setup project decouples authentication from individual tests
- Trace viewer available for failure diagnosis (not yet quantified)

### Negative

- **+89 LOC** (+16.1%) to achieve P0 parity vs Cypress
- Dual-framework maintenance during transition (Cypress CI workflows still TODO for full green)
- Team ramp-up on setup projects, fixtures, and locator API
- Auth timing not separately measured — overhead claims require TODO instrumentation

### Neutral

- POM pattern transfers directly — page objects rewritten in TypeScript, same surfaces
- Conduit remains app under test; no application changes required
- Local Docker Conduit unchanged (ADR-005)

## References

- [Auth Flow Comparison](../analysis/auth-flow-comparison.md)
- [Cost-Benefit Analysis](../analysis/cost-benefit-analysis.md)
- [Comparison Matrix](../baseline/comparison-matrix.md)
- [Playwright Auth Setup](https://playwright.dev/docs/auth)
