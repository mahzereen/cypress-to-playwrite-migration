/**
 * Environment accessors for Cypress. Values come from root `.env` via `cypress.config.js`.
 * @module utils/config
 */

/**
 * @returns {string} Conduit API base URL without trailing slash
 * @throws {Error} When `CONDUIT_API_URL` is not set in Cypress env
 */
export function getApiUrl() {
  const apiUrl = Cypress.env('apiUrl');
  if (!apiUrl) {
    throw new Error('CONDUIT_API_URL is not set — copy .env.example to .env');
  }
  return apiUrl.replace(/\/$/, '');
}

/**
 * Seeded user from `app:seed` / `.env` — used by setup flows, not per-test factories.
 * @returns {{ email: string, password: string }}
 * @throws {Error} When `TEST_USER_EMAIL` or `TEST_USER_PASSWORD` is missing
 */
export function getSeededUser() {
  const email = Cypress.env('testUserEmail');
  const password = Cypress.env('testUserPassword');
  if (!email || !password) {
    throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in .env');
  }
  return { email, password };
}
