import { useEffect, useState, FC } from 'react';
import { useHistory } from 'react-router-dom';
import {
  k8sListItems,
} from '@openshift-console/dynamic-plugin-sdk';
import { AMQBrokerModel, K8sResourceKind } from '../../utils';
import { Loading } from '../../shared-components';
import { Brokers, Broker, Status } from './brokers.component';

const BrokersContainer: FC = () => {
  const history = useHistory();

  const [brokers, setBrokers] = useState<Broker[]>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    k8sListItems<K8sResourceKind>({model: AMQBrokerModel, queryParams:{}})
      .then((res) => {
        const brokers = res?.map((br) => ({
          name: br.metadata.name,
          status: 'Active' as Status,
          size: br?.spec?.deploymentPlan?.size,
          created: br.metadata.creationTimestamp,
        }));

        setBrokers(brokers);
      })
      .catch(() => {
        console.error('Brokers not found');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const onClickCreateBorker = () => {
    history.push(`add-broker`);
  };

  if (loading) return <Loading />;

  return (
    <Brokers brokers={brokers} onClickCreateBorker={onClickCreateBorker} />
  );
};

export default BrokersContainer;
