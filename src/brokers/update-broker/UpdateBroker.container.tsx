import { FC, useState, useEffect, useReducer } from 'react';
import { k8sGet, k8sUpdate } from '@openshift-console/dynamic-plugin-sdk';
import { Alert, AlertVariant } from '@patternfly/react-core';
import { AddBroker } from '../add-broker/AddBroker.component';
import { Loading } from '@app/shared-components/Loading/Loading';
import { AMQBrokerModel } from '@app/k8s/models';
import { BrokerCR } from '@app/k8s/types';
import { useGetIngressDomain } from '@app/k8s/customHooks';
import {
  ArtemisReducerOperations,
  BrokerCreationFormDispatch,
  BrokerCreationFormState,
  artemisCrReducer,
  getArtemisCRState,
} from '@app/reducers/7.12/reducer';
import { useNavigate, useParams } from 'react-router-dom-v5-compat';

export const UpdateBrokerPage: FC = () => {
  const navigate = useNavigate();
  const { ns: namespace, name } = useParams<{ ns?: string; name?: string }>();

  //states
  const [loadingBrokerCR, setLoading] = useState<boolean>(false);

  const crState = getArtemisCRState(name, namespace);

  const [brokerModel, dispatch] = useReducer(artemisCrReducer, crState);

  const [hasBrokerUpdated, setHasBrokerUpdated] = useState(false);
  const [alert, setAlert] = useState('');
  const params = new URLSearchParams(location.search);
  const returnUrl = params.get('returnUrl') || '/k8s/all-namespaces/brokers';
  const handleRedirect = () => {
    navigate(returnUrl);
  };
  const k8sUpdateBroker = (content: BrokerCR) => {
    k8sUpdate({
      model: AMQBrokerModel,
      data: content,
      ns: namespace,
      name: name,
    })
      .then(
        () => {
          setAlert('');
          setHasBrokerUpdated(true);
        },
        (reason: Error) => {
          setAlert(reason.message);
        },
      )
      .catch((e: Error) => {
        setAlert(e.message);
      });
  };

  const k8sGetBroker = () => {
    setLoading(true);
    k8sGet({ model: AMQBrokerModel, name, ns: namespace })
      .then((broker: BrokerCR) => {
        dispatch({
          operation: ArtemisReducerOperations.setModel,
          payload: { model: broker, isSetByUser: false },
        });
      })
      .catch((e) => {
        setAlert(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (name) k8sGetBroker();
  }, [name]);

  const { clusterDomain, isLoading: isLoadingClusterDomain } =
    useGetIngressDomain();
  const [isDomainSet, setIsDomainSet] = useState(false);
  if (!loadingBrokerCR && !isLoadingClusterDomain && !isDomainSet) {
    dispatch({
      operation: ArtemisReducerOperations.setIngressDomain,
      payload: {
        ingressUrl: clusterDomain,
        isSetByUser: false,
      },
    });
    setIsDomainSet(true);
  }

  if (loadingBrokerCR && !alert) return <Loading />;

  if (!brokerModel.cr.spec?.deploymentPlan) {
    return <Loading />;
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
          onSubmit={() => k8sUpdateBroker(brokerModel.cr)}
          onCancel={handleRedirect}
          isUpdatingExisting
          reloadExisting={k8sGetBroker}
        />
      </BrokerCreationFormDispatch.Provider>
    </BrokerCreationFormState.Provider>
  );
};
