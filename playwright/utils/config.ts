/**
 * Environment accessors for Playwright. Values come from root `.env` via `playwright.config.ts`.
 * @module utils/config
 */

/**
 * @returns Conduit UI base URL without trailing slash
 * @throws Error when `BASE_URL` and `CONDUIT_BASE_URL` are both unset
 */
export function getBaseUrl(): string {
  const baseUrl = process.env.BASE_URL || process.env.CONDUIT_BASE_URL;
  if (!baseUrl) {
    throw new Error('BASE_URL or CONDUIT_BASE_URL must be set — copy .env.example to .env');
  }
  return baseUrl.replace(/\/$/, '');
}

/**
 * @returns Conduit API base URL without trailing slash
 * @throws Error when `CONDUIT_API_URL` is unset
 */
export function getApiUrl(): string {
  const apiUrl = process.env.CONDUIT_API_URL;
  if (!apiUrl) {
    throw new Error('CONDUIT_API_URL is not set — copy .env.example to .env');
  }
  return apiUrl.replace(/\/$/, '');
}

/**
 * Seeded user from `app:seed` / `.env` — used by `auth.setup.ts`, not per-test factories.
 * @throws Error when `TEST_USER_EMAIL` or `TEST_USER_PASSWORD` is missing
 */
export function getSeededUser(): { email: string; password: string } {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;
  if (!email || !password) {
    throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in .env');
  }
  return { email, password };
}
