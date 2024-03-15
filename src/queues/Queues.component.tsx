import { useTranslation } from '../i18n';
import {
  TableColumn,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';
import { Queue } from './Queues.container';
import { QueueRow } from './QueueRow';
import {
  Page,
  PageSection,
  PageSectionVariants,
  Title,
} from '@patternfly/react-core';

export type QueuesProps = {
  queueData: Queue[];
  isLoaded: boolean;
  loadError: boolean;
};

const Queues: React.FC<QueuesProps> = ({ queueData, isLoaded, loadError }) => {
  const { t } = useTranslation();

  const columns: TableColumn<Queue>[] = [
    {
      title: t('agent'),
      id: 'agent',
    },
    {
      title: t('agent_Type'),
      id: 'agentType',
    },
    {
      title: t('timestamp'),
      id: 'timestamp',
    },
    {
      title: t('streaming'),
      id: 'streaming',
    },
  ];
  return (
    <Page>
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel="h1">{t('queues')}</Title>
      </PageSection>
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
    </Page>
  );
};

export { Queues };
