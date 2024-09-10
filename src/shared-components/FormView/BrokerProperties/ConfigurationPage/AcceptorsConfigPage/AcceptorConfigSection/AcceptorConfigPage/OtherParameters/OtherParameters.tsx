import {
  ArtemisReducerOperations,
  BrokerCreationFormDispatch,
  BrokerCreationFormState,
  getConfigOtherParams,
} from '@app/reducers/7.12/reducer';
import { FC, useContext, useState } from 'react';
import {
  Button,
  InputGroup,
  InputGroupText,
  TextInput,
  InputGroupItem,
} from '@patternfly/react-core';
import { TrashIcon } from '@patternfly/react-icons';
import { ConfigType } from '../../../../ConfigurationPage';

type ParamProps = {
  paramKey: string;
  paramValue: string;
  configType: ConfigType;
  configName: string;
};

const Param: FC<ParamProps> = ({
  paramKey: key,
  paramValue: value,
  configType,
  configName,
}) => {
  const { cr } = useContext(BrokerCreationFormState);
  const otherParams = getConfigOtherParams(cr, configType, configName);
  const dispatch = useContext(BrokerCreationFormDispatch);
  const updateOtherParams = (prevKey: string, key: string, value: string) => {
    const params = new Map(otherParams);
    if (prevKey) {
      params.delete(prevKey);
    }
    if (key) {
      params.set(key, value);
    }
    if (configType === ConfigType.acceptors) {
      dispatch({
        operation: ArtemisReducerOperations.setAcceptorOtherParams,
        payload: {
          name: configName,
          otherParams: params,
        },
      });
    }
    if (configType === ConfigType.connectors) {
      dispatch({
        operation: ArtemisReducerOperations.setConnectorOtherParams,
        payload: {
          name: configName,
          otherParams: params,
        },
      });
    }
  };
  const deleteOtherParam = (key: string) => {
    updateOtherParams(key, '', '');
  };
  const [newKey, setNewKey] = useState(key);
  const [newValue, setNewValue] = useState(value);
  return (
    <InputGroup>
      <InputGroupItem isFill>
        <TextInput value={newKey} onChange={(_event, v) => setNewKey(v)} />
      </InputGroupItem>
      <InputGroupText>=</InputGroupText>
      <InputGroupItem isFill>
        <TextInput value={newValue} onChange={(_event, v) => setNewValue(v)} />
      </InputGroupItem>
      <InputGroupItem>
        <Button
          onClick={() => updateOtherParams(key, newKey, newValue)}
          isDisabled={
            newKey === '' ||
            newValue === '' ||
            (newKey === key && newValue === value)
          }
        >
          update
        </Button>
      </InputGroupItem>
      <InputGroupItem>
        <Button
          variant="plain"
          aria-label="Remove"
          onClick={() => deleteOtherParam(key)}
        >
          <TrashIcon />
        </Button>
      </InputGroupItem>
    </InputGroup>
  );
};

type OtherParametersProps = {
  configType: ConfigType;
  configName: string;
};

export const OtherParameters: FC<OtherParametersProps> = ({
  configType,
  configName,
}) => {
  const { cr } = useContext(BrokerCreationFormState);
  const otherParams = getConfigOtherParams(cr, configType, configName);
  let newParamSuffix = 0;
  const newParamBaseName = 'key';
  while (otherParams.has(newParamBaseName + newParamSuffix)) {
    newParamSuffix += 1;
  }
  const dispatch = useContext(BrokerCreationFormDispatch);
  const addNewParam = (key: string, value: string) => {
    const params = new Map(otherParams);
    params.set(key, value);
    if (configType === ConfigType.acceptors) {
      dispatch({
        operation: ArtemisReducerOperations.setAcceptorOtherParams,
        payload: {
          name: configName,
          otherParams: params,
        },
      });
    }
    if (configType === ConfigType.connectors) {
      dispatch({
        operation: ArtemisReducerOperations.setConnectorOtherParams,
        payload: {
          name: configName,
          otherParams: params,
        },
      });
    }
  };
  return (
    <>
      {Array.from(otherParams).map(([key, value]) => (
        <Param
          key={configType + key + value}
          paramKey={key}
          paramValue={value}
          configName={configName}
          configType={configType}
        />
      ))}
      <Button
        variant="link"
        onClick={() =>
          addNewParam(newParamBaseName + newParamSuffix, 'placeholder')
        }
      >
        Add an extra parameter
      </Button>
    </>
  );
};
