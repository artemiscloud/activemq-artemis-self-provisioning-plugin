import { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
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
  ValidatedOptions,
  Spinner,
  SelectOption,
  Select,
  SelectVariant,
} from '@patternfly/react-core';
import { useTranslation } from '../../../../i18n';
import { K8sResourceCommon as ArtemisCR } from '../../../../utils';
import {
  K8sResourceCommon,
  RedExclamationCircleIcon,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { t } from 'i18next';
import {
  ArtemisReducerAction,
  ArtemisReducerFields,
} from '../../AddTlsBroker.component';

type SelectIssuerProps = {
  namespace: string;
  selectedIssuer: string;
  setSelectedIssuer: (issuerName: string) => void;
};

export const SelectIssuer: FC<SelectIssuerProps> = ({
  namespace,
  selectedIssuer,
  setSelectedIssuer,
}) => {
  const [issuers, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>(
    {
      groupVersionKind: {
        group: 'cert-manager.io',
        version: 'v1',
        kind: 'Issuer',
      },
      isList: true,
      namespace: namespace,
    },
  );
  const [isOpen, setIsOpen] = useState(false);
  if (!loaded) {
    return <Spinner size="lg" />;
  }
  if (loadError) {
    return (
      <>
        {t('cant-fetch-issuers')}
        <RedExclamationCircleIcon />
      </>
    );
  }
  const options = issuers.map((issuer) => (
    <SelectOption key={issuer.metadata.name} value={issuer.metadata.name} />
  ));

  const onSelect = (_event: any, selection: string, isPlaceholder: any) => {
    if (isPlaceholder) clearSelection();
    else {
      setSelectedIssuer(selection);
      setIsOpen(false);
    }
  };

  const clearSelection = () => {
    setSelectedIssuer('');
    setIsOpen(false);
  };

  const filterMatchingOptions = (_: any, value: string) => {
    if (!value) {
      return options;
    }

    const input = new RegExp(value, 'i');
    return options.filter((child) => input.test(child.props.value));
  };

  const titleId = 'typeahead-select-issuer';
  return (
    <div>
      <span id={titleId} hidden>
        Select a state
      </span>
      <Select
        variant={SelectVariant.typeahead}
        typeAheadAriaLabel="Select an issuer"
        onToggle={() => setIsOpen(!isOpen)}
        onSelect={onSelect}
        onClear={clearSelection}
        onFilter={filterMatchingOptions}
        selections={selectedIssuer}
        isOpen={isOpen}
        aria-labelledby={titleId}
        placeholderText="Select an issuer"
      >
        {options}
      </Select>
    </div>
  );
};

type FormViewProps = {
  namespace: string;
  formValues: ArtemisCR;
  dispatch: React.Dispatch<ArtemisReducerAction>;
  onCreateBroker: (formValues: ArtemisCR) => void;
  serverNotification: {
    title: string;
    variant: AlertVariant;
  };
};

export const FormView: FC<FormViewProps> = ({
  namespace,
  formValues: cr,
  dispatch,
  onCreateBroker,
  serverNotification: serverNotification,
}) => {
  const [prevServerNotif, setPrevServerNotif] = useState(serverNotification);
  const [notification, setNotification] = useState(serverNotification);
  if (serverNotification !== prevServerNotif) {
    setNotification(serverNotification);
    setPrevServerNotif(serverNotification);
  }

  const { t } = useTranslation();
  const history = useHistory();

  const selectedIssuer =
    cr.spec?.resourceTemplates && cr.spec.resourceTemplates[0].annotations
      ? cr.spec.resourceTemplates[0].annotations['cert-manager.io/issuer']
      : '';

  const validateGenericName = (name: string) => {
    const regex =
      /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/i;
    return regex.test(name);
  };

  const onSubmit = () => {
    if (
      validateGenericName(cr.metadata.name) &&
      validateGenericName(
        cr.spec?.acceptors && cr.spec.acceptors[0]
          ? cr.spec.acceptors[0].name
          : '',
      )
    ) {
      setNotification({ title: '', variant: AlertVariant.success });
      onCreateBroker(cr);
    } else {
      setNotification({
        title: t('form_view_validation_info'),
        variant: AlertVariant.danger,
      });
    }
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

      <FormGroup label={t('domain')} isRequired fieldId="domain">
        <TextInput
          isRequired
          type="text"
          id="domain"
          name="domain"
          value={cr.spec?.ingressDomain}
          validated={
            validateGenericName(cr.spec?.ingressDomain)
              ? ValidatedOptions.success
              : ValidatedOptions.error
          }
          onChange={(value) =>
            dispatch({
              field: ArtemisReducerFields.ingressDomain,
              value: value,
            })
          }
        />
      </FormGroup>
      <FormGroup label={t('name')} isRequired fieldId="name">
        <TextInput
          isRequired
          type="text"
          id="name"
          name="name"
          value={cr.metadata.name}
          validated={
            validateGenericName(cr.metadata.name)
              ? ValidatedOptions.success
              : ValidatedOptions.error
          }
          onChange={(value) =>
            dispatch({
              field: ArtemisReducerFields.brokerName,
              value: value,
            })
          }
        />
      </FormGroup>
      <FormGroup label={t('issuer')} isRequired fieldId="issuer">
        <SelectIssuer
          namespace={namespace}
          selectedIssuer={selectedIssuer}
          setSelectedIssuer={(value) =>
            dispatch({
              field: ArtemisReducerFields.issuer,
              value: value,
            })
          }
        />
      </FormGroup>
      <FormGroup label={t('acceptor')} isRequired fieldId="acceptor">
        <TextInput
          isRequired
          type="text"
          id="acceptor_name"
          name="acceptor_name"
          value={
            cr.spec?.acceptors && cr.spec.acceptors[0]
              ? cr.spec.acceptors[0].name
              : ''
          }
          validated={
            validateGenericName(
              cr.spec?.acceptors && cr.spec.acceptors[0]
                ? cr.spec.acceptors[0].name
                : '',
            )
              ? ValidatedOptions.success
              : ValidatedOptions.error
          }
          onChange={(value) =>
            dispatch({
              field: ArtemisReducerFields.acceptorName,
              value: value,
            })
          }
        />
        <TextInput
          isRequired
          type="number"
          id="acceptor_port"
          name="acceptor_port"
          value={
            cr.spec?.acceptors && cr.spec.acceptors[0]
              ? cr.spec.acceptors[0].port
              : ''
          }
          validated={
            typeof (cr.spec?.acceptors && cr.spec.acceptors[0]
              ? cr.spec.acceptors[0].port
              : '') === 'number'
              ? ValidatedOptions.success
              : ValidatedOptions.error
          }
          onChange={(value) => {
            dispatch({
              field: ArtemisReducerFields.acceptorPort,
              value: Number(value),
            });
          }}
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
