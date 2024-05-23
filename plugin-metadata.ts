import { ConsolePluginBuildMetadata } from '@openshift-console/dynamic-plugin-sdk-webpack';

const metadata: ConsolePluginBuildMetadata = {
  name: 'activemq-artemis-self-provisioning-plugin',
  version: '0.1.0',
  displayName: 'Artemis Self Provisioning Plugin',
  description: 'Artemis Self Provisioning Plugin',
  exposedModules: {
    BrokersPage: './brokers/view-brokers',
    AddBrokerPage: './brokers/add-broker',
    UpdateBrokerPage: './brokers/update-broker',
    PodsListPage: './brokers/broker-pods',
    BrokerDetailsPage: './brokers/broker-details',
  },
  dependencies: {
    '@console/pluginAPI': '*',
  },
};

export default metadata;
