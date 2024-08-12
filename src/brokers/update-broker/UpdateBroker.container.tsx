import { FC, useState, useEffect, useReducer } from 'react';
import { k8sGet, k8sUpdate } from '@openshift-console/dynamic-plugin-sdk';
import { AlertVariant } from '@patternfly/react-core';
import { AddBroker } from '../add-broker/AddBroker.component';
import { Loading } from '../../shared-components/Loading/Loading';
import { AMQBrokerModel } from '../../k8s/models';
import { BrokerCR } from '../../k8s/types';
import { UseGetIngressDomain } from '../../k8s/customHooks';
import {
  ArtemisReducerOperations,
  BrokerCreationFormDispatch,
  BrokerCreationFormState,
  artemisCrReducer,
  getArtemisCRState,
} from '../../reducers/7.12/reducer';
import { useParams } from 'react-router-dom-v5-compat';

export const UpdateBrokerPage: FC = () => {
  const { ns: namespace, name } = useParams<{ ns?: string; name?: string }>();
  const defaultNotification = { title: '', variant: AlertVariant.default };

  //states
  const [notification, setNotification] = useState(defaultNotification);
  const [loadingBrokerCR, setLoading] = useState<boolean>(false);

  const crState = getArtemisCRState(name, namespace);

  const [brokerModel, dispatch] = useReducer(artemisCrReducer, crState);

  const k8sUpdateBroker = (content: BrokerCR) => {
    k8sUpdate({
      model: AMQBrokerModel,
      data: content,
      ns: namespace,
      name: name,
    })
      .then((response: BrokerCR) => {
        const name = response.metadata.name;
        const resourceVersion = response.metadata.resourceVersion;
        setNotification({
          title: `${name} has been updated to version ${resourceVersion}`,
          variant: AlertVariant.success,
        });
      })
      .catch((e) => {
        setNotification({ title: e.message, variant: AlertVariant.danger });
      });
  };

  const k8sGetBroker = () => {
    setLoading(true);
    k8sGet({ model: AMQBrokerModel, name, ns: namespace })
      .then((broker: BrokerCR) => {
        dispatch({
          operation: ArtemisReducerOperations.setModel,
          payload: {
            model: broker,
          },
        });
      })
      .catch((e) => {
        setNotification({ title: e.message, variant: AlertVariant.danger });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (name) k8sGetBroker();
  }, [name]);

  const { clusterDomain, isLoading: isLoadingClusterDomain } =
    UseGetIngressDomain();
  const [isDomainSet, setIsDomainSet] = useState(false);
  if (!loadingBrokerCR && !isLoadingClusterDomain && !isDomainSet) {
    dispatch({
      operation: ArtemisReducerOperations.setIngressDomain,
      payload: clusterDomain,
    });
    setIsDomainSet(true);
  }

  if (loadingBrokerCR && !notification.title) return <Loading />;

  if (!brokerModel.cr.spec?.deploymentPlan) {
    return <Loading />;
  }

  return (
    <BrokerCreationFormState.Provider value={brokerModel}>
      <BrokerCreationFormDispatch.Provider value={dispatch}>
        <AddBroker
          notification={notification}
          onCreateBroker={k8sUpdateBroker}
          isUpdate={true}
        />
      </BrokerCreationFormDispatch.Provider>
    </BrokerCreationFormState.Provider>
  );
};
