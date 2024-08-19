import { FC } from 'react';
import {
  Alert,
  PageSection,
  PageSectionVariants,
  Title,
} from '@patternfly/react-core';
import { useTranslation } from '../../i18n/i18n';
import { AddressDetails } from './AddressDetails.component';
import { AddressDetailsBreadcrumb } from './AddressDetailsBreadcrumb/AddressDetailsBreadcrumb';

import { useParams } from 'react-router-dom-v5-compat';
import { JolokiaAuthentication } from '../../jolokia/components/JolokiaAuthentication';
import { useGetBrokerCR } from '../../k8s/customHooks';

export const AddressDetailsPage: FC = () => {
  const { t } = useTranslation();
  const {
    name,
    ns: namespace,
    brokerName,
    podName,
  } = useParams<{
    name?: string;
    ns?: string;
    brokerName?: string;
    podName?: string;
  }>();

  const { brokerCr: brokerDetails, error: error } = useGetBrokerCR(
    brokerName,
    namespace,
  );

  const podOrdinal = parseInt(podName.replace(brokerName + '-ss-', ''));

  return (
    <JolokiaAuthentication brokerCR={brokerDetails} podOrdinal={podOrdinal}>
      <PageSection
        variant={PageSectionVariants.light}
        padding={{ default: 'noPadding' }}
        className="pf-c-page__main-tabs"
      >
        <div className="pf-u-mt-md pf-u-ml-md pf-u-mb-md">
          <AddressDetailsBreadcrumb
            name={name}
            namespace={namespace}
            brokerName={brokerName}
            podName={podName}
          />
          <Title headingLevel="h2">
            {t('address')} {name}
          </Title>
        </div>
        {error && <Alert variant="danger" title={error} />}
        <AddressDetails name={name} />
      </PageSection>
    </JolokiaAuthentication>
  );
};

export const App: FC = () => {
  return <AddressDetailsPage />;
};
