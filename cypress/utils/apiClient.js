import { getApiUrl } from './config';

export function registerUserViaApi(user) {
  return cy.request({
    method: 'POST',
    url: `${getApiUrl()}/users`,
    body: { user },
    failOnStatusCode: true,
  });
}

export function loginUserViaApi({ email, password }) {
  return cy.request({
    method: 'POST',
    url: `${getApiUrl()}/users/login`,
    body: { user: { email, password } },
    failOnStatusCode: true,
  });
}

export function createArticleViaApi(token, article) {
  return cy.request({
    method: 'POST',
    url: `${getApiUrl()}/articles`,
    headers: { Authorization: `Token ${token}` },
    body: { article },
    failOnStatusCode: true,
  });
}

export function deleteArticleViaApi(token, slug) {
  return cy.request({
    method: 'DELETE',
    url: `${getApiUrl()}/articles/${slug}`,
    headers: { Authorization: `Token ${token}` },
    failOnStatusCode: false,
  });
}
