import {
  ActionGroup,
  Alert,
  Button,
  Checkbox,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  FormFieldGroup,
  FormFieldGroupExpandable,
  FormFieldGroupHeader,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Grid,
  Popover,
  Select,
  SelectOption,
  SelectVariant,
  Switch,
  TextInput,
  Title,
} from '@patternfly/react-core';
import { Form } from '@patternfly/react-core/dist/js';
import {
  BellIcon,
  CubesIcon,
  WarningTriangleIcon,
} from '@patternfly/react-icons';
import { FC, useContext, useState } from 'react';
import {
  ArtemisReducerOperations,
  BrokerCreationFormDispatch,
  BrokerCreationFormState,
  ExposeMode,
  getAcceptor,
  getCertManagerResourceTemplateFromAcceptor,
  getConfigBindToAllInterfaces,
  getConfigFactoryClass,
  getConfigHost,
  getConfigPort,
  getConfigProtocols,
  getConfigSSLEnabled,
  listConfigs,
} from '../reducers/7.12/reducer';
import { useTranslation } from '../i18n';
import { ListPresets, PresetButton } from './acceptors-annotations';
import {
  CertSecretSelector,
  ConfigRenamingModal,
  ConfigType,
  ConfigTypeContext,
} from './broker-models';
import { ConfirmDeleteModal } from './confirmation-modal';
import { OtherParameters } from './other-parameters';

type PresetCautionProps = {
  configType: ConfigType;
  configName: string;
  kind: 'caution' | 'warning';
};

export const PresetAlertPopover: FC<PresetCautionProps> = ({
  configType,
  configName,
  kind,
}) => {
  const { cr } = useContext(BrokerCreationFormState);
  const { t } = useTranslation();
  const hasCertManagerPreset =
    configType === ConfigType.acceptors
      ? getCertManagerResourceTemplateFromAcceptor(
          cr,
          getAcceptor(cr, configName),
        ) !== undefined
      : false;

  if (!hasCertManagerPreset) {
    return <></>;
  }

  return (
    <Popover
      headerContent={
        <>
          {kind === 'caution' ? (
            <Alert
              variant="default"
              title={t('preset_caution')}
              isPlain
              isInline
            />
          ) : (
            <Alert
              variant="warning"
              title={t('preset_warning')}
              isPlain
              isInline
            />
          )}
        </>
      }
      bodyContent=""
    >
      <button
        type="button"
        aria-label="More info for name field"
        onClick={(e) => e.preventDefault()}
        aria-describedby="simple-form-name-01"
        className="pf-c-form__group-label-help"
      >
        <>
          {kind === 'caution' ? (
            <BellIcon noVerticalAlign />
          ) : (
            <WarningTriangleIcon noVerticalAlign />
          )}
        </>
      </button>
    </Popover>
  );
};

export type AcceptorProps = {
  configName: string;
  configType: ConfigType;
};

type SelectExposeModeProps = {
  selectedExposeMode: string;
  setSelectedExposeMode: (issuerName: string) => void;
  clearExposeMode: () => void;
  configName: string;
  configType: ConfigType;
};

