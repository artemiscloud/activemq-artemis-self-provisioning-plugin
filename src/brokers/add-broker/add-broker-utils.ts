import { getAPIVersionForModel } from "@openshift-console/dynamic-plugin-sdk";
import { AddBrokerFormYamlValues, BrokerFormData } from "./import-types";
import { K8sResourceKind, AMQBrokerModel, UNASSIGNED_APPLICATIONS_KEY, LABEL_PART_OF } from "../../utils";
import { EditorType } from "../synced-editor";

export const convertFormToBrokerYaml = (formData: BrokerFormData): K8sResourceKind => {
    const {
        name,
        project: { name: namespace },
        application: { selectedKey, name: appName = null },
        spec = {},
    } = formData;

    return {
        apiVersion: getAPIVersionForModel(AMQBrokerModel),
        kind: AMQBrokerModel.kind,
        metadata: {
            name,
            namespace,
            ...(appName &&
                selectedKey !== UNASSIGNED_APPLICATIONS_KEY && {
                labels: {
                    [LABEL_PART_OF]: appName,
                },
            }),
        },
        spec,
    };
};

export const addBrokerInitialValues = (
    namespace: string,
    selectedApplication?: string,
): AddBrokerFormYamlValues => {
    const initialFormData: BrokerFormData = {
        name: "default",
        spec: {},
        project: {
            name: namespace,
            displayName: '',
            description: '',
        },
        // application: {
        //     initial: sanitizeApplicationValue(selectedApplication),
        //     name: sanitizeApplicationValue(selectedApplication) || EVENT_BROKER_APP,
        //     selectedKey: selectedApplication,
        // },
    };
    // const initialYamlData: string = safeJSToYAML(
    //     convertFormToBrokerYaml(initialFormData),
    //     'yamlData',
    //     {
    //         skipInvalid: true,
    //     },
    // );
    return {
        showCanUseYAMLMessage: true,
        editorType: EditorType.Form,
        yamlData: "",//initialYamlData,
        formData: initialFormData,
    };
};