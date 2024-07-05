import {
  ErrorStatus,
  GreenCheckCircleIcon,
  RedExclamationCircleIcon,
} from '@openshift-console/dynamic-plugin-sdk';
import { FC, useContext, useState } from 'react';
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
  useJolokiaServiceExecBrokerOperation,
  useJolokiaServiceGetAcceptors,
  useJolokiaServiceGetAcceptorsKey,
  useJolokiaServiceGetAddressDetailsKey,
  useJolokiaServiceGetAddresses,
  useJolokiaServiceGetBrokerDetailsKey,
  useJolokiaServiceGetBrokers,
  useJolokiaServiceGetQueueDetailsKey,
  useJolokiaServiceGetQueues,
} from '../../../openapi/jolokia/queries';
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
} from '../../../openapi/jolokia/requests';
import { useQuery } from '@tanstack/react-query';
import { Signatures } from '../../../openapi/jolokia/requests/models/Signatures';
import { AuthContext } from '../../../jolokia/customHooks';

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

export { JolokiaTestPanel };
