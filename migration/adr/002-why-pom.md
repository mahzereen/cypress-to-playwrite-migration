# ADR-002: Why Page Object Model (POM)

**Status:** Accepted  
**Date:** 2026-06-17  
**Updated:** 2026-06-22 (P0 measured)  
**Deciders:** QE Architecture  

## Context

The Conduit P0 suite spans both Cypress (baseline) and Playwright (target). Conduit is a third-party application — DOM coupling must stay behind page-level APIs.

P0 port produced **642 LOC** in Playwright vs **553 LOC** in Cypress (tests + POM + utils + fixtures), across **23 files** each, covering **9 specs** with **100% pass rate** over 10 local runs.

## Decision

Adopt the **Page Object Model (POM)** in both frameworks:

| Directory | Language | Convention | P0 pages |
|-----------|----------|------------|----------|
| `cypress/pages/` | JavaScript | `*Page.js` classes | BasePage, Login, Register, Editor, Article, Profile, Home |
| `playwright/pages/` | TypeScript | `*Page.ts` async classes | Same six screens + BasePage |

Rules:

- Specs **never** contain raw selectors — they call page object methods
- Page objects encapsulate locators, actions, and page-level assertions
- Shared behavior lives in `BasePage` (hash navigation, auth nav assertions)
- One page object per logical Conduit screen

## Consequences

### Positive

- P0 migration was mechanical: port page object, then port spec — 9/9 specs at parity
- Selector changes require updates in one file per screen
- Page objects document Conduit surfaces for reviewers
- LOC overhead bounded: **+89 lines** for full TypeScript P0 port

### Negative

- Initial boilerplate before first green run
- Risk of oversized page objects without discipline
- Indirection for trivial one-liner interactions

### Neutral

- POM is framework-agnostic — patterns transfer directly
- Standards enforced via `.cursor/rules/` (not inline in specs)

## References

- [Test Pyramid](../architecture/test-pyramid.md)
- [ADR-003: Selector Strategy](./003-selector-strategy.md)
- [Migration Analysis](../analysis/migration-analysis.md)
