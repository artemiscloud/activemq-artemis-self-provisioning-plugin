import { JolokiaService, LoginResponse } from '../openapi/jolokia/requests';
import { useQuery } from '@tanstack/react-query';
import {
  useJolokiaServiceCheckCredentialsKey,
  useSecurityServiceLogin,
} from '../openapi/jolokia/queries';
import {
  K8sResourceCommon,
  K8sResourceKind,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { useState } from 'react';
import { JolokiaLogin } from './context';

function getJolokiaProtocol(broker: K8sResourceKind): string {
  return broker.spec['console'].sslEnabled ? 'https' : 'http';
}

function getBrokerKey(broker: K8sResourceCommon, ordinal: number): string {
  if (!broker || !broker.metadata) {
    return '';
  }
  return (
    broker?.metadata.name + '-' + ordinal + ':' + broker?.metadata.namespace
  );
}

const getBrokerRoute = (
  routes: K8sResourceKind[],
  broker: K8sResourceKind,
  ordinal: number,
): K8sResourceKind => {
  let target: K8sResourceKind = null;
  if (routes.length > 0) {
    const filteredRoutes = routes.filter((route) =>
      route.metadata.ownerReferences?.some(
        (ref) =>
          ref.name === broker.metadata.name && ref.kind === 'ActiveMQArtemis',
      ),
    );
    filteredRoutes.forEach((r) => {
      if (r.metadata.name.includes('wconsj-' + ordinal)) {
        target = r;
      }
    });
  }
  return target;
};

/**
 * Prepare the parameters to request a new login to the api-server
 */
const getJolokiaLoginParameters = (
  broker: K8sResourceKind,
  brokerRoutes: K8sResourceKind[],
  ordinal: number,
): {
  brokerName: string;
  userName: string;
  password: string;
  jolokiaHost: string;
  port: string;
  scheme: string;
} => {
  const requestBody = {
    brokerName: '',
    userName: 'admin',
    password: 'admin',
    jolokiaHost: '',
    port: '',
    scheme: '',
  };

  // Wait for the broker and routes to be ready to consume
  if (!broker?.metadata?.name) {
    return requestBody;
  }
  if (brokerRoutes?.length === 0 && process.env.NODE_ENV !== 'production') {
    return requestBody;
  }
  if (!broker.spec || !broker.spec['console']) {
    return requestBody;
  }

  requestBody.brokerName = getBrokerKey(broker, ordinal);

  const userName = broker.spec['console'].adminUser;
  const password = broker.spec['console'].adminPassword;
  requestBody.userName = userName ? userName : requestBody.userName;
  requestBody.password = password ? password : requestBody.password;

  requestBody.scheme = getJolokiaProtocol(broker);

  if (process.env.NODE_ENV === 'production') {
    requestBody.jolokiaHost =
      broker?.metadata?.name +
      '-wconsj-' +
      ordinal +
      '-svc' +
      '.' +
      broker?.metadata?.namespace;
    requestBody.port = '8161';
  } else {
    requestBody.jolokiaHost = getBrokerRoute(
      brokerRoutes,
      broker,
      ordinal,
    )?.spec.host;
    requestBody.port = broker?.spec['console'].sslEnabled ? '443' : '80';
  }

  return requestBody;
};

/**
 * Use this hook at the top of your first page to get credentials to access the
 * jolokia api-server. This should be called before any other queries to the
 * api-server since you'll need credentials.
 *
 * This hook will try first to recover the token from the web browser session.
 * If it can't it'll trigger a login call to the api-server. The token will get
 * periodically checked for its validity. When it is no longer good, the
 * authentification process will start again.
 *
 * This requires to be executed under a QueryClientProvider, for more
 * information checkout the tanstack query v4 documentation.
 *
 * @return a JolokiaLogin object with the token and its source. Use isSuccess,
 * isError and isLoading to know in which state the login process is in before
 * reading the token value. You can use the source field to differentiate when
 * the request was actually made to the api-server and when the token was
 * extracted from the web-browser session.
 */
export const useJolokiaLogin = (
  broker: K8sResourceKind,
  ordinal: number,
): JolokiaLogin => {
  const [routes] = useK8sWatchResource<K8sResourceKind[]>({
    isList: true,
    groupVersionKind: {
      group: 'route.openshift.io',
      kind: 'Route',
      version: 'v1',
    },
    namespaced: true,
  });
  const params = getJolokiaLoginParameters(broker, routes, ordinal);
  const paramsReady =
    params.port !== '' &&
    params.jolokiaHost !== '' &&
    params.brokerName !== '' &&
    params.scheme !== '';
  const brokerKey = getBrokerKey(broker, ordinal);

  const [token, setToken] = useState(
    paramsReady ? sessionStorage.getItem(getBrokerKey(broker, ordinal)) : '',
  );
  const [needToFetchToken, setNeedToFetchToken] = useState(
    paramsReady ? !token : false,
  );

  const updateToken = (token: string) => {
    sessionStorage.setItem(brokerKey, token);
    setToken(token);
  };
  // remove the token from the session and ask for a new on from the login
  // mutation.
  const reinitializeToken = () => {
    sessionStorage.removeItem(brokerKey);
    setToken('');
    resetLoginMutation();
    setNeedToFetchToken(true);
  };
  const {
    mutate: performLoginMutation,
    isError: isLoginMutationError,
    isSuccess: isLoginMutationSuccess,
    isLoading: isLoginMutationLoading,
    isIdle: isLoginMutationIdle,
    reset: resetLoginMutation,
  } = useSecurityServiceLogin({
    onSuccess: (data: LoginResponse) => {
      updateToken(data['jolokia-session-id']);
    },
  });

  // At first mount we don't have enough information to retrive the token from
  // the session storage. We need to wait for the broker information to get
  // available. Then, when it is, to update the state with what is in storage.
  if (paramsReady && !token && !needToFetchToken) {
    const sessionToken = sessionStorage.getItem(brokerKey);
    // It's now possible to request to fetch if there's nothing in the session
    if (sessionToken) {
      setToken(sessionToken);
      setNeedToFetchToken(false);
    } else {
      if (!needToFetchToken && isLoginMutationIdle) {
        setNeedToFetchToken(true);
      }
    }
  }

  // When there's no session token, run the login mutation to obtain one.
  if (paramsReady && needToFetchToken) {
    setNeedToFetchToken(false);
    performLoginMutation({ requestBody: params });
  }

  // Always validate that the current token in the session is valid by
  // performing a dummy request to the api-server on a periodic basis.
  // If the request encounters an error, then it will invalidate the session
  // token, triggering a new login via the mutation.
  const {
    isSuccess: isSuccessRequestApi,
    isError: isErrorRequestApi,
    isLoading: isLoadingRequestApi,
  } = useQuery({
    queryKey: [useJolokiaServiceCheckCredentialsKey + 'test_credentials'],
    queryFn: () => JolokiaService.checkCredentials(token),
    enabled: paramsReady && token !== '',
    onError: () => reinitializeToken(),
    retry: 1,
  });

  // Tag the origin of the token, 'session' for the browser session and 'api'
  // for the api-server. The only situation when the token is provided by the
  // browser session is when the mutation has never run, so we discriminate this
  // situation depending on the Idle state of the mutation itself.
  if (isLoginMutationIdle && !needToFetchToken) {
    return {
      isSuccess: isSuccessRequestApi,
      isLoading: isLoadingRequestApi,
      isError: isErrorRequestApi,
      token: token,
      source: 'session',
      podOrdinal: ordinal,
    };
  }
  return {
    isError: isLoginMutationError,
    isSuccess: isLoginMutationSuccess,
    isLoading: isLoginMutationLoading || isLoginMutationIdle,
    token: token,
    source: 'api',
    podOrdinal: ordinal,
  };
};

function getProxyUrl(): string {
  return process.env.NODE_ENV === 'production'
    ? '/api/proxy/plugin/activemq-artemis-self-provisioning-plugin/api-server-service'
    : '';
}

export const useGetApiServerBaseUrl = (): string => {
  let apiHost = 'localhost';
  let apiPort = '9443';
  if (process.env.NODE_ENV === 'production') {
    apiHost = location.hostname;
    apiPort = '443';
  }
  return 'https://' + apiHost + ':' + apiPort + getProxyUrl() + '/api/v1';
};
