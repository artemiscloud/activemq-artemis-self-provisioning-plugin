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
import { K8sResourceCommon } from '../../../../utils';

type BrokersTableProps = Pick<
  BrokerRowProps,
  'handleModalToggle' | 'onEditBroker'
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
  handleModalToggle,
  onEditBroker,
}) => {
  const { t } = useTranslation();

  const columns: TableColumn<K8sResourceCommon>[] = [
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
          handleModalToggle={handleModalToggle}
          onEditBroker={onEditBroker}
        />
      )}
    />
  );
};

export type BrokersListProps = Pick<
  BrokerRowProps,
  'handleModalToggle' | 'onEditBroker'
> & {
  brokers: K8sResourceCommon[];
  loaded: boolean;
  loadError: any;
};

const BrokersList: FC<BrokersListProps> = ({
  brokers,
  loaded,
  loadError,
  handleModalToggle,
  onEditBroker,
}) => {
  const [data, filteredData, onFilterChange] = useListPageFilter(brokers);
  const { t } = useTranslation();

  return (
    <>
      <ListPageHeader title={t('brokers')}>
        <ListPageCreateLink to={'add-broker'}>
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
          handleModalToggle={handleModalToggle}
        />
      </ListPageBody>
    </>
  );
};

export { BrokersList };
