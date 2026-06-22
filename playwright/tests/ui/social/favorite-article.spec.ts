import { test } from '@playwright/test';
import { ArticlePage } from '../../../pages/ArticlePage';
import { buildUser } from '../../../fixtures/factories/userFactory';
import { buildArticle } from '../../../fixtures/factories/articleFactory';
import { createArticleViaApi, registerUserViaApi } from '../../../utils/apiClient';
import { injectConduitAuth } from '../../../utils/auth';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Social — Favorite article', () => {
  test("favorites another user's article", async ({ page, request }) => {
    const author = buildUser();
    const reader = buildUser();
    const articlePayload = buildArticle();

    const authorResponse = await registerUserViaApi(request, author);
    const { user: authorUser } = await authorResponse.json();
    const articleResponse = await createArticleViaApi(request, authorUser.token, articlePayload);
    const { article } = await articleResponse.json();

    const readerResponse = await registerUserViaApi(request, reader);
    const { user: readerUser } = await readerResponse.json();
    await injectConduitAuth(page, readerUser);

    const articlePage = new ArticlePage(page);
    await articlePage.visit(article.slug);
    await articlePage.assertTitle(article.title);
    await articlePage.assertNotFavorited();
    await articlePage.clickFavorite();
    await articlePage.assertFavorited();
  });
});
