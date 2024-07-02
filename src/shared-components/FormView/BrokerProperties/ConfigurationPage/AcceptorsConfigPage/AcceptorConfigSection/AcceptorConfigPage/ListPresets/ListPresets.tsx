import {
  FormFieldGroupExpandable,
  FormFieldGroupHeader,
  FormGroup,
} from '@patternfly/react-core';
import { FC, useContext } from 'react';

import { useTranslation } from '../../../../../../../../i18n';
import { Acceptor } from '../../../../../../../../utils';
import {
  ArtemisReducerOperations,
  BrokerCreationFormDispatch,
  BrokerCreationFormState,
  getAcceptorFromCertManagerResourceTemplate,
  getCertManagerResourceTemplateFromAcceptor,
} from '../../../../../../../../reducers/7.12/reducer';
import { ResourceTemplate } from '../../../../../../../../utils';
import { SelectIssuerDrawer } from '../../SelectIssuerDrawer/SelectIssuerDrawer';
import { ConfirmDeleteModal } from '../../ConfirmDeleteModal/ConfirmDeleteModal';
type ResourceTemplateProps = {
  resourceTemplate: ResourceTemplate;
};

const CertManagerPreset: FC<ResourceTemplateProps> = ({ resourceTemplate }) => {
  const { cr } = useContext(BrokerCreationFormState);
  const { t } = useTranslation();
  const dispatch = useContext(BrokerCreationFormDispatch);
  const acceptor = getAcceptorFromCertManagerResourceTemplate(
    cr,
    resourceTemplate,
  );
  return (
    <FormFieldGroupExpandable
      isExpanded
      toggleAriaLabel="Details"
      header={
        <FormFieldGroupHeader
          titleText={{
            text: 'Cert-Manager issuer & Ingress exposure',
            id: 'nested-field-cert-manager-annotation-id' + acceptor.name,
          }}
          titleDescription="Configuration items for the preset"
          actions={
            <ConfirmDeleteModal
              subject="preset"
              action={() =>
                dispatch({
                  operation:
                    ArtemisReducerOperations.deletePEMGenerationForAcceptor,
                  payload: acceptor.name,
                })
              }
            />
          }
        />
      }
    >
      <FormGroup label={t('select_issuer')} isRequired>
        <SelectIssuerDrawer
          selectedIssuer={
            resourceTemplate.annotations['cert-manager.io/issuer']
          }
          setSelectedIssuer={(issuer: string) => {
            dispatch({
              operation: ArtemisReducerOperations.updateAnnotationIssuer,
              payload: {
                acceptorName: acceptor.name,
                newIssuer: issuer,
              },
            });
          }}
          clearIssuer={() => {
            dispatch({
              operation: ArtemisReducerOperations.updateAnnotationIssuer,
              payload: {
                acceptorName: acceptor.name,
                newIssuer: '',
              },
            });
          }}
        />
      </FormGroup>
    </FormFieldGroupExpandable>
  );
};

type ListPresetsProps = {
  acceptor: Acceptor;
};

export const ListPresets: FC<ListPresetsProps> = ({ acceptor }) => {
  const { cr } = useContext(BrokerCreationFormState);
  const certManagerRt = getCertManagerResourceTemplateFromAcceptor(
    cr,
    acceptor,
  );
  if (!certManagerRt) {
    return <></>;
  }
  return (
    <>
      {certManagerRt && <CertManagerPreset resourceTemplate={certManagerRt} />}
    </>
  );
};
