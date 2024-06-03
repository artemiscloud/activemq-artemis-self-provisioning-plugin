import { FC, useContext } from 'react';
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { AlertVariant, Divider } from '@patternfly/react-core';
import { YamlEditorView, EditorToggle, FormView } from './components';
import {
  ArtemisReducerOperations,
  BrokerConfigContext,
  BrokerDispatchContext,
  EditorType,
} from '../utils';

type AddBrokerProps = {
  onCreateBroker: (data?: K8sResourceCommon) => void;
  namespace: string;
  notification: {
    title: string;
    variant: AlertVariant;
  };
  isEditWorkFlow?: boolean;
};

const AddBroker: FC<AddBrokerProps> = ({
  onCreateBroker,
  notification,
  namespace,
  isEditWorkFlow,
}) => {
  const formValues = useContext(BrokerConfigContext);
  const dispatch = useContext(BrokerDispatchContext);

  const { editorType } = formValues;

  const onSelectEditorType = (editorType: EditorType) => {
    dispatch({
      operation: ArtemisReducerOperations.setEditorType,
      payload: editorType,
    });
  };

  return (
    <>
      {!isEditWorkFlow && (
        <>
          <Divider />
          <EditorToggle value={editorType} onChange={onSelectEditorType} />
          <Divider />
          {editorType === EditorType.BROKER && (
            <FormView
              onCreateBroker={onCreateBroker}
              notification={notification}
              targetNs={namespace}
            />
          )}
        </>
      )}
      {editorType === EditorType.YAML && (
        <YamlEditorView
          onCreateBroker={onCreateBroker}
          namespace={namespace}
          initialResourceYAML={formValues.yamlData}
          notification={notification}
        />
      )}
    </>
  );
};

export { AddBroker };
