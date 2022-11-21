import { FC, useState } from 'react';
import { useHistory, RouteComponentProps } from 'react-router-dom';
import { k8sCreate } from '@openshift-console/dynamic-plugin-sdk';
import { AlertVariant } from '@patternfly/react-core';
import { AddBroker } from './add-broker.component';
import { AMQBrokerModel, K8sResourceCommon } from '../../utils';

type AddBrokerContainerProps = RouteComponentProps<{ ns?: string }>;

const AddBrokerContainer: FC<AddBrokerContainerProps> = ({ match }) => {
  const history = useHistory();
  const namespace = match.params.ns || 'default';
  const defaultNotification = { title: '', variant: AlertVariant.default };

  const initialResourceYAML: K8sResourceCommon = {
    apiVersion: 'broker.amq.io/v1beta1',
    kind: 'ActiveMQArtemis',
    metadata: {
      name: 'default',
      namespace,
    },
    spec: {
      deploymentPlan: {
        image: 'placeholder',
        requireLogin: false,
        size: 1,
      },
    },
  };

  //states
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
      initialResourceYAML={initialResourceYAML}
    />
  );
};

export default AddBrokerContainer;
