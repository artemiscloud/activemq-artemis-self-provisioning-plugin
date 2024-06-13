import { K8sResourceCommon } from '../../utils';
import { EditorType } from './add-broker';

export interface EditorActiveProperties {
  activeProperties?: Map<string, any>;
}
export interface AddBrokerResourceValues {
  shouldShowYAMLMessage?: boolean;
  editorType?: EditorType;
  cr?: K8sResourceCommon;
  editorActiveProperties?: EditorActiveProperties;
}
