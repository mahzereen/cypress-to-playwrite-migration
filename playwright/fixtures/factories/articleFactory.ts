function uniqueId(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`;
}

export function buildArticle(overrides: Partial<{
  title: string;
  description: string;
  body: string;
  tagList: string[];
}> = {}) {
  const id = uniqueId();
  return {
    title: `Playwright Article ${id}`,
    description: `Description for article ${id}`,
    body: `Article body content ${id}`,
    tagList: ['playwright', 'testing'],
    ...overrides,
  };
}
