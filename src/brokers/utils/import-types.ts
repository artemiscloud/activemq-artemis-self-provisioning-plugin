import { K8sResourceCommon } from '../../utils';
import { EditorType } from './add-broker';

export interface AddBrokerResourceValues {
  shouldShowYAMLMessage?: boolean;
  editorType?: EditorType;
  yamlData?: K8sResourceCommon;
  setYamlData?: (updater: (brokerModel: K8sResourceCommon) => void) => void;
}
