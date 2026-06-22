/**
 * Conduit article editor (`/#/editor` and `/#/editor/:slug`).
 */
import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class EditorPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async visit(): Promise<void> {
    await this.visitHash('/editor');
  }

  async visitEdit(slug: string): Promise<void> {
    await this.visitHash(`/editor/${slug}`);
  }

  /**
   * Replaces a React controlled field via select-all + type.
   * `fill()` alone does not sync Conduit editor state reliably.
   */
  private async fillInputField(locator: ReturnType<Page['locator']>, value: string): Promise<void> {
    await locator.click();
    await locator.press('ControlOrMeta+a');
    await locator.pressSequentially(value, { delay: 5 });
  }

  async fillTitle(title: string): Promise<void> {
    await this.fillInputField(this.page.locator('input[name="title"]'), title);
  }

  async fillDescription(description: string): Promise<void> {
    await this.fillInputField(this.page.locator('input[name="description"]'), description);
  }

  async fillBody(body: string): Promise<void> {
    await this.fillInputField(this.page.locator('textarea[name="body"]'), body);
  }

  async fillTags(tags: string[] | string): Promise<void> {
    const value = Array.isArray(tags) ? tags.join(', ') : tags;
    await this.fillInputField(this.page.locator('input[name="tags"]'), value);
  }

  async publish(): Promise<void> {
    await this.page.getByRole('button', { name: 'Publish Article' }).click();
  }

  /** Waits until the editor has loaded the article title from the API. */
  async waitForArticleLoaded(title: string): Promise<void> {
    await expect(this.page.locator('input[name="title"]')).toHaveValue(title);
  }

  /**
   * Submits the edit form and waits for the PUT `/api/articles/:slug` response.
   * @sideeffects Clicks Update Article and blocks until API confirms success
   */
  async update(): Promise<void> {
    const updateButton = this.page.getByRole('button', { name: 'Update Article' });
    await Promise.all([
      this.page.waitForResponse(
        (response) =>
          response.request().method() === 'PUT' &&
          response.url().includes('/api/articles/') &&
          response.ok(),
      ),
      updateButton.click(),
    ]);
  }

  /** Fills all fields and publishes a new article. */
  async createArticle(article: {
    title: string;
    description: string;
    body: string;
    tagList?: string[];
  }): Promise<void> {
    await this.fillTitle(article.title);
    await this.fillDescription(article.description);
    await this.fillBody(article.body);
    if (article.tagList) await this.fillTags(article.tagList);
    await this.publish();
  }

  /** Updates only provided fields, asserts each value, then submits. */
  async editArticle(fields: {
    title?: string;
    description?: string;
    body?: string;
  }): Promise<void> {
    if (fields.title) {
      await this.fillTitle(fields.title);
      await expect(this.page.locator('input[name="title"]')).toHaveValue(fields.title);
    }
    if (fields.description) {
      await this.fillDescription(fields.description);
      await expect(this.page.locator('input[name="description"]')).toHaveValue(fields.description);
    }
    if (fields.body) {
      await this.fillBody(fields.body);
      await expect(this.page.locator('textarea[name="body"]')).toHaveValue(fields.body);
    }
    await this.update();
  }

  async assertOnPage(): Promise<void> {
    await expect(this.page.locator('input[name="title"]')).toBeVisible();
  }
}
