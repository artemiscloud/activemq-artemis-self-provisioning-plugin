import { FC, useContext } from 'react';
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { AlertVariant, Divider } from '@patternfly/react-core';
import {
  ArtemisReducerOperations,
  BrokerCreationFormDispatch,
  BrokerCreationFormState,
  EditorType,
} from '../../reducers/7.12/reducer';
import { useLocation } from 'react-router-dom-v5-compat';
import { FormView } from '../../shared-components/FormView/FormView';
import { YamlEditorView } from '../../shared-components/YamlEditorView/YamlEditorView';
import { EditorToggle } from './components/EditorToggle/EditorToggle';

type AddBrokerProps = {
  onCreateBroker: (data?: K8sResourceCommon) => void;
  notification: {
    title: string;
    variant: AlertVariant;
  };
  isUpdate?: boolean;
};

export const AddBroker: FC<AddBrokerProps> = ({
  onCreateBroker,
  notification,
  isUpdate,
}) => {
  const formValues = useContext(BrokerCreationFormState);
  const dispatch = useContext(BrokerCreationFormDispatch);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const returnUrl = params.get('returnUrl') || '/k8s/all-namespaces/brokers';

  const { editorType } = formValues;

  const onSelectEditorType = (editorType: EditorType) => {
    dispatch({
      operation: ArtemisReducerOperations.setEditorType,
      payload: editorType,
    });
  };

  return (
    <>
      <Divider />
      <EditorToggle value={editorType} onChange={onSelectEditorType} />
      <Divider />
      {editorType === EditorType.BROKER && (
        <FormView
          onCreateBroker={onCreateBroker}
          notification={notification}
          isUpdate={isUpdate}
          returnUrl={returnUrl}
        />
      )}
      {editorType === EditorType.YAML && (
        <YamlEditorView
          onCreateBroker={onCreateBroker}
          initialResourceYAML={formValues.cr}
          notification={notification}
          isUpdate={isUpdate}
          returnUrl={returnUrl}
        />
      )}
    </>
  );
};
