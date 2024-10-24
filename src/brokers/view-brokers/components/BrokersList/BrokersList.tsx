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
import { useTranslation } from '@app/i18n/i18n';
import { BrokerCR } from '@app/k8s/types';

type BrokersTableProps = Pick<
  BrokerRowProps,
  'onOpenModal' | 'onEditBroker'
> & {
  data: BrokerCR[];
  unfilteredData: BrokerCR[];
  loaded: boolean;
  loadError: any;
};

const BrokersTable: FC<BrokersTableProps> = ({
  data,
  unfilteredData,
  loaded,
  loadError,
  onOpenModal,
  onEditBroker,
}) => {
  const { t } = useTranslation();

  const columns: TableColumn<BrokerCR>[] = [
    {
      title: t('Name'),
      id: 'name',
    },
    {
      title: t('Ready'),
      id: 'ready',
    },
    {
      title: t('Conditions'),
      id: 'conditions',
    },
    {
      title: t('Size'),
      id: 'Size',
    },
    {
      title: t('Create'),
      id: 'created',
    },
    {
      title: '',
      id: 'action',
    },
  ];

  return (
    <VirtualizedTable<BrokerCR>
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
          onOpenModal={onOpenModal}
          onEditBroker={onEditBroker}
        />
      )}
    />
  );
};

export type BrokersListProps = Pick<
  BrokerRowProps,
  'onOpenModal' | 'onEditBroker'
> & {
  brokers: BrokerCR[];
  loaded: boolean;
  loadError: any;
  namespace: string;
};

const BrokersList: FC<BrokersListProps> = ({
  brokers,
  loaded,
  loadError,
  namespace,
  onOpenModal,
  onEditBroker,
}) => {
  const [data, filteredData, onFilterChange] = useListPageFilter(brokers);
  const { t } = useTranslation();

  return (
    <>
      <ListPageHeader title={t('Brokers')}>
        <ListPageCreateLink
          to={`/k8s/ns/${
            namespace || 'default'
          }/add-broker?returnUrl=${encodeURIComponent(location.pathname)}`}
        >
          {t('Create Broker')}
        </ListPageCreateLink>
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
          onOpenModal={onOpenModal}
        />
      </ListPageBody>
    </>
  );
};

export { BrokersList };
