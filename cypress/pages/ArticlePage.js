import BasePage from './BasePage';

class ArticlePage extends BasePage {
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

  favoriteButtons() {
    return cy.get('.article-page').contains('button', 'Favorite');
  }

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
