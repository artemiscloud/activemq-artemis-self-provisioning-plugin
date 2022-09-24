import { Link } from 'react-router-dom';
import {
  TableComposable,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  TableVariant,
} from '@patternfly/react-table';
import {
  Divider,
  Level,
  LevelItem,
  Button,
  Page,
  PageSection,
} from '@patternfly/react-core';
import './BrokersPage.css';

type Status = 'Active' | 'Disabled';

type Broker = {
  name: string;
  status: Status;
  size: number;
  created: string;
};

const BrokersPage = () => {
  const brokers: Broker[] = [
    { name: 'build-infra', status: 'Active', size: 2, created: '4 hours ago' },
    {
      name: 'order-processing',
      status: 'Active',
      size: 3,
      created: '3 days ago',
    },
    {
      name: 'notifications',
      status: 'Disabled',
      size: 1,
      created: '2 hours ago',
    },
  ];

  const columnNames = {
    name: 'Name',
    status: 'Status',
    size: 'Size',
    created: 'Created',
  };

  return (
    <Page>
      <PageSection variant="light">
        <Level hasGutter>
          <LevelItem>Brokers</LevelItem>
          <LevelItem>
            <Button>Create broker</Button>
          </LevelItem>
        </Level>
        <TableComposable
          aria-label="Brokers table"
          variant={TableVariant.compact}
          borders={false}
        >
          <Thead>
            <Tr>
              <Th>{columnNames.name}</Th>
              <Th>{columnNames.status}</Th>
              <Th>{columnNames.size}</Th>
              <Th>{columnNames.created}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {brokers.map((br) => (
              <Tr key={br.name}>
                <Td dataLabel={columnNames.name}>
                  <Link to="/brokers">{br.name}</Link>
                </Td>
                <Td dataLabel={columnNames.status}>{br.status}</Td>
                <Td dataLabel={columnNames.size}>{br.size}</Td>
                <Td dataLabel={columnNames.created}>{br.created}</Td>
              </Tr>
            ))}
          </Tbody>
        </TableComposable>
        <Divider />
      </PageSection>
    </Page>
  );
};

export default BrokersPage;
