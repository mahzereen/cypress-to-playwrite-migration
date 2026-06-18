# ADR-005: Environment — Local vs Hosted Conduit

**Status:** Accepted  
**Date:** 2026-06-17  
**Deciders:** QE Architecture  

## Context

The RealWorld (Conduit) application can be run locally (Docker), self-hosted, or accessed via public demo instances (e.g., `demo.realworld.io`). Each option has different implications for test determinism, data isolation, CI reproducibility, and flakiness measurement.

Public demo endpoints are tempting for quick starts but introduce variables outside our control: shared state, rate limits, deployments, and data mutations by other users.

## Decision

**All test execution — local development and CI — runs against a locally started Conduit instance.**

| Environment | Conduit source | Data seeding | Used for |
|-------------|---------------|--------------|----------|
| Local dev | Docker Compose (TBD) | Seed script before test run | Authoring & debugging |
| CI (GitHub Actions) | Docker container in workflow | Seed script in workflow steps | Automated runs, metrics |
| Public demo | **Not used** | — | — |

Configuration:

- `CONDUIT_BASE_URL` defaults to `http://localhost:3000`
- `CONDUIT_API_URL` defaults to `http://localhost:3000/api`
- Credentials supplied via `.env` (local) or GitHub Secrets (CI)
- Health check (`GET /api/tags` or equivalent) gates test execution

## Consequences

### Positive

- Full control over app state — no cross-contamination from external users
- Reproducible CI runs enable valid flakiness comparison between frameworks
- Seed scripts create known test users and articles deterministically
- No network dependency on third-party demo uptime

### Negative

- CI workflows include Conduit startup time (~30–60s overhead per run)
- Docker maintenance burden (image pinning, version updates)
- Local dev requires Docker installed and running

### Neutral

- Conduit version pinned via Docker image tag or git SHA — document in flakiness report
- Hosted/staging Conduit may be added later for pre-release validation (out of migration scope)

## References

- [CI/CD Flow](../architecture/ci-cd-flow.md)
- [Flakiness Report](../analysis/flakiness-reliability-report.md)
- [RealWorld GitHub](https://github.com/gothinkster/realworld)
