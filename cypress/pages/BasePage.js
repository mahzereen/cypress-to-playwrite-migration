/**
 * Shared Conduit navigation and navbar auth assertions.
 * Conduit uses HashRouter — routes are `/#/path`.
 */
class BasePage {
  /**
   * @param {string} [path='/'] - Hash route without `#` prefix (e.g. `/login`)
   * @sideeffects Navigates browser to `/#${path}`
   */
  visitHash(path = '/') {
    const route = path.startsWith('/') ? path : `/${path}`;
    cy.visit(`/#${route}`);
  }

  /** @param {string} username - Expected username in the nav dropdown */
  assertAuthenticated(username) {
    cy.get('.dropdown-toggle').should('contain', username);
    cy.contains('a.nav-link', 'New Article').should('be.visible');
  }

  assertUnauthenticated() {
    cy.contains('a.nav-link', 'Login').should('be.visible');
    cy.contains('a.nav-link', 'Sign up').should('be.visible');
  }

  openUserMenu() {
    cy.get('.dropdown-toggle').click();
  }

  /** @sideeffects Opens user menu and clicks Logout */
  logout() {
    this.openUserMenu();
    cy.contains('a.dropdown-item', 'Logout').click();
  }
}

export default BasePage;
