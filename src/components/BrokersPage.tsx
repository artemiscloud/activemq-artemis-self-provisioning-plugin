import { useEffect, useState } from 'react';
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
import {
  K8sResourceCommon,
  k8sListItems,
} from '@openshift-console/dynamic-plugin-sdk';
import { BrokerModel } from '../k8s';
import { Loading } from '../shared-components';
import { getFormattedDate } from '../utils';
import './BrokersPage.css';

type Status = 'Active' | 'Disabled';

type Broker = {
  name: string;
  status: Status;
  size: number;
  created: string;
};

type K8sResourceBroker = K8sResourceCommon & {
  spec: {
    deploymentPlan: {
      size: number;
    };
  };
};

const BrokersPage = () => {
  const [brokers, setBrokers] = useState<Broker[]>();
  const [loading, setLoading] = useState<boolean>(false);

  const columnNames = {
    name: 'Name',
    status: 'Status',
    size: 'Size',
    created: 'Created',
  };

  const OptionsList = {
    model: BrokerModel,
    queryParams: {},
    requestInit: {},
  };

  useEffect(() => {
    setLoading(true);
    k8sListItems<K8sResourceBroker>(OptionsList)
      .then((res) => {
        const brokers = res?.map((br) => ({
          name: br.metadata.name,
          status: 'Active' as Status,
          size: br?.spec?.deploymentPlan?.size,
          created: br.metadata.creationTimestamp,
        }));

        setBrokers(brokers);
      })
      .catch(() => {
        console.error('Brokers not found');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />;

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
                      <Link to={`brokers/${br.name}`}>
                        {br.name}
                      </Link>
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

export default BrokersPage;
