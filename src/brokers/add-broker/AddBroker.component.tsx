import { FC, FormEvent, useContext } from 'react';
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { AlertVariant, Divider } from '@patternfly/react-core';
import { YamlEditorView, EditorToggle, FormView } from './components';
import {
  AddBrokerResourceValues,
  BrokerConfigContext,
  EditorType,
} from '../utils';

type AddBrokerProps = {
  onCreateBroker: (data?: K8sResourceCommon) => void;
  onChangeValue?: (values: AddBrokerResourceValues) => void;
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
  onChangeValue,
  isEditWorkFlow,
}) => {
  const formValues = useContext(BrokerConfigContext);

  const { editorType } = formValues;

  const onSelectEditorType = (editorType: EditorType) => {
    onChangeValue({ ...formValues, editorType });
  };

  const onChangeFieldValue = (
    value: string,
    evt: FormEvent<HTMLInputElement>,
  ) => {
    const fieldName = evt.currentTarget.name;
    const newFormValues = {
      ...formValues,
      formData: {
        ...formValues.yamlData,
        metadata: {
          ...formValues.yamlData.metadata,
          [fieldName]: value,
        },
      },
    };

    onChangeValue({
      ...newFormValues,
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
              onChangeFieldValue={onChangeFieldValue}
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
