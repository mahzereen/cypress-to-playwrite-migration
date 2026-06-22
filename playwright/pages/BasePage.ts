import { expect, type Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async visitHash(path = '/'): Promise<void> {
    const route = path.startsWith('/') ? path : `/${path}`;
    await this.page.goto(`/#${route}`);
  }

  async assertAuthenticated(username: string): Promise<void> {
    await expect(this.page.locator('.dropdown-toggle')).toContainText(username);
    await expect(this.page.getByRole('link', { name: 'New Article' })).toBeVisible();
  }

  async assertUnauthenticated(): Promise<void> {
    await expect(this.page.getByRole('link', { name: 'Login' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Sign up' })).toBeVisible();
  }

  async openUserMenu(): Promise<void> {
    await this.page.locator('.dropdown-toggle').click();
  }

  async logout(): Promise<void> {
    await this.openUserMenu();
    await this.page.getByRole('link', { name: 'Logout' }).click();
  }
}
