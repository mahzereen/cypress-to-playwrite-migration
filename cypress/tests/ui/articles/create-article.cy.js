import EditorPage from '../../../pages/EditorPage';
import ArticlePage from '../../../pages/ArticlePage';
import { buildUser } from '../../../fixtures/factories/userFactory';
import { buildArticle } from '../../../fixtures/factories/articleFactory';
import { registerUserViaApi } from '../../../utils/apiClient';

describe('Articles — Create', () => {
  const editorPage = new EditorPage();
  const articlePage = new ArticlePage();

  beforeEach(() => {
    const user = buildUser();
    registerUserViaApi(user);
    cy.wrap(user).as('user');
    cy.loginViaSession(user);
    editorPage.visit();
  });

  it('creates and publishes a new article', () => {
    const article = buildArticle();

    editorPage.assertOnPage();
    editorPage.createArticle(article);

    articlePage.assertTitle(article.title);
    articlePage.assertBodyContains(article.body);
  });
});
