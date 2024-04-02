import {
  K8sResourceCommon,
  K8sResourceKind,
} from '@openshift-console/dynamic-plugin-sdk';
import { FC, createContext, useContext, useState } from 'react';
import {
  Button,
  TextContent,
  TextInput,
  TextArea,
} from '@patternfly/react-core';

export const RouteContext = createContext<K8sResourceKind[]>(null);

interface JolokiaTestProps {
  broker: K8sResourceKind;
}

export function needLogin(
  broker?: K8sResourceCommon,
  ordinal?: number,
): boolean {
  if (broker === undefined) {
    return false;
  }
  return getAuthToken(broker, ordinal) === null;
}

export function getAuthToken(
  broker: K8sResourceCommon,
  ordinal?: number,
): string {
  return sessionStorage.getItem(getBrokerKey(broker, ordinal ? ordinal : 0));
}

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
  ordinal?: number,
): Promise<boolean> {
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

    console.log('broker service host name', jolokiaHost);
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

  console.log('login to', authUrl);

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

  console.log(
    '****login with',
    'brokerName',
    details.brokerName,
    'scheme',
    details.scheme,
    'port',
    details.port,
    'user',
    details.userName,
    'jolokiaHost',
    details.jolokiaHost,
    'apiHost',
    apiHost,
    'apiPort',
    apiPort,
  );

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
    sessionStorage.setItem(
      getBrokerKey(broker, ordinal),
      data['jolokia-session-id'],
    );
    return true;
  } else {
    console.log('login failed', response);
    return false;
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

const JolokiaTestPanel: FC<JolokiaTestProps> = ({ broker }) => {
  const [testUrl, setTestUrl] = useState<string>('');
  const [jolokiaTestResult, setJolokiaTestResult] = useState('Result:');

  const brokerRoutes = useContext(RouteContext);

  const onButtonClickShowApi = () => {
    try {
      console.log('showing api info', getProxyUrl());
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
            console.log('get back result', data, 'utl', testUrl);
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
          setJolokiaTestResult(err);
        });
    } catch (error) {
      setJolokiaTestResult(error);
    }
  };

  const onButtonClickExec = () => {
    try {
      console.log('showing api info', getProxyUrl());
      const apiUrl =
        'https://' +
        getApiHost() +
        ':' +
        getApiPort() +
        getProxyUrl() +
        '/api/v1/execBrokerOperation';

      const methodData = {
        signature: 'listAddresses(java.lang.String)',
        params: [','],
      };
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'jolokia-session-id': getAuthToken(broker),
          'jolokia-target-pod': '0', //indicate target pod ordinal, e.g. ex-aao-ss-{0}
        },
        body: JSON.stringify(methodData),
      })
        .then((result): void => {
          if (result.ok) {
            result
              .json()
              .then((data) => {
                console.log('get back exec result', data);
                setJolokiaTestResult(JSON.stringify(data));
              })
              .catch((result_err) => {
                setJolokiaTestResult('result error: ' + result_err);
              });
          }
        })
        .catch((err) => {
          setJolokiaTestResult('fetch error' + err);
        });
    } catch (error) {
      setJolokiaTestResult(error);
    }
  };

  const onButtonClick = () => {
    try {
      if (needLogin(broker)) {
        console.log('require login', broker.metadata.name);
        if (confirm('plugin log in to broker: ' + broker.metadata.name)) {
          LoginJolokia(
            broker,
            getBrokerRoute(broker),
            getApiHost(),
            getApiPort(),
          ).then((result) => {
            if (result) {
              alert('login successful');
            } else {
              alert('login failed');
            }
          });
        } else {
          alert('login cancelled, you wont get jolokia access!');
          console.log('cancelled');
        }
        return;
      }

      console.log('starting querying', testUrl);
      if (testUrl == '') {
        alert('you need to give a jolokia request url');
        return;
      }

      const encodedUrl = testUrl.replace(/,/g, '%2C');
      console.log('after encoded', encodedUrl);
      fetch(encodedUrl, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'jolokia-session-id': getAuthToken(broker),
        },
      })
        .then((result): void => {
          if (result.ok) {
            result.json().then((data) => {
              console.log('get back result', data, 'utl', testUrl);
              setJolokiaTestResult(JSON.stringify(data, null, 2));
            });
          } else {
            result.text().then((data) => {
              setJolokiaTestResult(data);
            });
          }
        })
        .catch((err) => {
          setJolokiaTestResult(err);
        });
    } catch (error) {
      setJolokiaTestResult(error);
    }
  };

  const getBrokerRoute = (b: K8sResourceKind): K8sResourceKind => {
    if (brokerRoutes.length > 0) {
      const filteredRoutes = brokerRoutes.filter((route) =>
        route.metadata.ownerReferences?.some(
          (ref) =>
            ref.name === b.metadata.name && ref.kind === 'ActiveMQArtemis',
        ),
      );
      return filteredRoutes.length > 0 ? filteredRoutes[0] : null;
    }
    console.log('no route created');
    return null;
  };

  return (
    <>
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
        <Button name="query" onClick={onButtonClick}>
          Submit query
        </Button>
        &nbsp;&nbsp;&nbsp;
        <Button name="info" onClick={onButtonClickShowApi}>
          Show api info
        </Button>
        &nbsp;&nbsp;&nbsp;
        <Button name="exec" onClick={onButtonClickExec}>
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

interface LoginProp {
  brokerDetail: K8sResourceKind;
}

export const LoginHandler: FC<LoginProp> = ({ brokerDetail }) => {
  const brokerRoutes = useContext(RouteContext);

  const [loginState, setLoginState] = useState<
    'none' | 'ongoing' | 'fail' | 'ok'
  >('none');

  const getBrokerRoute = (
    routes: K8sResourceKind[],
    broker: K8sResourceKind,
    ordinal: number,
  ): K8sResourceKind => {
    console.log('*** get broker route from', routes?.length);
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
    console.log('target route' + target);
    return target;
  };

  const handleLogin = (
    broker: K8sResourceKind,
    routes: K8sResourceKind[],
    ordinal = 0,
  ): any => {
    if (loginState === 'ok' || loginState === 'ongoing') {
      console.log('not to handle login becasue of state', loginState);
      return null;
    }
    console.log('handing login', routes?.length, 'broker', broker);
    if (routes?.length == 0 && process.env.NODE_ENV !== 'production') {
      console.log('no routes available for dev');
      return null;
    }
    if (!broker?.metadata?.name) {
      console.log('no broker for login', broker);
      return null;
    }
    if (needLogin(broker, ordinal)) {
      setLoginState('ongoing');
      let apiHost = 'localhost';
      let apiPort = '9443';
      console.log('require login', broker.metadata.name);
      if (process.env.NODE_ENV === 'production') {
        console.log('in production env');
        apiHost = location.hostname;
        apiPort = '443';
      }

      const theRoute = getBrokerRoute(routes, broker, ordinal);

      LoginJolokia(broker, theRoute, apiHost, apiPort, ordinal).then(
        (result) => {
          if (result) {
            setLoginState('ok');
            alert('login successful' + broker?.metadata?.name);
          } else {
            setLoginState('fail');
            alert('login failed');
          }
        },
      );
    }
    return null;
  };

  console.log(
    'return handle login ',
    brokerDetail,
    'routes',
    brokerRoutes?.length,
  );
  return handleLogin(brokerDetail, brokerRoutes);
};

export { JolokiaTestPanel };
