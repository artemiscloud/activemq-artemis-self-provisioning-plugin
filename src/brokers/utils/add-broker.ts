//import { getAPIVersionForModel } from '@openshift-console/dynamic-plugin-sdk';
import { AddBrokerResourceValues } from './import-types';
import { K8sResourceKind, K8sResourceCommon } from '../../utils';
import { createContext } from 'react';
// import { safeJSToYAML } from '../utils';

export enum EditorType {
  BROKER = 'broker',
  YAML = 'yaml',
}

export const BrokerConfigContext = createContext<AddBrokerResourceValues>({});

export const addBrokerInitialValues = (
  namespace: string,
): AddBrokerResourceValues => {
  const initialFormData: K8sResourceCommon = {
    apiVersion: 'broker.amq.io/v1beta1',
    kind: 'ActiveMQArtemis',
    metadata: {
      name: 'ex-aao',
      namespace: namespace,
    },
    spec: {
      adminUser: 'admin',
      adminPassword: 'admin',
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

  // const initialYamlData: string = safeJSToYAML(
  //   convertFormToBrokerYaml(initialFormData),
  //   'yamlData',
  //   {
  //     skipInvalid: true,
  //   },
  // );

  return {
    shouldShowYAMLMessage: true,
    editorType: EditorType.BROKER,
    yamlData: initialFormData,
    setYamlData: (updater: (brokerModel: K8sResourceCommon) => void) => {
      updater(initialFormData);
    },
  };
};

export const convertYamlToForm = (yamlBroker: K8sResourceKind) => {
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
