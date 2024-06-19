import {
  k8sCreate,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import {
  Button,
  Divider,
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelContent,
  Dropdown,
  DropdownItem,
  FormGroup,
  InputGroup,
  KebabToggle,
  Modal,
  ModalVariant,
  Page,
  Select,
  SelectGroup,
  SelectOption,
  SelectVariant,
  Stack,
  StackItem,
  Text,
  TextInput,
  Title,
  Tooltip,
  ValidatedOptions,
} from '@patternfly/react-core';
import { SelectOptionObject } from '@patternfly/react-core/dist/js';
import * as x509 from '@peculiar/x509';
import base64 from 'base-64';
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ArtemisReducerOperations,
  BrokerCreationFormDispatch,
  BrokerCreationFormState,
  getAcceptor,
  getCertManagerResourceTemplateFromAcceptor,
  getConfigSecret,
  listConfigs,
} from '../brokers/utils';
import { useTranslation } from '../i18n';
import {
  CertIssuerModel,
  CertModel,
  K8sResourceKind,
  SecretModel,
} from '../utils';
import { CertificateDetailsModal } from './CertificateDetailsModal';
import { AcceptorsConfigPage, PresetAlertPopover } from './acceptors-config';
import { ConsoleConfigPage } from './console-config';

export const enum ConfigType {
  connectors = 'connectors',
  acceptors = 'acceptors',
  console = 'console',
}

export type BrokerComponentConfigProps = {
  category: string;
};

export const BrokerComponentConfig: FC<
  PropsWithChildren<BrokerComponentConfigProps>
> = ({ category, children }) => {
  return (
    <Stack>
      <StackItem>
        <Title headingLevel="h2">{category}</Title>
      </StackItem>
      <StackItem isFilled>{children}</StackItem>
    </Stack>
  );
};

export type BrokerConfigProps = {
  brokerId: number;
  target: any;
  isPerBrokerConfig: boolean;
};

export type CertSecretSelectorProps = {
  namespace: string;
  isCa: boolean;
  configType: ConfigType;
  configName: string;
};

