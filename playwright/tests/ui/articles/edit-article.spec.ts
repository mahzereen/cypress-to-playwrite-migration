import { test } from '../../../fixtures/auth.fixture';
import { EditorPage } from '../../../pages/EditorPage';
import { ArticlePage } from '../../../pages/ArticlePage';
import { buildArticle } from '../../../fixtures/factories/articleFactory';
import { createArticleViaApi } from '../../../utils/apiClient';

test.describe('Articles — Edit', () => {
  test('updates an existing article', async ({ authenticatedPage: page, testUser, request }) => {
    const articlePayload = buildArticle();
    const createResponse = await createArticleViaApi(request, testUser.token, articlePayload);
    const { article } = await createResponse.json();
    const updated = buildArticle();

    const editorPage = new EditorPage(page);
    const articlePage = new ArticlePage(page);

    await editorPage.visitEdit(article.slug);
    await editorPage.assertOnPage();
    await editorPage.waitForArticleLoaded(article.title);
    await editorPage.editArticle({
      title: updated.title,
      description: updated.description,
      body: updated.body,
    });

    await articlePage.assertTitle(updated.title);
    await articlePage.assertBodyContains(updated.body);
  });
});
