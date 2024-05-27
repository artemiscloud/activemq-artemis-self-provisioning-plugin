import {
  ErrorStatus,
  GreenCheckCircleIcon,
  K8sResourceCommon,
  K8sResourceKind,
  RedExclamationCircleIcon,
} from '@openshift-console/dynamic-plugin-sdk';
import { FC, createContext, useContext, useState } from 'react';
import {
  Button,
  TextContent,
  TextInput,
  TextArea,
  Title,
  Form,
  FormSelect,
  FormSelectOption,
  FormGroup,
  ActionGroup,
  Spinner,
} from '@patternfly/react-core';
import {
  useDevelopmentServiceApiInfoKey,
  useJolokiaServiceCheckCredentialsKey,
  useJolokiaServiceExecBrokerOperation,
  useJolokiaServiceGetAcceptors,
  useJolokiaServiceGetAcceptorsKey,
  useJolokiaServiceGetAddressDetailsKey,
  useJolokiaServiceGetAddresses,
  useJolokiaServiceGetBrokerDetailsKey,
  useJolokiaServiceGetBrokers,
  useJolokiaServiceGetQueueDetailsKey,
  useJolokiaServiceGetQueues,
  useSecurityServiceLogin,
} from '../openapi/jolokia/queries';
import {
  JolokiaService,
  DevelopmentService,
  Attr,
  Queue,
  Address,
  Acceptor,
  JavaTypes,
  Signature,
  OperationArgument,
} from '../openapi/jolokia/requests';
import { useQuery } from '@tanstack/react-query';
import { Signatures } from '@app/openapi/jolokia/requests/models/Signatures';

export const AuthContext = createContext<string>('');

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

export const getApiServerBaseUrl = (): string => {
  let apiHost = 'localhost';
  let apiPort = '9443';
  if (process.env.NODE_ENV === 'production') {
    apiHost = location.hostname;
    apiPort = '443';
  }
  return 'https://' + apiHost + ':' + apiPort + getProxyUrl() + '/api/v1';
};

type SignatureSubFormType = {
  name: string;
  signature: Signature;
};

export const SignatureSubForm: FC<SignatureSubFormType> = ({
  name,
  signature,
}) => {
  const authToken = useContext(AuthContext);
  const [formValues, setFormvalues] = useState<Record<string, string>>({});
  const update = (name: string, value: string) => {
    const newFormValues = { ...formValues };
    newFormValues[name] = value;
    setFormvalues(newFormValues);
    resetLoginMutation();
  };

  const {
    data: response,
    mutate: execRequest,
    isError,
    isSuccess,
    isLoading,
    reset: resetLoginMutation,
  } = useJolokiaServiceExecBrokerOperation({});
  return (
    <FormGroup label={name}>
      <p>{signature.desc}</p>
      {signature.args.map((arg, item) => {
        return (
          <FormGroup label={arg.name + ' ' + arg.type} key={item}>
            <TextInput
              value={formValues ? formValues[arg.name] : ''}
              onChange={(value) => update(arg.name, value)}
              aria-label={arg.name}
            />
          </FormGroup>
        );
      })}
      <ActionGroup>
        <Button
          variant="primary"
          onClick={() => {
            if (!formValues) {
              return;
            }
            execRequest({
              jolokiaSessionId: authToken,
              requestBody: {
                signature: {
                  name: name,
                  args: signature.args.map((arg) => {
                    const ret: OperationArgument = {
                      value: formValues
                        ? formValues[arg.name]
                          ? formValues[arg.name]
                          : ''
                        : '',
                      type: arg.type,
                    };
                    return ret;
                  }),
                },
              },
            });
          }}
        >
          Execute
        </Button>
      </ActionGroup>
      {isLoading && <Spinner size="sm" aria-label="Executing" />}
      {isSuccess && (
        <>
          <p>
            Jolokia's answer: {response[0].status}
            {response[0].status === 200 && (
              <>
                <GreenCheckCircleIcon title="Request success" />
                <p>value: {JSON.stringify(response[0].value)}</p>
              </>
            )}
            {response[0].status !== 200 && (
              <>
                <RedExclamationCircleIcon title="Request failure" />
                <p>error_type: {response[0].error_type}</p>
                <p>error: {response[0].error}</p>
              </>
            )}
          </p>
        </>
      )}
      {isError && (
        <RedExclamationCircleIcon title="API-SERVER Request failure" />
      )}
    </FormGroup>
  );
};

