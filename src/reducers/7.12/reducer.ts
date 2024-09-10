import { AddBrokerResourceValues as FormState } from './import-types';
import { BrokerCR, Acceptor, ResourceTemplate } from '@app/k8s/types';
import { createContext } from 'react';
import { SelectOptionObject } from '@patternfly/react-core/deprecated';
import { ConfigType } from '@app/shared-components/FormView/BrokerProperties/ConfigurationPage/ConfigurationPage';

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

const artemisCRStateMap = new Map<string, FormState>();

const initialCr = (namespace: string, name: string): BrokerCR => {
  return {
    apiVersion: 'broker.amq.io/v1beta1',
    kind: 'ActiveMQArtemis',
    metadata: {
      name: name,
      namespace: namespace,
    },
    spec: {},
  };
};

export const getArtemisCRState = (name: string, ns: string): FormState => {
  const key = name + ns;
  let formState = artemisCRStateMap.get(key);
  if (!formState) {
    formState = {
      yamlHasUnsavedChanges: false,
      hasChanges: false,
    };
    formState.shouldShowYAMLMessage = true;
    formState.editorType = EditorType.BROKER;
    artemisCRStateMap.set(key, formState);
  }
  formState.cr = initialCr(ns, name);

  return formState;
};

export const newArtemisCRState = (namespace: string): FormState => {
  const initialCr: BrokerCR = {
    apiVersion: 'broker.amq.io/v1beta1',
    kind: 'ActiveMQArtemis',
    metadata: {
      name: 'ex-aao',
      namespace: namespace,
    },
    spec: {
      adminUser: 'admin',
      adminPassword: 'admin',
      ingressDomain: '',
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
    hasChanges: false,
    yamlHasUnsavedChanges: false,
  };
};

export const convertYamlToForm = (yamlBroker: BrokerCR) => {
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
  /**
   * Adds an issuer as an annotation to make the cert-manager operator generate
   * the PEM certificates at runtime. Will trigger cascading effects on the CR.
   * to unset call deleteCertManagerAnnotationIssuer
   */
  activatePEMGenerationForAcceptor,
  /** adds a new acceptor to the cr */
  addAcceptor,
  /** adds a or connector to the cr */
  addConnector,
  /**
   * Removes the issuer annotation, clears the related configuration from the
   * acceptor.
   */
  deletePEMGenerationForAcceptor,
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
  /** Exposition mode of the acceptor */
  setAcceptorExposeMode,
  /** Renames an acceptor */
  setAcceptorName,
  /** set the ingress Host for the acceptor */
  setAcceptorIngressHost,
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
  /**
   * set the ingress domain (used for cert manager annotations) usually the
   * domain name of the cluster
   */
  setIngressDomain,
  /** Is this acceptor exposed */
  setIsAcceptorExposed,
  /** updates the whole model */
  setModel,
  /** update the namespace of the CR */
  setNamespace,
  /** update the total number of replicas */
  setReplicasNumber,
  /**
   * Tells that the yaml editor has unsaved changes, when the setModel is
   * invoked, the flag is reset to false.
   */
  setYamlHasUnsavedChanges,
  /** Updates the configuration's factory Class */
  updateAcceptorFactoryClass,
  /** Update the issuer of an annotation */
  updateAnnotationIssuer,
  /** Updates the configuration's factory Class */
  updateConnectorFactoryClass,
}

type ArtemisReducerActionBase = {
  /** which transformation to apply onto the state */
  operation: ArtemisReducerOperations;
};

type ArtemisReducerActions =
  | ActivatePEMGenerationForAcceptorAction
  | AddAcceptorAction
  | AddConnectorAction
  | DecrementReplicasAction
  | DeleteAcceptorAction
  | DeleteConnectorAction
  | DeletePEMGenerationForAcceptorAction
  | IncrementReplicasAction
  | SetAcceptorBindToAllInterfacesAction
  | SetAcceptorExposeModeAction
  | SetAcceptorIngressHostAction
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
  | SetIngressDomainAction
  | SetIsAcceptorExposedAction
  | SetModelAction
  | SetNamespaceAction
  | SetReplicasNumberAction
  | SetYamlHasUnsavedChanges
  | UpdateAcceptorFactoryClassAction
  | UpdateAnnotationIssuerAction
  | UpdateConnectorFactoryClassAction;

interface SetYamlHasUnsavedChanges extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setYamlHasUnsavedChanges;
}
interface UpdateAnnotationIssuerAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.updateAnnotationIssuer;
  payload: {
    /** the acceptor name is needed to recover the corresponding annotation */
    acceptorName: string;
    /** the new issuer name */
    newIssuer: string;
  };
}

interface SetAcceptorIngressHostAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setAcceptorIngressHost;
  payload: {
    /** the acceptor name */
    name: string;
    /** the ingress host*/
    ingressHost: string;
  };
}

interface SetAcceptorExposeModeAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setAcceptorExposeMode;
  payload: {
    /** the acceptor name */
    name: string;
    /** the expose mode of the acceptor */
    exposeMode: ExposeMode | undefined;
  };
}

interface SetIsAcceptorExposedAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setIsAcceptorExposed;
  payload: {
    /** the acceptor name */
    name: string;
    /** true if the acceptor is exposed */
    isExposed: boolean;
  };
}

interface ActivatePEMGenerationForAcceptorAction
  extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.activatePEMGenerationForAcceptor;
  payload: {
    /** the name of the acceptor */
    acceptor: string;
    /** the name of the issuer */
    issuer: string;
  };
}

interface DeletePEMGenerationForAcceptorAction
  extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.deletePEMGenerationForAcceptor;
  /** the acceptor name */
  payload: string;
}

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

interface SetConsoleCredentialsAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setConsoleCredentials;
  /** the new credentials */
  payload: {
    /** the username to login to the console */
    adminUser: string;
    /** the password to login to the console */
    adminPassword: string;
  };
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

interface SetAcceptorBindToAllInterfacesAction
  extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setAcceptorBindToAllInterfaces;
  payload: {
    /** name of the element to update */
    name: string;
    /** bind to all the interfaces or not*/
    bindToAllInterfaces: boolean;
  };
}

interface SetConnectorBindToAllInterfacesAction
  extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setConnectorBindToAllInterfaces;
  payload: {
    /** name of the element to update */
    name: string;
    /** bind to all the interfaces or not*/
    bindToAllInterfaces: boolean;
  };
}

interface UpdateAcceptorFactoryClassAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.updateAcceptorFactoryClass;
  payload: {
    /** the name of the element */
    name: string;
    /** the java class to set */
    class: 'invm' | 'netty';
  };
}

interface UpdateConnectorFactoryClassAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.updateConnectorFactoryClass;
  payload: {
    /** the name of the element */
    name: string;
    /** the java class to set */
    class: 'invm' | 'netty';
  };
}

interface SetModelAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setModel;
  payload: {
    model: BrokerCR;
    /** setting this to true means that form state will get considered as
     * modified, setting to false reset that status.*/
    isSetByUser?: boolean;
  };
}

interface SetConnectorHostAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setConnectorHost;
  payload: {
    /** the name of the configuration */
    connectorName: string;
    /** the new host of the configuration */
    host: string;
  };
}

interface SetAcceptorNameAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setAcceptorName;
  payload: {
    /** the name of the element */
    oldName: string;
    /** the new name of the element */
    newName: string;
  };
}

interface SetConnectorNameAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setConnectorName;
  payload: {
    /** the name of the element */
    oldName: string;
    /** the new name of the element */
    newName: string;
  };
}

interface SetAcceptorOtherParamsAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setAcceptorOtherParams;
  payload: {
    /** the name of the configuration */
    name: string;
    /** a comma separated list of extra parameters */
    otherParams: Map<string, string>;
  };
}

interface SetConnectorOtherParamsAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setConnectorOtherParams;
  payload: {
    /** the name of the configuration */
    name: string;
    /** a comma separated list of extra parameters */
    otherParams: Map<string, string>;
  };
}

interface SetAcceptorPortAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setAcceptorPort;
  payload: {
    /** the name of the configuration */
    name: string;
    /** the new port of the configuration */
    port: number;
  };
}

interface SetConnectorPortAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setConnectorPort;
  payload: {
    /** the name of the configuration */
    name: string;
    /** the new port of the configuration */
    port: number;
  };
}

interface SetAcceptorProtocolsAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setAcceptorProtocols;
  payload: {
    /** the name of the configuration */
    configName: string;
    /** A comma separated list of protocols */
    protocols: string;
  };
}

interface SetConnectorProtocolsAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setConnectorProtocols;
  payload: {
    /** the name of the configuration */
    configName: string;
    /** A comma separated list of protocols */
    protocols: string;
  };
}

interface SetAcceptorSSLEnabledAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setAcceptorSSLEnabled;
  payload: {
    /** the name of the element */
    name: string;
    /** if ssl is enabled or not */
    sslEnabled: boolean;
  };
}

interface SetConnectorSSLEnabledAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setConnectorSSLEnabled;
  payload: {
    /** the name of the element */
    name: string;
    /** if ssl is enabled or not */
    sslEnabled: boolean;
  };
}

interface SetAcceptorSecretAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setAcceptorSecret;
  payload: {
    /** the name of the configuration */
    name: string;
    /** the secret of the configuration, set to undefined to delete the secret*/
    secret: SelectOptionObject | undefined;
    /** the secret is a certificate */
    isCa: boolean;
  };
}

