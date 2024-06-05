import { AddBrokerResourceValues as FormState } from './import-types';
import { K8sResourceKind, K8sResourceCommon as ArtemisCR } from '../../utils';
import { createContext } from 'react';
import { ConfigType } from '../../configuration/broker-models';
import { SelectOptionObject } from '@patternfly/react-core';

export enum EditorType {
  BROKER = 'broker',
  YAML = 'yaml',
}

export enum ExposeMode {
  route = 'route',
  ingress = 'ingress',
}

export const BrokerCreationFormState = createContext<FormState>({});
export const BrokerCreationFormDispatch =
  createContext<React.Dispatch<ArtemisReducerActions>>(null);

export const newArtemisCRState = (namespace: string): FormState => {
  const initialCr: ArtemisCR = {
    apiVersion: 'broker.amq.io/v1beta1',
    kind: 'ActiveMQArtemis',
    metadata: {
      name: 'ex-aao',
      namespace: namespace,
    },
    spec: {
      adminUser: 'admin',
      adminPassword: 'admin',
      console: {
        expose: true,
      },
      deploymentPlan: {
        image: 'placeholder',
        requireLogin: false,
        size: 1,
      },
    },
  };

  return {
    shouldShowYAMLMessage: true,
    editorType: EditorType.BROKER,
    cr: initialCr,
  };
};

export const convertYamlToForm = (yamlBroker: K8sResourceKind) => {
  const { metadata } = yamlBroker;

  const newFormData = {
    ...yamlBroker,
    metadata: {
      ...metadata,
      name: metadata.name,
    },
    spec: yamlBroker.spec,
  };

  return newFormData;
};

// Reducer

export enum ArtemisReducerOperations {
  /** adds a new acceptor to the cr */
  addAcceptor,
  /** adds a or connector to the cr */
  addConnector,
  /** decrements the total number of replicas by one */
  decrementReplicas,
  /** delete an acceptor */
  deleteAcceptor,
  /** delete a connector */
  deleteConnector,
  /** increment the total number of replicas by one */
  incrementReplicas,
  /** Sets if the acceptor should bind to all the interfaces or not */
  setAcceptorBindToAllInterfaces,
  /** Renames an acceptor */
  setAcceptorName,
  /** Updates any other parameters */
  setAcceptorOtherParams,
  /** Updates the port */
  setAcceptorPort,
  /** Updates the supported protocols */
  setAcceptorProtocols,
  /** Sets if SSL is enabled or not */
  setAcceptorSSLEnabled,
  /** Renames an acceptor or a connector */
  setAcceptorSecret,
  /** updates the broker name */
  setBrokerName,
  /** Sets if the connector should bind to all the interfaces or not */
  setConnectorBindToAllInterfaces,
  /** Updates the Connector's host */
  setConnectorHost,
  /** Renames a connector */
  setConnectorName,
  /** Updates any other parameters of the connector */
  setConnectorOtherParams,
  /** Updates the port of the connector */
  setConnectorPort,
  /** Updates the supported protocols */
  setConnectorProtocols,
  /** Sets if SSL is enabled or not */
  setConnectorSSLEnabled,
  /** Renames a connector */
  setConnectorSecret,
  /** Updates the console credentials */
  setConsoleCredentials,
  /** set is the console is exposed or not */
  setConsoleExpose,
  /** changes the expose mode of the console */
  setConsoleExposeMode,
  /** set if the console has ssl enabled or not */
  setConsoleSSLEnabled,
  /** Renames an acceptor or a connector */
  setConsoleSecret,
  /** set the editor to use in the UX*/
  setEditorType,
  /** update the namespace of the CR */
  setNamespace,
  /** update the total number of replicas */
  setReplicasNumber,
  /** Updates the configuration's factory Class */
  updateAcceptorFactoryClass,
  /** Updates the configuration's factory Class */
  updateConnectorFactoryClass,
}

