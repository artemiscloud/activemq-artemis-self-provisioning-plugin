import { getAPIVersionForModel } from '@openshift-console/dynamic-plugin-sdk';
import { AddBrokerFormYamlValues } from './import-types';
import {
  K8sResourceKind,
  AMQBrokerModel,
  K8sResourceCommon,
} from '../../utils';
// import { safeJSToYAML } from '../utils';

export const convertFormToBrokerYaml = (
  formData: K8sResourceCommon,
): K8sResourceKind => {
  const { metadata, spec = {}, kind } = formData;

  return {
    apiVersion: getAPIVersionForModel(AMQBrokerModel),
    kind,
    metadata,
    spec,
  };
};

export const addBrokerInitialValues = (
  namespace: string,
): AddBrokerFormYamlValues => {
  const initialFormData: K8sResourceCommon = {
    apiVersion: 'broker.amq.io/v1beta1',
    kind: 'ActiveMQArtemis',
    metadata: {
      name: 'default',
      namespace,
    },
    spec: {
      adminUser: 'admin',
      adminPassword: 'admin',
      console: {
        expose: true,
      },
      deploymentPlan: {
        image: 'quay.io/hgao/amq-openshift-image:jolokia',
        initImage: 'quay.io/hgao/init-container:jolokia',
        requireLogin: false,
        size: 1,
      },
      env: [
        {
          name: 'JOLOKIA_ALLOW_ORIGIN',
          value: '*',
        },
        {
          name: 'JAVA_ARGS_APPEND',
          value: '-Dhawtio.authenticationEnabled=false',
        },
      ],
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
    editorType: EditorType.YAML,
    yamlData: convertFormToBrokerYaml(initialFormData),
    formData: initialFormData,
  };
};

export enum EditorType {
  Form = 'form',
  YAML = 'yaml',
}

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
