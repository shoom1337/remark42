import { defineMessages } from 'react-intl';

const messages = defineMessages({
  username: {
    id: 'auth.user-name',
    defaultMessage: 'Username',
  },
  symbolsRestriction: {
    id: 'auth.symbols-restriction',
    defaultMessage: 'Username must contain only letters, numbers, underscores or spaces',
  },
  userNotFound: {
    id: 'auth.user-not-found',
    defaultMessage: 'No user was found',
  },
  unexpectedError: {
    id: 'auth.unexpected-error',
    defaultMessage: 'Something went wrong. Please try again a bit later.',
  },
  loading: {
    id: 'auth.loading',
    defaultMessage: 'Loading...',
  },
  invalidEmail: {
    id: 'auth.invalid-email',
    defaultMessage: 'Address should be valid email address',
  },
  emailAddress: {
    id: 'auth.email-address',
    defaultMessage: 'Email Address',
  },
  buttonTitle: {
    id: 'auth.oauth-button',
    defaultMessage: 'Sign In with {provider}',
  },
  token: {
    id: 'token',
    defaultMessage: 'Token',
  },
  expiredToken: {
    id: 'token.expired',
    defaultMessage: 'Token is expired',
  },
  invalidToken: {
    id: 'token.invalid',
    defaultMessage: 'Token is invalid',
  },
});

export default messages;
