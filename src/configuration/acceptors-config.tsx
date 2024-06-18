import {
  ArtemisReducerOperations,
  BrokerCreationFormState,
  BrokerCreationFormDispatch,
  getConfigPort,
  getConfigFactoryClass,
  listConfigs,
  getConfigHost,
  getConfigProtocols,
  getConfigBindToAllInterfaces,
  getConfigOtherParams,
  getConfigSSLEnabled,
  getAcceptor,
  ExposeMode,
} from '../brokers/utils';
import { FC, Fragment, useContext, useState } from 'react';
import {
  Button,
  Checkbox,
  Divider,
  Dropdown,
  DropdownItem,
  ExpandableSection,
  Flex,
  FlexItem,
  FormGroup,
  FormSelect,
  FormSelectOption,
  KebabToggle,
  List,
  ListItem,
  SearchInput,
  Select,
  SelectOption,
  SelectVariant,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Switch,
  TextInput,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons';
import {
  ConfigType,
  NamingPanel,
  CertSecretSelector,
  ConfigTypeContext,
} from './broker-models';
import { useTranslation } from 'react-i18next';
import { ListAnnotations, NewAnnotationButton } from './acceptors-annotations';

export type AcceptorProps = {
  configName: string;
  configType: ConfigType;
};

type SelectExposeModeProps = {
  selectedExposeMode: string;
  setSelectedExposeMode: (issuerName: string) => void;
  clearExposeMode: () => void;
};

export const SelectExposeMode: FC<SelectExposeModeProps> = ({
  selectedExposeMode: selected,
  setSelectedExposeMode: setSelected,
  clearExposeMode: clear,
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
    <FormGroup label={t('select_expose_mode')}>
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
  const otherParams = getConfigOtherParams(cr, configType, configName);
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
  const onOtherParamsChange = (params: string) => {
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

  const onBindToAllInterfacesChange = (
    checked: boolean,
    event: React.FormEvent<HTMLInputElement>,
  ) => {
    const target = event.currentTarget;
    const name = target.name;
    console.log(
      'binding to chamged, name: ',
      name,
      'checked',
      checked,
      'current',
      bindToAllInterfaces,
    );
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

  return (
    <>
      <Flex>
        <FlexItem>
          <FormGroup
            label="Factory Class"
            isRequired
            fieldId={'horizontal-form-factory-' + configType + configName}
            key={'formgroup-factory' + configType + configName}
          >
            <FormSelect
              label="acceptorFactoryClass"
              value={selectedClass}
              onChange={onChangeClass}
              aria-label="FormSelect Input"
              key={'select' + configType + configName}
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
        </FlexItem>
        {configType === ConfigType.connectors && (
          <FlexItem>
            <FormGroup
              label="Host"
              isRequired
              fieldId={'horizontal-form-host-' + configType + configName}
              key={'host' + configType + configName}
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
          </FlexItem>
        )}
        <FlexItem>
          <FormGroup
            label="Port"
            isRequired
            fieldId={'horizontal-form-port-' + configType + configName}
            key={'port' + configType + configName}
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
        </FlexItem>
        <FlexItem>
          <FormGroup
            label="Protocols"
            isRequired
            fieldId="horizontal-form-protocols"
            key={'protocol' + configType + configName}
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
        </FlexItem>
        {configType === ConfigType.acceptors && (
          <FlexItem>
            <FormGroup
              label="BindToAllInterfaces"
              isRequired
              fieldId="horizontal-form-bindToAllInterfaces"
              key={'bindToAllInterfaces' + configType + configName}
            >
              <Checkbox
                label="Bind to all interfaces"
                isChecked={bindToAllInterfaces}
                name={'check-bindToAllInterfaces' + configType + configName}
                id={'check-bindToAllInterfaces' + configType + configName}
                onChange={onBindToAllInterfacesChange}
              />
            </FormGroup>
          </FlexItem>
        )}
        {configType === ConfigType.acceptors && (
          <FlexItem>
            <FormGroup label="Expose" fieldId="horizontal-form-expose">
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
          </FlexItem>
        )}
        {configType === ConfigType.acceptors && (
          <FlexItem>
            <SelectExposeMode
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
          </FlexItem>
        )}
        {configType === ConfigType.acceptors && (
          <FlexItem>
            <FormGroup
              label="ingressHost"
              fieldId="horizontal-form-ingressHost"
            >
              <TextInput
                label="Ingress Host"
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
          </FlexItem>
        )}
        <FlexItem>
          <FormGroup
            label="Other parameters"
            isRequired
            fieldId="horizontal-form-otherParams"
            key={'other' + configType + configName}
          >
            <TextInput
              value={otherParams}
              isRequired
              type="text"
              id="horizontal-form-protocols"
              aria-describedby="horizontal-form-protocols-helper"
              name="horizontal-form-protocols"
              onChange={onOtherParamsChange}
            />
          </FormGroup>
        </FlexItem>
        <FlexItem>
          <FormGroup
            label="Annotations"
            isRequired
            fieldId="horizontal-form-otherParams"
            key={'other' + configType + configName}
          >
            <NewAnnotationButton acceptor={getAcceptor(cr, configName)} />
          </FormGroup>
        </FlexItem>
      </Flex>
      <Flex>
        <div className="pf-u-pt-xl"></div>
        <FlexItem>
          <Switch
            key={'switch' + configType + configName}
            id={'ssl-switch' + configType + configName}
            label="SSL Enabled"
            labelOff="SSL disabled"
            isChecked={isSSLEnabled}
            onChange={handleSSLEnabled}
            ouiaId="BasicSwitch"
          />
          <Divider orientation={{ default: 'horizontal' }} />
          <div className="pf-u-pt-xl"></div>
          {isSSLEnabled && (
            <Flex direction={{ default: 'row' }}>
              <FlexItem>
                <CertSecretSelector
                  key={'secret-key' + configType + configName}
                  namespace={cr.metadata.namespace}
                  isCa={false}
                  configType={configType}
                  configName={configName}
                />
              </FlexItem>
              <FlexItem>
                <CertSecretSelector
                  key={'secret-ca' + configType + configName}
                  namespace={cr.metadata.namespace}
                  isCa={true}
                  configType={configType}
                  configName={configName}
                />
              </FlexItem>
            </Flex>
          )}
        </FlexItem>
      </Flex>
      {configType === ConfigType.acceptors && cr.spec.resourceTemplates && (
        <Flex>
          <div className="pf-u-pt-xl"></div>
          <FlexItem>
            <FormGroup label="Annotations">
              <Divider orientation={{ default: 'horizontal' }} />
              <div className="pf-u-pt-xl"></div>
              <ListAnnotations acceptor={getAcceptor(cr, configName)} />
            </FormGroup>
          </FlexItem>
        </Flex>
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
  const { t } = useTranslation();
  const { cr } = useContext(BrokerCreationFormState);
  const dispatch = useContext(BrokerCreationFormDispatch);

  const [isConfigExpanded, setIsConfigExpanded] = useState(false);

  const [isActionOpen, setIsActionOpen] = useState(false);
  const [isNaming, setIsNaming] = useState(false);

  const onToggleAcceptorConfig = (expanded: boolean) => {
    setIsConfigExpanded(expanded);
  };

  const onSelectAction = (_event: any) => {
    setIsActionOpen(!isActionOpen);
  };

  const onToggleActions = (isOpen: boolean) => {
    setIsActionOpen(isOpen);
  };

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

  const onRename = () => {
    setIsNaming(true);
  };

  const dropdownItems = [
    <DropdownItem key="action-rename" component="button" onClick={onRename}>
      {t('rename')}
    </DropdownItem>,
    <DropdownItem key="action-delete" component="button" onClick={onDelete}>
      {t('delete')}
    </DropdownItem>,
  ];

  const getAcceptorNameSet = () => {
    return listConfigs(configType, cr, 'set');
  };

  return (
    <Split>
      <SplitItem>
        <Dropdown
          onSelect={onSelectAction}
          toggle={
            <KebabToggle onToggle={onToggleActions} id="toggle-id-actions" />
          }
          isOpen={isActionOpen}
          isPlain
          dropdownItems={dropdownItems}
        />
      </SplitItem>
      <SplitItem isFilled>
        {isNaming && (
          <NamingPanel
            initName={configName}
            uniqueSet={getAcceptorNameSet() as Set<string>}
          />
        )}
        {!isNaming && (
          <ExpandableSection
            key={'configsection' + configType + configName}
            toggleText={configName}
            onToggle={onToggleAcceptorConfig}
            isExpanded={isConfigExpanded}
            isWidthLimited
          >
            <AcceptorConfigPage
              key={'configpage' + configType + configName}
              configType={configType}
              configName={configName}
            />
          </ExpandableSection>
        )}
      </SplitItem>
    </Split>
  );
};

export type AcceptorsConfigProps = {
  brokerId: number;
};

export const AcceptorsConfigPage: FC<AcceptorsConfigProps> = ({ brokerId }) => {
  const { t } = useTranslation();
  const fromState = useContext(BrokerCreationFormState);
  const configType = useContext(ConfigTypeContext);
  const dispatch = useContext(BrokerCreationFormDispatch);

  const getAcceptorsFromModel = (brokerId: number): any[] => {
    const { cr } = fromState;
    const acceptors = [];

    let i = 0;
    const acceptorEntries = listConfigs(configType, cr) as {
      name: string;
    }[];

    while (i < acceptorEntries.length) {
      const entry = acceptorEntries[i];

      acceptors.push(
        <ListItem key={entry.name + brokerId}>
          <AcceptorConfigSection
            configType={configType}
            configName={entry.name}
          />
        </ListItem>,
      );
      i++;
    }
    return acceptors;
  };

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

  const configToolbarItems = (
    <Fragment>
      <ToolbarItem variant="search-filter">
        <SearchInput
          aria-label="search acceptors"
          placeholder={t('search_acceptors')}
        />
      </ToolbarItem>
      <ToolbarItem>
        <Button
          variant="plain"
          aria-label="Add new acceptors"
          onClick={addNewConfig}
        >
          <PlusCircleIcon size="md" />
        </Button>
      </ToolbarItem>
    </Fragment>
  );
  return (
    <Stack key={'stack' + configType}>
      <StackItem>
        <Toolbar id="toolbar-items-example">
          <ToolbarContent>{configToolbarItems}</ToolbarContent>
        </Toolbar>
      </StackItem>
      <StackItem isFilled>
        <List isPlain>{getAcceptorsFromModel(brokerId)}</List>
      </StackItem>
    </Stack>
  );
};
