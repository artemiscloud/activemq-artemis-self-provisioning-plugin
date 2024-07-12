import { FC, useState, useEffect } from 'react';
import {
  GreenCheckCircleIcon,
  K8sResourceKind,
  RedExclamationCircleIcon,
  k8sGet,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import {
  Tabs,
  Tab,
  TabTitleText,
  Title,
  PageSection,
  PageSectionVariants,
  Spinner,
  Alert,
  Modal,
  ModalVariant,
  Button,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { useTranslation } from '../../i18n';
import { AMQBrokerModel, BrokerCR } from '../../k8s';
import {
  AuthContext,
  useGetApiServerBaseUrl,
  useJolokiaLogin,
} from '../../jolokia/customHooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OpenAPI as OpenAPIConfig } from '../../openapi/jolokia/requests/core/OpenAPI';
import { ClientsContainer } from './components/Clients';
import { AddressContainer } from './components/Addresses/Address.container';
import { ConfigurationContainer } from './components/Configuration';
import { BrokerDetailsBreadcrumb } from './components/BrokerDetailsBreadcrumb';
import {
  JolokiaAcceptorDetails,
  JolokiaAddressDetails,
  JolokiaBrokerDetails,
  JolokiaQueueDetails,
  JolokiaTestPanel,
} from './components/JolokiaDevComponents';
import { OverviewContainer } from './components';
import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom-v5-compat';

export const BrokerDetailsPage: FC = () => {
  const { t } = useTranslation();
  const {
    ns: namespace,
    brokerName,
    podName,
  } = useParams<{
    ns?: string;
    brokerName?: string;
    podName?: string;
  }>();
  const [brokerDetails, setBrokerDetails] = useState<BrokerCR>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [routes] = useK8sWatchResource<K8sResourceKind[]>({
    isList: true,
    groupVersionKind: {
      group: 'route.openshift.io',
      kind: 'Route',
      version: 'v1',
    },
    namespaced: true,
  });

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const activeTabKey = searchParams.get('tab') || 'overview';

  const k8sGetBroker = () => {
    setLoading(true);
    k8sGet({ model: AMQBrokerModel, name: brokerName, ns: namespace })
      .then((broker: K8sResourceKind) => {
        setBrokerDetails(broker as BrokerCR);
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    k8sGetBroker();
  }, []);

  const handleModalToggle = () => {
    setIsErrorModalOpen(!isErrorModalOpen);
  };

  const handleTryAgain = () => {
    setIsErrorModalOpen(false);
    window.location.reload();
  };

  const handleTabSelect = (_event: any, eventKey: string | number) => {
    searchParams.set('tab', eventKey.toString());
    navigate({ search: searchParams.toString() });
  };

  const podOrdinal = parseInt(podName.replace(brokerName + '-ss-', ''));

  const { token, isSucces, isLoading, isError, source } = useJolokiaLogin(
    brokerDetails,
    routes,
    podOrdinal,
  );

  const [prevIsLoading, setPrevIsLoading] = useState(isLoading);
  const [notify, setNotify] = useState(false);
  if (prevIsLoading !== isLoading) {
    if (!isLoading && source === 'api') {
      setNotify(true);
    }
    setPrevIsLoading(isLoading);
  }
  if (notify) {
    if (isError) {
      setIsErrorModalOpen(true);
    }
    setNotify(false);
  }

  return (
    <AuthContext.Provider value={token}>
      <Modal
        variant={ModalVariant.small}
        title={t('login_failed')}
        titleIconVariant="danger"
        isOpen={isErrorModalOpen}
        onClose={handleModalToggle}
        actions={[
          <Button key="confirm" variant="primary" onClick={handleTryAgain}>
            {t('try_again')}
          </Button>,
          <Button key="cancel" variant="link" onClick={handleModalToggle}>
            {t('cancel')}
          </Button>,
        ]}
      >
        <TextContent>
          <Text component={TextVariants.h6}>{t('login_failed_message')}</Text>
        </TextContent>
      </Modal>
      <PageSection
        variant={PageSectionVariants.light}
        padding={{ default: 'noPadding' }}
        className="pf-c-page__main-tabs"
      >
        <div className="pf-u-mt-md pf-u-mb-md">
          <BrokerDetailsBreadcrumb
            name={brokerName}
            namespace={namespace}
            podName={podName}
          />
          <Title headingLevel="h2" className="pf-u-ml-md">
            {t('broker')} {brokerName} {t('/')} {podName}
          </Title>
        </div>
        {error && <Alert variant="danger" title={error} />}
        <Tabs activeKey={activeTabKey} onSelect={handleTabSelect}>
          <Tab
            eventKey={'overview'}
            title={<TabTitleText>{t('overview')}</TabTitleText>}
          >
            <OverviewContainer
              name={brokerName}
              namespace={namespace}
              cr={brokerDetails}
              loading={loading}
            />
          </Tab>
          <Tab
            eventKey={'configuration'}
            title={<TabTitleText>{t('configuration')}</TabTitleText>}
          >
            <ConfigurationContainer
              configurationSettings={brokerDetails}
              loading={loading}
            />
          </Tab>
          <Tab
            eventKey={'clients'}
            title={<TabTitleText>{t('clients')}</TabTitleText>}
          >
            <ClientsContainer />
          </Tab>
          <Tab
            eventKey={'addresses'}
            title={<TabTitleText>{t('addresses')}</TabTitleText>}
          >
            <AddressContainer />
          </Tab>
          {process.env.NODE_ENV === 'development' && (
            <Tab
              eventKey={'jolokiaTestPanel'}
              title={
                <TabTitleText>
                  {t('check-jolokia ')}

                  {isLoading && (
                    <Spinner size="sm" aria-label="connecting to jolokia" />
                  )}
                  {isSucces && (
                    <GreenCheckCircleIcon title="Jolokia connected" />
                  )}
                  {isError && (
                    <RedExclamationCircleIcon title="Jolokia connection failed" />
                  )}
                </TabTitleText>
              }
            >
              <JolokiaTestPanel />
              <br />
            </Tab>
          )}
          {process.env.NODE_ENV === 'development' && (
            <Tab
              eventKey={'jolokia-details'}
              title={
                <TabTitleText>
                  {t('-jolokia-details')}

                  {isLoading && (
                    <Spinner size="sm" aria-label="connecting to jolokia" />
                  )}
                  {isSucces && (
                    <GreenCheckCircleIcon title="Jolokia connected" />
                  )}
                  {isError && (
                    <RedExclamationCircleIcon title="Jolokia connection failed" />
                  )}
                </TabTitleText>
              }
            >
              <Tabs defaultActiveKey={0}>
                <Tab
                  eventKey={0}
                  title={<TabTitleText>{t('broker')}</TabTitleText>}
                >
                  <JolokiaBrokerDetails />
                </Tab>
                <Tab
                  eventKey={1}
                  title={<TabTitleText>{t('addresses')}</TabTitleText>}
                >
                  <JolokiaAddressDetails />
                </Tab>
                <Tab
                  eventKey={2}
                  title={<TabTitleText>{t('acceptors')}</TabTitleText>}
                >
                  <JolokiaAcceptorDetails />
                </Tab>
                <Tab
                  eventKey={3}
                  title={<TabTitleText>{t('queues')}</TabTitleText>}
                >
                  <JolokiaQueueDetails />
                </Tab>
              </Tabs>
            </Tab>
          )}
        </Tabs>
      </PageSection>
    </AuthContext.Provider>
  );
};

export const App: FC = () => {
  OpenAPIConfig.BASE = useGetApiServerBaseUrl();
  const querClient = new QueryClient();
  return (
    <QueryClientProvider client={querClient}>
      <BrokerDetailsPage />
    </QueryClientProvider>
  );
};
