import { AddBrokerResourceValues } from './import-types';
import { K8sResourceKind, K8sResourceCommon as ArtemisCR } from '../../utils';
import { createContext } from 'react';
import { ConfigType } from '@app/configuration/broker-models';
import { SelectOptionObject } from '@patternfly/react-core';

export enum EditorType {
  BROKER = 'broker',
  YAML = 'yaml',
}

export const BrokerConfigContext = createContext<AddBrokerResourceValues>({});
export const BrokerDispatchContext =
  createContext<React.Dispatch<ArtemisReducerAction>>(null);

export const addBrokerInitialValues = (
  namespace: string,
): AddBrokerResourceValues => {
  const initialFormData: ArtemisCR = {
    apiVersion: 'broker.amq.io/v1beta1',
    kind: 'ActiveMQArtemis',
    metadata: {
      name: 'ex-aao',
      namespace,
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
    yamlData: initialFormData,
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

export enum ArtemisReducerActions {
  addNewAcceptorToModel,
  decrementReplicas,
  deleteAcceptor,
  incrementReplicas,
  setBrokerName,
  setConsoleCredentials,
  setConsoleExpose,
  setConsoleExposeMode,
  setConsoleSSLEnabled,
  setEditorType,
  updateAcceptorBindToAllInterfaces,
  updateAcceptorFactoryClass,
  updateAcceptorHost,
  updateAcceptorOtherParams,
  updateAcceptorPort,
  updateAcceptorProtocols,
  updateAcceptorSSLEnabled,
  updateReclicasNumber,
  updatingAcceptorName,
  updatingAcceptorSecret,
}

export type ArtemisReducerAction = {
  operation: ArtemisReducerActions;
  payload?:
    | AddBrokerResourceValues
    | ConsoleCredentialsPayload
    | DeleteAcceptorPayload
    | EditorType
    | ExposeMode
    | RenameAcceptorPayload
    | UpdateAcceptorBindToAllInterfacesPayload
    | UpdateAcceptorFactoryClassPayload
    | UpdateAcceptorHostPayload
    | UpdateAcceptorOtherParamsPayload
    | UpdateAcceptorOtherParamsPayload
    | UpdateAcceptorProtocolsPayload
    | UpdateAcceptorSSLEnabledPayload
    | UpdateAcceptorSecretPayload
    | UpdateAcceptorFactoryClassPayload
    | UpdateAcceptorPortPayload
    | boolean
    | number
    | string;
};

export const artemisCrReducer: React.Reducer<
  AddBrokerResourceValues,
  ArtemisReducerAction
> = (prevBrokerModel, action) => {
  const brokerModel = { ...prevBrokerModel };

  // set the individual fields
  switch (action.operation) {
    case ArtemisReducerActions.setEditorType:
      if (typeof action.payload !== 'string') {
        throw Error(
          'action: ' + action.operation + ' needs arg of type string',
        );
      }
      brokerModel.editorType = action.payload as EditorType;
      break;
    case ArtemisReducerActions.updateReclicasNumber:
      if (typeof action.payload !== 'number') {
        throw Error(
          'action: ' + action.operation + ' needs arg of type number',
        );
      }
      brokerModel.yamlData.spec.deploymentPlan.size = action.payload;
      break;
    case ArtemisReducerActions.incrementReplicas:
      brokerModel.yamlData.spec.deploymentPlan.size += 1;
      break;
    case ArtemisReducerActions.decrementReplicas:
      brokerModel.yamlData.spec.deploymentPlan.size -= 1;
      break;
    case ArtemisReducerActions.setBrokerName:
      if (typeof action.payload !== 'string') {
        throw Error(
          'action: ' + action.operation + ' needs arg of type string',
        );
      }
      brokerModel.yamlData.metadata.name = action.payload;
      break;
    case ArtemisReducerActions.addNewAcceptorToModel:
      if (typeof action.payload !== 'string') {
        throw Error(
          'action: ' + action.operation + ' needs arg of type string',
        );
      }
      addAcceptor(brokerModel.yamlData, action.payload as ConfigType);
      break;
    case ArtemisReducerActions.deleteAcceptor:
      if (typeof action.payload !== 'object') {
        throw Error(
          'action: ' + action.operation + ' needs arg of type object',
        );
      }
      deleteAcceptor(
        brokerModel.yamlData,
        (action.payload as DeleteAcceptorPayload).configType,
        (action.payload as DeleteAcceptorPayload).acceptorName,
      );
      break;
    case ArtemisReducerActions.updatingAcceptorName:
      if (typeof action.payload !== 'object') {
        throw Error(
          'action: ' + action.operation + ' needs arg of type object',
        );
      }
      renameAcceptor(
        brokerModel.yamlData,
        (action.payload as RenameAcceptorPayload).configType,
        (action.payload as RenameAcceptorPayload).acceptorName,
        (action.payload as RenameAcceptorPayload).newName,
      );
      break;
    case ArtemisReducerActions.updatingAcceptorSecret:
      if (typeof action.payload !== 'object') {
        throw Error(
          'action: ' + action.operation + ' needs arg of type object',
        );
      }
      updateAcceptorSecret(
        brokerModel.yamlData,
        (action.payload as UpdateAcceptorSecretPayload).configType,
        (action.payload as UpdateAcceptorSecretPayload).secret,
        (action.payload as UpdateAcceptorSecretPayload).acceptorName,
        (action.payload as UpdateAcceptorSecretPayload).isCa,
      );
      break;
    case ArtemisReducerActions.setConsoleSSLEnabled:
      if (typeof action.payload !== 'boolean') {
        throw Error(
          'action: ' + action.operation + ' needs arg of type boolean',
        );
      }
      brokerModel.yamlData.spec.console.sslEnabled = action.payload;
      break;
    case ArtemisReducerActions.setConsoleExposeMode:
      if (typeof action.payload !== 'string') {
        throw Error(
          'action: ' + action.operation + ' needs arg of type string',
        );
      }
      brokerModel.yamlData.spec.console.exposeMode = action.payload;
      break;
    case ArtemisReducerActions.setConsoleExpose:
      if (typeof action.payload !== 'boolean') {
        throw Error(
          'action: ' + action.operation + ' needs arg of type boolean',
        );
      }
      brokerModel.yamlData.spec.console.expose = action.payload;
      break;
    case ArtemisReducerActions.setConsoleCredentials:
      if (typeof action.payload !== 'object') {
        throw Error(
          'action: ' + action.operation + ' needs arg of type object',
        );
      }
      brokerModel.yamlData.spec.console.adminUser = (
        action.payload as ConsoleCredentialsPayload
      ).adminUser;
      brokerModel.yamlData.spec.console.adminPassword = (
        action.payload as ConsoleCredentialsPayload
      ).adminPassword;
      break;
    case ArtemisReducerActions.updateAcceptorPort:
      if (typeof action.payload !== 'object') {
        throw Error(
          'action: ' + action.operation + ' needs arg of type object',
        );
      }
      updateAcceptorPort(
        brokerModel.yamlData,
        (action.payload as UpdateAcceptorPortPayload).configType,
        (action.payload as UpdateAcceptorPortPayload).configName,
        (action.payload as UpdateAcceptorPortPayload).port,
      );
      break;
    case ArtemisReducerActions.updateAcceptorHost:
      if (typeof action.payload !== 'object') {
        throw Error(
          'action: ' + action.operation + ' needs arg of type object',
        );
      }
      updateAcceptorHost(
        brokerModel.yamlData,
        (action.payload as UpdateAcceptorHostPayload).configType,
        (action.payload as UpdateAcceptorHostPayload).configName,
        (action.payload as UpdateAcceptorHostPayload).host,
      );
      break;
    case ArtemisReducerActions.updateAcceptorBindToAllInterfaces:
      if (typeof action.payload !== 'object') {
        throw Error(
          'action: ' + action.operation + ' needs arg of type object',
        );
      }
      updateAcceptorBindToAllInterfaces(
        brokerModel.yamlData,
        (action.payload as UpdateAcceptorBindToAllInterfacesPayload).configType,
        (action.payload as UpdateAcceptorBindToAllInterfacesPayload).configName,
        (action.payload as UpdateAcceptorBindToAllInterfacesPayload)
          .bindToAllInterfaces,
      );
      break;
    case ArtemisReducerActions.updateAcceptorProtocols:
      if (typeof action.payload !== 'object') {
        throw Error(
          'action: ' + action.operation + ' needs arg of type object',
        );
      }
      updateAcceptorProtocols(
        brokerModel.yamlData,
        (action.payload as UpdateAcceptorProtocolsPayload).configType,
        (action.payload as UpdateAcceptorProtocolsPayload).configName,
        (action.payload as UpdateAcceptorProtocolsPayload).protocols,
      );
      break;
    case ArtemisReducerActions.updateAcceptorOtherParams:
      if (typeof action.payload !== 'object') {
        throw Error(
          'action: ' + action.operation + ' needs arg of type object',
        );
      }
      updateAcceptorOtherParams(
        brokerModel.yamlData,
        (action.payload as UpdateAcceptorOtherParamsPayload).configType,
        (action.payload as UpdateAcceptorOtherParamsPayload).configName,
        (action.payload as UpdateAcceptorOtherParamsPayload).otherParams,
      );
      break;
    case ArtemisReducerActions.updateAcceptorSSLEnabled:
      if (typeof action.payload !== 'object') {
        throw Error(
          'action: ' + action.operation + ' needs arg of type object',
        );
      }
      updateAcceptorSSLEnabled(
        brokerModel.yamlData,
        (action.payload as UpdateAcceptorSSLEnabledPayload).configType,
        (action.payload as UpdateAcceptorSSLEnabledPayload).configName,
        (action.payload as UpdateAcceptorSSLEnabledPayload).sslEnabled,
      );
      break;
    case ArtemisReducerActions.updateAcceptorFactoryClass:
      if (typeof action.payload !== 'object') {
        throw Error(
          'action: ' + action.operation + ' needs arg of type object',
        );
      }
      updateAcceptorFactoryClass(
        brokerModel.yamlData,
        (action.payload as UpdateAcceptorFactoryClassPayload).configType,
        (action.payload as UpdateAcceptorFactoryClassPayload).configName,
        (action.payload as UpdateAcceptorFactoryClassPayload).selectedClass,
      );
      break;
    default:
      throw Error('Unknown action: ' + action);
  }

  return brokerModel;
};

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

const initSpec = (yamlData: ArtemisCR) => {
  if (!yamlData.spec.connectors) {
    yamlData.spec.connectors = [];
  }
};

const addAcceptor = (yamlData: ArtemisCR, configType: ConfigType) => {
  if (!yamlData.spec.brokerProperties) {
    yamlData.spec.brokerProperties = [];
  }

  const acceptorSet = listAcceptors(configType, yamlData, 'set') as Set<string>;

  const newName = generateUniqueName(configType, acceptorSet);

  if (configType === ConfigType.connectors) {
    initSpec(yamlData);
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
    configType === ConfigType.connectors
      ? 'connectorConfigurations.'
      : 'acceptorConfigurations.';

  yamlData.spec.brokerProperties.push(
    prefix +
      newName +
      '.factoryClassName=org.apache.activemq.artemis.core.remoting.impl.netty.NettyAcceptorFactory',
  );
};

const deleteAcceptor = (
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

const renameAcceptor = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  previousName: string,
  newName: string,
) => {
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

const updateAcceptorSecret = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  secret: SelectOptionObject,
  configName: string,
  isCa: boolean,
) => {
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
    } else {
      console.log('+++++no acceptor found for update!', secret);
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

export const GetAcceptorSSLEnabled = (
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

const updateAcceptorPort = (
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

const updateAcceptorHost = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
  host: string,
): void => {
  if (
    configType === ConfigType.connectors &&
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

const updateAcceptorProtocols = (
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

const updateAcceptorOtherParams = (
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
  const paramPrefix = getParamKey(configType, configName);
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

const updateAcceptorSSLEnabled = (
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

const updateAcceptorFactoryClass = (
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

// Payloads

export enum ExposeMode {
  route = 'route',
  ingress = 'ingress',
}

export type ConsoleCredentialsPayload = {
  adminUser: string;
  adminPassword: string;
};

export type DeleteAcceptorPayload = {
  acceptorName: string;
  configType: ConfigType;
};

export type RenameAcceptorPayload = {
  acceptorName: string;
  configType: ConfigType;
  newName: string;
};

export type UpdateAcceptorSecretPayload = {
  configType: ConfigType;
  acceptorName: string;
  secret: SelectOptionObject;
  isCa: boolean;
};

export type UpdateAcceptorPortPayload = {
  brokerModel: ArtemisCR;
  configType: ConfigType;
  configName: string;
  port: number;
};

export type UpdateAcceptorHostPayload = {
  brokerModel: ArtemisCR;
  configType: ConfigType;
  configName: string;
  host: string;
};

export type UpdateAcceptorBindToAllInterfacesPayload = {
  brokerModel: ArtemisCR;
  configType: ConfigType;
  configName: string;
  bindToAllInterfaces: boolean;
};

export type UpdateAcceptorProtocolsPayload = {
  brokerModel: ArtemisCR;
  configType: ConfigType;
  configName: string;
  protocols: string;
};

export type UpdateAcceptorOtherParamsPayload = {
  brokerModel: ArtemisCR;
  configType: ConfigType;
  configName: string;
  otherParams: string;
};

export type UpdateAcceptorSSLEnabledPayload = {
  brokerModel: ArtemisCR;
  configType: ConfigType;
  configName: string;
  sslEnabled: boolean;
};

export type UpdateAcceptorFactoryClassPayload = {
  brokerModel: ArtemisCR;
  configType: ConfigType;
  configName: string;
  selectedClass: string;
};

// Getters

export const getAcceptorSecret = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  acceptorName: string,
  isCa: boolean,
): SelectOptionObject => {
  const newOptionObject = (value: string): SelectOptionObject => {
    return {
      toString() {
        return value;
      },
    };
  };
  console.log('getting secret from yaml', acceptorName, 'idCa', isCa);
  if (configType === ConfigType.connectors) {
    if (brokerModel.spec?.connectors?.length > 0) {
      for (let i = 0; i < brokerModel.spec.connectors.length; i++) {
        if (brokerModel.spec.connectors[i].name === acceptorName) {
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
        if (brokerModel.spec.acceptors[i].name === acceptorName) {
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

export const getAcceptorFactoryClass = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  acceptorName: string,
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
            fields[1] === acceptorName &&
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

export const getAcceptorPort = (
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

export const getAcceptorHost = (
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

export const getAcceptorProtocols = (
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

export const getAcceptorBindToAllInterfaces = (
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

const getParamKey = (configType: ConfigType, configName: string): string => {
  if (configType === ConfigType.connectors) {
    return 'connectorConfigurations.' + configName + '.params.';
  }
  return 'acceptorConfigurations.' + configName + '.params.';
};

export const getAcceptorOtherParams = (
  brokerModel: ArtemisCR,
  configType: ConfigType,
  configName: string,
): string => {
  const params: string[] = [];
  if (brokerModel.spec?.brokerProperties?.length > 0) {
    for (let i = 0; i < brokerModel.spec.brokerProperties.length; i++) {
      const paramKey = getParamKey(configType, configName);
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

export const listAcceptors = (
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