type ExecOprType = {
  op: Record<string, Signatures>;
};
export const ExecOpr: FC<ExecOprType> = ({ op }) => {
  const [formSelectValue, setFormSelectValue] = useState('');
  const onChange = (value: string) => {
    setFormSelectValue(value);
  };
  return (
    <>
      <Title headingLevel="h3">Operations</Title>
      <Form>
        <FormSelect
          value={formSelectValue}
          onChange={onChange}
          aria-label="FormSelect Input"
        >
          {!formSelectValue && (
            <FormSelectOption key="" label="make a selection" />
          )}
          {Object.keys(op).map((name) => (
            <FormSelectOption key={name} value={name} label={name} />
          ))}
        </FormSelect>
        {formSelectValue &&
          op[formSelectValue].map((signature, item) => (
            <SignatureSubForm
              name={formSelectValue}
              signature={signature}
              key={item}
            />
          ))}
      </Form>
    </>
  );
};

type DisplayDetailsType = {
  attr: Record<string, Attr>;
  address?: Address;
  acceptor?: Acceptor;
  queue?: Queue;
};
export const FetchAttr: FC<DisplayDetailsType> = ({
  attr,
  address,
  acceptor,
  queue,
}) => {
  const authToken = useContext(AuthContext);
  const [formSelectValue, setFormSelectValue] = useState('');

  const onChange = (value: string) => {
    setFormSelectValue(value);
  };

  const [param, setParam] = useState<string>('');

  const handleParamChange = (param: string) => {
    setParam(param);
  };

  const { data: attribute, isSuccess: isSuccesReadAttribute } = useQuery({
    queryKey: [
      'fetchAttr' +
        '-' +
        address +
        '-' +
        queue +
        '-' +
        acceptor +
        '-' +
        formSelectValue,
    ],
    queryFn: () => {
      if (queue) {
        return JolokiaService.readQueueAttributes(
          authToken,
          queue.name,
          queue.address.name,
          queue['routing-type'],
          [formSelectValue],
        );
      }
      if (acceptor) {
        return JolokiaService.readAcceptorAttributes(authToken, acceptor.name, [
          formSelectValue,
        ]);
      }
      if (address) {
        return JolokiaService.readAddressAttributes(authToken, address.name, [
          formSelectValue,
        ]);
      }
      return JolokiaService.readBrokerAttributes(authToken, [formSelectValue]);
    },
    enabled: formSelectValue !== '',
  });

  const attributeValue = isSuccesReadAttribute
    ? JSON.stringify(attribute[0].value)
    : '';
  console.log('MBEAN ', attribute ? attribute[0].request.mbean : '');

  return (
    <>
      <Title headingLevel="h3">Attributes</Title>
      <Form>
        <FormSelect
          value={formSelectValue}
          onChange={onChange}
          aria-label="FormSelect Input"
        >
          {!formSelectValue && (
            <FormSelectOption key="" label="make a selection" />
          )}
          {Object.entries(attr)
            .filter(([_k, v]) => !v.rw) // only list readOnly attributes
            .map(([name, _v]) => (
              <FormSelectOption key={name} value={name} label={name} />
            ))}
        </FormSelect>
        {formSelectValue && (
          <>
            <p>Description: {attr[formSelectValue].desc}</p>
            <FormGroup label={attr[formSelectValue].type}>
              <TextInput
                id="settype"
                value={attr[formSelectValue].rw ? param : attributeValue}
                onChange={handleParamChange}
                isDisabled={!attr[formSelectValue].rw}
              />
            </FormGroup>
          </>
        )}
      </Form>
    </>
  );
};

