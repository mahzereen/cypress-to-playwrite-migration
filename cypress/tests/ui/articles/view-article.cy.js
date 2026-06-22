import ArticlePage from '../../../pages/ArticlePage';
import { buildUser } from '../../../fixtures/factories/userFactory';
import { buildArticle } from '../../../fixtures/factories/articleFactory';
import { registerUserViaApi, createArticleViaApi } from '../../../utils/apiClient';

describe('Articles — View', () => {
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

  it('displays article title and body on the detail page', () => {
    cy.get('@testData').then(({ article }) => {
      articlePage.visit(article.slug);
      articlePage.assertTitle(article.title);
      articlePage.assertBodyContains(article.body);
    });
  });
});
