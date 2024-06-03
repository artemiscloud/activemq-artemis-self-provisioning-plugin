import {
  CertIssuerModel,
  CertModel,
  K8sResourceCommon,
  K8sResourceKind,
  SecretModel,
} from '../utils';
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
  KebabToggle,
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
import {
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  k8sCreate,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { ConsoleConfigPage } from './console-config';
import { BrokerConfigContext } from '../brokers/utils';
import { AcceptorsConfigPage } from './acceptors-config';
import { SelectOptionObject } from '@patternfly/react-core/dist/js';
import { pki } from 'node-forge';
import base64 from 'base-64';

export const enum ConfigType {
  connector = 'connector',
  acceptor = 'acceptor',
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
        <Divider orientation={{ default: 'horizontal' }} />
      </StackItem>
      <StackItem isFilled>{children}</StackItem>
    </Stack>
  );
};

export type BrokerConfigProps = {
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
  const { yamlData, setYamlData } = useContext(BrokerConfigContext);

  const [secrets, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>(
    {
      isList: true,
      groupVersionKind: secretGroupVersionKind,
      namespaced: true,
      namespace: namespace,
    },
  );

  console.log('secret loading status', loaded, loadError);
  if (loaded) {
    console.log('loaded number', secrets.length);
  }

  const newOptionObject = (value: string): SelectOptionObject => {
    return {
      toString() {
        return value;
      },
    };
  };

  const GetAcceptorSecret = (
    brokerModel: K8sResourceCommon,
  ): SelectOptionObject => {
    console.log('getting secret from yaml', configName, 'idCa', isCa);
    if (configType === ConfigType.connector) {
      if (brokerModel.spec?.connectors?.length > 0) {
        for (let i = 0; i < brokerModel.spec.connectors.length; i++) {
          if (brokerModel.spec.connectors[i].name === configName) {
            if (isCa) {
              if (brokerModel.spec.connectors[i].trustSecret) {
                return newOptionObject(
                  brokerModel.spec.connectors[i].trustSecret,
                );
              }
            } else if (brokerModel.spec.connectors[i].sslSecret) {
              return newOptionObject(brokerModel.spec.connectors[i].sslSecret);
            }
          }
        }
      }
    } else if (configType === ConfigType.acceptor) {
      console.log('looking for acceptor secrets');
      if (brokerModel.spec?.acceptors?.length > 0) {
        for (let i = 0; i < brokerModel.spec.acceptors.length; i++) {
          console.log('acceptor ' + i + brokerModel.spec.acceptors[i].name);
          if (brokerModel.spec.acceptors[i].name === configName) {
            console.log('name matches');
            if (isCa) {
              console.log('for ca');
              if (brokerModel.spec.acceptors[i].trustSecret) {
                return newOptionObject(
                  brokerModel.spec.acceptors[i].trustSecret,
                );
              }
            } else if (brokerModel.spec.acceptors[i].sslSecret) {
              console.log('for ssl' + brokerModel.spec.acceptors[i].sslSecret);
              return newOptionObject(brokerModel.spec.acceptors[i].sslSecret);
            }
          }
        }
      }
    } else {
      console.log('console secret');
      if (isCa) {
        if (brokerModel.spec.console.trustSecret) {
          return newOptionObject(brokerModel.spec.console.trustSecret);
        }
      } else if (brokerModel.spec.console.sslSecret) {
        return newOptionObject(brokerModel.spec.console.sslSecret);
      }
    }
    console.log('nothing found');
    return '';
  };

  const [selectedSecret, setSelectedSecret] = useState(
    GetAcceptorSecret(yamlData),
  );

  const [isOpen, setIsOpen] = useState(false);

  const onToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const clearSelection = () => {
    setSelectedSecret(null);
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
      setSelectedSecret(value);
      setIsOpen(false);
    }
  };

  //Cert_annotation_key   = "cert-manager.io/issuer-name"
  //Bundle_annotation_key = "trust.cert-manager.io/hash"
  const isCertSecret = (secret: K8sResourceKind): boolean => {
    console.log(
      'in isCertSecret for ca?',
      isCa,
      'secret',
      secret.metadata.name,
    );
    console.log('full secret', secret);
    if (isCa) {
      if (
        secret.metadata.annotations &&
        'trust.cert-manager.io/hash' in secret.metadata.annotations
      ) {
        console.log('it is ca secret');
        return true;
      }
    } else if (
      secret.metadata.annotations &&
      'cert-manager.io/issuer-name' in secret.metadata.annotations
    ) {
      console.log('it is a cert secret');
      return true;
    }
    console.log('it is not any cert secret');
    return false;
  };

  const isLegacySecret = (secret: K8sResourceKind): boolean => {
    return (
      !(
        secret.metadata?.annotations &&
        'aa-spp-generated' in secret.metadata.annotations
      ) &&
      'broker.ks' in secret.data &&
      'keyStorePassword' in secret.data &&
      'client.ts' in secret.data &&
      'trustStorePassword' in secret.data
    );
  };

  const parseSecrets = (): {
    certManagerSecrets: any[];
    legacySecrets: any[];
  } => {
    console.log(secrets.length, 'isCa', isCa);
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

  const updateAcceptorSecret = (brokerModel: K8sResourceCommon) => {
    console.log('updating model with secret', selectedSecret);
    if (configType === ConfigType.connector) {
      if (brokerModel.spec?.connectors?.length > 0) {
        for (let i = 0; i < brokerModel.spec.connectors.length; i++) {
          if (brokerModel.spec.connectors[i].name === configName) {
            if (isCa) {
              if (selectedSecret) {
                brokerModel.spec.connectors[i].trustSecret =
                  selectedSecret.toString();
              } else {
                delete brokerModel.spec.connectors[i].trustSecret;
              }
            } else {
              if (selectedSecret) {
                brokerModel.spec.connectors[i].sslSecret =
                  selectedSecret.toString();
              } else {
                delete brokerModel.spec.connectors[i].sslSecret;
              }
            }
          }
        }
      }
    } else if (configType === ConfigType.acceptor) {
      console.log('upate for acceptor', configName);
      if (brokerModel.spec?.acceptors?.length > 0) {
        console.log('has some acceptor already');
        for (let i = 0; i < brokerModel.spec.acceptors.length; i++) {
          if (brokerModel.spec.acceptors[i].name === configName) {
            console.log('found selector, selected', selectedSecret);
            if (isCa) {
              if (selectedSecret) {
                brokerModel.spec.acceptors[i].trustSecret =
                  selectedSecret.toString();
              } else {
                delete brokerModel.spec.acceptors[i].trustSecret;
              }
            } else {
              console.log('is cert', selectedSecret);
              if (selectedSecret) {
                brokerModel.spec.acceptors[i].sslSecret =
                  selectedSecret.toString();
              } else {
                delete brokerModel.spec.acceptors[i].sslSecret;
              }
            }
          }
        }
      }
    } else {
      if (brokerModel.spec?.console) {
        if (isCa) {
          if (selectedSecret) {
            brokerModel.spec.console.trustSecret = selectedSecret.toString();
          } else {
            delete brokerModel.spec.console.trustSecret;
          }
        } else {
          if (selectedSecret) {
            brokerModel.spec.console.sslSecret = selectedSecret.toString();
          } else {
            delete brokerModel.spec.console.sslSecret;
          }
        }
      }
    }
  };

  const [isSecretGenerating, setIsSecretGenerating] = useState<boolean>(false);
  const [certGenMessage, setCertGenMessage] = useState<string>('Generate');
  const [isDrawerExpanded, setIsDrawerExpanded] = useState<boolean>(false);
  const [certGenInfo, setCertGenInfo] = useState<string>('');
  const drawerRef = useRef<HTMLDivElement>(null);
  const [caGenFromTlsSecret, setCaGenFromTlsSecret] = useState('');

  console.log('watching deployment');
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
    //drawerRef.current && drawerRef.current.focus();
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
      const pem = base64.decode(tlsSecret.data['tls.crt']);
      const caCert = pki.certificateFromPem(pem);
      const caStore = pki.createCaStore();
      caStore.addCertificate(caCert);
      const capem = pki.certificateToPem(caStore.listAllCertificates()[0]);
      console.log('\n CA cert');
      console.log(capem);
      const caValue = base64.encode(capem);
      console.log('\n encoded CA');
      console.log(caValue);
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
          'cabundle.pem': caValue,
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
          setSelectedSecret(caSecName);
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
              console.log('mmmmmmmmmmmm here cert gen ok,', result);
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
    setYamlData(updateAcceptorSecret);
  }, [selectedSecret]);

  useEffect(() => {
    if (loaded && caGenFromTlsSecret !== '') {
      generateCaSecret();
    }
  }, [caGenFromTlsSecret, secrets, loaded]);

  const secretOptions = useCreateSecretOptions({
    certManagerSecrets,
    legacySecrets,
    configType,
    configName,
    isCa,
  });

  return (
    <FormGroup
      label={isCa ? 'Trust Secrets' : 'Cert Secrets'}
      fieldId={'horizontal-form-secret' + configType + configName + isCa}
      key={(isCa ? 'trust-secrets' : 'cert-secrets') + configType + configName}
    >
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
      >
        {secretOptions}
      </Select>

      <Drawer isExpanded={isDrawerExpanded} onExpand={onDrawerExpand}>
        <DrawerContent panelContent={panelContent}>
          <DrawerContentBody>
            <Button
              isDisabled={isSecretGenerating}
              variant="secondary"
              onClick={onCreateTestCert}
              isLoading={isSecretGenerating}
            >
              {certGenMessage}
            </Button>
          </DrawerContentBody>
        </DrawerContent>
      </Drawer>
    </FormGroup>
  );
};

