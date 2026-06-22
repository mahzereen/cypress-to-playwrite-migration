import { test as setup, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { getSeededUser } from './utils/config';
import { injectConduitAuth, loginAndAuthenticate } from './utils/auth';

const authDir = path.join(__dirname, '.auth');
const authFile = path.join(authDir, 'user.json');

setup('authenticate via API and persist storageState', async ({ page, request }) => {
  fs.mkdirSync(authDir, { recursive: true });

  const { email, password } = getSeededUser();
  const user = await loginAndAuthenticate(page, request, { email, password });

  await page.goto('/#/');
  await expect(page.getByRole('link', { name: 'New Article' })).toBeVisible();
  await expect(page.locator('.dropdown-toggle')).toContainText(user.username);

  await page.context().storageState({ path: authFile });
});
