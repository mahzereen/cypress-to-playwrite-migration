import RegisterPage from '../../../pages/RegisterPage';
import HomePage from '../../../pages/HomePage';
import { buildUser } from '../../../fixtures/factories/userFactory';

describe('Auth — Register', () => {
  const registerPage = new RegisterPage();
  const homePage = new HomePage();

  beforeEach(() => {
    cy.clearLocalStorage();
    registerPage.visit();
  });

  it('registers a new user and lands on the home feed', () => {
    const user = buildUser();

    registerPage.assertOnPage();
    registerPage.register(user);

    homePage.assertAuthenticated(user.username);
    cy.url().should('include', '#/');
  });
});