export const ConfigCategoryDescPage: FC<string> = (category: string) => {
  return (
    <Page>
      <Title headingLevel="h2">Configuring {category}</Title>
      <div className="pf-u-pt-xl"></div>
      <Divider orientation={{ default: 'horizontal' }} />
      <Text>Choose one of the existing {category} to edit or add new one.</Text>
    </Page>
  );
};

export const GetConfigurationPage: FC<BrokerConfigProps> = ({
  target,
  isPerBrokerConfig,
}) => {
  if (isPerBrokerConfig) {
    return <Text>Per Broker Config is disabled for now.</Text>;
  }

  if (target) {
    return (
      <BrokerComponentConfig key={'brokerconfig' + target} category={target}>
        {target === 'acceptors' && (
          <AcceptorsConfigPage
            key={'brokerconfig.acceptors'}
            brokerId={0}
            configType={ConfigType.acceptor}
          />
        )}
        {target === 'connectors' && (
          <AcceptorsConfigPage
            key={'brokerconfig.connectors'}
            brokerId={0}
            configType={ConfigType.connector}
          />
        )}
        {target === 'console' && (
          <ConsoleConfigPage key={'brokerconfig.console'} brokerId={0} />
        )}
      </BrokerComponentConfig>
    );
  }
  return (
    <Text>
      This is the broker configuration page. Select one item on the left
    </Text>
  );
};

