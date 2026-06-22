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