type ArtemisReducerActionBase = {
  /** which transformation to apply onto the state */
  operation: ArtemisReducerOperations;
};

type ArtemisReducerActions =
  | AddAcceptorAction
  | AddConnectorAction
  | DecrementReplicasAction
  | DeleteAcceptorAction
  | DeleteConnectorAction
  | IncrementReplicasAction
  | SetAcceptorBindToAllInterfacesAction
  | SetAcceptorNameAction
  | SetAcceptorOtherParamsAction
  | SetAcceptorPortAction
  | SetAcceptorProtocolsAction
  | SetAcceptorSSLEnabledAction
  | SetAcceptorSecretAction
  | SetBrokerNameAction
  | SetConnectorBindToAllInterfacesAction
  | SetConnectorHostAction
  | SetConnectorNameAction
  | SetConnectorOtherParamsAction
  | SetConnectorPortAction
  | SetConnectorProtocolsAction
  | SetConnectorSSLEnabledAction
  | SetConnectorSecretAction
  | SetConsoleCredentialsAction
  | SetConsoleExposeAction
  | SetConsoleExposeModeAction
  | SetConsoleSSLEnabled
  | SetConsoleSecretAction
  | SetEditorTypeAction
  | SetNamespaceAction
  | SetReplicasNumberAction
  | UpdateAcceptorFactoryClassAction
  | UpdateConnectorFactoryClassAction;

interface AddAcceptorAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.addAcceptor;
}

interface AddConnectorAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.addConnector;
}

interface DecrementReplicasAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.decrementReplicas;
}

interface DeleteAcceptorAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.deleteAcceptor;
  /** the name of the acceptor */
  payload: string;
}

interface DeleteConnectorAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.deleteConnector;
  /** the name of the acceptor */
  payload: string;
}

interface IncrementReplicasAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.incrementReplicas;
}

interface SetBrokerNameAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setBrokerName;
  /** the name of the broker */
  payload: string;
}

type ConsoleCredentialsPayload = {
  /** the username to login to the console */
  adminUser: string;
  /** the password to login to the console */
  adminPassword: string;
};

interface SetConsoleCredentialsAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setConsoleCredentials;
  /** the new credentials */
  payload: ConsoleCredentialsPayload;
}

interface SetConsoleExposeAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setConsoleExpose;
  /** is the console exposed */
  payload: boolean;
}

interface SetConsoleExposeModeAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setConsoleExposeMode;
  /** how is the console exposed */
  payload: ExposeMode;
}

interface SetConsoleSSLEnabled extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setConsoleSSLEnabled;
  /** is ssl enabled for the console */
  payload: boolean;
}

interface SetEditorTypeAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setEditorType;
  /* What editor the user wants to use */
  payload: EditorType;
}

type BindToAllInterfacesPayload = {
  /** name of the element to update */
  name: string;
  /** bind to all the interfaces or not*/
  bindToAllInterfaces: boolean;
};

interface SetAcceptorBindToAllInterfacesAction
  extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setAcceptorBindToAllInterfaces;
  payload: BindToAllInterfacesPayload;
}

interface SetConnectorBindToAllInterfacesAction
  extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setConnectorBindToAllInterfaces;
  payload: BindToAllInterfacesPayload;
}

type FactoryClassPayload = {
  /** the name of the element */
  name: string;
  /** the java class to set */
  class: string;
};

interface UpdateAcceptorFactoryClassAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.updateAcceptorFactoryClass;
  payload: FactoryClassPayload;
}

interface UpdateConnectorFactoryClassAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.updateConnectorFactoryClass;
  payload: FactoryClassPayload;
}

type UpdateConnectorHostPayload = {
  /** the name of the configuration */
  connectorName: string;
  /** the new host of the configuration */
  host: string;
};

interface SetConnectorHostAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setConnectorHost;
  payload: UpdateConnectorHostPayload;
}

type RenamePayload = {
  /** the name of the element */
  oldName: string;
  /** the new name of the element */
  newName: string;
};

