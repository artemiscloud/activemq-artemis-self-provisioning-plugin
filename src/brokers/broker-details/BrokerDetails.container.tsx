import { FC } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
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
} from './components';
import '@patternfly/patternfly/patternfly-addons.css';

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
        <Breadcrumb className="pf-u-mb-md">
          <BreadcrumbItem to="/k8s/all-namespaces/brokers">
            {t('brokers')}
          </BreadcrumbItem>
          <BreadcrumbItem to="/k8s/all-namespaces/brokers/:name" isActive>
            {t('broker_name')}
          </BreadcrumbItem>
        </Breadcrumb>
        <Title headingLevel="h2">{t('broker_name')}</Title>
      </PageSection>

      <Tabs defaultActiveKey={0}>
        <Tab eventKey={0} title={<TabTitleText>{t('overview')}</TabTitleText>}>
          Overview
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
    </>
  );
};

export default BrokerDetailsPage;
