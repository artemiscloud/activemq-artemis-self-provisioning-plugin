import { MemoryRouter, useNavigate } from 'react-router-dom-v5-compat';
import {
  screen,
  fireEvent,
  render,
  waitForI18n,
  waitFor,
} from '@app/test-utils';
import { BrokerDetailsBreadcrumb } from './BrokerDetailsBreadcrumb';
import { k8sDelete } from '@openshift-console/dynamic-plugin-sdk';
import { AMQBrokerModel } from '@app/k8s/models';

jest.mock('react-router-dom-v5-compat', () => ({
  ...jest.requireActual('react-router-dom-v5-compat'),
  useNavigate: jest.fn(),
}));

jest.mock('@openshift-console/dynamic-plugin-sdk', () => ({
  k8sDelete: jest.fn(),
}));

describe('BrokerDetailsBreadcrumb', () => {
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
        <BrokerDetailsBreadcrumb name={name} namespace={namespace} />
      </MemoryRouter>,
    );
  });

  it('should displays correct breadcrumb items', async () => {
    const comp = render(
      <MemoryRouter>
        <BrokerDetailsBreadcrumb name={name} namespace={namespace} />
      </MemoryRouter>,
    );
    await waitForI18n(comp);
    expect(comp.getByText('Brokers')).toBeInTheDocument();
    expect(comp.getByText(`Broker ${name}`)).toBeInTheDocument();
  });

  it('should navigate back to BrokerList page when click on Brokers BreadcrumbItem', async () => {
    const comp = render(
      <MemoryRouter>
        <BrokerDetailsBreadcrumb name={name} namespace={namespace} />
      </MemoryRouter>,
    );
    await waitForI18n(comp);

    fireEvent.click(screen.getByText('Brokers'));
    expect(navigate).toHaveBeenCalledWith(`/k8s/ns/${namespace}/brokers`);
  });

  it('should redirect back to BrokerList page when namespace is all-namespaces', async () => {
    const namespace = 'all-namespaces';
    const comp = render(
      <MemoryRouter>
        <BrokerDetailsBreadcrumb name={name} namespace={namespace} />
      </MemoryRouter>,
    );
    await waitForI18n(comp);

    const redirectPath = '/k8s/all-namespaces/brokers';
    expect(redirectPath).toBe('/k8s/all-namespaces/brokers');
  });

  it('should onToggle toggle the isOpen state', async () => {
    const comp = render(
      <MemoryRouter>
        <BrokerDetailsBreadcrumb name={name} namespace={namespace} />
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
        <BrokerDetailsBreadcrumb name={name} namespace={namespace} />
      </MemoryRouter>,
    );
    await waitForI18n(comp);

    fireEvent.click(screen.getByTestId('broker-toggle-kebab'));
    fireEvent.click(screen.getByText('Delete Broker'));
    expect(screen.getByText('Delete instance ?')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() =>
      expect(screen.queryByText('Delete instance ?')).not.toBeInTheDocument(),
    );
  });

  it('should navigate back to UpdateBrokerPage when onclick on Edit Broker button with the current path as returnUrl', async () => {
    const comp = render(
      <MemoryRouter>
        <BrokerDetailsBreadcrumb name={name} namespace={namespace} />
      </MemoryRouter>,
    );
    await waitForI18n(comp);
    fireEvent.click(screen.getByTestId('broker-toggle-kebab'));
    fireEvent.click(screen.getByText('Edit Broker'));

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
        <BrokerDetailsBreadcrumb name={name} namespace={namespace} />
      </MemoryRouter>,
    );
    await waitForI18n(comp);

    fireEvent.click(screen.getByTestId('broker-toggle-kebab'));
    fireEvent.click(screen.getByText('Delete Broker'));
    await waitFor(() => screen.getByText('Delete'));
    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(k8sDelete).toHaveBeenCalledWith({
        model: AMQBrokerModel,
        resource: { metadata: { name, namespace: namespace } },
      });
      expect(navigate).toHaveBeenCalledWith(`/k8s/ns/${namespace}/brokers`);
    });
  });
});
