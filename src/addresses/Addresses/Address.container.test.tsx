import { render, screen, waitForI18n } from '@app/test-utils';
import { AddressContainer } from './Address.container';
import { useParams } from 'react-router-dom-v5-compat';
import { useGetBrokerCR } from '@app/k8s/customHooks';
import { JolokiaAuthentication } from '@app/jolokia/components/JolokiaAuthentication';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';

jest.mock('@openshift-console/dynamic-plugin-sdk', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('react-router-dom-v5-compat', () => ({
  useParams: jest.fn(),
}));

jest.mock('../../k8s/customHooks', () => ({
  useGetBrokerCR: jest.fn(),
}));

jest.mock('./Address.component', () => ({
  Addresses: jest.fn(() => <div>Addresses Component</div>),
}));

const mockUseParams = useParams as jest.Mock;
const mockUseGetBrokerCR = useGetBrokerCR as jest.Mock;
const mockUseK8sWatchResource = useK8sWatchResource as jest.Mock;

describe('AddressContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({
      ns: 'test-namespace',
      name: 'ex-aao-ss-0',
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

  it('should render the Addresses component with data when fetching is successful', async () => {
    const comp = render(
      <JolokiaAuthentication brokerCR={{ spec: {} }} podOrdinal={0}>
        <AddressContainer />
      </JolokiaAuthentication>,
    );
    await waitForI18n(comp);
    expect(screen.getByText('Addresses Component')).toBeInTheDocument();
  });
});