const secretGroupVersionKind = {
  group: 'core',
  kind: 'Secret',
  version: 'v1',
};
type CreateSecretOptionsPropTypes = {
  certManagerSecrets: K8sResourceKind[];
  legacySecrets: K8sResourceKind[];
  configType: ConfigType;
  configName: string;
  isCa: boolean;
};
const useCreateSecretOptions = ({
  certManagerSecrets,
  legacySecrets,
  configType,
  configName,
  isCa,
}: CreateSecretOptionsPropTypes) => {
  return [
    certManagerSecrets.length > 0 && (
      <SelectGroup
        label="Cert manager certs"
        key={'cert-manager-certs' + configType + configName + isCa}
      >
        {certManagerSecrets.map((secret, index) => (
          <SelectOption
            key={'cm' + index}
            value={secret.metadata.name}
            label={secret.metadata.name}
          />
        ))}
      </SelectGroup>
    ),
    legacySecrets.length > 0 && (
      <SelectGroup
        label="Legacy certs"
        key={'legacy-certs' + configType + configName + isCa}
      >
        {legacySecrets.map((secret, index) => (
          <SelectOption
            key={'lg' + index}
            value={secret.metadata.name}
            label={secret.metadata.name}
          />
        ))}
      </SelectGroup>
    ),
  ];
};
export const CertSecretSelector: FC<CertSecretSelectorProps> = ({
  namespace,
  isCa,
  configType,
  configName,
}) => {
  console.log(
    '----> entering certSecretSelctor, type',
    configType,
    'name',
    configName,
    'ca',
    isCa,
    'ns',
    namespace,
  );
  const { cr } = useContext(BrokerCreationFormState);
  const dispatch = useContext(BrokerCreationFormDispatch);

  const [secrets, loaded, loadError] = useK8sWatchResource<K8sResourceKind[]>({
    isList: true,
    groupVersionKind: secretGroupVersionKind,
    namespaced: true,
    namespace: namespace,
  });

  console.log('secret loading status', loaded, loadError);
  if (loaded) {
    console.log('loaded number', secrets.length);
  }

  const selectedSecret = getConfigSecret(cr, configType, configName, isCa);

  const [isOpen, setIsOpen] = useState(false);

  const onToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const clearSelection = () => {
    if (configType === ConfigType.acceptors) {
      dispatch({
        operation: ArtemisReducerOperations.setAcceptorSecret,
        payload: {
          secret: undefined,
          name: configName,
          isCa: isCa,
        },
      });
    }
    if (configType === ConfigType.connectors) {
      dispatch({
        operation: ArtemisReducerOperations.setConnectorSecret,
        payload: {
          secret: undefined,
          name: configName,
          isCa: isCa,
        },
      });
    }
    if (configType === ConfigType.console) {
      dispatch({
        operation: ArtemisReducerOperations.setConsoleSecret,
        payload: {
          secret: undefined,
          name: configName,
          isCa: isCa,
        },
      });
    }
    setIsOpen(false);
  };

  const onSelect = (
    _event: React.MouseEvent | React.ChangeEvent,
    value: SelectOptionObject,
    isPlaceholder: boolean,
  ) => {
    if (isPlaceholder) {
      clearSelection();
    } else {
      if (configType === ConfigType.acceptors) {
        dispatch({
          operation: ArtemisReducerOperations.setAcceptorSecret,
          payload: {
            secret: value,
            name: configName,
            isCa: isCa,
          },
        });
      }
      if (configType === ConfigType.connectors) {
        dispatch({
          operation: ArtemisReducerOperations.setConnectorSecret,
          payload: {
            secret: value,
            name: configName,
            isCa: isCa,
          },
        });
      }
      if (configType === ConfigType.console) {
        dispatch({
          operation: ArtemisReducerOperations.setConsoleSecret,
          payload: {
            secret: value,
            name: configName,
            isCa: isCa,
          },
        });
      }
      setIsOpen(false);
    }
  };

  //Cert_annotation_key   = "cert-manager.io/issuer-name"
  //Bundle_annotation_key = "trust.cert-manager.io/hash"
  const isCertSecret = (secret: K8sResourceKind): boolean => {
    if (!secret.metadata || !secret.metadata.annotations) {
      return false;
    }
    if (isCa) {
      if (
        secret.metadata.annotations &&
        'trust.cert-manager.io/hash' in secret.metadata.annotations
      ) {
        return true;
      }
    } else if (
      secret.metadata.annotations &&
      'cert-manager.io/issuer-name' in secret.metadata.annotations
    ) {
      return true;
    }
    return false;
  };

  const hasKey = (data: any, key: string): boolean => {
    console.log('check key in data ' + typeof data);
    if (data instanceof Object) {
      return key in data;
    }
    return false;
  };

  const isLegacySecret = (secret: K8sResourceKind): boolean => {
    return (
      !(
        secret.metadata?.annotations &&
        'aa-spp-generated' in secret.metadata.annotations
      ) &&
      hasKey(secret.data, 'broker.ks') &&
      hasKey(secret.data, 'keyStorePassword') &&
      hasKey(secret.data, 'client.ts') &&
      hasKey(secret.data, 'trustStorePassword')
    );
  };

  const parseSecrets = (): {
    certManagerSecrets: K8sResourceKind[];
    legacySecrets: K8sResourceKind[];
  } => {
    const certSecrets = secrets.filter((x) => {
      return isCertSecret(x);
    });
    const legacySecrets = secrets.filter((x) => {
      return isLegacySecret(x);
    });
    return { certManagerSecrets: certSecrets, legacySecrets: legacySecrets };
  };

  const { certManagerSecrets, legacySecrets } = useMemo(
    () => parseSecrets(),
    [secrets],
  );

  const [isSecretGenerating, setIsSecretGenerating] = useState<boolean>(false);
  const [certGenMessage, setCertGenMessage] = useState<string>('Generate');
  const [isDrawerExpanded, setIsDrawerExpanded] = useState<boolean>(false);
  const [certGenInfo, setCertGenInfo] = useState<string>('');
  const drawerRef = useRef<HTMLDivElement>(null);
  const [caGenFromTlsSecret, setCaGenFromTlsSecret] = useState('');
  const [isCertDetailsModalOpen, setIsCertDetailsModalOpen] = useState(false);
  const [certsToShow, setCertsToShow] = useState<x509.X509Certificate[]>([]);
  const [certsToShowSecret, setCertsToShowSecret] = useState<string>('');
  const [sertsToShowPem, setCertsToShowPem] = useState<string>('');

  const onCloseCertDetailsModel = () => {
    setIsCertDetailsModalOpen(false);
  };

  const [certManagerDeployments] = useK8sWatchResource<K8sResourceKind[]>({
    isList: true,
    groupVersionKind: {
      group: 'apps',
      kind: 'Deployment',
      version: 'v1',
    },
    namespaced: true,
    namespace: 'cert-manager',
  });

  console.log('watching issuers');
  const [certIssuers] = useK8sWatchResource<K8sResourceKind[]>({
    isList: true,
    groupVersionKind: {
      group: 'cert-manager.io',
      kind: 'Issuer',
      version: 'v1',
    },
    namespaced: true,
    namespace: namespace,
  });

  console.log('watching certs');
  const [certs] = useK8sWatchResource<K8sResourceKind[]>({
    isList: true,
    groupVersionKind: {
      group: 'cert-manager.io',
      kind: 'Certificate',
      version: 'v1',
    },
    namespaced: true,
    namespace: namespace,
  });

  const onDrawerExpand = () => {
    drawerRef.current && drawerRef.current.focus();
  };

  const onCloseDrawer = () => {
    setIsDrawerExpanded(false);
  };

  console.log(
    '....creating panelconetnt',
    typeof certGenInfo,
    'current cert gen info',
    certGenInfo,
  );
  const panelContent = (
    <DrawerPanelContent>
      <DrawerHead key={'drawerHead' + configType + configName + isCa}>
        <span tabIndex={isDrawerExpanded ? 0 : -1} ref={drawerRef}>
          {certGenInfo}
        </span>
        <DrawerActions>
          <DrawerCloseButton onClick={onCloseDrawer} />
        </DrawerActions>
      </DrawerHead>
    </DrawerPanelContent>
  );

  const failedSecretGen = (messages: string) => {
    setCertGenInfo(messages);
    setIsDrawerExpanded(true);
    setIsSecretGenerating(false);
    setCertGenMessage('Generate');
  };

  const succeededSecretGen = (message?: string) => {
    setIsSecretGenerating(false);
    setCertGenMessage('Generate');
    setCertGenInfo('cert generation successful \n' + (message ? message : ''));
    setIsDrawerExpanded(true);
  };

  const createSelfSigningIssuer = async (issuerName: string) => {
    console.log('creating issuer', certIssuers?.length);
    if (certIssuers?.length > 0) {
      for (let i = 0; i < certIssuers.length; i++) {
        console.log('checking issuer: ', certIssuers[i]);
        if (certIssuers[i].metadata.name === issuerName) {
          console.log('issuer already there');
          return true;
        }
      }
    }
    const content = {
      apiVersion: 'cert-manager.io/v1',
      kind: 'Issuer',
      metadata: {
        name: issuerName,
        namespace: namespace,
      },
      spec: {
        selfSigned: {},
      },
    };

    console.log('now createing issuer...', content);
    return await k8sCreate({ model: CertIssuerModel, data: content });
  };

  const createSelfSignedCert = async (nameBase: string) => {
    let certName = nameBase;
    let nameValid = false;
    let index = 0;
    while (certs?.length > 0 && !nameValid) {
      nameValid = true;
      for (let i = 0; i < certs.length; i++) {
        if (certs[i].metadata.name === certName) {
          nameValid = false;
          certName = nameBase + '-' + index++;
          break;
        }
      }
    }

    const content = {
      apiVersion: 'cert-manager.io/v1',
      kind: 'Certificate',
      metadata: {
        name: certName,
        namespace: namespace,
      },
      spec: {
        isCA: true,
        commonName: 'artemiscloud.io',
        secretName: certName + '-secret',
        subject: {
          organizations: ['www.artemiscloud.io'],
        },
        issuerRef: {
          name: 'issuer-amq-spp-test',
          kind: 'Issuer',
        },
        dnsNames: ['localhost'],
      },
    };

    return await k8sCreate({ model: CertModel, data: content }).then(
      (result) => {
        console.log(result);
        return { certName: certName, secretName: certName + '-secret' };
      },
    );
  };

  const findSecret = (secName: string): K8sResourceKind => {
    let result: K8sResourceKind = null;
    for (let i = 0; i < secrets.length; i++) {
      console.log(
        '+checking sec',
        secrets[i].metadata.name,
        'against',
        secName,
      );
      if (secrets[i].metadata.name === secName) {
        console.log('found');
        result = secrets[i];
        break;
      }
    }
    return result;
  };

  const generateCaSecret = async () => {
    const tlsSecret = findSecret(caGenFromTlsSecret);
    if (tlsSecret !== null) {
      const caSecName = 'ca-' + caGenFromTlsSecret;
      const caSecret: K8sResourceKind = {
        apiVersion: 'v1',
        kind: 'Secret',
        metadata: {
          name: caSecName,
          namespace: namespace,
          annotations: {
            //to fake a trust-manager bundle
            'trust.cert-manager.io/hash':
              '401f277bd06c5ea2cbdf910cc7fb61c46965a0418ff8c2627d041cf92aeb0003',
          },
        },
        data: {
          'cabundle.pem': tlsSecret.data['tls.crt'],
        },
      };
      await k8sCreate({ model: SecretModel, data: caSecret })
        .then((result) => {
          console.log(result);
          succeededSecretGen(
            'CA Secret:' +
              caSecName +
              '\nMatching TLS Secret: ' +
              caGenFromTlsSecret,
          );
          setCaGenFromTlsSecret('');
          if (configType === ConfigType.acceptors) {
            dispatch({
              operation: ArtemisReducerOperations.setAcceptorSecret,
              payload: {
                secret: caSecName,
                name: configName,
                isCa: isCa,
              },
            });
          }
          if (configType === ConfigType.connectors) {
            dispatch({
              operation: ArtemisReducerOperations.setConnectorSecret,
              payload: {
                secret: caSecName,
                name: configName,
                isCa: isCa,
              },
            });
          }
          if (configType === ConfigType.console) {
            dispatch({
              operation: ArtemisReducerOperations.setConsoleSecret,
              payload: {
                secret: caSecName,
                name: configName,
                isCa: isCa,
              },
            });
          }
        })
        .catch((err) => {
          failedSecretGen('failed to create ca secret\n' + err.message);
        });
    }
  };

  const onCreateTestCert = () => {
    setIsSecretGenerating(true);

    setCertGenMessage('Checking cert-manager');
    setCertGenInfo(
      'cert mgr pods: ' + certManagerDeployments.length.toString(),
    );

    if (certManagerDeployments.length === 0) {
      failedSecretGen(
        'No cert-manager found\n' + 'please install cert-manager.',
      );
      return;
    }
    let certMgrFound = false;
    for (let i = 0; i < certManagerDeployments?.length; i++) {
      if (certManagerDeployments[i].metadata?.name === 'cert-manager') {
        certMgrFound = true;
        break;
      }
    }
    if (!certMgrFound) {
      failedSecretGen(
        'No cert-manager found\n' + 'please install cert-manager.',
      );
      return;
    }
    setCertGenMessage('Creating issuer');

    createSelfSigningIssuer('issuer-amq-spp-test')
      .then((result) => {
        //Create self-signed cert
        console.log(result);
        setCertGenMessage('Creating cert');
        createSelfSignedCert('cert-amq-spp-test')
          .then((result) => {
            console.log(result);
            if (isCa) {
              setCaGenFromTlsSecret(result.secretName);
            } else {
              succeededSecretGen();
            }
          })
          .catch((e) => {
            failedSecretGen(e.message);
          });
      })
      .catch((e) => {
        console.log('===failed to create issuer', e);
        failedSecretGen(e.message);
      });
  };

  useEffect(() => {
    if (loaded && caGenFromTlsSecret !== '') {
      generateCaSecret();
    }
  }, [caGenFromTlsSecret, secrets, loaded]);

  console.log('**** return group dumping statuse****');

  const secretOptions = useCreateSecretOptions({
    certManagerSecrets,
    legacySecrets,
    configType,
    configName,
    isCa,
  });

  const isSelectCertSecret = (): boolean => {
    const theSecret = certManagerSecrets.filter((value) => {
      return value.metadata.name === selectedSecret.toString();
    });
    return theSecret.length === 1;
  };

  const parseCertsFromPem = (pem: string): x509.X509Certificate[] => {
    const certs: x509.X509Certificate[] = [];
    let certPems = pem.split(
      /-----BEGIN CERTIFICATE-----\n|-----END CERTIFICATE-----\n/g,
    );

    certPems = certPems.filter((value) => {
      return value !== '';
    });

    for (let i = 0; i < certPems.length; i++) {
      const pemStr = certPems[i].replace(/\n/g, '');
      const cert = new x509.X509Certificate(pemStr);
      certs.push(cert);
    }
    return certs;
  };

  const showCertInfo = () => {
    const theSecret = certManagerSecrets.filter((value) => {
      return value.metadata.name === selectedSecret.toString();
    });
    if (theSecret.length !== 1) {
      alert('only support tls format secret from cert-manager');
    }
    let pem: string;
    try {
      if (isCa) {
        console.log('showing ca cert', theSecret[0]);
        Object.keys(theSecret[0].data).forEach((key) => {
          pem = base64.decode(theSecret[0].data[key]);
        });
      } else {
        pem = base64.decode(theSecret[0].data['tls.crt']);
      }

      setCertsToShow(parseCertsFromPem(pem));
      setCertsToShowSecret(theSecret[0].metadata.name);
      setCertsToShowPem(pem);
      setIsCertDetailsModalOpen(true);
    } catch (err) {
      alert('error decoding cert: ' + err.message);
    }
  };
  const showCertTooltipRef = useRef<HTMLButtonElement>(null);
  const rt = getCertManagerResourceTemplateFromAcceptor(
    cr,
    getAcceptor(cr, configName),
  );
  const stringSelectedSecret = selectedSecret ? selectedSecret.toString() : '';
  return (
    <FormGroup
      label={isCa ? 'Trust Secrets' : 'Cert Secrets'}
      fieldId={'horizontal-form-secret' + configType + configName + isCa}
      key={(isCa ? 'trust-secrets' : 'cert-secrets') + configType + configName}
      labelIcon={
        <>
          {rt && !isCa && configType === ConfigType.acceptors && (
            <PresetAlertPopover
              configName={configName}
              configType={configType}
              kind="warning"
            />
          )}
        </>
      }
    >
      <CertificateDetailsModal
        isModalOpen={isCertDetailsModalOpen}
        certs={certsToShow}
        secretName={certsToShowSecret}
        pem={sertsToShowPem}
        onCloseModal={onCloseCertDetailsModel}
      ></CertificateDetailsModal>
      <Tooltip
        content={
          <>
            {stringSelectedSecret ? (
              <div>Show cert details of {stringSelectedSecret}</div>
            ) : (
              <div>Select a secret to see its details</div>
            )}
          </>
        }
        reference={showCertTooltipRef}
      />
      <Drawer isExpanded={isDrawerExpanded} onExpand={onDrawerExpand}>
        <DrawerContent panelContent={panelContent}>
          <DrawerContentBody>
            <InputGroup>
              <Select
                id={'select-secrets' + isCa + configType + configName}
                key={'key-select-secrets' + isCa + configType + configName}
                variant={SelectVariant.typeahead}
                typeAheadAriaLabel="Select a secret"
                onToggle={onToggle}
                onSelect={onSelect}
                onClear={clearSelection}
                selections={selectedSecret}
                isOpen={isOpen}
                aria-labelledby={'grouped-typeahead-select-id'}
                placeholderText="Select a Secret"
                isGrouped
                menuAppendTo="parent"
              >
                {secretOptions}
              </Select>
              <Button
                variant="control"
                aria-label="View cert"
                onClick={showCertInfo}
                ref={showCertTooltipRef}
                isDisabled={
                  stringSelectedSecret === '' || !isSelectCertSecret()
                }
              >
                {'\u2687'}
              </Button>
              <Button
                isDisabled={isSecretGenerating}
                variant="secondary"
                onClick={onCreateTestCert}
                isLoading={isSecretGenerating}
              >
                {certGenMessage}
              </Button>
            </InputGroup>
          </DrawerContentBody>
        </DrawerContent>
      </Drawer>
    </FormGroup>
  );
};

