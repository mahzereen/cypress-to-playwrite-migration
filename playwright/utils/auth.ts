/**
 * Conduit authentication via localStorage JWT injection.
 * Mirrors Conduit frontend: `localStorage.loggedUser` with `Token` header.
 * @module utils/auth
 */
import type { APIRequestContext, Page } from '@playwright/test';
import { loginUserViaApi, registerUserViaApi, type ConduitUser } from './apiClient';
import { buildUser } from '../fixtures/factories/userFactory';

export type ConduitLoggedUser = {
  token: string;
  email: string;
  username: string;
  bio?: string | null;
  image?: string | null;
};

/**
 * Builds the object Conduit stores in `localStorage.loggedUser`.
 */
export function buildLoggedInState(user: ConduitLoggedUser) {
  return {
    headers: { Authorization: `Token ${user.token}` },
    isAuth: true,
    loggedUser: user,
  };
}

/**
 * Injects auth before navigation so the first page load sees a logged-in user.
 * @sideeffects Sets `loggedUser` in localStorage via `addInitScript`
 */
export async function injectConduitAuth(page: Page, user: ConduitLoggedUser): Promise<void> {
  const loggedIn = buildLoggedInState(user);
  await page.addInitScript((state) => {
    localStorage.setItem('loggedUser', state);
  }, JSON.stringify(loggedIn));
}

/**
 * Registers via API, injects auth, and returns the combined user payload.
 * Default credentials come from `buildUser()` when `user` is omitted.
 */
export async function registerAndAuthenticate(
  page: Page,
  request: APIRequestContext,
  user: ConduitUser = buildUser(),
): Promise<ConduitLoggedUser & ConduitUser> {
  const response = await registerUserViaApi(request, user);
  const body = await response.json();
  const registered = body.user as ConduitLoggedUser;
  await injectConduitAuth(page, registered);
  return { ...user, ...registered };
}

/**
 * Logs in via API, injects auth, and returns the logged-in user payload.
 */
export async function loginAndAuthenticate(
  page: Page,
  request: APIRequestContext,
  credentials: { email: string; password: string },
): Promise<ConduitLoggedUser> {
  const response = await loginUserViaApi(request, credentials);
  const body = await response.json();
  const loggedUser = body.user as ConduitLoggedUser;
  await injectConduitAuth(page, loggedUser);
  return loggedUser;
}
