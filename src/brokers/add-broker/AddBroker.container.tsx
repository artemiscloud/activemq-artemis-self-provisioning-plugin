import { FC, useReducer, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { k8sCreate } from '@openshift-console/dynamic-plugin-sdk';
import { AlertVariant } from '@patternfly/react-core';
import { AddBroker } from './AddBroker.component';
import { AMQBrokerModel, K8sResourceCommon } from '../../utils';
import {
  BrokerCreationFormState,
  BrokerCreationFormDispatch,
  newArtemisCRState,
  artemisCrReducer,
  AddBrokerResourceValues,
  ArtemisReducerOperations,
} from '../utils';

export interface AddBrokerProps {
  initialValues: AddBrokerResourceValues;
}

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
          notification={notification}
          onCreateBroker={k8sCreateBroker}
          isUpdate={false}
        />
      </BrokerCreationFormDispatch.Provider>
    </BrokerCreationFormState.Provider>
  );
};

export default AddBrokerPage;
