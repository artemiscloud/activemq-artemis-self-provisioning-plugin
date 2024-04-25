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
import { K8sResourceCommon } from '../../../utils';
import { PodRow } from './PodRow';

type PodsTableProps = {
  data: K8sResourceCommon[];
  unfilteredData: K8sResourceCommon[];
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
  const columns: TableColumn<K8sResourceCommon>[] = [
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
    <VirtualizedTable<K8sResourceCommon>
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
  brokerPods: K8sResourceCommon[];
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
