import { K8sResourceCommon } from '../../utils';
import { EditorType } from './add-broker';

export interface AddBrokerFormYamlValues {
  editorType?: EditorType;
  shouldShowYAMLMessage?: boolean;
  formData?: K8sResourceCommon;
  yamlData?: K8sResourceCommon;
}
