# Migration Architecture

> Mermaid diagrams — no PNG assets. Render in GitHub, VS Code, or any Mermaid-capable viewer.

## System Context

The migration repo runs two parallel test frameworks against a **locally hosted** RealWorld (Conduit) instance. No dependency on public demo endpoints — reproducibility and CI determinism are non-negotiable.

```mermaid
C4Context
    title Migration Monorepo — System Context

    Person(qe, "QE Engineer", "Authors & maintains tests")
    Person(dev, "Developer", "Consumes CI signals")

    System_Boundary(mono, "cypress-to-playwright-migration") {
        System(cypress, "Cypress Framework", "Baseline E2E suite")
        System(playwright, "Playwright Framework", "Target E2E suite")
        System(migration, "Migration Analysis", "ADRs, metrics, reports")
        System(ci, "GitHub Actions CI", "Orchestrates runs & reporting")
    }

    System_Ext(conduit, "Conduit (RealWorld)", "App under test — Docker/local")
    System_Ext(allure, "Allure Reports", "GitHub Pages dashboard")
    System_Ext(gh, "GitHub", "Source control & artifacts")

    Rel(qe, cypress, "Writes tests")
    Rel(qe, playwright, "Ports tests")
    Rel(qe, migration, "Documents decisions")
    Rel(cypress, conduit, "UI + API tests")
    Rel(playwright, conduit, "UI + API tests")
    Rel(ci, cypress, "Runs on push/schedule")
    Rel(ci, playwright, "Runs on push/schedule")
    Rel(ci, allure, "Publishes reports")
    Rel(dev, allure, "Reviews trends")
    Rel(mono, gh, "Hosted in")
```

## Monorepo Layout

```mermaid
graph TB
    subgraph Root["cypress-to-playwright-migration/"]
        CY["cypress/<br/>Baseline framework"]
        PW["playwright/<br/>Target framework"]
        MG["migration/<br/>Analysis + ADRs"]
        DC["docs/<br/>Test strategy"]
        GH[".github/workflows/<br/>CI/CD"]
        CR[".cursor/rules/<br/>Coding standards"]
    end

    CY --> MG
    PW --> MG
    GH --> CY
    GH --> PW
    GH --> MG
```

## Auth Architecture Comparison

Measured: both frameworks **100% pass rate**, **0 flaky specs** over 10 local runs (9 P0 specs/run).

```mermaid
graph LR
    subgraph CypressAuth["Cypress Auth"]
        CS1["POST /api/users/login"] --> CS2["cy.session() cache"]
        CS2 --> CS3["9 P0 specs"]
    end

    subgraph PlaywrightAuth["Playwright Auth"]
        PS1["auth.setup.ts"] --> PS2["storageState → .auth/user.json"]
        PS2 --> PS3["chromium project"]
        PS4["auth.fixture API inject"] --> PS3
        PS3 --> PS5["9 P0 specs"]
    end
```

## Data Flow — Test Execution

```mermaid
sequenceDiagram
    participant CI as GitHub Actions
    participant Docker as Conduit Container
    participant FW as Test Framework
    participant Allure as Allure Reporter
    participant Pages as GitHub Pages

    CI->>Docker: Start & seed Conduit
    Docker-->>CI: Health check OK
    CI->>FW: Install deps & run tests
    FW->>Docker: UI + API interactions
    FW->>Allure: Write results
    CI->>CI: Upload artifacts
    CI->>Pages: Publish Allure report
```

## Design Principles

| Principle | Rationale | Measured outcome |
|-----------|-----------|------------------|
| Local Conduit only | Eliminates external demo flakiness (ADR-005) | 10/10 green runs both frameworks |
| Dual-run during migration | Empirical comparison | 9 P0 specs at parity |
| Auth setup isolated | Fast, deterministic suites (ADR-001) | 0 UI login in authenticated specs |
| POM everywhere | Maintainability at scale (ADR-002) | 553 → 642 LOC for P0 |
| Role-first selectors | Resilience on third-party UI (ADR-003) | 0 flaky specs (10 runs) |
| Allure as single reporting layer | Comparable dashboards (ADR-004) | Both frameworks emit allure-results |

## Related Documents

- [CI/CD Flow](./ci-cd-flow.md)
- [Test Pyramid](./test-pyramid.md)
- [Auth Flow Comparison](../analysis/auth-flow-comparison.md)
