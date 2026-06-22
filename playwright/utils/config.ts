export function getBaseUrl(): string {
  const baseUrl = process.env.BASE_URL || process.env.CONDUIT_BASE_URL;
  if (!baseUrl) {
    throw new Error('BASE_URL or CONDUIT_BASE_URL must be set — copy .env.example to .env');
  }
  return baseUrl.replace(/\/$/, '');
}

export function getApiUrl(): string {
  const apiUrl = process.env.CONDUIT_API_URL;
  if (!apiUrl) {
    throw new Error('CONDUIT_API_URL is not set — copy .env.example to .env');
  }
  return apiUrl.replace(/\/$/, '');
}

export function getSeededUser(): { email: string; password: string } {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;
  if (!email || !password) {
    throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in .env');
  }
  return { email, password };
}
