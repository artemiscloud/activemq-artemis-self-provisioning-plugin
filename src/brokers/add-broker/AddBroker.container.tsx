import { FC, useState } from 'react';
import { useHistory, RouteComponentProps, withRouter } from 'react-router-dom';
import { k8sCreate } from '@openshift-console/dynamic-plugin-sdk';
import { AlertVariant } from '@patternfly/react-core';
import { AddBroker } from './AddBroker.component';
import { AMQBrokerModel, K8sResourceCommon } from '../../utils';
import { addBrokerInitialValues, AddBrokerFormYamlValues } from '../utils';

type AddBrokerPageProps = RouteComponentProps<{ ns?: string }>;

const AddBrokerPage: FC<AddBrokerPageProps> = ({ match }) => {
  const history = useHistory();
  const namespace = match.params.ns || 'default';
  const defaultNotification = { title: '', variant: AlertVariant.default };
  const initialValues: AddBrokerFormYamlValues =
    addBrokerInitialValues(namespace);

  //states
  const [formValues, setFormValues] =
    useState<AddBrokerFormYamlValues>(initialValues);
  const [notification, setNotification] = useState(defaultNotification);

  const handleRedirect = () => {
    history.push(`brokers`);
  };

  const k8sCreateBroker = (content: K8sResourceCommon) => {
    k8sCreate({ model: AMQBrokerModel, data: content })
      .then(() => {
        setNotification(defaultNotification);
        handleRedirect();
      })
      .catch((e) => {
        setNotification({ title: e.message, variant: AlertVariant.danger });
        console.error(e);
      });
  };

  return (
    <AddBroker
      namespace={namespace}
      notification={notification}
      onCreateBroker={k8sCreateBroker}
      formValues={formValues}
      onChangeValue={setFormValues}
    />
  );
};

export default withRouter(AddBrokerPage);
