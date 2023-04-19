import { FC } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  Tabs,
  Tab,
  TabTitleText,
  Title,
  PageSection,
} from '@patternfly/react-core';
import { ConfigurationContainer } from './components/Configuration';
import { useTranslation } from '../../i18n';
import {
  ClientsContainer,
  QueuesContainer,
  TopicsContainer,
  OverviewContainer,
} from './components';
import { BrokerDetailsBreadcrumb } from '../../common/BrokerDetailsBreadcrumb';

export type BrokerDetailsProps = RouteComponentProps<{
  ns?: string;
  name?: string;
}>;

const BrokerDetailsPage: FC<BrokerDetailsProps> = ({ match }) => {
  const { t } = useTranslation();
  const namespace = match.params.ns;
  const { name } = match.params;

  return (
    <>
      <PageSection>
        <BrokerDetailsBreadcrumb name={name} namespace={namespace} />
        <Title headingLevel="h2">
          {t('broker')} {name}
        </Title>
      </PageSection>
      <PageSection>
        <Tabs defaultActiveKey={0}>
          <Tab
            eventKey={0}
            title={<TabTitleText>{t('overview')}</TabTitleText>}
          >
            <OverviewContainer name={name} namespace={namespace} />
          </Tab>
          <Tab
            eventKey={1}
            title={<TabTitleText>{t('configuration')}</TabTitleText>}
          >
            <ConfigurationContainer name={name} namespace={namespace} />
          </Tab>
          <Tab eventKey={2} title={<TabTitleText>{t('clients')}</TabTitleText>}>
            <ClientsContainer />
          </Tab>
          <Tab eventKey={3} title={<TabTitleText>{t('queues')}</TabTitleText>}>
            <QueuesContainer />
          </Tab>
          <Tab eventKey={4} title={<TabTitleText>{t('topics')}</TabTitleText>}>
            <TopicsContainer />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export default BrokerDetailsPage;
