# ADR-001: Why Playwright

**Status:** Accepted  
**Date:** 2026-06-17  
**Deciders:** QE Architecture  

## Context

The team maintains a Cypress-based E2E suite against the RealWorld (Conduit) application. As test volume and CI parallelism requirements grow, limitations in Cypress's execution model — particularly around auth reuse across parallel workers and cross-browser coverage — create compounding cost in CI minutes and engineer debug time.

We need a target framework that:

- Scales auth setup efficiently under parallel CI
- Provides first-class cross-browser support
- Offers comparable or better debug tooling
- Integrates with Allure and GitHub Actions

## Decision

Adopt **Playwright** as the target E2E framework and migrate the Conduit test suite from Cypress over a phased timeline (see [migration-analysis.md](../analysis/migration-analysis.md)).

**Auth reuse is a deciding factor.** Playwright's setup-project pattern with `storageState` allows authentication to run once per CI job, persist browser state to a file, and inject it into all parallel workers via project `dependencies`. This is structurally cleaner than per-spec `cy.session()` caching and scales linearly with worker count.

Additional factors:

| Factor | Playwright advantage |
|--------|---------------------|
| Parallel execution | Native multi-worker, multi-browser |
| Auth reuse | `storageState` + setup project + reusable auth fixture |
| Debugging | Trace viewer with network, DOM snapshots, screenshots |
| API testing | Built-in `request` fixture alongside browser tests |
| Auto-wait | Locator-based, reduces explicit wait boilerplate |
| OSS governance | Microsoft-backed, Apache 2.0 |

Cypress remains as the **baseline** during migration to enable empirical comparison (flakiness, duration, auth timing).

## Consequences

### Positive

- Reduced auth overhead in CI as worker count increases
- Single config surface for cross-browser projects
- Trace viewer reduces mean-time-to-diagnose for flaky failures
- Strong hiring pipeline — Playwright adoption accelerating industry-wide

### Negative

- One-time migration cost for existing Cypress specs and custom commands
- Dual-framework maintenance during transition period (weeks to months)
- Team ramp-up on Playwright fixtures, setup projects, and locator API
- Allure integration requires separate reporter setup vs Cypress plugin ecosystem

### Neutral

- POM pattern transfers directly — page objects rewritten, not rethought
- Conduit remains app under test; no application changes required
- CI infrastructure (GitHub Actions, Docker Conduit) unchanged

## References

- [Auth Flow Comparison](../analysis/auth-flow-comparison.md)
- [Cost-Benefit Analysis](../analysis/cost-benefit-analysis.md)
- [Playwright Auth Setup](https://playwright.dev/docs/auth)
