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

  useEffect(() => {
    if (routesLoaded && !routesLoadError) {
      const filteredRoutes = routes.filter((route) =>
        route.metadata.ownerReferences?.some(
          (ref) =>
            ref.name === brokerDetails.metadata.name &&
            ref.kind === 'ActiveMQArtemis',
        ),
      );
      const route = filteredRoutes.length > 0 ? filteredRoutes[0] : null;
      const hostName = route?.spec.host;
      console.log('Host Name:', hostName);

      const getQueueData = async () => {
        try {
          if (hostName) {
            const response = await useGetQueues(
              adminUser,
              adminPassword,
              hostName,
            );
            console.log('Response from Jolokia:', response);
            const formattedData: Queue[] = [
              {
                status: response.status,
                timestamp: response.timestamp,
                agent: response.value.agent,
              },
            ];
            setQueueData(formattedData);
          }
        } catch (error) {
          console.error('Error from Jolokia:', error);
        }
      };
      getQueueData();
    }
  }, [brokerDetails, routesLoaded, routes, routesLoadError]);

  return <Queues queueData={queueData} isLoaded={true} loadError={null} />;
};

export { QueuesContainer };
