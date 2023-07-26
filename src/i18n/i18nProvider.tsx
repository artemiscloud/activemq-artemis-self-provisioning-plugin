import { ResourceLanguage, createInstance } from 'i18next';
import { FunctionComponent } from 'react';
import { I18nextProvider } from 'react-i18next';

export type I18nProviderProps = {
  lng: string;
  resources: {
    [language: string]: {
      [namespace: string]: () => Promise<ResourceLanguage>;
    };
  };
  debug?: boolean;
};

const I18nProvider: FunctionComponent<I18nProviderProps> = ({
  lng,
  resources,
  debug,
  children,
}) => {
  const instance = createInstance({ lng, resources, debug });

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
};

export default I18nProvider;
