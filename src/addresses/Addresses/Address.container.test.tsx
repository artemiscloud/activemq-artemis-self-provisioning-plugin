import { render, screen } from '@app/test-utils';
import { AddressContainer } from './Address.container';
import { useJolokiaServiceGetAddresses } from '@app/openapi/jolokia/queries';
import { useParams } from 'react-router-dom-v5-compat';
import { JolokiaAuthentication } from '@app/jolokia/components/JolokiaAuthentication';
import { useGetBrokerCR } from '@app/k8s/customHooks';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';

jest.mock('@openshift-console/dynamic-plugin-sdk', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('react-router-dom-v5-compat', () => ({
  useParams: jest.fn(),
}));

jest.mock('@app/k8s/customHooks', () => ({
  useGetBrokerCR: jest.fn(),
}));

jest.mock('@app/openapi/jolokia/queries', () => ({
  useJolokiaServiceGetAddresses: jest.fn(),
}));

jest.mock('./Address.component', () => ({
  Addresses: jest.fn(() => <div>Addresses Component</div>),
}));

const mockUseParams = useParams as jest.Mock;
const mockUseGetBrokerCR = useGetBrokerCR as jest.Mock;
const mockUseK8sWatchResource = useK8sWatchResource as jest.Mock;
const mockUseJolokiaServiceGetAddresses =
  useJolokiaServiceGetAddresses as jest.Mock;

describe('AddressContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({
      ns: 'test-namespace',
      name: 'DLQ',
    });
    mockUseK8sWatchResource.mockReturnValue([[], true, null]);
    mockUseGetBrokerCR.mockReturnValue({
      brokerCr: {
        spec: {
          adminUser: 'admin',
          adminPassword: 'password',
          console: { expose: true },
          deploymentPlan: {
            requireLogin: true,
            size: 2,
          },
        },
        isLoading: false,
        error: '',
      },
    });
  });

  it('should renders the Addresses component with data when fetching is successful', () => {
    const mockAddresses = [
      { name: 'DLQ', broker: { name: 'test-1' } },
      { name: 'Expiry Queue', broker: { name: 'test-1' } },
    ];

    mockUseJolokiaServiceGetAddresses.mockReturnValue({
      data: mockAddresses,
      isSuccess: true,
    });

    render(
      <JolokiaAuthentication brokerCR={{ spec: {} }} podOrdinal={0}>
        <AddressContainer />
      </JolokiaAuthentication>,
    );
    expect(screen.getByText('Addresses Component')).toBeInTheDocument();
  });

  it('should does not render Addresses component when fetching fails', () => {
    mockUseJolokiaServiceGetAddresses.mockReturnValue({
      data: undefined,
      isSuccess: false,
    });
    render(
      <JolokiaAuthentication brokerCR={{ spec: {} }} podOrdinal={null}>
        <AddressContainer />
      </JolokiaAuthentication>,
    );
    expect(screen.queryByText('Addresses Component')).not.toBeInTheDocument();
  });
});
