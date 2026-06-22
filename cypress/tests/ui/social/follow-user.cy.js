import ProfilePage from '../../../pages/ProfilePage';
import { buildUser } from '../../../fixtures/factories/userFactory';
import { registerUserViaApi } from '../../../utils/apiClient';

describe('Social — Follow user', () => {
  const profilePage = new ProfilePage();

  beforeEach(() => {
    const target = buildUser();
    const follower = buildUser();

    registerUserViaApi(target);
    registerUserViaApi(follower);
    cy.wrap({ target, follower }).as('testData');
    cy.get('@testData').then(({ follower }) => {
      cy.loginViaSession(follower);
    });
  });

  it('follows another user from their profile', () => {
    cy.get('@testData').then(({ target }) => {
      profilePage.visit(target.username);
      profilePage.assertUsername(target.username);
      profilePage.assertNotFollowing(target.username);
      profilePage.clickFollow(target.username);
      profilePage.assertFollowing(target.username);
    });
  });
});
