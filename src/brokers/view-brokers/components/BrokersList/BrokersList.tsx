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
import { useTranslation } from '../../../../i18n';
import { BrokerCR } from '../../../../utils';

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
      title: t('name'),
      id: 'name',
    },
    {
      title: t('ready'),
      id: 'ready',
    },
    {
      title: t('conditions'),
      id: 'conditions',
    },
    {
      title: t('size'),
      id: 'Size',
    },
    {
      title: t('create'),
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
      <ListPageHeader title={t('brokers')}>
        <ListPageCreateLink to={`/k8s/ns/${namespace || 'default'}/add-broker`}>
          {t('create_broker')}
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
