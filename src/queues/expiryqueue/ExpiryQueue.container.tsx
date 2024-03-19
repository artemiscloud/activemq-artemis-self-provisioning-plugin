import { FC, useEffect, useState } from 'react';
import { ExpiryQueues } from './ExpiryQueue.component';
import { useGetExpiryQueueAttributes } from './expiryqueue-jolokia';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { K8sResourceCommon } from '../../utils';
import { QueuesContainerProps } from '../Queues.container';

export type ExpiryQueue = {
  attribute: string;
  value: number;
};

const ExpiryQueueContainer: FC<QueuesContainerProps> = ({ brokerDetails }) => {
  const adminUser = 'admin';
  const adminPassword = 'admin';

  const [queueData, setQueueData] = useState<ExpiryQueue[]>([]);
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
            const response = await useGetExpiryQueueAttributes(
              adminUser,
              adminPassword,
              hostName,
            );
            console.log('Response from Jolokia:', response);
            const formattedData: ExpiryQueue[] = [
              {
                attribute: response.value[0],
                value: response.timestamp,
              },
              {
                attribute: response.value[1],
                value: response.timestamp,
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

  return (
    <ExpiryQueues
      expiryQueueData={queueData}
      isLoaded={true}
      loadError={null}
    />
  );
};

export { ExpiryQueueContainer };
