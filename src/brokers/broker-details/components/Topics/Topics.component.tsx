import { useTranslation } from '../../../../i18n';
import {
  TableColumn,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';
import { Topic } from './Topics.container';
import { TopicsRow } from './TopicsRow';
import { Title } from '@patternfly/react-core';

export type TopicsProps = {
  topicData: Topic[];
  isLoaded: boolean;
  loadError: boolean;
};

const Topics: React.FC<TopicsProps> = ({ topicData, isLoaded, loadError }) => {
  const { t } = useTranslation();

  const columns: TableColumn<Topic>[] = [
    {
      title: t('name'),
      id: 'name',
    },
    {
      title: t('created'),
      id: 'created',
    },
  ];
  return (
    <>
      <div className="pf-u-mt-md pf-u-ml-md pf-u-mb-sm">
        <Title headingLevel="h1">{t('topics')}</Title>
      </div>
      <VirtualizedTable<Topic>
        data={topicData}
        unfilteredData={topicData}
        loaded={isLoaded}
        loadError={loadError}
        columns={columns}
        Row={({ obj, activeColumnIDs, rowData }) => (
          <TopicsRow
            obj={obj}
            rowData={rowData}
            activeColumnIDs={activeColumnIDs}
            columns={columns}
          />
        )}
      />
    </>
  );
};

export { Topics };
