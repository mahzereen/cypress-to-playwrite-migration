import BasePage from './BasePage';

class RegisterPage extends BasePage {
  visit() {
    this.visitHash('/register');
  }

  fillUsername(username) {
    cy.get('input[name="username"]').clear().type(username);
  }

  fillEmail(email) {
    cy.get('input[name="email"]').clear().type(email);
  }

  fillPassword(password) {
    cy.get('input[name="password"]').clear().type(password);
  }

  submit() {
    cy.contains('button', 'Sign up').click();
  }

  register({ username, email, password }) {
    this.fillUsername(username);
    this.fillEmail(email);
    this.fillPassword(password);
    this.submit();
  }

  assertOnPage() {
    cy.contains('h1', 'Sign up').should('be.visible');
  }
}

export default RegisterPage;
