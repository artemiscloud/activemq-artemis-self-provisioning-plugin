import { useTranslation } from '../../../../../../../i18n';
import { BrokerCreationFormState } from '../../../../../../../reducers/7.12/reducer';
import {
  CertIssuerModel,
  CertModel,
  IssuerResource,
} from '../../../../../../../k8s';
import {
  RedExclamationCircleIcon,
  k8sCreate,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import {
  Alert,
  AlertVariant,
  Button,
  ButtonVariant,
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelContent,
  FormGroup,
  InputGroup,
  Select,
  SelectOption,
  SelectVariant,
  Spinner,
  TextInput,
} from '@patternfly/react-core';
import { FC, useContext, useState } from 'react';

const createChainOftrust = async (
  name: string,
  namespace: string,
  ingressDomain: string,
) => {
  const rootIssuer = {
    apiVersion: 'cert-manager.io/v1',
    kind: 'Issuer',
    metadata: {
      name: name + '-root-issuer',
      namespace: namespace,
    },
    spec: {
      selfSigned: {},
    },
  };
  const issuerCa = {
    apiVersion: 'cert-manager.io/v1',
    kind: 'Certificate',
    metadata: {
      name: name + 'cert',
      namespace: namespace,
    },
    spec: {
      isCA: true,
      commonName: name,
      dnsNames: ['issuer.' + ingressDomain],
      secretName: name + '-cert-secret',
      privateKey: {
        algorithm: 'ECDSA',
        size: 256,
      },
      issuerRef: {
        name: rootIssuer.metadata.name,
        kind: 'Issuer',
      },
    },
  };
  const content = {
    apiVersion: 'cert-manager.io/v1',
    kind: 'Issuer',
    metadata: {
      name: name,
      namespace: namespace,
    },
    spec: {
      ca: {
        secretName: issuerCa.spec.secretName,
      },
    },
  };

  return await k8sCreate({ model: CertIssuerModel, data: rootIssuer }).then(
    async () => {
      return await k8sCreate({ model: CertModel, data: issuerCa }).then(
        async () => {
          return await k8sCreate({ model: CertIssuerModel, data: content });
        },
      );
    },
  );
};

type SelectIssuerDrawerProps = {
  selectedIssuer: string;
  setSelectedIssuer: (issuerName: string) => void;
  clearIssuer: () => void;
};

export const SelectIssuerDrawer: FC<SelectIssuerDrawerProps> = ({
  selectedIssuer,
  setSelectedIssuer,
  clearIssuer,
}) => {
  const { cr } = useContext(BrokerCreationFormState);
  const { t } = useTranslation();
  const [issuers, loaded, loadError] = useK8sWatchResource<IssuerResource[]>({
    groupVersionKind: {
      group: 'cert-manager.io',
      version: 'v1',
      kind: 'Issuer',
    },
    isList: true,
    namespace: cr.metadata.namespace,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [alertIssuer, setAlertIssuer] = useState<Error>();
  const [isExpanded, setIsExpanded] = useState(false);
  const [newIssuer, setNewIssuer] = useState('');
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
  const options = issuers
    .filter((issuer) => issuer.spec?.ca !== undefined)
    .map((issuer) => (
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
    setAlertIssuer(undefined);
    clearIssuer();
    setIsOpen(false);
  };

  const filterMatchingOptions = (_: any, value: string) => {
    if (!value) {
      return options;
    }

    const input = new RegExp(value, 'i');
    return options.filter((child) => input.test(child.props.value));
  };

  const triggerChainOfTrustCreation = () => {
    setAlertIssuer(undefined);
    createChainOftrust(newIssuer, cr.metadata.namespace, cr.spec.ingressDomain)
      .then(() => {
        setIsExpanded(false);
        setSelectedIssuer(newIssuer);
      })
      .catch((reason) => {
        setAlertIssuer(reason);
      });
  };
  const titleId = 'typeahead-select-issuer';
  return (
    <>
      <Drawer
        isExpanded={isExpanded}
        position="right"
        onExpand={() => setIsExpanded(true)}
      >
        <DrawerContent
          panelContent={
            <DrawerPanelContent>
              <DrawerHead>
                <FormGroup
                  label={t('new_chain_of_trust')}
                  helperText={t('new_chain_of_trust_helper')}
                  isRequired
                >
                  <InputGroup>
                    <TextInput
                      value={newIssuer}
                      onChange={(v) => {
                        setAlertIssuer(undefined);
                        setNewIssuer(v);
                      }}
                    />
                    <Button onClick={triggerChainOfTrustCreation}>
                      {t('create')}
                    </Button>
                  </InputGroup>
                </FormGroup>
                {alertIssuer && (
                  <Alert variant={AlertVariant.danger} title="Error">
                    {alertIssuer.message}
                  </Alert>
                )}
                <DrawerActions>
                  <DrawerCloseButton onClick={() => setIsExpanded(false)} />
                </DrawerActions>
              </DrawerHead>
            </DrawerPanelContent>
          }
        >
          <DrawerContentBody>
            <InputGroup>
              <Select
                variant={SelectVariant.typeahead}
                typeAheadAriaLabel={t('select_an_issuer')}
                onToggle={() => setIsOpen(!isOpen)}
                onSelect={onSelect}
                onClear={clearSelection}
                onFilter={filterMatchingOptions}
                selections={selectedIssuer}
                isOpen={isOpen}
                aria-labelledby={titleId}
                placeholderText={t('select_an_issuer')}
                menuAppendTo="parent"
              >
                {options}
              </Select>
              <Button
                variant={ButtonVariant.primary}
                onClick={() => setIsExpanded(true)}
              >
                {t('create_new_chain_of_trust')}
              </Button>
            </InputGroup>
          </DrawerContentBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
