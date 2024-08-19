import { render, screen, waitForI18n } from '../../test-utils';
import { AddressDetailsPage } from './AddressDetails.container';
import { useParams } from 'react-router-dom-v5-compat';
import { JolokiaAuthentication } from '../../jolokia/components/JolokiaAuthentication';
import { useGetBrokerCR } from '../../k8s/customHooks';
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

jest.mock('./AddressDetails.component', () => ({
  AddressDetails: () => <div>Mocked AddressDetails</div>,
}));

jest.mock('./AddressDetailsBreadcrumb/AddressDetailsBreadcrumb', () => ({
  AddressDetailsBreadcrumb: () => <div>Mocked AddressDetailsBreadcrumb</div>,
}));

const mockUseParams = useParams as jest.Mock;
const mockUseGetBrokerCR = useGetBrokerCR as jest.Mock;
const mockUseK8sWatchResource = useK8sWatchResource as jest.Mock;

describe('AddressDetailsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({
      name: 'DLQ',
      ns: 'test-namespace',
      brokerName: 'test-1',
      podName: 'test-1-ss-0',
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

  it('should renders AddressDetailsPage without crashing', async () => {
    const comp = render(
      <JolokiaAuthentication brokerCR={{ spec: {} }} podOrdinal={0}>
        <AddressDetailsPage />
      </JolokiaAuthentication>,
    );
    await waitForI18n(comp);
    expect(screen.getByText('address DLQ')).toBeInTheDocument();
    expect(
      screen.getByText('Mocked AddressDetailsBreadcrumb'),
    ).toBeInTheDocument();
    expect(screen.getByText('Mocked AddressDetails')).toBeInTheDocument();
  });

  it('should render error state', async () => {
    const errorMessage = 'Error fetching broker';
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
      },
      isLoading: false,
      error: errorMessage,
    });

    const comp = render(
      <JolokiaAuthentication brokerCR={{ spec: {} }} podOrdinal={null}>
        <AddressDetailsPage />
      </JolokiaAuthentication>,
    );
    await waitForI18n(comp);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
