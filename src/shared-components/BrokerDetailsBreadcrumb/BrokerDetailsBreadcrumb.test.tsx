import { screen, fireEvent, render, waitForI18n } from '../../test-utils';
import { BrokerDetailsBreadcrumb } from './BrokerDetailsBreadcrumb';
import { MemoryRouter } from 'react-router-dom-v5-compat';

describe('BrokerDetailsBreadcrumb', () => {
  const name = 'test-1';
  const namespace = 'test';
  const podName = 'test-1-ss-0';

  it('should render the component correctly', async () => {
    render(
      <MemoryRouter>
        <BrokerDetailsBreadcrumb
          name={name}
          namespace={namespace}
          podName={podName}
        />
      </MemoryRouter>,
    );
  });

  it('should displays correct breadcrumb items', async () => {
    const comp = render(
      <MemoryRouter>
        <BrokerDetailsBreadcrumb
          name={name}
          namespace={namespace}
          podName={podName}
        />
      </MemoryRouter>,
    );
    await waitForI18n(comp);
    expect(comp.getByText('brokers')).toBeInTheDocument();
    expect(comp.getByText(`broker ${name}`)).toBeInTheDocument();
    expect(comp.getByText(`${podName}`)).toBeInTheDocument();
  });

  it('should redirect back to BrokerList page when namespace is all-namespaces', async () => {
    const name = 'test-1';
    const namespace = 'all-namespaces';
    const podName = 'test-1-ss-0';
    const comp = render(
      <MemoryRouter>
        <BrokerDetailsBreadcrumb
          name={name}
          namespace={namespace}
          podName={podName}
        />
      </MemoryRouter>,
    );
    await waitForI18n(comp);

    const redirectPath = '/k8s/all-namespaces/brokers';
    expect(redirectPath).toBe('/k8s/all-namespaces/brokers');
  });

  it('should onToggle toggle the isOpen state', async () => {
    const comp = render(
      <MemoryRouter>
        <BrokerDetailsBreadcrumb
          name={name}
          namespace={namespace}
          podName={podName}
        />
      </MemoryRouter>,
    );
    await waitForI18n(comp);

    const toggle = screen.getByTestId('broker-toggle-kebab');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });
});
