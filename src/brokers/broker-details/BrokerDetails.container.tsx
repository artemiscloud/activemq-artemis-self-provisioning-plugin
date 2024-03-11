import { FC, useState, useEffect } from 'react';
import { k8sGet } from '@openshift-console/dynamic-plugin-sdk';
import { useParams } from 'react-router-dom';
import {
  Tabs,
  Tab,
  TabTitleText,
  Title,
  PageSection,
  PageSectionVariants,
} from '@patternfly/react-core';
import { useTranslation } from '../../i18n';
import {
  ClientsContainer,
  ConfigurationContainer,
  QueuesContainer,
  TopicsContainer,
  OverviewContainer,
} from './components';
import { AMQBrokerModel, K8sResourceCommon } from '../../utils';
import { BrokerDetailsBreadcrumb } from '../../shared-components/BrokerDetailsBreadcrumb';

const BrokerDetailsPage: FC = () => {
  const { t } = useTranslation();
  const { ns: namespace, name } = useParams<{ ns?: string; name?: string }>();

  const [brokerDetails, setBrokerDetails] = useState<K8sResourceCommon | null>(
    null,
  );
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
      <PageSection
        variant={PageSectionVariants.light}
        padding={{ default: 'noPadding' }}
        className="pf-c-page__main-tabs"
      >
        <div className="pf-u-mt-md pf-u-ml-md pf-u-mb-md">
          <BrokerDetailsBreadcrumb name={name} namespace={namespace} />
          <Title headingLevel="h2">
            {t('broker')} {name}
          </Title>
        </div>
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
            {brokerDetails !== null && (
              <QueuesContainer brokerDetails={brokerDetails} />
            )}
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
