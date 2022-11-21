import { FC } from 'react';
import {
  ListPageHeader,
  ListPageBody,
  VirtualizedTable,
  useListPageFilter,
  ListPageFilter,
  TableColumn,
  ListPageCreateLink,
} from '@openshift-console/dynamic-plugin-sdk';
import { BrokerRow, BrokerRowProps } from './BrokerRow';
import { K8sResourceCommon } from '../../../../utils';

const columns: TableColumn<K8sResourceCommon>[] = [
  {
    title: 'Name',
    id: 'name',
  },
  {
    title: 'Ready',
    id: 'ready',
  },
  {
    title: 'Conditions',
    id: 'conditions',
  },
  {
    title: 'Size',
    id: 'Size',
  },
  {
    title: 'Create',
    id: 'created',
  },
  {
    title: '',
    id: 'action',
  },
];

type BrokersTableProps = Pick<
  BrokerRowProps,
  'onDeleteBroker' | 'onEditBroker'
> & {
  data: K8sResourceCommon[];
  unfilteredData: K8sResourceCommon[];
  loaded: boolean;
  loadError: any;
};

const BrokersTable: FC<BrokersTableProps> = ({
  data,
  unfilteredData,
  loaded,
  loadError,
  onDeleteBroker,
  onEditBroker,
}) => {
  return (
    <VirtualizedTable<K8sResourceCommon>
      data={data}
      unfilteredData={unfilteredData}
      loaded={loaded}
      loadError={loadError}
      columns={columns}
      Row={({ obj, activeColumnIDs, rowData }) => (
        <BrokerRow
          obj={obj}
          rowData={rowData}
          activeColumnIDs={activeColumnIDs}
          columns={columns}
          onDeleteBroker={onDeleteBroker}
          onEditBroker={onEditBroker}
        />
      )}
    />
  );
};

export type BrokersListProps = Pick<
  BrokerRowProps,
  'onDeleteBroker' | 'onEditBroker'
> & {
  brokers: K8sResourceCommon[];
  loaded: boolean;
  loadError: any;
};

const BrokersList: FC<BrokersListProps> = ({
  brokers,
  loaded,
  loadError,
  onDeleteBroker,
  onEditBroker,
}) => {
  const [data, filteredData, onFilterChange] = useListPageFilter(brokers);

  return (
    <>
      <ListPageHeader title="Brokers">
        <ListPageCreateLink to={'add-broker'}>Create Broker</ListPageCreateLink>
      </ListPageHeader>
      <ListPageBody>
        <ListPageFilter
          data={data}
          loaded={loaded}
          onFilterChange={onFilterChange}
        />
        <BrokersTable
          data={filteredData}
          unfilteredData={data}
          loaded={loaded}
          loadError={loadError}
          onEditBroker={onEditBroker}
          onDeleteBroker={onDeleteBroker}
        />
      </ListPageBody>
    </>
  );
};

export { BrokersList };
