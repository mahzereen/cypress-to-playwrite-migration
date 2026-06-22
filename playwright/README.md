# Playwright E2E Suite

Target framework for the Cypress → Playwright migration. Nine P0 specs mirror the Cypress baseline (auth, article CRUD, social) against local [Conduit](https://github.com/TonyMckes/conduit-realworld-example-app).

## Prerequisites

1. **Conduit running** — from repo root:

   ```bash
   cp .env.example .env
   npm run app:up
   npm run app:seed
   ```

2. **Dependencies and browsers** — from this directory:

   ```bash
   npm install
   npx playwright install chromium
   ```

## Environment

Variables are loaded from the **repo root** `.env` via `playwright.config.ts`.

| Variable | Example | Purpose |
|----------|---------|---------|
| `BASE_URL` | `http://localhost:3000` | Conduit UI (HashRouter: `/#/path`) |
| `CONDUIT_API_URL` | `http://localhost:3001/api` | REST API for `request` fixture helpers |
| `TEST_USER_EMAIL` | `test@example.com` | Seeded user for setup project |
| `TEST_USER_PASSWORD` | `TestPassword123` | Seeded user password |

See [`.env.example`](../.env.example). Missing values throw at config load time.

## Running tests

```bash
# Headless (runs setup → specs)
npm test

# UI mode
npm run test:ui

# Flakiness measurement (no retries)
npx playwright test --retries=0

# Single spec
npx playwright test tests/ui/auth/login.spec.ts
```

All commands assume Conduit is up and you are in `playwright/`.

## Auth model

Playwright uses **three projects** in `playwright.config.ts`:

| Project | Specs | Auth |
|---------|-------|------|
| `setup` | `auth.setup.ts` | API login with seeded user → writes `.auth/user.json` |
| `chromium-unauth` | `auth/register`, `auth/login` | No saved storage state |
| `chromium` | All other `*.spec.ts` | Depends on `setup`; uses `storageState` from `.auth/user.json` |

Per-test isolation (mirrors Cypress `cy.session()`):

- Specs import `test` from `fixtures/auth.fixture.ts` (not `@playwright/test` directly).
- The fixture clears project `storageState` and registers a **unique user** via API for each test (`testUser`, `authenticatedPage`).
- Social specs that need two users call `test.use({ storageState: { cookies: [], origins: [] } })` and `injectConduitAuth()` for the second user.

Generated auth files in `.auth/` are gitignored.

## Project layout

```
playwright/
├── playwright.config.ts   # Projects, Allure, baseURL
├── auth.setup.ts          # Setup project — persisted storageState
├── pages/                 # Page objects (TypeScript)
├── utils/                 # API client, auth, config
├── fixtures/
│   ├── auth.fixture.ts    # Per-test API auth extension
│   └── factories/         # buildUser(), buildArticle()
└── tests/ui/              # P0 specs (*.spec.ts)
```

## Reporting

Allure results: `reports/allure-results/` (gitignored). Trace, screenshot, and video on failure are enabled in config.

## Baseline metrics

From repo root: `npm run baseline:playwright` — see [migration/baseline/README.md](../migration/baseline/README.md).

## Standards

Coding and documentation rules: [`.cursor/rules/playwright-standards.mdc`](../.cursor/rules/playwright-standards.mdc) and [`.cursor/rules/general.mdc`](../.cursor/rules/general.mdc).
