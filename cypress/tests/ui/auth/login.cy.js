import LoginPage from '../../../pages/LoginPage';
import HomePage from '../../../pages/HomePage';
import { buildUser } from '../../../fixtures/factories/userFactory';
import { registerUserViaApi } from '../../../utils/apiClient';

describe('Auth — Login', () => {
  const loginPage = new LoginPage();
  const homePage = new HomePage();

  beforeEach(() => {
    cy.clearLocalStorage();
    const user = buildUser();
    registerUserViaApi(user);
    cy.wrap(user).as('user');
    loginPage.visit();
  });

  it('logs in via the UI with valid credentials', () => {
    cy.get('@user').then((user) => {
      loginPage.assertOnPage();
      loginPage.login(user.email, user.password);
      homePage.assertAuthenticated(user.username);
      cy.url().should('include', '#/');
    });
  });
});
