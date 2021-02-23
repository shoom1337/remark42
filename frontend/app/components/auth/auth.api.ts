import type { User } from 'common/types';

import { authFetcher } from 'common/fetcher';
import { getUser } from 'common/api';
import { siteId } from 'common/settings';

const EMAIL_SIGNIN_ENDPOINT = '/email/login';

export function anonymousSignin(user: string): Promise<User> {
  return authFetcher.get<User>('/anonymous/login', { user, aud: siteId });
}

/**
 * First step of two of `email` authorization
 */
export function emailSignin(email: string, username: string): Promise<unknown> {
  return authFetcher.get(EMAIL_SIGNIN_ENDPOINT, { address: email, user: username });
}

/**
 * Second step of two of `email` authorization
 */
export function verifyEmailSignin(token: string): Promise<User> {
  return authFetcher.get(EMAIL_SIGNIN_ENDPOINT, { token });
}

/**
 * Performs await of auth from oauth providers
 */
export function oauthSigninInitializer() {
  let subscribed = false;
  let timeout: NodeJS.Timeout;
  let authWindow: Window | null = null;

  /**
   * Set waiting state and tries to revalidate `user` when oauth tab is closed
   */
  return function oauthSignin(url: string): Promise<User | null> {
    authWindow = window.open(url);

    if (subscribed) {
      return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
      function unsubscribe() {
        document.removeEventListener('visibilitychange', handleWindowVisibilityChange);
        window.removeEventListener('focus', handleWindowVisibilityChange);
        subscribed = false;
        clearTimeout(timeout);
      }

      async function handleWindowVisibilityChange() {
        if (!document.hasFocus() || document.hidden || !authWindow?.closed) {
          return;
        }

        const user = await getUser();

        clearTimeout(timeout);

        if (user === null) {
          // Retry after 1 min if current attempt unsuccessful
          timeout = setTimeout(() => {
            handleWindowVisibilityChange();
          }, 60 * 1000);

          return null;
        }

        resolve(user);
        unsubscribe();
      }

      setTimeout(() => {
        reject();
      }, 5 * 60 * 1000);

      document.addEventListener('visibilitychange', handleWindowVisibilityChange);
      window.addEventListener('focus', handleWindowVisibilityChange);
    });
  };
}

export function logout(): Promise<void> {
  return authFetcher.get('/logout');
}
