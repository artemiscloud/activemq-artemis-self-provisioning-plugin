export const mockCreateBrokerData = {
  apiGroup: 'broker.amq.io',
  apiVersion: 'broker.amq.io/v1beta1',
  kind: 'ActiveMQArtemis',
  metadata: {
    name: 'broker-test-1',
    application: 'test-app-1',
    namespace: 'activemq-artemis-self-provisioning-plugin',
  },
  spec: {
    deploymentPlan: {
      size: 1,
    },
  },
};
