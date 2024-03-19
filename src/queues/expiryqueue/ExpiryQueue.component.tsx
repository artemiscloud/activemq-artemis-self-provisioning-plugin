import { useTranslation } from '../../i18n';
import {
  TableColumn,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';
import { ExpiryQueue } from './ExpiryQueue.container';
import { ExpiryQueueRow } from './ExpiryQueueRow';
import {
  Page,
  PageSection,
  PageSectionVariants,
  Title,
} from '@patternfly/react-core';

export type ExpiryQueuesProps = {
  expiryQueueData: ExpiryQueue[];
  isLoaded: boolean;
  loadError: boolean;
};

const ExpiryQueues: React.FC<ExpiryQueuesProps> = ({
  expiryQueueData,
  isLoaded,
  loadError,
}) => {
  const { t } = useTranslation();

  const columns: TableColumn<ExpiryQueue>[] = [
    {
      title: t('attribute'),
      id: 'attribute',
    },
    {
      title: t('value'),
      id: 'value',
    },
  ];
  return (
    <Page>
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel="h1">{t('expiry_queue')}</Title>
      </PageSection>
      <VirtualizedTable<ExpiryQueue>
        data={expiryQueueData}
        unfilteredData={expiryQueueData}
        loaded={isLoaded}
        loadError={loadError}
        columns={columns}
        Row={({ obj, activeColumnIDs, rowData }) => (
          <ExpiryQueueRow
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

export { ExpiryQueues };
