import { FC, useEffect, useState } from 'react';
import { Queues } from './Queues.component';
import { useGetQueues } from '../brokers/broker-details/artemis-jolokia';
// export interface QueuesContainerProps {
//   // TODO:add any prop if requried in future
// }

export type Queue = {
  name: string;
  routingType: string; // this maybe an enum
  autoCreateQueues: boolean;
  autoDeleteQueues: boolean;
  created: Date;
};

const QueuesContainer: FC = () => {
  const adminUser = 'admin';
  const adminPassword = 'admin';

  // TODO:need to add real loading state after connection with real api
  // TODO:need to add error state after connection with real api
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [queueData, setQueueData] = useState<Queue[]>([]);

  const getQueues = useGetQueues(adminUser, adminPassword);

  const getQueueData = async () => {
    setIsLoading(true);
    try {
      const response = await getQueues;
      console.log('Response from Jolokia:', response);
      // const parsedResponse = JSON.parse(response.value);
      setQueueData(response);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(true);
      console.log('Error fetching queue data.', error);
    }
  };
  // TODO:make the real api call(using mock data now)
  //   setQueueData([
  //     {
  //       name: 'jobs',
  //       routingType: 'Anycast',
  //       autoCreateQueues: true,
  //       autoDeleteQueues: true,
  //       created: new Date('Thu Mar 16 2023 12:05:22'),
  //     },
  //     {
  //       name: 'commands',
  //       routingType: 'Multicast',
  //       autoCreateQueues: false,
  //       autoDeleteQueues: false,
  //       created: new Date('Thu Mar 16 2023 12:05:22'),
  //     },
  //   ]);
  // };
  useEffect(() => {
    getQueueData();
  }, []);
  // TODO: replace hardcoded value with real data
  return (
    <Queues queueData={queueData} isLoaded={!isLoading} loadError={error} />
  );
};

export { QueuesContainer };
