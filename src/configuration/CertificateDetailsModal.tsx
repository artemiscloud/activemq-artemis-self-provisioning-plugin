import {
  CodeBlock,
  CodeBlockCode,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Modal,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { pki, util } from 'node-forge';
import { FC } from 'react';

interface CertificateDetailsModalProps {
  isModalOpen: boolean;
  certs: pki.Certificate[];
  secretName: string;
  pem: string;
  onCloseModal: () => void;
}

const CertificateDetailsModal: FC<CertificateDetailsModalProps> = ({
  isModalOpen,
  certs,
  secretName,
  pem,
  onCloseModal,
}) => {
  const formatCertIssuer = (crt: pki.Certificate) => {
    let result = '';
    crt.issuer.attributes.forEach((attribute, i, all) => {
      if (attribute.shortName) {
        result += attribute.shortName;
        result += ' = ';
        result += attribute.value;
        if (i !== all.length - 1) {
          result += ', ';
        }
      }
    });
    return result;
  };

  const formatCertSubject = (crt: pki.Certificate) => {
    let result = '';
    crt.subject.attributes.forEach((attribute, i, all) => {
      if (attribute.shortName) {
        result += attribute.shortName;
        result += ' = ';
        result += attribute.value;
        if (i !== all.length - 1) {
          result += ', ';
        }
      }
    });
    return result;
  };

  interface ExtensionKeyProps {
    extension: any;
    extensionKey: string;
  }

  const ExtensionKey: FC<ExtensionKeyProps> = ({ extension, extensionKey }) => {
    //https://datatracker.ietf.org/doc/html/rfc5280
    const getExtPropContent = (ext: any, key: string) => {
      let result = '';
      if (typeof ext[key] === 'object') {
        result += JSON.stringify(ext[key]);
      } else {
        result += ext[key].toString();
      }
      return result;
    };
    if (extensionKey === 'name' || extensionKey === 'value') {
      return <></>;
    }
    return (
      <p style={{ textIndent: '25px' }}>
        <b>{extensionKey}: </b>
        <code>{getExtPropContent(extension, extensionKey)}</code>
      </p>
    );
  };
  interface ExtensionProps {
    extension: any;
    index: number;
  }

  const Extension: FC<ExtensionProps> = ({ extension: ext, index }) => {
    return (
      <>
        <DescriptionList>
          <DescriptionListGroup>
            <DescriptionListTerm>
              <b>
                {index + 1} - {ext.name}
              </b>
            </DescriptionListTerm>
          </DescriptionListGroup>
        </DescriptionList>
        {[
          Object.keys(ext).map((key) => (
            <ExtensionKey
              extension={ext}
              extensionKey={key}
              key={'extension' + ext.name + key}
            />
          )),
        ]}
      </>
    );
  };
  interface ExtensionsListProps {
    crt: pki.Certificate;
    order: number;
  }

  const ExtensionsList: FC<ExtensionsListProps> = ({ crt, order }) => {
    return (
      <>
        {crt.extensions.map((ext, index) => (
          <Extension
            extension={ext}
            index={index}
            key={'extenstions' + order}
          />
        ))}
      </>
    );
  };

  const formatArray = (obj: Array<any>, indent = ''): string => {
    let result = '';
    const width = 6;
    let wcnt = 0;
    result += indent;
    for (let i = 0; i < obj.length; i++) {
      result += obj[i] + ',';
      wcnt++;
      if (wcnt === width) {
        wcnt = 0;
        result += '\n' + indent;
      }
    }
    return result + '\n';
  };

  const formatObject = (obj: any, indent = ''): string => {
    let result = '';
    if (obj instanceof Array) {
      const output = formatArray(obj, indent);
      result += output;
    } else if (obj instanceof Object) {
      for (const [key, value] of Object.entries(obj)) {
        if (value instanceof Function) {
          continue;
        }
        result += indent + key + ':';
        if (value instanceof Object) {
          result += '\n' + formatObject(value, indent + '  ');
        } else {
          result += value + '\n';
        }
      }
    } else {
      result = indent + obj + '\n';
    }
    return result;
  };

  const formatPublicKey = (publicKey: pki.PublicKey) => {
    return formatObject(publicKey);
  };

  const formatSignature = (sig: any) => {
    const width = 16;
    const uint8Data = util.binary.raw.decode(sig);

    let wcnt = 0;
    let result = '';
    for (let i = 0; i < uint8Data.length; i++) {
      let hexv = uint8Data[i].toString(16);
      if (hexv.length === 1) {
        hexv = '0' + hexv;
      }
      result += hexv + ':';
      wcnt++;
      if (wcnt === width) {
        wcnt = 0;
        result += '\n';
      }
    }

    return result;
  };

  const formatCertInfo = (crt: pki.Certificate, order: number) => {
    return (
      <DescriptionList isHorizontal key={'dl-cert-info' + order}>
        <DescriptionListGroup key={'version' + order}>
          <DescriptionListTerm>
            <b>Version:</b>
          </DescriptionListTerm>
          <DescriptionListDescription>{crt.version}</DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup key={'serialNumber' + order}>
          <DescriptionListTerm>
            <b>SerialNumber:</b>
          </DescriptionListTerm>
          <DescriptionListDescription>
            <code>{crt.serialNumber}</code>
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup key={'issuer' + order}>
          <DescriptionListTerm>
            <b>Issuer:</b>
          </DescriptionListTerm>
          <DescriptionListDescription>
            <code>{formatCertIssuer(crt)}</code>
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup key={'issuerHash' + order}>
          <DescriptionListTerm>
            <b>IssuerHash:</b>
          </DescriptionListTerm>
          <DescriptionListDescription>
            <code>{crt.issuer.hash}</code>
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup key={'validity' + order}>
          <DescriptionListTerm>
            <b>Validity:</b>
          </DescriptionListTerm>
          <DescriptionListDescription>
            <b>NotBefore: </b>
            <code>{crt.validity.notBefore.toString()}</code>
            <p />
            <b>NotAfter: </b>
            <code>{crt.validity.notAfter.toString()}</code>
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup key={'subject' + order}>
          <DescriptionListTerm>
            <b>Subject:</b>
          </DescriptionListTerm>
          <DescriptionListDescription>
            <code>{formatCertSubject(crt)}</code>
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup key={'subjectHash' + order}>
          <DescriptionListTerm>
            <b>SubjectHash:</b>
          </DescriptionListTerm>
          <DescriptionListDescription>
            <code>{crt.subject.hash}</code>
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup key={'signatureOid' + order}>
          <DescriptionListTerm>
            <b>SignatureOid:</b>
          </DescriptionListTerm>
          <DescriptionListDescription>
            <code>{crt.signatureOid}</code>
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup key={'signatue' + order}>
          <DescriptionListTerm>
            <b>Signature:</b>
          </DescriptionListTerm>
          <DescriptionListDescription>
            <CodeBlock
              key={'key-codeblock-signature'}
              id={'id-codeblock-signature'}
              width={50}
            >
              <CodeBlockCode id="signature-code-content">
                {formatSignature(crt.signature)}
              </CodeBlockCode>
            </CodeBlock>
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup key={'siginfo' + order}>
          <DescriptionListTerm>
            <b>Signiture info:</b>
          </DescriptionListTerm>
          <DescriptionListDescription>
            <b>AlgorithmOid: </b>
            <code>{crt.siginfo.algorithmOid}</code>
            <p />
            <b>Parameters: </b>
            <code>{JSON.stringify(crt.siginfo.parameters)}</code>
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup key={'extensions' + order}>
          <DescriptionListTerm>
            <b>Extensions({crt.extensions?.length})</b>:
          </DescriptionListTerm>
          <DescriptionListDescription>
            <ExtensionsList crt={crt} order={order}></ExtensionsList>
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup key={'publickey' + order}>
          <DescriptionListTerm>
            <b>{'PublicKey Info:'}</b>
          </DescriptionListTerm>
          <DescriptionListDescription>
            <CodeBlock
              key={'key-codeblock-publickey'}
              id={'id-codeblock-publickey'}
              width={50}
            >
              <CodeBlockCode id="publickey-code-content">
                {formatPublicKey(crt.publicKey)}
              </CodeBlockCode>
            </CodeBlock>
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    );
  };

  const CertDetails: FC = () => {
    return (
      <>
        {certs.length > 0 &&
          certs.map((cert, index) => (
            <StackItem key={index}>{formatCertInfo(cert, index)}</StackItem>
          ))}
      </>
    );
  };

  return (
    <Modal
      width="50%"
      title={'Certification Details'}
      description={'from secret ' + secretName}
      isOpen={isModalOpen}
      onClose={onCloseModal}
    >
      <Stack hasGutter key={'stack-cert-details'}>
        <CertDetails />
      </Stack>
      <Stack hasGutter key={'stack-pem'}>
        <StackItem>
          <DescriptionList isHorizontal key={'dl-pem'}>
            <DescriptionListGroup key={'dl-group-pem-key'}>
              <DescriptionListTerm>
                <b>{'PEM:'}</b>
              </DescriptionListTerm>
              <DescriptionListDescription>
                <CodeBlock
                  key={'key-codeblock-pem'}
                  id={'id-codeblock-pem'}
                  width={50}
                >
                  <CodeBlockCode id="pem-code-content">{pem}</CodeBlockCode>
                </CodeBlock>
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </StackItem>
      </Stack>
    </Modal>
  );
};

export { CertificateDetailsModal };
