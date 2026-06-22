/**
 * Unique per-run user credentials for isolated tests.
 * @module fixtures/factories/userFactory
 */

function uniqueId() {
  return `${Date.now()}-${Cypress._.random(1000, 9999)}`;
}

/**
 * @param {Record<string, string>} [overrides] - Fields to override on the generated user
 * @returns {{ username: string, email: string, password: string }}
 */
export function buildUser(overrides = {}) {
  const id = uniqueId();
  return {
    username: `cyuser-${id}`,
    email: `cyuser-${id}@test.example.com`,
    password: `CyPass-${id}!`,
    ...overrides,
  };
}