interface SetConnectorSecretAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setConnectorSecret;
  payload: {
    /** the name of the configuration */
    name: string;
    /** the secret of the configuration, set to undefined to delete the secret*/
    secret: SelectOptionObject | undefined;
    /** the secret is a certificate */
    isCa: boolean;
  };
}

interface SetConsoleSecretAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setConsoleSecret;
  payload: {
    /** the name of the configuration */
    name: string;
    /** the secret of the configuration, set to undefined to delete the secret*/
    secret: SelectOptionObject | undefined;
    /** the secret is a certificate */
    isCa: boolean;
  };
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

interface SetIngressDomainAction extends ArtemisReducerActionBase {
  operation: ArtemisReducerOperations.setIngressDomain;
  /** the domain of the cluster. Only passing the string is equivalent as saying
   * that the value is set by the user. Otherwise this value can be customized.
   * Setting isSetByUser to false has for effect to state that the form doesn't
   * have changes, since the change is done by the system instead of the user.*/
  payload:
    | string
    | {
        ingressUrl: string;
        isSetByUser?: boolean;
      };
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
  if (
    action.operation !== ArtemisReducerOperations.setEditorType &&
    action.operation !== ArtemisReducerOperations.setYamlHasUnsavedChanges
  ) {
    formState.hasChanges = true;
  }

