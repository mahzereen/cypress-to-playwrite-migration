import { test } from '../../../fixtures/auth.fixture';
import { ArticlePage } from '../../../pages/ArticlePage';
import { HomePage } from '../../../pages/HomePage';
import { buildArticle } from '../../../fixtures/factories/articleFactory';
import { createArticleViaApi } from '../../../utils/apiClient';

test.describe('Articles — Delete', () => {
  test('deletes an article and removes it from the feed', async ({
    authenticatedPage: page,
    testUser,
    request,
  }) => {
    const articlePayload = buildArticle();
    const createResponse = await createArticleViaApi(request, testUser.token, articlePayload);
    const { article } = await createResponse.json();

    const articlePage = new ArticlePage(page);
    const homePage = new HomePage(page);

    page.once('dialog', (dialog) => dialog.accept());

    await articlePage.visit(article.slug);
    await articlePage.assertTitle(article.title);
    await articlePage.clickDelete();

    await homePage.visit();
    await homePage.assertArticleNotInFeed(article.title);
  });
});
