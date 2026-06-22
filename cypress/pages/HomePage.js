import BasePage from './BasePage';

class HomePage extends BasePage {
  visit() {
    this.visitHash('/');
  }

  assertArticleInFeed(title) {
    cy.contains('.article-preview h1', title).should('be.visible');
  }

  assertArticleNotInFeed(title) {
    cy.contains('.article-preview h1', title).should('not.exist');
  }

  favoriteArticleInFeed(title) {
    cy.contains('.article-preview', title)
      .find('button.btn-outline-primary')
      .click();
  }

  assertArticleFavoritedInFeed(title) {
    cy.contains('.article-preview', title)
      .find('button.btn-outline-primary')
      .should('have.class', 'active');
  }

  openArticle(title) {
    cy.contains('.article-preview h1', title).click();
  }
}

export default HomePage;
