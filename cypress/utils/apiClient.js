/**
 * Conduit REST API helpers using `cy.request()`.
 * @module utils/apiClient
 */
import { getApiUrl } from './config';

/**
 * @param {{ username: string, email: string, password: string }} user
 * @returns {Cypress.Chainable<Cypress.Response>} Response body includes `{ user: { token, ... } }`
 */
export function registerUserViaApi(user) {
  return cy.request({
    method: 'POST',
    url: `${getApiUrl()}/users`,
    body: { user },
    failOnStatusCode: true,
  });
}

/**
 * @param {{ email: string, password: string }} credentials
 * @returns {Cypress.Chainable<Cypress.Response>} Response body includes `{ user: { token, ... } }`
 */
export function loginUserViaApi({ email, password }) {
  return cy.request({
    method: 'POST',
    url: `${getApiUrl()}/users/login`,
    body: { user: { email, password } },
    failOnStatusCode: true,
  });
}

/**
 * @param {string} token - JWT from registered/logged-in user
 * @param {{ title: string, description: string, body: string, tagList?: string[] }} article
 * @returns {Cypress.Chainable<Cypress.Response>} Response body includes `{ article: { slug, ... } }`
 */
export function createArticleViaApi(token, article) {
  return cy.request({
    method: 'POST',
    url: `${getApiUrl()}/articles`,
    headers: { Authorization: `Token ${token}` },
    body: { article },
    failOnStatusCode: true,
  });
}

/**
 * @param {string} token - Author JWT
 * @param {string} slug - Article slug
 * @returns {Cypress.Chainable<Cypress.Response>} Does not fail on non-2xx (cleanup helper)
 */
export function deleteArticleViaApi(token, slug) {
  return cy.request({
    method: 'DELETE',
    url: `${getApiUrl()}/articles/${slug}`,
    headers: { Authorization: `Token ${token}` },
    failOnStatusCode: false,
  });
}
