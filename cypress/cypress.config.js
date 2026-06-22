const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const allureWriter = require('@shelex/cypress-allure-plugin/writer');

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} must be set — copy .env.example to .env`);
  }
  return value;
}

const baseUrl = process.env.BASE_URL || process.env.CONDUIT_BASE_URL || requiredEnv('BASE_URL');
const apiUrl = requiredEnv('CONDUIT_API_URL');

/** @type {import('cypress').CypressConfig} */
module.exports = {
  e2e: {
    baseUrl,
    specPattern: 'tests/**/*.cy.{js,ts}',
    supportFile: 'support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 720,
    retries: { runMode: 1, openMode: 0 },
    setupNodeEvents(on, config) {
      allureWriter(on, config);
      return config;
    },
  },
  env: {
    apiUrl,
    testUserEmail: process.env.TEST_USER_EMAIL,
    testUserPassword: process.env.TEST_USER_PASSWORD,
    allure: true,
    allureResultsPath: 'reports/allure-results',
  },
};
