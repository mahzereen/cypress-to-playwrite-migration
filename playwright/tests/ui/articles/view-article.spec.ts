import { test } from '../../../fixtures/auth.fixture';
import { ArticlePage } from '../../../pages/ArticlePage';
import { buildArticle } from '../../../fixtures/factories/articleFactory';
import { createArticleViaApi } from '../../../utils/apiClient';

test.describe('Articles — View', () => {
  test('displays article title and body on the detail page', async ({
    authenticatedPage: page,
    testUser,
    request,
  }) => {
    const articlePayload = buildArticle();
    const createResponse = await createArticleViaApi(request, testUser.token, articlePayload);
    const { article } = await createResponse.json();

    const articlePage = new ArticlePage(page);
    await articlePage.visit(article.slug);
    await articlePage.assertTitle(article.title);
    await articlePage.assertBodyContains(article.body);
  });
});
