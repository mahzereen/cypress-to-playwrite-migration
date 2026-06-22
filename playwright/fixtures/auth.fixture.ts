import { test as base, expect, type Page } from '@playwright/test';
import { buildUser } from './factories/userFactory';
import { loginUserViaApi, registerUserViaApi } from '../utils/apiClient';
import {
  injectConduitAuth,
  type ConduitLoggedUser,
} from '../utils/auth';
import type { ConduitUser } from '../utils/apiClient';

type AuthFixtures = {
  /** Unique user registered via API and authenticated for the current test. */
  testUser: ConduitLoggedUser & ConduitUser;
  /** Page with per-test auth injected (mirrors Cypress cy.loginViaSession). */
  authenticatedPage: Page;
  /** API login helper returning the logged-in user payload. */
  apiLogin: (credentials: { email: string; password: string }) => Promise<ConduitLoggedUser>;
};

export const test = base.extend<AuthFixtures>({
  storageState: async ({}, use) => {
    await use({ cookies: [], origins: [] });
  },

  apiLogin: async ({ request }, use) => {
    await use(async (credentials) => {
      const response = await loginUserViaApi(request, credentials);
      const body = await response.json();
      return body.user as ConduitLoggedUser;
    });
  },

  testUser: async ({ page, request }, use) => {
    const credentials = buildUser();
    const response = await registerUserViaApi(request, credentials);
    const body = await response.json();
    const registered = body.user as ConduitLoggedUser;
    await injectConduitAuth(page, registered);
    await page.goto('/#/');
    await use({ ...credentials, ...registered });
  },

  authenticatedPage: async ({ page, testUser: _testUser }, use) => {
    await use(page);
  },
});

export { expect };
