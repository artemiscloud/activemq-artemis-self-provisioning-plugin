import { K8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { AMQ_BROKER_APIGROUP, API_VERSION } from './constants';

export const AMQBrokerModel: K8sModel = {
  apiGroup: AMQ_BROKER_APIGROUP,
  apiVersion: API_VERSION,
  kind: 'ActiveMQArtemisList',
  label: 'Broker',
  labelKey: 'Brokers',
  labelPlural: 'Brokers',
  labelPluralKey: 'activemqartemises',
  plural: 'activemqartemises',
  id: 'broker',
  abbr: 'B',
  namespaced: false,
  crd: true,
};
