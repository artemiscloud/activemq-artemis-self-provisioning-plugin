import { ExposeMode } from '../brokers/utils';
import { K8sResourceCommon as K8sResource } from '@openshift-console/dynamic-plugin-sdk';

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
};

export type Console = {
  adminPassword?: string;
  adminUser?: string;
  expose: boolean;
  exposeMode?: ExposeMode;
  sslEnabled?: boolean;
  sslSecret?: string;
  trustSecret?: string;
};

export type K8sResourceCommon = K8sResource & {
  spec?: {
    connectors?: Connector[];
    acceptors?: Acceptor[];
    brokerProperties?: string[];
    adminUser?: string;
    adminPassword?: string;
    console?: Console;
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
