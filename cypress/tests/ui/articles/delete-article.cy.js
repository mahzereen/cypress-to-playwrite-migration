import ArticlePage from '../../../pages/ArticlePage';
import HomePage from '../../../pages/HomePage';
import { buildUser } from '../../../fixtures/factories/userFactory';
import { buildArticle } from '../../../fixtures/factories/articleFactory';
import { registerUserViaApi, createArticleViaApi } from '../../../utils/apiClient';

describe('Articles — Delete', () => {
  const articlePage = new ArticlePage();
  const homePage = new HomePage();

  beforeEach(() => {
    cy.on('window:confirm', () => true);

    const user = buildUser();
    const article = buildArticle();

    registerUserViaApi(user)
      .then(({ body }) => createArticleViaApi(body.user.token, article))
      .then(({ body: articleBody }) => {
        cy.wrap({ user, article: articleBody.article }).as('testData');
        cy.loginViaSession(user);
      });
  });

  it('deletes an article and removes it from the feed', () => {
    cy.get('@testData').then(({ article }) => {
      articlePage.visit(article.slug);
      articlePage.assertTitle(article.title);
      articlePage.clickDelete();

      homePage.visit();
      homePage.assertArticleNotInFeed(article.title);
    });
  });
});
