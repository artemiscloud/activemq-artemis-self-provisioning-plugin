import { ExposeMode } from '../reducers/7.12/reducer';
import { K8sResourceCommon as K8sResource } from '@openshift-console/dynamic-plugin-sdk';

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

export type K8sResourceCommon = K8sResource & {
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

export type K8sResourceKind = K8sResourceCommon & {
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
