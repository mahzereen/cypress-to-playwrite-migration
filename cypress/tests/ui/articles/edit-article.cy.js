import EditorPage from '../../../pages/EditorPage';
import ArticlePage from '../../../pages/ArticlePage';
import { buildUser } from '../../../fixtures/factories/userFactory';
import { buildArticle } from '../../../fixtures/factories/articleFactory';
import { registerUserViaApi, createArticleViaApi } from '../../../utils/apiClient';

describe('Articles — Edit', () => {
  const editorPage = new EditorPage();
  const articlePage = new ArticlePage();

  beforeEach(() => {
    const user = buildUser();
    const article = buildArticle();

    registerUserViaApi(user)
      .then(({ body }) => createArticleViaApi(body.user.token, article))
      .then(({ body: articleBody }) => {
        cy.wrap({ user, article: articleBody.article }).as('testData');
        cy.loginViaSession(user);
      });
  });

  it('updates an existing article', () => {
    const updated = buildArticle();

    cy.get('@testData').then(({ article }) => {
      editorPage.visitEdit(article.slug);
      editorPage.editArticle({
        title: updated.title,
        description: updated.description,
        body: updated.body,
      });

      articlePage.assertTitle(updated.title);
      articlePage.assertBodyContains(updated.body);
    });
  });
});
