function uniqueId() {
  return `${Date.now()}-${Cypress._.random(1000, 9999)}`;
}

export function buildArticle(overrides = {}) {
  const id = uniqueId();
  return {
    title: `Cypress Article ${id}`,
    description: `Description for article ${id}`,
    body: `Article body content ${id}`,
    tagList: ['cypress', 'testing'],
    ...overrides,
  };
}
