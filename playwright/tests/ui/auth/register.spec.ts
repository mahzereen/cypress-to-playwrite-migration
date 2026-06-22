import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../../pages/RegisterPage';
import { HomePage } from '../../../pages/HomePage';
import { buildUser } from '../../../fixtures/factories/userFactory';

test.describe('Auth — Register', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/');
    await page.evaluate(() => localStorage.clear());
    const registerPage = new RegisterPage(page);
    await registerPage.visit();
  });

  test('registers a new user and lands on the home feed', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const homePage = new HomePage(page);
    const user = buildUser();

    await registerPage.assertOnPage();
    await registerPage.register(user);

    await homePage.assertAuthenticated(user.username);
    await expect(page).toHaveURL(/#\//);
  });
});
