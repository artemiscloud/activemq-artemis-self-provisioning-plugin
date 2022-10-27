import { FC, useState } from 'react';
import { useHistory, RouteComponentProps } from 'react-router-dom';
import {
  k8sCreate,
  K8sResourceCommon,
} from '@openshift-console/dynamic-plugin-sdk';
import { Alert, AlertGroup, Page, PageSection } from '@patternfly/react-core';
import { AMQBrokerModel } from '../../utils';
import { EditorPage } from './add-broker-form.component';

type AddBrokerProps = RouteComponentProps<{ ns?: string }>;

const AddBroker: FC<AddBrokerProps> = ({ match }) => {
  const namespace = match.params.ns || 'default';
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleRedirect = () => {
    history.push(`brokers`);
  };

  const k8sCreateBroker = (content: K8sResourceCommon) => {
    k8sCreate({ model: AMQBrokerModel, data: content })
      .then(() => {
        setErrorMessage('');
        handleRedirect();
      })
      .catch((e) => {
        setErrorMessage(e.message);
        console.error(e);
      });
  };

  return (
    <Page>
      <PageSection>
        {errorMessage && (
          <AlertGroup>
            <Alert
              data-test="add-broker-error-alert"
              title={errorMessage}
              variant="warning"
              isInline
            />
          </AlertGroup>
        )}
        <EditorPage onCreateBroker={k8sCreateBroker} namespace={namespace} />
      </PageSection>
    </Page>
  );
};

export default AddBroker;
