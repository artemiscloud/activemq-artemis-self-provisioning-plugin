import { MemoryRouter } from 'react-router-dom-v5-compat';
import {
  screen,
  fireEvent,
  render,
  waitForI18n,
  waitFor,
} from '../../../../test-utils';
import { BrokerPodsBreadcrumb } from './BrokerPodsBreadcrumb';
import { useNavigate } from 'react-router-dom-v5-compat';
import { k8sDelete } from '@openshift-console/dynamic-plugin-sdk';
import { AMQBrokerModel } from '../../../../k8s/models';

jest.mock('react-router-dom-v5-compat', () => ({
  ...jest.requireActual('react-router-dom-v5-compat'),
  useNavigate: jest.fn(),
}));

jest.mock('@openshift-console/dynamic-plugin-sdk', () => ({
  k8sDelete: jest.fn(),
}));

describe('BrokerPodsBreadcrumb', () => {
  const name = 'test-1';
  const namespace = 'test';
  const navigate = jest.fn();
  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(navigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component correctly', async () => {
    render(
      <MemoryRouter>
        <BrokerPodsBreadcrumb name={name} namespace={namespace} />
      </MemoryRouter>,
    );
  });

  it('should displays correct breadcrumb items', async () => {
    const comp = render(
      <MemoryRouter>
        <BrokerPodsBreadcrumb name={name} namespace={namespace} />
      </MemoryRouter>,
    );
    await waitForI18n(comp);
    expect(comp.getByText('brokers')).toBeInTheDocument();
    expect(comp.getByText(`broker ${name}`)).toBeInTheDocument();
  });

  it('should navigate back to BrokerList page when click on Brokers BreadcrumbItem', async () => {
    const comp = render(
      <MemoryRouter>
        <BrokerPodsBreadcrumb name={name} namespace={namespace} />
      </MemoryRouter>,
    );
    await waitForI18n(comp);

    fireEvent.click(screen.getByText('brokers'));
    expect(navigate).toHaveBeenCalledWith(`/k8s/ns/${namespace}/brokers`);
  });

  it('should redirect back to BrokerList page when namespace is all-namespaces', async () => {
    const name = 'test-1';
    const namespace: string = undefined;
    const comp = render(
      <MemoryRouter>
        <BrokerPodsBreadcrumb name={name} namespace={namespace} />
      </MemoryRouter>,
    );
    await waitForI18n(comp);

    const redirectPath = '/k8s/all-namespaces/brokers';
    expect(redirectPath).toBe('/k8s/all-namespaces/brokers');
  });

  it('should onToggle toggle the isOpen state', async () => {
    const comp = render(
      <MemoryRouter>
        <BrokerPodsBreadcrumb name={name} namespace={namespace} />
      </MemoryRouter>,
    );
    await waitForI18n(comp);

    const toggle = screen.getByTestId('broker-toggle-kebab');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('should open and close the delete broker modal', async () => {
    const comp = render(
      <MemoryRouter>
        <BrokerPodsBreadcrumb name={name} namespace={namespace} />
      </MemoryRouter>,
    );
    await waitForI18n(comp);

    fireEvent.click(screen.getByTestId('broker-toggle-kebab'));
    fireEvent.click(screen.getByText('delete_broker'));
    expect(screen.getByText('delete_modal_instance_title')).toBeInTheDocument();

    fireEvent.click(screen.getByText('cancel'));
    await waitFor(() =>
      expect(
        screen.queryByText('delete_modal_instance_title'),
      ).not.toBeInTheDocument(),
    );
  });

  it('should navigate back to UpdateBrokerPage when onclick on Edit Broker button with the current path as returnUrl', async () => {
    const comp = render(
      <MemoryRouter>
        <BrokerPodsBreadcrumb name={name} namespace={namespace} />
      </MemoryRouter>,
    );
    await waitForI18n(comp);
    fireEvent.click(screen.getByTestId('broker-toggle-kebab'));
    fireEvent.click(screen.getByText('edit_broker'));

    expect(navigate).toHaveBeenCalledWith(
      `/k8s/ns/${namespace}/edit-broker/${name}?returnUrl=${encodeURIComponent(
        window.location.pathname,
      )}`,
    );
  });

  it('should delete broker and navigate to the brokers list', async () => {
    (k8sDelete as jest.Mock).mockResolvedValue({});
    const comp = render(
      <MemoryRouter>
        <BrokerPodsBreadcrumb name={name} namespace={namespace} />
      </MemoryRouter>,
    );
    await waitForI18n(comp);

    fireEvent.click(screen.getByTestId('broker-toggle-kebab'));
    fireEvent.click(screen.getByText('delete_broker'));
    await waitFor(() => screen.getByText('delete'));
    fireEvent.click(screen.getByText('delete'));

    await waitFor(() => {
      expect(k8sDelete).toHaveBeenCalledWith({
        model: AMQBrokerModel,
        resource: { metadata: { name, namespace: namespace } },
      });
      expect(navigate).toHaveBeenCalledWith(`/k8s/ns/${namespace}/brokers`);
    });
  });
});
