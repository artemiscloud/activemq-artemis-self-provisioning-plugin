import { FC, useReducer, useState } from 'react';
import { k8sCreate } from '@openshift-console/dynamic-plugin-sdk';
import { AlertVariant } from '@patternfly/react-core';
import { AddBroker } from './AddBroker.component';
import { AMQBrokerModel } from '../../k8s/models';
import { BrokerCR } from '../../k8s/types';
import {
  BrokerCreationFormState,
  BrokerCreationFormDispatch,
  newArtemisCRState,
  artemisCrReducer,
  ArtemisReducerOperations,
} from '../../reducers/7.12/reducer';
import { AddBrokerResourceValues } from '../../reducers/7.12/import-types';
import { useNavigate, useParams } from 'react-router-dom-v5-compat';

export interface AddBrokerProps {
  initialValues: AddBrokerResourceValues;
}

export const AddBrokerPage: FC = () => {
  const navigate = useNavigate();
  const { ns: namespace } = useParams<{ ns?: string }>();

  const defaultNotification = { title: '', variant: AlertVariant.default };

  const initialValues = newArtemisCRState(namespace);

  //states
  const [brokerModel, dispatch] = useReducer(artemisCrReducer, initialValues);
  const [notification, setNotification] = useState(defaultNotification);

  const handleRedirect = () => {
    navigate('/k8s/all-namespaces/brokers');
  };

  const k8sCreateBroker = (content: BrokerCR) => {
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
