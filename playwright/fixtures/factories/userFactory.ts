/**
 * Unique per-run user credentials for isolated tests.
 * @module fixtures/factories/userFactory
 */

function uniqueId(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`;
}

/**
 * @param overrides - Fields to override on the generated user
 */
export function buildUser(overrides: Record<string, string> = {}) {
  const id = uniqueId();
  return {
    username: `pwuser-${id}`,
    email: `pwuser-${id}@test.example.com`,
    password: `PwPass-${id}!`,
    ...overrides,
  };
}
