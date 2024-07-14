import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import {
  ActionGroup,
  Alert,
  AlertGroup,
  AlertVariant,
  Banner,
  Button,
  ButtonVariant,
  Form,
  FormFieldGroup,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Grid,
  InputGroup,
  InputGroupText,
  NumberInput,
  Switch,
  TextInput,
} from '@patternfly/react-core';
import { FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from '../../i18n/i18n';
import {
  ArtemisReducerOperations,
  BrokerCreationFormDispatch,
  BrokerCreationFormState,
} from '../../reducers/7.12/reducer';
import {
  BrokerProperties,
  BrokerPropertiesList,
} from './BrokerProperties/BrokerProperties';
import { useNavigate } from 'react-router-dom-v5-compat';

type FormViewProps = {
  onCreateBroker: (formValues: K8sResourceCommon) => void;
  notification: {
    title: string;
    variant: AlertVariant;
  };
  isUpdate: boolean;
};

export const FormView: FC<FormViewProps> = ({
  onCreateBroker,
  notification: serverNotification,
  isUpdate,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const defaultNotification = { title: '', variant: AlertVariant.default };

  //states
  const [notification, setNotification] = useState(defaultNotification);

  const formState = useContext(BrokerCreationFormState);
  const { cr } = useContext(BrokerCreationFormState);
  const targetNs = cr.metadata.namespace;
  const dispatch = useContext(BrokerCreationFormDispatch);

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
      setNotification({ title: 'ok', variant: AlertVariant.success });
      return true;
    }
  };

  const onSubmit = () => {
    const isValid = validateFormFields(formState.cr);
    if (isValid) {
      onCreateBroker(formState.cr);
      navigate('/k8s/all-namespaces/brokers');
    }
  };

  const onCancel = () => {
    navigate('/k8s/all-namespaces/brokers');
  };

  const handleNameChange = (name: string) => {
    dispatch({
      operation: ArtemisReducerOperations.setBrokerName,
      payload: name,
    });
  };

  const [isPerBrokerConfig, setIsPerBrokerConfig] = useState<boolean>(false);

  const handleChange = (
    checked: boolean,
    _event: React.FormEvent<HTMLInputElement>,
  ) => {
    setIsPerBrokerConfig(checked);
  };
  const [selectedVersion, setSelectedVersion] = useState('7.12');

  const onChangeVersion = (value: string) => {
    setSelectedVersion(value);
  };

  const options = [
    { value: 'please choose', label: 'Select a version', disabled: true },
    { value: '7.12', label: 'AMQ 7.12', disabled: false },
    { value: '8.0', label: 'AMQ 8.0', disabled: true },
  ];

  const crName = formState.cr.metadata.name;
  const replicas = formState.cr.spec.deploymentPlan.size;
  return (
    <>
      <Form isHorizontal isWidthLimited>
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
        <FormFieldGroup>
          <Grid hasGutter md={6}>
            <FormGroup
              label="CR Name"
              isRequired
              fieldId="horizontal-form-name"
            >
              <TextInput
                value={crName}
                isRequired
                type="text"
                id="horizontal-form-name"
                aria-describedby="horizontal-form-name-helper"
                name="horizontal-form-name"
                onChange={handleNameChange}
              />
            </FormGroup>
            <FormGroup
              label="Replicas"
              isRequired
              fieldId="horizontal-form-name"
            >
              <NumberInput
                value={replicas}
                min={1}
                max={1024}
                onMinus={() =>
                  dispatch({
                    operation: ArtemisReducerOperations.decrementReplicas,
                  })
                }
                onChange={(event) =>
                  dispatch({
                    operation: ArtemisReducerOperations.setReplicasNumber,
                    payload: Number((event.target as HTMLInputElement).value),
                  })
                }
                onPlus={() =>
                  dispatch({
                    operation: ArtemisReducerOperations.incrementReplicas,
                  })
                }
                inputName="input"
                inputAriaLabel="number input"
                minusBtnAriaLabel="minus"
                plusBtnAriaLabel="plus"
              />
            </FormGroup>
            <FormGroup label="ingressDomain" fieldId="horizontal-form-Domain">
              <TextInput
                label="Ingress Domain"
                name={'ingressDomain'}
                id={'ingressDomain'}
                value={cr.spec?.ingressDomain}
                onChange={(v) =>
                  dispatch({
                    operation: ArtemisReducerOperations.setIngressDomain,
                    payload: v,
                  })
                }
              />
            </FormGroup>
            <FormGroup label="Broker Properties">
              <InputGroup>
                <InputGroupText id="broker-version" className=".pf-u-w-initial">
                  Version:
                </InputGroupText>
                <FormSelect
                  value={selectedVersion}
                  onChange={onChangeVersion}
                  aria-label="FormSelect Input"
                >
                  {options.map((option, index) => (
                    <FormSelectOption
                      isDisabled={option.disabled}
                      key={index}
                      value={option.value}
                      label={option.label}
                    />
                  ))}
                </FormSelect>
              </InputGroup>
            </FormGroup>
            <FormGroup label="Per broker config">
              <Switch
                id="simple-switch"
                label="enabled"
                labelOff="disabled"
                isChecked={isPerBrokerConfig}
                onChange={handleChange}
                ouiaId="BasicSwitch"
                isDisabled={replicas <= 1}
              />
            </FormGroup>
          </Grid>
        </FormFieldGroup>
      </Form>
      <Form isHorizontal>
        <Banner variant={'info'}>
          <b>{crName}</b>
          {' in namespace '}
          <b>{targetNs}</b>
        </Banner>
        <FormFieldGroup>
          {isPerBrokerConfig && replicas > 1 ? (
            <BrokerPropertiesList
              replicas={replicas}
              crName={crName}
              targetNs={targetNs}
            />
          ) : (
            <BrokerProperties
              brokerId={0}
              perBrokerProperties={false}
              crName={crName}
              targetNs={targetNs}
            />
          )}
        </FormFieldGroup>
      </Form>
      <Form>
        <FormFieldGroup>
          <ActionGroup>
            <Button
              variant={ButtonVariant.primary}
              type="submit"
              onClick={onSubmit}
            >
              {isUpdate ? t('apply') : t('create')}
            </Button>
            <Button variant={ButtonVariant.link} onClick={onCancel}>
              {t('cancel')}
            </Button>
          </ActionGroup>
        </FormFieldGroup>
      </Form>
    </>
  );
};
