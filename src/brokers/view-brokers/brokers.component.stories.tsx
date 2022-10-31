import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { BrokersPage } from './brokers.component';
import { K8sResourceCommon } from '../../utils';

export default {
  title: 'Components/Brokers',
  component: BrokersPage,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof BrokersPage>;

const brokers: K8sResourceCommon[] = [
  {
    apiVersion: 'broker.amq.io/v1beta1',
    kind: 'ActiveMQArtemis',
    metadata: {
      creationTimestamp: '2022-10-18T11:11:49Z',
      generation: 1,
      managedFields: [
        {
          apiVersion: 'broker.amq.io/v1beta1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:spec': {
              '.': {},
              'f:deploymentPlan': {
                '.': {},
                'f:image': {},
                'f:jolokiaAgentEnabled': {},
                'f:journalType': {},
                'f:managementRBACEnabled': {},
                'f:messageMigration': {},
                'f:persistenceEnabled': {},
                'f:requireLogin': {},
                'f:size': {},
              },
            },
          },
          manager: 'Mozilla',
          operation: 'Update',
          time: '2022-10-18T11:11:49Z',
        },
        {
          apiVersion: 'broker.amq.io/v1beta1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:status': {
              '.': {},
              'f:podStatus': {
                '.': {},
                'f:ready': {},
              },
            },
          },
          manager: 'amq-broker-operator',
          operation: 'Update',
          subresource: 'status',
          time: '2022-10-18T11:12:41Z',
        },
      ],
      name: 'build-infra',
      namespace: 'openshift-operators',
      resourceVersion: '54668',
      uid: 'd60c2c16-0767-4eff-a838-a1db510c2720',
    },
    spec: {
      deploymentPlan: {
        image: 'placeholder',
        jolokiaAgentEnabled: false,
        journalType: 'nio',
        managementRBACEnabled: true,
        messageMigration: false,
        persistenceEnabled: false,
        requireLogin: false,
        size: 1,
      },
    },
    status: {
      podStatus: {
        ready: ['build-infra-ss-0'],
      },
    },
  },
  {
    apiVersion: 'broker.amq.io/v1beta1',
    kind: 'ActiveMQArtemis',
    metadata: {
      creationTimestamp: '2022-10-18T11:12:37Z',
      generation: 1,
      managedFields: [
        {
          apiVersion: 'broker.amq.io/v1beta1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:spec': {
              '.': {},
              'f:deploymentPlan': {
                '.': {},
                'f:image': {},
                'f:jolokiaAgentEnabled': {},
                'f:journalType': {},
                'f:managementRBACEnabled': {},
                'f:messageMigration': {},
                'f:persistenceEnabled': {},
                'f:requireLogin': {},
                'f:size': {},
              },
            },
          },
          manager: 'Mozilla',
          operation: 'Update',
          time: '2022-10-18T11:12:37Z',
        },
        {
          apiVersion: 'broker.amq.io/v1beta1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:status': {
              '.': {},
              'f:podStatus': {
                '.': {},
                'f:ready': {},
                'f:starting': {},
              },
            },
          },
          manager: 'amq-broker-operator',
          operation: 'Update',
          subresource: 'status',
          time: '2022-10-18T22:21:22Z',
        },
      ],
      name: 'notifications',
      namespace: 'openshift-operators',
      resourceVersion: '302803',
      uid: 'b6bc3160-80cc-415d-9e53-a698604834f4',
    },
    spec: {
      deploymentPlan: {
        image: 'placeholder',
        jolokiaAgentEnabled: false,
        journalType: 'nio',
        managementRBACEnabled: true,
        messageMigration: false,
        persistenceEnabled: false,
        requireLogin: false,
        size: 2,
      },
    },
    status: {
      podStatus: {
        ready: ['notifications-ss-0'],
        starting: ['notifications-ss-1'],
      },
    },
  },
  {
    apiVersion: 'broker.amq.io/v1beta1',
    kind: 'ActiveMQArtemis',
    metadata: {
      creationTimestamp: '2022-10-18T11:12:21Z',
      generation: 1,
      managedFields: [
        {
          apiVersion: 'broker.amq.io/v1beta1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:spec': {
              '.': {},
              'f:deploymentPlan': {
                '.': {},
                'f:image': {},
                'f:jolokiaAgentEnabled': {},
                'f:journalType': {},
                'f:managementRBACEnabled': {},
                'f:messageMigration': {},
                'f:persistenceEnabled': {},
                'f:requireLogin': {},
                'f:size': {},
              },
            },
          },
          manager: 'Mozilla',
          operation: 'Update',
          time: '2022-10-18T11:12:21Z',
        },
        {
          apiVersion: 'broker.amq.io/v1beta1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:status': {
              '.': {},
              'f:podStatus': {
                '.': {},
                'f:ready': {},
                'f:starting': {},
              },
            },
          },
          manager: 'amq-broker-operator',
          operation: 'Update',
          subresource: 'status',
          time: '2022-10-20T12:44:44Z',
        },
      ],
      name: 'order-processing',
      namespace: 'openshift-operators',
      resourceVersion: '1221080',
      uid: 'f4044189-012a-46ab-828e-6ef71bfdc5b1',
    },
    spec: {
      deploymentPlan: {
        image: 'placeholder',
        jolokiaAgentEnabled: false,
        journalType: 'nio',
        managementRBACEnabled: true,
        messageMigration: false,
        persistenceEnabled: false,
        requireLogin: false,
        size: 2,
      },
    },
    status: {
      podStatus: {
        ready: ['order-processing-ss-0'],
        starting: ['order-processing-ss-1'],
      },
    },
  },
];

const Template: ComponentStory<typeof BrokersPage> = (args) => (
  <MemoryRouter>
    <BrokersPage {...args} />
  </MemoryRouter>
);

export const EmptyBrokersStory = Template.bind({});
EmptyBrokersStory.args = {
  brokers: [],
};

export const BrokersStory = Template.bind({});
BrokersStory.args = {
  brokers,
};
