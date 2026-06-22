import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';
import { HomePage } from '../../../pages/HomePage';
import { buildUser } from '../../../fixtures/factories/userFactory';
import { registerUserViaApi } from '../../../utils/apiClient';

type TestUser = ReturnType<typeof buildUser>;

let user: TestUser;

test.describe('Auth — Login', () => {
  test.beforeEach(async ({ page, request }) => {
    await page.goto('/#/');
    await page.evaluate(() => localStorage.clear());

    user = buildUser();
    await registerUserViaApi(request, user);

    const loginPage = new LoginPage(page);
    await loginPage.visit();
  });

  test('logs in via the UI with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.assertOnPage();
    await loginPage.login(user.email, user.password);

    await homePage.assertAuthenticated(user.username);
    await expect(page).toHaveURL(/#\//);
  });
});
