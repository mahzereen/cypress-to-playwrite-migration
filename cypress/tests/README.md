# Cypress Tests

Placeholder directory for UI and API test specs.

## Planned structure

| Path | Type | Description |
|------|------|-------------|
| `ui/auth/login.cy.js` | UI | Login flow via UI |
| `ui/articles/create-article.cy.js` | UI | Article CRUD via UI |
| `ui/feed/global-feed.cy.js` | UI | Global feed navigation |
| `api/auth/login.api.cy.js` | API | Direct API login (JWT acquisition) |
| `api/articles/articles.api.cy.js` | API | Article endpoints |

## Auth patterns (placeholder)

- **UI login + `cy.session()`**: Cache authenticated session across specs.
- **Direct API login**: POST `/api/users/login`, inject token for faster setup.

<!-- TODO: Implement test specs — no real test code in scaffold phase -->
