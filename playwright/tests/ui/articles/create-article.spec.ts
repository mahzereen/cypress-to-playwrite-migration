import { test } from '../../../fixtures/auth.fixture';
import { EditorPage } from '../../../pages/EditorPage';
import { ArticlePage } from '../../../pages/ArticlePage';
import { buildArticle } from '../../../fixtures/factories/articleFactory';

test.describe('Articles — Create', () => {
  test('creates and publishes a new article', async ({ authenticatedPage: page }) => {
    const editorPage = new EditorPage(page);
    const articlePage = new ArticlePage(page);
    const article = buildArticle();

    await editorPage.visit();
    await editorPage.assertOnPage();
    await editorPage.createArticle(article);

    await articlePage.assertTitle(article.title);
    await articlePage.assertBodyContains(article.body);
  });
});
