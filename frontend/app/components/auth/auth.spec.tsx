import { h, ComponentType } from 'preact';
import { fireEvent, render, waitFor } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
}));

jest.mock('common/settings', () => ({
  siteId: 'remark',
}));

jest.mock('./auth.api', () => ({
  emailSignin: jest.fn(),
  anonymousSignin: jest.fn(),
  verifyEmailSignin: jest.fn(),
  oauthSigninInitializer: jest.requireActual('./auth.api').oauthSigninInitializer,
}));

import { Provider } from 'common/types';
import { StaticStore } from 'common/static-store';
import enMessages from 'locales/en.json';

import Auth from './auth';
import { emailSignin } from './auth.api';

function renderComponent<P = {}>(Component: ComponentType<P>, props: P) {
  return render(
    <IntlProvider locale="en" messages={enMessages}>
      <Component {...props} />
    </IntlProvider>
  );
}

describe('<Auth/>', () => {
  let defaultProviders = StaticStore.config.auth_providers;

  afterAll(() => {
    StaticStore.config.auth_providers = defaultProviders;
  });

  it('should render auth with hidden dropdown', () => {
    const { container } = renderComponent(Auth, {});

    expect(container.querySelector('.auth-dropdown')).toBeNull();
  });

  it.each([
    [[]],
    [['dev']],
    [['facebook', 'google']],
    [['facebook', 'google', 'microsoft']],
    [['facebook', 'google', 'microsoft', 'yandex']],
    [['facebook', 'google', 'microsoft', 'yandex', 'twitter']],
  ] as [Provider[]][])('should renders with %j providers', (providers) => {
    StaticStore.config.auth_providers = providers;

    const { container } = renderComponent(Auth, {});

    expect(container.querySelector('.auth-dropdown')).toBeNull();

    fireEvent.click(container.querySelector('.auth-button') as Element);
    expect(container.querySelector('.auth-dropdown')).toBeTruthy();
    expect(container.querySelectorAll('.oauth-button')).toHaveLength(providers.length);
    expect(container.querySelector('[name="username"]')).toBeFalsy();
    expect(container.querySelector('.auth-submit')).toBeFalsy();
  });

  it('should render email provider', () => {
    StaticStore.config.auth_providers = ['email'];

    const { container } = renderComponent(Auth, {});

    fireEvent.click(container.querySelector('.auth-button') as Element);
    expect(container.querySelector('.auth-dropdown')).toBeTruthy();
    expect(container.querySelector('.auth-form-title')?.innerHTML).toContain('email');
    expect(container.querySelector('[name="username"]')).toBeTruthy();
    expect(container.querySelector('[name="email"]')).toBeTruthy();
    expect(container.querySelector('.auth-submit')).toBeTruthy();
  });

  it('should render anonymous provider', () => {
    StaticStore.config.auth_providers = ['anonymous'];

    const { container } = renderComponent(Auth, {});

    fireEvent.click(container.querySelector('.auth-button') as Element);
    expect(container.querySelector('.auth-dropdown')).toBeTruthy();
    expect(container.querySelector('.auth-form-title')?.innerHTML).toContain('anonymous');
    expect(container.querySelector('[name="username"]')).toBeTruthy();
    expect(container.querySelector('.auth-submit')).toBeTruthy();
  });

  it('should render tabs with two form providers', () => {
    StaticStore.config.auth_providers = ['email', 'anonymous'];

    const { container } = renderComponent(Auth, {});

    fireEvent.click(container.querySelector('.auth-button') as Element);
    expect(container.querySelector('.auth-dropdown')).toBeTruthy();
    expect(container.querySelector('[for="form-provider-anonymous"]')).toBeTruthy();
    expect(container.querySelector('[for="form-provider-email"]')).toBeTruthy();
    expect(container.querySelector('[name="username"]')).toBeTruthy();
    expect(container.querySelector('.auth-submit')).toBeTruthy();

    fireEvent.click(container.querySelector('[for="form-provider-email"]') as HTMLElement);
    expect(container.querySelector('[name="username"]')).toBeTruthy();
    expect(container.querySelector('[name="email"]')).toBeTruthy();
    expect(container.querySelector('.auth-submit')).toBeTruthy();
  });

  it('should open new window tab by click on oauth provider', () => {
    StaticStore.config.auth_providers = ['facebook'];
    const { container } = renderComponent(Auth, {});

    window.open = jest.fn();

    fireEvent.click(container.querySelector('.auth-button') as Element);
    fireEvent.click(container.querySelector('.oauth-button') as Element);

    expect(window.open).toHaveBeenCalledWith(
      `http://localhost/auth/facebook/login?from=http%3A%2F%2Flocalhost%2F%3FselfClose&site=remark`
    );
  });

  it('should send email form', async () => {
    expect.assertions(5);
    StaticStore.config.auth_providers = ['email'];
    const { container } = renderComponent(Auth, {});

    fireEvent.click(container.querySelector('.auth-button') as Element);

    userEvent.paste(container.querySelector('[name="username"]') as HTMLElement, 'username');
    userEvent.paste(container.querySelector('[name="email"]') as HTMLElement, 'email@email.com');
    fireEvent.click(container.querySelector('.auth-submit') as HTMLElement);

    expect(container.querySelector('.auth-submit .spinner')).toBeTruthy();

    await waitFor(() => expect(emailSignin).toHaveBeenCalledTimes(1));

    expect(container.querySelector('.backButton')).toBeTruthy();
    expect(container.querySelector('.closeButton')).toBeTruthy();
    expect(container.querySelector('[name="token"]')).toBeTruthy();

    userEvent.paste(container.querySelector('[name="token"]') as HTMLElement, 'token');
    fireEvent.click(container.querySelector('.auth-submit') as HTMLElement);

    // TODO: Finish test email auth
    // await waitFor(() => {
    //   console.log(1);
    //   expect(verifyEmailSignin).toHaveBeenCalledTimes(1);
    // });
  });
});
