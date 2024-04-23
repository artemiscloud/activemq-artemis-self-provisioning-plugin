import { FC, useState, useEffect } from 'react';
import {
  K8sResourceKind,
  k8sGet,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
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
import {
  AMQBrokerModel,
  JolokiaTestPanel,
  useJolokiaLogin,
  AuthContext,
  LoginState,
} from '../../utils';
import { BrokerDetailsBreadcrumb } from '../../shared-components/BrokerDetailsBreadcrumb';

const BrokerDetailsPage: FC = () => {
  const { t } = useTranslation();
  const { ns: namespace, name } = useParams<{ ns?: string; name?: string }>();
  const [brokerDetails, setBrokerDetails] = useState<K8sResourceKind>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [routes] = useK8sWatchResource<K8sResourceKind[]>({
    isList: true,
    groupVersionKind: {
      group: 'route.openshift.io',
      kind: 'Route',
      version: 'v1',
    },
    namespaced: true,
  });

  const k8sGetBroker = () => {
    setLoading(true);
    console.log('API-SERVER', 'try get broker resource', name, 'ns', namespace);
    k8sGet({ model: AMQBrokerModel, name, ns: namespace })
      .then((broker: K8sResourceKind) => {
        console.log('API-SERVER', '----going to set brokers', broker);
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

  const [token, loginState] = useJolokiaLogin(brokerDetails, routes);
  const [prevLoginState, setPrevLoginState] = useState<LoginState>(loginState);
  console.log('API-SERVER', ' token ', token);

  if (prevLoginState !== loginState) {
    if (loginState === 'ok') {
      // TODO maybe use the OpenShift console notification system to let the
      // user know that the login was a success?
      alert(
        'login successful ' + brokerDetails?.metadata?.name + ' token ' + token,
      );
    }
    // TODO maybe use the OpenShift console notification system to let the user
    // know that there was an issue with the jolokia login.
    if (loginState === 'fail') {
      alert('login failed');
    }
    setPrevLoginState(loginState);
  }

  return (
    <AuthContext.Provider value={token}>
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
            <QueuesContainer />
          </Tab>
          <Tab eventKey={4} title={<TabTitleText>{t('topics')}</TabTitleText>}>
            <TopicsContainer />
          </Tab>
          <Tab
            eventKey={5}
            title={<TabTitleText>{t('check-jolokia')}</TabTitleText>}
          >
            <JolokiaTestPanel />
          </Tab>
        </Tabs>
      </PageSection>
    </AuthContext.Provider>
  );
};

export default BrokerDetailsPage;