export const ConfigCategoryDescPage: FC<string> = (category: string) => {
  const { t } = useTranslation();
  return (
    <Page>
      <Title headingLevel="h2">Configuring {category}</Title>
      <div className="pf-u-pt-xl"></div>
      <Divider orientation={{ default: 'horizontal' }} />
      <Text>{t('choose_existing_to_edit')}</Text>
    </Page>
  );
};

export const ConfigTypeContext = createContext<ConfigType>(
  ConfigType.acceptors,
);

export const GetConfigurationPage: FC<BrokerConfigProps> = ({
  brokerId,
  target,
  isPerBrokerConfig,
}) => {
  const { t } = useTranslation();
  if (isPerBrokerConfig) {
    return <Text>{t('broker_config_disabled')}</Text>;
  }

  const configType: ConfigType = target;

  if (target) {
    return (
      <ConfigTypeContext.Provider value={configType}>
        {target === 'console' ? (
          <ConsoleConfigPage brokerId={brokerId} />
        ) : (
          <AcceptorsConfigPage brokerId={brokerId} />
        )}
      </ConfigTypeContext.Provider>
    );
  }
  return <Text>{t('broker_configuration_page')}</Text>;
};

export type AcceptorDropDownProps = {
  compKey: string;
  compType: ConfigType;
  brokerId: number;
  configName: string;
  onDelete: () => void;
};

