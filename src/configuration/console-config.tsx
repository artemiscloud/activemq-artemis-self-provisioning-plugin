import { BrokerConfigContext } from '../brokers/utils';
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
import { FC, useContext, useEffect, useState } from 'react';
import { CertSecretSelector, ConfigType } from './broker-models';
import { K8sResourceCommon } from '../utils';

export type ConsoleConfigProps = {
  brokerId: number;
};

export const ConsoleConfigPage: FC<ConsoleConfigProps> = ({ brokerId }) => {
  const { yamlData, setYamlData } = useContext(BrokerConfigContext);

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

  const [exposeConsole, setExposeConsole] = useState<boolean>(
    GetConsoleExpose(yamlData),
  );
  const [exposeMode, setExposeMode] = useState<string>(
    GetConsoleExposeMode(yamlData),
  );
  const [isSSLEnabled, setIsSSLEnabled] = useState<boolean>(
    GetConsoleSSLEnabled(yamlData),
  );

  const handleSSLEnabled = (value: boolean) => {
    setIsSSLEnabled(value);
  };

  const onExposeConsole = (value: boolean) => {
    setExposeConsole(value);
  };

  const onChangeExposeMode = (value: string) => {
    setExposeMode(value);
  };

  const exposeModes = [
    { value: 'route', label: 'Route', disabled: false },
    { value: 'ingress', label: 'Ingress', disabled: false },
  ];

  const updateConsole = (brokerModel: K8sResourceCommon): void => {
    brokerModel.spec.console.sslEnabled = isSSLEnabled;
    brokerModel.spec.console.exposeMode = exposeMode;
    brokerModel.spec.console.expose = exposeConsole;
    //until authentication/authorization is implemented it need this to access jolokia
    brokerModel.spec.console.adminUser = 'admin';
    brokerModel.spec.console.adminPassword = 'admin';
  };

  useEffect(() => {
    setYamlData(updateConsole);
  });

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
                onChange={onExposeConsole}
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
                onChange={onChangeExposeMode}
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
