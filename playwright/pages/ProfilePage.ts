/**
 * Conduit user profile page (`/#/profile/:username`).
 */
import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async visit(username: string): Promise<void> {
    await this.visitHash(`/profile/${username}`);
  }

  async assertUsername(username: string): Promise<void> {
    await expect(this.page.locator('.profile-page h4')).toHaveText(username);
  }

  async clickFollow(username: string): Promise<void> {
    await this.page.getByRole('button', { name: new RegExp(`Follow\\s+${username}`) }).click();
  }

  async assertFollowing(username: string): Promise<void> {
    await expect(
      this.page.getByRole('button', { name: new RegExp(`Unfollow\\s+${username}`) }),
    ).toBeVisible();
  }

  async assertNotFollowing(username: string): Promise<void> {
    await expect(
      this.page.getByRole('button', { name: new RegExp(`Follow\\s+${username}`) }),
    ).toBeVisible();
  }
}
