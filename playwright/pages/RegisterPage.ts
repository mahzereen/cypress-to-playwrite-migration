/**
 * Conduit registration page (`/#/register`).
 */
import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async visit(): Promise<void> {
    await this.visitHash('/register');
  }

  async fillUsername(username: string): Promise<void> {
    await this.page.locator('input[name="username"]').fill(username);
  }

  async fillEmail(email: string): Promise<void> {
    await this.page.locator('input[name="email"]').fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.page.locator('input[name="password"]').fill(password);
  }

  async submit(): Promise<void> {
    await this.page.getByRole('button', { name: 'Sign up' }).click();
  }

  /** Full UI registration flow. */
  async register(user: { username: string; email: string; password: string }): Promise<void> {
    await this.fillUsername(user.username);
    await this.fillEmail(user.email);
    await this.fillPassword(user.password);
    await this.submit();
  }

  async assertOnPage(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Sign up' })).toBeVisible();
  }
}
