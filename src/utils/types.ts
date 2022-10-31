import { K8sResourceCommon as K8sResource } from "@openshift-console/dynamic-plugin-sdk";

export type K8sResourceCommon = K8sResource & {
    spec?: {
        [key: string]: any;
    };
    status?: { [key: string]: any };
};

export type K8sResourceKind = K8sResourceCommon & {
    data?: { [key: string]: any };
};