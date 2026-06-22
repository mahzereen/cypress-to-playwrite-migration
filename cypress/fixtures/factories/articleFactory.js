/**
 * Unique per-run article payloads for isolated tests.
 * @module fixtures/factories/articleFactory
 */

function uniqueId() {
  return `${Date.now()}-${Cypress._.random(1000, 9999)}`;
}

/**
 * @param {Partial<{ title: string, description: string, body: string, tagList: string[] }>} [overrides]
 * @returns {{ title: string, description: string, body: string, tagList: string[] }}
 */
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
