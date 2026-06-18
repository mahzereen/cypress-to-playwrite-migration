# ADR-003: Selector Strategy

**Status:** Accepted  
**Date:** 2026-06-17  
**Deciders:** QE Architecture  

## Context

Conduit is a **third-party application** we do not control. DOM structure, CSS class names, and element hierarchy can change without notice (fork updates, dependency bumps). Traditional CSS/XPath selectors tied to implementation details produce brittle tests that fail for the wrong reasons.

We need a selector strategy that prioritizes **resilience and accessibility alignment** over convenience.

## Decision

Adopt a **role-first selector hierarchy** in Playwright (target) and equivalent semantic selectors in Cypress (baseline):

| Priority | Playwright | Cypress equivalent | Use when |
|----------|------------|-------------------|----------|
| 1 | `getByRole()` | `[role=...]` or semantic tag | Buttons, links, headings, form fields |
| 2 | `getByLabel()` | `cy.contains('label').parent()` | Form inputs with associated labels |
| 3 | `getByPlaceholder()` | `[placeholder=...]` | Inputs identified by placeholder |
| 4 | `getByText()` | `cy.contains()` | Static text content (non-interactive) |
| 5 | `getByTestId()` | `[data-testid=...]` | Only if Conduit exposes stable test IDs |
| 6 — last resort | CSS selector | CSS selector | Stable structural selectors only |

**Explicitly prohibited** in specs and page objects:

- Class-name selectors tied to styling (`.btn-primary`, `.article-preview`)
- Deeply nested CSS paths (`div > ul > li:nth-child(3)`)
- XPath unless no alternative exists (document justification in PR)

All selectors live in page objects — never in spec files.

## Consequences

### Positive

- Tests align with how users and assistive technology perceive the UI
- Selector breakage drops when Conduit refactors CSS but preserves semantics
- Playwright's `getByRole` auto-wait reduces timing-related failures
- Easier code review — role-based selectors are self-documenting

### Negative

- More verbose than a quick CSS selector during initial authoring
- Ambiguous roles require disambiguation (`{ name: '...' }` filters)
- Legacy Conduit builds may lack proper ARIA roles on some elements

### Neutral

- Migration from Cypress to Playwright requires selector rewrite in page objects — not a find-and-replace on specs
- Selector conventions enforced via `.cursor/rules/` — not inline comments

## References

- [Playwright Locators — Best Practices](https://playwright.dev/docs/locators)
- [ADR-002: Why POM](./002-why-pom.md)
