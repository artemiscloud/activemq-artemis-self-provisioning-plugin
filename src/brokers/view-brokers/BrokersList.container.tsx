import { useEffect, useState, FC } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { k8sListItems, k8sDelete } from '@openshift-console/dynamic-plugin-sdk';
import {
  AMQBrokerModel,
  K8sResourceKind,
  K8sResourceCommon,
} from '../../utils';
import { BrokersList } from './components/BrokersList';

export type BrokersContainerProps = RouteComponentProps<{ ns?: string }>;

const BrokersContainer: FC<BrokersContainerProps> = ({ match }) => {
  const history = useHistory();
  const namespace = match.params.ns;
  //states
  const [brokers, setBrokers] = useState<K8sResourceKind[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<any>();

  const fetchk8sListItems = () => {
    setLoading(false);
    k8sListItems<K8sResourceKind>({
      model: AMQBrokerModel,
      queryParams: { ns: namespace },
    })
      .then((brokers) => {
        setBrokers(brokers);
      })
      .catch((e) => {
        setLoadError(e.message);
        console.error('Brokers not found');
      })
      .finally(() => {
        setLoading(true);
      });
  };

  useEffect(() => {
    fetchk8sListItems();
  }, [namespace]);

  const onEditBroker = (broker: K8sResourceCommon) => {
    const namespace = broker.metadata.namespace;
    const name = broker.metadata.name;
    history.push(`/k8s/ns/${namespace}/edit-broker/${name}`);
  };

  const onDeleteBroker = (broker: K8sResourceCommon) => {
    k8sDelete({
      model: AMQBrokerModel,
      resource: { ...broker },
    })
      .then((res) => {
        fetchk8sListItems();
        console.log(res);
      })
      .catch((e) => {
        setLoadError(e.message);
      });
  };

  return (
    <BrokersList
      brokers={brokers}
      loadError={loadError}
      loaded={loading}
      onDeleteBroker={onDeleteBroker}
      onEditBroker={onEditBroker}
    />
  );
};

export default BrokersContainer;
