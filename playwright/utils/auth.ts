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

export function buildLoggedInState(user: ConduitLoggedUser) {
  return {
    headers: { Authorization: `Token ${user.token}` },
    isAuth: true,
    loggedUser: user,
  };
}

export async function injectConduitAuth(page: Page, user: ConduitLoggedUser): Promise<void> {
  const loggedIn = buildLoggedInState(user);
  await page.addInitScript((state) => {
    localStorage.setItem('loggedUser', state);
  }, JSON.stringify(loggedIn));
}

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
