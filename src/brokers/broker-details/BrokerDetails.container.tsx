import { FC, useState, useEffect } from 'react';
import { k8sGet } from '@openshift-console/dynamic-plugin-sdk';
import { RouteComponentProps } from 'react-router-dom';
import {
  Tabs,
  Tab,
  TabTitleText,
  Title,
  PageSection,
  PageSectionVariants,
} from '@patternfly/react-core';
import { ConfigurationContainer } from './components/Configuration';
import { useTranslation } from '../../i18n';
import {
  ClientsContainer,
  QueuesContainer,
  TopicsContainer,
  OverviewContainer,
} from './components';
import { AMQBrokerModel, K8sResourceCommon } from '../../utils';
import { BrokerDetailsBreadcrumb } from '../../shared-components/BrokerDetailsBreadcrumb';

export type BrokerDetailsProps = RouteComponentProps<{
  ns?: string;
  name?: string;
}>;

const BrokerDetailsPage: FC<BrokerDetailsProps> = ({ match }) => {
  const { t } = useTranslation();
  const namespace = match.params.ns;
  const { name } = match.params;

  const [brokerDetails, setBrokerDetails] = useState<K8sResourceCommon>();
  const [loading, setLoading] = useState<boolean>(true);

  const k8sGetBroker = () => {
    setLoading(true);
    k8sGet({ model: AMQBrokerModel, name, ns: namespace })
      .then((broker: K8sResourceCommon) => {
        setBrokerDetails(broker);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    k8sGetBroker();
  }, []);

  return (
    <>
      <PageSection>
        <BrokerDetailsBreadcrumb name={name} namespace={namespace} />
        <Title headingLevel="h2">
          {t('broker')} {name}
        </Title>
      </PageSection>
      <PageSection
        variant={PageSectionVariants.light}
        padding={{ default: 'noPadding' }}
        className="pf-c-page__main-tabs"
      >
        <Tabs defaultActiveKey={0}>
          <Tab
            eventKey={0}
            title={<TabTitleText>{t('overview')}</TabTitleText>}
          >
            <OverviewContainer
              name={name}
              namespace={namespace}
              size={brokerDetails?.spec?.deploymentPlan?.size}
              loading={loading}
            />
          </Tab>
          <Tab
            eventKey={1}
            title={<TabTitleText>{t('configuration')}</TabTitleText>}
          >
            <ConfigurationContainer
              configurationSettings={brokerDetails}
              loading={loading}
            />
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
