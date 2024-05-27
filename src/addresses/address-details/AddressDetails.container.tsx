import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AddressDetailsBreadcrumb } from '../../shared-components/AddressDetailsBreadcrumb/AddressDetailsBreadcrumb';
import {
  PageSection,
  PageSectionVariants,
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
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (isFirstMount) {
    k8sGetBroker();
    setIsFirstMount(false);
  }

  const podOrdinal = parseInt(podName.replace(brokerName + '-ss-', ''));

  const { token, isSucces, isLoading, source } = useJolokiaLogin(
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
    if (isSucces) {
      // TODO maybe use the OpenShift console notification system to let the
      // user know that the login was a success?
      alert(
        'login successful ' + brokerDetails?.metadata?.name + ' token ' + token,
      );
    } else {
      alert('login failed');
    }
    setNotify(false);
  }

  return (
    <>
      <AuthContext.Provider value={token}>
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
          <AddressDetails name={name} />
        </PageSection>
      </AuthContext.Provider>
    </>
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