  // set the individual fields
  switch (action.operation) {
    case ArtemisReducerOperations.setYamlHasUnsavedChanges:
      formState.yamlHasUnsavedChanges = true;
      break;
    case ArtemisReducerOperations.updateAnnotationIssuer:
      updateAnnotationIssuer(
        formState.cr,
        action.payload.acceptorName,
        action.payload.newIssuer,
      );
      break;
    case ArtemisReducerOperations.setAcceptorIngressHost:
      getAcceptor(formState.cr, action.payload.name).ingressHost =
        action.payload.ingressHost;
      break;
    case ArtemisReducerOperations.setAcceptorExposeMode:
      if (action.payload) {
        getAcceptor(formState.cr, action.payload.name).exposeMode =
          action.payload.exposeMode;
      } else {
        delete getAcceptor(formState.cr, action.payload.name).exposeMode;
      }
      break;
    case ArtemisReducerOperations.setIsAcceptorExposed:
      getAcceptor(formState.cr, action.payload.name).expose =
        action.payload.isExposed;
      break;
    case ArtemisReducerOperations.setEditorType:
      formState.editorType = action.payload;
      if (formState.editorType === EditorType.BROKER) {
        formState.yamlHasUnsavedChanges = false;
      }
      break;
    case ArtemisReducerOperations.setNamespace:
      updateNamespace(formState.cr, action.payload);
      break;
    case ArtemisReducerOperations.setReplicasNumber:
      updateDeploymentSize(formState.cr, action.payload);
      break;
    case ArtemisReducerOperations.incrementReplicas:
      updateDeploymentSize(
        formState.cr,
        formState.cr.spec.deploymentPlan.size + 1,
      );
      break;
    case ArtemisReducerOperations.decrementReplicas:
      updateDeploymentSize(
        formState.cr,
        formState.cr.spec.deploymentPlan.size - 1,
      );
      break;
    case ArtemisReducerOperations.setBrokerName:
      updateBrokerName(formState.cr, action.payload);
      break;
    case ArtemisReducerOperations.activatePEMGenerationForAcceptor:
      activatePEMGenerationForAcceptor(formState.cr, action.payload.acceptor);
      setIssuerForAcceptor(
        formState.cr,
        getAcceptor(formState.cr, action.payload.acceptor),
        action.payload.issuer,
      );
      break;
    case ArtemisReducerOperations.deletePEMGenerationForAcceptor:
      clearAcceptorCertManagerConfig(formState.cr, action.payload);
      break;
    case ArtemisReducerOperations.addAcceptor:
      addConfig(formState.cr, ConfigType.acceptors);
      break;
    case ArtemisReducerOperations.addConnector:
      addConfig(formState.cr, ConfigType.connectors);
      break;
    case ArtemisReducerOperations.deleteAcceptor:
      // before deleting an acceptor, remove any linked annotations
      deleteCertManagerAnnotation(formState.cr, action.payload);
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
      // after the renaming of an acceptor its annotation will require an update
      // to keep being in sync
      updateAcceptorNameInResourceTemplate(
        formState.cr,
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
      // when the user sets the acceptor secret manually, remove any linked
      // annotations
      clearAcceptorCertManagerConfig(formState.cr, action.payload.name);
      // if a cert-manager config was cleared, the sslEnabled flag was set to
      // false, but the user wants to change the secret so reactivate the
      // ssEnabled flag to true.
      updateConfigSSLEnabled(
        formState.cr,
        ConfigType.acceptors,
        action.payload.name,
        true,
      );
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
      if (!action.payload) {
        delete formState.cr.spec.console.useClientAuth;
      }
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
    case ArtemisReducerOperations.setModel:
      setModel(formState, action.payload.model);
      formState.yamlHasUnsavedChanges = false;
      formState.hasChanges = action.payload.isSetByUser;
      break;
    case ArtemisReducerOperations.setIngressDomain:
      if (typeof action.payload === 'string') {
        updateIngressDomain(formState.cr, action.payload);
      } else {
        updateIngressDomain(formState.cr, action.payload.ingressUrl);
        formState.hasChanges = action.payload.isSetByUser;
      }
      break;
    default:
      throw Error('Unknown action: ' + action);
  }

  return formState;
};

// function used by the reducer to update the state

const updateAnnotationIssuer = (
  cr: BrokerCR,
  acceptorName: string,
  newIssuer: string,
) => {
  if (!cr.spec.resourceTemplates) {
    return;
  }
  const acceptor = getAcceptor(cr, acceptorName);
  const selector = certManagerSelector(cr, acceptor.name);
  const rt = cr.spec.resourceTemplates.find(
    (rt) => rt.selector?.name === selector,
  );
  if (rt) {
    rt.annotations['cert-manager.io/issuer'] = newIssuer;
  }
};

const updateIngressDomain = (cr: BrokerCR, newName: string) => {
  cr.spec.ingressDomain = newName;
  // when the namespace changes, some annotations will need an update to
  // stay in sync
  if (!cr.spec.acceptors || !cr.spec.resourceTemplates) {
    return;
  }
  cr.spec.acceptors.forEach((acceptor) => {
    const rt = cr.spec.resourceTemplates.find(
      (rt) => rt.selector.name === certManagerSelector(cr, acceptor.name),
    );
    if (!rt) {
      return;
    }
    rt.patch.spec.tls[0].hosts = certManagerTlsHosts(cr, acceptor.name);
  });
};

const updateDeploymentSize = (cr: BrokerCR, newSize: number) => {
  cr.spec.deploymentPlan.size = newSize;
  if (cr.spec.deploymentPlan.size < 1) {
    cr.spec.deploymentPlan.size = 0;
  }
  // when the size changes, some annotations will need an update to
  // stay in sync
  if (!cr.spec.acceptors) {
    return;
  }
  if (!cr.spec.resourceTemplates) {
    return;
  }
  cr.spec.acceptors.forEach((acceptor) => {
    const rt = cr.spec.resourceTemplates.find(
      (rt) => rt.selector.name === certManagerSelector(cr, acceptor.name),
    );
    if (!rt) {
      return;
    }
    rt.patch.spec.tls[0].hosts = certManagerTlsHosts(cr, acceptor.name);
  });
};

const updateNamespace = (cr: BrokerCR, newName: string) => {
  cr.metadata.namespace = newName;
  // when the namespace changes, some annotations will need an update to
  // stay in sync
  if (!cr.spec.acceptors) {
    return;
  }
  if (!cr.spec.resourceTemplates) {
    return;
  }
  cr.spec.acceptors.forEach((acceptor) => {
    const rt = cr.spec.resourceTemplates.find(
      (rt) => rt.selector.name === certManagerSelector(cr, acceptor.name),
    );
    if (!rt) {
      return;
    }
    rt.patch.spec.tls[0].hosts = certManagerTlsHosts(cr, acceptor.name);
  });
};

const updateBrokerName = (cr: BrokerCR, newName: string) => {
  const prevBrokerName = cr.metadata.name;
  cr.metadata.name = newName;
  // when the broker name changes, some acceptors & annotations will need an
  // update to stay in sync
  if (!cr.spec.acceptors) {
    return;
  }
  cr.spec.acceptors.forEach((acceptor) => {
    if (acceptor.sslSecret && acceptor.sslSecret.endsWith('-ptls')) {
      acceptor.sslSecret = certManagerSecret(cr, acceptor.name);
    }
    if (!cr.spec.resourceTemplates) {
      return;
    }
    const outdatedSelector =
      prevBrokerName + '-' + acceptor.name + '-0-svc-ing';
    const rt = cr.spec.resourceTemplates.find(
      (rt) => rt.selector?.name === outdatedSelector,
    );
    if (!rt) {
      return;
    }
    rt.selector.name = certManagerSelector(cr, acceptor.name);
    rt.patch.spec.tls[0] = {
      hosts: certManagerTlsHosts(cr, acceptor.name),
      secretName: acceptor.sslSecret,
    };
  });
};

/**
 * Configures the acceptor to accept a secret at runtime generated by an issuer.
 * Any acceptor whos secret ends up with `-ptls` will get considered as being
 * under cert-manager supervision regarding certs.
 */
const activatePEMGenerationForAcceptor = (
  cr: BrokerCR,
  acceptorName: string,
) => {
  const acceptor = getAcceptor(cr, acceptorName);
  if (acceptor) {
    acceptor.sslEnabled = true;
    acceptor.expose = true;
    acceptor.exposeMode = ExposeMode.ingress;
    acceptor.ingressHost =
      'ing.$(ITEM_NAME).$(CR_NAME)-$(BROKER_ORDINAL).$(CR_NAMESPACE).$(INGRESS_DOMAIN)';
    acceptor.sslSecret = certManagerSecret(cr, acceptor.name);
  }
};

/**
 * Updates the annotation corresponding to cert manager to contain the specified
 * issuer. Creates the annotation if it was not there in the first place.
 */
const setIssuerForAcceptor = (
  cr: BrokerCR,
  acceptor: Acceptor,
  issuerName: string,
) => {
  if (!acceptor) {
    return;
  }
  // in case there are no resource templates in the CR
  if (!cr.spec.resourceTemplates) {
    cr.spec.resourceTemplates = [];
  }
  // find if there is already an annotation for this acceptor
  const selector = certManagerSelector(cr, acceptor.name);
  const rt = cr.spec.resourceTemplates.find(
    (rt) => rt.selector?.name === selector,
  );
  // either update the existing one or create a new annotation
  if (rt) {
    rt.annotations['cert-manager.io/issuer'] = issuerName;
  } else {
    cr.spec.resourceTemplates.push(
      createCertManagerResourceTemplate(cr, acceptor, issuerName),
    );
  }
};

const certManagerTlsHosts = (cr: BrokerCR, acceptor: string): string[] => {
  const ret: string[] = [];
  for (let i = 0; i < cr.spec.deploymentPlan.size; i++) {
    ret.push(
      'ing.' +
        acceptor +
        '.' +
        cr.metadata.name +
        '-' +
        i +
        '.' +
        cr.metadata.namespace +
        '.' +
        cr.spec.ingressDomain,
    );
  }

  return ret;
};

const certManagerSelector = (cr: BrokerCR, acceptor: string) =>
  cr.metadata.name + '-' + acceptor + '-0-svc-ing';

const certManagerSecret = (cr: BrokerCR, acceptor: string) =>
  cr.metadata.name + '-' + acceptor + '-0-svc-ing-ptls';

/**
 * Updates the acceptor name in the various fields of the annotation matching
 * the previous acceptor name
 */
const updateAcceptorNameInResourceTemplate = (
  cr: BrokerCR,
  prevName: string,
  newName: string,
) => {
  // early return if there's no resource template to work on
  if (!cr.spec.resourceTemplates) {
    return;
  }
  // find a potential resourceTemplate to update
  const rt = cr.spec.resourceTemplates.find(
    (rt) => rt.selector?.name === certManagerSelector(cr, prevName),
  );
  // if there's a match update the required fields
  if (rt) {
    rt.selector.name = certManagerSelector(cr, newName);
    rt.patch.spec.tls[0].hosts = certManagerTlsHosts(cr, newName);
    rt.patch.spec.tls[0].secretName = certManagerSecret(cr, newName);
  }
};

/**
 * create a new cert manager resource template for a given acceptor and issuer
 * name. The acceptor must already be configured to have its ssl secret ending
 * in -ptls as the convention requires.
 */
const createCertManagerResourceTemplate = (
  cr: BrokerCR,
  acceptor: Acceptor,
  issuerName: string,
): ResourceTemplate => {
  return {
    selector: {
      kind: 'Ingress',
      name: certManagerSelector(cr, acceptor.name),
    },
    annotations: {
      'cert-manager.io/issuer': issuerName,
    },
    patch: {
      kind: 'Ingress',
      spec: {
        tls: [
          {
            hosts: certManagerTlsHosts(cr, acceptor.name),
            secretName: acceptor.sslSecret,
          },
        ],
      },
    },
  };
};

/**
 * remove the cert manager annotation for a given acceptor if one is found
 */
const deleteCertManagerAnnotation = (cr: BrokerCR, acceptor: string) => {
  if (!cr.spec.resourceTemplates) {
    return;
  }
  cr.spec.resourceTemplates = cr.spec.resourceTemplates.filter(
    (rt) => rt.selector.name !== certManagerSelector(cr, acceptor),
  );
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

const generateUniqueAcceptorPort = (cr: BrokerCR): number => {
  const acceptorSet = listConfigs(
    ConfigType.acceptors,
    cr,
    'set',
  ) as Set<string>;

  const basePort = 5555;
  if (acceptorSet.size === 0) {
    return basePort;
  }

  let maxPort = basePort;

  acceptorSet.forEach((name) => {
    const port = getConfigPort(cr, ConfigType.acceptors, name);
    if (port > maxPort) {
      maxPort = port;
    }
  });

  return maxPort + 1;
};

const generateUniqueConnectorPort = (cr: BrokerCR): number => {
  const connectorSet = listConfigs(
    ConfigType.connectors,
    cr,
    'set',
  ) as Set<string>;

  const basePort = 5555;
  if (connectorSet.size === 0) {
    return basePort;
  }

  let maxPort = basePort;

  connectorSet.forEach((name) => {
    const port = getConfigPort(cr, ConfigType.connectors, name);
    if (port > maxPort) {
      maxPort = port;
    }
  });

  return maxPort + 1;
};

const addConfig = (cr: BrokerCR, configType: ConfigType) => {
  const acceptorSet = listConfigs(configType, cr, 'set') as Set<string>;

  const newName = generateUniqueName(configType, acceptorSet);

  if (configType === ConfigType.connectors) {
    const connector = {
      name: newName,
      protocols: 'ALL',
      host: 'localhost',
      port: generateUniqueConnectorPort(cr),
    };
    if (!cr.spec.connectors) {
      cr.spec.connectors = [connector];
    } else {
      cr.spec.connectors.push(connector);
    }
  } else {
    const acceptor = {
      name: newName,
      protocols: 'ALL',
      port: generateUniqueAcceptorPort(cr),
    };
    if (!cr.spec.acceptors) {
      cr.spec.acceptors = [acceptor];
    } else {
      cr.spec.acceptors.push(acceptor);
    }
  }

  if (!cr.spec.brokerProperties) {
    cr.spec.brokerProperties = [];
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
  brokerModel: BrokerCR,
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
      if (brokerModel.spec?.connectors) {
        brokerModel.spec.connectors = brokerModel.spec.connectors.filter(
          (connector) => connector.name !== configName,
        );
      }
    } else {
      if (brokerModel.spec?.acceptors) {
        brokerModel.spec.acceptors = brokerModel.spec.acceptors.filter(
          (acceptor) => acceptor.name !== configName,
        );
      }
    }
  }
};

const renameConfig = (
  brokerModel: BrokerCR,
  configType: ConfigType,
  previousName: string,
  newName: string,
) => {
  // early return if the new name already exist in the list.
  if (
    configType === ConfigType.acceptors &&
    getAcceptor(brokerModel, newName)
  ) {
    return;
  }
  if (
    configType === ConfigType.connectors &&
    getConnector(brokerModel, newName)
  ) {
    return;
  }
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
    }
    if (configType === ConfigType.acceptors) {
      const acceptor = getAcceptor(brokerModel, previousName);
      if (acceptor) {
        acceptor.name = newName;
        // if the acceptor has a secret ending in -ptls, it's a cert-manager
        // special kind of secret and the secret name must be in sync with the
        // acceptor name
        if (acceptor.sslSecret && acceptor.sslSecret.endsWith('-ptls')) {
          acceptor.sslSecret = certManagerSecret(brokerModel, acceptor.name);
        }
      }
    }
  }
};

