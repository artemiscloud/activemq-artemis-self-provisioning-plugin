import { FC, useReducer, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { k8sCreate } from '@openshift-console/dynamic-plugin-sdk';
import { AlertVariant } from '@patternfly/react-core';
import { AddBroker } from './AddBroker.component';
import { AMQBrokerModel, K8sResourceCommon } from '../../utils';
import {
  ArtemisReducerOperations,
  BrokerCreationFormState,
  BrokerCreationFormDispatch,
  newArtemisCRState,
  artemisCrReducer,
} from '../utils';

const AddBrokerPage: FC = () => {
  const history = useHistory();
  const { ns: namespace } = useParams<{ ns?: string }>();

  const defaultNotification = { title: '', variant: AlertVariant.default };
  const initialValues = newArtemisCRState(namespace);

  //states
  const [brokerModel, dispatch] = useReducer(artemisCrReducer, initialValues);
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

  const [prevNamespace, setPrevNamespace] = useState(namespace);
  if (prevNamespace !== namespace) {
    dispatch({
      operation: ArtemisReducerOperations.setNamespace,
      payload: namespace,
    });
    setPrevNamespace(namespace);
  }

  return (
    <BrokerCreationFormState.Provider value={brokerModel}>
      <BrokerCreationFormDispatch.Provider value={dispatch}>
        <AddBroker
          namespace={namespace}
          notification={notification}
          onCreateBroker={k8sCreateBroker}
        />
      </BrokerCreationFormDispatch.Provider>
    </BrokerCreationFormState.Provider>
  );
};

export default AddBrokerPage;
