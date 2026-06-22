class BasePage {
  visitHash(path = '/') {
    const route = path.startsWith('/') ? path : `/${path}`;
    cy.visit(`/#${route}`);
  }

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

  logout() {
    this.openUserMenu();
    cy.contains('a.dropdown-item', 'Logout').click();
  }
}

export default BasePage;