export type AcceptorDropDownProps = {
  compKey: string;
  compType: string;
  brokerId: number;
  configName: string;
  onDelete: (event: MouseEvent) => void;
};

export const AcceptorDropDown: FC<AcceptorDropDownProps> = ({
  compKey,
  compType,
  brokerId,
  configName,
  onDelete,
}) => {
  const { setYamlData } = useContext(BrokerConfigContext);

  const [isAcceptorOpen, setIsAcceptorOpen] = useState(false);

  const onToggleAcceptor = (isOpen: boolean) => {
    setIsAcceptorOpen(isOpen);
  };

  const onDeleteAcceptorSelect = () => {
    setIsAcceptorOpen(!isAcceptorOpen);
  };

  const deleteAcceptor = (brokerModel: K8sResourceCommon) => {
    const prefix =
      compType === 'connector'
        ? 'connectorConfigurations.'
        : 'acceptorConfigurations.';
    if (brokerModel.spec?.brokerProperties?.length > 0) {
      const configKey = prefix + configName + '.';
      brokerModel.spec.brokerProperties =
        brokerModel.spec.brokerProperties.filter((x: string) => {
          return !x.startsWith(configKey);
        });
      if (compType === 'connector') {
        if (brokerModel.spec?.connectors?.length > 0) {
          brokerModel.spec.connectors = brokerModel.spec.connectors.filter(
            (x: { name: string }) => {
              return x.name !== configName;
            },
          );
        }
      } else {
        if (brokerModel.spec?.acceptors?.length > 0) {
          brokerModel.spec.acceptors = brokerModel.spec.acceptors.filter(
            (x: { name: string }) => {
              return x.name !== configName;
            },
          );
        }
      }
    }
  };

  const onDeleteAcceptor = (event: MouseEvent) => {
    setYamlData(deleteAcceptor);
    onDelete(event);
  };

  const acceptorActionItems = () => {
    return [
      <DropdownItem key={compKey + 'ActionItems0'} onClick={onDeleteAcceptor}>
        Delete
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
      dropdownItems={acceptorActionItems()}
    />
  );
};

export type NamingPanelProps = {
  initName: string;
  uniqueSet?: Set<string>;
  applyNewName: (newName: string) => void;
};

export const NamingPanel: FC<NamingPanelProps> = ({
  initName,
  uniqueSet,
  applyNewName,
}) => {
  const [newName, setNewName] = useState(initName);
  const [toolTip, setTooltip] = useState('');
  const [validateStatus, setValidateStatus] = useState(null);

  const handleNewName = () => {
    applyNewName(newName);
  };

  const validateName = (value: string) => {
    setNewName(value);
    if (value === '') {
      setValidateStatus(ValidatedOptions.error);
      setTooltip("Name shouldn't be empty");
    } else if (uniqueSet?.has(value)) {
      setValidateStatus(ValidatedOptions.error);
      setTooltip('Name already exists');
    } else {
      setValidateStatus(ValidatedOptions.success);
      setTooltip('Name available');
    }
  };

  return (
    <>
      <Tooltip content={<div>{toolTip}</div>}>
        <TextInput
          value={newName}
          onChange={validateName}
          isRequired
          validated={validateStatus}
          type="text"
          aria-label="name input panel"
        />
      </Tooltip>
      <Button
        variant="plain"
        isDisabled={validateStatus !== ValidatedOptions.success}
        onClick={handleNewName}
      >
        ok
      </Button>
    </>
  );
};