export const AcceptorDropDown: FC<AcceptorDropDownProps> = ({
  compKey,
  compType,
  brokerId,
  configName,
  onDelete,
}) => {
  const [isAcceptorOpen, setIsAcceptorOpen] = useState(false);
  const dispatch = useContext(BrokerCreationFormDispatch);

  const onToggleAcceptor = (isOpen: boolean) => {
    setIsAcceptorOpen(isOpen);
  };

  const onDeleteAcceptorSelect = () => {
    setIsAcceptorOpen(!isAcceptorOpen);
  };

  const onDeleteAcceptor = (_event: MouseEvent) => {
    if (compType === ConfigType.acceptors) {
      dispatch({
        operation: ArtemisReducerOperations.deleteAcceptor,
        payload: configName,
      });
    }
    if (compType === ConfigType.connectors) {
      dispatch({
        operation: ArtemisReducerOperations.deleteConnector,
        payload: configName,
      });
    }
    onDelete();
  };

  const AcceptorActionItems = () => {
    const { t } = useTranslation();
    return [
      <DropdownItem key={compKey + 'ActionItems0'} onClick={onDeleteAcceptor}>
        {t('delete')}
      </DropdownItem>,
    ];
  };

  return (
    <Dropdown
      key={compKey + 'Dropdown'}
      onSelect={onDeleteAcceptorSelect}
      toggle={
        <KebabToggle
          key={'Acceptors.' + brokerId + '.' + configName}
          onToggle={onToggleAcceptor}
        />
      }
      isOpen={isAcceptorOpen}
      isPlain
      dropdownItems={AcceptorActionItems()}
    />
  );
};

