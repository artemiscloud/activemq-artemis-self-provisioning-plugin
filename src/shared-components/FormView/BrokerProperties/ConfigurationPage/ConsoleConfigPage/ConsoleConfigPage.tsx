import {
  ArtemisReducerOperations,
  BrokerCreationFormDispatch,
  BrokerCreationFormState,
  ExposeMode,
} from '@app/reducers/7.12/reducer';

import {
  Checkbox,
  Form,
  FormFieldGroup,
  FormFieldGroupExpandable,
  FormFieldGroupHeader,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Grid,
  Switch,
} from '@patternfly/react-core';
import { FC, useContext, useState } from 'react';
import { BrokerCR } from '@app/k8s/types';
import { ConfigType } from '../ConfigurationPage';
import { CertSecretSelector } from '../CertSecretSelector/CertSecretSelector';

export type ConsoleConfigProps = {
  brokerId: number;
};

export const ConsoleConfigPage: FC<ConsoleConfigProps> = ({ brokerId }) => {
  const { cr } = useContext(BrokerCreationFormState);
  const dispatch = useContext(BrokerCreationFormDispatch);

  const GetConsoleSSLEnabled = (brokerModel: BrokerCR): boolean => {
    if (brokerModel.spec?.console) {
      return brokerModel.spec.console.sslEnabled ? true : false;
    }
    return false;
  };

  const GetConsoleExposeMode = (brokerModel: BrokerCR): ExposeMode => {
    if (brokerModel.spec?.console) {
      return brokerModel.spec.console.exposeMode
        ? brokerModel.spec.console.exposeMode
        : ExposeMode.route;
    }
    return ExposeMode.route;
  };

  const GetConsoleExpose = (brokerModel: BrokerCR): boolean => {
    if (brokerModel.spec?.console) {
      return brokerModel.spec.console.expose
        ? brokerModel.spec.console.expose
        : false;
    }
    return false;
  };

  const exposeConsole = GetConsoleExpose(cr);
  const exposeMode = GetConsoleExposeMode(cr);
  const isSSLEnabled = GetConsoleSSLEnabled(cr);

  const handleSSLEnabled = (value: boolean) => {
    dispatch({
      operation: ArtemisReducerOperations.setConsoleSSLEnabled,
      payload: value,
    });
  };

  const setConsoleExpose = (value: boolean) => {
    dispatch({
      operation: ArtemisReducerOperations.setConsoleExpose,
      payload: value,
    });
  };

  const setConsoleExposeMode = (value: ExposeMode) => {
    dispatch({
      operation: ArtemisReducerOperations.setConsoleExposeMode,
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
      operation: ArtemisReducerOperations.setConsoleCredentials,
      payload: { adminUser: 'admin', adminPassword: 'admin' },
    });
  }

  return (
    <Form isHorizontal isWidthLimited key={'form' + brokerId}>
      <FormFieldGroupExpandable
        isExpanded
        header={
          <FormFieldGroupHeader
            titleText={{
              text: 'Console configuration',
              id: 'field-group-consoleconfig' + 'console',
            }}
          />
        }
      >
        <Grid hasGutter md={6}>
          <FormFieldGroup>
            <FormGroup
              label="Expose"
              fieldId={'console-config-expose-formgroup'}
              isRequired
            >
              <Checkbox
                label="Expose Console"
                isChecked={exposeConsole}
                name={'check-console-expose'}
                id={'check-expose-console'}
                onChange={(_event, value: boolean) => setConsoleExpose(value)}
              />
            </FormGroup>
            <FormGroup
              label="ExposeMode"
              fieldId={'console-config-exposemode-formgroup'}
            >
              <FormSelect
                label="console expose mode"
                value={exposeMode}
                onChange={(_event, value: ExposeMode) =>
                  setConsoleExposeMode(value)
                }
                aria-label="formselect-expose-mode-aria-label"
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
            <Switch
              id={'id-switch-console-sslEnabled'}
              label="SSL Enabled for console"
              labelOff="SSL disabled for console"
              isChecked={isSSLEnabled}
              onChange={(_event, value: boolean) => handleSSLEnabled(value)}
              ouiaId="BasicSwitch-console-ssl"
            />
          </FormFieldGroup>
        </Grid>
      </FormFieldGroupExpandable>
      {isSSLEnabled && (
        <FormFieldGroup
          header={
            <FormFieldGroupHeader
              titleText={{
                text: 'SSL configuration',
                id: 'field-group-configuration-ssl' + 'console',
              }}
            />
          }
        >
          <CertSecretSelector
            namespace={cr.metadata.namespace}
            isCa={false}
            configType={ConfigType.console}
            configName={'console'}
          />
          <CertSecretSelector
            namespace={cr.metadata.namespace}
            isCa={true}
            configType={ConfigType.console}
            configName={'console'}
          />
        </FormFieldGroup>
      )}
    </Form>
  );
};
