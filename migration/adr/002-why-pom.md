# ADR-002: Why Page Object Model (POM)

**Status:** Accepted  
**Date:** 2026-06-17  
**Deciders:** QE Architecture  

## Context

The Conduit test suite will span both Cypress (baseline) and Playwright (target) during migration. Without a consistent abstraction layer, selectors and interaction logic will diverge across specs, making porting error-prone and maintenance costly.

The RealWorld app is a third-party reference implementation — we do not control its DOM. Tests must isolate UI coupling behind stable page-level APIs.

## Decision

Adopt the **Page Object Model (POM)** in both frameworks:

| Directory | Language | Convention |
|-----------|----------|------------|
| `cypress/pages/` | JavaScript | `*Page.js` classes with chainable methods |
| `playwright/pages/` | TypeScript | `*Page.ts` classes with async methods returning `Locator` |

Rules:

- Specs **never** contain raw selectors — they call page object methods
- Page objects encapsulate locators, actions, and page-level assertions
- Shared behavior lives in `BasePage` (navigation, common waits)
- One page object per logical Conduit screen (Login, Home, Editor, Article, Profile)

## Consequences

### Positive

- Migration becomes mechanical: port page object, then port spec
- Selector changes in Conduit require updates in one file, not N specs
- Page objects serve as living documentation of app surfaces
- Enables code review focused on behavior, not selector syntax

### Negative

- Initial boilerplate before first spec runs
- Risk of "god page objects" if discipline slips — enforce single-responsibility
- Slight indirection for simple one-liner tests

### Neutral

- POM is framework-agnostic — patterns transfer directly from Cypress to Playwright
- Coding standards for POM live in `.cursor/rules/` (not inline in specs)

## References

- [Test Pyramid](../architecture/test-pyramid.md)
- [ADR-003: Selector Strategy](./003-selector-strategy.md)
