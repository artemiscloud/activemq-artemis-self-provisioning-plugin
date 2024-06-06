import { FC, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { k8sGet, k8sUpdate } from '@openshift-console/dynamic-plugin-sdk';
import { AlertVariant } from '@patternfly/react-core';
import { AddBroker } from '../add-broker/AddBroker.component';
import { Loading } from '../../shared-components';
import { AMQBrokerModel, K8sResourceCommon } from '../../utils';
import { BrokerCreationFormState, EditorType } from '../utils/add-broker';

const UpdateBrokerPage: FC = () => {
  const { ns: namespace, name } = useParams<{ ns?: string; name?: string }>();
  const defaultNotification = { title: '', variant: AlertVariant.default };

  //states
  const [notification, setNotification] = useState(defaultNotification);
  const [initialBrokerValue, setInitialBrokerValue] =
    useState<K8sResourceCommon>({});
  const [loading, setLoading] = useState<boolean>(false);

  const k8sUpdateBroker = (content: K8sResourceCommon) => {
    k8sUpdate({ model: AMQBrokerModel, data: content })
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
        console.error(e);
      });
  };

  const k8sGetBroker = () => {
    setLoading(true);
    k8sGet({ model: AMQBrokerModel, name, ns: namespace })
      .then((broker: K8sResourceCommon) => {
        setInitialBrokerValue(broker);
      })
      .catch((e) => {
        setNotification({ title: e.message, variant: AlertVariant.danger });
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (name) k8sGetBroker();
  }, [name]);

  if (loading && !notification.title) return <Loading />;

  return (
    <BrokerCreationFormState.Provider
      value={{ cr: initialBrokerValue, editorType: EditorType.YAML }}
    >
      <AddBroker
        namespace={namespace}
        notification={notification}
        onCreateBroker={k8sUpdateBroker}
        isEditWorkFlow={true}
      />
    </BrokerCreationFormState.Provider>
  );
};

export default UpdateBrokerPage;
