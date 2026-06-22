function uniqueId() {
  return `${Date.now()}-${Cypress._.random(1000, 9999)}`;
}

export function buildUser(overrides = {}) {
  const id = uniqueId();
  return {
    username: `cyuser-${id}`,
    email: `cyuser-${id}@test.example.com`,
    password: `CyPass-${id}!`,
    ...overrides,
  };
}
