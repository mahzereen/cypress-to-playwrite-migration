# ADR-005: Environment — Local vs Hosted Conduit

**Status:** Accepted  
**Date:** 2026-06-17  
**Updated:** 2026-06-22 (baseline measured on local Docker)  
**Deciders:** QE Architecture  

## Context

Conduit can run locally (Docker), self-hosted, or via public demos. Flakiness comparison requires a controlled environment.

**All measured baseline data** (2026-06-22) was captured against **local Docker Conduit**:

| Framework | Green runs | Pass rate | Avg duration |
|-----------|------------|-----------|--------------|
| Cypress | 10/10 | 100% | 28.7s |
| Playwright | 10/10 | 100% | 7.3s |

Source: `migration/baseline/*/baseline-summary.json` — `retries=0`, 9 P0 specs per run.

## Decision

**All test execution — local development and CI — runs against a locally started Conduit instance.**

| Environment | Conduit source | Data seeding | Used for |
|-------------|---------------|--------------|----------|
| Local dev | `infra/docker-compose.yml` | `npm run app:seed` | Authoring, baseline runs |
| CI (GitHub Actions) | Docker in workflow | Seed script in workflow | **TODO: validate** |
| Public demo | **Not used** | — | — |

Configuration (from `.env.example`):

| Variable | Value |
|----------|-------|
| `BASE_URL` | `http://localhost:3000` |
| `CONDUIT_API_URL` | `http://localhost:3001/api` |
| `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` | Seeded user credentials |

App repo: cloned to gitignored `app-under-test/` via `npm run app:setup`.

Health gate: `infra/scripts/wait-for-app.sh` before tests.

## Consequences

### Positive

- Reproducible 10-run baselines — **0 flaky specs** for both frameworks
- No cross-contamination from external demo users
- Seed script provides deterministic `test` user for Playwright `auth.setup.ts`

### Negative

- Docker required locally; Conduit startup adds overhead (not isolated in baseline totals)
- CI startup time on `ubuntu-latest`: **TODO: measure**
- Docker image/version pinning: **TODO: document pinned SHA in CI runs**

### Neutral

- Hosted/staging Conduit out of scope for this migration phase
- CI replication of local numbers pending

## References

- [CI/CD Flow](../architecture/ci-cd-flow.md)
- [Flakiness Report](../analysis/flakiness-reliability-report.md)
- [TonyMckes/conduit-realworld-example-app](https://github.com/TonyMckes/conduit-realworld-example-app)
