import { FC, useEffect, useState } from 'react';
import { Queues } from './Queues.component';
import { useGetQueues } from '../brokers/broker-details/artemis-jolokia';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { K8sResourceCommon } from '../utils';

export type Queue = {
  status: number;
  timestamp: number;
  agent: string;
};
interface QueuesContainerProps {
  brokerDetails: K8sResourceCommon;
}

const QueuesContainer: FC<QueuesContainerProps> = ({ brokerDetails }) => {
  const adminUser = 'admin';
  const adminPassword = 'admin';

  const [queueData, setQueueData] = useState<Queue[]>([]);
  const [routes, routesLoaded, routesLoadError] = useK8sWatchResource<
    K8sResourceCommon[]
  >({
    isList: true,
    groupVersionKind: {
      group: 'route.openshift.io',
      kind: 'Route',
      version: 'v1',
    },
    namespaced: true,
  });
  const getQueues = useGetQueues(adminUser, adminPassword, routes);

  const getQueueData = async () => {
    //setIsLoading(true);

    const response = await getQueues;
    console.log('Response from Jolokia:', response);
    const formattedData: Queue[] = [
      {
        status: response.status,
        timestamp: response.timestamp,
        agent: response.value.agent,
      },
    ];
    setQueueData(formattedData);
  };

  useEffect(() => {
    getQueueData();
  }, []);
  // TODO: replace hardcoded value with real data
  return <Queues queueData={queueData} isLoaded={true} loadError={null} />;
};

export { QueuesContainer };
