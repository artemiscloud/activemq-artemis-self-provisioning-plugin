import { screen, fireEvent, render, waitForI18n } from '../../test-utils';
import { BrokerDetailsBreadcrumb } from './BrokerDetailsBreadcrumb';
import { MemoryRouter } from 'react-router-dom-v5-compat';

describe('BrokerDetailsBreadcrumb', () => {
  const name = 'test-1';
  const namespace = 'test';

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
    expect(comp.getByText('brokers')).toBeInTheDocument();
    expect(comp.getByText(`broker ${name}`)).toBeInTheDocument();
  });

  it('should set correct redirectPath when namespace is undefined', async () => {
    const name = 'test-1';
    const namespace: string = undefined;
    const comp = render(
      <MemoryRouter>
        <BrokerDetailsBreadcrumb name={name} namespace={namespace} />
      </MemoryRouter>,
    );
    await waitForI18n(comp);

    const redirectPath = comp.getByText('brokers');
    expect(redirectPath.getAttribute('href')).toBe(
      '/k8s/all-namespaces/brokers',
    );
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
});
