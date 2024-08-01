import { render, screen, waitForI18n } from '../../test-utils';
import { AddressDetailsPage } from './AddressDetails.container';
import { useParams } from 'react-router-dom-v5-compat';
import {
  useK8sWatchResource,
  k8sGet,
} from '@openshift-console/dynamic-plugin-sdk';
import { useJolokiaLogin } from '../../jolokia/customHooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('react-router-dom-v5-compat', () => ({
  useParams: jest.fn(),
}));

jest.mock('@openshift-console/dynamic-plugin-sdk', () => ({
  useK8sWatchResource: jest.fn(),
  k8sGet: jest.fn(),
}));

jest.mock('../../jolokia/customHooks', () => ({
  useJolokiaLogin: jest.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('AddressDetailsPage', () => {
  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({
      name: 'DLQ',
      ns: 'test-namespace',
      brokerName: 'test-1',
      podName: 'test-1-ss-0',
    });
    (useK8sWatchResource as jest.Mock).mockReturnValue([[], true, null]);
    (useJolokiaLogin as jest.Mock).mockReturnValue({
      token: 'test-token',
      isError: false,
      isLoading: false,
      source: 'api',
    });
    (k8sGet as jest.Mock).mockResolvedValue({
      data: {
        /* mock broker details */
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should renders AddressDetailsPage without crashing', async () => {
    const name = 'DLQ';
    const comp = render(
      <QueryClientProvider client={queryClient}>
        <AddressDetailsPage />
      </QueryClientProvider>,
    );
    await waitForI18n(comp);
    expect(screen.getByText(`address ${name}`)).toBeInTheDocument();
  });
});
