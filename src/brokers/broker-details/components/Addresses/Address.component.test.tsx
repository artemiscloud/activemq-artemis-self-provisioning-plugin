import { render, screen } from '@app/test-utils';
import { Addresses, AddressProps } from './Address.component';

jest.mock('@openshift-console/dynamic-plugin-sdk', () => ({
  VirtualizedTable: jest.fn(({ Row, data, columns }) => (
    <div>
      <div>VirtualizedTable</div>
      {data.map((item: any, index: number) => (
        <Row
          key={index}
          obj={item}
          activeColumnIDs={columns.map((col: any) => col.id)}
        />
      ))}
    </div>
  )),
}));

jest.mock('./AddressRow', () => ({
  AddressRow: jest.fn(() => <div>AddressRow Component</div>),
}));

describe('Addresses', () => {
  const mockAddressProps: AddressProps = {
    addressData: [
      {
        name: 'DLQ',
        broker: {
          name: 'test-1',
        },
      },
    ],
    isLoaded: true,
    loadError: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the PodsList component', () => {
    render(<Addresses {...mockAddressProps} />);
    expect(screen.getByText('Addresses')).toBeInTheDocument();
  });

  it('should render PodRow components within the VirtualizedTable', () => {
    render(<Addresses {...mockAddressProps} />);

    const addressRowElements = screen.getAllByText('AddressRow Component');
    expect(addressRowElements.length).toBe(mockAddressProps.addressData.length);
  });
});
