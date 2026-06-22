/**
 * Conduit article detail page (`/#/article/:slug`).
 */
import BasePage from './BasePage';

class ArticlePage extends BasePage {
  /** @param {string} slug */
  visit(slug) {
    this.visitHash(`/article/${slug}`);
  }

  assertTitle(title) {
    cy.get('.article-page h1').should('have.text', title);
  }

  assertBodyContains(text) {
    cy.get('.article-content').should('contain', text);
  }

  clickEdit() {
    cy.contains('a', 'Edit Article').click();
  }

  clickDelete() {
    cy.contains('button', 'Delete Article').click();
  }

  /**
   * Favorite button(s) scoped to `.article-page`.
   * Call `assertTitle()` first so the article (and slug) is loaded.
   * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
   */
  favoriteButtons() {
    return cy.get('.article-page').contains('button', 'Favorite');
  }

  /** Clicks the first Favorite control on the detail page. */
  clickFavorite() {
    this.favoriteButtons().first().click();
  }

  assertFavorited() {
    this.favoriteButtons().first().should('have.class', 'active');
  }

  assertNotFavorited() {
    this.favoriteButtons().first().should('not.have.class', 'active');
  }
}

export default ArticlePage;
