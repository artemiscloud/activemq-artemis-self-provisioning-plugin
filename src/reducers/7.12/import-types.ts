import { K8sResourceCommon } from '../../utils';
import { EditorType } from './reducer';

export interface AddBrokerResourceValues {
  shouldShowYAMLMessage?: boolean;
  editorType?: EditorType;
  cr?: K8sResourceCommon;
}
