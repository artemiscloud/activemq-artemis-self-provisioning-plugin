import { FC, useReducer, useState } from 'react';
import { k8sCreate } from '@openshift-console/dynamic-plugin-sdk';
import { Alert, AlertVariant } from '@patternfly/react-core';
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
import { useGetIngressDomain } from '../../k8s/customHooks';

export interface AddBrokerProps {
  initialValues: AddBrokerResourceValues;
}

export const AddBrokerPage: FC = () => {
  const navigate = useNavigate();
  const { ns: namespace } = useParams<{ ns?: string }>();

  const initialValues = newArtemisCRState(namespace);

  //states
  const [brokerModel, dispatch] = useReducer(artemisCrReducer, initialValues);

  const params = new URLSearchParams(location.search);
  const returnUrl = params.get('returnUrl') || '/k8s/all-namespaces/brokers';
  const handleRedirect = () => {
    navigate(returnUrl);
  };

  const [hasBrokerUpdated, setHasBrokerUpdated] = useState(false);
  const [alert, setAlert] = useState('');
  const k8sCreateBroker = (content: BrokerCR) => {
    k8sCreate({ model: AMQBrokerModel, data: content })
      .then(
        () => {
          setAlert('');
          setHasBrokerUpdated(true);
        },
        (reason: Error) => {
          setAlert(reason.message);
        },
      )
      .catch((e) => {
        setAlert(e.message);
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

  const { clusterDomain, isLoading } = useGetIngressDomain();
  const [isDomainSet, setIsDomainSet] = useState(false);
  if (!isLoading && !isDomainSet) {
    dispatch({
      operation: ArtemisReducerOperations.setIngressDomain,
      payload: {
        ingressUrl: clusterDomain,
        isSetByUser: false,
      },
    });
    setIsDomainSet(true);
  }

  if (hasBrokerUpdated && alert === '') {
    handleRedirect();
  }

  return (
    <BrokerCreationFormState.Provider value={brokerModel}>
      <BrokerCreationFormDispatch.Provider value={dispatch}>
        {alert !== '' && (
          <Alert
            title={alert}
            variant={AlertVariant.danger}
            isInline
            actionClose
            className="pf-u-mt-md pf-u-mx-md"
          />
        )}
        <AddBroker
          onSubmit={() => k8sCreateBroker(brokerModel.cr)}
          onCancel={handleRedirect}
        />
      </BrokerCreationFormDispatch.Provider>
    </BrokerCreationFormState.Provider>
  );
};
