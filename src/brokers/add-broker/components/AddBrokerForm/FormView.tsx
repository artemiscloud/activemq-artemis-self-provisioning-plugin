import { FC, FormEvent, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Form,
  Alert,
  Button,
  ButtonVariant,
  ActionGroup,
  AlertGroup,
  AlertVariant,
  StackItem,
  Stack,
  TextInput,
  Flex,
  FlexItem,
  Divider,
  FormGroup,
  Switch,
  NumberInput,
  InputGroup,
  InputGroupText,
  FormSelect,
  FormSelectOption,
  Title,
  Banner,
} from '@patternfly/react-core';
import { useTranslation } from '../../../../i18n';
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { BrokerProperties, BrokerPropertiesList } from './BrokerProperties';
import { BrokerConfigContext } from '../../../utils';

type FormViewProps = {
  onChangeFieldValue: (value: string, evt: FormEvent<HTMLInputElement>) => void;
  onCreateBroker: (formValues: K8sResourceCommon) => void;
  notification: {
    title: string;
    variant: AlertVariant;
  };
  targetNs: string;
};

export const FormView: FC<FormViewProps> = ({
  //  onChangeFieldValue,
  onCreateBroker,
  notification: serverNotification,
  targetNs,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const defaultNotification = { title: '', variant: AlertVariant.default };

  //states
  const [notification, setNotification] = useState(defaultNotification);

  const yamlValue = useContext(BrokerConfigContext);

  const [crName, setCrName] = useState(yamlValue.yamlData.metadata.name);

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
    const isValid = validateFormFields(yamlValue.yamlData);
    if (isValid) {
      onCreateBroker(yamlValue.yamlData);
    }
  };

  const onCancel = () => {
    history.push('/k8s/all-namespaces/brokers');
  };

  const handleNameChange = (name: string) => {
    setCrName(name);
    yamlValue.yamlData.metadata.name = name;
  };

  const [replicas, setReplicas] = useState(
    yamlValue.yamlData.spec.deploymentPlan.size,
  );

  const replicaStepper = (stepValue: number) => {
    setReplicas(replicas + stepValue);
    yamlValue.yamlData.spec.deploymentPlan.size += stepValue;
  };

  const onChangeReplicas = (event: React.FormEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    setReplicas(value);
    yamlValue.yamlData.spec.deploymentPlan.size = +value;
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

  return (
    <Form
      isWidthLimited
      className="pf-u-mx-md"
      maxWidth="100%"
      onSubmit={(e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
      }}
    >
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
      <Stack hasGutter={true} name="broker view stack">
        <StackItem>
          <Flex>
            <FlexItem>
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
            </FlexItem>
            <FlexItem>
              <FormGroup
                label="Replicas"
                isRequired
                fieldId="horizontal-form-name"
              >
                <NumberInput
                  value={replicas}
                  min={1}
                  max={1024}
                  onMinus={() => replicaStepper(-1)}
                  onChange={onChangeReplicas}
                  onPlus={() => replicaStepper(1)}
                  inputName="input"
                  inputAriaLabel="number input"
                  minusBtnAriaLabel="minus"
                  plusBtnAriaLabel="plus"
                />
              </FormGroup>
            </FlexItem>
          </Flex>
        </StackItem>
        <Divider component="div" />
        <StackItem>
          <Flex justifyContent={{ default: 'justifyContentFlexStart' }}>
            <FlexItem>
              <Title headingLevel="h4">Broker Properties</Title>
            </FlexItem>
            <FlexItem>
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
            </FlexItem>
            <FlexItem>
              <Switch
                id="simple-switch"
                label="per broker config"
                labelOff="per broker config(disabled)"
                isChecked={isPerBrokerConfig}
                onChange={handleChange}
                ouiaId="BasicSwitch"
                isDisabled={replicas <= 1}
              />
            </FlexItem>
          </Flex>
        </StackItem>
        <StackItem>
          <Banner variant={'info'}>
            <b>{crName}</b>
            {' in namespace '}
            <b>{targetNs}</b>
          </Banner>
        </StackItem>
        <StackItem isFilled>
          {isPerBrokerConfig && replicas > 1 ? (
            <BrokerPropertiesList
              replicas={yamlValue.yamlData.spec.deploymentPlan.size}
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
        </StackItem>
      </Stack>
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
