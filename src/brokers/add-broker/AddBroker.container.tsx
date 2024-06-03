import { FC, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { k8sCreate } from '@openshift-console/dynamic-plugin-sdk';
import { AlertVariant } from '@patternfly/react-core';
import { AddBroker } from './AddBroker.component';
import { AMQBrokerModel, K8sResourceCommon } from '../../utils';
import {
  AddBrokerResourceValues,
  BrokerConfigContext,
  addBrokerInitialValues,
} from '../utils';

const AddBrokerPage: FC = () => {
  const history = useHistory();
  const { ns: namespace } = useParams<{ ns?: string }>();

  const defaultNotification = { title: '', variant: AlertVariant.default };
  const initialValues = addBrokerInitialValues(namespace);

  //states
  const [formValues, setFormValues] =
    useState<AddBrokerResourceValues>(initialValues);
  const [notification, setNotification] = useState(defaultNotification);

  const handleRedirect = () => {
    history.push('/k8s/all-namespaces/brokers');
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

  const updateNamespace = (brokerModel: K8sResourceCommon) => {
    brokerModel.metadata.namespace = namespace;
  };

  useEffect(() => {
    formValues.setYamlData(updateNamespace);
  }, [namespace]);

  return (
    <BrokerConfigContext.Provider value={formValues}>
      <AddBroker
        namespace={namespace}
        notification={notification}
        onCreateBroker={k8sCreateBroker}
        onChangeValue={setFormValues}
      />
    </BrokerConfigContext.Provider>
  );
};

export default AddBrokerPage;
