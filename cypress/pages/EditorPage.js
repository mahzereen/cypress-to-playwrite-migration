import BasePage from './BasePage';

class EditorPage extends BasePage {
  visit() {
    this.visitHash('/editor');
  }

  visitEdit(slug) {
    this.visitHash(`/editor/${slug}`);
  }

  fillTitle(title) {
    cy.get('input[name="title"]').clear().type(title);
  }

  fillDescription(description) {
    cy.get('input[name="description"]').clear().type(description);
  }

  fillBody(body) {
    cy.get('textarea[name="body"]').clear().type(body);
  }

  fillTags(tags) {
    const value = Array.isArray(tags) ? tags.join(', ') : tags;
    cy.get('input[name="tags"]').clear().type(value);
  }

  publish() {
    cy.contains('button', 'Publish Article').click();
  }

  update() {
    cy.contains('button', 'Update Article').click();
  }

  createArticle({ title, description, body, tagList }) {
    this.fillTitle(title);
    this.fillDescription(description);
    this.fillBody(body);
    if (tagList) this.fillTags(tagList);
    this.publish();
  }

  editArticle({ title, description, body }) {
    if (title) this.fillTitle(title);
    if (description) this.fillDescription(description);
    if (body) this.fillBody(body);
    this.update();
  }

  assertOnPage() {
    cy.get('input[name="title"]').should('be.visible');
  }
}

export default EditorPage;
