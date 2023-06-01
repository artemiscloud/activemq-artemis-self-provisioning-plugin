import { FC, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Form,
  FormGroup,
  TextInput,
  Alert,
  Button,
  ButtonVariant,
  ActionGroup,
} from '@patternfly/react-core';
import { useTranslation } from '../../../../i18n';
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

type FormViewProps = {
  formValues: K8sResourceCommon;
  onChangeFieldValue: (value: string, evt: FormEvent<HTMLInputElement>) => void;
  onCreateBroker: (formValues: K8sResourceCommon) => void;
};

export const FormView: FC<FormViewProps> = ({
  formValues,
  onChangeFieldValue,
  onCreateBroker,
}) => {
  const { t } = useTranslation();
  const history = useHistory();

  const onSubmit = () => {
    onCreateBroker(formValues);
  };

  const onCancel = () => {
    history.push('/k8s/all-namespaces/brokers');
  };

  return (
    <Form
      isWidthLimited
      className="pf-u-mx-md"
      maxWidth="50%"
      onSubmit={(e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
      }}
    >
      <Alert
        variant="info"
        isInline
        title={t('info_alert')}
        className="pf-u-mt-md"
      />
      <FormGroup label={t('name')} isRequired fieldId="name">
        <TextInput
          isRequired
          type="text"
          id="name"
          name="name"
          value={formValues.metadata.name}
          onChange={onChangeFieldValue}
        />
      </FormGroup>
      <ActionGroup>
        <Button
          variant={ButtonVariant.primary}
          type="submit"
          onClick={onSubmit}
        >
          {t('create')}
        </Button>
        <Button variant={ButtonVariant.secondary} onClick={onCancel}>
          {t('cancel')}
        </Button>
      </ActionGroup>
    </Form>
  );
};
