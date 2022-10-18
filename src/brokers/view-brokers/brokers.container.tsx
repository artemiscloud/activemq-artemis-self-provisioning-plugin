import { useEffect, useState, FC } from 'react';
import {
  K8sResourceCommon,
  k8sListItems,
} from '@openshift-console/dynamic-plugin-sdk';
import { BrokerModel } from '../../k8s';
import { Loading } from '../../shared-components';
import { Brokers, Broker, Status } from './brokers.component';

export type K8sResourceBroker = K8sResourceCommon & {
  spec: {
    deploymentPlan: {
      size: number;
    };
  };
};

const BrokersContainer: FC = () => {
  const [brokers, setBrokers] = useState<Broker[]>();
  const [loading, setLoading] = useState<boolean>(false);

  const OptionsList = {
    model: BrokerModel,
    queryParams: {},
    requestInit: {},
  };

  useEffect(() => {
    setLoading(true);
    k8sListItems<K8sResourceBroker>(OptionsList)
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

  if (loading) return <Loading />;

  return <Brokers brokers={brokers} />;
};

export default BrokersContainer;
