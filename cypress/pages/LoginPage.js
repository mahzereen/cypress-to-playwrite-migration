import BasePage from './BasePage';

class LoginPage extends BasePage {
  visit() {
    this.visitHash('/login');
  }

  fillEmail(email) {
    cy.get('input[name="email"]').clear().type(email);
  }

  fillPassword(password) {
    cy.get('input[name="password"]').clear().type(password);
  }

  submit() {
    cy.contains('button', 'Login').click();
  }

  login(email, password) {
    this.fillEmail(email);
    this.fillPassword(password);
    this.submit();
  }

  assertOnPage() {
    cy.contains('h1', 'Sign in').should('be.visible');
  }
}

export default LoginPage;
