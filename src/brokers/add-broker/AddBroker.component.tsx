import { FC, FormEvent } from 'react';
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { AlertVariant, Divider } from '@patternfly/react-core';
import { YamlEditorView, EditorToggle, FormView } from './components';
import { AddBrokerFormYamlValues } from '../utils/import-types';
import { EditorType } from '../utils/add-broker';

type AddBrokerProps = {
  onCreateBroker: (data?: K8sResourceCommon) => void;
  onChangeValue?: (values: AddBrokerFormYamlValues) => void;
  namespace: string;
  formValues: AddBrokerFormYamlValues;
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
  formValues,
  onChangeValue,
  isEditWorkFlow,
}) => {
  const { editorType } = formValues;

  // useEffect(() => {
  //   if (editorType === EditorType.Form) {
  //     const formData = convertYamlToForm(formValues.yamlData);
  //     onChangeValue({ ...formValues, formData });
  //   } else {
  //     const yamlData = convertFormToBrokerYaml(formValues.formData);
  //     onChangeValue({ ...formValues, yamlData });
  //   }
  // }, [editorType]);

  const onSelectEditorType = (editorType: EditorType) => {
    onChangeValue({ ...formValues, editorType });
  };

  const onChangeFieldValue = (
    value: string,
    evt: FormEvent<HTMLInputElement>,
  ) => {
    const fieldName = evt.currentTarget.name;
    onChangeValue({
      ...formValues,
      formData: { metadata: { [fieldName]: value } },
    });
  };

  return (
    <>
      {!isEditWorkFlow && (
        <>
          <Divider />
          <EditorToggle value={editorType} onChange={onSelectEditorType} />
          <Divider />
          {editorType === EditorType.Form && (
            <FormView
              formValues={formValues.formData}
              onChangeFieldValue={onChangeFieldValue}
              onCreateBroker={onCreateBroker}
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
