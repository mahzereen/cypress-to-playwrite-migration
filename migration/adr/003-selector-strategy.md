# ADR-003: Selector Strategy

**Status:** Accepted  
**Date:** 2026-06-17  
**Updated:** 2026-06-22 (P0 measured)  
**Deciders:** QE Architecture  

## Context

Conduit is a **third-party application** we do not control. P0 baseline: **0 flaky specs** in 10 local runs for both frameworks — selector strategy must balance resilience with Conduit’s actual DOM (limited ARIA on some controls).

## Decision

Adopt a **role-first selector hierarchy** in Playwright, with pragmatic fallbacks where Conduit lacks accessible names:

| Priority | Playwright | Cypress (baseline) | P0 usage |
|----------|------------|-------------------|----------|
| 1 | `getByRole()` | `cy.contains('button', …)` / role-like | Login/Register buttons, nav links, Delete/Favorite/Follow |
| 2 | `getByLabel()` | Label-parent patterns | TODO: limited in Conduit forms |
| 3 | `getByPlaceholder()` / `name` attribute | `input[name="…"]` | Editor fields use `name` (Conduit HashRouter forms) |
| 4 | `getByText()` | `cy.contains()` | Headings where stable |
| 5 | Scoped CSS (structural) | `.article-page`, `.article-content` | Article detail scoping — last resort, documented in POM |
| 6 — prohibited in specs | Deep CSS / nth-child | Deep CSS / nth-child | Never in spec files |

**Rules:**

- All selectors live in **page objects only**
- No `page.waitForTimeout()` / `cy.wait(ms)` — P0 grep: **0 matches** in `playwright/`
- Web-first assertions (`expect(locator)…`) with auto-retry

## Consequences

### Positive

- Role-based nav and button interactions align with user-visible behavior
- P0 pass rate **100%** (10 runs) — no selector-related flakes recorded
- Playwright auto-wait on locators reduces explicit wait boilerplate

### Negative

- Conduit editor required `input[name="…"]` and keyboard replace for React controlled fields — not pure `getByRole`
- Structural selectors (`.article-page`) used where Conduit lacks unique roles
- Playwright **+89 LOC** vs Cypress partly due to TypeScript + explicit wait helpers (`waitForArticleLoaded`)

### Neutral

- Selector rewrites confined to page objects during port — specs stayed behavior-focused
- Conventions in `.cursor/rules/selectors-and-data.mdc`

## References

- [Playwright Locators](https://playwright.dev/docs/locators)
- [ADR-002: Why POM](./002-why-pom.md)
- [Flakiness Report](../analysis/flakiness-reliability-report.md)
