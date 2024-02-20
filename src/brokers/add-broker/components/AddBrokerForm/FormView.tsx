import { FC, FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';
import {
  Form,
  FormGroup,
  TextInput,
  Alert,
  Button,
  ButtonVariant,
  ActionGroup,
  AlertGroup,
  AlertVariant,
} from '@patternfly/react-core';
import { useTranslation } from '../../../../i18n';
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

type FormViewProps = {
  formValues: K8sResourceCommon;
  onChangeFieldValue: (value: string, evt: FormEvent<HTMLInputElement>) => void;
  onCreateBroker: (formValues: K8sResourceCommon) => void;
  notification: {
    title: string;
    variant: AlertVariant;
  };
};

export const FormView: FC<FormViewProps> = ({
  formValues,
  onChangeFieldValue,
  onCreateBroker,
  notification: serverNotification,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const defaultNotification = { title: '', variant: AlertVariant.default };

  //states
  const [notification, setNotification] = useState(defaultNotification);

  useEffect(() => {
    setNotification(serverNotification);
  }, [serverNotification]);

  const validateFormFields = (formValues: K8sResourceCommon) => {
    const name = formValues.metadata.name;
    const regex =
      /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/i;
    if (!regex.test(name)) {
      setNotification({
        title: t('form_view_validation_info'),
        variant: AlertVariant.danger,
      });
      return false;
    } else {
      setNotification({ title: '', variant: AlertVariant.success });
      return true;
    }
  };

  const onSubmit = () => {
    const isValid = validateFormFields(formValues);
    if (isValid) {
      onCreateBroker(formValues);
    }
  };

  const onCancel = () => {
    navigate('/k8s/all-namespaces/brokers');
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
      {notification.title && (
        <AlertGroup>
          <Alert
            data-test="add-broker-notification-form-view"
            title={notification.title}
            variant={notification.variant}
            isInline
            actionClose
          />
        </AlertGroup>
      )}
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
