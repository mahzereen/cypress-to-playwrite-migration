// TODO: Auth setup project — authenticate once, reuse storageState across tests.
//
// Flow (placeholder):
//   1. Call Conduit POST /api/users/login via API fixture
//   2. Inject JWT into browser localStorage / cookies
//   3. Save storageState to .auth/user.json (gitignored)
//
// See fixtures/auth.fixture.ts and utils/apiClient.ts

import { test as setup } from '@playwright/test';

const authFile = '.auth/user.json';

setup('authenticate via API and persist storageState', async ({ page }) => {
  // TODO: Implement API-based login — no real test code in scaffold phase
  // await loginViaApi(page, { email, password });
  // await page.context().storageState({ path: authFile });
});
