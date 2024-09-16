import {
  Banner,
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
  InputGroupItem,
} from '@patternfly/react-core';
import { FC, useContext, useState } from 'react';
import {
  ArtemisReducerOperations,
  BrokerCreationFormDispatch,
  BrokerCreationFormState,
} from '@app/reducers/7.12/reducer';
import {
  BrokerProperties,
  BrokerPropertiesList,
} from './BrokerProperties/BrokerProperties';
import { useTranslation } from '@app/i18n/i18n';

export const FormView: FC = () => {
  const { t } = useTranslation();
  const formState = useContext(BrokerCreationFormState);
  const { cr } = useContext(BrokerCreationFormState);
  const targetNs = cr.metadata.namespace;
  const dispatch = useContext(BrokerCreationFormDispatch);

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
        <FormFieldGroup>
          <Grid hasGutter md={6}>
            <FormGroup
              label={t('CR Name')}
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
                onChange={(_event, name: string) => handleNameChange(name)}
              />
            </FormGroup>
            <FormGroup
              label={t('Replicas')}
              isRequired
              fieldId="horizontal-form-name"
            >
              <NumberInput
                value={replicas}
                min={0}
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
            <FormGroup label={t('Broker Properties')}>
              <InputGroup>
                <InputGroupText id="broker-version" className=".pf-u-w-initial">
                  {t('Version:')}
                </InputGroupText>
                <InputGroupItem>
                  <FormSelect
                    value={selectedVersion}
                    onChange={(_event, value: string) => onChangeVersion(value)}
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
                </InputGroupItem>
              </InputGroup>
            </FormGroup>
            <FormGroup label={t('Per broker config')}>
              <Switch
                id="simple-switch"
                label="enabled"
                labelOff="disabled"
                isChecked={isPerBrokerConfig}
                onChange={(_event, checked: boolean) =>
                  handleChange(checked, _event)
                }
                ouiaId="BasicSwitch"
                isDisabled={replicas <= 1}
              />
            </FormGroup>
          </Grid>
        </FormFieldGroup>
      </Form>
      <Form isHorizontal>
        <Banner variant={'blue'}>
          <b>{crName}</b>
          {t(' in namespace ')}
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
    </>
  );
};
