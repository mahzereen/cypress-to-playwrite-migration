import { loginViaSession } from '../utils/auth';

Cypress.Commands.add('loginViaSession', (user) => {
  loginViaSession(user);
});
