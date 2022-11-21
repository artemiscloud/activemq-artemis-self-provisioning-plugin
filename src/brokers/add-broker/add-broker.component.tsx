import { FC } from 'react';
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import {
  Alert,
  AlertVariant,
  AlertGroup,
  Page,
  PageSection,
} from '@patternfly/react-core';
import { AddBrokerForm } from './components';
import { K8sResourceCommon as K8sResourceCommonWithSpec } from '../../utils';

type AddBrokerProps = {
  onCreateBroker: (data: K8sResourceCommon) => void;
  namespace: string;
  initialResourceYAML: K8sResourceCommonWithSpec;
  notification: {
    title: string;
    variant: AlertVariant;
  };
};

const AddBroker: FC<AddBrokerProps> = ({
  onCreateBroker,
  notification,
  namespace,
  initialResourceYAML,
}) => {
  return (
    <Page>
      <PageSection>
        {notification.title && (
          <AlertGroup>
            <Alert
              data-test="add-broker-notification"
              title={notification.title}
              variant={notification.variant}
              isInline
              actionClose
            />
          </AlertGroup>
        )}
        <AddBrokerForm
          onCreateBroker={onCreateBroker}
          namespace={namespace}
          initialResourceYAML={initialResourceYAML}
        />
      </PageSection>
    </Page>
  );
};

export { AddBroker };
