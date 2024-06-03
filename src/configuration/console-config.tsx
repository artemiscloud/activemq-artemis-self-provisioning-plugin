import {
  ArtemisReducerActions,
  BrokerConfigContext,
  BrokerDispatchContext,
  ExposeMode,
} from '../brokers/utils';
import {
  Checkbox,
  Divider,
  Flex,
  FlexItem,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Stack,
  StackItem,
  Switch,
} from '@patternfly/react-core';

import { FC, useContext, useState } from 'react';
import { CertSecretSelector, ConfigType } from './broker-models';
import { K8sResourceCommon } from '../utils';

export type ConsoleConfigProps = {
  brokerId: number;
};

export const ConsoleConfigPage: FC<ConsoleConfigProps> = ({ brokerId }) => {
  const { yamlData } = useContext(BrokerConfigContext);
  const dispatch = useContext(BrokerDispatchContext);

  const GetConsoleSSLEnabled = (brokerModel: K8sResourceCommon): boolean => {
    if (brokerModel.spec?.console) {
      return brokerModel.spec.console.sslEnabled ? true : false;
    }
    return false;
  };

  const GetConsoleExposeMode = (brokerModel: K8sResourceCommon): string => {
    if (brokerModel.spec?.console) {
      return brokerModel.spec.console.exposeMode
        ? brokerModel.spec.console.exposeMode
        : 'route';
    }
    return 'route';
  };

  const GetConsoleExpose = (brokerModel: K8sResourceCommon): boolean => {
    if (brokerModel.spec?.console) {
      return brokerModel.spec.console.expose
        ? brokerModel.spec.console.expose
        : false;
    }
    return false;
  };

  const exposeConsole = GetConsoleExpose(yamlData);
  const exposeMode = GetConsoleExposeMode(yamlData);
  const isSSLEnabled = GetConsoleSSLEnabled(yamlData);

  const handleSSLEnabled = (value: boolean) => {
    dispatch({
      operation: ArtemisReducerActions.setConsoleSSLEnabled,
      payload: value,
    });
  };

  const setConsoleExpose = (value: boolean) => {
    dispatch({
      operation: ArtemisReducerActions.setConsoleExpose,
      payload: value,
    });
  };

  const setConsoleExposeMode = (value: string) => {
    dispatch({
      operation: ArtemisReducerActions.setConsoleExposeMode,
      payload: value,
    });
  };

  const exposeModes = [
    { value: ExposeMode.route, label: 'Route', disabled: false },
    { value: ExposeMode.ingress, label: 'Ingress', disabled: false },
  ];

  const [execOnlyOnce, setExecOnlyOnce] = useState(true);
  if (execOnlyOnce) {
    setExecOnlyOnce(false);
    setConsoleExpose(exposeConsole);
    setConsoleExposeMode(exposeMode);
    dispatch({
      operation: ArtemisReducerActions.setConsoleCredentials,
      payload: { adminUser: 'admin', adminPassword: 'admin' },
    });
  }

  return (
    <Stack key={'stack' + brokerId}>
      <StackItem isFilled>
        <Flex>
          <FlexItem>
            <FormGroup
              label="Expose"
              fieldId={'console-config-expose-formgroup'}
              key={'formgroup-console-expose'}
            >
              <Checkbox
                label="Expose Console"
                isChecked={exposeConsole}
                name={'check-console-expose'}
                id={'check-expose-console'}
                onChange={setConsoleExpose}
              />
            </FormGroup>
          </FlexItem>
          <FlexItem>
            <FormGroup
              label="ExposeMode"
              fieldId={'console-config-exposemode-formgroup'}
              key={'formgroup-console-exposemode'}
            >
              <FormSelect
                label="console expose mode"
                value={exposeMode}
                onChange={setConsoleExposeMode}
                aria-label="formselect-expose-mode-aria-label"
                key={'formselect-console-exposemode'}
              >
                {exposeModes.map((mode, index) => (
                  <FormSelectOption
                    key={'console-exposemode-option' + index}
                    value={mode.value}
                    label={mode.label}
                  />
                ))}
              </FormSelect>
            </FormGroup>
          </FlexItem>
        </Flex>
        <Flex>
          <div className="pf-u-pt-xl"></div>
          <FlexItem>
            <Switch
              key={'switch-console-sslEnabled'}
              id={'id-switch-console-sslEnabled'}
              label="SSL Enabled for console"
              labelOff="SSL disabled for console"
              isChecked={isSSLEnabled}
              onChange={handleSSLEnabled}
              ouiaId="BasicSwitch-console-ssl"
            />
            <Divider orientation={{ default: 'horizontal' }} />
            <div className="pf-u-pt-xl"></div>
            {isSSLEnabled && (
              <Flex direction={{ default: 'row' }}>
                <FlexItem>
                  <CertSecretSelector
                    key={'secret-key' + ConfigType.console + 'console'}
                    namespace={yamlData.metadata.namespace}
                    isCa={false}
                    configType={ConfigType.console}
                    configName={'console'}
                  />
                </FlexItem>
                <FlexItem>
                  <CertSecretSelector
                    key={'secret-ca' + ConfigType.console + 'console'}
                    namespace={yamlData.metadata.namespace}
                    isCa={true}
                    configType={ConfigType.console}
                    configName={'console'}
                  />
                </FlexItem>
              </Flex>
            )}
          </FlexItem>
        </Flex>
      </StackItem>
    </Stack>
  );
};
