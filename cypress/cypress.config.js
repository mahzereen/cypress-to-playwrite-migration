// TODO: Configure Cypress for RealWorld (Conduit) — baseUrl, env, retries, Allure reporter.
// See .cursor/rules/ for coding standards.

/** @type {import('cypress').CypressConfig} */
module.exports = {
  e2e: {
    baseUrl: process.env.CONDUIT_BASE_URL || 'http://localhost:3000',
    specPattern: 'tests/**/*.cy.{js,ts}',
    supportFile: false,
    // TODO: viewport, retries, video/screenshot on failure
    setupNodeEvents(on, config) {
      // TODO: Allure reporter plugin registration
      // TODO: task definitions for API helpers
      return config;
    },
  },
  env: {
    // TODO: API base URL, test user credentials (from env, never hardcoded)
    apiUrl: process.env.CONDUIT_API_URL || 'http://localhost:3000/api',
  },
};
