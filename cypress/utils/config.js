export function getApiUrl() {
  const apiUrl = Cypress.env('apiUrl');
  if (!apiUrl) {
    throw new Error('CONDUIT_API_URL is not set — copy .env.example to .env');
  }
  return apiUrl.replace(/\/$/, '');
}

export function getSeededUser() {
  const email = Cypress.env('testUserEmail');
  const password = Cypress.env('testUserPassword');
  if (!email || !password) {
    throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in .env');
  }
  return { email, password };
}