interface SetAcceptorNameAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setAcceptorName;
  payload: RenamePayload;
}

interface SetConnectorNameAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setConnectorName;
  payload: RenamePayload;
}

type OtherParamsPayload = {
  /** the name of the configuration */
  name: string;
  /** a comma separated list of extra parameters */
  otherParams: string;
};

interface SetAcceptorOtherParamsAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setAcceptorOtherParams;
  payload: OtherParamsPayload;
}

interface SetConnectorOtherParamsAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setConnectorOtherParams;
  payload: OtherParamsPayload;
}

type PortPayload = {
  /** the name of the configuration */
  name: string;
  /** the new port of the configuration */
  port: number;
};

interface SetAcceptorPortAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setAcceptorPort;
  payload: PortPayload;
}

interface SetConnectorPortAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setConnectorPort;
  payload: PortPayload;
}

type ProtocolsPayload = {
  /** the name of the configuration */
  configName: string;
  /** A comma separated list of protocols */
  protocols: string;
};

interface SetAcceptorProtocolsAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setAcceptorProtocols;
  payload: ProtocolsPayload;
}

interface SetConnectorProtocolsAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setConnectorProtocols;
  payload: ProtocolsPayload;
}

type SSLEnabledPayload = {
  /** the name of the element */
  name: string;
  /** if ssl is enabled or not */
  sslEnabled: boolean;
};

interface SetAcceptorSSLEnabledAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setAcceptorSSLEnabled;
  payload: SSLEnabledPayload;
}

interface SetConnectorSSLEnabledAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setConnectorSSLEnabled;
  payload: SSLEnabledPayload;
}

type SecretPayload = {
  /** the name of the configuration */
  name: string;
  /** the secret of the configuration */
  secret: SelectOptionObject;
  /** the secret is a certificate */
  isCa: boolean;
};

interface SetAcceptorSecretAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setAcceptorSecret;
  payload: SecretPayload;
}

interface SetConnectorSecretAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setConnectorSecret;
  payload: SecretPayload;
}

interface SetConsoleSecretAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setConsoleSecret;
  payload: SecretPayload;
}

interface SetNamespaceAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setNamespace;
  /** the new namespace for the CR */
  payload: string;
}

interface SetReplicasNumberAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setReplicasNumber;
  /** the total number of replicas */
  payload: number;
}

/**
 *
 * The core of the reducer functionality. Switch case on the Action and apply
 * its effects on a copy of the state. Must return the copy of the state after
 * the modifications are applied
 *
 */
export const artemisCrReducer: React.Reducer<
  FormState,
  ArtemisReducerActions
