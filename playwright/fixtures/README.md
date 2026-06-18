# Playwright Fixtures

Custom test fixtures extending `@playwright/test`.

| File (planned) | Purpose |
|----------------|---------|
| `auth.fixture.ts` | Reusable authenticated `page` fixture (wraps storageState) |
| `api.fixture.ts` | API request context with JWT injection |
| `test-data.ts` | Typed test data builders for articles, users |

## Auth fixture pattern (placeholder)

```typescript
// TODO: Extend base test with authenticated page
// test = base.extend<{ authenticatedPage: Page }>({ ... })
```

<!-- TODO: Implement fixtures — see auth.setup.ts and utils/apiClient.ts -->
