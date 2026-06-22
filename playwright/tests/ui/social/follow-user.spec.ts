import { test } from '@playwright/test';
import { ProfilePage } from '../../../pages/ProfilePage';
import { buildUser } from '../../../fixtures/factories/userFactory';
import { registerUserViaApi } from '../../../utils/apiClient';
import { injectConduitAuth } from '../../../utils/auth';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Social — Follow user', () => {
  test('follows another user from their profile', async ({ page, request }) => {
    const target = buildUser();
    const follower = buildUser();

    await registerUserViaApi(request, target);
    const followerResponse = await registerUserViaApi(request, follower);
    const { user: followerUser } = await followerResponse.json();
    await injectConduitAuth(page, followerUser);

    const profilePage = new ProfilePage(page);
    await profilePage.visit(target.username);
    await profilePage.assertUsername(target.username);
    await profilePage.assertNotFollowing(target.username);
    await profilePage.clickFollow(target.username);
    await profilePage.assertFollowing(target.username);
  });
});