export const SelectExposeMode: FC<SelectExposeModeProps> = ({
  selectedExposeMode: selected,
  setSelectedExposeMode: setSelected,
  clearExposeMode: clear,
  configName,
  configType,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const options = Object.values(ExposeMode).map((exposeMode) => (
    <SelectOption key={exposeMode} value={exposeMode} />
  ));

  const onSelect = (_event: any, selection: string, isPlaceholder: any) => {
    if (isPlaceholder) clearSelection();
    else {
      setSelected(selection);
      setIsOpen(false);
    }
  };

  const clearSelection = () => {
    clear();
    setIsOpen(false);
  };

  const filterMatchingOptions = (_: any, value: string) => {
    if (!value) {
      return options;
    }

    const input = new RegExp(value, 'i');
    return options.filter((child) => input.test(child.props.value));
  };

  const titleId = 'typeahead-select-issuer';
  return (
    <FormGroup
      label={t('select_expose_mode')}
      labelIcon={
        <PresetAlertPopover
          configName={configName}
          configType={configType}
          kind="caution"
        />
      }
    >
      <Select
        variant={SelectVariant.typeahead}
        typeAheadAriaLabel={t('select_expose_mode')}
        onToggle={() => setIsOpen(!isOpen)}
        onSelect={onSelect}
        onClear={clearSelection}
        onFilter={filterMatchingOptions}
        selections={selected}
        isOpen={isOpen}
        aria-labelledby={titleId}
        isGrouped
      >
        {options}
      </Select>
    </FormGroup>
  );
};

//this is shared by acceptor config and connector config
export const AcceptorConfigPage: FC<AcceptorProps> = ({
  configName,
  configType,
}) => {
  const { cr } = useContext(BrokerCreationFormState);
  const dispatch = useContext(BrokerCreationFormDispatch);

  const selectedClass = getConfigFactoryClass(cr, configType, configName);
  const port = getConfigPort(cr, configType, configName);
  const host = getConfigHost(cr, configType, configName);
  const protocols = getConfigProtocols(cr, configType, configName);
  const isSSLEnabled = getConfigSSLEnabled(cr, configType, configName);
  const bindToAllInterfaces = getConfigBindToAllInterfaces(
    cr,
    configType,
    configName,
  );

  const onChangeClass = (value: string) => {
    if (configType === ConfigType.acceptors) {
      dispatch({
        operation: ArtemisReducerOperations.updateAcceptorFactoryClass,
        payload: {
          name: configName,
          class: value as 'invm' | 'netty',
        },
      });
    }
    if (configType === ConfigType.connectors) {
      dispatch({
        operation: ArtemisReducerOperations.updateConnectorFactoryClass,
        payload: {
          name: configName,
          class: value as 'invm' | 'netty',
        },
      });
    }
  };

  const onHostChange = (host: string) => {
    dispatch({
      operation: ArtemisReducerOperations.setConnectorHost,
      payload: {
        connectorName: configName,
        host: host,
      },
    });
  };

  const onPortChange = (port: string) => {
    if (configType === ConfigType.acceptors) {
      dispatch({
        operation: ArtemisReducerOperations.setAcceptorPort,
        payload: {
          name: configName,
          port: Number(port),
        },
      });
    }
    if (configType === ConfigType.connectors) {
      dispatch({
        operation: ArtemisReducerOperations.setConnectorPort,
        payload: {
          name: configName,
          port: Number(port),
        },
      });
    }
  };

  const onProtocolsChange = (prot: string) => {
    if (configType === ConfigType.acceptors) {
      dispatch({
        operation: ArtemisReducerOperations.setAcceptorProtocols,
        payload: {
          configName: configName,
          protocols: prot,
        },
      });
    }
    if (configType === ConfigType.connectors) {
      dispatch({
        operation: ArtemisReducerOperations.setConnectorProtocols,
        payload: {
          configName: configName,
          protocols: prot,
        },
      });
    }
  };

  const handleSSLEnabled = (value: boolean) => {
    if (configType === ConfigType.acceptors) {
      dispatch({
        operation: ArtemisReducerOperations.setAcceptorSSLEnabled,
        payload: {
          name: configName,
          sslEnabled: value,
        },
      });
    }
    if (configType === ConfigType.connectors) {
      dispatch({
        operation: ArtemisReducerOperations.setConnectorSSLEnabled,
        payload: {
          name: configName,
          sslEnabled: value,
        },
      });
    }
  };

  const onBindToAllInterfacesChange = (checked: boolean) => {
    if (configType === ConfigType.acceptors) {
      dispatch({
        operation: ArtemisReducerOperations.setAcceptorBindToAllInterfaces,
        payload: {
          name: configName,
          bindToAllInterfaces: checked,
        },
      });
    }
    if (configType === ConfigType.connectors) {
      dispatch({
        operation: ArtemisReducerOperations.setConnectorBindToAllInterfaces,
        payload: {
          name: configName,
          bindToAllInterfaces: checked,
        },
      });
    }
  };

  const options = [
    { value: 'netty', label: 'Netty', disabled: false },
    { value: 'invm', label: 'InVM', disabled: false },
  ];

  const { t } = useTranslation();
  return (
    <>
      <FormFieldGroup
        header={
          <FormFieldGroupHeader
            titleText={{
              text: 'Global configuration',
              id: 'field-group-configuration' + configName,
            }}
          />
        }
      >
        <Grid hasGutter md={6}>
          {configType === ConfigType.acceptors && (
            <FormGroup
              label="BindToAllInterfaces"
              fieldId="horizontal-form-bindToAllInterfaces"
            >
              <Checkbox
                label="Bind to all interfaces"
                isChecked={bindToAllInterfaces}
                name={'check-bindToAllInterfaces' + configType + configName}
                id={'check-bindToAllInterfaces' + configType + configName}
                onChange={onBindToAllInterfacesChange}
              />
            </FormGroup>
          )}
          <FormGroup
            label="Encryption"
            fieldId="horizontal-form-Enicryption"
            labelIcon={
              <PresetAlertPopover
                configName={configName}
                configType={configType}
                kind="warning"
              />
            }
          >
            <Switch
              id={'ssl-switch' + configType + configName}
              label="SSL Enabled"
              labelOff="SSL disabled"
              isChecked={isSSLEnabled}
              onChange={handleSSLEnabled}
              ouiaId="BasicSwitch"
            />
          </FormGroup>
          {configType === ConfigType.acceptors && (
            <FormGroup
              label="Expose"
              fieldId="horizontal-form-expose"
              labelIcon={
                <PresetAlertPopover
                  configName={configName}
                  configType={configType}
                  kind="caution"
                />
              }
            >
              <Checkbox
                label="Expose"
                isChecked={
                  getAcceptor(cr, configName)
                    ? getAcceptor(cr, configName).expose
                    : false
                }
                name={'check-expose' + configType + configName}
                id={'check-expose' + configType + configName}
                onChange={(v) =>
                  dispatch({
                    operation: ArtemisReducerOperations.setIsAcceptorExposed,
                    payload: {
                      name: configName,
                      isExposed: v,
                    },
                  })
                }
              />
            </FormGroup>
          )}
          {configType === ConfigType.acceptors && (
            <SelectExposeMode
              configName={configName}
              configType={configType}
              selectedExposeMode={
                getAcceptor(cr, configName)
                  ? getAcceptor(cr, configName).exposeMode
                  : ''
              }
              setSelectedExposeMode={(v) =>
                dispatch({
                  operation: ArtemisReducerOperations.setAcceptorExposeMode,
                  payload: {
                    name: configName,
                    exposeMode: v ? (v as ExposeMode) : undefined,
                  },
                })
              }
              clearExposeMode={() =>
                dispatch({
                  operation: ArtemisReducerOperations.setAcceptorExposeMode,
                  payload: {
                    name: configName,
                    exposeMode: undefined,
                  },
                })
              }
            />
          )}
          <FormGroup
            label="Factory Class"
            isRequired
            fieldId={'horizontal-form-factory-' + configType + configName}
          >
            <FormSelect
              label="acceptorFactoryClass"
              value={selectedClass}
              onChange={onChangeClass}
              aria-label="FormSelect Input"
            >
              {options.map((option, index) => (
                <FormSelectOption
                  isDisabled={option.disabled}
                  key={index}
                  value={option.value}
                  label={option.label}
                />
              ))}
            </FormSelect>
          </FormGroup>
          {configType === ConfigType.connectors && (
            <FormGroup
              label="Host"
              isRequired
              fieldId={'horizontal-form-host-' + configType + configName}
            >
              <TextInput
                isDisabled={selectedClass === 'invm'}
                value={host}
                isRequired
                type="text"
                id={'horizontal-form-host-' + configType + configName}
                aria-describedby="horizontal-form-host-helper"
                name={'horizontal-form-host' + configType + configName}
                onChange={onHostChange}
              />
            </FormGroup>
          )}
          {configType === ConfigType.acceptors && (
            <FormGroup
              label={t('ingressHost')}
              fieldId="horizontal-form-ingressHost"
              labelIcon={
                <PresetAlertPopover
                  configName={configName}
                  configType={configType}
                  kind="caution"
                />
              }
            >
              <TextInput
                label={t('ingressHost')}
                name={'ingressHost' + configType + configName}
                id={'ingressHost' + configType + configName}
                value={
                  getAcceptor(cr, configName) &&
                  getAcceptor(cr, configName).ingressHost
                    ? getAcceptor(cr, configName).ingressHost
                    : ''
                }
                onChange={(v) =>
                  dispatch({
                    operation: ArtemisReducerOperations.setAcceptorIngressHost,
                    payload: {
                      name: configName,
                      ingressHost: v,
                    },
                  })
                }
              />
            </FormGroup>
          )}
          <FormGroup
            label="Port"
            isRequired
            fieldId={'horizontal-form-port-' + configType + configName}
          >
            <TextInput
              isDisabled={selectedClass === 'invm'}
              value={port}
              isRequired
              type="number"
              id={'horizontal-form-port-' + configType + configName}
              aria-describedby="horizontal-form-port-helper"
              name="horizontal-form-port"
              onChange={onPortChange}
            />
          </FormGroup>
          <FormGroup
            label="Protocols"
            isRequired
            fieldId="horizontal-form-protocols"
          >
            <TextInput
              value={protocols}
              isRequired
              type="text"
              id="horizontal-form-protocols"
              aria-describedby="horizontal-form-protocols-helper"
              name="horizontal-form-protocols"
              onChange={onProtocolsChange}
            />
          </FormGroup>
        </Grid>
      </FormFieldGroup>
      <FormFieldGroup
        header={
          <FormFieldGroupHeader
            titleText={{
              text: 'Other parameters',
              id: 'field-group-configuration' + configName,
            }}
          />
        }
      >
        <OtherParameters configName={configName} configType={configType} />
      </FormFieldGroup>
      {isSSLEnabled && (
        <FormFieldGroup
          header={
            <FormFieldGroupHeader
              titleText={{
                text: 'SSL configuration',
                id: 'field-group-configuration-ssl' + configName,
              }}
            />
          }
        >
          <CertSecretSelector
            namespace={cr.metadata.namespace}
            isCa={false}
            configType={configType}
            configName={configName}
            canSetCustomNames
          />
          <CertSecretSelector
            namespace={cr.metadata.namespace}
            isCa={true}
            configType={configType}
            configName={configName}
          />
        </FormFieldGroup>
      )}
      {configType === ConfigType.acceptors && cr.spec.resourceTemplates && (
        <FormFieldGroup
          header={
            <FormFieldGroupHeader
              titleText={{
                text: 'Presets',
                id: 'field-group-configuration-annotations' + configName,
              }}
            />
          }
        >
          <ListPresets acceptor={getAcceptor(cr, configName)} />
        </FormFieldGroup>
      )}
    </>
  );
};

export type AcceptorConfigSectionProps = {
  configType: ConfigType;
  configName: string;
};

export const AcceptorConfigSection: FC<AcceptorConfigSectionProps> = ({
  configType,
  configName,
}) => {
  const dispatch = useContext(BrokerCreationFormDispatch);
  const onDelete = () => {
    if (configType === ConfigType.acceptors) {
      dispatch({
        operation: ArtemisReducerOperations.deleteAcceptor,
        payload: configName,
      });
    }
    if (configType === ConfigType.connectors) {
      dispatch({
        operation: ArtemisReducerOperations.deleteConnector,
        payload: configName,
      });
    }
  };

  const { cr } = useContext(BrokerCreationFormState);
  return (
    <FormFieldGroupExpandable
      isExpanded
      toggleAriaLabel="Details"
      header={
        <FormFieldGroupHeader
          titleText={{
            text: configName,
            id: 'configName' + configName,
          }}
          titleDescription={configName + "'s details"}
          actions={
            <>
              {configType === ConfigType.acceptors && (
                <PresetButton acceptor={getAcceptor(cr, configName)} />
              )}
              <ConfigRenamingModal initName={configName} />
              <ConfirmDeleteModal
                subject={
                  configType === ConfigType.acceptors ? 'acceptor' : 'connector'
                }
                action={onDelete}
              />
            </>
          }
        />
      }
    >
      <AcceptorConfigPage configType={configType} configName={configName} />
    </FormFieldGroupExpandable>
  );
};

export type AcceptorsConfigProps = {
  brokerId: number;
};

export const AcceptorsConfigPage: FC<AcceptorsConfigProps> = ({ brokerId }) => {
  const { cr } = useContext(BrokerCreationFormState);
  const configType = useContext(ConfigTypeContext);
  const configs = listConfigs(configType, cr) as {
    name: string;
  }[];
  const dispatch = useContext(BrokerCreationFormDispatch);

  const addNewConfig = () => {
    if (configType === ConfigType.acceptors) {
      dispatch({
        operation: ArtemisReducerOperations.addAcceptor,
      });
    }
    if (configType === ConfigType.connectors) {
      dispatch({
        operation: ArtemisReducerOperations.addConnector,
      });
    }
  };

  const name = configType === ConfigType.acceptors ? 'acceptor' : 'connector';
  const pronoun = configType === ConfigType.acceptors ? 'an' : 'a';
  if (configs.length === 0) {
    return (
      <EmptyState variant={EmptyStateVariant.small}>
        <EmptyStateIcon icon={CubesIcon} />
        <Title headingLevel="h4" size="lg">
          No {name} configured
        </Title>
        <EmptyStateBody>
          There's no {name} in your configuration, to add one click on the
          button below.{' '}
        </EmptyStateBody>
        <Button variant="primary" onClick={addNewConfig}>
          Add {pronoun} {name}
        </Button>
      </EmptyState>
    );
  }

  return (
    <Form isHorizontal isWidthLimited>
      {configs.map((config, index) => {
        return (
          <AcceptorConfigSection
            key={config.name + brokerId + index}
            configType={configType}
            configName={config.name}
          />
        );
      })}
      <ActionGroup>
        <Button variant="primary" onClick={addNewConfig}>
          Add {pronoun} {name}
        </Button>
      </ActionGroup>
    </Form>
  );
};
