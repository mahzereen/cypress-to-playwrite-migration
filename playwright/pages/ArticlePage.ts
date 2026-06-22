/**
 * Conduit article detail page (`/#/article/:slug`).
 */
import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ArticlePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async visit(slug: string): Promise<void> {
    await this.visitHash(`/article/${slug}`);
  }

  async assertTitle(title: string): Promise<void> {
    await expect(this.page.locator('.article-page h1')).toHaveText(title);
  }

  async assertBodyContains(text: string): Promise<void> {
    await expect(this.page.locator('.article-content')).toContainText(text);
  }

  async clickEdit(): Promise<void> {
    await this.page.getByRole('link', { name: 'Edit Article' }).click();
  }

  async clickDelete(): Promise<void> {
    await this.page
      .locator('.article-page')
      .getByRole('button', { name: 'Delete Article' })
      .first()
      .click();
  }

  /**
   * Favorite button(s) scoped to `.article-page`.
   * Call `assertTitle()` first so the article (and slug) is loaded.
   */
  favoriteButtons(): Locator {
    return this.page.locator('.article-page').getByRole('button', { name: 'Favorite' });
  }

  /** Clicks the first Favorite control on the detail page. */
  async clickFavorite(): Promise<void> {
    await this.favoriteButtons().first().click();
  }

  async assertFavorited(): Promise<void> {
    await expect(this.favoriteButtons().first()).toHaveClass(/active/);
  }

  async assertNotFavorited(): Promise<void> {
    await expect(this.favoriteButtons().first()).not.toHaveClass(/active/);
  }
}
