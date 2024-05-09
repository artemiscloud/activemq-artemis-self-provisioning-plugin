import { BrokerConfigContext } from '../brokers/utils';
import { FC, Fragment, useContext, useEffect, useState } from 'react';
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
import { ConfigType, NamingPanel, CertSecretSelector } from './broker-models';
import { K8sResourceCommon } from '../utils';

export type AcceptorProps = {
  configName: string;
  configType: ConfigType;
};

//this is shared by acceptor config and connector config
export const AcceptorConfigPage: FC<AcceptorProps> = ({
  configName,
  configType,
}) => {
  const { yamlData, setYamlData } = useContext(BrokerConfigContext);

  const GetAcceptorFactoryClass = (brokerModel: K8sResourceCommon): string => {
    if (brokerModel.spec?.brokerProperties?.length > 0) {
      for (let i = 0; i < brokerModel.spec.brokerProperties.length; i++) {
        const prefix =
          configType === ConfigType.connector
            ? 'connectorConfigurations.'
            : 'acceptorConfigurations.';
        if (brokerModel.spec.brokerProperties[i].startsWith(prefix)) {
          const fields = brokerModel.spec.brokerProperties[i].split('.', 3);
          if (fields.length === 3) {
            if (
              fields[1] === configName &&
              fields[2].startsWith('factoryClassName=')
            ) {
              const elems = brokerModel.spec.brokerProperties[i].split('=', 2);
              if (
                elems[1] ===
                'org.apache.activemq.artemis.core.remoting.impl.invm.InVMAcceptorFactory'
              ) {
                return 'invm';
              }
            }
          }
        }
      }
    }
    return 'netty';
  };

  const GetAcceptorPort = (brokerModel: K8sResourceCommon): number => {
    if (configType === ConfigType.connector) {
      if (brokerModel.spec?.connectors?.length > 0) {
        for (let i = 0; i < brokerModel.spec.connectors.length; i++) {
          if (brokerModel.spec.connectors[i].name === configName) {
            return brokerModel.spec.connectors[i].port;
          }
        }
      }
    } else {
      if (brokerModel.spec?.acceptors?.length > 0) {
        for (let i = 0; i < brokerModel.spec.acceptors.length; i++) {
          if (brokerModel.spec.acceptors[i].name === configName) {
            return brokerModel.spec.acceptors[i].port;
          }
        }
      }
    }
    return 5555;
  };

  const GetAcceptorHost = (brokerModel: K8sResourceCommon): string => {
    if (configType === ConfigType.connector) {
      if (brokerModel.spec?.connectors?.length > 0) {
        for (let i = 0; i < brokerModel.spec.connectors.length; i++) {
          if (brokerModel.spec.connectors[i].name === configName) {
            return brokerModel.spec.connectors[i].host;
          }
        }
      }
    }
    return 'localhost';
  };

  const GetAcceptorProtocols = (brokerModel: K8sResourceCommon): string => {
    if (configType === ConfigType.connector) {
      if (brokerModel.spec?.connectors?.length > 0) {
        for (let i = 0; i < brokerModel.spec.connectors.length; i++) {
          if (brokerModel.spec.connectors[i].name === configName) {
            return brokerModel.spec.connectors[i].protocols;
          }
        }
      }
    } else {
      if (brokerModel.spec?.acceptors?.length > 0) {
        for (let i = 0; i < brokerModel.spec.acceptors.length; i++) {
          if (brokerModel.spec.acceptors[i].name === configName) {
            return brokerModel.spec.acceptors[i].protocols;
          }
        }
      }
    }
    return 'ALL';
  };

  const GetAcceptorSSLEnabled = (brokerModel: K8sResourceCommon): boolean => {
    if (configType === ConfigType.connector) {
      if (brokerModel.spec?.connectors?.length > 0) {
        for (let i = 0; i < brokerModel.spec.connectors.length; i++) {
          if (brokerModel.spec.connectors[i].name === configName) {
            return brokerModel.spec.connectors[i].sslEnabled ? true : false;
          }
        }
      }
    } else {
      if (brokerModel.spec?.acceptors?.length > 0) {
        for (let i = 0; i < brokerModel.spec.acceptors.length; i++) {
          if (brokerModel.spec.acceptors[i].name === configName) {
            return brokerModel.spec.acceptors[i].sslEnabled ? true : false;
          }
        }
      }
    }
    return false;
  };

  const GetBindToAllInterfaces = (brokerModel: K8sResourceCommon): boolean => {
    if (configType === ConfigType.acceptor) {
      console.log('getting aceptor bindto', configName);
      if (brokerModel.spec?.acceptors?.length > 0) {
        for (let i = 0; i < brokerModel.spec.acceptors.length; i++) {
          if (brokerModel.spec.acceptors[i].name === configName) {
            console.log(
              'found it type is',
              typeof brokerModel.spec.acceptors[i].bindToAllInterfaces,
            );
            return brokerModel.spec.acceptors[i].bindToAllInterfaces
              ? true
              : false;
          }
        }
      }
    }
    return false;
  };

  const updateAcceptorSSLEnabled = (brokerModel: K8sResourceCommon): void => {
    if (configType === ConfigType.connector) {
      if (brokerModel.spec?.connectors?.length > 0) {
        for (let i = 0; i < brokerModel.spec.connectors.length; i++) {
          if (brokerModel.spec.connectors[i].name === configName) {
            brokerModel.spec.connectors[i].sslEnabled = isSSLEnabled;
            if (!isSSLEnabled) {
              //remove trust and ssl secrets
              delete brokerModel.spec.connectors[i].sslSecret;
              delete brokerModel.spec.connectors[i].trustSecret;
            }
          }
        }
      }
    } else {
      if (brokerModel.spec?.acceptors?.length > 0) {
        for (let i = 0; i < brokerModel.spec.acceptors.length; i++) {
          if (brokerModel.spec.acceptors[i].name === configName) {
            brokerModel.spec.acceptors[i].sslEnabled = isSSLEnabled;
            if (!isSSLEnabled) {
              //remove trust and ssl secrets
              delete brokerModel.spec.acceptors[i].sslSecret;
              delete brokerModel.spec.acceptors[i].trustSecret;
            }
          }
        }
      }
    }
  };

  const getParamKey = (): string => {
    if (configType === ConfigType.connector) {
      return 'connectorConfigurations.' + configName + '.params.';
    }
    return 'acceptorConfigurations.' + configName + '.params.';
  };

  const GetAcceptorOtherParams = (brokerModel: K8sResourceCommon): string => {
    const params: string[] = [];
    if (brokerModel.spec?.brokerProperties?.length > 0) {
      for (let i = 0; i < brokerModel.spec.brokerProperties.length; i++) {
        const paramKey = getParamKey();
        if (brokerModel.spec.brokerProperties[i].startsWith(paramKey)) {
          const portKey = paramKey + 'port=';
          const protKey = paramKey + 'protocols=';
          if (
            !brokerModel.spec.brokerProperties[i].startsWith(portKey) &&
            !brokerModel.spec.brokerProperties[i].startsWith(protKey)
          ) {
            const fields = brokerModel.spec.brokerProperties[i].split('=', 2);
            const pName = fields[0].split('.')[3];
            params.push(pName + '=' + fields[1]);
          }
        }
      }
    }
    return params.toString();
  };

  const [selectedClass, setSelectedClass] = useState(
    GetAcceptorFactoryClass(yamlData),
  );
  const [port, setPort] = useState(GetAcceptorPort(yamlData));
  const [host, setHost] = useState(GetAcceptorHost(yamlData));
  const [protocols, setProtocols] = useState(GetAcceptorProtocols(yamlData));
  const [otherParams, setOtherParams] = useState(
    GetAcceptorOtherParams(yamlData),
  );
  const [isSSLEnabled, setIsSSLEnabled] = useState(
    GetAcceptorSSLEnabled(yamlData),
  );
  const [bindToAllInterfaces, setBindToAllInterfaces] = useState(
    GetBindToAllInterfaces(yamlData),
  );

  const updateAcceptorPort = (brokerModel: K8sResourceCommon): void => {
    if (configType === ConfigType.connector) {
      if (brokerModel.spec?.connectors?.length > 0) {
        for (let i = 0; i < brokerModel.spec.connectors.length; i++) {
          if (brokerModel.spec.connectors[i].name === configName) {
            brokerModel.spec.connectors[i].port = port;
          }
        }
      }
    } else {
      if (brokerModel.spec?.acceptors?.length > 0) {
        for (let i = 0; i < brokerModel.spec.acceptors.length; i++) {
          if (brokerModel.spec.acceptors[i].name === configName) {
            brokerModel.spec.acceptors[i].port = port;
          }
        }
      }
    }
  };

  const updateAcceptorHost = (brokerModel: K8sResourceCommon): void => {
    if (
      configType === ConfigType.connector &&
      brokerModel.spec?.connectors?.length > 0
    ) {
      for (let i = 0; i < brokerModel.spec.connectors.length; i++) {
        if (brokerModel.spec.connectors[i].name === configName) {
          brokerModel.spec.connectors[i].host = host;
        }
      }
    }
  };

  const updateAcceptorBindToAllInterfaces = (
    brokerModel: K8sResourceCommon,
  ): void => {
    console.log('calling update bindto', configName, 'type', configType);
    if (
      configType === ConfigType.acceptor &&
      brokerModel.spec?.acceptors?.length > 0
    ) {
      console.log('updating bindto on acceptor', configName);
      for (let i = 0; i < brokerModel.spec.acceptors.length; i++) {
        if (brokerModel.spec.acceptors[i].name === configName) {
          console.log('found update', bindToAllInterfaces);
          brokerModel.spec.acceptors[i].bindToAllInterfaces =
            bindToAllInterfaces;
        }
      }
    }
  };

  const updateAcceptorProtocols = (brokerModel: K8sResourceCommon): void => {
    if (configType === ConfigType.connector) {
      if (brokerModel.spec?.connectors?.length > 0) {
        for (let i = 0; i < brokerModel.spec.connectors.length; i++) {
          if (brokerModel.spec.connectors[i].name === configName) {
            brokerModel.spec.connectors[i].protocols = protocols;
          }
        }
      }
    } else {
      if (brokerModel.spec?.acceptors?.length > 0) {
        for (let i = 0; i < brokerModel.spec.acceptors.length; i++) {
          if (brokerModel.spec.acceptors[i].name === configName) {
            brokerModel.spec.acceptors[i].protocols = protocols;
          }
        }
      }
    }
  };

  const getOtherParamsMap = (): Map<string, string> => {
    const pMap = new Map<string, string>();
    const params = otherParams.split(',');
    if (params?.length > 0) {
      params.forEach((p) => {
        const [pk, pv] = p.split('=');
        if (pk && pv) {
          pMap.set(pk, pv);
        }
      });
    }
    return pMap;
  };

  const isOtherParam = (pname: string): boolean => {
    return (
      pname !== 'port' &&
      pname !== 'protocols' &&
      pname !== 'host' &&
      pname !== 'bindToAllInterfaces' &&
      pname !== 'sslEnabled' &&
      pname !== 'sslSecret'
    );
  };

  const updateAcceptorOtherParams = (brokerModel: K8sResourceCommon): void => {
    //const paramSet = new Set<string>(otherParams.split(','));
    const paramMap = getOtherParamsMap();
    const paramPrefix = getParamKey();
    if (brokerModel.spec?.brokerProperties?.length > 0) {
      //update
      for (let i = 0; i < brokerModel.spec.brokerProperties.length; i++) {
        if (brokerModel.spec.brokerProperties[i].startsWith(paramPrefix)) {
          const param = brokerModel.spec.brokerProperties[i].substring(
            paramPrefix.length,
          );
          const [paramName] = param.split('=');
          if (isOtherParam(paramName)) {
            if (paramMap.has(paramName)) {
              //update
              brokerModel.spec.brokerProperties[i] =
                paramPrefix + paramName + '=' + paramMap.get(paramName);
              paramMap.delete(paramName);
            } else {
              //mark for deletion
              brokerModel.spec.brokerProperties[i] = 'mark-to-delete';
            }
          }
        }
      }
      //remove
      brokerModel.spec.brokerProperties =
        brokerModel.spec.brokerProperties.filter((x: string) => {
          return x !== 'mark-to-delete';
        });
    }
    //now new params
    paramMap.forEach((v, k) => {
      brokerModel.spec.brokerProperties.push(paramPrefix + k + '=' + v);
    });
  };

  const getConfigPrefix = () => {
    if (configType === ConfigType.connector) {
      return 'connectorConfigurations.';
    }
    return 'acceptorConfigurations.';
  };

  const updateAcceptorFactoryClass = (brokerModel: K8sResourceCommon): void => {
    for (let i = 0; i < brokerModel.spec.brokerProperties.length; i++) {
      const configPrefix = getConfigPrefix();
      if (brokerModel.spec.brokerProperties[i].startsWith(configPrefix)) {
        const fields = brokerModel.spec.brokerProperties[i].split('.', 3);
        if (fields.length === 3) {
          if (
            fields[1] === configName &&
            fields[2].startsWith('factoryClassName=')
          ) {
            if (selectedClass === 'invm') {
              brokerModel.spec.brokerProperties[i] =
                configPrefix +
                configName +
                '.factoryClassName=org.apache.activemq.artemis.core.remoting.impl.invm.InVMAcceptorFactory';
            } else {
              brokerModel.spec.brokerProperties[i] =
                configPrefix +
                configName +
                '.factoryClassName=org.apache.activemq.artemis.core.remoting.impl.netty.NettyAcceptorFactory';
            }
            break;
          }
        }
      }
    }
  };

  const onChangeClass = (value: string) => {
    setSelectedClass(value);
  };

  const onHostChange = (host: string) => {
    setHost(host);
  };

  const onPortChange = (port: string) => {
    setPort(+port);
  };

  const onProtocolsChange = (prot: string) => {
    setProtocols(prot);
  };
  const onOtherParamsChange = (params: string) => {
    setOtherParams(params);
  };

  const handleSSLEnabled = (value: boolean) => {
    setIsSSLEnabled(value);
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
    setBindToAllInterfaces(checked);
  };

  const updateAcceptor = (brokerModel: K8sResourceCommon) => {
    updateAcceptorFactoryClass(brokerModel);
    updateAcceptorPort(brokerModel);
    updateAcceptorProtocols(brokerModel);
    updateAcceptorSSLEnabled(brokerModel);
    updateAcceptorHost(brokerModel);
    updateAcceptorBindToAllInterfaces(brokerModel);
    updateAcceptorOtherParams(brokerModel);
  };

  useEffect(() => {
    setYamlData(updateAcceptor);
  }, [
    selectedClass,
    host,
    port,
    protocols,
    otherParams,
    isSSLEnabled,
    bindToAllInterfaces,
  ]);

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
        {configType === ConfigType.connector && (
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
        {configType === ConfigType.acceptor && (
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
                  namespace={yamlData.metadata.namespace}
                  isCa={false}
                  configType={configType}
                  configName={configName}
                />
              </FlexItem>
              <FlexItem>
                <CertSecretSelector
                  key={'secret-ca' + configType + configName}
                  namespace={yamlData.metadata.namespace}
                  isCa={true}
                  configType={configType}
                  configName={configName}
                />
              </FlexItem>
            </Flex>
          )}
        </FlexItem>
      </Flex>
    </>
  );
};

const GenerateUniqueName = (prefix: string, existing: Set<string>): string => {
  const limit = existing.size + 1;
  let newName;
  for (let i = 0; i < limit; i++) {
    newName = prefix + i;
    if (!existing.has(newName)) {
      break;
    }
  }
  return newName;
};

export type AcceptorConfigSectionProps = {
  configType: ConfigType;
  configName: string;
  onDeleteAcceptor: () => void;
  onUpdateAcceptor: () => void;
};

export const AcceptorConfigSection: FC<AcceptorConfigSectionProps> = ({
  configType,
  configName,
  onDeleteAcceptor,
  onUpdateAcceptor,
}) => {
  const { yamlData, setYamlData } = useContext(BrokerConfigContext);

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

  const deleteAcceptor = (brokerModel: K8sResourceCommon) => {
    const prefix =
      configType === ConfigType.connector
        ? 'connectorConfigurations.'
        : 'acceptorConfigurations.';
    if (brokerModel.spec?.brokerProperties?.length > 0) {
      const configKey = prefix + configName + '.';
      brokerModel.spec.brokerProperties =
        brokerModel.spec.brokerProperties.filter((x: string) => {
          return !x.startsWith(configKey);
        });
      if (configType === ConfigType.connector) {
        if (brokerModel.spec?.connectors?.length > 0) {
          brokerModel.spec.connectors = brokerModel.spec.connectors.filter(
            (x: { name: string }) => {
              return x.name !== configName;
            },
          );
        }
      } else {
        if (brokerModel.spec?.acceptors?.length > 0) {
          brokerModel.spec.acceptors = brokerModel.spec.acceptors.filter(
            (x: { name: string }) => {
              return x.name !== configName;
            },
          );
        }
      }
    }
  };

  const onDelete = () => {
    setYamlData(deleteAcceptor);
    onDeleteAcceptor();
  };

  const onRename = () => {
    setIsNaming(true);
  };

  const applyNewName = (newName: string) => {
    if (newName === configName) return;
    setYamlData((brokerModel: K8sResourceCommon) => {
      const prefix =
        configType === ConfigType.connector
          ? 'connectorConfigurations.'
          : 'acceptorConfigurations.';
      if (brokerModel.spec?.brokerProperties?.length > 0) {
        const configKey = prefix + configName + '.';
        const newKey = prefix + newName + '.';
        brokerModel.spec.brokerProperties =
          brokerModel.spec.brokerProperties.map((o: string) => {
            if (o.startsWith(configKey)) {
              return o.replace(configKey, newKey);
            }
            return o;
          });

        if (configType === ConfigType.connector) {
          if (brokerModel.spec?.connectors?.length > 0) {
            brokerModel.spec.connectors = brokerModel.spec.connectors.map(
              (o: { name: string }) => {
                if (o.name === configName) {
                  return { ...o, name: newName };
                }
                return o;
              },
            );
          }
        } else {
          if (brokerModel.spec?.acceptors?.length > 0) {
            brokerModel.spec.acceptors = brokerModel.spec.acceptors.map(
              (o: { name: string }) => {
                if (o.name === configName) {
                  return { ...o, name: newName };
                }
                return o;
              },
            );
          }
        }
      }
    });
    setIsNaming(false);
    onUpdateAcceptor();
  };

  const dropdownItems = [
    <DropdownItem key="action-rename" component="button" onClick={onRename}>
      Rename
    </DropdownItem>,
    <DropdownItem key="action-delete" component="button" onClick={onDelete}>
      Delete
    </DropdownItem>,
  ];

  const getAcceptorNameSet = () => {
    return getAcceptorEntries(configType, yamlData, 'set');
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
            applyNewName={applyNewName}
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

const getAcceptorEntries = (
  configType: ConfigType,
  brokerModel: K8sResourceCommon,
  resultType?: string,
): { name: string }[] | Set<string> => {
  const acceptors = new Set<string>();
  if (configType === ConfigType.connector) {
    if (brokerModel.spec?.connectors?.length > 0) {
      for (let i = 0; i < brokerModel.spec.connectors.length; i++) {
        acceptors.add(brokerModel.spec.connectors[i].name);
      }
    }
  } else {
    if (brokerModel.spec?.acceptors?.length > 0) {
      for (let i = 0; i < brokerModel.spec.acceptors.length; i++) {
        acceptors.add(brokerModel.spec.acceptors[i].name);
      }
    }
  }
  if (resultType === 'set') {
    return acceptors;
  }
  const result: { name: string }[] = [];
  acceptors.forEach((value) => result.push({ name: value }));
  return result;
};

export type AcceptorsConfigProps = {
  brokerId: number;
  configType: ConfigType;
};

export const AcceptorsConfigPage: FC<AcceptorsConfigProps> = ({
  brokerId,
  configType,
}) => {
  const brokerConfig = useContext(BrokerConfigContext);
  //for now this can make page update
  const [totalAcceptors, setTotalAcceptors] = useState(0);
  const [updateRevision, setUpdateRevision] = useState(1);

  const addNewAcceptorToModel = () => {
    const { yamlData } = brokerConfig;
    if (!yamlData.spec.brokerProperties) {
      yamlData.spec.brokerProperties = [];
    }

    const acceptorSet = getAcceptorEntries(
      configType,
      yamlData,
      'set',
    ) as Set<string>;

    const newName = GenerateUniqueName(configType, acceptorSet);

    if (configType === ConfigType.connector) {
      if (!yamlData.spec.connectors) {
        yamlData.spec.connectors = [];
      }
      yamlData.spec.connectors.push({
        name: newName,
        protocols: 'ALL',
        host: 'localhost',
        port: 5555,
      });
    } else {
      if (!yamlData.spec.acceptors) {
        yamlData.spec.acceptors = [];
      }
      yamlData.spec.acceptors.push({
        name: newName,
        protocols: 'ALL',
        port: 5555,
      });
    }

    const prefix =
      configType === ConfigType.connector
        ? 'connectorConfigurations.'
        : 'acceptorConfigurations.';

    yamlData.spec.brokerProperties.push(
      prefix +
        newName +
        '.factoryClassName=org.apache.activemq.artemis.core.remoting.impl.netty.NettyAcceptorFactory',
    );
    setTotalAcceptors(totalAcceptors + 1);
  };

  const getAcceptorsFromModel = (brokerId: number): any[] => {
    const { yamlData: brokerModel } = brokerConfig;
    const acceptors = [];

    let i = 0;
    const acceptorEntries = getAcceptorEntries(configType, brokerModel) as {
      name: string;
    }[];

    while (i < acceptorEntries.length) {
      const entry = acceptorEntries[i];

      acceptors.push(
        <ListItem key={entry.name + brokerId}>
          <AcceptorConfigSection
            configType={configType}
            configName={entry.name}
            onDeleteAcceptor={() => {
              setTotalAcceptors(totalAcceptors - 1);
            }}
            onUpdateAcceptor={() => {
              setUpdateRevision(updateRevision + 1);
            }}
          />
        </ListItem>,
      );
      i++;
    }
    return acceptors;
  };

  const configToolbarItems = (
    <Fragment>
      <ToolbarItem variant="search-filter">
        <SearchInput aria-label="search acceptors" />
      </ToolbarItem>
      <ToolbarItem>
        <Button variant="plain" onClick={addNewAcceptorToModel}>
          +
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
