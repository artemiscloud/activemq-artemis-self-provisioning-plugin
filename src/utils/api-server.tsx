import {
  ErrorStatus,
  K8sResourceCommon,
  K8sResourceKind,
} from '@openshift-console/dynamic-plugin-sdk';
import { FC, createContext, useContext, useEffect, useState } from 'react';
import {
  Button,
  TextContent,
  TextInput,
  TextArea,
} from '@patternfly/react-core';

export const AuthContext = createContext<string>('');

function getJolokiaProtocol(broker: K8sResourceKind): string {
  return broker.spec['console'].sslEnabled ? 'https' : 'http';
}

function getBrokerKey(broker: K8sResourceCommon, ordinal: number): string {
  return (
    broker?.metadata.name + '-' + ordinal + ':' + broker?.metadata.namespace
  );
}

//curl -v -H "Content-type: application/x-www-form-urlencoded" -d "userName=admin" -d "password=admin" -d "hostName=localhost" -d port=8161 -d "scheme=http" -X POST http://localhost:3000/api/v1/jolokia/login
export async function LoginJolokia(
  broker: K8sResourceKind,
  route: K8sResourceKind,
  apiHost: string,
  apiPort: string,
  ordinal: number,
): Promise<[boolean, string]> {
  let jolokiaHost: string;
  let jolokiaPort: string;
  //todo: get the userName and password from the login form
  const userName = broker?.spec['console'].adminUser
    ? broker.spec['console'].adminUser
    : 'admin';
  const password = broker?.spec['console'].adminPassword
    ? broker.spec['console'].adminPassword
    : 'admin';

  if (process.env.NODE_ENV === 'production') {
    const consoleServiceName =
      broker?.metadata.name + '-wconsj-' + ordinal + '-svc';
    jolokiaHost = consoleServiceName + '.' + broker?.metadata.namespace;

    jolokiaPort = '8161';
  } else {
    jolokiaHost = route?.spec.host;
    jolokiaPort = broker?.spec['console'].sslEnabled ? '443' : '80';
  }

  const authUrl =
    'https://' +
    apiHost +
    ':' +
    apiPort +
    getProxyUrl() +
    '/api/v1/jolokia/login';

  type LoginOptions = {
    [key: string]: string;
  };

  const protocol = getJolokiaProtocol(broker);

  const details: LoginOptions = {
    brokerName: getBrokerKey(broker, ordinal),
    userName: userName,
    password: password,
    jolokiaHost: jolokiaHost,
    port: jolokiaPort,
    scheme: protocol,
  };

  const formBody = [];
  for (const property in details) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + '=' + encodedValue);
  }
  const formData = formBody.join('&');

  const response = await fetch(authUrl, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', //is it necessary?

    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });
  if (response.ok) {
    const data = await response.json();
    return [true, data['jolokia-session-id']];
  } else {
    return [false, ''];
  }
}

function getApiHost(): string {
  return process.env.NODE_ENV === 'production'
    ? location.hostname
    : 'localhost';
}

function getApiPort(): string {
  return process.env.NODE_ENV === 'production' ? '443' : '9443';
}

function getProxyUrl(): string {
  return process.env.NODE_ENV === 'production'
    ? '/api/proxy/plugin/activemq-artemis-self-provisioning-plugin/api-server-service'
    : '';
}

type JolokiaTestPanelType = {
  broker: K8sResourceKind;
  ordinal: number;
};

