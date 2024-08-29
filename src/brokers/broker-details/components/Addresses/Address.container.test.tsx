import { render, screen } from '../../../../test-utils';
import { AddressContainer } from './Address.container';
import { useJolokiaServiceGetAddresses } from '../../../../openapi/jolokia/queries';

jest.mock('../../../../openapi/jolokia/queries', () => ({
  useJolokiaServiceGetAddresses: jest.fn(),
}));

jest.mock('./Address.component', () => ({
  Addresses: jest.fn(() => <div>Addresses Component</div>),
}));

describe('AddressContainer', () => {
  const mockUseJolokiaServiceGetAddresses =
    useJolokiaServiceGetAddresses as jest.Mock;

  it('should renders the Addresses component with data when fetching is successful', () => {
    const mockAddresses = [
      { name: 'DLQ', broker: { name: 'test-1' } },
      { name: 'Expiry Queue', broker: { name: 'test-1' } },
    ];

    mockUseJolokiaServiceGetAddresses.mockReturnValue({
      data: mockAddresses,
      isSuccess: true,
    });

    render(<AddressContainer />);
    expect(screen.getByText('Addresses Component')).toBeInTheDocument();
  });

  it('should does not render Addresses component when fetching fails', () => {
    mockUseJolokiaServiceGetAddresses.mockReturnValue({
      data: undefined,
      isSuccess: false,
    });
    render(<AddressContainer />);
    expect(screen.queryByText('Addresses Component')).not.toBeInTheDocument();
  });
});
