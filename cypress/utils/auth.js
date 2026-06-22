import { getApiUrl } from './config';

function buildLoggedInState(user) {
  return {
    headers: { Authorization: `Token ${user.token}` },
    isAuth: true,
    loggedUser: user,
  };
}

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

export function injectAuthAndVisit(path, user) {
  const loggedIn = buildLoggedInState(user);
  const hashPath = path.startsWith('/') ? path : `/${path}`;
  cy.visit(`/#${hashPath}`, {
    onBeforeLoad(win) {
      win.localStorage.setItem('loggedUser', JSON.stringify(loggedIn));
    },
  });
}
