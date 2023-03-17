import { useTranslation } from '../../../../i18n';
import {
  TableColumn,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';
import { Queue } from './Queues.container';
import { QueueRow } from './QueueRow';

export type QueuesProps = {
  queueData: Queue[];
  isLoaded: boolean;
  loadError: boolean;
};

const Queues: React.FC<QueuesProps> = ({ queueData, isLoaded, loadError }) => {
  const { t } = useTranslation();

  const columns: TableColumn<Queue>[] = [
    {
      title: t('Name'),
      id: 'name',
    },
    {
      title: t('Routing type'),
      id: 'routing_type',
    },
    {
      title: t('Auto-create queues'),
      id: 'auto_create_queues',
    },
    {
      title: t('Auto-delete queues'),
      id: 'auto_delete_queues',
    },
    {
      title: t('Created'),
      id: 'created',
    },
  ];
  return (
    <VirtualizedTable<Queue>
      data={queueData}
      unfilteredData={queueData}
      loaded={isLoaded}
      loadError={loadError}
      columns={columns}
      Row={({ obj, activeColumnIDs, rowData }) => (
        <QueueRow
          obj={obj}
          rowData={rowData}
          activeColumnIDs={activeColumnIDs}
          columns={columns}
        />
      )}
    />
  );
};

export { Queues };
