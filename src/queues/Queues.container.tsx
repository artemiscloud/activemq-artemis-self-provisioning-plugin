import { FC, useEffect, useState } from 'react';
import { Queues } from './Queues.component';
import { useGetQueues } from '../brokers/broker-details/artemis-jolokia';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { K8sResourceCommon } from '../utils';

export type Queue = {
  name: string;
  routingType: string;
  messageCount: number;
  durable: boolean;
  autoDelete: boolean;
};
export interface QueuesContainerProps {
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
            const nestedObject =
              response.value[
                'org.apache.activemq.artemis:address="ExpiryQueue",broker="amq-broker",component=addresses,queue="ExpiryQueue",routing-type="anycast",subcomponent=queues'
              ];
            const formattedData: Queue[] = [
              {
                name: nestedObject.Name,
                routingType: nestedObject.RoutingType,
                messageCount: nestedObject.MessageCount,
                durable: nestedObject.Durable,
                autoDelete: nestedObject.AutoDelete,
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
