import {
  CertIssuerModel,
  CertModel,
  K8sResourceCommon,
  K8sResourceKind,
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
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  k8sCreate,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { ConsoleConfigPage } from './console-config';
import {
  ArtemisReducerActions,
  BrokerConfigContext,
  BrokerDispatchContext,
  getAcceptorSecret,
} from '../brokers/utils';
import { AcceptorsConfigPage } from './acceptors-config';
import { SelectOptionObject } from '@patternfly/react-core/dist/js';

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
  const { yamlData } = useContext(BrokerConfigContext);
  const dispatch = useContext(BrokerDispatchContext);

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

  const selectedSecret = getAcceptorSecret(
    yamlData,
    configType,
    configName,
    isCa,
  );

  const [isOpen, setIsOpen] = useState(false);

  const onToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const clearSelection = () => {
    //TODO delete secret
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
      dispatch({
        operation: ArtemisReducerActions.updatingAcceptorSecret,
        payload: {
          configType: configType,
          secret: value,
          acceptorName: configName,
          isCa: isCa,
        },
      });
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
    console.log(
      '+++++++++++++++ parsing secrets',
      secrets.length,
      'isCa',
      isCa,
    );
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
  const [certGenInfo, setCertGenInfo] = useState<string[]>([]);
  const drawerRef = useRef<HTMLDivElement>(null);

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

  console.log('creating panelconetnt');
  const panelContent = (
    <DrawerPanelContent>
      <DrawerHead>
        <span tabIndex={isDrawerExpanded ? 0 : -1} ref={drawerRef}>
          {certGenInfo}
        </span>
        <DrawerActions>
          <DrawerCloseButton onClick={onCloseDrawer} />
        </DrawerActions>
      </DrawerHead>
    </DrawerPanelContent>
  );

  const failedSecretGen = (messages: string[]) => {
    setCertGenInfo(messages);
    setIsDrawerExpanded(true);
    setIsSecretGenerating(false);
    setCertGenMessage('Generate');
  };

  const succeededSecretGen = () => {
    setCertGenInfo(['cert generated']);
    setIsDrawerExpanded(true);
    setIsSecretGenerating(false);
    setCertGenMessage('Generate');
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

    return await k8sCreate({ model: CertModel, data: content });
  };

  const onCreateTestCert = () => {
    setCertGenMessage('Checking cert-manager');
    setCertGenInfo(['cert pods: ', certManagerDeployments.length.toString()]);

    if (certManagerDeployments.length === 0) {
      failedSecretGen([
        'No cert-manager found\n',
        'please install cert-manager.',
      ]);
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
      failedSecretGen([
        'No cert-manager found\n',
        'please install cert-manager.',
      ]);
      return;
    }
    setIsSecretGenerating(true);
    setCertGenMessage('Creating issuer');

    createSelfSigningIssuer('issuer-amq-spp-test')
      .then((result) => {
        //Create self-signed cert
        console.log(result);
        setCertGenMessage('Creating cert');
        createSelfSignedCert('cert-amq-spp-test')
          .then((result) => {
            console.log(result);
            succeededSecretGen();
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

  console.log('**** return group dumping statuse****');

  console.log('secrets', secrets + 'loaded', loaded, 'loaderr', loadError);
  console.log('isopen', isOpen);
  console.log('cert secrets', certManagerSecrets);
  console.log('legacy', legacySecrets);
  console.log('isgen', isSecretGenerating);
  console.log('certGenMessage', certGenMessage);
  console.log('isDrawerExpanded', isDrawerExpanded);
  console.log('certGenInfo', certGenInfo);
  console.log('selected', selectedSecret.toString());
  console.log('drawerRef', drawerRef);
  const secretOptions = useCreateSecretOptions({
    certManagerSecrets,
    legacySecrets,
    configType,
    configName,
    isCa,
  });

  console.log('groups', secretOptions);
  console.log('groups', secretOptions);
  console.log('done');
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

export const ConfigTypeContext = createContext<ConfigType>(
  ConfigType.acceptors,
);

export const GetConfigurationPage: FC<BrokerConfigProps> = ({
  target,
  isPerBrokerConfig,
}) => {
  if (isPerBrokerConfig) {
    return <Text>Per Broker Config is disabled for now.</Text>;
  }

  const configType: ConfigType = target;

  if (target) {
    return (
      <ConfigTypeContext.Provider value={configType}>
        <BrokerComponentConfig key={'brokerconfig' + target} category={target}>
          {target === 'console' ? (
            <ConsoleConfigPage brokerId={0} />
          ) : (
            <AcceptorsConfigPage brokerId={0} />
          )}
        </BrokerComponentConfig>
      </ConfigTypeContext.Provider>
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
  const dispatch = useContext(BrokerDispatchContext);

  const onToggleAcceptor = (isOpen: boolean) => {
    setIsAcceptorOpen(isOpen);
  };

  const onDeleteAcceptorSelect = () => {
    setIsAcceptorOpen(!isAcceptorOpen);
  };

  const onDeleteAcceptor = (_event: MouseEvent) => {
    dispatch({
      operation: ArtemisReducerActions.deleteAcceptor,
      payload: {
        configType: compType,
        acceptorName: configName,
      },
    });
    onDelete();
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
};

export const NamingPanel: FC<NamingPanelProps> = ({ initName, uniqueSet }) => {
  const configType = useContext(ConfigTypeContext);
  const dispatch = useContext(BrokerDispatchContext);
  const [newName, setNewName] = useState(initName);
  const [toolTip, setTooltip] = useState('');
  const [validateStatus, setValidateStatus] = useState(null);

  const handleNewName = () => {
    dispatch({
      operation: ArtemisReducerActions.updatingAcceptorName,
      payload: {
        acceptorName: initName,
        newName: newName,
        configType: configType,
      },
    });
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
