import { Suspense, FC, ReactElement } from 'react';
import {
  RenderResult,
  act,
  waitFor,
  RenderOptions,
  render,
} from '@testing-library/react';
import I18nProvider from './i18n/i18nProvider';

const suspenseTestId = 'i18n-suspense';

const AllTheProviders: FC = ({ children }) => {
  return (
    <I18nProvider
      lng={'en'}
      resources={{
        en: {
          'plugin__activemq-artemis-self-provisioning-plugin': () =>
            import(
              '../locales/en/plugin__activemq-artemis-self-provisioning-plugin.json'
            ),
        },
      }}
      debug={false}
    >
      <Suspense fallback={<div data-testid={suspenseTestId}>loading</div>}>
        {children}
      </Suspense>
    </I18nProvider>
  );
};

const AllTheProvidersWithRoot: FC = ({ children }) => (
  <AllTheProviders>
    <div id={'root'}>{children}</div>
  </AllTheProviders>
);

// const customRender = (
//   ui: ReactElement,
//   options?: Omit<RenderOptions, "wrapper">
// ) => render(ui, { wrapper: AllTheProviders, ...options });

async function waitForI18n(r: RenderResult) {
  await waitFor(() => {
    expect(r.queryByTestId(suspenseTestId)).not.toBeInTheDocument();
  });
}

const renderDialog = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProvidersWithRoot, ...options });

async function waitForPopper() {
  await act(async () => {
    /* let popper do its updates */
  });
}

// re-export everything
export * from '@testing-library/react';

// override render method
export { render, renderDialog, waitForI18n, waitForPopper };
