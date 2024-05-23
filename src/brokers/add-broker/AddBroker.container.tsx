import { FC, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom-v5-compat';
import { k8sCreate } from '@openshift-console/dynamic-plugin-sdk';
import { AlertVariant } from '@patternfly/react-core';
import { AddBroker } from './AddBroker.component';
import { AMQBrokerModel, K8sResourceCommon } from '../../utils';
import { addBrokerInitialValues, AddBrokerFormYamlValues } from '../utils';

const AddBrokerPage: FC = () => {
  const navigate = useNavigate();
  const { ns: namespace } = useParams<{ ns?: string }>();

  const defaultNotification = { title: '', variant: AlertVariant.info };
  const initialValues: AddBrokerFormYamlValues =
    addBrokerInitialValues(namespace);

  //states
  const [formValues, setFormValues] =
    useState<AddBrokerFormYamlValues>(initialValues);
  const [notification, setNotification] = useState(defaultNotification);

  const handleRedirect = () => {
    navigate('/k8s/all-namespaces/brokers');
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

export default AddBrokerPage;
