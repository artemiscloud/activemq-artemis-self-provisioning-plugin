import { render, screen } from '@app/test-utils';
import { AddressRow, AddressRowProps } from './AddressRow';
import { TableColumn } from '@openshift-console/dynamic-plugin-sdk';
import { useJolokiaServiceReadAddressAttributes } from '@app/openapi/jolokia/queries';
import { MemoryRouter } from 'react-router-dom-v5-compat';

jest.mock('@openshift-console/dynamic-plugin-sdk', () => ({
  TableData: ({
    id,
    activeColumnIDs,
    children,
  }: {
    id: string;
    activeColumnIDs: Set<string>;
    children: React.ReactNode;
  }) => (
    <td
      data-testid={id}
      data-active={activeColumnIDs.has(id) ? 'true' : 'false'}
    >
      {children}
    </td>
  ),
}));

jest.mock('../../../../openapi/jolokia/queries', () => ({
  useJolokiaServiceReadAddressAttributes: jest.fn(),
}));

const mockColumns: TableColumn<any>[] = [
  { id: 'name', title: 'Name' },
  { id: 'routing_type', title: 'Routing Type' },
];

const mockAddresses = [
  { name: 'activemq.notifications' },
  { name: 'DLQ' },
] as any;

const Props: AddressRowProps = {
  obj: mockAddresses,
  rowData: {},
  activeColumnIDs: new Set(mockColumns.map((column) => column.id)),
  columns: mockColumns,
};

const mockUseJolokiaServiceReadAddressAttributes =
  useJolokiaServiceReadAddressAttributes as jest.Mock;

describe('AddressRow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should displays "loading" when data is not yet loaded', () => {
    mockUseJolokiaServiceReadAddressAttributes.mockReturnValue({
      data: null,
      isSuccess: false,
    });

    render(
      <MemoryRouter>
        <table>
          <tbody>
            <tr>
              <AddressRow {...Props} />
            </tr>
          </tbody>
        </table>
      </MemoryRouter>,
    );
    expect(screen.getByText('loading')).toBeInTheDocument();
  });

  it('should renders multiple address names and corresponding routing types correctly', () => {
    const routingTypesMock = {
      'activemq.notifications': [{ value: 'MULTICAST' }],
      DLQ: [{ value: 'ANYCAST' }],
    } as any;

    mockAddresses.forEach((address: any) => {
      mockUseJolokiaServiceReadAddressAttributes.mockReturnValue({
        data: routingTypesMock[address.name],
        isSuccess: true,
      });

      const Props: AddressRowProps = {
        obj: address,
        rowData: {},
        activeColumnIDs: new Set(mockColumns.map((column) => column.id)),
        columns: mockColumns,
      };

      render(
        <MemoryRouter>
          <table>
            <tbody>
              <tr>
                <AddressRow {...Props} />
              </tr>
            </tbody>
          </table>
        </MemoryRouter>,
      );
      expect(screen.getByText(address.name)).toBeInTheDocument();

      routingTypesMock[address.name].forEach((type: any) => {
        expect(screen.getByText(type.value)).toBeInTheDocument();
      });
    });
  });
});