const updateConfigSecret = (
  brokerModel: BrokerCR,
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
              if (!brokerModel.spec.connectors[i].trustSecret) {
                brokerModel.spec.connectors[i].needClientAuth = true;
                brokerModel.spec.connectors[i].wantClientAuth = true;
              }
              brokerModel.spec.connectors[i].trustSecret = secret.toString();
            } else {
              delete brokerModel.spec.connectors[i].trustSecret;
              delete brokerModel.spec.connectors[i].needClientAuth;
              delete brokerModel.spec.connectors[i].wantClientAuth;
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
    if (brokerModel.spec?.acceptors?.length > 0) {
      for (let i = 0; i < brokerModel.spec.acceptors.length; i++) {
        if (brokerModel.spec.acceptors[i].name === configName) {
          if (isCa) {
            if (secret) {
              if (!brokerModel.spec.acceptors[i].trustSecret) {
                brokerModel.spec.acceptors[i].needClientAuth = true;
                brokerModel.spec.acceptors[i].wantClientAuth = true;
              }
              brokerModel.spec.acceptors[i].trustSecret = secret.toString();
            } else {
              delete brokerModel.spec.acceptors[i].trustSecret;
              delete brokerModel.spec.acceptors[i].needClientAuth;
              delete brokerModel.spec.acceptors[i].wantClientAuth;
            }
          } else {
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
          if (!brokerModel.spec.console.trustSecret) {
            brokerModel.spec.console.useClientAuth = true;
          }
          brokerModel.spec.console.trustSecret = secret.toString();
        } else {
          delete brokerModel.spec.console.trustSecret;
          delete brokerModel.spec.console.useClientAuth;
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
  brokerModel: BrokerCR,
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
  brokerModel: BrokerCR,
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
  brokerModel: BrokerCR,
  configType: ConfigType,
  configName: string,
  bindToAllInterfaces: boolean,
): void => {
  if (
    configType === ConfigType.acceptors &&
    brokerModel.spec?.acceptors?.length > 0
  ) {
    for (let i = 0; i < brokerModel.spec.acceptors.length; i++) {
      if (brokerModel.spec.acceptors[i].name === configName) {
        brokerModel.spec.acceptors[i].bindToAllInterfaces = bindToAllInterfaces;
      }
    }
  }
  if (
    configType === ConfigType.connectors &&
    brokerModel.spec?.connectors?.length > 0
  ) {
    for (let i = 0; i < brokerModel.spec.connectors.length; i++) {
      if (brokerModel.spec.connectors[i].name === configName) {
        brokerModel.spec.connectors[i].bindToAllInterfaces =
          bindToAllInterfaces;
      }
    }
  }
};

const updateConfigProtocols = (
  brokerModel: BrokerCR,
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
  brokerModel: BrokerCR,
  configType: ConfigType,
  configName: string,
  paramMap: Map<string, string>,
): void => {
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
  brokerModel: BrokerCR,
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
            delete brokerModel.spec.connectors[i].wantClientAuth;
            delete brokerModel.spec.connectors[i].needClientAuth;
          }
        }
      }
    }
  }
  if (configType === ConfigType.acceptors) {
    const acceptor = getAcceptor(brokerModel, configName);
    if (acceptor) {
      acceptor.sslEnabled = isSSLEnabled;
      if (!acceptor.sslEnabled) {
        clearAcceptorCertManagerConfig(brokerModel, acceptor.name);
        delete acceptor.sslSecret;
        delete acceptor.trustSecret;
        delete acceptor.wantClientAuth;
        delete acceptor.needClientAuth;
      }
    }
  }
};

