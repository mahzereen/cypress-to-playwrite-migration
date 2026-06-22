/**
 * Cypress custom commands — thin wrappers around `utils/auth.js`.
 * @module support/commands
 */
import { loginViaSession } from '../utils/auth';

/**
 * Authenticate via API and cache session (see `loginViaSession`).
 * @param {{ email: string, password: string }} user
 */
Cypress.Commands.add('loginViaSession', (user) => {
  loginViaSession(user);
});
