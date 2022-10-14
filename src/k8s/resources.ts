import { K8sResourceCommon, K8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { chart_color_red_300 as Color } from '@patternfly/react-tokens/dist/js/chart_color_red_300';

export const BrokerModel: K8sModel = {
    apiGroup: 'broker.amq.io',
    apiVersion: 'v1beta1',
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
    color: Color.value,
};

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
    return referenceForObj(obj) + '-' + obj.metadata.namespace + '-' + obj.metadata.name + '-' + obj.metadata.resourceVersion;
};
