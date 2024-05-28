import { FC, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { k8sCreate } from '@openshift-console/dynamic-plugin-sdk';
import { AlertVariant } from '@patternfly/react-core';
import { AMQBrokerModel, K8sResourceCommon as ArtemisCR } from '../../utils';
import AddTlsBroker from './AddTlsBroker.component';

const AddTlsBrokerPage: FC = () => {
  const history = useHistory();
  const { ns: namespace } = useParams<{ ns?: string }>();

  const defaultNotification = { title: '', variant: AlertVariant.default };

  const [notification, setNotification] = useState(defaultNotification);

  const handleRedirect = () => {
    history.push('/k8s/all-namespaces/brokers');
  };

  const k8sCreateBroker = (content: ArtemisCR) => {
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
    <AddTlsBroker
      namespace={namespace}
      notification={notification}
      createBroker={k8sCreateBroker}
    />
  );
};

export default AddTlsBrokerPage;
