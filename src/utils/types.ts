import { K8sResourceCommon } from "@openshift-console/dynamic-plugin-sdk";

export type K8sResourceKind = K8sResourceCommon & {
    spec?: {
        [key: string]: any;
    };
    status?: { [key: string]: any };
    data?: { [key: string]: any };
};