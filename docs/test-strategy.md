# Test Strategy — Conduit Migration

> **Status:** P0 complete (Cypress + Playwright parity)  
> **Owner:** QE Architecture  
> **Last updated:** 2026-06-17

## Purpose

Define how we test the RealWorld (Conduit) application during and after the Cypress → Playwright migration. This document is the single source of truth for scope, priorities, and quality gates.

## Scope

| In scope | Out of scope |
|----------|--------------|
| Authentication (login, register, session reuse) | Visual regression (phase 2) |
| Article CRUD (create, read, update, delete) | Load / performance testing |
| Global & tagged feeds | Mobile native applications |
| User profiles & settings | Conduit backend unit tests |
| API contract validation (auth, articles) | Testing third-party CDN assets |
| CI reliability & flakiness measurement | |

## Quality Goals

| Goal | Target | Measurement |
|------|--------|-------------|
| P0 spec pass rate (CI) | ≥ 99% | Allure + GitHub Actions |
| Flaky test rate | < 2% | 30-day rolling window |
| P0 suite duration (CI) | < _TBD_ min | Workflow timing |
| Auth setup overhead | < 5% of suite time | Auth flow comparison |
| Migration parity | 100% P0, 100% P1 | Migration inventory |

## P0 Scope (Cypress baseline)

P0 specs pass against local Conduit in both frameworks. Each spec is **fully isolated** — unique users and data per run via factories; no shared mutable state between specs.

| Area | Scenario | Spec | Auth pattern |
|------|----------|------|--------------|
| **Auth** | Register a new account | `cypress/tests/ui/auth/register.cy.js` | UI only |
| **Auth** | Login with valid credentials | `cypress/tests/ui/auth/login.cy.js` | UI only (user pre-created via API) |
| **Auth** | Logout | `cypress/tests/ui/auth/logout.cy.js` | `cy.session()` setup, UI logout |
| **Articles** | Create and publish | `cypress/tests/ui/articles/create-article.cy.js` | `cy.session()` |
| **Articles** | View article detail | `cypress/tests/ui/articles/view-article.cy.js` | `cy.session()` + API article |
| **Articles** | Edit article | `cypress/tests/ui/articles/edit-article.cy.js` | `cy.session()` + API article |
| **Articles** | Delete article | `cypress/tests/ui/articles/delete-article.cy.js` | `cy.session()` + API article |
| **Social** | Favorite an article | `cypress/tests/ui/social/favorite-article.cy.js` | `cy.session()` + API setup (author + reader) |
| **Social** | Follow a user | `cypress/tests/ui/social/follow-user.cy.js` | `cy.session()` + API setup (two users) |

**Auth reuse:** All specs except register and login use `cy.session()` with API `POST /api/users/login` and JWT injection into `localStorage` — see `cypress/utils/auth.js`.

## Test Prioritization

| Priority | Journeys | Rationale |
|----------|----------|-----------|
| **P0** | Auth (register, login, logout), article CRUD, favorite, follow | Core user value — blocks release signal |
| **P1** | Global feed filters, tag filter, settings | High-traffic paths |
| **P2** | Comments, pagination edge cases | Lower risk — post-migration |

## Framework Strategy

| Phase | Cypress | Playwright | Status |
|-------|---------|------------|--------|
| Baseline | Primary — P0 specs | — | Complete |
| Dual-run | Baseline + comparison | P0 ported | **Current** |
| Target | Decommission | Primary — all specs | Not started |

During dual-run, **both frameworks execute in CI** on every push to `main`. Discrepancies trigger investigation before Cypress decommission.

## Test Design Principles

1. **Test behavior, not implementation** — Conduit is third-party; observe UI and API contracts only
2. **Auth once, reuse everywhere** — `cy.session()` (Cypress) / `storageState` (Playwright)
3. **Page Object Model** — selectors and actions live in `pages/`, not specs
4. **Role-first selectors** — `getByRole` in Playwright; semantic equivalents in Cypress
5. **API tests for contracts, UI tests for journeys** — see [test pyramid](../migration/architecture/test-pyramid.md)
6. **No secrets in repo** — credentials via env / GitHub Secrets; JWT files gitignored
7. **Local Conduit only** — no public demo dependency (ADR-005)

## Auth Strategy

| Framework | Pattern | Location |
|-----------|---------|----------|
| Cypress | `cy.session()` + API login | `cypress/utils/auth.js` |
| Playwright | Setup project + `storageState` | `playwright/auth.setup.ts` |
| Playwright | Reusable auth fixture | `playwright/fixtures/auth.fixture.ts` |

See [auth-flow-comparison.md](../migration/analysis/auth-flow-comparison.md) for detailed analysis.

## CI Quality Gates

| Gate | Condition | Action on failure |
|------|-----------|-------------------|
| Conduit health check | `/api/tags` returns 200 | Abort test run |
| P0 pass (either framework) | 100% during dual-run | Block merge |
| Allure artifact uploaded | Always | Warn if missing |
| Flakiness threshold | > 5% on any spec | Create investigation ticket |

## Reporting

- **Allure** is the canonical report — published to GitHub Pages
- **Migration metrics** workflow aggregates cross-framework data
- Dashboard links: _TBD — populate after first CI run_

## Roles & Responsibilities

| Role | Responsibility |
|------|----------------|
| QE Architect | Strategy, ADRs, migration inventory, CI design |
| QE Engineer | Spec authoring, page objects, flakiness triage |
| DevOps / Platform | GitHub Actions, Docker Conduit, GitHub Pages |
| Engineering Lead | Migration timeline approval, decommission sign-off |

## Related Documents

- [Cypress package guide](../cypress/README.md)
- [Playwright package guide](../playwright/README.md)
- [Migration Analysis](../migration/analysis/migration-analysis.md)
- [Test Pyramid](../migration/architecture/test-pyramid.md)
- [ADR Index](../migration/adr/)
- [CI/CD Flow](../migration/architecture/ci-cd-flow.md)
