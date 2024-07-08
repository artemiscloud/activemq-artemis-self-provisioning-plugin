import { ExposeMode } from '../reducers/7.12/reducer';
import { K8sResourceCommon as K8sResource } from '@openshift-console/dynamic-plugin-sdk';

export enum K8sResourceConditionStatus {
  True = 'True',
  False = 'False',
  Unknown = 'Unknown',
}

export type K8sResourceCondition = {
  type: string;
  status: keyof typeof K8sResourceConditionStatus;
  lastTransitionTime?: string;
  reason?: string;
  message?: string;
};

// Something to think about - convert crd to typecript types?
export type Acceptor = {
  bindToAllInterfaces?: boolean;
  expose?: boolean;
  exposeMode?: ExposeMode;
  ingressHost?: string;
  name?: string;
  port?: number;
  protocols?: string;
  sslEnabled?: boolean;
  sslSecret?: string;
  trustSecret?: string;
  needClientAuth?: boolean;
  wantClientAuth?: boolean;
};

export type Connector = {
  bindToAllInterfaces?: boolean;
  expose?: boolean;
  exposeMode?: ExposeMode;
  host?: string;
  ingressHost?: string;
  name?: string;
  port?: number;
  protocols?: string;
  sslEnabled?: boolean;
  sslSecret?: string;
  trustSecret?: string;
  needClientAuth?: boolean;
  wantClientAuth?: boolean;
};

export type Console = {
  adminPassword?: string;
  adminUser?: string;
  expose: boolean;
  exposeMode?: ExposeMode;
  sslEnabled?: boolean;
  sslSecret?: string;
  trustSecret?: string;
  useClientAuth?: boolean;
};

export type ResourceTemplate = {
  selector?: {
    kind: 'Ingress';
    name?: string;
  };
  annotations?: {
    'cert-manager.io/issuer'?: string;
  };
  patch?: {
    kind: 'Ingress';
    spec: {
      tls?: [
        {
          hosts?: string[];
          secretName?: string;
        },
      ];
    };
  };
};

export type BrokerCR = K8sResource & {
  spec?: {
    ingressDomain?: string;
    connectors?: Connector[];
    acceptors?: Acceptor[];
    brokerProperties?: string[];
    adminUser?: string;
    adminPassword?: string;
    console?: Console;
    resourceTemplates?: ResourceTemplate[];
    deploymentPlan?: {
      image: string;
      requireLogin: boolean;
      size: number;
      messageMigration?: boolean;
      persistenceEnabled?: boolean;
      jolokiaAgentEnabled?: boolean;
      journalType?: string;
      managementRBACEnabled?: boolean;
    };
  };
  status?: { [key: string]: any };
};

export type K8sResourceKind = BrokerCR & {
  data?: { [key: string]: any };
};

export enum BrokerConditionTypes {
  Ready = 'Ready',
  Addressable = 'Addressable',
  FilterReady = 'FilterReady',
  IngressReady = 'IngressReady',
  TriggerChannelReady = 'TriggerChannelReady',
}

export type IssuerResource = K8sResource & {
  kind: 'Issuer';
  spec?: {
    ca?: {
      secretName: string;
    };
  };
};

export type SecretResource = K8sResource & {
  kind: 'Secret';
  data?: {
    'ca.crt'?: string;
    'tls.crt'?: string;
    'tls.key'?: string;
  };
};
