# Playwright Tests

Placeholder directory for UI and API test specs.

## Planned structure

| Path | Type | Description |
|------|------|-------------|
| `ui/auth/login.spec.ts` | UI | Login flow via UI |
| `ui/articles/create-article.spec.ts` | UI | Article CRUD via UI |
| `ui/feed/global-feed.spec.ts` | UI | Global feed navigation |
| `api/auth/login.api.spec.ts` | API | Direct API login (JWT acquisition) |
| `api/articles/articles.api.spec.ts` | API | Article endpoints |

## Auth dependency chain

```
setup (auth.setup.ts) → chromium (storageState: .auth/user.json)
```

Authenticated specs depend on the `setup` project; unauthenticated specs run without dependency.

<!-- TODO: Implement test specs — no real test code in scaffold phase -->
