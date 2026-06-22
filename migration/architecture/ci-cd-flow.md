# CI/CD Flow

> Mermaid diagrams — no PNG assets.

## Pipeline Overview

Four GitHub Actions workflows orchestrate the migration initiative. Each workflow starts Conduit locally, runs tests, generates Allure results, uploads artifacts, and contributes to the GitHub Pages dashboard.

```mermaid
graph TB
    subgraph Triggers
        PUSH["Push to main"]
        PR["Pull request"]
        CRON["Scheduled (nightly)"]
        MANUAL["workflow_dispatch"]
    end

    subgraph Workflows
        W1["cypress-ci.yml"]
        W2["playwright-ci.yml"]
        W3["migration-metrics.yml"]
        W4["publish-allure.yml"]
    end

    subgraph SharedSteps["Shared CI Steps"]
        S1["Checkout repo"]
        S2["Start Conduit (Docker)"]
        S3["Seed test data"]
        S4["Health check /api/tags"]
        S5["Install framework deps"]
        S6["Run test suite"]
        S7["Generate Allure results"]
        S8["Upload artifacts"]
    end

    subgraph Outputs
        AR["Allure report"]
        GP["GitHub Pages"]
        MET["metrics.json"]
    end

    PUSH --> W1 & W2 & W3
    PR --> W1 & W2
    CRON --> W1 & W2 & W3
    MANUAL --> W1 & W2 & W3 & W4

    W1 & W2 --> SharedSteps
    W3 --> SharedSteps
    W4 --> GP

    S7 --> AR
    S8 --> AR
    W3 --> MET
    W1 & W2 --> W4
    W4 --> GP
```

## Cypress CI Pipeline

```mermaid
flowchart LR
    A[Trigger] --> B[Start Conduit]
    B --> C[Seed DB]
    C --> D[npm ci — cypress/]
    D --> E[cypress run]
    E --> F[Allure results]
    F --> G[Upload artifact]
    G --> H[Trigger publish-allure]
```

## Playwright CI Pipeline

```mermaid
flowchart LR
    A[Trigger] --> B[Start Conduit]
    B --> C[Seed DB]
    C --> D[npm ci — playwright/]
    D --> E[playwright install browsers]
    E --> F[setup project: auth.setup.ts]
    F --> G[playwright test]
    G --> H[Allure results]
    H --> I[Upload artifact]
    I --> J[Trigger publish-allure]
```

## Migration Metrics Pipeline

```mermaid
flowchart LR
    A[Trigger] --> B[Collect artifact metadata]
    B --> C[Compare Cypress vs Playwright]
    C --> D[Write metrics.json]
    D --> E[Upload metrics artifact]
    E --> F[Update flakiness report data]
```

## Allure Publish Pipeline

```mermaid
flowchart LR
    A[Artifact uploaded] --> B[Download allure-results]
    B --> C[allure generate]
    C --> D[Deploy to gh-pages branch]
    D --> E[GitHub Pages URL]
```

## Artifact Matrix

| Artifact | Source workflow | Retention | Status |
|----------|----------------|-----------|--------|
| `cypress-allure-results` | cypress-ci.yml | 30 days | TODO: CI validate |
| `playwright-allure-results` | playwright-ci.yml | 30 days | TODO: CI validate |
| `migration-metrics` | migration-metrics.yml | 90 days | TODO |
| Local baseline JSON | `npm run baseline:*` | Committed summaries | ✅ 2026-06-22 |

## Measured Local Baseline (reference)

| Framework | Avg duration | Pass rate (10 runs) | Flaky specs |
|-----------|--------------|---------------------|-------------|
| Cypress | 28.7s | 100% | none |
| Playwright | 7.3s | 100% | none |

Source: `migration/baseline/comparison-matrix.md`

## Environment Variables (CI)

| Variable | Source | Purpose |
|----------|--------|---------|
| `CONDUIT_BASE_URL` | Workflow env | App URL (localhost:3000) |
| `CONDUIT_API_URL` | Workflow env | API base URL |
| `TEST_USER_EMAIL` | GitHub Secrets | Auth credentials |
| `TEST_USER_PASSWORD` | GitHub Secrets | Auth credentials |

## Related Documents

- [ADR-004: CI and Reporting](../adr/004-ci-and-reporting.md)
- [ADR-005: Environment — Local vs Hosted Conduit](../adr/005-environment-local-vs-hosted-conduit.md)
- [Flakiness Report](../analysis/flakiness-reliability-report.md)
