/**
 * Conduit REST API helpers using Playwright `APIRequestContext`.
 * @module utils/apiClient
 */
import type { APIRequestContext, APIResponse } from '@playwright/test';
import { getApiUrl } from './config';

export type ConduitUser = {
  username: string;
  email: string;
  password: string;
};

export type ArticlePayload = {
  title: string;
  description: string;
  body: string;
  tagList: string[];
};

/**
 * @param request - Playwright API request context
 * @param user - Unique credentials from `buildUser()`
 * @returns API response; body contains `{ user: { token, ... } }`
 * @throws Error when response is not OK
 */
export async function registerUserViaApi(
  request: APIRequestContext,
  user: ConduitUser,
): Promise<APIResponse> {
  const response = await request.post(`${getApiUrl()}/users`, {
    data: { user },
  });
  if (!response.ok()) {
    throw new Error(`Registration failed (${response.status()}): ${await response.text()}`);
  }
  return response;
}

/**
 * @param request - Playwright API request context
 * @param credentials - Email and password
 * @returns API response; body contains `{ user: { token, ... } }`
 * @throws Error when response is not OK
 */
export async function loginUserViaApi(
  request: APIRequestContext,
  credentials: { email: string; password: string },
): Promise<APIResponse> {
  const response = await request.post(`${getApiUrl()}/users/login`, {
    data: { user: credentials },
  });
  if (!response.ok()) {
    throw new Error(`Login failed (${response.status()}): ${await response.text()}`);
  }
  return response;
}

/**
 * @param request - Playwright API request context
 * @param token - JWT from registered/logged-in user
 * @param article - Article payload
 * @returns API response; body contains `{ article: { slug, ... } }`
 * @throws Error when response is not OK
 */
export async function createArticleViaApi(
  request: APIRequestContext,
  token: string,
  article: ArticlePayload,
): Promise<APIResponse> {
  const response = await request.post(`${getApiUrl()}/articles`, {
    headers: { Authorization: `Token ${token}` },
    data: { article },
  });
  if (!response.ok()) {
    throw new Error(`Create article failed (${response.status()}): ${await response.text()}`);
  }
  return response;
}