export type ConfigRenamingModalProps = {
  initName: string;
};

export const ConfigRenamingModal: FC<ConfigRenamingModalProps> = ({
  initName,
}) => {
  const { t } = useTranslation();
  const configType = useContext(ConfigTypeContext);
  const dispatch = useContext(BrokerCreationFormDispatch);
  const [newName, setNewName] = useState(initName);
  const [toolTip, setTooltip] = useState('');
  const [validateStatus, setValidateStatus] = useState(null);
  const { cr } = useContext(BrokerCreationFormState);
  const uniqueSet = listConfigs(configType, cr, 'set') as Set<string>;

  const handleNewName = () => {
    if (configType === ConfigType.acceptors) {
      dispatch({
        operation: ArtemisReducerOperations.setAcceptorName,
        payload: {
          oldName: initName,
          newName: newName,
        },
      });
    }
    if (configType === ConfigType.connectors) {
      dispatch({
        operation: ArtemisReducerOperations.setConnectorName,
        payload: {
          oldName: initName,
          newName: newName,
        },
      });
    }
  };

  const validateName = (value: string) => {
    setNewName(value);
    if (value === '') {
      setValidateStatus(ValidatedOptions.error);
      setTooltip(t('name_not_empty'));
      return false;
    }
    if (uniqueSet?.has(value)) {
      setValidateStatus(ValidatedOptions.error);
      setTooltip(t('name_already_exists'));
      return false;
    }
    setValidateStatus(ValidatedOptions.success);
    setTooltip(t('name_available'));
    return true;
  };

  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Modal
        variant={ModalVariant.small}
        title="Rename"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        actions={[
          <Button
            key="confirm"
            variant="primary"
            onClick={handleNewName}
            isDisabled={validateStatus !== ValidatedOptions.success}
          >
            Confirm
          </Button>,
          <Button key="cancel" variant="link" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>,
        ]}
      >
        <TextInput
          value={newName}
          onChange={validateName}
          isRequired
          validated={validateStatus}
          type="text"
          aria-label="name input panel"
        />
        <p>{toolTip}</p>
      </Modal>
      <Button variant="plain" onClick={() => setIsOpen(true)}>
        {t('rename')}
      </Button>
    </>
  );
};
