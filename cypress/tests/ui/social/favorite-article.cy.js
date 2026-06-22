import ArticlePage from '../../../pages/ArticlePage';
import { buildUser } from '../../../fixtures/factories/userFactory';
import { buildArticle } from '../../../fixtures/factories/articleFactory';
import { registerUserViaApi, createArticleViaApi } from '../../../utils/apiClient';

describe('Social — Favorite article', () => {
  const articlePage = new ArticlePage();

  beforeEach(() => {
    const author = buildUser();
    const reader = buildUser();
    const article = buildArticle();

    registerUserViaApi(author)
      .then(({ body: authorBody }) =>
        createArticleViaApi(authorBody.user.token, article).then(({ body: articleBody }) => ({
          author,
          reader,
          article: articleBody.article,
        })),
      )
      .then((data) =>
        registerUserViaApi(reader).then(() => {
          cy.wrap(data).as('testData');
          cy.loginViaSession(reader);
        }),
      );
  });

  it('favorites another user\'s article', () => {
    cy.get('@testData').then(({ article }) => {
      articlePage.visit(article.slug);
      articlePage.assertTitle(article.title);
      articlePage.assertNotFavorited();
      articlePage.clickFavorite();
      articlePage.assertFavorited();
    });
  });
});
