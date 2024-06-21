import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AddressDetailsBreadcrumb } from '../../shared-components/AddressDetailsBreadcrumb/AddressDetailsBreadcrumb';
import {
  Alert,
  Button,
  Modal,
  ModalVariant,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
  TextVariants,
  Title,
} from '@patternfly/react-core';
import { useTranslation } from '../../i18n';
import {
  AMQBrokerModel,
  AuthContext,
  getApiServerBaseUrl,
  useJolokiaLogin,
} from '../../utils';
import {
  K8sResourceKind,
  k8sGet,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OpenAPI as OpenAPIConfig } from '../../openapi/jolokia/requests/core/OpenAPI';
import { AddressDetails } from './AddressDetails.component';

const AddressDetailsPage: FC = () => {
  const { t } = useTranslation();
  const {
    name,
    ns: namespace,
    brokerName,
    podName,
  } = useParams<{
    name?: string;
    ns?: string;
    brokerName?: string;
    podName?: string;
  }>();
  const [brokerDetails, setBrokerDetails] = useState<K8sResourceKind>({});
  const [_loading, setLoading] = useState<boolean>(true);
  const [isFirstMount, setIsFirstMount] = useState(true);
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

  const k8sGetBroker = () => {
    setLoading(true);
    k8sGet({ model: AMQBrokerModel, name: brokerName, ns: namespace })
      .then((broker: K8sResourceKind) => {
        setBrokerDetails(broker);
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleModalToggle = () => {
    setIsErrorModalOpen(!isErrorModalOpen);
  };

  const handleTryAgain = () => {
    setIsErrorModalOpen(false);
    window.location.reload();
  };

  if (isFirstMount) {
    k8sGetBroker();
    setIsFirstMount(false);
  }

  const podOrdinal = parseInt(podName.replace(brokerName + '-ss-', ''));

  const { token, isError, isLoading, source } = useJolokiaLogin(
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
        <div className="pf-u-mt-md pf-u-ml-md pf-u-mb-md">
          <AddressDetailsBreadcrumb
            name={name}
            namespace={namespace}
            brokerName={brokerName}
            podName={podName}
          />
          <Title headingLevel="h2">
            {t('address')} {name}
          </Title>
        </div>
        {error && <Alert variant="danger" title={error} />}
        <AddressDetails name={name} />
      </PageSection>
    </AuthContext.Provider>
  );
};

const App: FC = () => {
  OpenAPIConfig.BASE = getApiServerBaseUrl();
  const querClient = new QueryClient();
  return (
    <QueryClientProvider client={querClient}>
      <AddressDetailsPage />
    </QueryClientProvider>
  );
};

export default App;
