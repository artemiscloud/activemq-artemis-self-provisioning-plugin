import { render, screen, waitForI18n } from '@app/test-utils';
import { BrokerDetailsPage } from './BrokerDetails.container';
import {
  useParams,
  useLocation,
  useNavigate,
} from 'react-router-dom-v5-compat';
import { useGetBrokerCR } from '@app/k8s/customHooks';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { JolokiaAuthentication } from '@app/jolokia/components/JolokiaAuthentication';

jest.mock('@openshift-console/dynamic-plugin-sdk', () => ({
  useK8sWatchResource: jest.fn(() => [[]]),
}));

jest.mock('react-router-dom-v5-compat', () => ({
  useParams: jest.fn(),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('../../k8s/customHooks', () => ({
  useGetBrokerCR: jest.fn(),
}));

jest.mock(
  './components/BrokerDetailsBreadcrumb/BrokerDetailsBreadcrumb',
  () => ({
    BrokerDetailsBreadcrumb: () => <div>Mocked BrokerDetailsBreadcrumb</div>,
  }),
);

jest.mock('./components/Overview/Overview.container', () => ({
  OverviewContainer: () => <div>OverviewContainer component</div>,
}));

jest.mock('./components/Clients/Clients.container', () => ({
  ClientsContainer: () => <div>ClientsContainer component</div>,
}));

jest.mock('./components/broker-pods/PodsList.container', () => ({
  PodsContainer: () => <div>PodsContainer component</div>,
}));

jest.mock('./components/yaml/Yaml.container', () => ({
  YamlContainer: () => <div>YamlContainer component</div>,
}));

describe('BrokerDetailsPage', () => {
  const mockUseParams = useParams as jest.Mock;
  const mockUseLocation = useLocation as jest.Mock;
  const mockUseNavigate = useNavigate as jest.Mock;
  const mockUseGetBrokerCR = useGetBrokerCR as jest.Mock;
  const mockUseK8sWatchResource = useK8sWatchResource as jest.Mock;
  beforeEach(() => {
    mockUseParams.mockReturnValue({
      ns: 'test-namespace',
      name: 'test-1',
    });

    mockUseLocation.mockReturnValue({
      search: '?tab=overview',
      pathname: '/some-path',
    });

    mockUseNavigate.mockReturnValue(jest.fn());

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the BrokerDetailsPage and its components without crashing', async () => {
    const comp = render(
      <JolokiaAuthentication brokerCR={{ spec: {} }} podOrdinal={0}>
        <BrokerDetailsPage />
      </JolokiaAuthentication>,
    );
    await waitForI18n(comp);
    expect(
      screen.getByText('Mocked BrokerDetailsBreadcrumb'),
    ).toBeInTheDocument();
    expect(screen.getByText('Broker test-1'));
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Clients')).toBeInTheDocument();
    expect(screen.getByText('Pods')).toBeInTheDocument();
    expect(screen.getByText('YAML')).toBeInTheDocument();
  });

  it('should render OverviewContainer by default', async () => {
    mockUseGetBrokerCR.mockReturnValue({
      brokerCr: { spec: {} },
      isLoading: false,
      error: null,
    });

    const comp = render(
      <JolokiaAuthentication brokerCR={{ spec: {} }} podOrdinal={0}>
        <BrokerDetailsPage />
      </JolokiaAuthentication>,
    );
    await waitForI18n(comp);

    expect(screen.getByText('OverviewContainer component')).toBeInTheDocument();
  });

  it('should render ClientsContainer when activeTab is clients', async () => {
    mockUseParams.mockReturnValue({
      ns: 'test-namespace',
      name: 'test-1',
      tab: 'clients',
    });
    mockUseGetBrokerCR.mockReturnValue({
      brokerCr: { spec: {} },
      isLoading: false,
      error: null,
    });

    const comp = render(
      <JolokiaAuthentication brokerCR={{ spec: {} }} podOrdinal={0}>
        <BrokerDetailsPage />
      </JolokiaAuthentication>,
    );
    await waitForI18n(comp);

    expect(screen.getByText('ClientsContainer component')).toBeInTheDocument();
  });

  it('should render PodsContainer when activeTab is pods', async () => {
    mockUseParams.mockReturnValue({
      ns: 'test-namespace',
      name: 'test-1',
      tab: 'pods',
    });
    mockUseGetBrokerCR.mockReturnValue({
      brokerCr: { spec: {} },
      isLoading: false,
      error: null,
    });

    const comp = render(
      <JolokiaAuthentication brokerCR={{ spec: {} }} podOrdinal={0}>
        <BrokerDetailsPage />
      </JolokiaAuthentication>,
    );
    await waitForI18n(comp);
    expect(screen.getByText('PodsContainer component')).toBeInTheDocument();
  });

  it('should render YamlContainer when activeTab is yaml', async () => {
    mockUseParams.mockReturnValue({
      ns: 'test-namespace',
      name: 'test-1',
      tab: 'yaml',
    });
    mockUseGetBrokerCR.mockReturnValue({
      brokerCr: { spec: {} },
      isLoading: false,
      error: null,
    });

    const comp = render(
      <JolokiaAuthentication brokerCR={{ spec: {} }} podOrdinal={0}>
        <BrokerDetailsPage />
      </JolokiaAuthentication>,
    );
    await waitForI18n(comp);
    expect(screen.getByText('YamlContainer component')).toBeInTheDocument();
  });

  it('should display an error message when useGetBrokerCR returns an error', async () => {
    mockUseGetBrokerCR.mockReturnValueOnce({
      brokerCr: null,
      isLoading: false,
      error: 'Failed to fetch broker details',
    });

    const comp = render(
      <JolokiaAuthentication brokerCR={{ spec: {} }} podOrdinal={0}>
        <BrokerDetailsPage />
      </JolokiaAuthentication>,
    );
    await waitForI18n(comp);

    expect(
      screen.getByText('Failed to fetch broker details'),
    ).toBeInTheDocument();
  });

  it('should call navigate when switching tabs', async () => {
    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    const comp = render(
      <JolokiaAuthentication brokerCR={{ spec: {} }} podOrdinal={0}>
        <BrokerDetailsPage />
      </JolokiaAuthentication>,
    );
    await waitForI18n(comp);
    const yamlTab = screen.getByText('YAML');
    yamlTab.click();

    expect(navigate).toHaveBeenCalledWith(
      '/k8s/ns/test-namespace/brokers/test-1/yaml',
    );
  });

  it('should render Jolokia components in development environment', async () => {
    process.env.NODE_ENV = 'development';

    const comp = render(
      <JolokiaAuthentication brokerCR={{ spec: {} }} podOrdinal={0}>
        <BrokerDetailsPage />
      </JolokiaAuthentication>,
    );
    await waitForI18n(comp);
    expect(screen.getByText('check-jolokia')).toBeInTheDocument();
    expect(screen.getByText('jolokia-details')).toBeInTheDocument();
  });
});
