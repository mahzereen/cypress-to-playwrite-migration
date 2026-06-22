/**
 * Conduit home feed (`/#/`).
 */
import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async visit(): Promise<void> {
    await this.visitHash('/');
  }

  async assertArticleInFeed(title: string): Promise<void> {
    await expect(this.page.locator('.article-preview h1', { hasText: title })).toBeVisible();
  }

  async assertArticleNotInFeed(title: string): Promise<void> {
    await expect(this.page.locator('.article-preview h1', { hasText: title })).toHaveCount(0);
  }
}
