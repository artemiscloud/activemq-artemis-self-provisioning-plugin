import { K8sResourceCommon as K8sResource } from '@openshift-console/dynamic-plugin-sdk';

export type K8sResourceCommon = K8sResource & {
  spec?: {
    ingressDomain?: string;
    acceptors?: [
      {
        name?: string;
        port?: number;
        sslEnabled?: boolean;
        expose?: boolean;
        exposeMode?: 'ingress';
        sslSecret?: string;
        ingressHost?: string;
        [key: string]: any;
      },
    ];
    resourceTemplates?: [
      {
        selector?: {
          kind?: 'Ingress';
          name?: string;
          [key: string]: any;
        };
        annotations?: {
          'cert-manager.io/issuer'?: string;
          [key: string]: any;
        };
        patch?: {
          kind?: 'Ingress';
          spec?: {
            tls?: [
              {
                hosts?: string[];
                secretName?: string;
                [key: string]: any;
              },
            ];
            [key: string]: any;
          };
          [key: string]: any;
        };
        [key: string]: any;
      },
    ];
    brokerProperties?: string[];
    [key: string]: any;
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
