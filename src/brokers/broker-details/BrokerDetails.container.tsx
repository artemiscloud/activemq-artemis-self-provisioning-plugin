import { FC } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Tabs, Tab, TabTitleText, PageSection } from '@patternfly/react-core';
import { ConfigurationContainer, OverviewContainer } from './components';
import { useTranslation } from '../../i18n';

export type BrokerDetailsProps = RouteComponentProps<{
  ns?: string;
  name?: string;
}>;

const BrokerDetailsPage: FC<BrokerDetailsProps> = ({ match }) => {
  const { t } = useTranslation();
  const namespace = match.params.ns;
  const { name } = match.params;

  return (
    <PageSection>
      <Tabs defaultActiveKey={0}>
        <Tab eventKey={0} title={<TabTitleText>{t('overview')}</TabTitleText>}>
          <OverviewContainer namespace={namespace} name={name} />
        </Tab>
        <Tab
          eventKey={1}
          title={<TabTitleText>{t('configuration')}</TabTitleText>}
        >
          <ConfigurationContainer name={name} namespace={namespace} />
        </Tab>
        <Tab eventKey={2} title={<TabTitleText>{t('clients')}</TabTitleText>}>
          Clients
        </Tab>
        <Tab eventKey={3} title={<TabTitleText>{t('queues')}</TabTitleText>}>
          Queues
        </Tab>
        <Tab eventKey={4} title={<TabTitleText>{t('topics')}</TabTitleText>}>
          Topics
        </Tab>
      </Tabs>
    </PageSection>
  );
};

export default BrokerDetailsPage;
