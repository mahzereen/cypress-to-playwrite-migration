/**
 * Conduit authentication via `cy.session()` and localStorage JWT injection.
 * Mirrors Conduit frontend: `localStorage.loggedUser` with `Token` header.
 * @module utils/auth
 */
import { getApiUrl } from './config';

/**
 * @param {{ token: string, [key: string]: unknown }} user - API user payload
 * @returns {{ headers: { Authorization: string }, isAuth: boolean, loggedUser: object }}
 */
function buildLoggedInState(user) {
  return {
    headers: { Authorization: `Token ${user.token}` },
    isAuth: true,
    loggedUser: user,
  };
}

/**
 * Caches authenticated browser state per email. Setup calls API login once per session key.
 * @param {{ email: string, password: string, username?: string }} user
 * @sideeffects Writes `loggedUser` to localStorage; visits `/#/` on cache miss
 */
export function loginViaSession(user) {
  const { email, password } = user;
  const apiUrl = getApiUrl();

  cy.session(
    `conduit-${email}`,
    () => {
      cy.request({
        method: 'POST',
        url: `${apiUrl}/users/login`,
        body: { user: { email, password } },
        failOnStatusCode: true,
      }).then(({ body }) => {
        const loggedIn = buildLoggedInState(body.user);
        cy.visit('/#/', {
          onBeforeLoad(win) {
            win.localStorage.setItem('loggedUser', JSON.stringify(loggedIn));
          },
        });
        cy.contains('a.nav-link', 'New Article').should('be.visible');
      });
    },
    {
      validate() {
        cy.window().then((win) => {
          const stored = win.localStorage.getItem('loggedUser');
          expect(stored, 'auth session in localStorage').to.not.be.null;
          const parsed = JSON.parse(stored);
          expect(parsed.isAuth).to.eq(true);
        });
      },
    },
  );
}

/**
 * Injects JWT without `cy.session()` — for one-off navigation with a known user payload.
 * @param {string} path - Hash route (e.g. `/article/my-slug`)
 * @param {{ token: string, [key: string]: unknown }} user
 * @sideeffects Sets localStorage and navigates to `/#${path}`
 */
export function injectAuthAndVisit(path, user) {
  const loggedIn = buildLoggedInState(user);
  const hashPath = path.startsWith('/') ? path : `/${path}`;
  cy.visit(`/#${hashPath}`, {
    onBeforeLoad(win) {
      win.localStorage.setItem('loggedUser', JSON.stringify(loggedIn));
    },
  });
}
