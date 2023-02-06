import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

export const referenceFor = (group: string, version: string, kind: string) =>
  `${group}~${version}~${kind}`;

const groupVersionKindForObj = (obj: K8sResourceCommon) => {
  const [group, version] = obj.apiVersion.split('/');
  return { group, version, kind: obj.kind };
};

export const referenceForObj = (obj: K8sResourceCommon) => {
  const { group, version, kind } = groupVersionKindForObj(obj);
  return referenceFor(group, version, kind);
};

export const referenceForRsc = (obj: K8sResourceCommon) => {
  return (
    referenceForObj(obj) +
    '-' +
    obj.metadata.namespace +
    '-' +
    obj.metadata.name +
    '-' +
    obj.metadata.resourceVersion
  );
};
