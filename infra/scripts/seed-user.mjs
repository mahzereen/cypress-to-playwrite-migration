import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../..');

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(resolve(repoRoot, '.env'));

const apiUrl = process.env.CONDUIT_API_URL;
const email = process.env.TEST_USER_EMAIL;
const password = process.env.TEST_USER_PASSWORD;

if (!apiUrl || !email || !password) {
  console.error(
    'ERROR: CONDUIT_API_URL, TEST_USER_EMAIL, and TEST_USER_PASSWORD must be set (.env or environment).',
  );
  process.exit(1);
}

const username = process.env.TEST_USER_USERNAME ?? email.split('@')[0];

async function registerUser() {
  const response = await fetch(`${apiUrl.replace(/\/$/, '')}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: { username, email, password } }),
  });

  if (response.ok) {
    console.log(`Registered test user: ${email}`);
    return;
  }

  const body = await response.json().catch(() => ({}));
  const errors = body?.errors ?? {};
  const alreadyExists =
    response.status === 422 &&
    (JSON.stringify(errors).toLowerCase().includes('already') ||
      JSON.stringify(errors).toLowerCase().includes('taken'));

  if (alreadyExists) {
    console.log(`Test user already exists: ${email}`);
    return;
  }

  throw new Error(
    `Registration failed (${response.status}): ${JSON.stringify(body)}`,
  );
}

async function verifyLogin() {
  const response = await fetch(`${apiUrl.replace(/\/$/, '')}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: { email, password } }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      `Login verification failed (${response.status}): ${JSON.stringify(body)}`,
    );
  }

  console.log(`Login verified for: ${email}`);
}

await registerUser();
await verifyLogin();
