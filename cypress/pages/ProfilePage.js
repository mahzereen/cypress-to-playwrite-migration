/**
 * Conduit user profile page (`/#/profile/:username`).
 */
import BasePage from './BasePage';

class ProfilePage extends BasePage {
  /** @param {string} username */
  visit(username) {
    this.visitHash(`/profile/${username}`);
  }

  assertUsername(username) {
    cy.get('.profile-page h4').should('have.text', username);
  }

  /** @param {string} username - Target user to follow */
  clickFollow(username) {
    cy.contains('button', new RegExp(`Follow\\s+${username}`)).click();
  }

  assertFollowing(username) {
    cy.contains('button', new RegExp(`Unfollow\\s+${username}`)).should('be.visible');
  }

  assertNotFollowing(username) {
    cy.contains('button', new RegExp(`Follow\\s+${username}`)).should('be.visible');
  }
}

export default ProfilePage;
