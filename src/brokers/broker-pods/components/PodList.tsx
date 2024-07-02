import { FC } from 'react';
import {
  ListPageHeader,
  ListPageBody,
  VirtualizedTable,
  useListPageFilter,
  ListPageFilter,
  TableColumn,
} from '@openshift-console/dynamic-plugin-sdk';
import { useTranslation } from '../../../i18n';
import { BrokerCR } from '../../../utils';
import { PodRow } from './PodRow';

type PodsTableProps = {
  data: BrokerCR[];
  unfilteredData: BrokerCR[];
  loaded: boolean;
  loadError: any;
  brokerName: string;
};

const PodsTable: FC<PodsTableProps> = ({
  data,
  unfilteredData,
  loaded,
  loadError,
  brokerName,
}) => {
  const columns: TableColumn<BrokerCR>[] = [
    {
      title: 'Name',
      id: 'name',
    },
    {
      title: 'Status',
      id: 'status',
    },
    {
      title: 'Ready',
      id: 'ready',
    },
    {
      title: 'Restarts',
      id: 'restarts',
    },
    {
      title: 'Created',
      id: 'created',
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
        <PodRow
          obj={obj}
          rowData={rowData}
          activeColumnIDs={activeColumnIDs}
          columns={columns}
          brokerName={brokerName}
        />
      )}
    />
  );
};

export type PodsListProps = {
  brokerPods: BrokerCR[];
  loaded: boolean;
  loadError: any;
  brokerName: string;
};

const PodsList: FC<PodsListProps> = ({
  brokerPods,
  loaded,
  loadError,
  brokerName,
}) => {
  const { t } = useTranslation();
  const [data, filteredData, onFilterChange] = useListPageFilter(brokerPods);

  return (
    <>
      <ListPageHeader title={t('pods')} />
      <ListPageBody>
        <ListPageFilter
          data={data}
          loaded={loaded}
          onFilterChange={onFilterChange}
        />
        <PodsTable
          data={filteredData}
          unfilteredData={data}
          loaded={loaded}
          loadError={loadError}
          brokerName={brokerName}
        />
      </ListPageBody>
    </>
  );
};

export { PodsList };
