import { test } from '../../../fixtures/auth.fixture';
import { HomePage } from '../../../pages/HomePage';

test.describe('Auth — Logout', () => {
  test('logs out and returns to unauthenticated navigation', async ({
    authenticatedPage: page,
    testUser,
  }) => {
    const homePage = new HomePage(page);
    await homePage.visit();

    await homePage.assertAuthenticated(testUser.username);
    await homePage.logout();
    await homePage.assertUnauthenticated();
  });
});
