import { FC, useState, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { k8sGet, k8sUpdate } from '@openshift-console/dynamic-plugin-sdk';
import { AlertVariant } from '@patternfly/react-core';
import { AddBroker } from '../add-broker/AddBroker.component';
import { Loading } from '../../shared-components';
import { AMQBrokerModel, K8sResourceCommon } from '../../utils';
import {
  ArtemisReducerOperations,
  BrokerCreationFormDispatch,
  BrokerCreationFormState,
  artemisCrReducer,
  getArtemisCRState,
} from '../utils/add-broker';

const UpdateBrokerPage: FC = () => {
  const { ns: namespace, name } = useParams<{ ns?: string; name?: string }>();
  const defaultNotification = { title: '', variant: AlertVariant.default };

  //states
  const [notification, setNotification] = useState(defaultNotification);
  const [loading, setLoading] = useState<boolean>(false);

  const crState = getArtemisCRState(name, namespace);

  const [brokerModel, dispatch] = useReducer(artemisCrReducer, crState);

  const k8sUpdateBroker = (content: K8sResourceCommon) => {
    k8sUpdate({
      model: AMQBrokerModel,
      data: content,
      ns: namespace,
      name: name,
    })
      .then((response: K8sResourceCommon) => {
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
      .then((broker: K8sResourceCommon) => {
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

  if (loading && !notification.title) return <Loading />;

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

export default UpdateBrokerPage;
