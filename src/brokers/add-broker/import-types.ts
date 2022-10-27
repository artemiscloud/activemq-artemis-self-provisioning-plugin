export interface AddBrokerFormYamlValues {
    editorType: string;
    showCanUseYAMLMessage: boolean;
    formData: BrokerFormData;
    yamlData: string;
}

export interface ProjectData {
    name: string;
    displayName: string;
    description: string;
}

export interface ApplicationData {
    initial: string;
    name: string;
    selectedKey: string;
    isInContext?: boolean;
}

export interface BrokerFormData {
    project?: ProjectData;
    application?: ApplicationData;
    name: string;
    spec: {};
}