import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import {
  Bullseye,
  Card,
  CardBody,
  CardTitle,
  ClipboardCopyButton,
  CodeBlock,
  CodeBlockAction,
  CodeBlockCode,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  List,
  ListItem,
  Page,
  PageSection,
  Spinner,
  Title,
} from '@patternfly/react-core';
import { FC, useState } from 'react';
import {
  getIssuerForAcceptor,
  getIssuerIngressHostForAcceptor,
} from '../../../../reducers/7.12/reducer';
import { Metrics } from '../../../../metrics';
import { Loading } from '../../../../shared-components';
import {
  Acceptor,
  IssuerResource,
  BrokerCR,
  SecretResource,
} from '../../../../utils';

const useGetIssuerCa = (
  cr: BrokerCR,
  acceptor: Acceptor,
): [string, boolean, string] => {
  const acceptorIssuer = getIssuerForAcceptor(cr, acceptor);
  const [issuer, loadedIssuers, loadErrorIssuers] =
    useK8sWatchResource<IssuerResource>({
      groupVersionKind: {
        group: 'cert-manager.io',
        version: 'v1',
        kind: 'Issuer',
      },
      namespace: cr.metadata.namespace,
      name: acceptorIssuer,
    });
  if (!loadedIssuers || loadErrorIssuers) {
    return ['', loadedIssuers, loadErrorIssuers];
  }
  const secret = issuer.spec?.ca?.secretName ? issuer.spec.ca.secretName : '';
  return [secret, loadedIssuers, loadErrorIssuers];
};

const useGetTlsSecret = (cr: BrokerCR, acceptor: Acceptor) => {
  const [secretName, hasSecretName] = useGetIssuerCa(cr, acceptor);
  const [secret] = useK8sWatchResource<SecretResource>({
    groupVersionKind: {
      version: 'v1',
      kind: 'Secret',
    },
    name: secretName,
    namespace: cr.metadata.namespace,
  });

  if (hasSecretName && !secretName) {
    return undefined;
  }
  if (!(secret && secret.data && secret.data['tls.crt'])) {
    return undefined;
  }
  return secret;
};

type SecretDownloaLinkProps = {
  secret: SecretResource;
};

const SecretDownloadLink: FC<SecretDownloaLinkProps> = ({ secret }) => {
  return (
    <a
      href={
        'data:application/pem-certificate-chain;base64,' +
        secret.data['tls.crt']
      }
      download={secret.metadata.name + '.pem'}
    >
      {secret.metadata.name + '.pem'}
    </a>
  );
};

type IssuerSecretsDownloaderProps = {
  cr: BrokerCR;
};

type HelperConnectAcceptorProps = {
  cr: BrokerCR;
  acceptor: Acceptor;
};

const HelpConnectAcceptor: FC<HelperConnectAcceptorProps> = ({
  cr,
  acceptor,
}) => {
  const secret = useGetTlsSecret(cr, acceptor);
  const ingressHost = getIssuerIngressHostForAcceptor(cr, acceptor);
  const [copied, setCopied] = useState(false);

  const clipboardCopyFunc = (text: string) => {
    navigator.clipboard.writeText(text.toString());
  };

  const onClick = (_event: any, text: string) => {
    clipboardCopyFunc(text);
    setCopied(true);
  };
  if (!secret) {
    return (
      <Bullseye>
        <Spinner size="lg" />
      </Bullseye>
    );
  }

  const code =
    "./artemis check queue --name TEST --produce 10 --browse 10 --consume 10 --url 'tcp://" +
    ingressHost +
    ':443?sslEnabled=true&trustStorePath=/tmp/' +
    secret.metadata.name +
    ".pem&trustStoreType=PEM&useTopologyForLoadBalancing=false' --verbose";
  return (
    <DescriptionListGroup>
      <DescriptionListTerm>
        Test the connection to {acceptor.name}
      </DescriptionListTerm>
      <DescriptionListDescription>
        <List>
          <ListItem>
            Download the secret: <SecretDownloadLink secret={secret} />
          </ListItem>
          <ListItem>
            Run the command with the secret (here in /tmp)
            <CodeBlock
              actions={
                <CodeBlockAction>
                  <ClipboardCopyButton
                    id="basic-copy-button"
                    textId="code-content"
                    aria-label="Copy to clipboard"
                    onClick={(e) => onClick(e, code)}
                    exitDelay={copied ? 1500 : 600}
                    maxWidth="110px"
                    variant="plain"
                    onTooltipHidden={() => setCopied(false)}
                  >
                    {copied
                      ? 'Successfully copied to clipboard!'
                      : 'Copy to clipboard'}
                  </ClipboardCopyButton>
                </CodeBlockAction>
              }
            >
              <CodeBlockCode>{code}</CodeBlockCode>
            </CodeBlock>
          </ListItem>
        </List>
      </DescriptionListDescription>
    </DescriptionListGroup>
  );
};

const ConnectivityHelper: FC<IssuerSecretsDownloaderProps> = ({ cr }) => {
  const oneAcceptorHasGeneratedSecrets = cr.spec?.acceptors
    ? cr.spec.acceptors
        .map((acceptor) =>
          acceptor.sslSecret ? acceptor.sslSecret.endsWith('-ptls') : false,
        )
        .reduce((acc, hasGeneratedSecrets) => acc || hasGeneratedSecrets)
    : false;
  if (!oneAcceptorHasGeneratedSecrets) {
    return <></>;
  }
  return (
    <>
      <PageSection
        hasOverflowScroll={true}
        aria-label="secrets"
        padding={{ default: 'noPadding' }}
        className={
          'pf-u-px-lg-on-xl pf-u-pt-sm-on-xl pf-u-pb-lg-on-xl pf-u-px-md pf-u-pb-md'
        }
      >
        <Title headingLevel="h2">Connectivity</Title>
        <Card>
          <>
            <CardTitle>Connect using Artemis</CardTitle>
            <CardBody>
              <DescriptionList>
                <DescriptionListGroup>
                  <DescriptionListTerm>Get Artemis</DescriptionListTerm>
                  <DescriptionListDescription>
                    Download the{' '}
                    <a href="https://activemq.apache.org/components/artemis/download/">
                      latest release
                    </a>{' '}
                    of ActiveMQ Artemis, decompress the tarball and locate the
                    artemis executable.
                  </DescriptionListDescription>
                </DescriptionListGroup>
                {cr.spec.acceptors.map((acceptor) => (
                  <HelpConnectAcceptor
                    cr={cr}
                    acceptor={acceptor}
                    key={acceptor.name}
                  />
                ))}
              </DescriptionList>
            </CardBody>
          </>
        </Card>
      </PageSection>
    </>
  );
};

export type OverviewContainerProps = {
  namespace: string;
  name: string;
  cr: BrokerCR;
  loading: boolean;
};

export const OverviewContainer: FC<OverviewContainerProps> = ({
  namespace,
  name,
  cr,
  loading,
}) => {
  if (loading) return <Loading />;

  return (
    <Page>
      <Metrics
        name={name}
        namespace={namespace}
        size={cr.spec?.deploymentPlan?.size}
      />
      <ConnectivityHelper cr={cr} />
    </Page>
  );
};