const clearAcceptorCertManagerConfig = (cr: BrokerCR, name: string) => {
  const acceptor = getAcceptor(cr, name);
  if (acceptor.sslSecret && acceptor.sslSecret.endsWith('-ptls')) {
    deleteCertManagerAnnotation(cr, acceptor.name);
    delete acceptor.sslEnabled;
    delete acceptor.sslSecret;
    delete acceptor.expose;
    delete acceptor.exposeMode;
    delete acceptor.ingressHost;
  }
  if (!cr.spec.resourceTemplates) {
    return;
  }
  if (cr.spec.resourceTemplates.length === 0) {
    delete cr.spec.resourceTemplates;
  }
};

const updateConfigFactoryClass = (
  brokerModel: BrokerCR,
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

const setModel = (formState: FormState, model: BrokerCR): void => {
  formState.cr = model;
};

// Getters
export const getConfigSecret = (
  brokerModel: BrokerCR,
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
  if (configType === ConfigType.connectors) {
    const connector = getConnector(brokerModel, configName);
    if (connector) {
      if (isCa) {
        if (connector.trustSecret) {
          return newOptionObject(connector.trustSecret);
        }
      } else if (connector.sslSecret) {
        return newOptionObject(connector.sslSecret);
      }
    }
  }
  if (configType === ConfigType.acceptors) {
    const acceptor = getAcceptor(brokerModel, configName);
    if (acceptor) {
      if (isCa) {
        if (acceptor.trustSecret) {
          return newOptionObject(acceptor.trustSecret);
        }
      } else if (acceptor.sslSecret) {
        return newOptionObject(acceptor.sslSecret);
      }
    }
  } else {
    if (isCa) {
      if (brokerModel.spec.console.trustSecret) {
        return newOptionObject(brokerModel.spec.console.trustSecret);
      }
    } else if (brokerModel.spec.console.sslSecret) {
      return newOptionObject(brokerModel.spec.console.sslSecret);
    }
  }
  return '';
};

export const getConfigFactoryClass = (
  brokerModel: BrokerCR,
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

export const getAcceptor = (cr: BrokerCR, name: string) => {
  if (cr.spec?.acceptors) {
    return cr.spec.acceptors.find((acceptor) => {
      if (acceptor.name === name) {
        return acceptor;
      }
      return undefined;
    });
  }
  return undefined;
};

export const getAcceptorFromCertManagerResourceTemplate = (
  cr: BrokerCR,
  rt: ResourceTemplate,
) => {
  if (cr.spec?.acceptors) {
    return cr.spec.acceptors.find((acceptor) => {
      if (acceptor.sslSecret === rt.patch.spec.tls[0].secretName) {
        return acceptor;
      }
      return undefined;
    });
  }
  return undefined;
};

export const getCertManagerResourceTemplateFromAcceptor = (
  cr: BrokerCR,
  acceptor: Acceptor,
) => {
  if (!acceptor) {
    return undefined;
  }
  if (cr.spec?.resourceTemplates) {
    return cr.spec.resourceTemplates.find((rt) => {
      if (rt.patch.spec.tls[0].secretName === acceptor.sslSecret) {
        return acceptor;
      }
      return undefined;
    });
  }
  return undefined;
};

export const getConnector = (cr: BrokerCR, name: string) => {
  if (cr.spec?.connectors) {
    return cr.spec.connectors.find((connector) => {
      if (connector.name === name) {
        return connector;
      }
      return undefined;
    });
  }
  return undefined;
};

export const getConfigPort = (
  brokerModel: BrokerCR,
  configType: ConfigType,
  configName: string,
): number => {
  if (configType === ConfigType.acceptors) {
    const acceptor = getAcceptor(brokerModel, configName);
    if (acceptor?.port) {
      return acceptor.port;
    }
  } else if (configType === ConfigType.connectors) {
    const connector = getConnector(brokerModel, configName);
    if (connector?.port) {
      return connector.port;
    }
  }
  return -1;
};

export const getConfigHost = (
  brokerModel: BrokerCR,
  configType: ConfigType,
  configName: string,
): string => {
  if (configType === ConfigType.connectors) {
    const connector = getConnector(brokerModel, configName);
    if (connector?.host) {
      return connector.host;
    }
  }
  return 'localhost';
};

export const getConfigProtocols = (
  brokerModel: BrokerCR,
  configType: ConfigType,
  configName: string,
): string => {
  if (configType === ConfigType.connectors) {
    const connector = getConnector(brokerModel, configName);
    if (connector?.protocols) {
      return connector.protocols;
    }
  }
  if (configType === ConfigType.acceptors) {
    const acceptor = getAcceptor(brokerModel, configName);
    if (acceptor?.protocols) {
      return acceptor.protocols;
    }
  }
  return 'ALL';
};

export const getConfigBindToAllInterfaces = (
  brokerModel: BrokerCR,
  configType: ConfigType,
  configName: string,
): boolean => {
  if (configType === ConfigType.connectors) {
    const connector = getConnector(brokerModel, configName);
    if (connector) {
      return connector.bindToAllInterfaces !== undefined
        ? connector.bindToAllInterfaces
        : false;
    }
  }
  if (configType === ConfigType.acceptors) {
    const acceptor = getAcceptor(brokerModel, configName);
    if (acceptor) {
      return acceptor.bindToAllInterfaces !== undefined
        ? acceptor.bindToAllInterfaces
        : false;
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
  cr: BrokerCR,
  configType: ConfigType,
  configName: string,
): Map<string, string> => {
  const ret = new Map<string, string>();
  if (cr.spec?.brokerProperties?.length > 0) {
    const paramKey = getConfigParamKey(configType, configName);
    const portKey = paramKey + 'port=';
    const protocolsKey = paramKey + 'protocols=';
    cr.spec.brokerProperties
      .filter(
        (property) =>
          property.startsWith(paramKey) &&
          !property.startsWith(portKey) &&
          !property.startsWith(protocolsKey),
      )
      .forEach((property) => {
        const fields = property.split('=', 2);
        const pName = fields[0].split('.')[3];
        ret.set(pName, fields[1]);
      });
  }
  return ret;
};

export const listConfigs = (
  configType: ConfigType,
  brokerModel: BrokerCR,
  resultType?: 'set' | 'list',
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
  brokerModel: BrokerCR,
  configType: ConfigType,
  configName: string,
): boolean => {
  if (configType === ConfigType.connectors) {
    const connector = getConnector(brokerModel, configName);
    if (connector) {
      return connector.sslEnabled !== undefined ? connector.sslEnabled : false;
    }
  }
  if (configType === ConfigType.acceptors) {
    const acceptor = getAcceptor(brokerModel, configName);
    if (acceptor) {
      return acceptor.sslEnabled !== undefined ? acceptor.sslEnabled : false;
    }
  }
  return false;
};

/**
 * Updates the annotation corresponding to cert manager to contain the specified
 * issuer. Creates the annotation if it was not there in the first place.
 */
export const getIssuerForAcceptor = (cr: BrokerCR, acceptor: Acceptor) => {
  if (!acceptor) {
    return '';
  }
  // in case there are no resource templates in the CR
  if (!cr.spec.resourceTemplates) {
    cr.spec.resourceTemplates = [];
  }
  // find if there is already an annotation for this acceptor
  const selector = certManagerSelector(cr, acceptor.name);
  const rt = cr.spec.resourceTemplates.find(
    (rt) => rt.selector?.name === selector,
  );
  if (rt) {
    return rt.annotations['cert-manager.io/issuer'];
  }
  return '';
};

export const getIssuerIngressHostForAcceptor = (
  cr: BrokerCR,
  acceptor: Acceptor,
  podOrdinal: number,
) => {
  if (!acceptor) {
    return '';
  }
  // in case there are no resource templates in the CR
  if (!cr.spec.resourceTemplates) {
    cr.spec.resourceTemplates = [];
  }
  // find if there is already an annotation for this acceptor
  const selector = certManagerSelector(cr, acceptor.name);
  const rt = cr.spec.resourceTemplates.find(
    (rt) => rt.selector?.name === selector,
  );
  if (rt) {
    return rt.patch.spec.tls[0].hosts[podOrdinal];
  }
  return '';
};
