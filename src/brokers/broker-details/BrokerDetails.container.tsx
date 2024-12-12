import { FC, useContext } from 'react';
import {
  Tabs,
  Tab,
  TabTitleText,
  Title,
  Spinner,
  Alert,
} from '@patternfly/react-core';
import { useTranslation } from '@app/i18n/i18n';
import { ClientsContainer } from './components/Clients/Clients.container';
import { BrokerDetailsBreadcrumb } from './components/BrokerDetailsBreadcrumb/BrokerDetailsBreadcrumb';
import {
  JolokiaAcceptorDetails,
  JolokiaAddressDetails,
  JolokiaBrokerDetails,
  JolokiaQueueDetails,
  JolokiaTestPanel,
} from './components/JolokiaDevComponents';
import { OverviewContainer } from './components/Overview/Overview.container';
import { PodsContainer } from './components/broker-pods/PodsList.container';
import { useParams } from 'react-router-dom-v5-compat';
import { JolokiaAuthentication } from '@app/jolokia/components/JolokiaAuthentication';
import { useGetBrokerCR } from '@app/k8s/customHooks';
import { AuthContext } from '@app/jolokia/context';
import { BrokerCR } from '@app/k8s/types';
import {
  GreenCheckCircleIcon,
  RedExclamationCircleIcon,
  HorizontalNav,
} from '@openshift-console/dynamic-plugin-sdk';
import { YamlContainer } from './components/yaml/Yaml.container';

type AuthenticatedPageContentPropType = {
  brokerCr: BrokerCR;
  name: string;
  namespace: string;
  loading: boolean;
  error: string;
};
const AuthenticatedPageContent: FC<AuthenticatedPageContentPropType> = ({
  brokerCr,
  name,
  namespace,
  loading: loadingBrokerCr,
  error: errorBrokerCr,
}) => {
  const { t } = useTranslation();

  const {
    isSuccess: isSuccessToken,
    isLoading: isLoadingToken,
    isError: isErrorToken,
  } = useContext(AuthContext);

  const pages = [
    {
      href: '',
      name: t('Overview'),
      component: () =>
        !loadingBrokerCr ? (
          <OverviewContainer
            name={name}
            namespace={namespace}
            cr={brokerCr}
            loading={loadingBrokerCr}
          />
        ) : (
          <Spinner size="md" />
        ),
    },
    {
      href: '/clients',
      name: t('Clients'),
      component: ClientsContainer,
    },
    {
      href: '/pods',
      name: t('Pods'),
      component: PodsContainer,
    },
    {
      href: '/yaml',
      name: t('YAML'),
      component: () =>
        !loadingBrokerCr ? (
          <YamlContainer brokerCr={brokerCr} />
        ) : (
          <Spinner size="md" />
        ),
    },
  ];

  if (process.env.NODE_ENV === 'development') {
    pages.push(
      {
        href: `/jolokiaTestPanel`,
        name: t('check-jolokia'),
        component: () => (
          <Tab
            eventKey={'jolokiaTestPanel'}
            title={
              <TabTitleText>
                {t('check-jolokia ')}
                {isLoadingToken && (
                  <Spinner size="sm" aria-label={t('connecting to jolokia')} />
                )}
                {isSuccessToken && (
                  <GreenCheckCircleIcon title={t('Jolokia connected')} />
                )}
                {isErrorToken && (
                  <RedExclamationCircleIcon
                    title={t('Jolokia connection failed')}
                  />
                )}
              </TabTitleText>
            }
          >
            <JolokiaTestPanel />
            <br />
          </Tab>
        ),
      },
      {
        href: `/jolokia-details`,
        name: t('jolokia-details'),
        component: () => (
          <Tab
            eventKey={'jolokia-details'}
            title={
              <TabTitleText>
                {t('jolokia-details')}
                {isLoadingToken && (
                  <Spinner size="sm" aria-label={t('connecting to jolokia')} />
                )}
                {isSuccessToken && (
                  <GreenCheckCircleIcon title={t('Jolokia connected')} />
                )}
                {isErrorToken && (
                  <RedExclamationCircleIcon
                    title={t('Jolokia connection failed')}
                  />
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
        ),
      },
    );
  }

  return (
    <>
      <div className="pf-u-mt-md pf-u-mb-md">
        <BrokerDetailsBreadcrumb name={name} namespace={namespace} />
        <Title headingLevel="h2" className="pf-u-ml-md">
          {t('Broker')} {name}
        </Title>
      </div>
      {errorBrokerCr && <Alert variant="danger" title={errorBrokerCr} />}
      <HorizontalNav pages={pages} />
    </>
  );
};

export const BrokerDetailsPage: FC = () => {
  const { ns: namespace, name } = useParams<{ ns?: string; name?: string }>();

  const { brokerCr, isLoading, error } = useGetBrokerCR(name, namespace);
  return (
    <>
      <JolokiaAuthentication brokerCR={brokerCr} podOrdinal={0}>
        <AuthenticatedPageContent
          brokerCr={brokerCr}
          name={name}
          namespace={namespace}
          loading={isLoading}
          error={error}
        />
      </JolokiaAuthentication>
    </>
  );
};

export const App: FC = () => {
  return <BrokerDetailsPage />;
};