export const JolokiaBrokerDetails: FC = () => {
  const authToken = useContext(AuthContext);

  const { data: brokers, isSuccess: brokersSuccess } =
    useJolokiaServiceGetBrokers({ jolokiaSessionId: authToken });

  const broker0Name = brokersSuccess ? brokers[0].name : '';

  const { data: brokersDetails, isSuccess: isSuccesBrokersDetails } = useQuery({
    queryKey: [useJolokiaServiceGetBrokerDetailsKey + broker0Name],
    queryFn: () => JolokiaService.getBrokerDetails(authToken),
    enabled: brokersSuccess,
  });
  if (!isSuccesBrokersDetails) {
    return <></>;
  }

  return (
    <>
      <Title headingLevel="h2">Broker details</Title>
      <FetchAttr attr={brokersDetails.attr} />
      <br />
      <Title headingLevel="h2">Broker operations</Title>
      <ExecOpr op={brokersDetails.op} />
    </>
  );
};

export const JolokiaAddressDetails: FC = () => {
  const authToken = useContext(AuthContext);
  const [selectedAddress, setSelectedAddress] = useState('');

  const { data: addresses, isSuccess: addressesSuccess } =
    useJolokiaServiceGetAddresses({ jolokiaSessionId: authToken });

  const { data: addressDetails, isSuccess: isSuccessAddressDetails } = useQuery(
    {
      queryKey: [useJolokiaServiceGetAddressDetailsKey + selectedAddress],
      queryFn: () =>
        JolokiaService.getAddressDetails(authToken, selectedAddress),
      enabled: addressesSuccess && selectedAddress !== '',
    },
  );

  const onChange = (value: string) => {
    setSelectedAddress(value);
  };

  const address =
    selectedAddress !== ''
      ? addresses.find((address) => address.name === selectedAddress)
      : undefined;

  return (
    <>
      <Title headingLevel="h2">Address details</Title>
      {addressesSuccess && (
        <FormSelect
          value={selectedAddress}
          onChange={onChange}
          aria-label="FormSelect Input"
        >
          {!selectedAddress && (
            <FormSelectOption key="" label="make a selection" />
          )}
          {addresses.map((address) => (
            <FormSelectOption
              key={address.name}
              value={address.name}
              label={address.name}
            />
          ))}
        </FormSelect>
      )}
      {isSuccessAddressDetails && (
        <FetchAttr attr={addressDetails.attr} address={address} />
      )}
    </>
  );
};

export const JolokiaAcceptorDetails: FC = () => {
  const authToken = useContext(AuthContext);
  const [selectedAcceptor, setSelectedAcceptor] = useState('');

  const { data: acceptors, isSuccess: isAcceptorsSuccess } =
    useJolokiaServiceGetAcceptors({ jolokiaSessionId: authToken });

  const { data: addressDetails, isSuccess: isSuccessAddressDetails } = useQuery(
    {
      queryKey: [useJolokiaServiceGetAcceptorsKey + selectedAcceptor],
      queryFn: () =>
        JolokiaService.getAcceptorDetails(authToken, selectedAcceptor),
      enabled: isAcceptorsSuccess && selectedAcceptor !== '',
    },
  );

  const onChange = (value: string) => {
    setSelectedAcceptor(value);
  };

  const acceptor =
    selectedAcceptor !== ''
      ? acceptors.find((acceptor) => acceptor.name === selectedAcceptor)
      : undefined;

  return (
    <>
      <Title headingLevel="h2">Acceptor details</Title>
      {isAcceptorsSuccess && (
        <FormSelect
          value={selectedAcceptor}
          onChange={onChange}
          aria-label="FormSelect Input"
        >
          {!selectedAcceptor && (
            <FormSelectOption key="" label="make a selection" />
          )}
          {acceptors.map((address) => (
            <FormSelectOption
              key={address.name}
              value={address.name}
              label={address.name}
            />
          ))}
        </FormSelect>
      )}
      {isSuccessAddressDetails && (
        <FetchAttr attr={addressDetails.attr} acceptor={acceptor} />
      )}
    </>
  );
};

