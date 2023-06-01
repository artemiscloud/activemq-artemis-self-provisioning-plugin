import { K8sResourceCommon } from '../../utils';
import { EditorType } from './add-broker';

export interface AddBrokerFormYamlValues {
  editorType?: EditorType;
  showCanUseYAMLMessage?: boolean;
  formData?: K8sResourceCommon;
  yamlData?: K8sResourceCommon;
}
