import { FC, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Form,
  Alert,
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
import {
  ArtemisReducerOperations,
  BrokerCreationFormState,
  BrokerCreationFormDispatch,
} from '../../../utils';
import { BrokerActionGroup } from './ActionGroup';

type FormViewProps = {
  onCreateBroker: (formValues: K8sResourceCommon) => void;
  notification: {
    title: string;
    variant: AlertVariant;
  };
  targetNs: string;
  isUpdate: boolean;
};

export const FormView: FC<FormViewProps> = ({
  onCreateBroker,
  notification: serverNotification,
  targetNs,
  isUpdate,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const defaultNotification = { title: '', variant: AlertVariant.default };

  //states
  const [notification, setNotification] = useState(defaultNotification);

  const formState = useContext(BrokerCreationFormState);
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
    }
  };

  const onCancel = () => {
    history.push('/k8s/all-namespaces/brokers');
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

  console.log('input cr', formState.cr);

  const crName = formState.cr.metadata.name;
  const replicas = formState.cr.spec.deploymentPlan.size;
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
        </StackItem>
      </Stack>
      <BrokerActionGroup
        isUpdate={isUpdate}
        onSubmit={onSubmit}
        onCancel={onCancel}
      ></BrokerActionGroup>
    </Form>
  );
};
