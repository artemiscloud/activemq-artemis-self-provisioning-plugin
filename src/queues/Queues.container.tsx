import { FC, useEffect, useState } from 'react';
import { Queues } from './Queues.component';
import { useGetQueues } from '../brokers/broker-details/artemis-jolokia';
// export interface QueuesContainerProps {
//   // TODO:add any prop if requried in future
// }

export type Queue = {
  status: number;
  timestamp: number;
  agent: string;
};

const QueuesContainer: FC = () => {
  const adminUser = 'admin';
  const adminPassword = 'admin';

  // TODO:need to add real loading state after connection with real api
  // TODO:need to add error state after connection with real api
  //const [isLoading, setIsLoading] = useState<boolean>(false);
  //const [error, setError] = useState<boolean>(false);
  const [queueData, setQueueData] = useState<Queue[]>([]);

  const getQueues = useGetQueues(adminUser, adminPassword);

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
    //setIsLoading(false);

    //setIsLoading(false);
    //setError(true);
    // console.log('Error fetching queue data.', error);
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
  return <Queues queueData={queueData} isLoaded={true} loadError={null} />;
};

export { QueuesContainer };
