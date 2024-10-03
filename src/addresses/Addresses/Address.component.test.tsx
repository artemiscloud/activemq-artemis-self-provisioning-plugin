import { render, screen } from '@app/test-utils';
import { Addresses } from './Address.component';

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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the Addresses component', () => {
    render(<Addresses isBrokerPod={true} />);
    expect(screen.getByText('Addresses')).toBeInTheDocument();
  });

  it('should render AddressRow component within the VirtualizedTable', () => {
    render(<Addresses isBrokerPod={true} />);
    expect(screen.getByText('AddressRow Component')).toBeInTheDocument();
  });
});
