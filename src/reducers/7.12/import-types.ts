import { BrokerCR } from '../../k8s/types';
import { EditorType } from './reducer';

export interface AddBrokerResourceValues {
  shouldShowYAMLMessage?: boolean;
  editorType?: EditorType;
  yamlHasUnsavedChanges?: boolean;
  hasChanges?: boolean;
  cr?: BrokerCR;
}
