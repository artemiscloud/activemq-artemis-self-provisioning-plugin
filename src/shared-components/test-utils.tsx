import { RenderResult, act, waitFor } from '@testing-library/react';
const suspenseTestId = 'i18n-suspense';

async function waitForI18n(r: RenderResult) {
  await waitFor(() => {
    expect(r.queryByTestId(suspenseTestId)).not.toBeInTheDocument();
  });
}

async function waitForPopper() {
  await act(async () => {
    /* let popper do its updates */
  });
}

// re-export everything
export * from '@testing-library/react';

// override render method
export { waitForI18n, waitForPopper };
