const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

/** @type {import('cypress').CypressConfig} */
module.exports = {
  e2e: {
    baseUrl: process.env.BASE_URL || process.env.CONDUIT_BASE_URL || 'http://localhost:3000',
    specPattern: 'tests/**/*.cy.{js,ts}',
    supportFile: 'support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 720,
    retries: { runMode: 1, openMode: 0 },
    setupNodeEvents(on, config) {
      return config;
    },
  },
  env: {
    apiUrl: process.env.CONDUIT_API_URL || 'http://localhost:3001/api',
    testUserEmail: process.env.TEST_USER_EMAIL,
    testUserPassword: process.env.TEST_USER_PASSWORD,
  },
};
