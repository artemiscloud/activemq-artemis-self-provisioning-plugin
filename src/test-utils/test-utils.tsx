import { FunctionComponent, Suspense, ReactElement } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  act,
  render,
  waitFor,
  RenderOptions,
  RenderResult,
} from '@testing-library/react';

const suspenseTestId = 'i18n-suspense';

const AllTheProviders: FunctionComponent = ({ children }) => {
  return (
    <Router>
      <Suspense fallback={<div data-testid={suspenseTestId}>loading</div>}>
        {children}
      </Suspense>
    </Router>
  );
};

const AllTheProvidersWithRoot: FunctionComponent = ({ children }) => (
  <AllTheProviders>
    <div id={'root'}>{children}</div>
  </AllTheProviders>
);

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

const renderDialog = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProvidersWithRoot, ...options });

async function waitForPopper() {
  await act(async () => {
    /* let popper do its updates */
  });
}

async function waitForI18n(r: RenderResult) {
  await waitFor(() => {
    expect(r.queryByTestId(suspenseTestId)).not.toBeInTheDocument();
  });
}

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render, renderDialog, waitForI18n, waitForPopper };