const JolokiaTestPanel: FC<JolokiaTestPanelType> = ({ broker, ordinal }) => {
  const [testUrl, setTestUrl] = useState<string>('');
  const [jolokiaTestResult, setJolokiaTestResult] = useState('Result:');
  const [requestError, setRequestError] = useState(false);

  const authToken = useContext(AuthContext);

  const setError = (error: string) => {
    sessionStorage.removeItem(getBrokerKey(broker, ordinal));
    setJolokiaTestResult(error);
    setRequestError(true);
  };

  const onButtonClickShowApi = () => {
    // TODO sending requests on a button click needs also some work
    try {
      const apiUrl =
        'https://' +
        getApiHost() +
        ':' +
        getApiPort() +
        getProxyUrl() +
        '/api/v1/api-info';

      fetch(apiUrl, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
      })
        .then((result): void => {
          result.json().then((data) => {
            const hostInfo =
              'https://' +
              getApiHost() +
              ':' +
              getApiPort() +
              getProxyUrl() +
              '/api/v1/\n';
            const apiInfo = JSON.stringify(JSON.parse(data.message), null, 2);
            setJolokiaTestResult(hostInfo + apiInfo);
          });
        })
        .catch((err) => {
          setError(err);
        });
    } catch (error) {
      setError(error);
    }
  };

  const onButtonClickExec = () => {
    // TODO sending requests on a button click needs also some work
    try {
      const apiUrl =
        'https://' +
        getApiHost() +
        ':' +
        getApiPort() +
        getProxyUrl() +
        '/api/v1/execBrokerOperation';

      const methodData = {
        signature: 'listAddresses(java.lang.String)',
        args: [','],
      };
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'jolokia-session-id': authToken,
        },
        body: JSON.stringify(methodData),
      })
        .then((result): void => {
          if (result.ok) {
            result
              .json()
              .then((data) => {
                setJolokiaTestResult(JSON.stringify(data));
              })
              .catch((result_err) => {
                setError('result error: ' + result_err);
              });
          } else {
            result.text().then((data) => {
              setError(data);
            });
          }
        })
        .catch((err) => {
          setError('fetch error' + err);
        });
    } catch (error) {
      setError(error);
    }
  };

  const onButtonClick = () => {
    // TODO sending requests on a button click needs also some work
    try {
      if (testUrl === '') {
        alert('you need to give a jolokia request url');
        return;
      }

      const encodedUrl = testUrl.replace(/,/g, '%2C');
      fetch(encodedUrl, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'jolokia-session-id': authToken,
        },
      })
        .then((result): void => {
          if (result.ok) {
            result.json().then((data) => {
              setJolokiaTestResult(JSON.stringify(data, null, 2));
            });
          } else {
            result.text().then((data) => {
              setError(data);
            });
          }
        })
        .catch((err) => {
          setError(err);
        });
    } catch (error) {
      setError(error);
    }
  };

  // TODO for now the two buttons that are triggering calls to the backend API
  // are disabled when there's no token available
  return (
    <>
      {requestError && (
        <ErrorStatus title="The Jolokia login needs to get refreshed please reload the page." />
      )}
      <TextInput
        value={testUrl}
        type="text"
        onChange={(value, _event) => setTestUrl(value)}
        aria-label="text input example"
        placeholder={
          'input jolokia url here, example: https://' +
          getApiHost() +
          ':' +
          getApiPort() +
          getProxyUrl() +
          '/api/v1/brokers'
        }
      />
      <div>
        <Button name="query" onClick={onButtonClick} disabled={!authToken}>
          Submit query
        </Button>
        &nbsp;&nbsp;&nbsp;
        <Button name="info" onClick={onButtonClickShowApi}>
          Show api info
        </Button>
        &nbsp;&nbsp;&nbsp;
        <Button name="exec" onClick={onButtonClickExec} disabled={!authToken}>
          Test Operation
        </Button>
      </div>
      <TextContent>
        <TextArea
          aria-label="auto resize"
          autoResize={true}
          value={jolokiaTestResult}
          resizeOrientation="vertical"
          rows={20}
        ></TextArea>
      </TextContent>
    </>
  );
};

export type LoginState = 'none' | 'session' | 'ongoing' | 'fail' | 'ok';

export const useJolokiaLogin = (
  brokerDetail: K8sResourceKind,
  brokerRoutes: K8sResourceKind[],
  ordinal: number,
): [string, LoginState] => {
  const [token, setToken] = useState<string>('');
  const [loginState, setLoginState] = useState<LoginState>('none');

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

  useEffect(() => {
    if (loginState !== 'none') {
      return;
    }
    if (brokerRoutes?.length === 0 && process.env.NODE_ENV !== 'production') {
      return;
    }
    if (!brokerDetail?.metadata?.name) {
      return;
    }
    setLoginState('ongoing');
    let apiHost = 'localhost';
    let apiPort = '9443';
    if (process.env.NODE_ENV === 'production') {
      apiHost = location.hostname;
      apiPort = '443';
    }

    const theRoute = getBrokerRoute(brokerRoutes, brokerDetail, ordinal);

    const sessionToken = sessionStorage.getItem(
      getBrokerKey(brokerDetail, ordinal),
    );

    if (sessionToken) {
      setToken(sessionToken);
      setLoginState('session');
      return;
    }

    LoginJolokia(brokerDetail, theRoute, apiHost, apiPort, ordinal).then(
      (result) => {
        const [success, receivedToken] = result;
        if (success) {
          setToken(receivedToken);
          sessionStorage.setItem(
            getBrokerKey(brokerDetail, ordinal),
            receivedToken,
          );
          setLoginState('ok');
        } else {
          setLoginState('fail');
        }
      },
    );
  }, [brokerDetail, brokerRoutes, loginState, ordinal]);
  return [token, loginState];
};

export { JolokiaTestPanel };
