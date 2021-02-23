import { h } from 'preact';
import { shallow } from 'enzyme';
import OAuthButton from './oauth-button';

jest.mock('common/settings', () => ({
  siteId: 'remark',
}));

jest.mock('react-intl', () => {
  const reactIntl = jest.requireActual('react-intl');
  const messages = require('locales/en.json');
  const intlProvider = new reactIntl.IntlProvider({ locale: 'en', messages }, {});

  return {
    ...reactIntl,
    useIntl: () => intlProvider.state.intl,
  };
});

describe('OAuth Button', () => {
  it('should have permanent class name', () => {
    const container = shallow(<OAuthButton variant="full" provider="google" onClick={() => null} />);

    expect(container.find('a').prop('className')).toContain('oauth-button');
    expect(container.find('i').prop('className')).toContain('oauth-button-icon');
  });

  it('should have rigth `href`', () => {
    const container = shallow(<OAuthButton variant="full" provider="google" onClick={() => null} />);

    expect(container.find('a').prop('href')).toBe(
      '/auth/google/login?from=http%3A%2F%2Flocalhost%2F%3FselfClose&site=remark'
    );
  });
});