> = (prevFormState, action) => {
  const formState = { ...prevFormState };

  // set the individual fields
  switch (action.operation) {
    case ArtemisReducerOperations.setEditorType:
      formState.editorType = action.payload;
      break;
    case ArtemisReducerOperations.setNamespace:
      formState.cr.metadata.namespace = action.payload;
      break;
    case ArtemisReducerOperations.setReplicasNumber:
      formState.cr.spec.deploymentPlan.size = action.payload;
      break;
    case ArtemisReducerOperations.incrementReplicas:
      formState.cr.spec.deploymentPlan.size += 1;
      break;
    case ArtemisReducerOperations.decrementReplicas:
      formState.cr.spec.deploymentPlan.size -= 1;
      if (formState.cr.spec.deploymentPlan.size < 1) {
        formState.cr.spec.deploymentPlan.size = 1;
      }
      break;
    case ArtemisReducerOperations.setBrokerName:
      formState.cr.metadata.name = action.payload;
      break;
    case ArtemisReducerOperations.addAcceptor:
      addConfig(formState.cr, ConfigType.acceptors);
      break;
    case ArtemisReducerOperations.addConnector:
      addConfig(formState.cr, ConfigType.connectors);
      break;
    case ArtemisReducerOperations.deleteAcceptor:
      deleteConfig(formState.cr, ConfigType.acceptors, action.payload);
      break;
    case ArtemisReducerOperations.deleteConnector:
      deleteConfig(formState.cr, ConfigType.connectors, action.payload);
      break;
    case ArtemisReducerOperations.setAcceptorName:
      renameConfig(
        formState.cr,
        ConfigType.acceptors,
        action.payload.oldName,
        action.payload.newName,
      );
      break;
    case ArtemisReducerOperations.setConnectorName:
      renameConfig(
        formState.cr,
        ConfigType.connectors,
        action.payload.oldName,
        action.payload.newName,
      );
      break;
    case ArtemisReducerOperations.setAcceptorSecret:
      updateConfigSecret(
        formState.cr,
        ConfigType.acceptors,
        action.payload.secret,
        action.payload.name,
        action.payload.isCa,
      );
      break;
    case ArtemisReducerOperations.setConnectorSecret:
      updateConfigSecret(
        formState.cr,
        ConfigType.connectors,
        action.payload.secret,
        action.payload.name,
        action.payload.isCa,
      );
      break;
    case ArtemisReducerOperations.setConsoleSecret:
      updateConfigSecret(
        formState.cr,
        ConfigType.console,
        action.payload.secret,
        action.payload.name,
        action.payload.isCa,
      );
      break;
    case ArtemisReducerOperations.setConsoleSSLEnabled:
      formState.cr.spec.console.sslEnabled = action.payload;
      break;
    case ArtemisReducerOperations.setConsoleExposeMode:
      formState.cr.spec.console.exposeMode = action.payload;
      break;
    case ArtemisReducerOperations.setConsoleExpose:
      formState.cr.spec.console.expose = action.payload;
      break;
    case ArtemisReducerOperations.setConsoleCredentials:
      formState.cr.spec.console.adminUser = action.payload.adminUser;
      formState.cr.spec.console.adminPassword = action.payload.adminPassword;
      break;
    case ArtemisReducerOperations.setAcceptorPort:
      updateConfigPort(
        formState.cr,
        ConfigType.acceptors,
        action.payload.name,
        action.payload.port,
      );
      break;
    case ArtemisReducerOperations.setConnectorPort:
      updateConfigPort(
        formState.cr,
        ConfigType.connectors,
        action.payload.name,
        action.payload.port,
      );
      break;
    case ArtemisReducerOperations.setConnectorHost:
      updateConnectorHost(
        formState.cr,
        action.payload.connectorName,
        action.payload.host,
      );
      break;
    case ArtemisReducerOperations.setAcceptorBindToAllInterfaces:
      updateConfigBindToAllInterfaces(
        formState.cr,
        ConfigType.acceptors,
        action.payload.name,
        action.payload.bindToAllInterfaces,
      );
      break;
    case ArtemisReducerOperations.setConnectorBindToAllInterfaces:
      updateConfigBindToAllInterfaces(
        formState.cr,
        ConfigType.connectors,
        action.payload.name,
        action.payload.bindToAllInterfaces,
      );
      break;
    case ArtemisReducerOperations.setAcceptorProtocols:
      updateConfigProtocols(
        formState.cr,
        ConfigType.acceptors,
        action.payload.configName,
        action.payload.protocols,
      );
      break;
    case ArtemisReducerOperations.setConnectorProtocols:
      updateConfigProtocols(
        formState.cr,
        ConfigType.connectors,
        action.payload.configName,
        action.payload.protocols,
      );
      break;
    case ArtemisReducerOperations.setAcceptorOtherParams:
      updateConfigOtherParams(
        formState.cr,
        ConfigType.acceptors,
        action.payload.name,
        action.payload.otherParams,
      );
      break;
    case ArtemisReducerOperations.setConnectorOtherParams:
      updateConfigOtherParams(
        formState.cr,
        ConfigType.connectors,
        action.payload.name,
        action.payload.otherParams,
      );
      break;
    case ArtemisReducerOperations.setAcceptorSSLEnabled:
      updateConfigSSLEnabled(
        formState.cr,
        ConfigType.acceptors,
        action.payload.name,
        action.payload.sslEnabled,
      );
      break;
    case ArtemisReducerOperations.setConnectorSSLEnabled:
      updateConfigSSLEnabled(
        formState.cr,
        ConfigType.connectors,
        action.payload.name,
        action.payload.sslEnabled,
      );
      break;
    case ArtemisReducerOperations.updateAcceptorFactoryClass:
      updateConfigFactoryClass(
        formState.cr,
        ConfigType.acceptors,
        action.payload.name,
        action.payload.class,
      );
      break;
    case ArtemisReducerOperations.updateConnectorFactoryClass:
      updateConfigFactoryClass(
        formState.cr,
        ConfigType.connectors,
        action.payload.name,
        action.payload.class,
      );
      break;
    default:
      throw Error('Unknown action: ' + action);
  }

  return formState;
};

