import { K8sModel } from '@openshift-console/dynamic-plugin-sdk';
import {
  AMQ_BROKER_APIGROUP,
  API_VERSION,
  CERT_ISSUER_VERSION,
  CERT_MANAGER_APIGROUP,
  CERT_VERSION,
  SECRET_APIGROUP,
  SECRET_VERSION,
} from '@app/constants/constants';

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

export const CertIssuerModel: K8sModel = {
  apiGroup: CERT_MANAGER_APIGROUP,
  apiVersion: CERT_ISSUER_VERSION,
  kind: 'IssuerList',
  label: 'Issuer',
  labelKey: 'Issuers',
  labelPlural: 'Issuers',
  labelPluralKey: 'issuers',
  plural: 'issuers',
  id: 'issuer',
  abbr: 'I',
  namespaced: false,
  crd: true,
};

export const CertModel: K8sModel = {
  apiGroup: CERT_MANAGER_APIGROUP,
  apiVersion: CERT_VERSION,
  kind: 'CertificateList',
  label: 'Certificate',
  labelKey: 'Certificate',
  labelPlural: 'Certificates',
  labelPluralKey: 'Certificates',
  plural: 'certificates',
  id: 'certificate',
  abbr: 'C',
  namespaced: false,
  crd: true,
};

export const SecretModel: K8sModel = {
  apiGroup: SECRET_APIGROUP,
  apiVersion: SECRET_VERSION,
  kind: 'SecretList',
  label: 'Secret',
  labelKey: 'Secret',
  labelPlural: 'Secrets',
  labelPluralKey: 'Secrets',
  plural: 'secrets',
  id: 'secret',
  abbr: 'S',
  namespaced: false,
  crd: true,
};

export const IngressDomainModel: K8sModel = {
  apiGroup: 'config.openshift.io',
  apiVersion: 'v1',
  kind: 'Ingress',
  label: 'ingress',
  plural: 'ingresses',
  labelPlural: 'ingresses',
  abbr: 'I',
  namespaced: false,
};