export const JolokiaQueueDetails: FC = () => {
  const authToken = useContext(AuthContext);
  const [selectedQueue, setSelectesQueue] = useState('');

  const { data: queues, isSuccess: isQueueSuccess } =
    useJolokiaServiceGetQueues({ jolokiaSessionId: authToken });

  const queue =
    selectedQueue !== ''
      ? queues.find((queue) => queue.name === selectedQueue)
      : undefined;

  const { data: queueDetails, isSuccess: isSuccessQueueDetails } = useQuery({
    queryKey: [useJolokiaServiceGetQueueDetailsKey + selectedQueue],
    queryFn: () =>
      JolokiaService.getQueueDetails(
        authToken,
        queue.name,
        queue['routing-type'],
        queue.address.name,
      ),
    enabled: queue !== undefined,
  });

  const onChange = (value: string) => {
    setSelectesQueue(value);
  };

  return (
    <>
      <Title headingLevel="h2">Acceptor details</Title>
      {isQueueSuccess && (
        <FormSelect
          value={selectedQueue}
          onChange={onChange}
          aria-label="FormSelect Input"
        >
          {!selectedQueue && (
            <FormSelectOption key="" label="make a selection" />
          )}
          {queues.map((e) => (
            <FormSelectOption key={e.name} value={e.name} label={e.name} />
          ))}
        </FormSelect>
      )}
      {isSuccessQueueDetails && (
        <FetchAttr attr={queueDetails.attr} queue={queue} />
      )}
    </>
  );
};

const JolokiaTestPanel: FC = () => {
  const [testUrl, setTestUrl] = useState<string>('');
  const [jolokiaTestResult, setJolokiaTestResult] = useState('Result:');
  const [requestError, setRequestError] = useState(false);

  const authToken = useContext(AuthContext);

  const setError = (error: string) => {
    setJolokiaTestResult(error);
    setRequestError(true);
  };

  // Show API Request
  const [requestApi, setRequestApi] = useState(false);
  const { data: dataRequestApi, isSuccess: isSuccessRequestApi } = useQuery({
    queryKey: [useDevelopmentServiceApiInfoKey],
    queryFn: () => DevelopmentService.apiInfo(),
    enabled: requestApi,
    onError: (error: any) => setError(error as string),
  });

  if (dataRequestApi && isSuccessRequestApi && requestApi) {
    const apiInfo = JSON.stringify(dataRequestApi.message, null, 2);
    const hostInfo =
      'https://' +
      getApiHost() +
      ':' +
      getApiPort() +
      getProxyUrl() +
      '/api/v1/\n';
    setJolokiaTestResult(hostInfo + apiInfo);
    setRequestApi(false);
  }

  // Exec API Request
  const { mutate: performExecBrokerOperation } =
    useJolokiaServiceExecBrokerOperation({
      onSuccess: (data: any) => {
        setJolokiaTestResult(JSON.stringify(data));
      },
      onError: (error: any) => setError(error as string),
    });

  // TODO The request below is still using fetch instead of being converted to
  // the new react-query hooks. The reason why is beacuse it uses the field in
  // the form to know which URL to request.
  //
  // To change this we could provide a drop down menu with all the supported
  // endpoints and their associated forms to correctly send parameters.
  //
  // But this is more a test than a real functionality so for now we can just
  // leave it this way.
  const onButtonClick = () => {
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
      <Title headingLevel="h3">Jolokia test panel</Title>
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
        <Button name="info" onClick={() => setRequestApi(true)}>
          Show api info
        </Button>
        &nbsp;&nbsp;&nbsp;
        <Button
          name="exec"
          onClick={() =>
            performExecBrokerOperation({
              jolokiaSessionId: authToken,
              requestBody: {
                signature: {
                  name: 'listAddresses',
                  args: [
                    {
                      type: JavaTypes.JAVA_LANG_STRING,
                      value: ',',
                    },
                  ],
                },
              },
            })
          }
          disabled={!authToken}
        >
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

type jolokiaLoginSource = 'api' | 'session';
type JolokiaLogin = {
  isSucces: boolean;
  isLoading: boolean;
  isError: boolean;
  token: string;
  source: jolokiaLoginSource;
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
  brokerRoutes: K8sResourceKind[],
  ordinal: number,
): JolokiaLogin => {
  const params = getJolokiaLoginParameters(broker, brokerRoutes, ordinal);
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
    onSuccess: (data: any) => {
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
      isSucces: isSuccessRequestApi,
      isLoading: isLoadingRequestApi,
      isError: isErrorRequestApi,
      token: token,
      source: 'session',
    };
  }
  return {
    isError: isLoginMutationError,
    isSucces: isLoginMutationSuccess,
    isLoading: isLoginMutationLoading || isLoginMutationIdle,
    token: token,
    source: 'api',
  };
};

export { JolokiaTestPanel };