// function used by the reducer to update the state

const generateUniqueName = (prefix: string, existing: Set<string>): string => {
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

const initSpec = (cr: ArtemisCR) => {
  if (!cr.spec.connectors) {
    cr.spec.connectors = [];
  }
};

const addConfig = (cr: ArtemisCR, configType: ConfigType) => {
  if (!cr.spec.brokerProperties) {
    cr.spec.brokerProperties = [];
  }

  const acceptorSet = listConfigs(configType, cr, 'set') as Set<string>;

  const newName = generateUniqueName(configType, acceptorSet);

  if (configType === ConfigType.connectors) {
    initSpec(cr);
    cr.spec.connectors.push({
      name: newName,
      protocols: 'ALL',
      host: 'localhost',
      port: 5555,
    });
  } else {
    if (!cr.spec.acceptors) {
      cr.spec.acceptors = [];
    }
    cr.spec.acceptors.push({
      name: newName,
      protocols: 'ALL',
      port: 5555,
    });
  }

  const prefix =
    configType === ConfigType.connectors
      ? 'connectorConfigurations.'
      : 'acceptorConfigurations.';

  cr.spec.brokerProperties.push(
    prefix +
      newName +
      '.factoryClassName=org.apache.activemq.artemis.core.remoting.impl.netty.NettyAcceptorFactory',
  );
};

const deleteConfig = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
) => {
  const prefix =
    configType === ConfigType.connectors
      ? 'connectorConfigurations.'
      : 'acceptorConfigurations.';
  if (brokerModel.spec?.brokerProperties?.length > 0) {
    const configKey = prefix + configName + '.';
    brokerModel.spec.brokerProperties =
      brokerModel.spec.brokerProperties.filter((x: string) => {
        return !x.startsWith(configKey);
      });
    if (configType === ConfigType.connectors) {
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

const renameConfig = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  previousName: string,
  newName: string,
) => {
  // TODO make sure the rename function makes sure the names are actually
  // unique
  const prefix =
    configType === ConfigType.connectors
      ? 'connectorConfigurations.'
      : 'acceptorConfigurations.';
  if (brokerModel.spec?.brokerProperties?.length > 0) {
    const configKey = prefix + previousName + '.';
    const newKey = prefix + newName + '.';
    brokerModel.spec.brokerProperties = brokerModel.spec.brokerProperties.map(
      (o: string) => {
        if (o.startsWith(configKey)) {
          return o.replace(configKey, newKey);
        }
        return o;
      },
    );

    if (configType === ConfigType.connectors) {
      if (brokerModel.spec?.connectors?.length > 0) {
        brokerModel.spec.connectors = brokerModel.spec.connectors.map(
          (o: { name: string }) => {
            if (o.name === previousName) {
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
            if (o.name === previousName) {
              return { ...o, name: newName };
            }
            return o;
          },
        );
      }
    }
  }
};

const updateConfigSecret = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  secret: SelectOptionObject,
  configName: string,
  isCa: boolean,
) => {
  console.log('updating model with secret', secret);
  if (configType === ConfigType.connectors) {
    if (brokerModel.spec?.connectors?.length > 0) {
      for (let i = 0; i < brokerModel.spec.connectors.length; i++) {
        if (brokerModel.spec.connectors[i].name === configName) {
          if (isCa) {
            if (secret) {
              brokerModel.spec.connectors[i].trustSecret = secret.toString();
            } else {
              delete brokerModel.spec.connectors[i].trustSecret;
            }
          } else {
            if (secret) {
              brokerModel.spec.connectors[i].sslSecret = secret.toString();
            } else {
              delete brokerModel.spec.connectors[i].sslSecret;
            }
          }
        }
      }
    }
  } else if (configType === ConfigType.acceptors) {
    console.log('upate for acceptor', configName);
    if (brokerModel.spec?.acceptors?.length > 0) {
      console.log('has some acceptor already');
      for (let i = 0; i < brokerModel.spec.acceptors.length; i++) {
        if (brokerModel.spec.acceptors[i].name === configName) {
          console.log('found selector, selected', secret);
          if (isCa) {
            if (secret) {
              brokerModel.spec.acceptors[i].trustSecret = secret.toString();
            } else {
              delete brokerModel.spec.acceptors[i].trustSecret;
            }
          } else {
            console.log('is cert', secret);
            if (secret) {
              brokerModel.spec.acceptors[i].sslSecret = secret.toString();
            } else {
              delete brokerModel.spec.acceptors[i].sslSecret;
            }
          }
        }
      }
    }
  } else {
    if (brokerModel.spec?.console) {
      if (isCa) {
        if (secret) {
          brokerModel.spec.console.trustSecret = secret.toString();
        } else {
          delete brokerModel.spec.console.trustSecret;
        }
      } else {
        if (secret) {
          brokerModel.spec.console.sslSecret = secret.toString();
        } else {
          delete brokerModel.spec.console.sslSecret;
        }
      }
    }
  }
};

const updateConfigPort = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
  port: number,
): void => {
  if (configType === ConfigType.connectors) {
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

const updateConnectorHost = (
  brokerModel: ArtemisCR,
  connectorName: string,
  host: string,
): void => {
  if (brokerModel.spec?.connectors?.length > 0) {
    for (let i = 0; i < brokerModel.spec.connectors.length; i++) {
      if (brokerModel.spec.connectors[i].name === connectorName) {
        brokerModel.spec.connectors[i].host = host;
      }
    }
  }
};

const updateConfigBindToAllInterfaces = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
  bindToAllInterfaces: boolean,
): void => {
  console.log('calling update bindto', configName, 'type', configType);
  if (
    configType === ConfigType.acceptors &&
    brokerModel.spec?.acceptors?.length > 0
  ) {
    console.log('updating bindto on acceptor', configName);
    for (let i = 0; i < brokerModel.spec.acceptors.length; i++) {
      if (brokerModel.spec.acceptors[i].name === configName) {
        console.log('found update', bindToAllInterfaces);
        brokerModel.spec.acceptors[i].bindToAllInterfaces = bindToAllInterfaces;
      }
    }
  }
};

const updateConfigProtocols = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
  protocols: string,
): void => {
  if (configType === ConfigType.connectors) {
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

const updateConfigOtherParams = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
  otherParams: string,
): void => {
  const getOtherParamsMap = (otherParams: string): Map<string, string> => {
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
  //const paramSet = new Set<string>(otherParams.split(','));
  const paramMap = getOtherParamsMap(otherParams);
  const paramPrefix = getConfigParamKey(configType, configName);
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

const updateConfigSSLEnabled = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
  isSSLEnabled: boolean,
): void => {
  if (configType === ConfigType.connectors) {
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

const updateConfigFactoryClass = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
  selectedClass: string,
): void => {
  const getConfigPrefix = (configType: ConfigType) => {
    if (configType === ConfigType.connectors) {
      return 'connectorConfigurations.';
    }
    return 'acceptorConfigurations.';
  };
  for (let i = 0; i < brokerModel.spec.brokerProperties.length; i++) {
    const configPrefix = getConfigPrefix(configType);
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

// Getters

export const getConfigSecret = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
  isCa: boolean,
): SelectOptionObject => {
  const newOptionObject = (value: string): SelectOptionObject => {
    return {
      toString() {
        return value;
      },
    };
  };
  console.log('getting secret from yaml', configName, 'idCa', isCa);
  if (configType === ConfigType.connectors) {
    if (brokerModel.spec?.connectors?.length > 0) {
      for (let i = 0; i < brokerModel.spec.connectors.length; i++) {
        if (brokerModel.spec.connectors[i].name === configName) {
          if (isCa) {
            if (brokerModel.spec.connectors[i].trustSecret) {
              return newOptionObject(
                brokerModel.spec.connectors[i].trustSecret,
              );
            }
          } else if (brokerModel.spec.connectors[i].sslSecret) {
            return newOptionObject(brokerModel.spec.connectors[i].sslSecret);
          }
        }
      }
    }
  } else if (configType === ConfigType.acceptors) {
    console.log('looking for acceptor secrets');
    if (brokerModel.spec?.acceptors?.length > 0) {
      for (let i = 0; i < brokerModel.spec.acceptors.length; i++) {
        console.log('acceptor ' + i + brokerModel.spec.acceptors[i].name);
        if (brokerModel.spec.acceptors[i].name === configName) {
          console.log('name matches');
          if (isCa) {
            console.log('for ca');
            if (brokerModel.spec.acceptors[i].trustSecret) {
              return newOptionObject(brokerModel.spec.acceptors[i].trustSecret);
            }
          } else if (brokerModel.spec.acceptors[i].sslSecret) {
            console.log('for ssl' + brokerModel.spec.acceptors[i].sslSecret);
            return newOptionObject(brokerModel.spec.acceptors[i].sslSecret);
          }
        }
      }
    }
  } else {
    console.log('console secret');
    if (isCa) {
      if (brokerModel.spec.console.trustSecret) {
        return newOptionObject(brokerModel.spec.console.trustSecret);
      }
    } else if (brokerModel.spec.console.sslSecret) {
      return newOptionObject(brokerModel.spec.console.sslSecret);
    }
  }
  console.log('nothing found');
  return '';
};

export const getConfigFactoryClass = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
): string => {
  if (brokerModel.spec?.brokerProperties?.length > 0) {
    for (let i = 0; i < brokerModel.spec.brokerProperties.length; i++) {
      const prefix =
        configType === ConfigType.connectors
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

export const getConfigPort = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
): number => {
  if (configType === ConfigType.connectors) {
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

export const getConfigHost = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
): string => {
  if (configType === ConfigType.connectors) {
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

export const getConfigProtocols = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
): string => {
  if (configType === ConfigType.connectors) {
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

export const getConfigBindToAllInterfaces = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
): boolean => {
  if (configType === ConfigType.acceptors) {
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

const getConfigParamKey = (
  configType: ConfigType,
  configName: string,
): string => {
  if (configType === ConfigType.connectors) {
    return 'connectorConfigurations.' + configName + '.params.';
  }
  return 'acceptorConfigurations.' + configName + '.params.';
};

export const getConfigOtherParams = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
): string => {
  const params: string[] = [];
  if (brokerModel.spec?.brokerProperties?.length > 0) {
    for (let i = 0; i < brokerModel.spec.brokerProperties.length; i++) {
      const paramKey = getConfigParamKey(configType, configName);
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

export const listConfigs = (
  configType: ConfigType,
  brokerModel: ArtemisCR,
  resultType?: string,
): { name: string }[] | Set<string> => {
  const acceptors = new Set<string>();
  if (configType === ConfigType.connectors) {
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

export const getConfigSSLEnabled = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
): boolean => {
  if (configType === ConfigType.connectors) {
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
