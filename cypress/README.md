# Cypress E2E Suite

Baseline framework for the Cypress → Playwright migration. Nine P0 specs cover auth, article CRUD, and social flows against local [Conduit](https://github.com/TonyMckes/conduit-realworld-example-app).

## Prerequisites

1. **Conduit running** — from repo root:

   ```bash
   cp .env.example .env
   npm run app:up
   npm run app:seed
   ```

2. **Dependencies** — from this directory:

   ```bash
   npm install
   ```

## Environment

Variables are loaded from the **repo root** `.env` (not from `cypress/`).

| Variable | Example | Purpose |
|----------|---------|---------|
| `BASE_URL` | `http://localhost:3000` | Conduit UI (HashRouter: `/#/path`) |
| `CONDUIT_API_URL` | `http://localhost:3001/api` | REST API for `cy.request()` helpers |
| `TEST_USER_EMAIL` | `test@example.com` | Seeded user (from `app:seed`) |
| `TEST_USER_PASSWORD` | `TestPassword123` | Seeded user password |

See [`.env.example`](../.env.example). Missing values throw at config load time.

## Running tests

```bash
# Headless (CI default)
npm test

# Interactive runner
npm run test:open

# Flakiness measurement (no retries)
npx cypress run --config retries=0
```

All commands assume Conduit is up and you are in `cypress/`.

## Auth model

| Spec group | Auth approach |
|------------|---------------|
| `tests/ui/auth/register.cy.js`, `login.cy.js` | **UI only** — no cached session |
| All other P0 specs | **API register/login** + **`cy.session()`** via `cy.loginViaSession(user)` |

Flow for authenticated specs:

1. `buildUser()` creates unique credentials per test.
2. `registerUserViaApi()` creates the user (and article data when needed).
3. `cy.loginViaSession(user)` caches browser state per email — API login once, then `localStorage.loggedUser` on revisit.

Implementation: `utils/auth.js`, custom command in `support/commands.js`.

## Project layout

```
cypress/
├── cypress.config.js    # Env, Allure, baseUrl
├── pages/               # Page objects (selectors live here only)
├── utils/               # API client, auth, config
├── fixtures/factories/  # buildUser(), buildArticle()
├── support/             # Custom commands, Allure plugin
└── tests/ui/            # P0 specs (*.cy.js)
```

## Reporting

Allure results: `reports/allure-results/` (gitignored). Generated in CI and combined by `publish-allure.yml`.

## Baseline metrics

From repo root: `npm run baseline:cypress` — see [migration/baseline/README.md](../migration/baseline/README.md).

## Standards

Coding and documentation rules: [`.cursor/rules/cypress-standards.mdc`](../.cursor/rules/cypress-standards.mdc) and [`.cursor/rules/general.mdc`](../.cursor/rules/general.mdc).
