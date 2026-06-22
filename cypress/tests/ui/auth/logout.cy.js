import HomePage from '../../../pages/HomePage';
import { buildUser } from '../../../fixtures/factories/userFactory';
import { registerUserViaApi } from '../../../utils/apiClient';

describe('Auth — Logout', () => {
  const homePage = new HomePage();

  beforeEach(() => {
    const user = buildUser();
    registerUserViaApi(user);
    cy.wrap(user).as('user');
    cy.loginViaSession(user);
    homePage.visit();
  });

  it('logs out and returns to unauthenticated navigation', () => {
    cy.get('@user').then((user) => {
      homePage.assertAuthenticated(user.username);
      homePage.logout();
      homePage.assertUnauthenticated();
    });
  });
});
