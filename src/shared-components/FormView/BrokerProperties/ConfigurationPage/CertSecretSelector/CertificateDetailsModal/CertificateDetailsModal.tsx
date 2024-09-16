import {
  CodeBlockCode,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Modal,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { useTranslation } from '@app/i18n/i18n';
import x509, { TextConverter, TextObject } from '@peculiar/x509';
import { FC, useEffect, useState } from 'react';
import { AsnConvert } from '@peculiar/asn1-schema';
import {
  Certificate,
  Version,
  TBSCertificate,
  AlgorithmIdentifier,
} from '@peculiar/asn1-x509';

const getCertVersion = (tbsCert: TBSCertificate) => {
  return `${Version[tbsCert.version]} (${tbsCert.version})`;
};

const getPublicInfo = (publicKey: x509.PublicKey) => {
  const textObj = publicKey.toTextObject();
  return TextConverter.serialize(textObj);
};

const getSignatureValue = (asnCert: Certificate) => {
  return asnCert.signatureValue;
};

interface ExtensionsListProps {
  crt: x509.X509Certificate;
  order: number;
}

//https://datatracker.ietf.org/doc/html/rfc5280
interface ExtensionProps {
  extension: x509.Extension;
  index: number;
}

const Extension: FC<ExtensionProps> = ({ extension, index }) => {
  const obj = extension.toTextObject();
  let extTitle = extension.type;
  if (obj[TextObject.NAME]) {
    extTitle = obj[TextObject.NAME];
  }

  const getExtensionContent = () => {
    const textObj = extension.toTextObject();
    return TextConverter.serialize(textObj);
  };

  return (
    <DescriptionListGroup>
      <DescriptionListTerm>
        <b>
          {index + 1} - {extTitle}
        </b>
      </DescriptionListTerm>
      <DescriptionListDescription>
        <CodeBlockCode id="hash-code-content">
          {getExtensionContent()}
        </CodeBlockCode>
      </DescriptionListDescription>
    </DescriptionListGroup>
  );
};

const ExtensionsList: FC<ExtensionsListProps> = ({ crt, order }) => {
  return (
    <>
      {crt.extensions.map((ext, index) => (
        <Extension extension={ext} index={index} key={'extenstions' + order} />
      ))}
    </>
  );
};

export const formatArrayBuffer = (sig: ArrayBuffer) => {
  const width = 16;

  let wcnt = 0;
  let result = '';
  const uint8Array = new Uint8Array(sig);
  for (let i = 0; i < uint8Array.length; i++) {
    const hexv = uint8Array[i].toString(16);
    result += hexv.padStart(2, '0') + ':';
    wcnt++;
    if (wcnt === width) {
      wcnt = 0;
      result += '\n';
    }
  }

  return result;
};

const formatSignatureAlgorighm = (signature: AlgorithmIdentifier) => {
  const txtObject = TextConverter.serializeAlgorithm(signature);
  return TextConverter.serialize(txtObject);
};

interface CertInfoProps {
  cert: x509.X509Certificate;
  order: number;
}
const CertInfo: FC<CertInfoProps> = ({ cert, order }) => {
  const asnCert = AsnConvert.parse(cert.rawData, Certificate);
  const tbsCert = asnCert.tbsCertificate;

  const [selfSigned, setSelfSigned] = useState('false');
  const { t } = useTranslation();

  useEffect(() => {
    cert
      .isSelfSigned()
      .then((value) => {
        setSelfSigned(value ? 'true' : 'false');
      })
      .catch(() => {
        setSelfSigned('unknown');
      });
  }, [cert]);

  return (
    <>
      <DescriptionList isHorizontal key={'dl-cert-info' + order}>
        <DescriptionListGroup key={'version' + order}>
          <DescriptionListTerm>
            <b>{t('Version:')}</b>
          </DescriptionListTerm>
          <DescriptionListDescription>
            {getCertVersion(tbsCert)}
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup key={'selfSigned' + order}>
          <DescriptionListTerm>
            <b>{t('Self Signed:')}</b>
          </DescriptionListTerm>
          <DescriptionListDescription>{selfSigned}</DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup key={'serialNumber' + order}>
          <DescriptionListTerm>
            <b>{t('SerialNumber:')}</b>
          </DescriptionListTerm>
          <DescriptionListDescription>
            <code>{tbsCert.serialNumber}</code>
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup key={'sigAlgorithm' + order}>
          <DescriptionListTerm>
            <b>{t('Signature Algorithm:')}</b>
          </DescriptionListTerm>
          <DescriptionListDescription>
            <code>{formatSignatureAlgorighm(tbsCert.signature)}</code>
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup key={'siginfo' + order}>
          <DescriptionListTerm>
            <b>{t('Signature Hash:')}</b>
          </DescriptionListTerm>
          <DescriptionListDescription>
            <CodeBlockCode id="hash-code-content">
              {formatArrayBuffer(getSignatureValue(asnCert))}
            </CodeBlockCode>
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup key={'validity' + order}>
          <DescriptionListTerm>
            <b>{t('Validity:')}</b>
          </DescriptionListTerm>
          <DescriptionListDescription>
            <b>{t('NotBefore:')} </b>
            <code>{tbsCert.validity.notBefore.getTime().toUTCString()}</code>
            <p />
            <b>{t('NotAfter:')} </b>
            <code>{tbsCert.validity.notAfter.getTime().toUTCString()}</code>
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup key={'issuer' + order}>
          <DescriptionListTerm>
            <b>{t('Issuer:')}</b>
          </DescriptionListTerm>
          <DescriptionListDescription>
            <code>{cert.issuer}</code>
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup key={'subject' + order}>
          <DescriptionListTerm>
            <b>{t('Subject:')}</b>
          </DescriptionListTerm>
          <DescriptionListDescription>
            <code>{cert.subject}</code>
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup key={'publickey' + order}>
          <DescriptionListTerm>
            <b>{t('Publickey Info:')}</b>
          </DescriptionListTerm>
          <DescriptionListDescription>
            <CodeBlockCode id="keydata-code-content">
              {getPublicInfo(cert.publicKey)}
            </CodeBlockCode>
          </DescriptionListDescription>
        </DescriptionListGroup>

        {tbsCert.issuerUniqueID && (
          <DescriptionListGroup key={'issuerId' + order}>
            <DescriptionListTerm>
              <b>{t('Issuer unique ID:')}</b>
            </DescriptionListTerm>
            <DescriptionListDescription>
              <code>{tbsCert.issuerUniqueID}</code>
            </DescriptionListDescription>
          </DescriptionListGroup>
        )}
        {tbsCert.subjectUniqueID && (
          <DescriptionListGroup key={'subjectId' + order}>
            <DescriptionListTerm>
              <b>{t('Subject unique ID:')}</b>
            </DescriptionListTerm>
            <DescriptionListDescription>
              <code>{tbsCert.subjectUniqueID}</code>
            </DescriptionListDescription>
          </DescriptionListGroup>
        )}

        <DescriptionListGroup key={'extensions' + order}>
          <DescriptionListTerm>
            <b>
              {t('Extensions')}({cert.extensions?.length})
            </b>
            :
          </DescriptionListTerm>
          <DescriptionListDescription>
            <ExtensionsList crt={cert} order={order}></ExtensionsList>
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </>
  );
};

interface CertificateDetailsModalProps {
  isModalOpen: boolean;
  certs: x509.X509Certificate[];
  secretName: string;
  pem: string;
  onCloseModal: () => void;
}

export const CertificateDetailsModal: FC<CertificateDetailsModalProps> = ({
  isModalOpen,
  certs,
  secretName,
  pem,
  onCloseModal,
}) => {
  const { t } = useTranslation();
  const CertDetails: FC = () => {
    return (
      <>
        {certs.length > 0 &&
          certs.map((cert, index) => (
            <StackItem key={index}>
              <CertInfo cert={cert} order={index} />
            </StackItem>
          ))}
      </>
    );
  };

  return (
    <Modal
      width="50%"
      title={t('Certification Details')}
      description={t('from secret') + secretName}
      isOpen={isModalOpen}
      onClose={onCloseModal}
    >
      <Stack hasGutter key={'stack-cert-details'}>
        <CertDetails />
        <StackItem>
          <DescriptionList isHorizontal key={'dl-pem'}>
            <DescriptionListGroup key={'dl-group-pem-key'}>
              <DescriptionListTerm>
                <b>{t('PEM:')}</b>
              </DescriptionListTerm>
              <DescriptionListDescription>
                <CodeBlockCode id="pem-code-content">{pem}</CodeBlockCode>
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </StackItem>
      </Stack>
    </Modal>
  );
};
