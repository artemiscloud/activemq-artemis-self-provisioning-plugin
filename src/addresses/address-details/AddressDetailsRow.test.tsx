import { render, screen } from '../../test-utils';
import { AddressDetailsRow } from './AddressDetailsRow';
import { ComponentAttribute } from '../../openapi/jolokia/requests';
import { Table, Tbody } from '@patternfly/react-table';

const mockAttribute: ComponentAttribute = {
  request: {
    mbean: 'org.example:type=ExampleMBean',
    attribute: 'Address',
    type: 'string',
  },
  value: {
    key: 'DLQ',
  },
  status: 200,
};

describe('AddressDetailsRow', () => {
  it('renders attribute and value correctly', () => {
    render(
      <Table aria-label="Address Details Table">
        <Tbody>
          <AddressDetailsRow attribute={mockAttribute} />
        </Tbody>
      </Table>,
    );
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(
      screen.getByText(JSON.stringify(mockAttribute.value)),
    ).toBeInTheDocument();
  });
});
