import { FC } from 'react';
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
  PageSectionVariants,
} from '@patternfly/react-core';
import { getFormattedDate } from '../../utils';

export type Status = 'Active' | 'Disabled';

export type Broker = {
  name: string;
  status: Status;
  size: number;
  created: string;
};

export type BrokersProps = {
  brokers: Broker[];
};

const Brokers: FC<BrokersProps> = ({ brokers }) => {
  const columnNames = {
    name: 'Name',
    status: 'Status',
    size: 'Size',
    created: 'Created',
  };

  return (
    <Page>
      <PageSection variant={PageSectionVariants.light}>
        <Level hasGutter>
          <LevelItem>Brokers</LevelItem>
          <LevelItem>
            <Button>Create broker</Button>
          </LevelItem>
        </Level>
        {brokers?.length > 0 ? (
          <>
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
                {brokers?.map((br) => (
                  <Tr key={br.name}>
                    <Td dataLabel={columnNames.name}>
                      <Link to={`brokers/${br.name}`}>{br.name}</Link>
                    </Td>
                    <Td dataLabel={columnNames.status}>{br.status}</Td>
                    <Td dataLabel={columnNames.size}>{br.size}</Td>
                    <Td dataLabel={columnNames.created}>
                      {getFormattedDate(br.created, 'ago')}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </TableComposable>
            <Divider />
          </>
        ) : (
          <>Brokers not found</>
        )}
      </PageSection>
    </Page>
  );
};

export { Brokers };
